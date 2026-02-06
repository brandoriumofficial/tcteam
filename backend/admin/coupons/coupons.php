<?php
// डेटाबेस कनेक्शन फाइल
require '../../database/db.php';

// Headers सेट करें
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight requests हैंडल करें
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---------------------------------------------------------
// AUTO TABLE CREATION LOGIC (टेबल अपने आप बनाने का कोड)
// ---------------------------------------------------------
$tableCreationQuery = "CREATE TABLE IF NOT EXISTS coupons (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) DEFAULT 0.00,
    min_purchase DECIMAL(10, 2) DEFAULT 0.00,
    category VARCHAR(100) DEFAULT 'All',
    usage_limit INT(11) DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active',
    start_date DATE NULL,
    expiry_date DATE NULL,
    tags JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($tableCreationQuery)) {
    echo json_encode(['success' => false, 'message' => 'Table creation failed: ' . $conn->error]);
    exit();
}
// ---------------------------------------------------------

$method = $_SERVER['REQUEST_METHOD'];

// Response array शुरू करें
$response = ['success' => false, 'message' => '', 'data' => null];

try {
    switch ($method) {
        case 'GET':
            $sql = "SELECT * FROM coupons ORDER BY id DESC";
            $result = $conn->query($sql);
            
            if ($result) {
                $coupons = [];
                while ($row = $result->fetch_assoc()) {
                    // JSON fields को डिकोड करें (tags)
                    if (isset($row['tags']) && $row['tags']) {
                        // चेक करें कि यह पहले से array तो नहीं है (कुछ drivers में auto convert होता है)
                        if (is_string($row['tags'])) {
                            $row['tags'] = json_decode($row['tags'], true);
                        }
                    } else {
                        $row['tags'] = []; // अगर खाली है तो खाली array दें
                    }
                    $coupons[] = $row;
                }
                $response = [
                    'success' => true,
                    'message' => 'Coupons fetched successfully',
                    'data' => $coupons
                ];
            } else {
                $response['message'] = 'Failed to fetch coupons: ' . $conn->error;
            }
            break;
            
        case 'POST':
            // JSON इनपुट लें
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                $response['message'] = 'Invalid JSON input';
                break;
            }
            
            // जरूरी फील्ड्स चेक करें
            if (!isset($input['code']) || empty($input['code'])) {
                $response['message'] = 'Coupon code is required';
                break;
            }
            
            $sql = "INSERT INTO coupons (code, discount_type, discount_value, min_purchase, category, usage_limit, status, start_date, expiry_date, tags) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $conn->prepare($sql);
            
            if (!$stmt) {
                $response['message'] = 'Prepare failed: ' . $conn->error;
                break;
            }
            
            // डेटा तैयार करें
            $code = $input['code'];
            $discount_type = $input['discountType'] ?? $input['discount_type'] ?? 'percentage';
            $discount_value = floatval($input['discountValue'] ?? $input['discount_value'] ?? 0);
            $min_purchase = floatval($input['minPurchase'] ?? $input['min_purchase'] ?? 0);
            $category = $input['category'] ?? 'All';
            $usage_limit = intval($input['usageLimit'] ?? $input['usage_limit'] ?? 100);
            $status = $input['status'] ?? 'active';
            $start_date = $input['startDate'] ?? $input['start_date'] ?? date('Y-m-d');
            $expiry_date = $input['expiryDate'] ?? $input['expiry_date'] ?? date('Y-m-d', strtotime('+30 days'));
            // Tags को JSON string में बदलें
            $tags = isset($input['tags']) ? json_encode($input['tags']) : '[]';
            
            // पैरामीटर्स Bind करें
            // s=string, d=double(float), i=integer
            $stmt->bind_param(
                'ssddssisss',
                $code,
                $discount_type,
                $discount_value,
                $min_purchase,
                $category,
                $usage_limit,
                $status,
                $start_date,
                $expiry_date,
                $tags
            );
            
            if ($stmt->execute()) {
                $response = [
                    'success' => true,
                    'message' => 'Coupon created successfully',
                    'id' => $stmt->insert_id
                ];
            } else {
                $response['message'] = 'Failed to create coupon: ' . $stmt->error;
            }
            $stmt->close();
            break;
            
        case 'PUT':
            // JSON इनपुट लें
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['id'])) {
                $response['message'] = 'Invalid input or missing ID';
                break;
            }
            
            $sql = "UPDATE coupons SET 
                    code = ?, 
                    discount_type = ?, 
                    discount_value = ?, 
                    min_purchase = ?, 
                    category = ?, 
                    usage_limit = ?, 
                    status = ?, 
                    start_date = ?, 
                    expiry_date = ?, 
                    tags = ? 
                    WHERE id = ?";
            
            $stmt = $conn->prepare($sql);
            
            if (!$stmt) {
                $response['message'] = 'Prepare failed: ' . $conn->error;
                break;
            }
            
            // डेटा तैयार करें
            $id = intval($input['id']);
            $code = $input['code'];
            $discount_type = $input['discountType'] ?? $input['discount_type'] ?? 'percentage';
            $discount_value = floatval($input['discountValue'] ?? $input['discount_value'] ?? 0);
            $min_purchase = floatval($input['minPurchase'] ?? $input['min_purchase'] ?? 0);
            $category = $input['category'] ?? 'All';
            $usage_limit = intval($input['usageLimit'] ?? $input['usage_limit'] ?? 100);
            $status = $input['status'] ?? 'active';
            $start_date = $input['startDate'] ?? $input['start_date'] ?? date('Y-m-d');
            $expiry_date = $input['expiryDate'] ?? $input['expiry_date'] ?? date('Y-m-d', strtotime('+30 days'));
            $tags = isset($input['tags']) ? json_encode($input['tags']) : '[]';
            
            // पैरामीटर्स Bind करें
            $stmt->bind_param(
                'ssddssisssi',
                $code,
                $discount_type,
                $discount_value,
                $min_purchase,
                $category,
                $usage_limit,
                $status,
                $start_date,
                $expiry_date,
                $tags,
                $id
            );
            
            if ($stmt->execute()) {
                $response = [
                    'success' => true,
                    'message' => 'Coupon updated successfully'
                ];
            } else {
                $response['message'] = 'Failed to update coupon: ' . $stmt->error;
            }
            $stmt->close();
            break;
            
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                // कभी-कभी DELETE requests JSON body में भी ID भेजते हैं
                $input = json_decode(file_get_contents('php://input'), true);
                $id = $input['id'] ?? null;
            }

            if (!$id) {
                $response['message'] = 'Missing ID parameter';
                break;
            }
            
            $sql = "DELETE FROM coupons WHERE id = ?";
            $stmt = $conn->prepare($sql);
            
            if (!$stmt) {
                $response['message'] = 'Prepare failed: ' . $conn->error;
                break;
            }
            
            $stmt->bind_param('i', $id);
            
            if ($stmt->execute()) {
                $response = [
                    'success' => true,
                    'message' => 'Coupon deleted successfully'
                ];
            } else {
                $response['message'] = 'Failed to delete coupon: ' . $stmt->error;
            }
            $stmt->close();
            break;
            
        default:
            $response['message'] = 'Method not allowed';
            http_response_code(405);
            break;
    }
} catch (Exception $e) {
    $response['message'] = 'Server error: ' . $e->getMessage();
    http_response_code(500);
}

// कनेक्शन बंद करें
$conn->close();

// JSON रिस्पांस भेजें
echo json_encode($response);
?>