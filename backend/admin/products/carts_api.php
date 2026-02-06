<?php
require '../../database/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Database connection check
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit;
}

// Function to check and create cart table
function initializeCartTable($conn) {
    try {
        $check = $conn->query("SHOW TABLES LIKE 'cart'");
        if ($check && $check->num_rows == 0) {
            $sql = "CREATE TABLE IF NOT EXISTS cart (
                id INT PRIMARY KEY AUTO_INCREMENT,
                session_id VARCHAR(255) NOT NULL,
                user_id INT DEFAULT NULL,
                product_id INT NOT NULL,
                variation_id INT DEFAULT NULL,
                quantity INT NOT NULL DEFAULT 1,
                price DECIMAL(10,2) NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                applied_coupon_id INT DEFAULT NULL,
                applied_offer_id INT DEFAULT NULL,
                discount_amount DECIMAL(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_session (session_id),
                INDEX idx_user (user_id),
                INDEX idx_product (product_id),
                INDEX idx_coupon (applied_coupon_id),
                INDEX idx_offer (applied_offer_id),
                UNIQUE KEY unique_cart_item (session_id, product_id, variation_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
            
            if ($conn->query($sql) === TRUE) {
                error_log("cart table created successfully");
                return true;
            } else {
                error_log("Cart table creation failed: " . $conn->error);
                return false;
            }
        }
        return true;
    } catch (Exception $e) {
        error_log("Cart table initialization error: " . $e->getMessage());
        return false;
    }
}

// Initialize table
initializeCartTable($conn);

$action = isset($_GET['action']) ? $_GET['action'] : '';
$input = json_decode(file_get_contents('php://input'), true);
if ($input === null && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = $_POST;
}

switch ($action) {
    case 'get':
        getCart($conn);
        break;
    case 'add':
        addToCart($conn, $input);
        break;
    case 'update':
        updateCart($conn, $input);
        break;
    case 'remove':
        removeFromCart($conn, $input);
        break;
    case 'clear':
        clearCart($conn);
        break;
    case 'apply-coupon':
        applyCouponToCart($conn, $input);
        break;
    case 'remove-coupon':
        removeCouponFromCart($conn);
        break;
    case 'apply-offer':
        applyOfferToCart($conn, $input);
        break;
    case 'remove-offer':
        removeOfferFromCart($conn);
        break;
    case 'calculate':
        calculateCart($conn);
        break;
    case 'merge':
        mergeCart($conn, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action: ' . $action]);
        break;
}

function getCart($conn) {
    try {
        $sessionId = getSessionId();
        $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
        
        $query = "SELECT c.*, 
                         p.name as product_name,
                         p.sku as product_sku,
                         p.feature_image as product_image,
                         p.stock_status as stock_status,
                         p.stock_qty as stock_quantity,
                         v.size as variation_size,
                         v.unit as variation_unit,
                         v.price as variation_price,
                         cp.code as coupon_code,
                         cp.name as coupon_name,
                         o.name as offer_name
                  FROM cart c
                  JOIN products p ON c.product_id = p.id
                  LEFT JOIN product_variations v ON c.variation_id = v.id
                  LEFT JOIN coupons cp ON c.applied_coupon_id = cp.id
                  LEFT JOIN smart_offers o ON c.applied_offer_id = o.id
                  WHERE c.session_id = ?";
        
        $params = [$sessionId];
        $types = 's';
        
        if ($userId) {
            $query .= " OR c.user_id = ?";
            $params[] = $userId;
            $types .= 'i';
        }
        
        $query .= " ORDER BY c.created_at DESC";
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $cartItems = [];
        $totalItems = 0;
        $subtotal = 0;
        $totalDiscount = 0;
        
        while ($row = $result->fetch_assoc()) {
            // Calculate item total
            $itemPrice = $row['variation_price'] ? floatval($row['variation_price']) : floatval($row['price']);
            $itemTotal = $itemPrice * intval($row['quantity']);
            $itemDiscount = floatval($row['discount_amount']);
            
            $cartItems[] = [
                'id' => $row['id'],
                'product_id' => $row['product_id'],
                'product_name' => $row['product_name'],
                'product_sku' => $row['product_sku'],
                'product_image' => $row['product_image'],
                'variation_id' => $row['variation_id'],
                'variation_size' => $row['variation_size'],
                'variation_unit' => $row['variation_unit'],
                'quantity' => intval($row['quantity']),
                'price' => $itemPrice,
                'total' => $itemTotal,
                'stock_status' => $row['stock_status'],
                'stock_quantity' => intval($row['stock_quantity']),
                'applied_coupon' => $row['coupon_code'] ? [
                    'code' => $row['coupon_code'],
                    'name' => $row['coupon_name']
                ] : null,
                'applied_offer' => $row['offer_name'] ? [
                    'name' => $row['offer_name']
                ] : null,
                'discount_amount' => $itemDiscount
            ];
            
            $totalItems += intval($row['quantity']);
            $subtotal += $itemTotal;
            $totalDiscount += $itemDiscount;
        }
        $stmt->close();
        
        // Calculate totals
        $shipping = calculateShipping($cartItems, $subtotal);
        $tax = calculateTax($subtotal - $totalDiscount);
        $grandTotal = max(0, $subtotal - $totalDiscount + $shipping + $tax);
        
        // Get available coupons and offers for this cart
        $availableCoupons = getAvailableCouponsForCart($conn, $cartItems, $subtotal, $userId);
        $availableOffers = getAvailableOffersForCart($conn, $cartItems, $subtotal, $userId);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'items' => $cartItems,
                'summary' => [
                    'total_items' => $totalItems,
                    'total_unique_items' => count($cartItems),
                    'subtotal' => round($subtotal, 2),
                    'discount' => round($totalDiscount, 2),
                    'shipping' => round($shipping, 2),
                    'tax' => round($tax, 2),
                    'grand_total' => round($grandTotal, 2)
                ],
                'available_coupons' => $availableCoupons,
                'available_offers' => $availableOffers,
                'session_id' => $sessionId
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Get Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to get cart: ' . $e->getMessage()]);
    }
}

function addToCart($conn, $input) {
    $productId = isset($input['product_id']) ? intval($input['product_id']) : 0;
    $variationId = isset($input['variation_id']) ? intval($input['variation_id']) : null;
    $quantity = isset($input['quantity']) ? intval($input['quantity']) : 1;
    $userId = isset($input['user_id']) ? intval($input['user_id']) : null;
    
    if ($productId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        exit;
    }
    
    if ($quantity <= 0) {
        echo json_encode(['success' => false, 'message' => 'Quantity must be greater than 0']);
        exit;
    }
    
    try {
        $sessionId = getSessionId();
        
        // Get product details
        $product = getProductDetails($conn, $productId, $variationId);
        if (!$product) {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            exit;
        }
        
        // Check stock availability
        if ($product['stock_status'] === 'Out of Stock') {
            echo json_encode(['success' => false, 'message' => 'Product is out of stock']);
            exit;
        }
        
        if ($product['manage_stock'] && $product['stock_quantity'] < $quantity) {
            echo json_encode([
                'success' => false, 
                'message' => 'Only ' . $product['stock_quantity'] . ' items available in stock',
                'available_quantity' => $product['stock_quantity']
            ]);
            exit;
        }
        
        $price = $product['price'];
        $total = $price * $quantity;
        
        // Check if item already exists in cart
        $checkStmt = $conn->prepare("SELECT id, quantity FROM cart WHERE session_id = ? AND product_id = ? AND variation_id = ?");
        $checkVariationId = $variationId ?: null;
        $checkStmt->bind_param("sii", $sessionId, $productId, $checkVariationId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            // Update existing item
            $existing = $checkResult->fetch_assoc();
            $newQuantity = $existing['quantity'] + $quantity;
            
            // Check stock for updated quantity
            if ($product['manage_stock'] && $product['stock_quantity'] < $newQuantity) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Cannot add more items. Only ' . $product['stock_quantity'] . ' items available in stock',
                    'available_quantity' => $product['stock_quantity']
                ]);
                exit;
            }
            
            $updateStmt = $conn->prepare("UPDATE cart SET quantity = ?, total = ?, updated_at = NOW() WHERE id = ?");
            $newTotal = $price * $newQuantity;
            $updateStmt->bind_param("idi", $newQuantity, $newTotal, $existing['id']);
            
            if ($updateStmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Cart updated successfully',
                    'cart_item_id' => $existing['id'],
                    'quantity' => $newQuantity,
                    'total' => $newTotal
                ]);
            } else {
                throw new Exception("Failed to update cart");
            }
            
            $updateStmt->close();
        } else {
            // Add new item
            $insertStmt = $conn->prepare("INSERT INTO cart (session_id, user_id, product_id, variation_id, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $insertStmt->bind_param("siiiiid", $sessionId, $userId, $productId, $variationId, $quantity, $price, $total);
            
            if ($insertStmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Item added to cart successfully',
                    'cart_item_id' => $conn->insert_id,
                    'quantity' => $quantity,
                    'total' => $total
                ]);
            } else {
                throw new Exception("Failed to add item to cart");
            }
            
            $insertStmt->close();
        }
        
        $checkStmt->close();
        
    } catch (Exception $e) {
        error_log("Add to Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to add item to cart: ' . $e->getMessage()]);
    }
}

