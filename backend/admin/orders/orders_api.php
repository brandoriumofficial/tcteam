<?php
require '../../database/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Check database connection
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        getOrders();
        break;
    case 'delete':
        deleteOrder();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

function getOrders() {
    global $conn;
    
    try {
        // Get parameters
        $search = $_GET['search'] ?? '';
        $status = $_GET['status'] ?? 'All';
        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;
        
        // Build main query
        $query = "SELECT o.* FROM orders o WHERE 1=1";
        $params = [];
        $types = '';
        
        // Search filter
        if (!empty($search)) {
            $query .= " AND (o.order_id LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ? OR o.customer_email LIKE ?)";
            $searchParam = "%$search%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
            $types .= 'ssss';
        }
        
        // Status filter
        if ($status !== 'All') {
            $query .= " AND o.order_status = ?";
            $params[] = $status;
            $types .= 's';
        }
        
        // Get total count
        $countQuery = str_replace('o.*', 'COUNT(*) as total', $query);
        $countStmt = $conn->prepare($countQuery);
        if ($params) {
            $countStmt->bind_param($types, ...$params);
        }
        $countStmt->execute();
        $countResult = $countStmt->get_result()->fetch_assoc();
        $totalRows = $countResult['total'];
        $countStmt->close();
        
        // Add ordering and pagination
        $query .= " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';
        
        // Execute main query
        $stmt = $conn->prepare($query);
        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            // Get order items
            $itemsStmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $itemsStmt->bind_param("s", $row['id']);
            $itemsStmt->execute();
            $itemsResult = $itemsStmt->get_result();
            
            $items = [];
            $itemCount = 0;
            while ($item = $itemsResult->fetch_assoc()) {
                $items[] = [
                    'name' => $item['product_name'],
                    'sku' => $item['sku'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'total' => $item['total']
                ];
                $itemCount++;
            }
            $itemsStmt->close();
            
            // Format order data
            $orders[] = [
                'id' => $row['order_id'],
                'date' => date('Y-m-d', strtotime($row['order_date'])),
                'customer' => [
                    'name' => $row['customer_name'],
                    'phone' => $row['customer_phone'],
                    'email' => $row['customer_email'],
                    'address' => $row['customer_address']
                ],
                'products' => $items,
                'moreItems' => max(0, $itemCount - 1),
                'financials' => [
                    'total' => floatval($row['total_amount']),
                    'discount' => floatval($row['discount_amount']),
                    'coupon' => $row['coupon_code']
                ],
                'payment' => [
                    'method' => $row['payment_method'],
                    'status' => $row['payment_status']
                ],
                'status' => $row['order_status']
            ];
        }
        $stmt->close();
        
        // Calculate pagination info
        $totalPages = ceil($totalRows / $limit);
        
        echo json_encode([
            'success' => true,
            'data' => $orders,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalRows' => $totalRows,
                'rowsPerPage' => $limit
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Orders API Error: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Server error occurred',
            'error' => $e->getMessage()
        ]);
    }
}

function deleteOrder() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = $input['orderId'] ?? '';
    
    if (empty($orderId)) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        exit;
    }
    
    try {
        // Start transaction
        $conn->begin_transaction();
        
        // First delete order items
        $deleteItemsStmt = $conn->prepare("DELETE FROM order_items WHERE order_id = ?");
        $deleteItemsStmt->bind_param("s", $orderId);
        $deleteItemsStmt->execute();
        $deleteItemsStmt->close();
        
        // Then delete order
        $deleteOrderStmt = $conn->prepare("DELETE FROM orders WHERE order_id = ?");
        $deleteOrderStmt->bind_param("s", $orderId);
        $deleteOrderStmt->execute();
        $affectedRows = $deleteOrderStmt->affected_rows;
        $deleteOrderStmt->close();
        
        $conn->commit();
        
        if ($affectedRows > 0) {
            echo json_encode(['success' => true, 'message' => 'Order deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Order not found']);
        }
        
    } catch (Exception $e) {
        $conn->rollback();
        error_log("Delete Order Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to delete order']);
    }
}

$conn->close();
?>