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

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        getProducts();
        break;
    case 'update-stock':
        updateStock();
        break;
    case 'stats':
        getStats();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

function getProducts() {
    global $conn;
    
    try {
        $search = $_GET['search'] ?? '';
        $category = $_GET['category'] ?? 'All';
        $status = $_GET['status'] ?? 'All';
        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;
        
        $query = "SELECT * FROM products WHERE status IN ('active', 'draft')";
        $params = [];
        $types = '';
        
        if (!empty($search)) {
            $query .= " AND (name LIKE ? OR sku LIKE ? OR brand LIKE ?)";
            $searchParam = "%$search%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
            $types .= 'sss';
        }
        
        if ($category !== 'All') {
            $query .= " AND (category LIKE ?)";
            $catParam = "%$category%";
            $params[] = $catParam;
            $types .= 's';
        }
        
        // Stock Status filter with new enum values
        if ($status !== 'All') {
            if ($status === 'In Stock') {
                $query .= " AND stock_status = 'In Stock'";
            } elseif ($status === 'Low Stock') {
                $query .= " AND stock_status = 'Low Stock'";
            } elseif ($status === 'Out of Stock') {
                $query .= " AND stock_status = 'Out of Stock'";
            }
        }
        
        // Get total count
        $countQuery = str_replace('*', 'COUNT(*) as total', $query);
        $countStmt = $conn->prepare($countQuery);
        if ($params) {
            $countStmt->bind_param($types, ...$params);
        }
        $countStmt->execute();
        $countResult = $countStmt->get_result()->fetch_assoc();
        $totalRows = $countResult['total'];
        $countStmt->close();
        
        // Add pagination
        $query .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';
        
        // Execute
        $stmt = $conn->prepare($query);
        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $products = [];
        while ($row = $result->fetch_assoc()) {
            // Get actual DB status (now includes 'Low Stock')
            $dbStatus = $row['stock_status'];
            $stockQty = intval($row['stock_qty']);
            $lowThreshold = intval($row['low_stock_threshold']);
            
            // Parse category
            $categoryData = $row['category'];
            $categoryArray = [];
            if (!empty($categoryData)) {
                if ($categoryData[0] === '[') {
                    $categoryArray = json_decode($categoryData, true) ?: [];
                } else {
                    $categoryArray = [$categoryData];
                }
            }
            
            $products[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'sku' => $row['sku'],
                'brand' => $row['brand'],
                'category' => $categoryArray,
                'base_price' => floatval($row['base_price']),
                'sale_price' => floatval($row['sale_price']),
                'stock_qty' => $stockQty,
                'stock_status' => $dbStatus, // Actual DB status
                'low_stock_threshold' => $lowThreshold,
                'status' => $row['status'],
                'feature_image' => $row['feature_image'],
                'created_at' => $row['created_at']
            ];
        }
        $stmt->close();
        
        // Get categories
        $categories = ['All'];
        $catStmt = $conn->query("SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' AND status IN ('active', 'draft')");
        while ($cat = $catStmt->fetch_assoc()) {
            if (!empty($cat['category'])) {
                if ($cat['category'][0] === '[') {
                    $catArray = json_decode($cat['category'], true);
                    if (is_array($catArray)) {
                        foreach ($catArray as $c) {
                            if (!empty($c) && !in_array($c, $categories)) {
                                $categories[] = $c;
                            }
                        }
                    }
                } else {
                    if (!in_array($cat['category'], $categories)) {
                        $categories[] = $cat['category'];
                    }
                }
            }
        }
        $catStmt->close();
        
        echo json_encode([
            'success' => true,
            'data' => $products,
            'categories' => array_unique($categories),
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => ceil($totalRows / $limit),
                'totalRows' => $totalRows,
                'rowsPerPage' => $limit
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
}

function updateStock() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $productId = intval($input['id'] ?? 0);
    $quantity = intval($input['quantity'] ?? 0);
    
    if ($productId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
        exit;
    }
    
    try {
        // Start transaction
        $conn->begin_transaction();
        
        // Get current stock and threshold
        $getStmt = $conn->prepare("SELECT stock_qty, low_stock_threshold FROM products WHERE id = ? FOR UPDATE");
        $getStmt->bind_param("i", $productId);
        $getStmt->execute();
        $result = $getStmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            exit;
        }
        
        $product = $result->fetch_assoc();
        $getStmt->close();
        
        // Calculate new stock
        $newStock = max(0, $product['stock_qty'] + $quantity);
        $threshold = $product['low_stock_threshold'];
        
        // Determine stock status based on rules
        $stockStatus = 'Out of Stock';
        if ($newStock > 0) {
            if ($newStock <= $threshold) {
                $stockStatus = 'Low Stock'; // Now this is valid in enum
            } else {
                $stockStatus = 'In Stock';
            }
        }
        
        // Update product with new stock and auto-calculated status
        $updateStmt = $conn->prepare("UPDATE products SET stock_qty = ?, stock_status = ? WHERE id = ?");
        $updateStmt->bind_param("isi", $newStock, $stockStatus, $productId);
        $updateStmt->execute();
        
        if ($updateStmt->affected_rows > 0) {
            $conn->commit();
            
            echo json_encode([
                'success' => true, 
                'message' => 'Stock updated successfully',
                'newStock' => $newStock,
                'stockStatus' => $stockStatus
            ]);
        } else {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to update stock']);
        }
        
        $updateStmt->close();
        
    } catch (Exception $e) {
        $conn->rollback();
        error_log("Update Stock Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to update stock: ' . $e->getMessage()]);
    }
}

function getStats() {
    global $conn;
    
    try {
        $stats = [];
        
        // Get all products
        $allStmt = $conn->query("SELECT stock_qty, low_stock_threshold, stock_status FROM products WHERE status IN ('active', 'draft')");
        
        $total = 0;
        $inStock = 0;
        $lowStock = 0;
        $outOfStock = 0;
        
        while ($row = $allStmt->fetch_assoc()) {
            $total++;
            $stockQty = intval($row['stock_qty']);
            $threshold = intval($row['low_stock_threshold']);
            
            // Count based on actual DB status
            $status = $row['stock_status'];
            
            if ($status === 'In Stock') {
                $inStock++;
            } elseif ($status === 'Low Stock') {
                $lowStock++;
            } elseif ($status === 'Out of Stock') {
                $outOfStock++;
            }
        }
        $allStmt->close();
        
        $stats['total'] = $total;
        $stats['inStock'] = $inStock;
        $stats['lowStock'] = $lowStock;
        $stats['outOfStock'] = $outOfStock;
        
        // Total stock value
        $valueStmt = $conn->query("SELECT SUM(stock_qty * base_price) as total_value FROM products WHERE status IN ('active', 'draft')");
        $valueResult = $valueStmt->fetch_assoc();
        $stats['totalValue'] = floatval($valueResult['total_value'] ?? 0);
        
        // Total items
        $totalItemsStmt = $conn->query("SELECT SUM(stock_qty) as total_items FROM products WHERE status IN ('active', 'draft')");
        $totalItemsResult = $totalItemsStmt->fetch_assoc();
        $stats['totalItems'] = intval($totalItemsResult['total_items'] ?? 0);
        
        echo json_encode([
            'success' => true,
            'data' => $stats
        ]);
        
    } catch (Exception $e) {
        error_log("Stats Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to get stats']);
    }
}

$conn->close();
?>