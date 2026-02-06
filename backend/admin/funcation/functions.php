<?php
// api/functions.php

// JSON Response Helper
function json_response($success, $data = null, $message = '', $http_code = 200) {
    http_response_code($http_code);
    header('Content-Type: application/json');
    
    $response = [
        'success' => $success,
        'message' => $message,
        'data' => $data
    ];
    
    echo json_encode($response);
    exit();
}

// Get input data from request
function get_input_data() {
    $input = file_get_contents('php://input');
    
    if (!empty($input)) {
        return json_decode($input, true);
    }
    
    return $_POST;
}

// Escape string
function escape_string($conn, $string) {
    return $conn->real_escape_string($string);
}

// Execute query
function execute_query($conn, $sql) {
    return $conn->query($sql);
}

// Fetch single row
function fetch_single($result) {
    return $result->fetch_assoc();
}

// Fetch all rows
function fetch_all($result) {
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    return $rows;
}

// Get last insert ID
function get_last_insert_id($conn) {
    return $conn->insert_id;
}

// Validate required fields
function validate_required($data, $fields) {
    $errors = [];
    foreach ($fields as $field) {
        if (empty($data[$field])) {
            $errors[] = "$field is required";
        }
    }
    return $errors;
}

// Transaction helpers
function begin_transaction($conn) {
    $conn->begin_transaction();
}

function commit_transaction($conn) {
    $conn->commit();
}

function rollback_transaction($conn) {
    $conn->rollback();
}

// Check if table exists
function table_exists($conn, $table_name) {
    $result = $conn->query("SHOW TABLES LIKE '$table_name'");
    return $result->num_rows > 0;
}

// File upload function
function upload_file($file, $product_id = 0) {
    $target_dir = "../../uploads/products/";
    
    // Create directory if not exists
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0755, true);
    }
    
    // Generate unique filename
    $file_extension = pathinfo($file["name"], PATHINFO_EXTENSION);
    $file_name = time() . '_' . uniqid() . '.' . $file_extension;
    $target_file = $target_dir . $file_name;
    
    // Check file size (max 5MB)
    if ($file["size"] > 5000000) {
        return [
            'success' => false,
            'message' => 'File is too large. Max 5MB allowed.'
        ];
    }
    
    // Allow only image and video files
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'avi', 'mov', 'wmv'];
    if (!in_array(strtolower($file_extension), $allowed_types)) {
        return [
            'success' => false,
            'message' => 'Only image and video files are allowed.'
        ];
    }
    
    // Upload file
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // Return relative path for database (correct path)
        $relative_path = "uploads/products/" . $file_name;
        
        return [
            'success' => true,
            'file_url' => $relative_path,
            'file_name' => $file_name,
            'mime_type' => $file["type"]
        ];
    } else {
        return [
            'success' => false,
            'message' => 'Failed to upload file.'
        ];
    }
}
?>