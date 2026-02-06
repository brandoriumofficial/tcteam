<?php
// create_tables_simple.php
require_once 'db.php';

// Create offers table
$offers_sql = "CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    offer_type VARCHAR(50) NOT NULL,
    discount_details TEXT,
    category VARCHAR(100),
    products JSON,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    banner_image VARCHAR(500),
    tags JSON,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

// Create coupons table
$coupons_sql = "CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed', 'free_shipping') DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2) DEFAULT 0,
    category VARCHAR(100),
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

// Execute queries
$conn->query($offers_sql);
$conn->query($coupons_sql);

?>