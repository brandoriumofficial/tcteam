<?php
// db_setup.php - Database setup and migration
require_once __DIR__ . '/../config/env.php';

$temp_conn = new mysqli(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASS']
);

if ($temp_conn->connect_error) {
    die("❌ Initial connection failed: " . $temp_conn->connect_error . "\n");
}

// Step 2: Create database if not exists
$database = $_ENV['DB_NAME'];
$sql = "CREATE DATABASE IF NOT EXISTS `$database` 
        CHARACTER SET utf8mb4 
        COLLATE utf8mb4_unicode_ci";

if ($temp_conn->query($sql) === TRUE) {
    echo "✅ Database '$database' checked/created\n";
} else {
    die("❌ Error creating database: " . $temp_conn->error . "\n");
}

// Step 3: Close temporary connection
$temp_conn->close();

// Step 4: Connect with database
$conn = new mysqli(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    $_ENV['DB_NAME']
);

if ($conn->connect_error) {
    die("❌ Database connection failed: " . $conn->connect_error . "\n");
}

function create_table($conn, $table_name, $sql) {
    if ($conn->query($sql) === TRUE) {
        echo "✅ Table '$table_name' created/checked\n";
        return true;
    } else {
        echo "❌ Error creating table '$table_name': " . $conn->error . "\n";
        return false;
    }
}

// ==================== TABLE DEFINITIONS ====================

// 1. Products Table
$products_table = "CREATE TABLE IF NOT EXISTS `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `short_description` TEXT,
    `base_price` DECIMAL(10,2) DEFAULT 0.00,
    `sale_price` DECIMAL(10,2) DEFAULT 0.00,
    `sku` VARCHAR(100) UNIQUE,
    `stock_status` ENUM('In Stock', 'Out of Stock', 'On Backorder') DEFAULT 'In Stock',
    `stock_qty` INT DEFAULT 0,
    `manage_stock` BOOLEAN DEFAULT true,
    `low_stock_threshold` INT DEFAULT 10,
    `weight` DECIMAL(10,2) DEFAULT 0.00,
    `weight_unit` VARCHAR(20) DEFAULT 'kg',
    `length` DECIMAL(10,2) DEFAULT 0.00,
    `width` DECIMAL(10,2) DEFAULT 0.00,
    `height` DECIMAL(10,2) DEFAULT 0.00,
    `dimension_unit` VARCHAR(20) DEFAULT 'cm',
    `shipping_class` VARCHAR(100),
    `shipping_days` VARCHAR(50),
    `feature_image` TEXT,
    `banner_image` TEXT,
    `side_image` TEXT,
    `feature_img_alt` VARCHAR(255),
    `seo_title` VARCHAR(255),
    `seo_description` TEXT,
    `keywords` TEXT,
    `meta_robots` VARCHAR(100),
    `seo_score` INT DEFAULT 0,
    `category` JSON,
    `tags` TEXT,
    `ribbon` VARCHAR(100),
    `badge_color` VARCHAR(50),
    `brand` VARCHAR(100),
    `status` ENUM('active', 'draft', 'pending') DEFAULT 'draft',
    `rating` DECIMAL(3,2) DEFAULT 0.00,
    `review_count` INT DEFAULT 0,
    `enable_reviews` BOOLEAN DEFAULT true,
    `offer_type` VARCHAR(50),
    `offer_value` VARCHAR(50),
    `show_countdown` BOOLEAN DEFAULT false,
    `stock_for_offer` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_slug` (`slug`),
    INDEX `idx_status` (`status`),
    INDEX `idx_brand` (`brand`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 2. Product Gallery Table
$gallery_table = "CREATE TABLE IF NOT EXISTS `product_gallery` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `image_url` TEXT NOT NULL,
    `image_alt` VARCHAR(255),
    `image_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_image_order` (`image_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 3. Product Variations Table
$variations_table = "CREATE TABLE IF NOT EXISTS `product_variations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `variation_name` VARCHAR(100),
    `variation_value` VARCHAR(100),
    `size` VARCHAR(100),
    `unit` VARCHAR(20),
    `price` DECIMAL(10,2) DEFAULT 0.00,
    `stock` INT DEFAULT 0,
    `sku` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 4. Product Description Tabs Table
