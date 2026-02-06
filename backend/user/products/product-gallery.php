<?php
// api/product-gallery.php - Get product gallery images

require_once '../../database/db.php';

$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

if (empty($slug)) {
    sendError('Product slug is required');
}

try {
    $pdo = getDBConnection();
    
    // Get product ID
    $stmt = $pdo->prepare("SELECT id FROM products WHERE slug = :slug LIMIT 1");
    $stmt->execute([':slug' => $slug]);
    $product = $stmt->fetch();
    
    if (!$product) {
        sendError('Product not found', 404);
    }
    
    // Get gallery
    $stmt = $pdo->prepare("
        SELECT 
            id,
            image_url,
            alt_text,
            caption,
            sort_order
        FROM product_gallery 
        WHERE product_id = :product_id
        ORDER BY sort_order ASC
    ");
    $stmt->execute([':product_id' => $product['id']]);
    $gallery = $stmt->fetchAll();
    
    sendResponse([
        'success' => true,
        'gallery' => $gallery
    ]);
    
} catch (PDOException $e) {
    sendError('Failed to fetch gallery: ' . $e->getMessage(), 500);
}
?>