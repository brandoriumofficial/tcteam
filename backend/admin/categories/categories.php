<?php
// api/categories.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../database/db.php';
require_once '../../database/migrate_categories.php';

// SIMPLE AUTHENTICATION BYPASS FOR TESTING
// REMOVE THIS IN PRODUCTION
function authenticate($conn) {
    // For testing, return a dummy user
    return [
        'id' => 1,
        'role' => 'admin'
    ];
    
    /*
    // Uncomment this for real authentication
    
    $token = null;
    
    // Get token from headers
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
    }
    
    // Get from GET/POST
    if (!$token && isset($_GET['token'])) {
        $token = $_GET['token'];
    }
    if (!$token && isset($_POST['token'])) {
        $token = $_POST['token'];
    }
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication token required']);
        exit;
    }
    
    // Check if users table exists
    $table_check = $conn->query("SHOW TABLES LIKE 'users'");
    if (!$table_check || $table_check->num_rows == 0) {
        // Users table doesn't exist, create it
        require_once '../../database/migrate_users.php';
    }
    
    // Verify token in database
    $stmt = $conn->prepare("SELECT id, role FROM users WHERE token = ? AND active = 1");
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
        exit;
    }
    
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid token']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    return $user;
    */
}

// Handle request
$method = $_SERVER['REQUEST_METHOD'];
$user = authenticate($conn); // Remove authentication for testing

