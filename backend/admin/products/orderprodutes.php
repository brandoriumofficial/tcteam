<?php
require_once '../../database/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
    
    $sql = "SELECT 
                id, 
                name, 
                sku, 
                base_price as oldPrice, 
                sale_price as newPrice,
                stock_qty as stock,
                status,
                brand,
                ribbon,
                badge_color
            FROM products 
            WHERE status = 'active'";
    
    if (!empty($search)) {
        $sql .= " AND (name LIKE '%$search%' OR sku LIKE '%$search%')";
    }
    
    $sql .= " ORDER BY name ASC LIMIT $limit";
    
    $result = $conn->query($sql);
    
    $products = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // If sale_price is 0, use base_price as newPrice
            if ($row['newPrice'] == 0 || $row['newPrice'] == null) {
                $row['newPrice'] = $row['oldPrice'];
            }
            $products[] = $row;
        }
    }
    
    echo json_encode([
        "success" => true,
        "data" => $products,
        "count" => count($products)
    ]);
    
} elseif ($method === 'POST') {
    // Create new product (if needed)
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = $conn->real_escape_string($data['name']);
    $sku = $conn->real_escape_string($data['sku']);
    $base_price = floatval($data['base_price']);
    $sale_price = floatval($data['sale_price']);
    $stock_qty = intval($data['stock_qty']);
    
    $sql = "INSERT INTO products (name, sku, base_price, sale_price, stock_qty, status, created_at) 
            VALUES ('$name', '$sku', $base_price, $sale_price, $stock_qty, 'active', NOW())";
    
    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Product added", "id" => $conn->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
}

$conn->close();
?>