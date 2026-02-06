<?php
// login.php
// error_reporting(0);
// ini_set('display_errors', 0);

// header('Content-Type: application/json');
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// require_once '../../database/db.php';

// $data = json_decode(file_get_contents("php://input"), true);

// if (empty($data['email']) || empty($data['password'])) {
//     http_response_code(422);
//     echo json_encode(['message'=>'Email and password required']);
//     exit;
// }

// $stmt = $conn->prepare(
//     "SELECT id, full_name, password FROM users WHERE email=?"
// );
// $stmt->bind_param("s", $data['email']);
// $stmt->execute();
// $result = $stmt->get_result();

// if ($result->num_rows === 0) {
//     http_response_code(401);
//     echo json_encode(['message'=>'Invalid email or password']);
//     exit;
// }

// $user = $result->fetch_assoc();

// if (password_verify($data['password'], $user['password'])) {

//     $token = bin2hex(random_bytes(32));
//     $up = $conn->prepare("UPDATE users SET token=? WHERE id=?");
//     $up->bind_param("si", $token, $user['id']);
//     $up->execute();

//     echo json_encode([
//         'message'=>'Login successful',
//         'token'=>$token,
//         'user'=>[
//             'id'=>$user['id'],
//             'name'=>$user['full_name'],
//             'email'=>$data['email']
//         ]
//     ]);
// } else {
//     http_response_code(401);
//     echo json_encode(['message'=>'Invalid email or password']);
// }


error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../database/db.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validation
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Email and password are required'
    ]);
    exit;
}

$email = trim(strtolower($data['email']));
$password = $data['password'];

// ========== FIRST CHECK ADMIN TABLE ==========
$stmt = $conn->prepare(
    "SELECT id, full_name, email, password, phone, google_id 
     FROM admin_users 
     WHERE email = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    
    // Verify password
    if ($password === $admin['password']) {
        // Generate unique token
        $token = bin2hex(random_bytes(32)) . '_' . time();
        
        // Update token in database
        $update = $conn->prepare("UPDATE admin_users SET token = ? WHERE id = ?");
        $update->bind_param("si", $token, $admin['id']);
        
        if ($update->execute()) {
            // Success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Admin login successful',
                'user_type' => 'admin',
                'redirect' => '/admin/dashboard',
                'token' => $token,
                'user' => [
                    'id' => (int)$admin['id'],
                    'name' => $admin['full_name'],
                    'email' => $admin['email'],
                    'phone' => $admin['phone']
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save login session'
            ]);
        }
        $conn->close();
        exit;
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
        $conn->close();
        exit;
    }
}

// ========== CHECK USERS TABLE ==========
$stmt = $conn->prepare(
    "SELECT id, full_name, email, password, phone, google_id 
     FROM users 
     WHERE email = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email or password'
    ]);
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (password_verify($password, $user['password'])) {
    // Generate unique token
    $token = bin2hex(random_bytes(32)) . '_' . time();
    
    // Update token in database
    $update = $conn->prepare("UPDATE users SET token = ? WHERE id = ?");
    $update->bind_param("si", $token, $user['id']);
    
    if ($update->execute()) {
        // Success response
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user_type' => 'user',
            'redirect' => '/dashboard',
            'token' => $token,
            'user' => [
                'id' => (int)$user['id'],
                'name' => $user['full_name'],
                'email' => $user['email'],
                'phone' => $user['phone']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to save login session'
        ]);
    }
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email or password'
    ]);
}

$conn->close();
?>