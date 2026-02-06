<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../database/db.php';

try {
    // Get search parameter if exists
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    // Base query
    $sql = "SELECT 
                c.*,
                COUNT(DISTINCT p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON FIND_IN_SET(c.name, p.category) > 0
            WHERE 1=1";
    
    // Add search condition
    if (!empty($search)) {
        $search = $conn->real_escape_string($search);
        $sql .= " AND (c.name LIKE '%$search%' 
                  OR c.description LIKE '%$search%' 
                  OR c.type LIKE '%$search%')";
    }
    
    $sql .= " GROUP BY c.id ORDER BY c.id DESC";
    
    $result = $conn->query($sql);
    
    if ($result) {
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            // Format the response
            $categories[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'slug' => $row['slug'],
                'description' => $row['description'],
                'type' => $row['type'],
                'status' => $row['active'] == 1 ? 'Active' : 'Inactive',
                'active' => $row['active'],
                'products' => $row['product_count'],
                'image' => $row['thumbnail_image'] ?: 'https://via.placeholder.com/400x200',
                'bannerImage' => $row['banner_image'],
                'homepage' => $row['show_on_home'] == 1,
                'showOnMenu' => $row['show_on_menu'] == 1,
                'showOnShop' => $row['show_on_shop'] == 1,
                'seoTitle' => $row['seo_title'],
                'seoDesc' => $row['seo_description'],
                'keywords' => $row['keywords'],
                'suitableFor' => $row['suitable_for'],
                'seasonal' => $row['seasonal']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories fetched successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch categories'
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