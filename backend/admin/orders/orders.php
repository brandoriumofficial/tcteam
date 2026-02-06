<?php
require '../../database/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// --- AUTO CREATE ORDERS TABLE ---
$ordersTable = "CREATE TABLE IF NOT EXISTS orders (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    total_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    order_status VARCHAR(50),
    order_date DATE,
    coupon_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($ordersTable);

// --- AUTO CREATE ORDER ITEMS TABLE ---
$itemsTable = "CREATE TABLE IF NOT EXISTS order_items (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    order_id INT(11),
    product_name VARCHAR(255),
    sku VARCHAR(50),
    price DECIMAL(10,2),
    qty INT(11),
    total DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
)";
$conn->query($itemsTable);
// ----------------------------------

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid Data']);
    exit;
}

$cust = $input['customer'];
$fin = $input['financials'];
$pay = $input['payment'];

// 1. Insert Order
$sql = "INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, order_date, coupon_code) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssdddsssss", 
    $cust['name'], 
    $cust['phone'], 
    $cust['address'], 
    $fin['subtotal'], 
    $fin['couponDiscount'], // Frontend se aayega
    $fin['grandTotal'], 
    $pay['method'], 
    $pay['status'], 
    $input['orderStatus'], 
    $input['date'],
    $fin['couponCode']
);

if ($stmt->execute()) {
    $orderId = $stmt->insert_id;

    // 2. Insert Items
    $itemSql = "INSERT INTO order_items (order_id, product_name, sku, price, qty, total) VALUES (?, ?, ?, ?, ?, ?)";
    $itemStmt = $conn->prepare($itemSql);

    foreach ($input['items'] as $item) {
        $itemStmt->bind_param("issdid", 
            $orderId, 
            $item['name'], 
            $item['sku'], 
            $item['newPrice'], 
            $item['qty'], 
            $item['total']
        );
        $itemStmt->execute();
    }

    echo json_encode(['success' => true, 'message' => 'Order Created Successfully', 'order_id' => $orderId]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed: ' . $conn->error]);
}

$conn->close();
?>