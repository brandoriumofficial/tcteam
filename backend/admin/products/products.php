<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database connection
include_once '../../database/db.php';

class ProductAPI {
    private $conn;
    private $table_products = "products";
    private $table_description_tabs = "product_description_tabs";
    private $table_faqs = "product_faqs";
    private $table_gallery = "product_gallery";
    private $table_reviews = "product_reviews";
    private $table_variations = "product_variations";
    private $upload_dir = "../../uploads/products/";
    
    // Allowed file types
    private $allowed_image_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    private $allowed_video_types = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    private $max_file_size = 52428800; // 50MB

    public function __construct() {
        global $conn;
        
        if (!$conn || $conn->connect_error) {
            die(json_encode(["success" => false, "message" => "Database connection failed"]));
        }
        
        $this->conn = $conn;
        
        // Create uploads directory if not exists
        if (!file_exists($this->upload_dir)) {
            mkdir($this->upload_dir, 0777, true);
        }
    }

    // Main router
    public function processRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = isset($_GET['action']) ? $_GET['action'] : '';

        // Handle preflight request
        if ($method == 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        switch($method) {
            case 'GET':
                $this->handleGetRequest($action);
                break;
            case 'POST':
                $this->handlePostRequest($action);
                break;
            case 'PUT':
                $this->handlePutRequest($action);
                break;
            case 'DELETE':
                $this->handleDeleteRequest($action);
                break;
            default:
                http_response_code(405);
                echo json_encode(["success" => false, "message" => "Method not allowed"]);
        }
    }

    // ========== GET REQUESTS ==========
    private function handleGetRequest($action) {
        switch($action) {
            case 'get_product':
                $this->getProduct();
                break;
            case 'get_products':
                $this->getProducts();
                break;
            case 'get_categories':
                $this->getCategories();
                break;
            case 'get_brands':
                $this->getBrands();
                break;
            case 'get_media':
                $this->getMedia();
                break;
            case 'get_reviews':
                $this->getProductReviews();
                break;
            default:
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid action"]);
        }
    }

