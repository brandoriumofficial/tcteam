<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../database/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Category ID required']);
    exit;
}

try {
    // Prepare update query
    $id = $conn->real_escape_string($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $description = $conn->real_escape_string($data['description']);
    $slug = strtolower(str_replace(' ', '-', $name));
    $active = $data['status'] === 'Active' ? 1 : 0;
    $show_on_home = isset($data['homepage']) && $data['homepage'] ? 1 : 0;
    $seo_title = $conn->real_escape_string($data['seoTitle'] ?? '');
    $seo_description = $conn->real_escape_string($data['seoDesc'] ?? '');
    
    $sql = "UPDATE categories SET 
            name = '$name',
            slug = '$slug',
            description = '$description',
            active = $active,
            show_on_home = $show_on_home,
            seo_title = '$seo_title',
            seo_description = '$seo_description',
            updated_at = NOW()
            WHERE id = $id";
    
    if ($conn->query($sql)) {
        echo json_encode([
            'success' => true,
            'message' => 'Category updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update category: ' . $conn->error
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>