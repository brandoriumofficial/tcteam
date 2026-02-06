<?php
// --- HEADERS (Must be at top) ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

// Handle Preflight Request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require './../../database/db.php';

// --- AUTO CREATE TABLE & FOLDER (Runs on every call) ---
$uploadDir = '../../uploads/gallery/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$tableSql = "CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('Image', 'Video') DEFAULT 'Image',
    media_url VARCHAR(255) NOT NULL,
    page VARCHAR(50) DEFAULT 'Homepage',
    section VARCHAR(50) DEFAULT 'Main Slider',
    sort_order INT DEFAULT 0,
    link VARCHAR(255) DEFAULT '',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
mysqli_query($conn, $tableSql);

// --- API ACTIONS ---
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Determine Base URL for media
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$baseUrl = $protocol . $_SERVER['HTTP_HOST'] . '/uploads/gallery/';

switch ($action) {

    // 1. READ ALL
    case 'read':
        $sql = "SELECT * FROM banners ORDER BY sort_order ASC";
        $result = mysqli_query($conn, $sql);
        
        if($result) {
            $data = mysqli_fetch_all($result, MYSQLI_ASSOC);
            foreach ($data as &$row) {
                // Return full URL so frontend can display image easily
                $row['media_full_url'] = $baseUrl . $row['media_url'];
            }
            echo json_encode($data);
        } else {
            echo json_encode([]);
        }
        break;

    // 2. CREATE
    case 'create':
        if ($method === 'POST') {
            $title = $_POST['title'] ?? '';
            $type = $_POST['type'] ?? 'Image';
            $page = $_POST['page'] ?? 'Homepage';
            $section = $_POST['section'] ?? 'Main Slider';
            $order = $_POST['order'] ?? 0;
            $link = $_POST['link'] ?? '';
            $status = $_POST['status'] ?? 'Active';
            
            // Handle File Upload
            $fileName = '';
            if (isset($_FILES['media']) && $_FILES['media']['error'] === 0) {
                $ext = pathinfo($_FILES['media']['name'], PATHINFO_EXTENSION);
                $fileName = time() . '_' . uniqid() . '.' . $ext;
                
                if(move_uploaded_file($_FILES['media']['tmp_name'], $uploadDir . $fileName)) {
                    $sql = "INSERT INTO banners (title, type, media_url, page, section, sort_order, link, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    $stmt = mysqli_prepare($conn, $sql);
                    mysqli_stmt_bind_param($stmt, "sssssiss", $title, $type, $fileName, $page, $section, $order, $link, $status);
                    
                    if (mysqli_stmt_execute($stmt)) echo json_encode(['message' => 'Banner Created']);
                    else echo json_encode(['error' => 'Database Error: ' . mysqli_error($conn)]);
                    mysqli_stmt_close($stmt);
                } else {
                    echo json_encode(['error' => 'File Move Failed']);
                }
            } else {
                echo json_encode(['error' => 'No file uploaded or upload error']);
            }
        }
        break;

    // 3. UPDATE
    case 'update':
        if ($method === 'POST') {
            $id = $_POST['id'];
            $title = $_POST['title'];
            $type = $_POST['type'];
            $page = $_POST['page'];
            $section = $_POST['section'];
            $order = $_POST['order'];
            $link = $_POST['link'];
            $status = $_POST['status'];
            
            // Check if new file is uploaded
            if (isset($_FILES['media']) && $_FILES['media']['error'] === 0) {
                // Delete old file
                $oldQ = mysqli_query($conn, "SELECT media_url FROM banners WHERE id = $id");
                $oldRow = mysqli_fetch_assoc($oldQ);
                if ($oldRow && file_exists($uploadDir . $oldRow['media_url'])) {
                    unlink($uploadDir . $oldRow['media_url']);
                }

                // Upload new
                $ext = pathinfo($_FILES['media']['name'], PATHINFO_EXTENSION);
                $fileName = time() . '_' . uniqid() . '.' . $ext;
                move_uploaded_file($_FILES['media']['tmp_name'], $uploadDir . $fileName);
                
                $sql = "UPDATE banners SET title=?, type=?, media_url=?, page=?, section=?, sort_order=?, link=?, status=? WHERE id=?";
                $stmt = mysqli_prepare($conn, $sql);
                mysqli_stmt_bind_param($stmt, "sssssissi", $title, $type, $fileName, $page, $section, $order, $link, $status, $id);
            } else {
                // Keep old file
                $sql = "UPDATE banners SET title=?, type=?, page=?, section=?, sort_order=?, link=?, status=? WHERE id=?";
                $stmt = mysqli_prepare($conn, $sql);
                mysqli_stmt_bind_param($stmt, "ssssissi", $title, $type, $page, $section, $order, $link, $status, $id);
            }
            
            if (mysqli_stmt_execute($stmt)) echo json_encode(['message' => 'Banner Updated']);
            else echo json_encode(['error' => 'Update Failed: ' . mysqli_error($conn)]);
            mysqli_stmt_close($stmt);
        }
        break;

    // 4. DELETE
    case 'delete':
        if ($method === 'DELETE' && isset($_GET['id'])) {
            $id = $_GET['id'];
            
            // Delete file first
            $fileQuery = mysqli_query($conn, "SELECT media_url FROM banners WHERE id = $id");
            $fileRow = mysqli_fetch_assoc($fileQuery);
            if ($fileRow && !empty($fileRow['media_url']) && file_exists($uploadDir . $fileRow['media_url'])) {
                unlink($uploadDir . $fileRow['media_url']);
            }

            $sql = "DELETE FROM banners WHERE id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "i", $id);
            
            if (mysqli_stmt_execute($stmt)) echo json_encode(['message' => 'Deleted']);
            else echo json_encode(['error' => 'Delete Failed']);
            mysqli_stmt_close($stmt);
        }
        break;

    default:
        echo json_encode(["message" => "API Ready"]);
        break;
}

mysqli_close($conn);
?>