function updateCart($conn, $input) {
    $cartItemId = isset($input['cart_item_id']) ? intval($input['cart_item_id']) : 0;
    $quantity = isset($input['quantity']) ? intval($input['quantity']) : 0;
    
    if ($cartItemId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Cart item ID is required']);
        exit;
    }
    
    if ($quantity <= 0) {
        echo json_encode(['success' => false, 'message' => 'Quantity must be greater than 0']);
        exit;
    }
    
    try {
        // Get cart item details
        $getStmt = $conn->prepare("SELECT c.product_id, c.variation_id, c.price, p.stock_status, p.manage_stock, p.stock_qty FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ?");
        $getStmt->bind_param("i", $cartItemId);
        $getStmt->execute();
        $result = $getStmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Cart item not found']);
            exit;
        }
        
        $item = $result->fetch_assoc();
        $getStmt->close();
        
        // Check stock availability
        if ($item['stock_status'] === 'Out of Stock') {
            echo json_encode(['success' => false, 'message' => 'Product is out of stock']);
            exit;
        }
        
        if ($item['manage_stock'] && $item['stock_qty'] < $quantity) {
            echo json_encode([
                'success' => false, 
                'message' => 'Only ' . $item['stock_qty'] . ' items available in stock',
                'available_quantity' => $item['stock_qty']
            ]);
            exit;
        }
        
        // Update quantity
        $total = $item['price'] * $quantity;
        $updateStmt = $conn->prepare("UPDATE cart SET quantity = ?, total = ?, updated_at = NOW() WHERE id = ?");
        $updateStmt->bind_param("idi", $quantity, $total, $cartItemId);
        
        if ($updateStmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Cart updated successfully',
                'quantity' => $quantity,
                'total' => $total
            ]);
        } else {
            throw new Exception("Failed to update cart");
        }
        
        $updateStmt->close();
        
    } catch (Exception $e) {
        error_log("Update Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to update cart: ' . $e->getMessage()]);
    }
}

