<?php
// logout.php

// 1. Error Reporting band (Clean JSON ke liye)
// error_reporting(0);
// ini_set('display_errors', 0);

// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     exit(0);
// }

// require_once '../../database/db.php'; // Apna sahi path check kar lena

// // 2. Token nikalna (Authorization Header se)
// $headers = null;
// if (isset($_SERVER['Authorization'])) {
//     $headers = trim($_SERVER["Authorization"]);
// }
// else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { // Nginx or fastCGI
//     $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
// } elseif (function_exists('apache_request_headers')) {
//     $requestHeaders = apache_request_headers();
//     $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
//     if (isset($requestHeaders['Authorization'])) {
//         $headers = trim($requestHeaders['Authorization']);
//     }
// }

// // 3. Bearer Token Parse karna
// $token = '';
// if (!empty($headers)) {
//     if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
//         $token = $matches[1];
//     }
// }

// // Agar Header me nahi mila to Body check karo (Optional)
// if(empty($token)){
//     $data = json_decode(file_get_contents("php://input"));
//     if(isset($data->token)){
//         $token = $data->token;
//     }
// }

// if(empty($token)) {
//     http_response_code(400);
//     echo json_encode(["message" => "Token missing"]);
//     exit;
// }

// // 4. Database me Token NULL kar do (Logout logic)
// $stmt = $conn->prepare("UPDATE users SET token = NULL WHERE token = ?");
// $stmt->bind_param("s", $token);

// if($stmt->execute()) {
//     echo json_encode(["message" => "Logged out successfully"]);
// } else {
//     http_response_code(500);
//     echo json_encode(["message" => "Logout failed"]);
// }
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../database/db.php';

// Get token from header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = str_replace('Bearer ', '', $authHeader);

if (empty($token)) {
    echo json_encode([
        'success' => true,
        'message' => 'Logged out'
    ]);
    exit;
}

// Clear token from admin_users
$stmt = $conn->prepare("UPDATE admin_users SET token = NULL WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();

// Clear token from users
$stmt = $conn->prepare("UPDATE users SET token = NULL WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);

$conn->close();
?>