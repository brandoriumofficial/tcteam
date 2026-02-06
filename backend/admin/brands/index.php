<?php
// CORS Headers - MUST be at the very top
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type
header("Content-Type: application/json; charset=UTF-8");

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Include database connection
require_once '../../database/db.php';

// Check database connection
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Database connection failed'
    ]);
    exit();
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Define upload directory paths
define('UPLOAD_PATH', '../../uploads/brands/');
define('UPLOAD_URL', '/uploads/brands/');

// Create upload directory if not exists
if (!file_exists(UPLOAD_PATH)) {
    mkdir(UPLOAD_PATH, 0777, true);
}

// Route requests based on method
try {
    switch($method) {
        case 'GET':
            if ($action === 'single' && isset($_GET['id'])) {
                getBrand($_GET['id']);
            } else {
                getAllBrands();
            }
            break;
        
        case 'POST':
            // Check for method override for PUT
            if (isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
                updateBrand();
            } else {
                createBrand();
            }
            break;
        
        case 'PUT':
            updateBrand();
            break;
        
        case 'DELETE':
            if (isset($_GET['id'])) {
                deleteBrand($_GET['id']);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Brand ID required']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

// ==================== FUNCTIONS ====================

/**
 * Get all brands
 */
function getAllBrands() {
    global $conn;
    
    try {
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $status = isset($_GET['status']) ? $_GET['status'] : 'all';
        
        $sql = "SELECT * FROM brands WHERE 1=1";
        $params = [];
        $types = "";
        
        // Search filter
        if (!empty($search)) {
            $searchParam = "%{$search}%";
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $types .= "ss";
        }
        
        // Status filter
        if ($status === 'active') {
            $sql .= " AND is_active = 1";
        } elseif ($status === 'inactive') {
            $sql .= " AND is_active = 0";
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $conn->prepare($sql);
        
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $brands = [];
        $activeCount = 0;
        $inactiveCount = 0;
        
        while ($row = $result->fetch_assoc()) {
            $isActive = $row['is_active'] == 1;
            
            if ($isActive) {
                $activeCount++;
            } else {
                $inactiveCount++;
            }
            
            $brands[] = [
                'id' => intval($row['id']),
                'name' => $row['name'],
                'slug' => $row['slug'] ?? '',
                'description' => $row['description'] ?? '',
                'image' => $row['logo_url'] ?? '',
                'status' => $isActive ? 'active' : 'inactive',
                'createdAt' => $row['created_at']
            ];
        }
        
        $stmt->close();
        
        // Statistics
        $stats = [
            'total' => count($brands),
            'active' => $activeCount,
            'inactive' => $inactiveCount
        ];
        
        echo json_encode([
            'success' => true,
            'brands' => $brands,
            'stats' => $stats
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching brands: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get single brand by ID
 */
function getBrand($id) {
    global $conn;
    
    try {
        $id = intval($id);
        
        $stmt = $conn->prepare("SELECT * FROM brands WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Brand not found']);
            return;
        }
        
        $row = $result->fetch_assoc();
        $brand = [
            'id' => intval($row['id']),
            'name' => $row['name'],
            'slug' => $row['slug'] ?? '',
            'description' => $row['description'] ?? '',
            'image' => $row['logo_url'] ?? '',
            'status' => $row['is_active'] == 1 ? 'active' : 'inactive',
            'createdAt' => $row['created_at']
        ];
        
        $stmt->close();
        
        echo json_encode(['success' => true, 'brand' => $brand]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching brand: ' . $e->getMessage()
        ]);
    }
}

/**
 * Create new brand
 */
function createBrand() {
    global $conn;
    
    try {
        $name = '';
        $slug = '';
        $description = '';
        $status = 1;
        $logo_url = '';
        
        // Get data from POST (form data)
        if (isset($_POST['name'])) {
            $name = trim($_POST['name']);
            $slug = isset($_POST['slug']) && !empty($_POST['slug']) 
                    ? trim($_POST['slug']) 
                    : generateSlug($name);
            $description = isset($_POST['description']) ? trim($_POST['description']) : '';
            $status = (isset($_POST['status']) && $_POST['status'] === 'active') ? 1 : 0;
            
            // Handle file upload
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $uploadResult = uploadImage($_FILES['image']);
                if ($uploadResult['success']) {
                    $logo_url = $uploadResult['url'];
                } else {
                    throw new Exception($uploadResult['message']);
                }
            } elseif (isset($_POST['imageBase64']) && !empty($_POST['imageBase64'])) {
                $uploadResult = saveBase64Image($_POST['imageBase64']);
                if ($uploadResult['success']) {
                    $logo_url = $uploadResult['url'];
                } else {
                    throw new Exception($uploadResult['message']);
                }
            }
        } else {
            // Get data from JSON
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data');
            }
            
            $name = isset($data['name']) ? trim($data['name']) : '';
            $slug = isset($data['slug']) && !empty($data['slug']) 
                    ? trim($data['slug']) 
                    : generateSlug($name);
            $description = isset($data['description']) ? trim($data['description']) : '';
            $status = (isset($data['status']) && $data['status'] === 'active') ? 1 : 0;
            
            // Handle base64 image from JSON
            if (isset($data['image']) && !empty($data['image'])) {
                if (strpos($data['image'], 'data:image') === 0) {
                    $uploadResult = saveBase64Image($data['image']);
                    if ($uploadResult['success']) {
                        $logo_url = $uploadResult['url'];
                    }
                } else {
                    $logo_url = $data['image'];
                }
            }
        }
        
        // Validate required fields
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Brand name is required']);
            return;
        }
        
        // Check if brand name already exists
        $checkStmt = $conn->prepare("SELECT id FROM brands WHERE name = ?");
        $checkStmt->bind_param("s", $name);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $checkStmt->close();
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Brand name already exists']);
            return;
        }
        $checkStmt->close();
        
        // Check if slug exists and make unique
        $slugCheckStmt = $conn->prepare("SELECT id FROM brands WHERE slug = ?");
        $slugCheckStmt->bind_param("s", $slug);
        $slugCheckStmt->execute();
        $slugResult = $slugCheckStmt->get_result();
        
        if ($slugResult->num_rows > 0) {
            $slug = $slug . '-' . time();
        }
        $slugCheckStmt->close();
        
        // Insert brand
        $insertStmt = $conn->prepare(
            "INSERT INTO brands (name, slug, description, logo_url, is_active, created_at) 
             VALUES (?, ?, ?, ?, ?, NOW())"
        );
        $insertStmt->bind_param("ssssi", $name, $slug, $description, $logo_url, $status);
        
        if (!$insertStmt->execute()) {
            throw new Exception($insertStmt->error);
        }
        
        $newId = $insertStmt->insert_id;
        $insertStmt->close();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Brand added successfully',
            'brand' => [
                'id' => $newId,
                'name' => $name,
                'slug' => $slug,
                'description' => $description,
                'image' => $logo_url,
                'status' => $status == 1 ? 'active' : 'inactive',
                'createdAt' => date('Y-m-d H:i:s')
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error creating brand: ' . $e->getMessage()
        ]);
    }
}

/**
 * Update brand
 */
function updateBrand() {
    global $conn;
    
    try {
        $id = 0;
        $name = '';
        $slug = '';
        $description = '';
        $status = 1;
        $logo_url = '';
        $deleteOldImage = false;
        
        // Check if data came as form data (with _method=PUT)
        if (isset($_POST['id'])) {
            $id = intval($_POST['id']);
            $name = isset($_POST['name']) ? trim($_POST['name']) : '';
            $slug = isset($_POST['slug']) ? trim($_POST['slug']) : '';
            $description = isset($_POST['description']) ? trim($_POST['description']) : '';
            $status = (isset($_POST['status']) && $_POST['status'] === 'active') ? 1 : 0;
            
            // Get current brand
            $currentStmt = $conn->prepare("SELECT logo_url FROM brands WHERE id = ?");
            $currentStmt->bind_param("i", $id);
            $currentStmt->execute();
            $currentResult = $currentStmt->get_result();
            
            if ($currentResult->num_rows === 0) {
                $currentStmt->close();
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Brand not found']);
                return;
            }
            
            $currentBrand = $currentResult->fetch_assoc();
            $logo_url = $currentBrand['logo_url'] ?? '';
            $currentStmt->close();
            
            // Handle new image upload
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                // Delete old image
                if (!empty($currentBrand['logo_url'])) {
                    deleteOldImage($currentBrand['logo_url']);
                }
                
                $uploadResult = uploadImage($_FILES['image']);
                if ($uploadResult['success']) {
                    $logo_url = $uploadResult['url'];
                }
            } elseif (isset($_POST['imageBase64']) && !empty($_POST['imageBase64'])) {
                // Delete old image
                if (!empty($currentBrand['logo_url'])) {
                    deleteOldImage($currentBrand['logo_url']);
                }
                
                $uploadResult = saveBase64Image($_POST['imageBase64']);
                if ($uploadResult['success']) {
                    $logo_url = $uploadResult['url'];
                }
            } elseif (isset($_POST['existingImage'])) {
                $logo_url = $_POST['existingImage'];
            }
            
        } else {
            // JSON data (for PUT request)
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data');
            }
            
            $id = isset($data['id']) ? intval($data['id']) : 0;
            $name = isset($data['name']) ? trim($data['name']) : '';
            $slug = isset($data['slug']) ? trim($data['slug']) : '';
            $description = isset($data['description']) ? trim($data['description']) : '';
            $status = (isset($data['status']) && $data['status'] === 'active') ? 1 : 0;
            
            // Get current brand
            $currentStmt = $conn->prepare("SELECT logo_url FROM brands WHERE id = ?");
            $currentStmt->bind_param("i", $id);
            $currentStmt->execute();
            $currentResult = $currentStmt->get_result();
            
            if ($currentResult->num_rows === 0) {
                $currentStmt->close();
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Brand not found']);
                return;
            }
            
            $currentBrand = $currentResult->fetch_assoc();
            $logo_url = $currentBrand['logo_url'] ?? '';
            $currentStmt->close();
            
            // Handle image from JSON
            if (isset($data['image']) && !empty($data['image'])) {
                if (strpos($data['image'], 'data:image') === 0) {
                    // New base64 image - delete old
                    if (!empty($currentBrand['logo_url'])) {
                        deleteOldImage($currentBrand['logo_url']);
                    }
                    
                    $uploadResult = saveBase64Image($data['image']);
                    if ($uploadResult['success']) {
                        $logo_url = $uploadResult['url'];
                    }
                } elseif (strpos($data['image'], '/uploads/') !== false) {
                    // Existing image URL - extract path
                    $logo_url = $data['image'];
                    // Remove domain if present
                    if (strpos($logo_url, 'http') === 0) {
                        $parsedUrl = parse_url($logo_url);
                        $logo_url = $parsedUrl['path'] ?? $logo_url;
                    }
                } else {
                    $logo_url = $data['image'];
                }
            }
        }
        
        // Validate
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid brand ID']);
            return;
        }
        
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Brand name is required']);
            return;
        }
        
        // Check if name is unique (excluding current brand)
        $nameCheckStmt = $conn->prepare("SELECT id FROM brands WHERE name = ? AND id != ?");
        $nameCheckStmt->bind_param("si", $name, $id);
        $nameCheckStmt->execute();
        $nameCheckResult = $nameCheckStmt->get_result();
        
        if ($nameCheckResult->num_rows > 0) {
            $nameCheckStmt->close();
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Brand name already exists']);
            return;
        }
        $nameCheckStmt->close();
        
        // Update brand
        $updateStmt = $conn->prepare(
            "UPDATE brands 
             SET name = ?, slug = ?, description = ?, logo_url = ?, is_active = ?, updated_at = NOW()
             WHERE id = ?"
        );
        $updateStmt->bind_param("ssssii", $name, $slug, $description, $logo_url, $status, $id);
        
        if (!$updateStmt->execute()) {
            throw new Exception($updateStmt->error);
        }
        
        $updateStmt->close();
        
        echo json_encode([
            'success' => true,
            'message' => 'Brand updated successfully',
            'brand' => [
                'id' => $id,
                'name' => $name,
                'slug' => $slug,
                'description' => $description,
                'image' => $logo_url,
                'status' => $status == 1 ? 'active' : 'inactive'
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error updating brand: ' . $e->getMessage()
        ]);
    }
}