function removeFromCart($conn, $input) {
    $cartItemId = isset($input['cart_item_id']) ? intval($input['cart_item_id']) : 0;
    
    if ($cartItemId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Cart item ID is required']);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM cart WHERE id = ?");
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("i", $cartItemId);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Item removed from cart successfully'
            ]);
        } else {
            throw new Exception("Failed to remove item from cart");
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Remove from Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to remove item from cart: ' . $e->getMessage()]);
    }
}

function clearCart($conn) {
    try {
        $sessionId = getSessionId();
        $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
        
        $query = "DELETE FROM cart WHERE session_id = ?";
        $params = [$sessionId];
        $types = 's';
        
        if ($userId) {
            $query .= " OR user_id = ?";
            $params[] = $userId;
            $types .= 'i';
        }
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Cart cleared successfully'
            ]);
        } else {
            throw new Exception("Failed to clear cart");
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Clear Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to clear cart: ' . $e->getMessage()]);
    }
}

function applyCouponToCart($conn, $input) {
    $couponCode = isset($input['coupon_code']) ? trim($input['coupon_code']) : '';
    $sessionId = getSessionId();
    $userId = isset($input['user_id']) ? intval($input['user_id']) : null;
    
    if (empty($couponCode)) {
        echo json_encode(['success' => false, 'message' => 'Coupon code is required']);
        exit;
    }
    
    try {
        // Get cart items
        $cartItems = getCartItems($conn, $sessionId, $userId);
        if (empty($cartItems)) {
            echo json_encode(['success' => false, 'message' => 'Cart is empty']);
            exit;
        }
        
        // Calculate cart total
        $cartTotal = 0;
        $productIds = [];
        $categoryIds = [];
        
        foreach ($cartItems as $item) {
            $cartTotal += $item['total'];
            $productIds[] = $item['product_id'];
            
            // Get product categories
            $catStmt = $conn->prepare("SELECT category FROM products WHERE id = ?");
            $catStmt->bind_param("i", $item['product_id']);
            $catStmt->execute();
            $catResult = $catStmt->get_result();
            if ($catResult->num_rows > 0) {
                $product = $catResult->fetch_assoc();
                $categories = json_decode($product['category'], true) ?? [];
                $categoryIds = array_merge($categoryIds, $categories);
            }
            $catStmt->close();
        }
        
        $categoryIds = array_unique($categoryIds);
        
        // Validate coupon
        $couponResponse = validateCouponForCart($conn, $couponCode, $cartTotal, $userId, $productIds, $categoryIds);
        
        if (!$couponResponse['success']) {
            echo json_encode($couponResponse);
            exit;
        }
        
        $coupon = $couponResponse['coupon'];
        
        // Calculate discount for each item
        $totalDiscount = 0;
        
        // For percentage discounts, distribute proportionally
        if ($coupon['type'] === 'percentage') {
            foreach ($cartItems as $item) {
                $itemDiscount = ($item['total'] / $cartTotal) * $coupon['discount_amount'];
                
                // Apply maximum discount per item if specified
                if ($coupon['max_discount'] && $itemDiscount > $coupon['max_discount']) {
                    $itemDiscount = $coupon['max_discount'];
                }
                
                // Update cart item with discount
                $updateStmt = $conn->prepare("UPDATE cart SET applied_coupon_id = ?, discount_amount = ? WHERE id = ?");
                $couponId = getCouponIdByCode($conn, $couponCode);
                $updateStmt->bind_param("idi", $couponId, $itemDiscount, $item['id']);
                $updateStmt->execute();
                $updateStmt->close();
                
                $totalDiscount += $itemDiscount;
            }
        } elseif ($coupon['type'] === 'fixed') {
            // For fixed discount, apply to cart total
            $updateStmt = $conn->prepare("UPDATE cart SET applied_coupon_id = ?, discount_amount = ? WHERE session_id = ?");
            $couponId = getCouponIdByCode($conn, $couponCode);
            $discountPerItem = $coupon['discount_amount'] / count($cartItems);
            $updateStmt->bind_param("ids", $couponId, $discountPerItem, $sessionId);
            $updateStmt->execute();
            $updateStmt->close();
            
            $totalDiscount = $coupon['discount_amount'];
        }
        
        // Record coupon usage
        recordCouponUsage($conn, $couponCode, $userId, $sessionId, $totalDiscount);
        
        echo json_encode([
            'success' => true,
            'message' => 'Coupon applied successfully',
            'coupon' => $coupon,
            'discount_amount' => $totalDiscount
        ]);
        
    } catch (Exception $e) {
        error_log("Apply Coupon to Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to apply coupon: ' . $e->getMessage()]);
    }
}

function removeCouponFromCart($conn) {
    $sessionId = getSessionId();
    $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    
    try {
        $query = "UPDATE cart SET applied_coupon_id = NULL, discount_amount = 0 WHERE session_id = ?";
        $params = [$sessionId];
        $types = 's';
        
        if ($userId) {
            $query .= " OR user_id = ?";
            $params[] = $userId;
            $types .= 'i';
        }
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Coupon removed successfully'
            ]);
        } else {
            throw new Exception("Failed to remove coupon");
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Remove Coupon from Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to remove coupon: ' . $e->getMessage()]);
    }
}

