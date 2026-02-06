<?php
// ===== CORS =====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../database/db.php';

// Debug (production me off kar dena)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Params
$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$limit  = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

// Base query
$sql = "SELECT 
            id, name, slug, short_description,
            base_price, sale_price,
            feature_image, side_image, banner_image,
            rating, review_count, ribbon, badge_color,
            stock_status, stock_qty, category
        FROM products
        WHERE status = 'active'";

// Category filter
if ($category !== '') {
    $safeCategory = $conn->real_escape_string($category);
    $sql .= " AND category LIKE '%$safeCategory%'";
}

// Pagination
$sql .= " ORDER BY id DESC LIMIT $limit OFFSET $offset";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);
    exit;
}

$products = [];

while ($row = $result->fetch_assoc()) {

    // ✅ Variants – product_id MUST match
    $variants = [];

    $varSql = "
        SELECT size, unit, price, stock, sku 
        FROM product_variations 
        WHERE product_id = " . (int)$row['id'] . "
        ORDER BY id ASC
    ";

    $varResult = $conn->query($varSql);

    if ($varResult && $varResult->num_rows > 0) {
        while ($v = $varResult->fetch_assoc()) {
            $variants[] = [
                "label" => $v['size'] . $v['unit'] . " - ₹" . number_format($v['price'], 0),
                "size"  => (int)$v['size'],
                "unit"  => $v['unit'],
                "price" => (float)$v['price'],
                "stock" => (int)$v['stock'],
                "sku"   => $v['sku']
            ];
        }
    }

    $products[] = [
        "id" => (int)$row['id'],
        "name" => $row['name'],
        "title" => $row['name'],
        "slug" => $row['slug'],
        "short_description" => $row['short_description'],
        "detail" => $row['short_description'],
        "base_price" => (float)$row['base_price'],
        "sale_price" => (float)$row['sale_price'],
        "price" => "₹" . number_format($row['sale_price'], 0),
        "oldPrice" => "₹" . number_format($row['base_price'], 0),
        "feature_image" => $row['feature_image'],
        "img" => $row['feature_image'],
        "hoverImg" => $row['side_image'] ?: $row['feature_image'],
        "side_image" => $row['side_image'],
        "banner_image" => $row['banner_image'],
        "rating" => (float)$row['rating'],
        "reviews" => (int)$row['review_count'],
        "ribbon" => $row['ribbon'],
        "badge_color" => $row['badge_color'],
        "stock_status" => $row['stock_status'],
        "stock_qty" => (int)$row['stock_qty'],
        "category" => json_decode($row['category'], true),
        "variants" => $variants // ❌ fake default hata diya
    ];
}

// Response
echo json_encode([
    "success" => true,
    "count" => count($products),
    "products" => $products
]);
