<?php
// database/migrate_categories.php
require_once 'db.php';

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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_active (active),
        INDEX idx_type (type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    "category_tags" => "CREATE TABLE IF NOT EXISTS category_tags (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        category_id INT(11),
        tag_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category_id),
        INDEX idx_tag (tag_name),
        UNIQUE KEY unique_category_tag (category_id, tag_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    "category_products" => "CREATE TABLE IF NOT EXISTS category_products (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        category_id INT(11),
        product_id INT(11),
        product_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category_id),
        INDEX idx_product (product_id),
        UNIQUE KEY unique_category_product (category_id, product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

foreach ($tables as $tableName => $sql) {
    if (!$conn->query($sql)) {
        error_log("Table creation failed for $tableName: " . $conn->error);
    } else {
        // Insert sample data for testing
        if ($tableName === "categories" && $conn->query("SELECT COUNT(*) as count FROM categories")->fetch_assoc()['count'] == 0) {
            $sample_categories = [
                ['Hair Care', 'hair-care', 'Best hair care products', 'Main Category', 1],
                ['Skin Care', 'skin-care', 'Natural skin care solutions', 'Main Category', 1],
                ['Body Care', 'body-care', 'Complete body care range', 'Main Category', 1],
                ['Ayurvedic', 'ayurvedic', 'Traditional ayurvedic products', 'Sub Category', 1],
                ['Herbal', 'herbal', 'Pure herbal formulations', 'Collection', 1]
            ];
            
            $stmt = $conn->prepare("INSERT INTO categories (name, slug, description, type, active) VALUES (?, ?, ?, ?, ?)");
            foreach ($sample_categories as $cat) {
                $stmt->bind_param("ssssi", $cat[0], $cat[1], $cat[2], $cat[3], $cat[4]);
                $stmt->execute();
            }
        }
    }
}

echo "Database migration completed successfully!";
?>