function applyOfferToCart($conn, $input) {
    $offerId = isset($input['offer_id']) ? intval($input['offer_id']) : 0;
    $sessionId = getSessionId();
    $userId = isset($input['user_id']) ? intval($input['user_id']) : null;
    
    if ($offerId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Offer ID is required']);
        exit;
    }
    
    try {
        // Get cart items
        $cartItems = getCartItems($conn, $sessionId, $userId);
        if (empty($cartItems)) {
            echo json_encode(['success' => false, 'message' => 'Cart is empty']);
            exit;
        }
        
        // Calculate cart total
        $cartTotal = 0;
        $productIds = [];
        $categoryIds = [];
        
        foreach ($cartItems as $item) {
            $cartTotal += $item['total'];
            $productIds[] = $item['product_id'];
            
            // Get product categories
            $catStmt = $conn->prepare("SELECT category FROM products WHERE id = ?");
            $catStmt->bind_param("i", $item['product_id']);
            $catStmt->execute();
            $catResult = $catStmt->get_result();
            if ($catResult->num_rows > 0) {
                $product = $catResult->fetch_assoc();
                $categories = json_decode($product['category'], true) ?? [];
                $categoryIds = array_merge($categoryIds, $categories);
            }
            $catStmt->close();
        }
        
        $categoryIds = array_unique($categoryIds);
        
        // Validate offer
        $offerResponse = validateOfferForCart($conn, $offerId, $cartTotal, $userId, $productIds, $categoryIds);
        
        if (!$offerResponse['success']) {
            echo json_encode($offerResponse);
            exit;
        }
        
        $offer = $offerResponse['offer'];
        
        // Apply offer based on type
        $totalDiscount = 0;
        
        switch ($offer['type']) {
            case 'percentage':
                $discountAmount = ($cartTotal * $offer['discount_value']) / 100;
                if ($offer['max_discount_amount'] && $discountAmount > $offer['max_discount_amount']) {
                    $discountAmount = $offer['max_discount_amount'];
                }
                $totalDiscount = $discountAmount;
                break;
                
            case 'fixed':
                $totalDiscount = min($offer['discount_value'], $cartTotal);
                break;
                
            case 'free_shipping':
                // Free shipping will be handled in shipping calculation
                $totalDiscount = 0;
                break;
                
            case 'bogo':
                // Buy One Get One logic
                $totalDiscount = applyBOGOOffer($conn, $cartItems, $offer);
                break;
                
            default:
                $totalDiscount = 0;
        }
        
        // Apply discount to cart items
        if ($totalDiscount > 0) {
            // Distribute discount proportionally
            $discountPerItem = $totalDiscount / count($cartItems);
            
            foreach ($cartItems as $item) {
                $updateStmt = $conn->prepare("UPDATE cart SET applied_offer_id = ?, discount_amount = discount_amount + ? WHERE id = ?");
                $updateStmt->bind_param("idi", $offerId, $discountPerItem, $item['id']);
                $updateStmt->execute();
                $updateStmt->close();
            }
        }
        
        // Track offer usage
        trackOfferAction($conn, [
            'offer_id' => $offerId,
            'user_id' => $userId,
            'action' => 'apply',
            'session_id' => $sessionId
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Offer applied successfully',
            'offer' => $offer,
            'discount_amount' => $totalDiscount
        ]);
        
    } catch (Exception $e) {
        error_log("Apply Offer to Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to apply offer: ' . $e->getMessage()]);
    }
}

function removeOfferFromCart($conn) {
    $sessionId = getSessionId();
    $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    
    try {
        $query = "UPDATE cart SET applied_offer_id = NULL, discount_amount = 0 WHERE session_id = ?";
        $params = [$sessionId];
        $types = 's';
        
        if ($userId) {
            $query .= " OR user_id = ?";
            $params[] = $userId;
            $types .= 'i';
        }
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Offer removed successfully'
            ]);
        } else {
            throw new Exception("Failed to remove offer");
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Remove Offer from Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to remove offer: ' . $e->getMessage()]);
    }
}

