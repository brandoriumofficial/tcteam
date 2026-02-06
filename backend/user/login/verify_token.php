<?php
// api/auth/verify-token.php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../../database/db.php';

// Get token from header
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : '';

if (empty($token)) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Token required'
    ]);
    exit;
}

// Check in admin_users first
$stmt = $conn->prepare(
    "SELECT id, full_name, email, phone 
     FROM admin_users 
     WHERE token = ?"
);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'user_type' => 'admin',
        'user' => [
            'id' => $admin['id'],
            'name' => $admin['full_name'],
            'email' => $admin['email'],
            'phone' => $admin['phone']
        ]
    ]);
    exit;
}

// Check in users table
$stmt = $conn->prepare(
    "SELECT id, full_name, email, phone 
     FROM users 
     WHERE token = ?"
);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'user_type' => 'user',
        'user' => [
            'id' => $user['id'],
            'name' => $user['full_name'],
            'email' => $user['email'],
            'phone' => $user['phone']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid token'
    ]);
}

$conn->close();
?>