/**
 * Delete brand
 */
function deleteBrand($id) {
    global $conn;
    
    try {
        $id = intval($id);
        
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid brand ID']);
            return;
        }
        
        // Get brand image to delete
        $stmt = $conn->prepare("SELECT logo_url FROM brands WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Brand not found']);
            return;
        }
        
        $brand = $result->fetch_assoc();
        $stmt->close();
        
        // Delete image file if exists
        if (!empty($brand['logo_url'])) {
            deleteOldImage($brand['logo_url']);
        }
        
        // Delete brand from database
        $deleteStmt = $conn->prepare("DELETE FROM brands WHERE id = ?");
        $deleteStmt->bind_param("i", $id);
        
        if (!$deleteStmt->execute()) {
            throw new Exception($deleteStmt->error);
        }
        
        $deleteStmt->close();
        
        echo json_encode([
            'success' => true,
            'message' => 'Brand deleted successfully'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting brand: ' . $e->getMessage()
        ]);
    }
}

/**
 * Upload image file
 */
function uploadImage($file) {
    try {
        // Create upload directory if not exists
        if (!file_exists(UPLOAD_PATH)) {
            if (!mkdir(UPLOAD_PATH, 0777, true)) {
                throw new Exception('Failed to create upload directory');
            }
        }
        
        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, $allowedTypes)) {
            return [
                'success' => false, 
                'message' => 'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.'
            ];
        }
        
        // Check file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            return [
                'success' => false, 
                'message' => 'File size too large. Maximum 5MB allowed.'
            ];
        }
        
        // Generate unique filename
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            $extension = 'jpg';
        }
        $filename = 'brand_' . uniqid() . '_' . time() . '.' . $extension;
        $uploadPath = UPLOAD_PATH . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            throw new Exception('Failed to move uploaded file');
        }
        
        return [
            'success' => true,
            'url' => UPLOAD_URL . $filename,
            'filename' => $filename
        ];
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