function calculateCart($conn) {
    try {
        $sessionId = getSessionId();
        $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
        
        // Get cart items
        $cartItems = getCartItems($conn, $sessionId, $userId);
        
        // Calculate totals
        $subtotal = 0;
        $totalDiscount = 0;
        $totalItems = 0;
        
        foreach ($cartItems as $item) {
            $subtotal += $item['total'];
            $totalDiscount += $item['discount_amount'];
            $totalItems += $item['quantity'];
        }
        
        $shipping = calculateShipping($cartItems, $subtotal);
        $tax = calculateTax($subtotal - $totalDiscount);
        $grandTotal = max(0, $subtotal - $totalDiscount + $shipping + $tax);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'subtotal' => round($subtotal, 2),
                'discount' => round($totalDiscount, 2),
                'shipping' => round($shipping, 2),
                'tax' => round($tax, 2),
                'grand_total' => round($grandTotal, 2),
                'total_items' => $totalItems,
                'unique_items' => count($cartItems)
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Calculate Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to calculate cart: ' . $e->getMessage()]);
    }
}

function mergeCart($conn, $input) {
    $sourceSessionId = isset($input['source_session_id']) ? $input['source_session_id'] : '';
    $targetSessionId = isset($input['target_session_id']) ? $input['target_session_id'] : getSessionId();
    $userId = isset($input['user_id']) ? intval($input['user_id']) : null;
    
    if (empty($sourceSessionId)) {
        echo json_encode(['success' => false, 'message' => 'Source session ID is required']);
        exit;
    }
    
    try {
        // Start transaction
        $conn->begin_transaction();
        
        // Get source cart items
        $sourceItems = getCartItems($conn, $sourceSessionId, null);
        
        if (empty($sourceItems)) {
            echo json_encode(['success' => true, 'message' => 'No items to merge']);
            exit;
        }
        
        $merged = 0;
        $updated = 0;
        
        foreach ($sourceItems as $sourceItem) {
            // Check if item exists in target cart
            $checkStmt = $conn->prepare("SELECT id, quantity FROM cart WHERE session_id = ? AND product_id = ? AND variation_id = ?");
            $checkVariationId = $sourceItem['variation_id'] ?: null;
            $checkStmt->bind_param("sii", $targetSessionId, $sourceItem['product_id'], $checkVariationId);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows > 0) {
                // Update quantity
                $existing = $checkResult->fetch_assoc();
                $newQuantity = $existing['quantity'] + $sourceItem['quantity'];
                $newTotal = ($sourceItem['price'] / $sourceItem['quantity']) * $newQuantity;
                
                $updateStmt = $conn->prepare("UPDATE cart SET quantity = ?, total = ?, updated_at = NOW() WHERE id = ?");
                $updateStmt->bind_param("idi", $newQuantity, $newTotal, $existing['id']);
                $updateStmt->execute();
                $updateStmt->close();
                
                $updated++;
            } else {
                // Insert new item
                $insertStmt = $conn->prepare("INSERT INTO cart (session_id, user_id, product_id, variation_id, quantity, price, total, applied_coupon_id, applied_offer_id, discount_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $insertStmt->bind_param(
                    "siiiiidiii", 
                    $targetSessionId, $userId, $sourceItem['product_id'], $sourceItem['variation_id'], 
                    $sourceItem['quantity'], $sourceItem['price'], $sourceItem['total'],
                    $sourceItem['applied_coupon_id'], $sourceItem['applied_offer_id'], $sourceItem['discount_amount']
                );
                $insertStmt->execute();
                $insertStmt->close();
                
                $merged++;
            }
            
            $checkStmt->close();
        }
        
        // Delete source cart
        $deleteStmt = $conn->prepare("DELETE FROM cart WHERE session_id = ?");
        $deleteStmt->bind_param("s", $sourceSessionId);
        $deleteStmt->execute();
        $deleteStmt->close();
        
        // Commit transaction
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Cart merged successfully',
            'merged_items' => $merged,
            'updated_items' => $updated
        ]);
        
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        error_log("Merge Cart Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to merge cart: ' . $e->getMessage()]);
    }
}

