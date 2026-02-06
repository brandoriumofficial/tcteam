<?php
// CORS Headers - सबसे पहले ये headers add करो
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../../database/db.php';

// Get parameters
$action = isset($_GET['action']) ? $_GET['action'] : 'all';
$filter = isset($_GET['filter']) ? $_GET['filter'] : 'This Month';

// Date filter function
function getDateFilter($filter) {
    switch($filter) {
        case 'Last 7 Days':
            return date('Y-m-d', strtotime('-7 days'));
        case 'This Month':
            return date('Y-m-01');
        case 'This Year':
            return date('Y-01-01');
        default:
            return date('Y-m-01');
    }
}

// Previous period for growth calculation
function getPreviousDateFilter($filter) {
    switch($filter) {
        case 'Last 7 Days':
            return date('Y-m-d', strtotime('-14 days'));
        case 'This Month':
            return date('Y-m-01', strtotime('-1 month'));
        case 'This Year':
            return date('Y-01-01', strtotime('-1 year'));
        default:
            return date('Y-m-01', strtotime('-1 month'));
    }
}

$dateFrom = getDateFilter($filter);
$prevDateFrom = getPreviousDateFilter($filter);

try {
    // Initialize response
    $response = array('success' => false);

    if ($action == 'all') {
        
        // ----- 1. DASHBOARD STATS -----
        
        // Current Period Revenue & Orders
        $sql = "SELECT 
                COALESCE(SUM(total_amount), 0) as revenue,
                COUNT(*) as orders
                FROM orders 
                WHERE created_at >= '$dateFrom'";
        
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            throw new Exception("Query failed (Current Revenue): " . mysqli_error($conn));
        }
        $current = mysqli_fetch_assoc($result);
        
        // Previous Period Revenue & Orders
        $sql = "SELECT 
                COALESCE(SUM(total_amount), 0) as revenue,
                COUNT(*) as orders
                FROM orders 
                WHERE created_at >= '$prevDateFrom' AND created_at < '$dateFrom'";
        
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            throw new Exception("Query failed (Previous Revenue): " . mysqli_error($conn));
        }
        $previous = mysqli_fetch_assoc($result);
        
        // Calculate Growth
        $revenueGrowth = ($previous['revenue'] > 0) 
            ? round((($current['revenue'] - $previous['revenue']) / $previous['revenue']) * 100) 
            : 100;
        
        $ordersGrowth = ($previous['orders'] > 0) 
            ? round((($current['orders'] - $previous['orders']) / $previous['orders']) * 100) 
            : 100;
        
        // Low Stock Count
        $sql = "SELECT COUNT(*) as count FROM products WHERE stock <= 10 AND stock > 0";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $lowStock = 0;
        } else {
            $lowStock = mysqli_fetch_assoc($result)['count'];
        }
        
        // Out of Stock
        $sql = "SELECT COUNT(*) as count FROM products WHERE stock = 0";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $outOfStock = 0;
        } else {
            $outOfStock = mysqli_fetch_assoc($result)['count'];
        }
        
        // New Customers
        $sql = "SELECT COUNT(*) as count FROM users WHERE created_at >= '$dateFrom'";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $newCustomers = 0;
        } else {
            $newCustomers = mysqli_fetch_assoc($result)['count'];
        }
        
        // Previous Customers
        $sql = "SELECT COUNT(*) as count FROM users WHERE created_at >= '$prevDateFrom' AND created_at < '$dateFrom'";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $prevCustomers = 0;
        } else {
            $prevCustomers = mysqli_fetch_assoc($result)['count'];
        }
        
        $customersGrowth = ($prevCustomers > 0) 
            ? round((($newCustomers - $prevCustomers) / $prevCustomers) * 100) 
            : 100;
        
        $stats = array(
            'total_revenue' => array(
                'value' => floatval($current['revenue']),
                'formatted' => '₹' . number_format($current['revenue'], 0, '.', ','),
                'growth' => ($revenueGrowth >= 0 ? '+' : '') . $revenueGrowth . '%',
                'is_up' => $revenueGrowth >= 0
            ),
            'total_orders' => array(
                'value' => intval($current['orders']),
                'formatted' => number_format($current['orders']),
                'growth' => ($ordersGrowth >= 0 ? '+' : '') . $ordersGrowth . '%',
                'is_up' => $ordersGrowth >= 0
            ),
            'low_stock' => array(
                'value' => intval($lowStock),
                'formatted' => strval($lowStock),
                'growth' => $outOfStock > 0 ? "-$outOfStock" : '0',
                'is_up' => false
            ),
            'new_customers' => array(
                'value' => intval($newCustomers),
                'formatted' => number_format($newCustomers),
                'growth' => ($customersGrowth >= 0 ? '+' : '') . $customersGrowth . '%',
                'is_up' => $customersGrowth >= 0
            )
        );
        
        // ----- 2. SALES CHART DATA -----
        $sql = "SELECT 
                DATE(created_at) as sale_date,
                DAYNAME(created_at) as day_name,
                SUM(total_amount) as sales,
                COUNT(*) as orders
                FROM orders 
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at)
                ORDER BY sale_date ASC";
        
        $result = mysqli_query($conn, $sql);
        
        $salesChart = array(
            'labels' => array(),
            'sales' => array(),
            'orders' => array()
        );
        
        // Initialize all 7 days
        $salesData = array();
        for ($i = 6; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            $dayName = date('D', strtotime("-$i days"));
            $salesChart['labels'][] = $dayName;
            $salesData[$date] = array('sales' => 0, 'orders' => 0);
        }
        
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                if (isset($salesData[$row['sale_date']])) {
                    $salesData[$row['sale_date']]['sales'] = floatval($row['sales']);
                    $salesData[$row['sale_date']]['orders'] = intval($row['orders']);
                }
            }
        }
        
        foreach ($salesData as $data) {
            $salesChart['sales'][] = $data['sales'];
            $salesChart['orders'][] = $data['orders'];
        }
        
        // ----- 3. TOP PRODUCTS -----
        $sql = "SELECT 
                p.id,
                p.name,
                p.category,
                p.price,
                COALESCE(SUM(oi.quantity), 0) as total_sold,
                COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
                FROM products p
                LEFT JOIN order_items oi ON p.id = oi.product_id
                GROUP BY p.id
                ORDER BY total_sold DESC
                LIMIT 5";
        
        $result = mysqli_query($conn, $sql);
        $topProducts = array();
        
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $topProducts[] = array(
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'category' => $row['category'] ? $row['category'] : 'General',
                    'price' => floatval($row['price']),
                    'total_sold' => intval($row['total_sold']),
                    'revenue' => floatval($row['revenue']),
                    'revenue_formatted' => '₹' . number_format($row['revenue'] / 1000, 1) . 'k'
                );
            }
        }
        
        // ----- 4. INVENTORY HEALTH -----
        $sql = "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN stock > 10 THEN 1 ELSE 0 END) as in_stock,
                SUM(CASE WHEN stock > 0 AND stock <= 10 THEN 1 ELSE 0 END) as low_stock,
                SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock
                FROM products";
        
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $inv = array('total' => 0, 'in_stock' => 0, 'low_stock' => 0, 'out_of_stock' => 0);
        } else {
            $inv = mysqli_fetch_assoc($result);
        }
        
        $total = max($inv['total'], 1);
        
        $inventory = array(
            'in_stock' => array(
                'count' => intval($inv['in_stock']),
                'percentage' => round(($inv['in_stock'] / $total) * 100)
            ),
            'low_stock' => array(
                'count' => intval($inv['low_stock']),
                'percentage' => round(($inv['low_stock'] / $total) * 100)
            ),
            'out_of_stock' => array(
                'count' => intval($inv['out_of_stock']),
                'percentage' => round(($inv['out_of_stock'] / $total) * 100)
            ),
            'total_products' => intval($inv['total'])
        );
        
        // ----- 5. CUSTOMER INSIGHTS -----
        // Total customers
        $sql = "SELECT COUNT(*) as total FROM users";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $totalCustomers = 0;
        } else {
            $totalCustomers = mysqli_fetch_assoc($result)['total'];
        }
        
        // **FIX: Returning customers - CORRECT QUERY**
        // Method 1: Using subquery (सही तरीका)
        $sql = "SELECT COUNT(*) as returning_count 
                FROM (
                    SELECT user_id, COUNT(*) as order_count 
                    FROM orders 
                    WHERE user_id IS NOT NULL
                    GROUP BY user_id 
                    HAVING order_count > 1
                ) as returning_users";
        
        $result = mysqli_query($conn, $sql);
        
        if (!$result) {
            // Query fail hone pe error handle karo
            $returningCustomers = 0;
            // Optional: Log error for debugging
            error_log("Returning customers query failed: " . mysqli_error($conn));
        } else {
            $row = mysqli_fetch_assoc($result);
            $returningCustomers = intval($row['returning_count']);
        }
        
        // New signups
        $sql = "SELECT COUNT(*) as count FROM users WHERE created_at >= '$dateFrom'";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $newSignups = 0;
        } else {
            $newSignups = mysqli_fetch_assoc($result)['count'];
        }
        
        // Best category
        $sql = "SELECT p.category, SUM(oi.quantity) as sold 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                WHERE p.category IS NOT NULL
                GROUP BY p.category 
                ORDER BY sold DESC 
                LIMIT 1";
        
        $result = mysqli_query($conn, $sql);
        $bestCategory = 'General';
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $bestCategory = $row['category'];
        }
        
        $customers = array(
            'total' => intval($totalCustomers),
            'returning' => intval($returningCustomers),
            'returning_percentage' => $totalCustomers > 0 ? round(($returningCustomers / $totalCustomers) * 100) : 0,
            'new_signups' => intval($newSignups),
            'new_percentage' => $totalCustomers > 0 ? round(($newSignups / $totalCustomers) * 100) : 0,
            'best_category' => $bestCategory
        );
        
        // ----- 6. RECENT ORDERS -----
        $sql = "SELECT o.*, u.name as customer_name, u.email as customer_email
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
                LIMIT 5";
        
        $result = mysqli_query($conn, $sql);
        $recentOrders = array();
        
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $recentOrders[] = array(
                    'id' => $row['id'],
                    'order_number' => 'ORD-' . str_pad($row['id'], 5, '0', STR_PAD_LEFT),
                    'customer_name' => $row['customer_name'] ? $row['customer_name'] : 'Guest',
                    'customer_email' => $row['customer_email'] ? $row['customer_email'] : '',
                    'total_amount' => floatval($row['total_amount']),
                    'total_formatted' => '₹' . number_format($row['total_amount'], 0),
                    'status' => $row['status'] ? $row['status'] : 'pending',
                    'created_at' => $row['created_at'],
                    'date_formatted' => date('d M Y', strtotime($row['created_at']))
                );
            }
        }
        
        // Final Response
        $response = array(
            'success' => true,
            'data' => array(
                'stats' => $stats,
                'sales_chart' => $salesChart,
                'top_products' => $topProducts,
                'inventory' => $inventory,
                'customers' => $customers,
                'recent_orders' => $recentOrders
            ),
            'filter' => $filter,
            'generated_at' => date('Y-m-d H:i:s')
        );
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    echo json_encode(array(
        'success' => false,
        'message' => $e->getMessage()
    ));
}

mysqli_close($conn);
?>