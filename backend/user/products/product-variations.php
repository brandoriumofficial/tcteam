<?php
// api/product-variations.php - Get product variations

require_once '../../database/db.php';

$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

if (empty($slug)) {
    sendError('Product slug is required');
}

try {
    
    // First get product ID
    $stmt = $pdo->prepare("SELECT id FROM products WHERE slug = :slug LIMIT 1");
    $stmt->execute([':slug' => $slug]);
    $product = $stmt->fetch();
    
    if (!$product) {
        sendError('Product not found', 404);
    }
    
    // Get variations
    $stmt = $pdo->prepare("
        SELECT 
            id,
            product_id,
            variant_name as name,
            sku,
            price as base_price,
            sale_price,
            stock_qty,
            stock_status,
            weight,
            image_url
        FROM product_variations 
        WHERE product_id = :product_id
        ORDER BY sort_order ASC, id ASC
    ");
    $stmt->execute([':product_id' => $product['id']]);
    $variations = $stmt->fetchAll();
    
    sendResponse([
        'success' => true,
        'variations' => $variations
    ]);
    
} catch (PDOException $e) {
    sendError('Failed to fetch variations: ' . $e->getMessage(), 500);
}
?>