// Helper functions
function getSessionId() {
    if (!isset($_COOKIE['cart_session'])) {
        $sessionId = uniqid('cart_', true);
        setcookie('cart_session', $sessionId, time() + (86400 * 30), "/"); // 30 days
        $_COOKIE['cart_session'] = $sessionId;
    }
    return $_COOKIE['cart_session'];
}

function getProductDetails($conn, $productId, $variationId = null) {
    $query = "SELECT p.*, pv.price as variation_price, pv.stock as variation_stock 
              FROM products p
              LEFT JOIN product_variations pv ON p.id = pv.product_id AND pv.id = ?
              WHERE p.id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $variationId, $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return null;
    }
    
    $product = $result->fetch_assoc();
    $stmt->close();
    
    // Use variation price if available
    if ($variationId && $product['variation_price']) {
        $product['price'] = $product['variation_price'];
        $product['stock_quantity'] = $product['variation_stock'] ?? $product['stock_qty'];
    } else {
        $product['stock_quantity'] = $product['stock_qty'];
    }
    
    return $product;
}

function getCartItems($conn, $sessionId, $userId = null) {
    $query = "SELECT * FROM cart WHERE session_id = ?";
    $params = [$sessionId];
    $types = 's';
    
    if ($userId) {
        $query .= " OR user_id = ?";
        $params[] = $userId;
        $types .= 'i';
    }
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    
    $stmt->close();
    return $items;
}

