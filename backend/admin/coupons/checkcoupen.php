<?php
require '../../database/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// JSON input को पढ़ें और validate करें
$input = json_decode(file_get_contents('php://input'), true);

// Input validation
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$code = trim($input['code'] ?? '');
$cartTotal = floatval($input['cartTotal'] ?? 0);

if (empty($code)) {
    echo json_encode(['success' => false, 'message' => 'Coupon code is required']);
    exit;
}

if ($cartTotal <= 0) {
    echo json_encode(['success' => false, 'message' => 'Cart total must be greater than zero']);
    exit;
}

// Check database connection
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

try {
    // कूपन ढूँढें - status = 'active' use करें (not 1)
    $stmt = $conn->prepare("SELECT * FROM coupons WHERE code = ? LIMIT 1");
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid Coupon Code']);
        exit;
    }

    $coupon = $result->fetch_assoc();
    $today = date('Y-m-d');

    // 1. Date validations
    if (!empty($coupon['start_date']) && $coupon['start_date'] > $today) {
        echo json_encode(['success' => false, 'message' => 'Coupon is not active yet']);
        exit;
    }

    if (!empty($coupon['expiry_date']) && $coupon['expiry_date'] < $today) {
        echo json_encode(['success' => false, 'message' => 'Coupon expired']);
        exit;
    }

    // 2. Minimum purchase validation
    if ($cartTotal < $coupon['min_purchase']) {
        echo json_encode([
            'success' => false, 
            'message' => "Minimum purchase of ₹{$coupon['min_purchase']} required"
        ]);
        exit;
    }

    // 3. Usage limit validation (अगर डेटाबेस में है)
    if (isset($coupon['usage_limit']) && $coupon['usage_limit'] > 0) {
        // Check if orders table exists and has coupon_code column
        $usageStmt = $conn->prepare("SELECT COUNT(*) as used_count FROM orders WHERE coupon_code = ?");
        if ($usageStmt) {
            $usageStmt->bind_param("s", $code);
            $usageStmt->execute();
            $usageResult = $usageStmt->get_result()->fetch_assoc();
            $usageStmt->close();
            
            if ($usageResult['used_count'] >= $coupon['usage_limit']) {
                echo json_encode(['success' => false, 'message' => 'Coupon usage limit reached']);
                exit;
            }
        }
    }

    // 4. डिस्काउंट कैलकुलेट करें
    $discountAmount = 0;
    
    if ($coupon['discount_type'] === 'percentage') {
        $discountAmount = ($cartTotal * $coupon['discount_value']) / 100;
        
        // For percentage coupons, ensure discount doesn't exceed cart total
        $discountAmount = min($discountAmount, $cartTotal);
    } else {
        // For fixed discount
        $discountAmount = $coupon['discount_value'];
        
        // Fixed discount को cart total से ज्यादा नहीं होना चाहिए
        $discountAmount = min($discountAmount, $cartTotal);
    }

    // Final amount calculation
    $finalAmount = max(0, $cartTotal - $discountAmount);

    // Response
    echo json_encode([
        'success' => true, 
        'message' => 'Coupon Applied Successfully!',
        'data' => [
            'code' => $coupon['code'],
            'discount_amount' => round($discountAmount, 2),
            'discount_type' => $coupon['discount_type'],
            'discount_value' => $coupon['discount_value'],
            'original_total' => round($cartTotal, 2),
            'final_amount' => round($finalAmount, 2),
            'min_purchase' => $coupon['min_purchase']
        ]
    ]);

} catch (Exception $e) {
    error_log("Coupon validation error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error occurred: ' . $e->getMessage()]);
} finally {
    if (isset($stmt) && is_object($stmt)) $stmt->close();
    if (isset($usageStmt) && is_object($usageStmt)) $usageStmt->close();
    if (isset($conn)) $conn->close();
}
?>