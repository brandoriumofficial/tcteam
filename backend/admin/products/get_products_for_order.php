<?php
// 1. CORS Headers (सबसे ऊपर रखें)
header("Access-Control-Allow-Origin: *"); // या "http://localhost:3000"
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. Handle Preflight Request (Browser check karta hai)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Database Connection
require '../../database/db.php';

// Response Array
$response = [];

try {
    // 4. Products Query
    $sql = "SELECT * FROM products WHERE status = 'active'";
    $result = $conn->query($sql);

    if ($result) {
        while ($product = $result->fetch_assoc()) {
            
            $pId = $product['id'];
            
            // Variations check karein
            $varSql = "SELECT * FROM product_variations WHERE product_id = $pId";
            $varResult = $conn->query($varSql);

            if ($varResult && $varResult->num_rows > 0) {
                // --- CASE A: Variable Product ---
                while ($var = $varResult->fetch_assoc()) {
                    // Variation Name Logic
                    $varName = !empty($var['variation_value']) ? $var['variation_value'] : 
                              (!empty($var['variation_name']) ? $var['variation_name'] : 
                              (!empty($var['size']) ? $var['size'] : 'Variant'));

                    $name = $product['name'] . " - " . $varName;
                    
                    $price = floatval($var['price']); 
                    // Agar variation price 0 hai toh product price le lo
                    if($price <= 0) {
                         $price = floatval($product['sale_price'] > 0 ? $product['sale_price'] : $product['base_price']);
                    }

                    $oldPrice = ($price < floatval($product['base_price'])) ? floatval($product['base_price']) : $price;

                    $response[] = [
                        'unique_id' => 'var_' . $var['id'],
                        'product_id' => $product['id'],
                        'variation_id' => $var['id'],
                        'name' => $name,
                        'sku' => !empty($var['sku']) ? $var['sku'] : $product['sku'],
                        'newPrice' => $price,
                        'oldPrice' => $oldPrice,
                        'stock' => intval($var['stock'])
                    ];
                }
            } else {
                // --- CASE B: Simple Product ---
                $basePrice = floatval($product['base_price']);
                $salePrice = floatval($product['sale_price']);
                
                $finalPrice = ($salePrice > 0) ? $salePrice : $basePrice;

                $response[] = [
                    'unique_id' => 'prod_' . $product['id'],
                    'product_id' => $product['id'],
                    'variation_id' => null,
                    'name' => $product['name'],
                    'sku' => $product['sku'],
                    'newPrice' => $finalPrice,
                    'oldPrice' => $basePrice,
                    'stock' => intval($product['stock_qty'])
                ];
            }
        }
    }
    
    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>