    private function getProduct() {
        if (!isset($_GET['id'])) {
            echo json_encode(["success" => false, "message" => "Product ID is required"]);
            return;
        }

        $product_id = (int)$_GET['id'];
        
        try {
            // Get main product data
            $query = "SELECT * FROM " . $this->table_products . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result->fetch_assoc();

            if (!$product) {
                echo json_encode(["success" => false, "message" => "Product not found"]);
                return;
            }

            // Get description tabs
            $description_tabs = $this->getDescriptionTabs($product_id);
            
            // Get FAQs
            $faqs = $this->getFAQs($product_id);
            
            // Get gallery items
            $gallery = $this->getGallery($product_id);
            
            // Get variations
            $variations = $this->getVariations($product_id);
            
            // Get reviews
            $reviews = $this->getReviews($product_id);

            // Decode JSON fields
            $product['category'] = json_decode($product['category'], true) ?: [];
            $product['tags'] = $product['tags'] ? explode(',', $product['tags']) : [];
            
            // Calculate rating
            $total_rating = 0;
            $review_count = count($reviews);
            if ($review_count > 0) {
                foreach($reviews as $review) {
                    $total_rating += $review['rating'];
                }
                $product['rating'] = round($total_rating / $review_count, 2);
            } else {
                $product['rating'] = 0;
            }
            $product['review_count'] = $review_count;

            // Combine all data
            $product_data = array_merge($product, [
                'description_tabs' => $description_tabs,
                'faqs' => $faqs,
                'gallery' => $gallery,
                'variations' => $variations,
                'reviews' => $reviews
            ]);

            echo json_encode([
                "success" => true,
                "data" => $product_data
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    private function getProducts() {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;
        
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        $brand = isset($_GET['brand']) ? $_GET['brand'] : '';
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        $search = isset($_GET['search']) ? $_GET['search'] : '';

        try {
            // Build WHERE clause
            $where_clauses = [];
            $params = [];
            $types = "";

            if ($category) {
                $where_clauses[] = "category LIKE ?";
                $params[] = '%' . $category . '%';
                $types .= "s";
            }
            
            if ($brand) {
                $where_clauses[] = "brand = ?";
                $params[] = $brand;
                $types .= "s";
            }
            
            if ($status) {
                $where_clauses[] = "status = ?";
                $params[] = $status;
                $types .= "s";
            }
            
            if ($search) {
                $where_clauses[] = "(name LIKE ? OR sku LIKE ? OR short_description LIKE ?)";
                $search_term = "%{$search}%";
                $params[] = $search_term;
                $params[] = $search_term;
                $params[] = $search_term;
                $types .= "sss";
            }

            $where_sql = $where_clauses ? "WHERE " . implode(" AND ", $where_clauses) : "";

            // Get total count
            $count_query = "SELECT COUNT(*) as total FROM " . $this->table_products . " $where_sql";
            $count_stmt = $this->conn->prepare($count_query);
            if ($params) {
                $count_stmt->bind_param($types, ...$params);
            }
            $count_stmt->execute();
            $count_result = $count_stmt->get_result();
            $total_row = $count_result->fetch_assoc();
            $total = $total_row['total'];

            // Get products with pagination
            $query = "SELECT * FROM " . $this->table_products . " 
                     $where_sql 
                     ORDER BY created_at DESC 
                     LIMIT ? OFFSET ?";
            
            $params[] = $limit;
            $params[] = $offset;
            $types .= "ii";
            
            $stmt = $this->conn->prepare($query);
            if ($params) {
                $stmt->bind_param($types, ...$params);
            }
            $stmt->execute();
            $result = $stmt->get_result();
            $products = [];
            while($row = $result->fetch_assoc()) {
                $products[] = $row;
            }

            // Process each product
            foreach($products as &$product) {
                $product['category'] = json_decode($product['category'], true) ?: [];
                $product['tags'] = $product['tags'] ? explode(',', $product['tags']) : [];
                
                // Get gallery for thumbnail
                $gallery_query = "SELECT media_url FROM " . $this->table_gallery . " 
                                WHERE product_id = ? AND media_type = 'image' 
                                ORDER BY media_order LIMIT 1";
                $gallery_stmt = $this->conn->prepare($gallery_query);
                $gallery_stmt->bind_param("i", $product['id']);
                $gallery_stmt->execute();
                $gallery_result = $gallery_stmt->get_result();
                $gallery = $gallery_result->fetch_assoc();
                $product['thumbnail'] = $gallery ? $gallery['media_url'] : $product['feature_image'];
                
                // Get review stats
                $review_query = "SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM " . $this->table_reviews . " 
                               WHERE product_id = ? AND status = 'approved'";
                $review_stmt = $this->conn->prepare($review_query);
                $review_stmt->bind_param("i", $product['id']);
                $review_stmt->execute();
                $review_result = $review_stmt->get_result();
                $review_stats = $review_result->fetch_assoc();
                $product['review_count'] = $review_stats['count'] ?? 0;
                $product['rating'] = round($review_stats['avg_rating'] ?? 0, 2);
            }

            echo json_encode([
                "success" => true,
                "data" => $products,
                "total" => $total,
                "page" => $page,
                "limit" => $limit,
                "total_pages" => ceil($total / $limit)
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

   private function getCategories() {
    try {
        $query = "
            SELECT id, name 
            FROM categories 
            ORDER BY name ASC
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();

        $category_list = [];

        while ($row = $result->fetch_assoc()) {
            $category_list[] = [
                "id" => (int)$row['id'],     // backend use
                "name" => $row['name']      // frontend display
            ];
        }

        echo json_encode([
            "success" => true,
            "data" => $category_list
        ]);

    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
}


    private function getBrands() {
        try {
            $query = "SELECT DISTINCT brand as name FROM " . $this->table_products . " WHERE brand IS NOT NULL AND brand != '' ORDER BY brand";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $brand_list = [];
            $index = 1;
            while($row = $result->fetch_assoc()) {
                $brand_list[] = [
                    'id' => $index++,
                    'name' => $row['name']
                ];
            }
            
            echo json_encode([
                "success" => true,
                "data" => $brand_list
            ]);
            
        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    private function getMedia() {
        if (!isset($_GET['product_id'])) {
            echo json_encode(["success" => false, "message" => "Product ID is required"]);
            return;
        }

        $product_id = (int)$_GET['product_id'];
        
        try {
            $query = "SELECT * FROM " . $this->table_gallery . " WHERE product_id = ? ORDER BY media_order ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $media = [];
            while($row = $result->fetch_assoc()) {
                $media[] = $row;
            }
            
            echo json_encode([
                "success" => true,
                "data" => $media
            ]);
            
        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    private function getProductReviews() {
        if (!isset($_GET['product_id'])) {
            echo json_encode(["success" => false, "message" => "Product ID is required"]);
            return;
        }

        $product_id = (int)$_GET['product_id'];
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;
        $status = isset($_GET['status']) ? $_GET['status'] : 'approved';

        try {
            // Get total count
            $count_query = "SELECT COUNT(*) as total FROM " . $this->table_reviews . " WHERE product_id = ? AND status = ?";
            $count_stmt = $this->conn->prepare($count_query);
            $count_stmt->bind_param("is", $product_id, $status);
            $count_stmt->execute();
            $count_result = $count_stmt->get_result();
            $total_row = $count_result->fetch_assoc();
            $total = $total_row['total'];

            // Get reviews
            $query = "SELECT * FROM " . $this->table_reviews . " 
                     WHERE product_id = ? AND status = ? 
                     ORDER BY created_at DESC 
                     LIMIT ? OFFSET ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("isii", $product_id, $status, $limit, $offset);
            $stmt->execute();
            $result = $stmt->get_result();
            $reviews = [];
            while($row = $result->fetch_assoc()) {
                $reviews[] = $row;
            }

            echo json_encode([
                "success" => true,
                "data" => $reviews,
                "total" => $total,
                "page" => $page,
                "limit" => $limit
            ]);
            
        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Helper methods
    private function getDescriptionTabs($product_id) {
        $query = "SELECT * FROM " . $this->table_description_tabs . " 
                 WHERE product_id = ? AND is_active = 1 
                 ORDER BY tab_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $tabs = [];
        while($row = $result->fetch_assoc()) {
            $tabs[] = $row;
        }
        return $tabs;
    }

    private function getFAQs($product_id) {
        $query = "SELECT * FROM " . $this->table_faqs . " 
                 WHERE product_id = ? AND is_active = 1 
                 ORDER BY faq_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $faqs = [];
        while($row = $result->fetch_assoc()) {
            $faqs[] = $row;
        }
        return $faqs;
    }

    private function getGallery($product_id) {
        $query = "SELECT * FROM " . $this->table_gallery . " 
                 WHERE product_id = ? 
                 ORDER BY media_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $gallery = [];
        while($row = $result->fetch_assoc()) {
            $gallery[] = $row;
        }
        return $gallery;
    }

    private function getVariations($product_id) {
        $query = "SELECT * FROM " . $this->table_variations . " 
                 WHERE product_id = ? 
                 ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $variations = [];
        while($row = $result->fetch_assoc()) {
            $variations[] = $row;
        }
        return $variations;
    }

    private function getReviews($product_id) {
        $query = "SELECT * FROM " . $this->table_reviews . " 
                 WHERE product_id = ? AND status = 'approved'
                 ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $reviews = [];
        while($row = $result->fetch_assoc()) {
            $reviews[] = $row;
        }
        return $reviews;
    }

    // ========== POST REQUESTS ==========
    private function handlePostRequest($action) {
        switch($action) {
            case 'save_product':
                $this->saveProduct();
                break;
            case 'upload_file':
                $this->uploadFile();
                break;
            case 'upload_multiple':
                $this->uploadMultipleFiles();
                break;
            case 'add_review':
                $this->addReview();
                break;
            case 'update_media_order':
                $this->updateMediaOrder();
                break;
            default:
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid action"]);
        }
    }

    private function saveProduct() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            $data = $_POST;
        }

        if (empty($data['name'])) {
            echo json_encode(["success" => false, "message" => "Product name is required"]);
            return;
        }

        try {
            $this->conn->begin_transaction();

            $product_id = isset($data['id']) && $data['id'] > 0 ? (int)$data['id'] : 0;
            
            if ($product_id > 0) {
                $result = $this->updateProduct($product_id, $data);
            } else {
                $result = $this->createProduct($data);
                $product_id = $result['product_id'];
            }

            // Save related data
            if ($product_id > 0) {
                if (isset($data['descriptionTabs'])) {
                    $this->saveDescriptionTabs($product_id, $data['descriptionTabs']);
                }
                
                if (isset($data['faqs'])) {
                    $this->saveFAQs($product_id, $data['faqs']);
                }
                
                if (isset($data['variations'])) {
                    $this->saveVariations($product_id, $data['variations']);
                }
                
                if (isset($data['gallery'])) {
                    $this->saveGallery($product_id, $data['gallery']);
                }
            }

            $this->conn->commit();

            echo json_encode([
                "success" => true,
                "message" => "Product saved successfully",
                "data" => ["product_id" => $product_id]
            ]);

        } catch(Exception $e) {
            $this->conn->rollback();
            echo json_encode([
                "success" => false, 
                "message" => "Error saving product: " . $e->getMessage()
            ]);
        }
    }

    private function createProduct($data) {
        $slug = $this->generateSlug($data['name'], $data['slug'] ?? '');
        
        $category_json = isset($data['category']) && is_array($data['category']) 
            ? json_encode($data['category']) 
            : json_encode([]);
        
        $tags = isset($data['tags']) ? $data['tags'] : '';
        if (is_array($tags)) {
            $tags = implode(',', $tags);
        }

        $query = "INSERT INTO " . $this->table_products . " 
                  (name, slug, short_description, base_price, sale_price, sku, stock_status, 
                   stock_qty, manage_stock, low_stock_threshold, weight, weight_unit, length, 
                   width, height, dimension_unit, shipping_class, shipping_days, feature_image, 
                   banner_image, side_image, feature_img_alt, seo_title, seo_description, 
                   keywords, meta_robots, seo_score, category, tags, ribbon, badge_color, 
                   brand, status, enable_reviews, offer_type, offer_value, show_countdown, 
                   stock_for_offer, created_at, updated_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
                          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

        $stmt = $this->conn->prepare($query);

        $params = [
            $data['name'] ?? '',
            $slug,
            $data['shortDescription'] ?? $data['short_description'] ?? '',
            isset($data['basePrice']) ? (float)$data['basePrice'] : 0.00,
            isset($data['salePrice']) ? (float)$data['salePrice'] : 0.00,
            $data['sku'] ?? '',
            $data['stockStatus'] ?? $data['stock_status'] ?? 'In Stock',
            isset($data['stockQty']) ? (int)$data['stockQty'] : 0,
            isset($data['manageStock']) ? ($data['manageStock'] ? 1 : 0) : 1,
            isset($data['lowStockThreshold']) ? (int)$data['lowStockThreshold'] : 10,
            isset($data['weight']) ? (float)$data['weight'] : 0.00,
            $data['weightUnit'] ?? $data['weight_unit'] ?? 'kg',
            isset($data['length']) ? (float)$data['length'] : 0.00,
            isset($data['width']) ? (float)$data['width'] : 0.00,
            isset($data['height']) ? (float)$data['height'] : 0.00,
            $data['dimensionUnit'] ?? $data['dimension_unit'] ?? 'cm',
            $data['shippingClass'] ?? $data['shipping_class'] ?? '',
            $data['shippingDays'] ?? $data['shipping_days'] ?? '3-5',
            $data['featureImage'] ?? $data['feature_image'] ?? '',
            $data['bannerImage'] ?? $data['banner_image'] ?? '',
            $data['sideImage'] ?? $data['side_image'] ?? '',
            $data['featureImgAlt'] ?? $data['feature_img_alt'] ?? '',
            $data['seoTitle'] ?? $data['seo_title'] ?? '',
            $data['seoDescription'] ?? $data['seo_description'] ?? '',
            $data['keywords'] ?? '',
            $data['metaRobots'] ?? $data['meta_robots'] ?? 'index, follow',
            isset($data['seoScore']) ? (int)$data['seoScore'] : 0,
            $category_json,
            $tags,
            $data['ribbon'] ?? '',
            $data['badgeColor'] ?? $data['badge_color'] ?? 'bg-red-500',
            $data['brand'] ?? '',
            $data['status'] ?? 'draft',
            isset($data['enableReviews']) ? ($data['enableReviews'] ? 1 : 0) : 1,
            $data['offerType'] ?? $data['offer_type'] ?? '',
            $data['offerValue'] ?? $data['offer_value'] ?? '',
            isset($data['showCountdown']) ? ($data['showCountdown'] ? 1 : 0) : 0,
            isset($data['stockForOffer']) ? (int)$data['stockForOffer'] : 50
        ];

        $stmt->bind_param(
            "sssddsssiidddddsssssssssississsiissi",
            ...$params
        );

        $stmt->execute();
        $product_id = $stmt->insert_id;

        return ['product_id' => $product_id];
    }

    private function updateProduct($product_id, $data) {
        // Check if product exists
        $check_query = "SELECT id FROM " . $this->table_products . " WHERE id = ?";
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->bind_param("i", $product_id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if (!$check_result->fetch_assoc()) {
            throw new Exception("Product not found");
        }

        $slug = $this->generateSlug($data['name'], $data['slug'] ?? '', $product_id);
        
        $category_json = isset($data['category']) && is_array($data['category']) 
            ? json_encode($data['category']) 
            : json_encode([]);
        
        $tags = isset($data['tags']) ? $data['tags'] : '';
        if (is_array($tags)) {
            $tags = implode(',', $tags);
        }

        $query = "UPDATE " . $this->table_products . " SET
                  name = ?,
                  slug = ?,
                  short_description = ?,
                  base_price = ?,
                  sale_price = ?,
                  sku = ?,
                  stock_status = ?,
                  stock_qty = ?,
                  manage_stock = ?,
                  low_stock_threshold = ?,
                  weight = ?,
                  weight_unit = ?,
                  length = ?,
                  width = ?,
                  height = ?,
                  dimension_unit = ?,
                  shipping_class = ?,
                  shipping_days = ?,
                  feature_image = ?,
                  banner_image = ?,
                  side_image = ?,
                  feature_img_alt = ?,
                  seo_title = ?,
                  seo_description = ?,
                  keywords = ?,
                  meta_robots = ?,
                  seo_score = ?,
                  category = ?,
                  tags = ?,
                  ribbon = ?,
                  badge_color = ?,
                  brand = ?,
                  status = ?,
                  enable_reviews = ?,
                  offer_type = ?,
                  offer_value = ?,
                  show_countdown = ?,
                  stock_for_offer = ?,
                  updated_at = NOW()
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        $params = [
            $data['name'] ?? '',
            $slug,
            $data['shortDescription'] ?? $data['short_description'] ?? '',
            isset($data['basePrice']) ? (float)$data['basePrice'] : 0.00,
            isset($data['salePrice']) ? (float)$data['salePrice'] : 0.00,
            $data['sku'] ?? '',
            $data['stockStatus'] ?? $data['stock_status'] ?? 'In Stock',
            isset($data['stockQty']) ? (int)$data['stockQty'] : 0,
            isset($data['manageStock']) ? ($data['manageStock'] ? 1 : 0) : 1,
            isset($data['lowStockThreshold']) ? (int)$data['lowStockThreshold'] : 10,
            isset($data['weight']) ? (float)$data['weight'] : 0.00,
            $data['weightUnit'] ?? $data['weight_unit'] ?? 'kg',
            isset($data['length']) ? (float)$data['length'] : 0.00,
            isset($data['width']) ? (float)$data['width'] : 0.00,
            isset($data['height']) ? (float)$data['height'] : 0.00,
            $data['dimensionUnit'] ?? $data['dimension_unit'] ?? 'cm',
            $data['shippingClass'] ?? $data['shipping_class'] ?? '',
            $data['shippingDays'] ?? $data['shipping_days'] ?? '3-5',
            $data['featureImage'] ?? $data['feature_image'] ?? '',
            $data['bannerImage'] ?? $data['banner_image'] ?? '',
            $data['sideImage'] ?? $data['side_image'] ?? '',
            $data['featureImgAlt'] ?? $data['feature_img_alt'] ?? '',
            $data['seoTitle'] ?? $data['seo_title'] ?? '',
            $data['seoDescription'] ?? $data['seo_description'] ?? '',
            $data['keywords'] ?? '',
            $data['metaRobots'] ?? $data['meta_robots'] ?? 'index, follow',
            isset($data['seoScore']) ? (int)$data['seoScore'] : 0,
            $category_json,
            $tags,
            $data['ribbon'] ?? '',
            $data['badgeColor'] ?? $data['badge_color'] ?? 'bg-red-500',
            $data['brand'] ?? '',
            $data['status'] ?? 'draft',
            isset($data['enableReviews']) ? ($data['enableReviews'] ? 1 : 0) : 1,
            $data['offerType'] ?? $data['offer_type'] ?? '',
            $data['offerValue'] ?? $data['offer_value'] ?? '',
            isset($data['showCountdown']) ? ($data['showCountdown'] ? 1 : 0) : 0,
            isset($data['stockForOffer']) ? (int)$data['stockForOffer'] : 50,
            $product_id
        ];

        $stmt->bind_param(
            "sssddsssiidddddsssssssssississsiisi",
            ...$params
        );

        $stmt->execute();

        return ['product_id' => $product_id];
    }

    private function saveDescriptionTabs($product_id, $tabs) {
        // Delete existing tabs
        $delete_query = "DELETE FROM " . $this->table_description_tabs . " WHERE product_id = ?";
        $delete_stmt = $this->conn->prepare($delete_query);
        $delete_stmt->bind_param("i", $product_id);
        $delete_stmt->execute();

        // Insert new tabs
        if (is_array($tabs) && count($tabs) > 0) {
            $insert_query = "INSERT INTO " . $this->table_description_tabs . " 
                            (product_id, tab_title, tab_content, tab_order, is_active, created_at, updated_at) 
                            VALUES (?, ?, ?, ?, 1, NOW(), NOW())";
            $insert_stmt = $this->conn->prepare($insert_query);
            
            foreach($tabs as $index => $tab) {
                $insert_stmt->bind_param("issi", $product_id, $tab['title'] ?? 'Description', 
                                       $tab['content'] ?? '', $index);
                $insert_stmt->execute();
            }
        }
    }

    private function saveFAQs($product_id, $faqs) {
        // Delete existing FAQs
        $delete_query = "DELETE FROM " . $this->table_faqs . " WHERE product_id = ?";
        $delete_stmt = $this->conn->prepare($delete_query);
        $delete_stmt->bind_param("i", $product_id);
        $delete_stmt->execute();

        // Insert new FAQs
        if (is_array($faqs) && count($faqs) > 0) {
            $insert_query = "INSERT INTO " . $this->table_faqs . " 
                            (product_id, question, answer, faq_order, is_active, created_at) 
                            VALUES (?, ?, ?, ?, 1, NOW())";
            $insert_stmt = $this->conn->prepare($insert_query);
            
            foreach($faqs as $index => $faq) {
                $insert_stmt->bind_param("issi", $product_id, $faq['question'] ?? '', 
                                       $faq['answer'] ?? '', $index);
                $insert_stmt->execute();
            }
        }
    }

    private function saveVariations($product_id, $variations) {
        // Delete existing variations
        $delete_query = "DELETE FROM " . $this->table_variations . " WHERE product_id = ?";
        $delete_stmt = $this->conn->prepare($delete_query);
        $delete_stmt->bind_param("i", $product_id);
        $delete_stmt->execute();

        // Insert new variations
        if (is_array($variations) && count($variations) > 0) {
            $insert_query = "INSERT INTO " . $this->table_variations . " 
                            (product_id, size, unit, price, stock, sku, created_at) 
                            VALUES (?, ?, ?, ?, ?, ?, NOW())";
            $insert_stmt = $this->conn->prepare($insert_query);
            
            foreach($variations as $variation) {
                $insert_stmt->bind_param("isdiss", $product_id, $variation['size'] ?? '', 
                                       $variation['unit'] ?? 'ml',
                                       isset($variation['price']) ? (float)$variation['price'] : 0.00,
                                       isset($variation['stock']) ? (int)$variation['stock'] : 0,
                                       $variation['sku'] ?? '');
                $insert_stmt->execute();
            }
        }
    }

    private function saveGallery($product_id, $gallery) {
        // Delete existing gallery items
        $delete_query = "DELETE FROM " . $this->table_gallery . " WHERE product_id = ?";
        $delete_stmt = $this->conn->prepare($delete_query);
        $delete_stmt->bind_param("i", $product_id);
        $delete_stmt->execute();

        // Insert new gallery items
        if (is_array($gallery) && count($gallery) > 0) {
            $insert_query = "INSERT INTO " . $this->table_gallery . " 
                            (product_id, media_url, media_type, media_alt, media_order, thumbnail_url, file_size, created_at) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
            $insert_stmt = $this->conn->prepare($insert_query);
            
            foreach($gallery as $index => $item) {
                $insert_stmt->bind_param("isssisds", $product_id,
                    $item['url'] ?? $item['media_url'] ?? '',
                    $item['type'] ?? $item['media_type'] ?? 'image',
                    $item['alt'] ?? $item['media_alt'] ?? '',
                    $index,
                    $item['thumbnail'] ?? $item['thumbnail_url'] ?? null,
                    $item['file_size'] ?? null
                );
                $insert_stmt->execute();
            }
        }
    }

    // ========== PUT REQUESTS ==========
    private function handlePutRequest($action) {
        switch($action) {
            case 'update_product':
                $this->updateProductRequest();
                break;
            case 'update_product_status':
                $this->updateProductStatus();
                break;
            case 'update_product_stock':
                $this->updateProductStock();
                break;
            case 'update_product_price':
                $this->updateProductPrice();
                break;
            case 'update_product_images':
                $this->updateProductImages();
                break;
            case 'update_review_status':
                $this->updateReviewStatus();
                break;
            case 'update_variation':
                $this->updateVariation();
                break;
            case 'update_media':
                $this->updateMedia();
                break;
            case 'bulk_update':
                $this->bulkUpdate();
                break;
            default:
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid action"]);
        }
    }

    // Update product via PUT request
    private function updateProductRequest() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            echo json_encode(["success" => false, "message" => "Invalid data"]);
            return;
        }

        if (empty($data['id'])) {
            echo json_encode(["success" => false, "message" => "Product ID is required"]);
            return;
        }

        try {
            $this->conn->begin_transaction();
            
            $product_id = (int)$data['id'];
            $result = $this->updateProduct($product_id, $data);

            // Update related data if provided
            if (isset($data['descriptionTabs'])) {
                $this->saveDescriptionTabs($product_id, $data['descriptionTabs']);
            }
            
            if (isset($data['faqs'])) {
                $this->saveFAQs($product_id, $data['faqs']);
            }
            
            if (isset($data['variations'])) {
                $this->saveVariations($product_id, $data['variations']);
            }
            
            if (isset($data['gallery'])) {
                $this->saveGallery($product_id, $data['gallery']);
            }

            $this->conn->commit();

            echo json_encode([
                "success" => true,
                "message" => "Product updated successfully",
                "data" => ["product_id" => $product_id]
            ]);

        } catch(Exception $e) {
            $this->conn->rollback();
            echo json_encode([
                "success" => false, 
                "message" => "Error updating product: " . $e->getMessage()
            ]);
        }
    }

    // Update product status only
    private function updateProductStatus() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id']) || !isset($data['status'])) {
            echo json_encode(["success" => false, "message" => "Product ID and status are required"]);
            return;
        }

        $product_id = (int)$data['id'];
        $status = $data['status'];

        // Validate status
        $valid_statuses = ['draft', 'published', 'archived', 'out_of_stock'];
        if (!in_array($status, $valid_statuses)) {
            echo json_encode(["success" => false, "message" => "Invalid status value"]);
            return;
        }

        try {
            $query = "UPDATE " . $this->table_products . " SET status = ?, updated_at = NOW() WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("si", $status, $product_id);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Product status updated successfully",
                "data" => ["product_id" => $product_id, "status" => $status]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Update product stock
    private function updateProductStock() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id']) || !isset($data['stock_qty'])) {
            echo json_encode(["success" => false, "message" => "Product ID and stock quantity are required"]);
            return;
        }

        $product_id = (int)$data['id'];
        $stock_qty = (int)$data['stock_qty'];
        $manage_stock = isset($data['manage_stock']) ? (int)$data['manage_stock'] : 1;
        
        // Determine stock status
        $stock_status = 'In Stock';
        if ($stock_qty <= 0) {
            $stock_status = 'Out of Stock';
        } elseif ($stock_qty <= 10) {
            $stock_status = 'Low Stock';
        }

        try {
            $query = "UPDATE " . $this->table_products . " SET 
                      stock_qty = ?, 
                      stock_status = ?, 
                      manage_stock = ?, 
                      updated_at = NOW() 
                      WHERE id = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("isii", $stock_qty, $stock_status, $manage_stock, $product_id);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Product stock updated successfully",
                "data" => [
                    "product_id" => $product_id, 
                    "stock_qty" => $stock_qty,
                    "stock_status" => $stock_status
                ]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Update product price
    private function updateProductPrice() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            echo json_encode(["success" => false, "message" => "Product ID is required"]);
            return;
        }

        $product_id = (int)$data['id'];
        $base_price = isset($data['base_price']) ? (float)$data['base_price'] : null;
        $sale_price = isset($data['sale_price']) ? (float)$data['sale_price'] : null;
        $offer_type = isset($data['offer_type']) ? $data['offer_type'] : null;
        $offer_value = isset($data['offer_value']) ? $data['offer_value'] : null;

        if ($base_price === null && $sale_price === null && $offer_type === null) {
            echo json_encode(["success" => false, "message" => "At least one price field is required"]);
            return;
        }

        try {
            // Build dynamic update query
            $updates = [];
            $params = [];
            $types = "";
            
            if ($base_price !== null) {
                $updates[] = "base_price = ?";
                $params[] = $base_price;
                $types .= "d";
            }
            
            if ($sale_price !== null) {
                $updates[] = "sale_price = ?";
                $params[] = $sale_price;
                $types .= "d";
            }
            
            if ($offer_type !== null) {
                $updates[] = "offer_type = ?";
                $params[] = $offer_type;
                $types .= "s";
            }
            
            if ($offer_value !== null) {
                $updates[] = "offer_value = ?";
                $params[] = $offer_value;
                $types .= "s";
            }
            
            $updates[] = "updated_at = NOW()";
            
            $params[] = $product_id;
            $types .= "i";
            
            $query = "UPDATE " . $this->table_products . " SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Product price updated successfully",
                "data" => ["product_id" => $product_id]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Update product images
    private function updateProductImages() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            echo json_encode(["success" => false, "message" => "Product ID is required"]);
            return;
        }

        $product_id = (int)$data['id'];
        $feature_image = isset($data['feature_image']) ? $data['feature_image'] : null;
        $banner_image = isset($data['banner_image']) ? $data['banner_image'] : null;
        $side_image = isset($data['side_image']) ? $data['side_image'] : null;
        $feature_img_alt = isset($data['feature_img_alt']) ? $data['feature_img_alt'] : null;

        if ($feature_image === null && $banner_image === null && $side_image === null && $feature_img_alt === null) {
            echo json_encode(["success" => false, "message" => "At least one image field is required"]);
            return;
        }

        try {
            // Build dynamic update query
            $updates = [];
            $params = [];
            $types = "";
            
            if ($feature_image !== null) {
                $updates[] = "feature_image = ?";
                $params[] = $feature_image;
                $types .= "s";
            }
            
            if ($banner_image !== null) {
                $updates[] = "banner_image = ?";
                $params[] = $banner_image;
                $types .= "s";
            }
            
            if ($side_image !== null) {
                $updates[] = "side_image = ?";
                $params[] = $side_image;
                $types .= "s";
            }
            
            if ($feature_img_alt !== null) {
                $updates[] = "feature_img_alt = ?";
                $params[] = $feature_img_alt;
                $types .= "s";
            }
            
            $updates[] = "updated_at = NOW()";
            
            $params[] = $product_id;
            $types .= "i";
            
            $query = "UPDATE " . $this->table_products . " SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Product images updated successfully",
                "data" => ["product_id" => $product_id]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Update review status (approve/reject)
    private function updateReviewStatus() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id']) || !isset($data['status'])) {
            echo json_encode(["success" => false, "message" => "Review ID and status are required"]);
            return;
        }

        $review_id = (int)$data['id'];
        $status = $data['status'];

        // Validate status
        $valid_statuses = ['pending', 'approved', 'rejected'];
        if (!in_array($status, $valid_statuses)) {
            echo json_encode(["success" => false, "message" => "Invalid status value. Allowed: pending, approved, rejected"]);
            return;
        }

        try {
            $query = "UPDATE " . $this->table_reviews . " SET status = ?, updated_at = NOW() WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("si", $status, $review_id);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Review status updated successfully",
                "data" => ["review_id" => $review_id, "status" => $status]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Update variation
    private function updateVariation() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            echo json_encode(["success" => false, "message" => "Variation ID is required"]);
            return;
        }

        $variation_id = (int)$data['id'];
        $size = isset($data['size']) ? $data['size'] : null;
        $unit = isset($data['unit']) ? $data['unit'] : null;
        $price = isset($data['price']) ? (float)$data['price'] : null;
        $stock = isset($data['stock']) ? (int)$data['stock'] : null;
        $sku = isset($data['sku']) ? $data['sku'] : null;

        if ($size === null && $unit === null && $price === null && $stock === null && $sku === null) {
            echo json_encode(["success" => false, "message" => "At least one field is required to update"]);
            return;
        }

        try {
            // Check if variation exists
            $check_query = "SELECT id FROM " . $this->table_variations . " WHERE id = ?";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bind_param("i", $variation_id);
            $check_stmt->execute();
            $check_result = $check_stmt->get_result();
            
            if (!$check_result->fetch_assoc()) {
                echo json_encode(["success" => false, "message" => "Variation not found"]);
                return;
            }

            // Build dynamic update query
            $updates = [];
            $params = [];
            $types = "";
            
            if ($size !== null) {
                $updates[] = "size = ?";
                $params[] = $size;
                $types .= "s";
            }
            
            if ($unit !== null) {
                $updates[] = "unit = ?";
                $params[] = $unit;
                $types .= "s";
            }
            
            if ($price !== null) {
                $updates[] = "price = ?";
                $params[] = $price;
                $types .= "d";
            }
            
            if ($stock !== null) {
                $updates[] = "stock = ?";
                $params[] = $stock;
                $types .= "i";
            }
            
            if ($sku !== null) {
                $updates[] = "sku = ?";
                $params[] = $sku;
                $types .= "s";
            }
            
            $params[] = $variation_id;
            $types .= "i";
            
            $query = "UPDATE " . $this->table_variations . " SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Variation updated successfully",
                "data" => ["variation_id" => $variation_id]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Update media (alt text, order, etc.)
    private function updateMedia() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            echo json_encode(["success" => false, "message" => "Media ID is required"]);
            return;
        }

        $media_id = (int)$data['id'];
        $media_alt = isset($data['media_alt']) ? $data['media_alt'] : null;
        $media_order = isset($data['media_order']) ? (int)$data['media_order'] : null;
        $media_type = isset($data['media_type']) ? $data['media_type'] : null;

        if ($media_alt === null && $media_order === null && $media_type === null) {
            echo json_encode(["success" => false, "message" => "At least one field is required to update"]);
            return;
        }

        try {
            // Check if media exists
            $check_query = "SELECT id FROM " . $this->table_gallery . " WHERE id = ?";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bind_param("i", $media_id);
            $check_stmt->execute();
            $check_result = $check_stmt->get_result();
            
            if (!$check_result->fetch_assoc()) {
                echo json_encode(["success" => false, "message" => "Media not found"]);
                return;
            }

            // Build dynamic update query
            $updates = [];
            $params = [];
            $types = "";
            
            if ($media_alt !== null) {
                $updates[] = "media_alt = ?";
                $params[] = $media_alt;
                $types .= "s";
            }
            
            if ($media_order !== null) {
                $updates[] = "media_order = ?";
                $params[] = $media_order;
                $types .= "i";
            }
            
            if ($media_type !== null) {
                $updates[] = "media_type = ?";
                $params[] = $media_type;
                $types .= "s";
            }
            
            $params[] = $media_id;
            $types .= "i";
            
            $query = "UPDATE " . $this->table_gallery . " SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Media updated successfully",
                "data" => ["media_id" => $media_id]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Bulk update products
    private function bulkUpdate() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['product_ids']) || !is_array($data['product_ids']) || empty($data['product_ids'])) {
            echo json_encode(["success" => false, "message" => "Product IDs array is required"]);
            return;
        }

        if (!isset($data['updates']) || empty($data['updates'])) {
            echo json_encode(["success" => false, "message" => "Updates are required"]);
            return;
        }

        $product_ids = $data['product_ids'];
        $updates = $data['updates'];

        // Validate product IDs
        $valid_ids = [];
        foreach ($product_ids as $id) {
            $valid_ids[] = (int)$id;
        }

        if (empty($valid_ids)) {
            echo json_encode(["success" => false, "message" => "No valid product IDs provided"]);
            return;
        }

        try {
            // Build update query
            $update_fields = [];
            $params = [];
            $types = "";
            
            // Add dynamic updates
            if (isset($updates['status'])) {
                $update_fields[] = "status = ?";
                $params[] = $updates['status'];
                $types .= "s";
            }
            
            if (isset($updates['stock_status'])) {
                $update_fields[] = "stock_status = ?";
                $params[] = $updates['stock_status'];
                $types .= "s";
            }
            
            if (isset($updates['stock_qty']) && is_numeric($updates['stock_qty'])) {
                $update_fields[] = "stock_qty = ?";
                $params[] = (int)$updates['stock_qty'];
                $types .= "i";
            }
            
            if (isset($updates['brand'])) {
                $update_fields[] = "brand = ?";
                $params[] = $updates['brand'];
                $types .= "s";
            }
            
            if (isset($updates['ribbon'])) {
                $update_fields[] = "ribbon = ?";
                $params[] = $updates['ribbon'];
                $types .= "s";
            }
            
            if (isset($updates['badge_color'])) {
                $update_fields[] = "badge_color = ?";
                $params[] = $updates['badge_color'];
                $types .= "s";
            }
            
            if (isset($updates['enable_reviews'])) {
                $update_fields[] = "enable_reviews = ?";
                $params[] = $updates['enable_reviews'] ? 1 : 0;
                $types .= "i";
            }
            
            // Add timestamp
            $update_fields[] = "updated_at = NOW()";
            
            // Build WHERE clause for product IDs
            $placeholders = str_repeat('?,', count($valid_ids) - 1) . '?';
            $id_types = str_repeat('i', count($valid_ids));
            
            // Add product IDs to params
            $params = array_merge($params, $valid_ids);
            $types .= $id_types;
            
            $query = "UPDATE " . $this->table_products . " SET " . 
                     implode(", ", $update_fields) . 
                     " WHERE id IN (" . $placeholders . ")";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();

            $affected_rows = $stmt->affected_rows;

            echo json_encode([
                "success" => true,
                "message" => "Bulk update completed successfully",
                "data" => [
                    "updated_count" => $affected_rows,
                    "product_ids" => $valid_ids
                ]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    private function uploadFile() {
        // Check if file was uploaded
        $file = null;
        
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['file'];
        } elseif (isset($_FILES['files'])) {
            $files = $_FILES['files'];
            
            if (is_array($files['name'])) {
                if (isset($files['name'][0]) && $files['error'][0] === UPLOAD_ERR_OK) {
                    $file = [
                        'name' => $files['name'][0],
                        'type' => $files['type'][0],
                        'tmp_name' => $files['tmp_name'][0],
                        'error' => $files['error'][0],
                        'size' => $files['size'][0]
                    ];
                }
            } elseif ($files['error'] === UPLOAD_ERR_OK) {
                $file = $files;
            }
        }
        
        if (!$file) {
            echo json_encode(["success" => false, "message" => "No file uploaded or upload error"]);
            return;
        }
        
        $product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;
        $type = isset($_POST['type']) ? $_POST['type'] : 'gallery';
        
        // Auto-detect media type
        $file_type = $file['type'];
        $media_type = 'image';
        
        if (strpos($file_type, 'image/') === 0) {
            $media_type = 'image';
        } elseif (strpos($file_type, 'video/') === 0) {
            $media_type = 'video';
        }

        // Validate file type
        if ($media_type === 'image' && !in_array($file_type, $this->allowed_image_types)) {
            echo json_encode(["success" => false, "message" => "Invalid image type. Allowed: JPEG, PNG, GIF, WebP, SVG"]);
            return;
        }
        
        if ($media_type === 'video' && !in_array($file_type, $this->allowed_video_types)) {
            echo json_encode(["success" => false, "message" => "Invalid video type. Allowed: MP4, WebM, OGG, MOV, AVI"]);
            return;
        }
        
        // Validate file size
        if ($file['size'] > $this->max_file_size) {
            echo json_encode(["success" => false, "message" => "File size too large. Maximum: 50MB"]);
            return;
        }

        // Create directories
        $upload_path = $this->upload_dir;
        
        // Create type-specific directory
        $type_dir = '';
        switch($type) {
            case 'feature':
                $type_dir = 'feature/';
                break;
            case 'banner':
                $type_dir = 'banner/';
                break;
            case 'side':
                $type_dir = 'side/';
                break;
            case 'description':
                $type_dir = 'description/';
                break;
            default:
                $type_dir = $media_type === 'video' ? 'videos/' : 'images/';
        }
        
        $upload_path .= $type_dir;
        
        if (!file_exists($upload_path)) {
            mkdir($upload_path, 0777, true);
        }
        
        // Create product directory
        if ($product_id > 0) {
            $upload_path .= $product_id . '/';
            if (!file_exists($upload_path)) {
                mkdir($upload_path, 0777, true);
            }
        }

        // Generate unique filename
        $file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $base_name = pathinfo($file['name'], PATHINFO_FILENAME);
        $clean_name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $base_name);
        $unique_name = $clean_name . '_' . uniqid() . '.' . $file_ext;
        $target_file = $upload_path . $unique_name;

        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $target_file)) {
            // Generate relative URL
            $relative_path = 'uploads/products/' . $type_dir . ($product_id > 0 ? $product_id . '/' : '') . $unique_name;
            
            $file_info = [
                'file_url' => $relative_path,
                'file_name' => $file['name'],
                'original_name' => $file['name'],
                'file_type' => $file_type,
                'media_type' => $media_type,
                'file_size' => $file['size']
            ];
            
            // Get image dimensions
            if ($media_type === 'image') {
                $image_info = @getimagesize($target_file);
                if ($image_info) {
                    $file_info['dimensions'] = [
                        'width' => $image_info[0],
                        'height' => $image_info[1]
                    ];
                }
            }
            
            echo json_encode([
                "success" => true,
                "message" => "File uploaded successfully",
                "data" => $file_info
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload file"]);
        }
    }

    private function uploadMultipleFiles() {
        if (!isset($_FILES['files'])) {
            echo json_encode(["success" => false, "message" => "No files uploaded"]);
            return;
        }

        $files = $_FILES['files'];
        $product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;
        
        $uploaded_files = [];
        $errors = [];

        for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                $errors[] = "Error uploading " . $files['name'][$i];
                continue;
            }

            $file = [
                'name' => $files['name'][$i],
                'type' => $files['type'][$i],
                'tmp_name' => $files['tmp_name'][$i],
                'error' => $files['error'][$i],
                'size' => $files['size'][$i]
            ];

            // Auto-detect media type
            $file_type = $file['type'];
            $media_type = 'image';
            
            if (strpos($file_type, 'image/') === 0) {
                $media_type = 'image';
            } elseif (strpos($file_type, 'video/') === 0) {
                $media_type = 'video';
            }

            // Validate file type
            if ($media_type === 'image' && !in_array($file_type, $this->allowed_image_types)) {
                $errors[] = "Invalid image type: " . $file['name'];
                continue;
            }
            
            if ($media_type === 'video' && !in_array($file_type, $this->allowed_video_types)) {
                $errors[] = "Invalid video type: " . $file['name'];
                continue;
            }
            
            // Validate file size
            if ($file['size'] > $this->max_file_size) {
                $errors[] = "File too large: " . $file['name'];
                continue;
            }

            // Create directories
            $upload_path = $this->upload_dir;
            $type_dir = $media_type === 'video' ? 'videos/' : 'images/';
            $upload_path .= $type_dir;
            
            if (!file_exists($upload_path)) {
                mkdir($upload_path, 0777, true);
            }
            
            if ($product_id > 0) {
                $upload_path .= $product_id . '/';
                if (!file_exists($upload_path)) {
                    mkdir($upload_path, 0777, true);
                }
            }

            // Generate unique filename
            $file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $unique_name = uniqid() . '_' . time() . '_' . $i . '.' . $file_ext;
            $target_file = $upload_path . $unique_name;

            // Move uploaded file
            if (move_uploaded_file($file['tmp_name'], $target_file)) {
                $relative_path = 'uploads/products/' . $type_dir . ($product_id > 0 ? $product_id . '/' : '') . $unique_name;
                
                $file_info = [
                    'file_url' => $relative_path,
                    'file_name' => $file['name'],
                    'file_type' => $file_type,
                    'media_type' => $media_type,
                    'file_size' => $file['size']
                ];
                
                $uploaded_files[] = $file_info;
            } else {
                $errors[] = "Failed to upload: " . $file['name'];
            }
        }

        $response = [
            "success" => count($uploaded_files) > 0,
            "message" => "Uploaded " . count($uploaded_files) . " files, " . count($errors) . " errors",
            "data" => $uploaded_files
        ];
        
        if (count($errors) > 0) {
            $response['errors'] = $errors;
        }

        echo json_encode($response);
    }

    private function addReview() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            echo json_encode(["success" => false, "message" => "Invalid data"]);
            return;
        }

        $required_fields = ['product_id', 'reviewer_name', 'review_text', 'rating'];
        foreach ($required_fields as $field) {
            if (empty($data[$field])) {
                echo json_encode(["success" => false, "message" => "$field is required"]);
                return;
            }
        }

        try {
            $query = "INSERT INTO " . $this->table_reviews . " 
                     (product_id, reviewer_name, reviewer_email, rating, review_title, review_text, status, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("isssss", 
                $data['product_id'],
                $data['reviewer_name'],
                $data['reviewer_email'] ?? '',
                $data['rating'],
                $data['review_title'] ?? '',
                $data['review_text']
            );
            $stmt->execute();

            $review_id = $stmt->insert_id;

            echo json_encode([
                "success" => true,
                "message" => "Review added successfully",
                "data" => ["review_id" => $review_id]
            ]);

        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    private function updateMediaOrder() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['media_items']) || !is_array($data['media_items'])) {
            echo json_encode(["success" => false, "message" => "Media items are required"]);
            return;
        }

        try {
            $this->conn->begin_transaction();
            
            foreach ($data['media_items'] as $index => $item) {
                if (!isset($item['id'])) continue;
                
                $query = "UPDATE " . $this->table_gallery . " SET media_order = ? WHERE id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("ii", $index, $item['id']);
                $stmt->execute();
            }
            
            $this->conn->commit();
            
            echo json_encode([
                "success" => true,
                "message" => "Media order updated successfully"
            ]);
            
        } catch(Exception $e) {
            $this->conn->rollback();
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // ========== DELETE REQUESTS ==========
    private function handleDeleteRequest($action) {
        switch($action) {
            case 'delete_product':
                $this->deleteProduct();
                break;
            case 'delete_media':
                $this->deleteMedia();
                break;
            case 'delete_review':
                $this->deleteReview();
                break;
            default:
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid action"]);
        }
    }

    private function deleteProduct() {
        if (!isset($_GET['id'])) {
            echo json_encode(["success" => false, "message" => "Product ID is required"]);
            return;
        }

        $product_id = (int)$_GET['id'];

        try {
            $this->conn->begin_transaction();

            // Get product images
            $images_query = "SELECT feature_image, banner_image, side_image FROM " . $this->table_products . " WHERE id = ?";
            $images_stmt = $this->conn->prepare($images_query);
            $images_stmt->bind_param("i", $product_id);
            $images_stmt->execute();
            $images_result = $images_stmt->get_result();
            $product = $images_result->fetch_assoc();

            // Get gallery items
            $gallery_query = "SELECT media_url FROM " . $this->table_gallery . " WHERE product_id = ?";
            $gallery_stmt = $this->conn->prepare($gallery_query);
            $gallery_stmt->bind_param("i", $product_id);
            $gallery_stmt->execute();
            $gallery_result = $gallery_stmt->get_result();
            $gallery_items = [];
            while($row = $gallery_result->fetch_assoc()) {
                $gallery_items[] = $row['media_url'];
            }

            // Delete related data
            $tables = [
                $this->table_description_tabs,
                $this->table_faqs,
                $this->table_gallery,
                $this->table_variations,
                $this->table_reviews
            ];

            foreach($tables as $table) {
                $delete_query = "DELETE FROM " . $table . " WHERE product_id = ?";
                $delete_stmt = $this->conn->prepare($delete_query);
                $delete_stmt->bind_param("i", $product_id);
                $delete_stmt->execute();
            }

            // Delete main product
            $delete_product_query = "DELETE FROM " . $this->table_products . " WHERE id = ?";
            $delete_product_stmt = $this->conn->prepare($delete_product_query);
            $delete_product_stmt->bind_param("i", $product_id);
            $delete_product_stmt->execute();

            // Delete files
            $this->deleteProductFiles($product, $gallery_items, $product_id);

            $this->conn->commit();

            echo json_encode([
                "success" => true,
                "message" => "Product deleted successfully"
            ]);

        } catch(Exception $e) {
            $this->conn->rollback();
            echo json_encode([
                "success" => false, 
                "message" => "Error deleting product: " . $e->getMessage()
            ]);
        }
    }

    private function deleteMedia() {
        if (!isset($_GET['id'])) {
            echo json_encode(["success" => false, "message" => "Media ID is required"]);
            return;
        }

        $media_id = (int)$_GET['id'];

        try {
            // Get media info
            $query = "SELECT media_url FROM " . $this->table_gallery . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $media_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $media = $result->fetch_assoc();
            
            if (!$media) {
                echo json_encode(["success" => false, "message" => "Media not found"]);
                return;
            }
            
            // Delete from database
            $delete_query = "DELETE FROM " . $this->table_gallery . " WHERE id = ?";
            $delete_stmt = $this->conn->prepare($delete_query);
            $delete_stmt->bind_param("i", $media_id);
            $delete_stmt->execute();
            
            // Delete file
            if ($media['media_url'] && file_exists('../../' . $media['media_url'])) {
                unlink('../../' . $media['media_url']);
            }
            
            echo json_encode([
                "success" => true,
                "message" => "Media deleted successfully"
            ]);
            
        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Error deleting media: " . $e->getMessage()]);
        }
    }

    private function deleteReview() {
        if (!isset($_GET['id'])) {
            echo json_encode(["success" => false, "message" => "Review ID is required"]);
            return;
        }

        $review_id = (int)$_GET['id'];

        try {
            $query = "DELETE FROM " . $this->table_reviews . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $review_id);
            $stmt->execute();
            
            echo json_encode([
                "success" => true,
                "message" => "Review deleted successfully"
            ]);
            
        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => "Error deleting review: " . $e->getMessage()]);
        }
    }

    private function deleteProductFiles($product, $gallery_items, $product_id) {
        // Delete main images
        $images_to_delete = [
            $product['feature_image'] ?? '',
            $product['banner_image'] ?? '',
            $product['side_image'] ?? ''
        ];

        foreach($images_to_delete as $image_path) {
            if ($image_path && file_exists('../../' . $image_path)) {
                @unlink('../../' . $image_path);
            }
        }

        // Delete gallery items
        foreach($gallery_items as $item_path) {
            if ($item_path && file_exists('../../' . $item_path)) {
                @unlink('../../' . $item_path);
            }
        }

        // Delete directories
        $dirs = [
            $this->upload_dir . 'images/' . $product_id,
            $this->upload_dir . 'videos/' . $product_id,
            $this->upload_dir . $product_id
        ];
        
        foreach($dirs as $dir) {
            if (file_exists($dir)) {
                $this->deleteDirectory($dir);
            }
        }
    }

    private function deleteDirectory($dir) {
        if (!file_exists($dir)) return true;
        
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->deleteDirectory($path) : @unlink($path);
        }
        
        return @rmdir($dir);
    }

    // Helper methods
    private function generateSlug($name, $custom_slug = '', $product_id = 0) {
        $slug = !empty($custom_slug) ? $this->slugify($custom_slug) : $this->slugify($name);

        // Check if slug exists
        $query = "SELECT COUNT(*) as count FROM " . $this->table_products . " WHERE slug = ?";
        $params = [$slug];
        
        if ($product_id > 0) {
            $query .= " AND id != ?";
            $params[] = $product_id;
        }
        
        $stmt = $this->conn->prepare($query);
        
        if ($product_id > 0) {
            $stmt->bind_param("si", $slug, $product_id);
        } else {
            $stmt->bind_param("s", $slug);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        if ($row['count'] > 0) {
            $counter = 1;
            while (true) {
                $new_slug = $slug . '-' . $counter;
                
                $check_query = "SELECT COUNT(*) as count FROM " . $this->table_products . " WHERE slug = ?";
                $check_stmt = $this->conn->prepare($check_query);
                
                if ($product_id > 0) {
                    $check_query .= " AND id != ?";
                    $check_stmt->bind_param("si", $new_slug, $product_id);
                } else {
                    $check_stmt->bind_param("s", $new_slug);
                }
                
                $check_stmt->execute();
                $check_result = $check_stmt->get_result();
                $check_row = $check_result->fetch_assoc();
                
                if ($check_row['count'] == 0) {
                    $slug = $new_slug;
                    break;
                }
                $counter++;
            }
        }
        
        return $slug;
    }

    private function slugify($text) {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        $text = preg_replace('~[^-\w]+~', '', $text);
        $text = trim($text, '-');
        $text = preg_replace('~-+~', '-', $text);
        $text = strtolower($text);
        
        return empty($text) ? 'n-a' : $text;
    }
}

// Initialize and process request
$api = new ProductAPI();
$api->processRequest();
?>