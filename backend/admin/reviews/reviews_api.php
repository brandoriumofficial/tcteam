<?php
require '../../database/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Check database connection BEFORE using it
if (!$conn) {
    error_log("Database connection failed");
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Function to check and create reviews table
function initializeReviewsTable($conn) {
    try {
        // Check if table exists
        $check = $conn->query("SHOW TABLES LIKE 'product_reviews'");
        if ($check && $check->num_rows == 0) {
            // Create table
            $sql = "CREATE TABLE IF NOT EXISTS product_reviews (
                id INT PRIMARY KEY AUTO_INCREMENT,
                product_id INT DEFAULT NULL,
                product_name VARCHAR(255) NOT NULL,
                customer_name VARCHAR(100) NOT NULL,
                customer_email VARCHAR(100),
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                review_title VARCHAR(200),
                review_text TEXT,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_product (product_id),
                INDEX idx_status (status),
                INDEX idx_rating (rating)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
            
            if ($conn->query($sql) === TRUE) {
                error_log("product_reviews table created successfully");
                
                // Insert sample data if products table has data
                $productsExist = $conn->query("SELECT COUNT(*) as count FROM products");
                
            } else {
                error_log("Table creation failed: " . $conn->error);
            }
        }
        return true;
    } catch (Exception $e) {
        error_log("Table initialization error: " . $e->getMessage());
        return false;
    }
}

// Initialize table
initializeReviewsTable($conn);

$action = $_GET['action'] ?? '';

// Add better error logging for missing action
if (empty($action)) {
    echo json_encode(['success' => false, 'message' => 'Action parameter is required']);
    exit;
}

switch ($action) {
    case 'list':
        getReviews();
        break;
    case 'create':
        createReview();
        break;
    case 'update':
        updateReview();
        break;
    case 'delete':
        deleteReview();
        break;
    case 'toggle-status':
        toggleReviewStatus();
        break;
    case 'product-suggestions':
        getProductSuggestions();
        break;
    case 'stats':
        getReviewStats();
        break;
    case 'get-product-id':
        getProductIdByName();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action: ' . $action]);
        break;
}

function getReviews() {
    global $conn;
    
    try {
        $search = $_GET['search'] ?? '';
        $rating = $_GET['rating'] ?? 'All';
        $status = $_GET['status'] ?? 'All';
        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;
        
        $query = "SELECT r.*, p.sku as product_sku 
                 FROM product_reviews r 
                 LEFT JOIN products p ON r.product_id = p.id 
                 WHERE 1=1";
        
        $params = [];
        $types = '';
        
        if (!empty($search)) {
            $query .= " AND (r.product_name LIKE ? OR r.customer_name LIKE ? OR r.review_title LIKE ?)";
            $searchParam = "%$search%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
            $types .= 'sss';
        }
        
        if ($rating !== 'All') {
            $query .= " AND r.rating = ?";
            $params[] = intval($rating);
            $types .= 'i';
        }
        
        if ($status !== 'All') {
            $query .= " AND r.status = ?";
            $params[] = $status;
            $types .= 's';
        }
        
        // Count query
        $countQuery = str_replace('r.*, p.sku as product_sku', 'COUNT(*) as total', $query);
        $countStmt = $conn->prepare($countQuery);
        if (!$countStmt) {
            throw new Exception("Prepare failed for count query: " . $conn->error);
        }
        
        if ($params) {
            $countStmt->bind_param($types, ...$params);
        }
        $countStmt->execute();
        $countResult = $countStmt->get_result()->fetch_assoc();
        $totalRows = $countResult['total'] ?? 0;
        $countStmt->close();
        
        // Main query with pagination
        $query .= " ORDER BY r.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $reviews = [];
        while ($row = $result->fetch_assoc()) {
            $reviews[] = [
                'id' => $row['id'],
                'product_id' => $row['product_id'],
                'product' => $row['product_name'],
                'product_sku' => $row['product_sku'],
                'customer' => $row['customer_name'],
                'customer_email' => $row['customer_email'],
                'title' => $row['review_title'],
                'review' => $row['review_text'],
                'rating' => intval($row['rating']),
                'date' => date('Y-m-d', strtotime($row['created_at'])),
                'status' => ucfirst($row['status']),
                'status_raw' => $row['status'],
                'created_at' => $row['created_at']
            ];
        }
        $stmt->close();
        
        echo json_encode([
            'success' => true,
            'data' => $reviews,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => ceil($totalRows / $limit),
                'totalRows' => $totalRows,
                'rowsPerPage' => $limit
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Get Reviews Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}

function getProductSuggestions() {
    global $conn;
    
    $search = $_GET['search'] ?? '';
    
    if (empty($search) || strlen($search) < 2) {
        echo json_encode(['success' => true, 'data' => []]);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("SELECT id, name, sku, base_price FROM products 
                               WHERE (name LIKE ? OR sku LIKE ?) 
                               AND status IN ('active', 'draft')
                               ORDER BY name ASC LIMIT 10");
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $searchParam = "%$search%";
        $stmt->bind_param("ss", $searchParam, $searchParam);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'sku' => $row['sku'],
                'price' => floatval($row['base_price'])
            ];
        }
        $stmt->close();
        
        echo json_encode([
            'success' => true,
            'data' => $products
        ]);
        
    } catch (Exception $e) {
        error_log("Product Suggestions Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to get suggestions: ' . $e->getMessage()]);
    }
}

function getProductIdByName() {
    global $conn;
    
    $productName = $_GET['name'] ?? '';
    
    if (empty($productName)) {
        echo json_encode(['success' => false, 'message' => 'Product name is required']);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("SELECT id, name, sku FROM products 
                               WHERE name = ? OR sku = ? 
                               LIMIT 1");
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("ss", $productName, $productName);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $product = $result->fetch_assoc();
            echo json_encode([
                'success' => true,
                'product_id' => $product['id'],
                'product_name' => $product['name'],
                'product_sku' => $product['sku']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Product not found'
            ]);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Get Product ID Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to get product ID: ' . $e->getMessage()]);
    }
}

function createReview() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validation
    if (empty($input['product']) || empty($input['customer']) || empty($input['rating'])) {
        echo json_encode(['success' => false, 'message' => 'Product, Customer, and Rating are required']);
        exit;
    }
    
    $rating = intval($input['rating']);
    if ($rating < 1 || $rating > 5) {
        echo json_encode(['success' => false, 'message' => 'Rating must be between 1-5']);
        exit;
    }
    
    try {
        // Get product ID from products table
        $productId = null;
        $productName = $input['product'];
        
        if (!empty($productName)) {
            $productStmt = $conn->prepare("SELECT id, name FROM products WHERE name = ? OR sku = ? LIMIT 1");
            if (!$productStmt) {
                throw new Exception("Prepare failed for product query: " . $conn->error);
            }
            
            $productStmt->bind_param("ss", $productName, $productName);
            $productStmt->execute();
            $productResult = $productStmt->get_result();
            
            if ($productResult->num_rows > 0) {
                $productRow = $productResult->fetch_assoc();
                $productId = $productRow['id'];
                $productName = $productRow['name']; // Use actual product name from database
            }
            $productStmt->close();
        }
        
        // Insert review - FIXED LINE 322
        $stmt = $conn->prepare("INSERT INTO product_reviews (
            product_id, product_name, customer_name, customer_email, 
            rating, review_title, review_text, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        
        if (!$stmt) {
            error_log("Prepare failed for INSERT: " . $conn->error);
            throw new Exception("Failed to prepare SQL statement: " . $conn->error);
        }
        
        $status = isset($input['status']) ? strtolower($input['status']) : 'pending';
        $customerEmail = $input['customer_email'] ?? '';
        $reviewTitle = $input['title'] ?? '';
        $reviewText = $input['review'] ?? '';
        
        $stmt->bind_param(
            "isssiiss", // FIXED: Correct number of parameters (8)
            $productId,           // integer
            $productName,         // string
            $input['customer'],   // string
            $customerEmail,       // string
            $rating,              // integer
            $reviewTitle,         // string
            $reviewText,          // string
            $status               // string
        );
        
        if ($stmt->execute()) {
            $reviewId = $conn->insert_id;
            
            // Return review with product info
            $reviewStmt = $conn->prepare("SELECT r.*, p.sku as product_sku FROM product_reviews r 
                                         LEFT JOIN products p ON r.product_id = p.id 
                                         WHERE r.id = ?");
            if ($reviewStmt) {
                $reviewStmt->bind_param("i", $reviewId);
                $reviewStmt->execute();
                $reviewResult = $reviewStmt->get_result()->fetch_assoc();
                $reviewStmt->close();
            } else {
                // Fallback if we can't get the full details
                $reviewResult = [
                    'id' => $reviewId,
                    'product_id' => $productId,
                    'product_name' => $productName,
                    'customer_name' => $input['customer'],
                    'customer_email' => $customerEmail,
                    'review_title' => $reviewTitle,
                    'review_text' => $reviewText,
                    'rating' => $rating,
                    'status' => $status,
                    'created_at' => date('Y-m-d H:i:s')
                ];
            }
            
            echo json_encode([
                'success' => true, 
                'message' => 'Review created successfully',
                'reviewId' => $reviewId,
                'product_id' => $productId,
                'review' => [
                    'id' => $reviewResult['id'],
                    'product_id' => $reviewResult['product_id'],
                    'product' => $reviewResult['product_name'],
                    'product_sku' => $reviewResult['product_sku'] ?? '',
                    'customer' => $reviewResult['customer_name'],
                    'customer_email' => $reviewResult['customer_email'],
                    'title' => $reviewResult['review_title'],
                    'review' => $reviewResult['review_text'],
                    'rating' => intval($reviewResult['rating']),
                    'status' => ucfirst($reviewResult['status']),
                    'date' => date('Y-m-d', strtotime($reviewResult['created_at']))
                ]
            ]);
        } else {
            throw new Exception("Execute failed: " . $stmt->error);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Create Review Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to create review: ' . $e->getMessage()]);
    }
}

function updateReview() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $reviewId = intval($input['id'] ?? 0);
    
    if ($reviewId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid review ID']);
        exit;
    }
    
    try {
        // Get product ID if product name is updated
        $productId = null;
        $productName = $input['product'] ?? null;
        
        if (!empty($productName)) {
            $productStmt = $conn->prepare("SELECT id, name FROM products WHERE name = ? OR sku = ? LIMIT 1");
            if (!$productStmt) {
                throw new Exception("Prepare failed for product query: " . $conn->error);
            }
            
            $productStmt->bind_param("ss", $productName, $productName);
            $productStmt->execute();
            $productResult = $productStmt->get_result();
            
            if ($productResult->num_rows > 0) {
                $productRow = $productResult->fetch_assoc();
                $productId = $productRow['id'];
                $productName = $productRow['name'];
            }
            $productStmt->close();
        }
        
        $allowedFields = [
            'product' => 'product_name',
            'customer' => 'customer_name',
            'customer_email' => 'customer_email',
            'rating' => 'rating',
            'title' => 'review_title',
            'review' => 'review_text',
            'status' => 'status'
        ];
        
        $fields = [];
        $params = [];
        $types = '';
        
        foreach ($allowedFields as $inputKey => $dbKey) {
            if (isset($input[$inputKey])) {
                $fields[] = "$dbKey = ?";
                
                if ($inputKey === 'rating') {
                    $params[] = intval($input[$inputKey]);
                    $types .= 'i';
                } elseif ($inputKey === 'status') {
                    $params[] = strtolower($input[$inputKey]);
                    $types .= 's';
                } else {
                    // Use updated product name from DB if available
                    $value = ($inputKey === 'product' && $productName !== null) ? $productName : $input[$inputKey];
                    $params[] = $value;
                    $types .= 's';
                }
            }
        }
        
        // Add product_id if found
        if ($productId !== null) {
            $fields[] = "product_id = ?";
            $params[] = $productId;
            $types .= 'i';
        }
        
        if (empty($fields)) {
            echo json_encode(['success' => false, 'message' => 'No fields to update']);
            exit;
        }
        
        $params[] = $reviewId;
        $types .= 'i';
        
        $query = "UPDATE product_reviews SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Review updated successfully',
                'product_id' => $productId
            ]);
        } else {
            throw new Exception("Execute failed: " . $stmt->error);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Update Review Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to update review: ' . $e->getMessage()]);
    }
}

function deleteReview() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $reviewId = intval($input['id'] ?? 0);
    
    if ($reviewId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid review ID']);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM product_reviews WHERE id = ?");
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("i", $reviewId);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Review deleted successfully'
            ]);
        } else {
            throw new Exception("Execute failed: " . $stmt->error);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Delete Review Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to delete review: ' . $e->getMessage()]);
    }
}

function toggleReviewStatus() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $reviewId = intval($input['id'] ?? 0);
    
    if ($reviewId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid review ID']);
        exit;
    }
    
    try {
        // Get current status
        $getStmt = $conn->prepare("SELECT status FROM product_reviews WHERE id = ?");
        if (!$getStmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $getStmt->bind_param("i", $reviewId);
        $getStmt->execute();
        $result = $getStmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Review not found']);
            exit;
        }
        
        $review = $result->fetch_assoc();
        $getStmt->close();
        
        // Toggle status
        $currentStatus = $review['status'];
        $newStatus = ($currentStatus === 'approved') ? 'rejected' : 'approved';
        
        $updateStmt = $conn->prepare("UPDATE product_reviews SET status = ? WHERE id = ?");
        if (!$updateStmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $updateStmt->bind_param("si", $newStatus, $reviewId);
        
        if ($updateStmt->execute()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Review status updated',
                'newStatus' => ucfirst($newStatus),
                'statusRaw' => $newStatus
            ]);
        } else {
            throw new Exception("Execute failed: " . $updateStmt->error);
        }
        
        $updateStmt->close();
        
    } catch (Exception $e) {
        error_log("Toggle Status Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to update status: ' . $e->getMessage()]);
    }
}

