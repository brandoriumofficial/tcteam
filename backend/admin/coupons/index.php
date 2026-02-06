<?php
// --- HEADERS ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

include_once '../../database/db.php';

// --- AUTO CREATE TABLE ---
$tableSql = "CREATE TABLE IF NOT EXISTS smart_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    logic_display VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    validity DATE NOT NULL,
    buy_qty INT DEFAULT 0,
    get_qty INT DEFAULT 0,
    min_amount DECIMAL(10,2) DEFAULT 0,
    free_product VARCHAR(255) DEFAULT '',
    discount_percent DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
mysqli_query($conn, $tableSql);

// --- API LOGIC ---
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {

    // 1. READ ALL
    case 'read':
        $sql = "SELECT * FROM smart_offers ORDER BY id DESC";
        $result = mysqli_query($conn, $sql);
        if ($result) {
            echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));
        } else {
            echo json_encode([]);
        }
        break;

    // 2. CREATE (FIXED BIND PARAM)
    case 'create':
        if ($method === 'POST' && isset($input['title'])) {
            $sql = "INSERT INTO smart_offers (title, type, logic_display, status, validity, buy_qty, get_qty, min_amount, free_product, discount_percent) 
                    VALUES (?, ?, ?, 'Active', ?, ?, ?, ?, ?, ?)";
            
            $stmt = mysqli_prepare($conn, $sql);
            if ($stmt) {
                // Set defaults
                $bq = $input['buyQty'] ?? 0;
                $gq = $input['getQty'] ?? 0;
                $ma = $input['minAmount'] ?? 0;
                $fp = $input['freeProduct'] ?? '';
                $dp = $input['discount'] ?? 0;

                // FIXED HERE: Changed "sssssiidsd" (10 chars) to "ssssiidsd" (9 chars)
                // Title(s), Type(s), Logic(s), Validity(s), Buy(i), Get(i), Min(d), Free(s), Disc(d)
                mysqli_stmt_bind_param($stmt, "ssssiidsd", 
                    $input['title'], 
                    $input['type'], 
                    $input['logic'], 
                    $input['validity'], 
                    $bq, 
                    $gq, 
                    $ma, 
                    $fp, 
                    $dp
                );
                
                if (mysqli_stmt_execute($stmt)) {
                    echo json_encode(['message' => 'Created Successfully']);
                } else {
                    echo json_encode(['error' => 'Failed to create: ' . mysqli_stmt_error($stmt)]);
                }
                mysqli_stmt_close($stmt);
            } else {
                echo json_encode(['error' => 'Prepare failed: ' . mysqli_error($conn)]);
            }
        }
        break;

    // 3. UPDATE STATUS
    case 'update_status':
        if (isset($input['id']) && isset($input['status'])) {
            $sql = "UPDATE smart_offers SET status = ? WHERE id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            if ($stmt) {
                mysqli_stmt_bind_param($stmt, "si", $input['status'], $input['id']);
                if (mysqli_stmt_execute($stmt)) {
                    echo json_encode(['message' => 'Status Updated']);
                } else {
                    echo json_encode(['error' => 'Update Failed']);
                }
                mysqli_stmt_close($stmt);
            }
        }
        break;

    // 4. DELETE
    case 'delete':
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $sql = "DELETE FROM smart_offers WHERE id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            if ($stmt) {
                mysqli_stmt_bind_param($stmt, "i", $id);
                if (mysqli_stmt_execute($stmt)) {
                    echo json_encode(['message' => 'Deleted Successfully']);
                } else {
                    echo json_encode(['error' => 'Delete Failed']);
                }
                mysqli_stmt_close($stmt);
            }
        }
        break;

    default:
        echo json_encode(["message" => "API Ready"]);
        break;
}

mysqli_close($conn);
?>