<?php
// database/migrate_users.php
require_once '../../database/db.php';

$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql)) {
    // Insert default admin user if not exists
    $check_sql = "SELECT COUNT(*) as count FROM users WHERE email = 'admin@example.com'";
    $result = $conn->query($check_sql);
    $row = $result->fetch_assoc();
    
    if ($row['count'] == 0) {
        $password = password_hash('admin123', PASSWORD_BCRYPT);
        $token = bin2hex(random_bytes(32));
        
        $insert_sql = "INSERT INTO users (full_name, email, password, token, role) 
                       VALUES ('Admin User', 'admin@example.com', ?, ?, 'admin')";
        $stmt = $conn->prepare($insert_sql);
        $stmt->bind_param("ss", $password, $token);
        $stmt->execute();
        
        echo "Default admin user created: admin@example.com / admin123";
    }
} else {
    echo "Error creating users table: " . $conn->error;
}
?>