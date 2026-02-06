<?php
// 1. CORS ERROR FIX: Ye headers sabse upar hone chahiye
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
// header("Access-Control-Allow-Methods: POST, OPTIONS");

// // React pre-flight request (OPTIONS) ko handle karein
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// // Errors dikhana band karein taaki JSON kharab na ho
// error_reporting(0);
// ini_set('display_errors', 0);

// header('Content-Type: application/json');

// require_once '../../database/db.php';

// try {
//     // Input Data Lena
//     $data = json_decode(file_get_contents("php://input"), true);
    
//     if (!isset($data['token'])) {
//         throw new Exception("Token not provided");
//     }

//     $idToken = $data['token'];

//     // Google se User Verify karna
//     $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $idToken;
//     $googleInfo = file_get_contents($url);
    
//     if (!$googleInfo) {
//         throw new Exception("Invalid Google Token");
//     }

//     $google = json_decode($googleInfo, true);

//     // Agar Google response me error ho
//     if (isset($google['error'])) {
//         throw new Exception($google['error_description']);
//     }

//     $email = $google['email'];
//     $name  = $google['name'];
//     $gid   = $google['sub']; // Google Unique ID

//     // Check karein user pehle se hai ya nahi
//     $stmt = $conn->prepare("SELECT id, token, password FROM users WHERE email=?");
//     $stmt->bind_param("s", $email);
//     $stmt->execute();
//     $res = $stmt->get_result();
//     $user = $res->fetch_assoc();

//     if ($user) {
//         // --- LOGIN LOGIC ---
//         // Agar user exist karta hai, toh naya token generate karke update karein (Optional)
//         // Ya purana token return karein. Yahan hum naya token de rahe hain security ke liye.
        
//         $newToken = bin2hex(random_bytes(32));
//         $updateStmt = $conn->prepare("UPDATE users SET token=? WHERE id=?");
//         $updateStmt->bind_param("si", $newToken, $user['id']);
//         $updateStmt->execute();

//         echo json_encode([
//             'success' => true,
//             'message' => 'Login successful',
//             'token' => $newToken,
//             'user' => [
//                 'name' => $name,
//                 'email' => $email
//             ]
//         ]);
//     } else {
//         // --- REGISTER LOGIC ---
//         // Naya user banayein. Password NULL rahega.
        
//         $token = bin2hex(random_bytes(32));
        
//         $stmt = $conn->prepare(
//             "INSERT INTO users (full_name, email, google_id, token) VALUES (?, ?, ?, ?)"
//         );
        
//         if (!$stmt) {
//             throw new Exception("Database Prepare Error: " . $conn->error);
//         }

//         $stmt->bind_param("ssss", $name, $email, $gid, $token);
        
//         if ($stmt->execute()) {
//             echo json_encode([
//                 'success' => true,
//                 'message' => 'Registered with Google successfully',
//                 'token' => $token,
//                  'user' => [
//                     'name' => $name,
//                     'email' => $email
//                 ]
//             ]);
//         } else {
//             throw new Exception("Registration failed: " . $stmt->error);
//         }
//     }

// } catch (Exception $e) {
//     http_response_code(400); // Bad Request
//     echo json_encode([
//         'success' => false,
//         'message' => $e->getMessage()
//     ]);
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
if (empty($data['token'])) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Google token is required'
    ]);
    exit;
}

// Decode Google JWT Token
$googleToken = $data['token'];

// Split JWT token
$tokenParts = explode('.', $googleToken);
if (count($tokenParts) !== 3) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid Google token format'
    ]);
    exit;
}

// Decode payload (middle part)
$payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1])), true);

if (!$payload || empty($payload['email'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Could not decode Google token'
    ]);
    exit;
}

$email = trim(strtolower($payload['email']));
$name = $payload['name'] ?? '';
$google_id = $payload['sub'] ?? '';

// ========== FIRST CHECK ADMIN TABLE ==========
$stmt = $conn->prepare(
    "SELECT id, full_name, email, phone, google_id 
     FROM admin_users 
     WHERE email = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    
    // Update Google ID if not set
    if (empty($admin['google_id'])) {
        $update = $conn->prepare("UPDATE admin_users SET google_id = ? WHERE id = ?");
        $update->bind_param("si", $google_id, $admin['id']);
        $update->execute();
    } elseif ($admin['google_id'] !== $google_id) {
        // Google ID mismatch - security check
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Google account does not match. Please use the correct Google account.'
        ]);
        $conn->close();
        exit;
    }
    
    // Generate token
    $token = bin2hex(random_bytes(32));
    
    // Update token
    $update = $conn->prepare("UPDATE admin_users SET token = ? WHERE id = ?");
    $update->bind_param("si", $token, $admin['id']);
    $update->execute();
    
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
    $conn->close();
    exit;
}

// ========== CHECK USERS TABLE ==========
$stmt = $conn->prepare(
    "SELECT id, full_name, email, phone, google_id 
     FROM users 
     WHERE email = ? OR google_id = ?"
);
$stmt->bind_param("ss", $email, $google_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Existing user
    $user = $result->fetch_assoc();
    
    // Update Google ID if not set
    if (empty($user['google_id'])) {
        $update = $conn->prepare("UPDATE users SET google_id = ? WHERE id = ?");
        $update->bind_param("si", $google_id, $user['id']);
        $update->execute();
    }
    
    // Generate token
    $token = bin2hex(random_bytes(32));
    
    // Update token
    $update = $conn->prepare("UPDATE users SET token = ? WHERE id = ?");
    $update->bind_param("si", $token, $user['id']);
    $update->execute();
    
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
    // ========== NEW USER - REGISTER WITH GOOGLE ==========
    $token = bin2hex(random_bytes(32));
    
    $stmt = $conn->prepare(
        "INSERT INTO users (full_name, email, password, phone, google_id, token, created_at) 
         VALUES (?, ?, '', '', ?, ?, NOW())"
    );
    $stmt->bind_param("ssss", $name, $email, $google_id, $token);
    
    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        
        echo json_encode([
            'success' => true,
            'message' => 'Account created successfully',
            'user_type' => 'user',
            'redirect' => '/dashboard',
            'token' => $token,
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'phone' => null
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create account'
        ]);
    }
}

$conn->close();

?>