/**
 * Save base64 encoded image
 */
function saveBase64Image($base64String) {
    try {
        // Create upload directory if not exists
        if (!file_exists(UPLOAD_PATH)) {
            if (!mkdir(UPLOAD_PATH, 0777, true)) {
                throw new Exception('Failed to create upload directory');
            }
        }
        
        // Validate base64 format
        if (strpos($base64String, ',') === false) {
            throw new Exception('Invalid base64 format');
        }
        
        // Extract base64 data
        $parts = explode(',', $base64String);
        $imageData = base64_decode($parts[1]);
        
        if ($imageData === false) {
            throw new Exception('Failed to decode base64 image');
        }
        
        // Get image type from header
        preg_match('/^data:image\/(\w+);base64,/', $base64String, $matches);
        $extension = isset($matches[1]) ? strtolower($matches[1]) : 'png';
        
        // Validate and normalize extension
        $allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
        if (!in_array($extension, $allowedExtensions)) {
            $extension = 'png';
        }
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }
        
        // Generate unique filename
        $filename = 'brand_' . uniqid() . '_' . time() . '.' . $extension;
        $uploadPath = UPLOAD_PATH . $filename;
        
        // Save image file
        if (file_put_contents($uploadPath, $imageData) === false) {
            throw new Exception('Failed to save image file');
        }
        
        return [
            'success' => true,
            'url' => UPLOAD_URL . $filename,
            'filename' => $filename
        ];
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

/**
 * Delete old image file
 */
function deleteOldImage($imageUrl) {
    try {
        if (empty($imageUrl)) return;
        
        // Extract filename from URL
        $filename = basename($imageUrl);
        $filePath = UPLOAD_PATH . $filename;
        
        // Delete file if exists
        if (file_exists($filePath) && is_file($filePath)) {
            @unlink($filePath);
        }
    } catch (Exception $e) {
        error_log('Error deleting image: ' . $e->getMessage());
    }
}

/**
 * Generate URL-friendly slug
 */
function generateSlug($text) {
    // Convert to lowercase
    $text = strtolower(trim($text));
    
    // Replace spaces and special characters with hyphens
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    
    // Remove leading/trailing hyphens
    $text = trim($text, '-');
    
    // Replace multiple hyphens with single hyphen
    $text = preg_replace('/-+/', '-', $text);
    
    return $text;
}

// Close database connection at the end
register_shutdown_function(function() {
    global $conn;
    if (isset($conn) && $conn) {
        $conn->close();
    }
});
?>