function calculateShipping($cartItems, $subtotal) {
    // Default shipping logic
    $shipping = 0;
    
    // Check for free shipping offers
    foreach ($cartItems as $item) {
        if ($item['applied_offer_id']) {
            // Check if this offer provides free shipping
            // This would require checking the offer details
        }
    }
    
    // If no free shipping, calculate based on subtotal
    if ($shipping === 0) {
        if ($subtotal >= 1000) {
            $shipping = 0; // Free shipping for orders above ₹1000
        } else {
            $shipping = 50; // Standard shipping charge
        }
    }
    
    return $shipping;
}

function calculateTax($amount) {
    // 18% GST
    return $amount * 0.18;
}

function getAvailableCouponsForCart($conn, $cartItems, $cartTotal, $userId) {
    $productIds = [];
    $categoryIds = [];
    
    foreach ($cartItems as $item) {
        $productIds[] = $item['product_id'];
    }
    
    // Call coupon API to get available coupons
    // This is a simplified version - in reality, you'd call the coupons_api.php
    return [];
}

function getAvailableOffersForCart($conn, $cartItems, $cartTotal, $userId) {
    $productIds = [];
    $categoryIds = [];
    
    foreach ($cartItems as $item) {
        $productIds[] = $item['product_id'];
    }
    
    // Call offer API to get available offers
    // This is a simplified version - in reality, you'd call the offers_api.php
    return [];
}

function validateCouponForCart($conn, $couponCode, $cartTotal, $userId, $productIds, $categoryIds) {
    // Call the coupon validation API
    // This is a simplified version
    $couponData = [
        'code' => $couponCode,
        'cart_amount' => $cartTotal,
        'user_id' => $userId,
        'product_ids' => $productIds,
        'category_ids' => $categoryIds
    ];
    
    // In a real implementation, you would call coupons_api.php?action=validate
    return ['success' => false, 'message' => 'Coupon validation not implemented'];
}

function validateOfferForCart($conn, $offerId, $cartTotal, $userId, $productIds, $categoryIds) {
    // Call the offer validation API
    // This is a simplified version
    $offerData = [
        'offer_id' => $offerId,
        'cart_amount' => $cartTotal,
        'user_id' => $userId,
        'product_ids' => $productIds,
        'category_ids' => $categoryIds
    ];
    
    // In a real implementation, you would call offers_api.php?action=validate
    return ['success' => false, 'message' => 'Offer validation not implemented'];
}

function getCouponIdByCode($conn, $couponCode) {
    $stmt = $conn->prepare("SELECT id FROM coupons WHERE code = ?");
    $stmt->bind_param("s", $couponCode);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['id'];
    }
    
    return null;
}

function recordCouponUsage($conn, $couponCode, $userId, $sessionId, $discountAmount) {
    $couponId = getCouponIdByCode($conn, $couponCode);
    if (!$couponId) {
        return;
    }
    
    $stmt = $conn->prepare("INSERT INTO coupon_usage (coupon_id, user_id, user_email, discount_amount, ip_address, user_agent) VALUES (?, ?, NULL, ?, ?, ?)");
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $stmt->bind_param("iidss", $couponId, $userId, $discountAmount, $ipAddress, $userAgent);
    $stmt->execute();
    $stmt->close();
}

function applyBOGOOffer($conn, $cartItems, $offer) {
    // Simplified BOGO logic
    // In reality, this would be more complex based on offer conditions
    $discount = 0;
    
    // For now, apply 50% discount on every second item
    foreach ($cartItems as $item) {
        if ($item['quantity'] >= 2) {
            $pairs = floor($item['quantity'] / 2);
            $itemPrice = $item['total'] / $item['quantity'];
            $discount += $pairs * $itemPrice * 0.5; // 50% off on every second item
        }
    }
    
    return $discount;
}

$conn->close();
?>