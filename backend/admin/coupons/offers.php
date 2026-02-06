<?php
require '../../database/db.php';

/* ================== HEADERS ================== */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* ================== AUTO CREATE TABLE ================== */
$createTableSQL = "
CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    offer_type VARCHAR(50),
    discount_details VARCHAR(255),
    category VARCHAR(100),
    products JSON,
    status VARCHAR(20) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    banner_image VARCHAR(255),
    tags JSON,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($createTableSQL);

/* ================== RESPONSE ================== */
$response = [
    'success' => false,
    'message' => '',
    'data' => null
];

$method = $_SERVER['REQUEST_METHOD'];

try {

    /* ================== GET ================== */
    if ($method === 'GET') {

        $result = $conn->query("SELECT * FROM offers ORDER BY priority ASC");

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $row['products'] = $row['products'] ? json_decode($row['products'], true) : [];
            $row['tags']     = $row['tags'] ? json_decode($row['tags'], true) : [];
            $data[] = $row;
        }

        $response = [
            'success' => true,
            'data' => $data
        ];
    }

    /* ================== POST ================== */
    elseif ($method === 'POST') {

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            throw new Exception("Invalid JSON");
        }

        $name = $input['name'];
        $description = $input['description'] ?? '';
        $offer_type = $input['offer_type'] ?? '';
        $discount_details = $input['discount_details'] ?? '';
        $category = $input['category'] ?? '';
        $products = json_encode($input['products'] ?? []);
        $status = $input['status'] ?? 'active';
        $start_date = $input['start_date'] ?? date('Y-m-d');
        $end_date = $input['end_date'] ?? date('Y-m-d', strtotime('+30 days'));
        $banner_image = $input['banner_image'] ?? '';
        $tags = json_encode($input['tags'] ?? []);
        $priority = (int)($input['priority'] ?? 0);

        $sql = "INSERT INTO offers
        (name, description, offer_type, discount_details, category, products, status, start_date, end_date, banner_image, tags, priority)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "sssssssssssi",
            $name,
            $description,
            $offer_type,
            $discount_details,
            $category,
            $products,
            $status,
            $start_date,
            $end_date,
            $banner_image,
            $tags,
            $priority
        );

        $stmt->execute();

        $response = [
            'success' => true,
            'message' => 'Offer created',
            'id' => $stmt->insert_id
        ];
    }

    /* ================== PUT ================== */
    elseif ($method === 'PUT') {

        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            throw new Exception("ID required");
        }

        $id = (int)$input['id'];
        $name = $input['name'];
        $description = $input['description'] ?? '';
        $offer_type = $input['offer_type'] ?? '';
        $discount_details = $input['discount_details'] ?? '';
        $category = $input['category'] ?? '';
        $products = json_encode($input['products'] ?? []);
        $status = $input['status'] ?? 'active';
        $start_date = $input['start_date'] ?? date('Y-m-d');
        $end_date = $input['end_date'] ?? date('Y-m-d', strtotime('+30 days'));
        $banner_image = $input['banner_image'] ?? '';
        $tags = json_encode($input['tags'] ?? []);
        $priority = (int)($input['priority'] ?? 0);

        $sql = "UPDATE offers SET
            name=?, description=?, offer_type=?, discount_details=?, category=?, products=?, status=?,
            start_date=?, end_date=?, banner_image=?, tags=?, priority=?
            WHERE id=?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "sssssssssssii",
            $name,
            $description,
            $offer_type,
            $discount_details,
            $category,
            $products,
            $status,
            $start_date,
            $end_date,
            $banner_image,
            $tags,
            $priority,
            $id
        );

        $stmt->execute();

        $response = [
            'success' => true,
            'message' => 'Offer updated'
        ];
    }

    /* ================== DELETE ================== */
    elseif ($method === 'DELETE') {

        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            throw new Exception("ID required");
        }

        $stmt = $conn->prepare("DELETE FROM offers WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        $response = [
            'success' => true,
            'message' => 'Offer deleted'
        ];
    }

    else {
        http_response_code(405);
        $response['message'] = 'Method not allowed';
    }

} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
