<?php
// user/products/product-detail.php - Get single product by slug

require_once __DIR__ . '/../../database/db.php';

$slug = isset($_GET['slug']) ? sanitize($conn, $_GET['slug']) : '';

if (empty($slug)) {
    sendError('Product slug is required', 400);
}

try {
    $stmt = $conn->prepare("
        SELECT 
            id,
            name,
            slug,
            short_description,
            base_price,
            sale_price,
            sku,
            stock_status,
            stock_qty,
            manage_stock,
            low_stock_threshold,
            weight,
            weight_unit,
            length,
            width,
            height,
            dimension_unit,
            shipping_class,
            shipping_days,
            feature_image,
            banner_image,
            side_image,
            feature_img_alt,
            seo_title,
            seo_description,
            keywords,
            meta_robots,
            seo_score,
            category,
            tags,
            ribbon,
            badge_color,
            brand,
            rating,
            review_count,
            enable_reviews,
            offer_type,
            offer_value,
            show_countdown,
            stock_for_offer,
            created_at,
            updated_at
        FROM products 
        WHERE slug = ? AND status = 'active'
        LIMIT 1
    ");

    if (!$stmt) {
        throw new Exception('Query preparation failed');
    }

    $stmt->bind_param('s', $slug);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        sendError('Product not found', 404);
    }

    $product = $result->fetch_assoc();
    $stmt->close();

    // Parse JSON fields
    $categoryData = null;
    if (!empty($product['category'])) {
        $decoded = json_decode($product['category'], true);
        $categoryData = is_array($decoded) ? $decoded : [$product['category']];
    }

    $tagsData = null;
    if (!empty($product['tags'])) {
        $tagsData = array_map('trim', explode(',', $product['tags']));
    }

    // Validate images
    $featureImage = validateImage($product['feature_image']);
    $bannerImage = !empty($product['banner_image']) ? validateImage($product['banner_image']) : null;
    $sideImage = !empty($product['side_image']) ? validateImage($product['side_image']) : null;

    // Format response
    $response = [
        'success' => true,
        'product' => [
            'id' => (int)$product['id'],
            'name' => $product['name'] ?? 'Unnamed Product',
            'slug' => $product['slug'],
            'short_description' => $product['short_description'] ?? '',
            'base_price' => (float)($product['base_price'] ?? 0),
            'sale_price' => (float)($product['sale_price'] ?? 0),
            'sku' => $product['sku'] ?? '',
            'stock_status' => $product['stock_status'] ?? 'In Stock',
            'stock_qty' => (int)($product['stock_qty'] ?? 0),
            'manage_stock' => (bool)($product['manage_stock'] ?? true),
            'low_stock_threshold' => (int)($product['low_stock_threshold'] ?? 10),
            'weight' => (float)($product['weight'] ?? 0),
            'weight_unit' => $product['weight_unit'] ?? 'kg',
            'length' => (float)($product['length'] ?? 0),
            'width' => (float)($product['width'] ?? 0),
            'height' => (float)($product['height'] ?? 0),
            'dimension_unit' => $product['dimension_unit'] ?? 'cm',
            'shipping_class' => $product['shipping_class'] ?? null,
            'shipping_days' => $product['shipping_days'] ?? null,
            'feature_image' => $featureImage,
            'banner_image' => $bannerImage,
            'side_image' => $sideImage,
            'feature_img_alt' => $product['feature_img_alt'] ?? $product['name'],
            'seo_title' => $product['seo_title'] ?? $product['name'],
            'seo_description' => $product['seo_description'] ?? $product['short_description'],
            'keywords' => $product['keywords'] ?? null,
            'meta_robots' => $product['meta_robots'] ?? null,
            'seo_score' => (int)($product['seo_score'] ?? 0),
            'category' => $categoryData,
            'tags' => $tagsData,
            'ribbon' => $product['ribbon'] ?? null,
            'badge_color' => $product['badge_color'] ?? null,
            'brand' => $product['brand'] ?? null,
            'rating' => (float)($product['rating'] ?? 4.5),
            'review_count' => (int)($product['review_count'] ?? 0),
            'enable_reviews' => (bool)($product['enable_reviews'] ?? true),
            'offer_type' => $product['offer_type'] ?? null,
            'offer_value' => $product['offer_value'] ?? null,
            'show_countdown' => (bool)($product['show_countdown'] ?? false),
            'stock_for_offer' => (int)($product['stock_for_offer'] ?? 0),
            'created_at' => $product['created_at'],
            'updated_at' => $product['updated_at']
        ]
    ];

    $conn->close();
    sendResponse($response);

} catch (Exception $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    sendError('Failed to fetch product: ' . $e->getMessage(), 500);
}
?>