<?php
// api/create-order.php - Create Razorpay Order

require_once __DIR__ . '/../../database/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendError('Invalid request body');
}

$amount = isset($input['amount']) ? (float)$input['amount'] : 0;
$currency = isset($input['currency']) ? $input['currency'] : 'INR';
$productId = isset($input['product_id']) ? (int)$input['product_id'] : 0;
$productName = isset($input['product_name']) ? sanitize($conn, $input['product_name']) : '';
$quantity = isset($input['quantity']) ? (int)$input['quantity'] : 1;
$variant = isset($input['variant']) ? sanitize($conn, $input['variant']) : '';
$customer = isset($input['customer']) ? $input['customer'] : [];

if ($amount <= 0) {
    sendError('Invalid amount');
}

// Razorpay API call
$razorpayOrderId = createRazorpayOrder($amount, $currency, $productId);

if (!$razorpayOrderId) {
    sendError('Failed to create Razorpay order', 500);
}

// Save to database
$customerName = sanitize($conn, $customer['name'] ?? '');
$customerEmail = sanitize($conn, $customer['email'] ?? '');
$customerPhone = sanitize($conn, $customer['phone'] ?? '');
$customerAddress = sanitize($conn, $customer['address'] ?? '');
$customerCity = sanitize($conn, $customer['city'] ?? '');
$customerState = sanitize($conn, $customer['state'] ?? '');
$customerPincode = sanitize($conn, $customer['pincode'] ?? '');

$sql = "INSERT INTO orders (
            razorpay_order_id,
            product_id,
            product_name,
            quantity,
            variant,
            amount,
            currency,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            customer_city,
            customer_state,
            customer_pincode,
            status,
            created_at
        ) VALUES (
            '$razorpayOrderId',
            $productId,
            '$productName',
            $quantity,
            '$variant',
            $amount,
            '$currency',
            '$customerName',
            '$customerEmail',
            '$customerPhone',
            '$customerAddress',
            '$customerCity',
            '$customerState',
            '$customerPincode',
            'pending',
            NOW()
        )";

if (!$conn->query($sql)) {
    sendError('Failed to save order: ' . $conn->error, 500);
}

$orderId = $conn->insert_id;

$conn->close();

sendResponse([
    'success' => true,
    'order_id' => $razorpayOrderId,
    'amount' => $amount * 100,
    'currency' => $currency,
    'razorpay_key' => $_ENV['RAZORPAY_KEY_ID'],
    'db_order_id' => $orderId
]);

// Razorpay Order Creation Function
function createRazorpayOrder($amount, $currency, $productId) {
    global $_ENV;
    
    $keyId = $_ENV['RAZORPAY_KEY_ID'];
    $keySecret = $_ENV['RAZORPAY_KEY_SECRET'];
    
    $orderData = [
        'amount' => $amount * 100, // paise
        'currency' => $currency,
        'receipt' => 'order_' . time() . '_' . $productId,
        'notes' => [
            'product_id' => $productId
        ]
    ];
    
    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_USERPWD, $keyId . ':' . $keySecret);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        return $data['id'] ?? null;
    }
    
    return null;
}
?>