function getReviewStats() {
    global $conn;
    
    try {
        $stats = [];
        
        // Total reviews
        $totalStmt = $conn->query("SELECT COUNT(*) as total FROM product_reviews");
        if ($totalStmt) {
            $stats['total'] = intval($totalStmt->fetch_assoc()['total'] ?? 0);
        } else {
            $stats['total'] = 0;
        }
        
        // Average rating
        $avgStmt = $conn->query("SELECT AVG(rating) as average_rating FROM product_reviews");
        if ($avgStmt) {
            $avgResult = $avgStmt->fetch_assoc();
            $stats['averageRating'] = round(floatval($avgResult['average_rating'] ?? 0), 1);
        } else {
            $stats['averageRating'] = 0;
        }
        
        // Status distribution
        $statusStmt = $conn->query("SELECT status, COUNT(*) as count FROM product_reviews GROUP BY status");
        $stats['statusDistribution'] = [];
        if ($statusStmt) {
            while ($status = $statusStmt->fetch_assoc()) {
                $stats['statusDistribution'][] = [
                    'status' => ucfirst($status['status']),
                    'count' => intval($status['count'])
                ];
            }
        }
        
        // Rating distribution
        $ratingStmt = $conn->query("SELECT rating, COUNT(*) as count FROM product_reviews GROUP BY rating ORDER BY rating DESC");
        $stats['ratingDistribution'] = [];
        if ($ratingStmt) {
            while ($rating = $ratingStmt->fetch_assoc()) {
                $stats['ratingDistribution'][] = [
                    'rating' => intval($rating['rating']),
                    'count' => intval($rating['count'])
                ];
            }
        }
        
        // Recent reviews
        $recentStmt = $conn->query("SELECT COUNT(*) as recent FROM product_reviews WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
        if ($recentStmt) {
            $recentResult = $recentStmt->fetch_assoc();
            $stats['recentReviews'] = intval($recentResult['recent'] ?? 0);
        } else {
            $stats['recentReviews'] = 0;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $stats
        ]);
        
    } catch (Exception $e) {
        error_log("Review Stats Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to get stats: ' . $e->getMessage()]);
    }
}

// Close connection if it exists
if ($conn) {
    $conn->close();
}
?>