$tabs_table = "CREATE TABLE IF NOT EXISTS `product_description_tabs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `tab_title` VARCHAR(100) NOT NULL,
    `tab_content` LONGTEXT NOT NULL,
    `tab_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT true,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_tab_order` (`tab_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 5. Product FAQs Table
$faqs_table = "CREATE TABLE IF NOT EXISTS `product_faqs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `faq_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT true,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 6. Product Reviews Table
$reviews_table = "CREATE TABLE IF NOT EXISTS `product_reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `reviewer_name` VARCHAR(100) NOT NULL,
    `reviewer_email` VARCHAR(255),
    `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    `review_title` VARCHAR(255),
    `review_text` TEXT NOT NULL,
    `is_verified` BOOLEAN DEFAULT false,
    `helpful_count` INT DEFAULT 0,
    `not_helpful_count` INT DEFAULT 0,
    `review_date` DATE NOT NULL,
    `is_approved` BOOLEAN DEFAULT false,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_rating` (`rating`),
    INDEX `idx_is_approved` (`is_approved`),
    INDEX `idx_review_date` (`review_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 7. Product Offers Table
$offers_table = "CREATE TABLE IF NOT EXISTS `product_offers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `offer_name` VARCHAR(100) NOT NULL,
    `offer_type` ENUM('percentage', 'flat', 'bogo', 'shipping') NOT NULL,
    `offer_value` DECIMAL(10,2) DEFAULT 0.00,
    `min_purchase` DECIMAL(10,2) DEFAULT 0.00,
    `is_active` BOOLEAN DEFAULT true,
    `start_date` DATE,
    `end_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_is_active` (`is_active`),
    INDEX `idx_end_date` (`end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 8. Product Coupons Table
$coupons_table = "CREATE TABLE IF NOT EXISTS `product_coupons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `coupon_code` VARCHAR(50) UNIQUE NOT NULL,
    `coupon_type` ENUM('percentage', 'flat') NOT NULL,
    `coupon_value` DECIMAL(10,2) DEFAULT 0.00,
    `min_purchase` DECIMAL(10,2) DEFAULT 0.00,
    `usage_limit` INT DEFAULT 0,
    `usage_count` INT DEFAULT 0,
    `start_date` DATE,
    `expiry_date` DATE,
    `categories` JSON,
    `is_active` BOOLEAN DEFAULT true,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_coupon_code` (`coupon_code`),
    INDEX `idx_is_active` (`is_active`),
    INDEX `idx_expiry_date` (`expiry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 9. Categories Table
$categories_table = "CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `parent_id` INT DEFAULT NULL,
    `image_url` TEXT,
    `display_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT true,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
    INDEX `idx_slug` (`slug`),
    INDEX `idx_parent_id` (`parent_id`),
    INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 10. Brands Table
$brands_table = "CREATE TABLE IF NOT EXISTS `brands` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `logo_url` TEXT,
    `is_active` BOOLEAN DEFAULT true,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 11. Tags Table
$tags_table = "CREATE TABLE IF NOT EXISTS `tags` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `slug` VARCHAR(50) NOT NULL UNIQUE,
    `product_count` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 12. Media Metadata Table
$media_table = "CREATE TABLE IF NOT EXISTS `media_metadata` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `media_type` ENUM('image', 'video') NOT NULL,
    `media_url` TEXT NOT NULL,
    `element_id` VARCHAR(100),
    `styles` JSON,
    `attributes` JSON,
    `position_in_content` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_element_id` (`element_id`),
    INDEX `idx_media_type` (`media_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 13. Product Tags Relationship Table
$product_tags_table = "CREATE TABLE IF NOT EXISTS `product_tags` (
    `product_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`product_id`, `tag_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE,
    INDEX `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// 14. Product Categories Relationship Table
$product_categories_table = "CREATE TABLE IF NOT EXISTS `product_categories` (
    `product_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`product_id`, `category_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
    INDEX `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

// Create all tables
$tables = [
    'products' => $products_table,
    'product_gallery' => $gallery_table,
    'product_variations' => $variations_table,
    'product_description_tabs' => $tabs_table,
    'product_faqs' => $faqs_table,
    'product_reviews' => $reviews_table,
    'product_offers' => $offers_table,
    'product_coupons' => $coupons_table,
    'categories' => $categories_table,
    'brands' => $brands_table,
    'tags' => $tags_table,
    'media_metadata' => $media_table,
    'product_tags' => $product_tags_table,
    'product_categories' => $product_categories_table
];

foreach ($tables as $table_name => $table_sql) {
    create_table($conn, $table_name, $table_sql);
}


// Seed categories
$categories = [
    ['Hair Care', 'hair-care', 'Hair care products'],
    ['Skin Care', 'skin-care', 'Skin care products'],
    ['Body Care', 'body-care', 'Body care products'],
    ['Face Care', 'face-care', 'Face care products'],
    ['Makeup', 'makeup', 'Makeup products'],
    ['Fragrance', 'fragrance', 'Fragrance products'],
    ['Wellness', 'wellness', 'Wellness products']
];

$categories_count = 0;
foreach ($categories as $category) {
    $name = $conn->real_escape_string($category[0]);
    $slug = $conn->real_escape_string($category[1]);
    $description = $conn->real_escape_string($category[2]);
    
    $sql = "INSERT IGNORE INTO categories (name, slug, description) 
            VALUES ('$name', '$slug', '$description')";
    
    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0) {
            $categories_count++;
        }
    }
}

// Seed brands
$brands = [
    ['Naturali', 'naturali', 'Natural and organic products'],
    ['Organic Touch', 'organic-touch', 'Pure organic beauty'],
    ['PureGlow', 'pureglow', 'For glowing skin'],
    ['Herbal Essence', 'herbal-essence', 'Herbal formulations'],
    ['Forest Secrets', 'forest-secrets', 'Forest-inspired products']
];

$brands_count = 0;
foreach ($brands as $brand) {
    $name = $conn->real_escape_string($brand[0]);
    $slug = $conn->real_escape_string($brand[1]);
    $description = $conn->real_escape_string($brand[2]);
    
    $sql = "INSERT IGNORE INTO brands (name, slug, description) 
            VALUES ('$name', '$slug', '$description')";
    
    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0) {
            $brands_count++;
        }
    }
}
$sample_product = [
    'name' => 'Naturali Anti-Frizz Shampoo',
    'slug' => 'naturali-anti-frizz-shampoo',
    'short_description' => 'This anti-frizz shampoo tames frizzy hair and restores natural shine.',
    'base_price' => 599.00,
    'sale_price' => 499.00,
    'sku' => 'NAS-001',
    'stock_status' => 'In Stock',
    'stock_qty' => 100,
    'manage_stock' => 1,
    'low_stock_threshold' => 10,
    'weight' => 0.5,
    'weight_unit' => 'kg',
    'brand' => 'Naturali',
    'status' => 'active',
    'seo_title' => 'Naturali Anti-Frizz Shampoo | Buy Online',
    'seo_description' => 'Get Naturali Anti-Frizz Shampoo for smooth, shiny hair.'
];

// Build SQL for sample product
$fields = [];
$values = [];
foreach ($sample_product as $field => $value) {
    $fields[] = "`$field`";
    if (is_string($value)) {
        $values[] = "'" . $conn->real_escape_string($value) . "'";
    } else {
        $values[] = $value;
    }
}

$sql = "INSERT IGNORE INTO products (" . implode(', ', $fields) . ") 
        VALUES (" . implode(', ', $values) . ")";

if ($conn->query($sql) === TRUE) {
    if ($conn->affected_rows > 0) {
        $product_id = $conn->insert_id;
        
        // Add sample description tab
        $tab_content = "<h1>Naturali Anti-Frizz Shampoo</h1>
        <h2>Why Choose Our Shampoo?</h2>
        <p>Our anti-frizz shampoo is specially formulated to tame frizzy hair and restore natural shine.</p>
        <ul>
        <li>Reduces frizz by 80%</li>
        <li>Adds natural shine</li>
        <li>Strengthens hair from roots</li>
        <li>Free from harsh chemicals</li>
        </ul>";
        
        $tab_content_escaped = $conn->real_escape_string($tab_content);
        $tab_sql = "INSERT INTO product_description_tabs (product_id, tab_title, tab_content) 
                   VALUES ($product_id, 'Description', '$tab_content_escaped')";
        
        if ($conn->query($tab_sql) === TRUE) {
            echo "✅ Added sample description tab\n";
        }
    } else {
        echo "⚠️ Sample product already exists\n";
    }
}

// Create uploads directory
$base_dir = dirname(__DIR__);
$uploads_dir = $base_dir . '/uploads';
if (!file_exists($uploads_dir)) {
    mkdir($uploads_dir, 0755, true);
    mkdir($uploads_dir . '/products', 0755, true);
    echo "✅ Created uploads directory\n";
} else {
    echo "✅ Uploads directory already exists\n";
}

// Create .htaccess for uploads protection
$htaccess_content = "# Deny access to PHP files in uploads directory
<FilesMatch \"\.(php|php5|phtml)$\">
    Order Deny,Allow
    Deny from all
</FilesMatch>

# Allow image and video files
<FilesMatch \"\.(jpg|jpeg|png|gif|webp|mp4|avi|mov|wmv)$\">
    Order Allow,Deny
    Allow from all
</FilesMatch>";

file_put_contents($uploads_dir . '/.htaccess', $htaccess_content);

$conn->close();
?>