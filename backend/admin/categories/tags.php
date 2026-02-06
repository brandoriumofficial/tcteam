<?php
// api/tags.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once '../../database/db.php';

// First, ensure the category_tags table exists
$createTableSQL = "CREATE TABLE IF NOT EXISTS category_tags (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    category_id INT(11),
    tag_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_tag (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if (!$conn->query($createTableSQL)) {
    // If table creation fails, return default tags
    $tags = getDefaultTags();
    echo json_encode(['success' => true, 'data' => $tags]);
    exit;
}

// Now try to get tags from database
$sql = "SELECT tag_name, COUNT(*) as count 
        FROM category_tags 
        GROUP BY tag_name 
        ORDER BY count DESC 
        LIMIT 20";
$result = $conn->query($sql);

$tags = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $tags[] = $row['tag_name'];
    }
    
    // If no tags found in database, return default tags
    if (empty($tags)) {
        $tags = getDefaultTags();
    }
} else {
    // If query failed, return default tags
    $tags = getDefaultTags();
}

echo json_encode(['success' => true, 'data' => $tags]);

function getDefaultTags() {
    return [
        "Organic", "Herbal", "Chemical Free", "Ayurveda Inspired", "Vegan",
        "Premium", "Natural", "Handmade", "Cruelty Free", "Eco Friendly",
        "Handcrafted", "Traditional", "Modern", "Luxury", "Affordable",
        "Best Seller", "New Arrival", "Featured", "Limited Edition", "Seasonal"
    ];
}
?>