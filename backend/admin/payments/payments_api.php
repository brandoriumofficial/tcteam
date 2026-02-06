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
        getPayments();
        break;
    case 'update':
        updatePayment();
        break;
    case 'confirm-cod':
        confirmCOD();
        break;
    case 'generate-invoice':
        generateInvoice();
        break;
    case 'stats':
        getPaymentStats();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

function getPayments() {
    global $conn;
    
    try {
        $search = $_GET['search'] ?? '';
        $method = $_GET['method'] ?? 'All';
        $status = $_GET['status'] ?? 'All';
        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;
        
        // Build base query for data
        $query = "SELECT o.* FROM orders o WHERE 1=1";
        
        // Build count query separately
        $countQuery = "SELECT COUNT(*) as total FROM orders WHERE 1=1";
        
        $params = [];
        $types = '';
        
        // Search filter
        if (!empty($search)) {
            $searchParam = "%$search%";
            $query .= " AND (order_id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR customer_email LIKE ?)";
            $countQuery .= " AND (order_id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR customer_email LIKE ?)";
            $params = array_fill(0, 4, $searchParam);
            $types = 'ssss';
        }
        
        // Payment method filter
        if ($method !== 'All') {
            $query .= " AND payment_method = ?";
            $countQuery .= " AND payment_method = ?";
            $params[] = $method;
            $types .= 's';
        }
        
        // Payment status filter
        if ($status !== 'All') {
            $query .= " AND payment_status = ?";
            $countQuery .= " AND payment_status = ?";
            $params[] = $status;
            $types .= 's';
        }
        
        // Get total count FIRST
        $countStmt = $conn->prepare($countQuery);
        if ($params && $types) {
            $countStmt->bind_param($types, ...$params);
        }
        $countStmt->execute();
        $countResult = $countStmt->get_result()->fetch_assoc();
        $totalRows = $countResult['total'] ?? 0;
        $countStmt->close();
        
        // Reset params for main query
        $params = [];
        $types = '';
        
        // Rebuild params for main query
        if (!empty($search)) {
            $searchParam = "%$search%";
            $params = array_fill(0, 4, $searchParam);
            $types = 'ssss';
        }
        if ($method !== 'All') {
            $params[] = $method;
            $types .= 's';
        }
        if ($status !== 'All') {
            $params[] = $status;
            $types .= 's';
        }
        
        // Add pagination to main query
        $query .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
        
        $payments = [];
        while ($row = $result->fetch_assoc()) {
            // Get order items
            $items = [];
            if (isset($row['order_id'])) {
                $itemsStmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ?");
                $itemsStmt->bind_param("s", $row['id']);
                $itemsStmt->execute();
                $itemsResult = $itemsStmt->get_result();
                
                while ($item = $itemsResult->fetch_assoc()) {
                    $items[] = $item;
                }
                $itemsStmt->close();
            }
            
            // Get products list
            $products_list = '';
            if (!empty($items)) {
                $productNames = array_map(function($item) {
                    return $item['product_name'] . ' (x' . $item['qty'] . ')';
                }, $items);
                $products_list = implode(', ', $productNames);
            }
            
            // Check if COD confirmed
            $codConfirmed = isset($row['payment_verified']) ? (bool)$row['payment_verified'] : false;
            $invoice_generated = isset($row['invoice_generated']) ? (bool)$row['invoice_generated'] : false;
            
            $payments[] = [
                'id' => $row['order_id'] ?? $row['id'],
                'order_id' => $row['order_id'] ?? $row['id'],
                'customer' => $row['customer_name'] ?? '',
                'customer_phone' => $row['customer_phone'] ?? '',
                'customer_email' => $row['customer_email'] ?? '',
                'method' => $row['payment_method'] ?? '',
                'amount' => floatval($row['final_amount'] ?? 0),
                'status' => $row['payment_status'] ?? '',
                'date' => isset($row['order_date']) ? date('Y-m-d', strtotime($row['order_date'])) : '',
                'codConfirmed' => $codConfirmed,
                'order_status' => $row['order_status'] ?? '',
                'coupon_code' => $row['coupon_code'] ?? '',
                'discount_amount' => floatval($row['discount_amount'] ?? 0),
                'total_amount' => floatval($row['total_amount'] ?? 0),
                'items' => $items,
                'products_list' => $products_list,
                'invoice_generated' => $invoice_generated
            ];
        }
        $stmt->close();
        
        // Calculate total pages
        $totalPages = $totalRows > 0 ? ceil($totalRows / $limit) : 0;
        
        echo json_encode([
            'success' => true,
            'data' => $payments,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalRows' => $totalRows,
                'rowsPerPage' => $limit
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Payments API Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}

function updatePayment() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = $input['order_id'] ?? '';
    
    if (empty($orderId)) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        exit;
    }
    
    try {
        $allowedFields = ['payment_status', 'payment_method', 'order_status'];
        $fields = [];
        $params = [];
        $types = '';
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $fields[] = "$field = ?";
                $params[] = $input[$field];
                $types .= 's';
            }
        }
        
        if (empty($fields)) {
            echo json_encode(['success' => false, 'message' => 'No fields to update']);
            exit;
        }
        
        $params[] = $orderId;
        $types .= 's';
        
        $query = "UPDATE orders SET " . implode(', ', $fields) . " WHERE order_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Payment updated successfully'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update payment']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Update Payment Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to update payment']);
    }
}

