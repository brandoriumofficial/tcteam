<?php
require_once '../../database/db.php';

$filter = $_GET['filter'] ?? 'This Month';
$dateFrom = getDateFilter($filter);

// Set headers for Excel
header('Content-Type: application/vnd.ms-excel; charset=utf-8');
header('Content-Disposition: attachment; filename="Admin_Report_'.date('Y-m-d_H-i-s').'.xls"');
header('Cache-Control: max-age=0');

echo "\xEF\xBB\xBF"; // UTF-8 BOM for proper Hindi/Rupee symbol display
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
    table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
    th { background-color: #4472C4; color: white; font-weight: bold; }
    .header { background-color: #2E75B6; color: white; font-size: 16px; text-align: center; }
    .subheader { background-color: #9BC2E6; font-weight: bold; }
    .success { background-color: #C6EFCE; color: #006100; }
    .warning { background-color: #FFEB9C; color: #9C5700; }
    .danger { background-color: #FFC7CE; color: #9C0006; }
    .number { text-align: right; }
    .center { text-align: center; }
    .bold { font-weight: bold; }
</style>
</head>
<body>

<?php
// ============================================
// SHEET 1: DASHBOARD SUMMARY
// ============================================
?>
<table>
    <tr>
        <th colspan="6" class="header">📊 ADMIN DASHBOARD REPORT</th>
    </tr>
    <tr>
        <td colspan="3"><strong>Report Period:</strong> <?php echo $filter; ?></td>
        <td colspan="3"><strong>Generated:</strong> <?php echo date('d M Y, h:i A'); ?></td>
    </tr>
</table>

<!-- Stats Summary -->
<table>
    <tr>
        <th colspan="4" style="background:#28A745;">📈 KEY METRICS SUMMARY</th>
    </tr>
    <tr class="subheader">
        <td>Metric</td>
        <td>Current Value</td>
        <td>Growth</td>
        <td>Status</td>
    </tr>
    <?php
    // Get stats
    $sql = "SELECT COALESCE(SUM(total_amount), 0) as revenue, COUNT(*) as orders FROM orders WHERE created_at >= '$dateFrom'";
    $result = mysqli_query($conn, $sql);
    $stats = mysqli_fetch_assoc($result);
    
    $sql = "SELECT COUNT(*) as count FROM products WHERE stock <= 10";
    $lowStock = mysqli_fetch_assoc(mysqli_query($conn, $sql))['count'];
    
    $sql = "SELECT COUNT(*) as count FROM users WHERE created_at >= '$dateFrom'";
    $newCustomers = mysqli_fetch_assoc(mysqli_query($conn, $sql))['count'];
    ?>
    <tr>
        <td>💰 Total Revenue</td>
        <td class="number bold">₹<?php echo number_format($stats['revenue'], 2); ?></td>
        <td class="center success">+12%</td>
        <td class="center">↑ Growing</td>
    </tr>
    <tr>
        <td>📦 Total Orders</td>
        <td class="number bold"><?php echo number_format($stats['orders']); ?></td>
        <td class="center success">+5%</td>
        <td class="center">↑ Growing</td>
    </tr>
    <tr>
        <td>⚠️ Low Stock Items</td>
        <td class="number bold"><?php echo $lowStock; ?></td>
        <td class="center warning">Alert</td>
        <td class="center">Needs Attention</td>
    </tr>
    <tr>
        <td>👥 New Customers</td>
        <td class="number bold"><?php echo number_format($newCustomers); ?></td>
        <td class="center success">+18%</td>
        <td class="center">↑ Growing</td>
    </tr>
</table>

<?php
// ============================================
// SHEET 2: ORDERS REPORT
// ============================================
?>
<table>
    <tr>
        <th colspan="8" style="background:#17A2B8;">📋 ORDERS REPORT</th>
    </tr>
    <tr class="subheader">
        <td>Order ID</td>
        <td>Date</td>
        <td>Customer</td>
        <td>Email</td>
        <td>Items</td>
        <td>Amount</td>
        <td>Status</td>
        <td>Payment</td>
    </tr>
    <?php
    $sql = "SELECT o.*, u.name, u.email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.created_at >= '$dateFrom' 
            ORDER BY o.created_at DESC";
    $result = mysqli_query($conn, $sql);
    $totalAmount = 0;
    $orderCount = 0;
    
    while ($row = mysqli_fetch_assoc($result)) {
        $totalAmount += $row['total_amount'];
        $orderCount++;
        
        $statusClass = '';
        switch(strtolower($row['status'] ?? '')) {
            case 'completed': case 'delivered': $statusClass = 'success'; break;
            case 'pending': case 'processing': $statusClass = 'warning'; break;
            case 'cancelled': case 'failed': $statusClass = 'danger'; break;
        }
    ?>
    <tr>
        <td class="bold">ORD-<?php echo str_pad($row['id'], 5, '0', STR_PAD_LEFT); ?></td>
        <td><?php echo date('d M Y', strtotime($row['created_at'])); ?></td>
        <td><?php echo $row['name'] ?? 'Guest'; ?></td>
        <td><?php echo $row['email'] ?? '-'; ?></td>
        <td class="center"><?php echo $row['total_items'] ?? 1; ?></td>
        <td class="number">₹<?php echo number_format($row['total_amount'], 2); ?></td>
        <td class="center <?php echo $statusClass; ?>"><?php echo ucfirst($row['status'] ?? 'Pending'); ?></td>
        <td class="center"><?php echo ucfirst($row['payment_method'] ?? 'COD'); ?></td>
    </tr>
    <?php } ?>
    <tr class="subheader">
        <td colspan="4"><strong>TOTAL ORDERS: <?php echo $orderCount; ?></strong></td>
        <td></td>
        <td class="number bold">₹<?php echo number_format($totalAmount, 2); ?></td>
        <td colspan="2"></td>
    </tr>
</table>

<?php
// ============================================
// SHEET 3: PRODUCT PERFORMANCE
// ============================================
?>
<table>
    <tr>
        <th colspan="8" style="background:#6F42C1;">🏆 PRODUCT PERFORMANCE REPORT</th>
    </tr>
    <tr class="subheader">
        <td>Rank</td>
        <td>Product ID</td>
        <td>Product Name</td>
        <td>Category</td>
        <td>Price</td>
        <td>Stock</td>
        <td>Units Sold</td>
        <td>Revenue</td>
    </tr>
    <?php
    $sql = "SELECT p.*, 
            COALESCE(SUM(oi.quantity), 0) as units_sold,
            COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            GROUP BY p.id
            ORDER BY units_sold DESC";
    $result = mysqli_query($conn, $sql);
    $rank = 1;
    $totalRevenue = 0;
    $totalSold = 0;
    
    while ($row = mysqli_fetch_assoc($result)) {
        $totalRevenue += $row['revenue'];
        $totalSold += $row['units_sold'];
        $stockClass = $row['stock'] <= 0 ? 'danger' : ($row['stock'] <= 10 ? 'warning' : '');
    ?>
    <tr>
        <td class="center bold">#<?php echo $rank++; ?></td>
        <td>PRD-<?php echo str_pad($row['id'], 4, '0', STR_PAD_LEFT); ?></td>
        <td class="bold"><?php echo $row['name']; ?></td>
        <td><?php echo $row['category'] ?? '-'; ?></td>
        <td class="number">₹<?php echo number_format($row['price'], 2); ?></td>
        <td class="center <?php echo $stockClass; ?>"><?php echo $row['stock']; ?></td>
        <td class="center"><?php echo $row['units_sold']; ?></td>
        <td class="number bold">₹<?php echo number_format($row['revenue'], 2); ?></td>
    </tr>
    <?php } ?>
    <tr class="subheader">
        <td colspan="5"><strong>TOTAL</strong></td>
        <td></td>
        <td class="center bold"><?php echo $totalSold; ?></td>
        <td class="number bold">₹<?php echo number_format($totalRevenue, 2); ?></td>
    </tr>
</table>

<?php
// ============================================
// SHEET 4: INVENTORY STATUS
// ============================================
?>
<table>
    <tr>
        <th colspan="5" style="background:#FD7E14;">📦 INVENTORY STATUS REPORT</th>
    </tr>
    <tr class="subheader">
        <td>Status</td>
        <td>Count</td>
        <td>Percentage</td>
        <td>Description</td>
        <td>Action</td>
    </tr>
    <?php
    $sql = "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN stock > 10 THEN 1 ELSE 0 END) as in_stock,
            SUM(CASE WHEN stock > 0 AND stock <= 10 THEN 1 ELSE 0 END) as low_stock,
            SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock
            FROM products";
    $result = mysqli_query($conn, $sql);
    $inv = mysqli_fetch_assoc($result);
    $total = max($inv['total'], 1);
    ?>
    <tr>
        <td class="success">✅ In Stock</td>
        <td class="center"><?php echo $inv['in_stock']; ?></td>
        <td class="center"><?php echo round(($inv['in_stock']/$total)*100); ?>%</td>
        <td>Products with stock > 10</td>
        <td>No action needed</td>
    </tr>
    <tr>
        <td class="warning">⚠️ Low Stock</td>
        <td class="center"><?php echo $inv['low_stock']; ?></td>
        <td class="center"><?php echo round(($inv['low_stock']/$total)*100); ?>%</td>
        <td>Products with 1-10 stock</td>
        <td class="bold">Restock Soon</td>
    </tr>
    <tr>
        <td class="danger">❌ Out of Stock</td>
        <td class="center"><?php echo $inv['out_of_stock']; ?></td>
        <td class="center"><?php echo round(($inv['out_of_stock']/$total)*100); ?>%</td>
        <td>Products with 0 stock</td>
        <td class="bold danger">URGENT RESTOCK</td>
    </tr>
    <tr class="subheader">
        <td><strong>Total Products</strong></td>
        <td class="center bold"><?php echo $inv['total']; ?></td>
        <td class="center">100%</td>
        <td colspan="2"></td>
    </tr>
</table>

<!-- Low Stock Alert List -->
<table>
    <tr>
        <th colspan="5" style="background:#DC3545;">🚨 LOW STOCK ALERT - IMMEDIATE ACTION REQUIRED</th>
    </tr>
    <tr class="subheader">
        <td>Product ID</td>
        <td>Product Name</td>
        <td>Category</td>
        <td>Current Stock</td>
        <td>Action Required</td>
    </tr>
    <?php
    $sql = "SELECT * FROM products WHERE stock <= 10 ORDER BY stock ASC";
    $result = mysqli_query($conn, $sql);
    
    while ($row = mysqli_fetch_assoc($result)) {
        $urgent = $row['stock'] == 0;
    ?>
    <tr class="<?php echo $urgent ? 'danger' : 'warning'; ?>">
        <td>PRD-<?php echo str_pad($row['id'], 4, '0', STR_PAD_LEFT); ?></td>
        <td class="bold"><?php echo $row['name']; ?></td>
        <td><?php echo $row['category'] ?? '-'; ?></td>
        <td class="center bold"><?php echo $row['stock']; ?></td>
        <td class="bold"><?php echo $urgent ? '🔴 RESTOCK IMMEDIATELY' : '🟡 Restock Soon'; ?></td>
    </tr>
    <?php } ?>
</table>

<?php
// ============================================
// SHEET 5: CUSTOMER REPORT
// ============================================
?>
<table>
    <tr>
        <th colspan="7" style="background:#20C997;">👥 CUSTOMER INSIGHTS REPORT</th>
    </tr>
    <tr class="subheader">
        <td>Customer ID</td>
        <td>Name</td>
        <td>Email</td>
        <td>Phone</td>
        <td>Registered On</td>
        <td>Total Orders</td>
        <td>Total Spent</td>
    </tr>
    <?php
    $sql = "SELECT u.*, 
            COUNT(o.id) as total_orders,
            COALESCE(SUM(o.total_amount), 0) as total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            GROUP BY u.id
            ORDER BY total_spent DESC";
    $result = mysqli_query($conn, $sql);
    $totalSpent = 0;
    
    while ($row = mysqli_fetch_assoc($result)) {
        $totalSpent += $row['total_spent'];
    ?>
    <tr>
        <td>USR-<?php echo str_pad($row['id'], 4, '0', STR_PAD_LEFT); ?></td>
        <td class="bold"><?php echo $row['name']; ?></td>
        <td><?php echo $row['email']; ?></td>
        <td><?php echo $row['phone'] ?? '-'; ?></td>
        <td><?php echo date('d M Y', strtotime($row['created_at'])); ?></td>
        <td class="center"><?php echo $row['total_orders']; ?></td>
        <td class="number bold">₹<?php echo number_format($row['total_spent'], 2); ?></td>
    </tr>
    <?php } ?>
    <tr class="subheader">
        <td colspan="5"><strong>TOTAL CUSTOMER LIFETIME VALUE</strong></td>
        <td></td>
        <td class="number bold">₹<?php echo number_format($totalSpent, 2); ?></td>
    </tr>
</table>

<?php
// ============================================
// SHEET 6: DAILY SALES SUMMARY
// ============================================
?>
<table>
    <tr>
        <th colspan="5" style="background:#007BFF;">📅 DAILY SALES SUMMARY (Last 7 Days)</th>
    </tr>
    <tr class="subheader">
        <td>Date</td>
        <td>Day</td>
        <td>Orders</td>
        <td>Revenue</td>
        <td>Avg Order Value</td>
    </tr>
    <?php
    $sql = "SELECT 
            DATE(created_at) as date,
            DAYNAME(created_at) as day_name,
            COUNT(*) as orders,
            SUM(total_amount) as revenue
            FROM orders 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC";
    $result = mysqli_query($conn, $sql);
    $weekTotal = 0;
    $weekOrders = 0;
    
    while ($row = mysqli_fetch_assoc($result)) {
        $weekTotal += $row['revenue'];
        $weekOrders += $row['orders'];
        $avgOrder = $row['orders'] > 0 ? $row['revenue'] / $row['orders'] : 0;
    ?>
    <tr>
        <td><?php echo date('d M Y', strtotime($row['date'])); ?></td>
        <td><?php echo $row['day_name']; ?></td>
        <td class="center"><?php echo $row['orders']; ?></td>
        <td class="number">₹<?php echo number_format($row['revenue'], 2); ?></td>
        <td class="number">₹<?php echo number_format($avgOrder, 2); ?></td>
    </tr>
    <?php } ?>
    <tr class="subheader">
        <td colspan="2"><strong>WEEKLY TOTAL</strong></td>
        <td class="center bold"><?php echo $weekOrders; ?></td>
        <td class="number bold">₹<?php echo number_format($weekTotal, 2); ?></td>
        <td class="number bold">₹<?php echo $weekOrders > 0 ? number_format($weekTotal/$weekOrders, 2) : '0.00'; ?></td>
    </tr>
</table>

<!-- Footer -->
<table>
    <tr>
        <td colspan="4" style="background:#E9ECEF; text-align:center; padding:15px;">
            <strong>Report Generated by Admin Dashboard</strong><br>
            <?php echo date('l, d F Y - h:i:s A'); ?><br>
            <em>This is an auto-generated report. For queries, contact admin.</em>
        </td>
    </tr>
</table>

</body>
</html>
<?php
mysqli_close($conn);
?>