if ($method === 'GET') {
    // Get single category
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        
        // Get category
        $stmt = $conn->prepare("SELECT * FROM categories WHERE id = ?");
        if (!$stmt) {
            error_log("Prepare failed: " . $conn->error);
            echo json_encode(['success' => false, 'message' => 'Database error']);
            exit;
        }
        
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($category = $result->fetch_assoc()) {
            // Get tags
            $tags = [];
            $tags_stmt = $conn->prepare("SELECT tag_name FROM category_tags WHERE category_id = ?");
            if ($tags_stmt) {
                $tags_stmt->bind_param("i", $id);
                $tags_stmt->execute();
                $tags_result = $tags_stmt->get_result();
                while ($tag = $tags_result->fetch_assoc()) {
                    $tags[] = $tag['tag_name'];
                }
            }
            $category['selectedTags'] = $tags;
            
            // Get products
            $products = [];
            $products_stmt = $conn->prepare("SELECT product_id, product_name FROM category_products WHERE category_id = ?");
            if ($products_stmt) {
                $products_stmt->bind_param("i", $id);
                $products_stmt->execute();
                $products_result = $products_stmt->get_result();
                while ($prod = $products_result->fetch_assoc()) {
                    $products[] = [
                        'id' => $prod['product_id'],
                        'name' => $prod['product_name']
                    ];
                }
            }
            $category['assignedProducts'] = $products;
            
            echo json_encode(['success' => true, 'data' => $category]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Category not found']);
        }
        exit;
    }
    
    // Get all categories with filters
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $offset = ($page - 1) * $limit;
    
    // Build query
    $where = [];
    $params = [];
    $types = "";
    
    if (isset($_GET['active']) && $_GET['active'] !== '') {
        $where[] = "active = ?";
        $params[] = intval($_GET['active']);
        $types .= "i";
    }
    
    if (isset($_GET['type']) && $_GET['type'] !== '') {
        $where[] = "type = ?";
        $params[] = $_GET['type'];
        $types .= "s";
    }
    
    if (isset($_GET['search']) && $_GET['search'] !== '') {
        $where[] = "(name LIKE ? OR description LIKE ?)";
        $search = "%" . $_GET['search'] . "%";
        $params[] = $search;
        $params[] = $search;
        $types .= "ss";
    }
    
    $where_clause = $where ? "WHERE " . implode(" AND ", $where) : "";
    
    // Count total
    $count_sql = "SELECT COUNT(*) as total FROM categories $where_clause";
    if ($params) {
        $count_stmt = $conn->prepare($count_sql);
        if ($count_stmt) {
            $count_stmt->bind_param($types, ...$params);
            $count_stmt->execute();
            $count_result = $count_stmt->get_result();
            $total = $count_result->fetch_assoc()['total'];
        } else {
            $total = 0;
        }
    } else {
        $count_result = $conn->query($count_sql);
        if ($count_result) {
            $total = $count_result->fetch_assoc()['total'];
        } else {
            $total = 0;
        }
    }
    
    // Get data
    $sql = "SELECT * FROM categories $where_clause ORDER BY created_at DESC LIMIT ? OFFSET ?";
    $types .= "ii";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = false;
    }
    
    $categories = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            // Get product count for each category
            $prod_count = 0;
            $prod_count_stmt = $conn->prepare("SELECT COUNT(*) as count FROM category_products WHERE category_id = ?");
            if ($prod_count_stmt) {
                $prod_count_stmt->bind_param("i", $row['id']);
                $prod_count_stmt->execute();
                $prod_count_result = $prod_count_stmt->get_result();
                if ($prod_count_result) {
                    $prod_count = $prod_count_result->fetch_assoc()['count'];
                }
            }
            $row['product_count'] = $prod_count;
            
            $categories[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $categories,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
    
} elseif ($method === 'POST') {
    // Check if it's create or update
    $action = isset($_GET['action']) ? $_GET['action'] : 'create';
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    
    if ($action === 'update' && !$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Category ID required for update']);
        exit;
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Handle file uploads
        $thumbnail = null;
        $banner = null;
        
        // Create uploads directory if not exists
        $upload_dir = __DIR__ . '/../../uploads/categories/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        // Upload thumbnail
        if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === 0) {
            $file = $_FILES['thumbnail'];
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $new_name = 'thumb_' . ($id ? $id : 'new') . '_' . time() . '.' . $ext;
            $target_path = $upload_dir . $new_name;
            
            if (move_uploaded_file($file['tmp_name'], $target_path)) {
                $thumbnail = $new_name;
            }
        }
        
        // Upload banner
        if (isset($_FILES['banner']) && $_FILES['banner']['error'] === 0) {
            $file = $_FILES['banner'];
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $new_name = 'banner_' . ($id ? $id : 'new') . '_' . time() . '.' . $ext;
            $target_path = $upload_dir . $new_name;
            
            if (move_uploaded_file($file['tmp_name'], $target_path)) {
                $banner = $new_name;
            }
        }
        
        // Parse form data
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $slug = isset($_POST['slug']) ? trim($_POST['slug']) : '';
        $description = isset($_POST['description']) ? trim($_POST['description']) : '';
        $type = isset($_POST['type']) ? trim($_POST['type']) : 'Main Category';
        $active = isset($_POST['active']) ? intval($_POST['active']) : 1;
        $show_on_home = isset($_POST['showOnHome']) ? intval($_POST['showOnHome']) : 0;
        $show_on_menu = isset($_POST['showOnMenu']) ? intval($_POST['showOnMenu']) : 0;
        $show_on_shop = isset($_POST['showOnShop']) ? intval($_POST['showOnShop']) : 1;
        $seo_title = isset($_POST['seoTitle']) ? trim($_POST['seoTitle']) : '';
        $seo_description = isset($_POST['seoDesc']) ? trim($_POST['seoDesc']) : '';
        $keywords = isset($_POST['keywords']) ? trim($_POST['keywords']) : '';
        $suitable_for = isset($_POST['suitableFor']) ? trim($_POST['suitableFor']) : 'All';
        $seasonal = isset($_POST['seasonal']) ? trim($_POST['seasonal']) : 'None';
        
        // Parse tags and products
        $tags = [];
        if (isset($_POST['selectedTags'])) {
            $tags = json_decode($_POST['selectedTags'], true);
            if (!is_array($tags)) $tags = [];
        }
        
        $products = [];
        if (isset($_POST['assignedProducts'])) {
            $products = json_decode($_POST['assignedProducts'], true);
            if (!is_array($products)) $products = [];
        }
        
        // Validate required fields
        if (!$name || !$slug) {
            throw new Exception('Name and slug are required');
        }
        
        // Check if slug exists (for create or different category)
        $slug_check_sql = "SELECT id FROM categories WHERE slug = ?";
        if ($id) {
            $slug_check_sql .= " AND id != ?";
        }
        $slug_stmt = $conn->prepare($slug_check_sql);
        if (!$slug_stmt) {
            throw new Exception('Database error: ' . $conn->error);
        }
        
        if ($id) {
            $slug_stmt->bind_param("si", $slug, $id);
        } else {
            $slug_stmt->bind_param("s", $slug);
        }
        $slug_stmt->execute();
        if ($slug_stmt->get_result()->num_rows > 0) {
            throw new Exception('Slug already exists');
        }
        
        if ($action === 'create') {
            // Insert category
            $sql = "INSERT INTO categories (name, slug, description, type, active, show_on_home, 
                    show_on_menu, show_on_shop, seo_title, seo_description, keywords, 
                    suitable_for, seasonal, thumbnail_image, banner_image) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception('Database error: ' . $conn->error);
            }
            
            $stmt->bind_param("ssssiiiiissssss", 
                $name, $slug, $description, $type, $active, 
                $show_on_home, $show_on_menu, $show_on_shop,
                $seo_title, $seo_description, $keywords,
                $suitable_for, $seasonal, $thumbnail, $banner
            );
            
            if (!$stmt->execute()) {
                throw new Exception('Failed to create category: ' . $stmt->error);
            }
            
            $category_id = $conn->insert_id;
            
        } else {
            // Update category
            $category_id = $id;
            
            // Build update query
            $update_fields = [];
            $update_params = [];
            $update_types = "";
            
            $update_fields[] = "name = ?";
            $update_params[] = $name;
            $update_types .= "s";
            
            $update_fields[] = "slug = ?";
            $update_params[] = $slug;
            $update_types .= "s";
            
            $update_fields[] = "description = ?";
            $update_params[] = $description;
            $update_types .= "s";
            
            $update_fields[] = "type = ?";
            $update_params[] = $type;
            $update_types .= "s";
            
            $update_fields[] = "active = ?";
            $update_params[] = $active;
            $update_types .= "i";
            
            $update_fields[] = "show_on_home = ?";
            $update_params[] = $show_on_home;
            $update_types .= "i";
            
            $update_fields[] = "show_on_menu = ?";
            $update_params[] = $show_on_menu;
            $update_types .= "i";
            
            $update_fields[] = "show_on_shop = ?";
            $update_params[] = $show_on_shop;
            $update_types .= "i";
            
            $update_fields[] = "seo_title = ?";
            $update_params[] = $seo_title;
            $update_types .= "s";
            
            $update_fields[] = "seo_description = ?";
            $update_params[] = $seo_description;
            $update_types .= "s";
            
            $update_fields[] = "keywords = ?";
            $update_params[] = $keywords;
            $update_types .= "s";
            
            $update_fields[] = "suitable_for = ?";
            $update_params[] = $suitable_for;
            $update_types .= "s";
            
            $update_fields[] = "seasonal = ?";
            $update_params[] = $seasonal;
            $update_types .= "s";
            
            if ($thumbnail) {
                $update_fields[] = "thumbnail_image = ?";
                $update_params[] = $thumbnail;
                $update_types .= "s";
            }
            
            if ($banner) {
                $update_fields[] = "banner_image = ?";
                $update_params[] = $banner;
                $update_types .= "s";
            }
            
            $update_params[] = $category_id;
            $update_types .= "i";
            
            $sql = "UPDATE categories SET " . implode(", ", $update_fields) . " WHERE id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception('Database error: ' . $conn->error);
            }
            
            $stmt->bind_param($update_types, ...$update_params);
            
            if (!$stmt->execute()) {
                throw new Exception('Failed to update category: ' . $stmt->error);
            }
        }
        
        // Handle tags
        // Delete existing tags
        $delete_tags = $conn->prepare("DELETE FROM category_tags WHERE category_id = ?");
        if ($delete_tags) {
            $delete_tags->bind_param("i", $category_id);
            $delete_tags->execute();
        }
        
        // Insert new tags
        if (!empty($tags)) {
            $tag_stmt = $conn->prepare("INSERT INTO category_tags (category_id, tag_name) VALUES (?, ?)");
            if ($tag_stmt) {
                foreach ($tags as $tag) {
                    $tag_stmt->bind_param("is", $category_id, $tag);
                    $tag_stmt->execute();
                }
            }
        }
        
        // Handle products
        // Delete existing products
        $delete_products = $conn->prepare("DELETE FROM category_products WHERE category_id = ?");
        if ($delete_products) {
            $delete_products->bind_param("i", $category_id);
            $delete_products->execute();
        }
        
        // Insert new products
        if (!empty($products)) {
            $product_stmt = $conn->prepare("INSERT INTO category_products (category_id, product_id, product_name) VALUES (?, ?, ?)");
            if ($product_stmt) {
                foreach ($products as $product) {
                    // If product is just an ID, get name from products table
                    if (is_numeric($product)) {
                        $product_id = intval($product);
                        $product_name = "Product #" . $product_id;
                    } else {
                        $product_id = $product['id'] ?? $product;
                        $product_name = $product['name'] ?? "Product #" . $product_id;
                    }
                    
                    $product_stmt->bind_param("iis", $category_id, $product_id, $product_name);
                    $product_stmt->execute();
                }
            }
        }
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => $action === 'create' ? 'Category created successfully' : 'Category updated successfully',
            'category_id' => $category_id
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    
} elseif ($method === 'DELETE') {
    // Delete category
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Category ID required']);
        exit;
    }
    
    $conn->begin_transaction();
    
    try {
        // Delete related records first
        $conn->query("DELETE FROM category_tags WHERE category_id = $id");
        $conn->query("DELETE FROM category_products WHERE category_id = $id");
        
        // Delete category
        $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
        if (!$stmt) {
            throw new Exception('Database error');
        }
        
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Category deleted successfully']);
        } else {
            throw new Exception('Failed to delete category');
        }
        
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>