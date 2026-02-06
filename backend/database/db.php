<?php
// includes/db.php

require_once __DIR__ . '/../config/env.php';

$conn = new mysqli(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    $_ENV['DB_NAME']
);

if ($conn->connect_error) {
    die('DB Connection Failed');
}

// Set charset
$conn->set_charset("utf8mb4");

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Response Functions
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit();
}

function sanitize($conn, $str) {
    return $conn->real_escape_string(trim($str));
}
function validateImage($url) {
    if (empty($url) || !is_string($url)) {
        return getDefaultImage();
    }
    $trimmed = trim($url);
    if (empty($trimmed) || $trimmed === 'null' || $trimmed === 'NULL') {
        return getDefaultImage();
    }
    // Check if URL starts with http or is a valid path
    if (strpos($trimmed, 'http') === 0 || strpos($trimmed, '/') === 0) {
        return $trimmed;
    }
    return getDefaultImage();
}
function getDefaultImage() {
    return 'https://via.placeholder.com/600x600/f5f5f5/999999?text=No+Image';
}
?>