function confirmCOD() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = $input['order_id'] ?? '';
    
    if (empty($orderId)) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        exit;
    }
    
    try {
        // Check if payment_verified column exists
        $checkColumn = $conn->query("SHOW COLUMNS FROM orders LIKE 'payment_verified'");
        
        if ($checkColumn->num_rows === 0) {
            // Add column if not exists
            $conn->query("ALTER TABLE orders ADD COLUMN payment_verified BOOLEAN DEFAULT FALSE");
        }
        
        // Toggle COD confirmation
        $stmt = $conn->prepare("UPDATE orders SET payment_verified = NOT payment_verified WHERE order_id = ?");
        $stmt->bind_param("s", $orderId);
        
        if ($stmt->execute()) {
            // Get updated status
            $statusStmt = $conn->prepare("SELECT payment_verified FROM orders WHERE order_id = ?");
            $statusStmt->bind_param("s", $orderId);
            $statusStmt->execute();
            $statusResult = $statusStmt->get_result()->fetch_assoc();
            $statusStmt->close();
            
            $isConfirmed = isset($statusResult['payment_verified']) ? (bool)$statusResult['payment_verified'] : false;
            
            echo json_encode([
                'success' => true, 
                'message' => $isConfirmed ? 'COD confirmed successfully' : 'COD confirmation removed',
                'codConfirmed' => $isConfirmed
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to confirm COD']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Confirm COD Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to confirm COD']);
    }
}

function generateInvoice() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = $input['order_id'] ?? '';
    
    if (empty($orderId)) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        exit;
    }
    
    try {
        // Check if invoice_generated column exists
        $checkColumn = $conn->query("SHOW COLUMNS FROM orders LIKE 'invoice_generated'");
        
        if ($checkColumn->num_rows === 0) {
            // Add column if not exists
            $conn->query("ALTER TABLE orders ADD COLUMN invoice_generated BOOLEAN DEFAULT FALSE");
        }
        
        // Mark invoice as generated
        $stmt = $conn->prepare("UPDATE orders SET invoice_generated = TRUE WHERE order_id = ?");
        $stmt->bind_param("s", $orderId);
        
        if ($stmt->execute()) {
            // Get order details for invoice
            $orderStmt = $conn->prepare("SELECT o.* FROM orders o WHERE order_id = ?");
            $orderStmt->bind_param("s", $orderId);
            $orderStmt->execute();
            $orderResult = $orderStmt->get_result()->fetch_assoc();
            $orderStmt->close();
            
            // Get order items
            $itemsStmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $itemsStmt->bind_param("s", $orderId);
            $itemsStmt->execute();
            $itemsResult = $itemsStmt->get_result();
            
            $items = [];
            while ($item = $itemsResult->fetch_assoc()) {
                $items[] = $item['product_name'] . ' x' . $item['qty'];
            }
            $itemsStmt->close();
            
            // Create invoice data
            $invoiceData = [
                'invoice_id' => 'INV-' . time() . '-' . rand(1000, 9999),
                'order_id' => $orderId,
                'customer_name' => $orderResult['customer_name'] ?? '',
                'customer_email' => $orderResult['customer_email'] ?? '',
                'customer_phone' => $orderResult['customer_phone'] ?? '',
                'date' => date('Y-m-d H:i:s'),
                'amount' => floatval($orderResult['final_amount'] ?? 0),
                'discount' => floatval($orderResult['discount_amount'] ?? 0),
                'payment_method' => $orderResult['payment_method'] ?? '',
                'products' => implode(', ', $items)
            ];
            
            echo json_encode([
                'success' => true, 
                'message' => 'Invoice generated successfully',
                'invoice' => $invoiceData
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to generate invoice']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Generate Invoice Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to generate invoice']);
    }
}

function getPaymentStats() {
    global $conn;
    
    try {
        $stats = [];
        
        // Total payments
        $totalStmt = $conn->query("SELECT COUNT(*) as total FROM orders");
        $totalResult = $totalStmt->fetch_assoc();
        $stats['total'] = intval($totalResult['total'] ?? 0);
        
        // Total amount
        $amountStmt = $conn->query("SELECT SUM(final_amount) as total_amount FROM orders WHERE payment_status = 'Paid'");
        $amountResult = $amountStmt->fetch_assoc();
        $stats['totalAmount'] = floatval($amountResult['total_amount'] ?? 0);
        
        // Payment methods distribution
        $methodsStmt = $conn->query("SELECT payment_method, COUNT(*) as count FROM orders GROUP BY payment_method");
        $stats['methods'] = [];
        while ($method = $methodsStmt->fetch_assoc()) {
            $stats['methods'][] = $method;
        }
        
        // Payment status distribution
        $statusStmt = $conn->query("SELECT payment_status, COUNT(*) as count FROM orders GROUP BY payment_status");
        $stats['statuses'] = [];
        while ($status = $statusStmt->fetch_assoc()) {
            $stats['statuses'][] = $status;
        }
        
        // Recent COD pending
        $codPendingStmt = $conn->query("SELECT COUNT(*) as cod_pending FROM orders WHERE payment_method = 'COD' AND payment_status = 'Pending'");
        $codResult = $codPendingStmt->fetch_assoc();
        $stats['codPending'] = intval($codResult['cod_pending'] ?? 0);
        
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