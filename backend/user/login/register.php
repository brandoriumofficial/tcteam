<?php
// register.php
// error_reporting(0);
// ini_set('display_errors', 0);

// header('Content-Type: application/json');
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// require_once '../../database/db.php';

// $data = json_decode(file_get_contents("php://input"), true);
// $errors = [];

// if (empty($data['name'])) $errors['name'][] = 'Full name required';
// if (empty($data['email'])) $errors['email'][] = 'Email required';
// if (empty($data['password'])) $errors['password'][] = 'Password required';
// if (empty($data['phone'])) $errors['phone'][] = 'Phone required';

// if ($errors) {
//     http_response_code(422);
//     echo json_encode(['errors'=>$errors]);
//     exit;
// }

// // Email already exist check
// $stmt = $conn->prepare("SELECT id FROM users WHERE email=?");
// $stmt->bind_param("s", $data['email']);
// $stmt->execute();
// $stmt->store_result();

// if ($stmt->num_rows > 0) {
//     http_response_code(422);
//     echo json_encode(['message'=>'Email already exists']);
//     exit;
// }

// // Insert user
// $hash  = password_hash($data['password'], PASSWORD_BCRYPT);
// $token = bin2hex(random_bytes(32));

// $stmt = $conn->prepare(
//     "INSERT INTO users (full_name,email,phone,password,token)
//      VALUES (?,?,?,?,?)"
// );
// $stmt->bind_param(
//     "sssss",
//     $data['name'],
//     $data['email'],
//     $data['phone'],
//     $hash,
//     $token
// );

// if ($stmt->execute()) {
//     echo json_encode([
//         'message'=>'Registered successfully',
//         'token'=>$token
//     ]);
// } else {
//     http_response_code(500);
//     echo json_encode(['message'=>'Database error']);
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

$data = json_decode(file_get_contents("php://input"), true);

// Validation
$errors = [];

if (empty($data['name'])) {
    $errors['name'] = 'Full name is required';
}

if (empty($data['email'])) {
    $errors['email'] = 'Email is required';
} elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (empty($data['password'])) {
    $errors['password'] = 'Password is required';
} elseif (strlen($data['password']) < 6) {
    $errors['password'] = 'Password must be at least 6 characters';
}

if (empty($data['phone'])) {
    $errors['phone'] = 'Phone number is required';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors
    ]);
    exit;
}

$full_name = trim($data['name']);
$email = trim(strtolower($data['email']));
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$phone = trim($data['phone']);

// Check if email already exists in admin_users
$stmt = $conn->prepare("SELECT id FROM admin_users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'message' => 'Email already registered'
    ]);
    exit;
}

// Check if email already exists in users
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'message' => 'Email already registered'
    ]);
    exit;
}

// Check if phone already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE phone = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'message' => 'Phone number already registered'
    ]);
    exit;
}

// Generate token
$token = bin2hex(random_bytes(32));

// Insert user
$stmt = $conn->prepare(
    "INSERT INTO users (full_name, email, password, phone, token, created_at) 
     VALUES (?, ?, ?, ?, ?, NOW())"
);
$stmt->bind_param("sssss", $full_name, $email, $password, $phone, $token);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful! Please login.',
        'user' => [
            'id' => $userId,
            'name' => $full_name,
            'email' => $email,
            'phone' => $phone
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Registration failed. Please try again.'
    ]);
}

$conn->close();
?>