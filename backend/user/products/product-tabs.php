<?php
// api/product-tabs.php - Get product description tabs

require_once __DIR__ . '/../../database/db.php';

$slug = isset($_GET['slug']) ? sanitize($conn, $_GET['slug']) : '';
$productId = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;

if (empty($slug) && $productId === 0) {
    sendError('Product slug or ID is required');
}

// Get product ID if slug provided
if (!empty($slug)) {
    $result = $conn->query("SELECT id FROM products WHERE slug = '$slug' LIMIT 1");
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $productId = (int)$row['id'];
    } else {
        sendError('Product not found', 404);
    }
}

$sql = "SELECT 
            id,
            product_id,
            tab_title,
            tab_content,
            sort_order
        FROM product_description_tabs 
        WHERE product_id = $productId
        ORDER BY sort_order ASC";

$result = $conn->query($sql);

$tabs = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['product_id'] = (int)$row['product_id'];
        $row['sort_order'] = (int)$row['sort_order'];
        $tabs[] = $row;
    }
}

$conn->close();

sendResponse([
    'success' => true,
    'tabs' => $tabs
]);
?>