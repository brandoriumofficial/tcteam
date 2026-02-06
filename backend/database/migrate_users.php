<?php
// migrate_users.php
require_once 'db.php';

$sql = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
";
$tables = [
    "categories" => "CREATE TABLE IF NOT EXISTS categories (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        type VARCHAR(50) DEFAULT 'Main Category',
        active BOOLEAN DEFAULT 1,
        show_on_home BOOLEAN DEFAULT 0,
        show_on_menu BOOLEAN DEFAULT 0,
        show_on_shop BOOLEAN DEFAULT 1,
        seo_title VARCHAR(255),
        seo_description TEXT,
        keywords TEXT,
        suitable_for VARCHAR(100) DEFAULT 'All',
        seasonal VARCHAR(100) DEFAULT 'None',
        thumbnail_image VARCHAR(500),
        banner_image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    "category_tags" => "CREATE TABLE IF NOT EXISTS category_tags (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        category_id INT(11),
        tag_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    "category_products" => "CREATE TABLE IF NOT EXISTS category_products (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        category_id INT(11),
        product_id INT(11),
        product_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category_product (category_id, product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

foreach ($tables as $tableName => $sql) {
    if (!$conn->query($sql)) {
        error_log("Table creation failed for $tableName: " . $conn->error);
    }
}
if ($conn->query($sql)) {
    echo "Users table created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}
?>