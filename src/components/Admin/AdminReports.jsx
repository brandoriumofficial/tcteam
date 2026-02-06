import React, { useState, useEffect } from "react";
import { 
  FaChartLine, FaBoxOpen, FaUsers, FaDownload, FaArrowUp, FaArrowDown, 
  FaCalendarAlt, FaMoneyBillWave, FaSpinner, FaSync, FaShoppingCart,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import { API_URL } from "../../api/API_URL";
// const API_URL = "http://localhost/your-project/api";

export default function AdminReports() {
  const [filter, setFilter] = useState("This Month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Fetch all dashboard data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/admin/reports/reports.php?action=all&filter=${encodeURIComponent(filter)}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // Export to Excel
  const handleExport = () => {
    window.open(`${API_URL}/admin/reports/export.php?filter=${encodeURIComponent(filter)}`, '_blank');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Reports...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <FaSync /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Stats cards configuration
  const statsCards = [
    { 
      title: "Total Revenue", 
      value: data?.stats?.total_revenue?.formatted || "₹0", 
      grow: data?.stats?.total_revenue?.growth || "0%", 
      isUp: data?.stats?.total_revenue?.is_up ?? true, 
      icon: <FaMoneyBillWave/>, 
      color: "text-green-600", 
      bg: "bg-green-100" 
    },
    { 
      title: "Total Orders", 
      value: data?.stats?.total_orders?.formatted || "0", 
      grow: data?.stats?.total_orders?.growth || "0%", 
      isUp: data?.stats?.total_orders?.is_up ?? true, 
      icon: <FaShoppingCart/>, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      title: "Low Stock Items", 
      value: data?.stats?.low_stock?.formatted || "0", 
      grow: data?.stats?.low_stock?.growth || "0", 
      isUp: false, 
      icon: <FaExclamationTriangle/>, 
      color: "text-orange-600", 
      bg: "bg-orange-100" 
    },
    { 
      title: "New Customers", 
      value: data?.stats?.new_customers?.formatted || "0", 
      grow: data?.stats?.new_customers?.growth || "0%", 
      isUp: data?.stats?.new_customers?.is_up ?? true, 
      icon: <FaUsers/>, 
      color: "text-purple-600", 
      bg: "bg-purple-100" 
    },
  ];

  // Get max value for chart scaling
  const salesValues = data?.sales_chart?.sales || [0];
  const maxSales = Math.max(...salesValues, 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* ========== HEADER ========== */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaChartLine className="text-blue-600"/> Analytics & Reports
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track business growth, inventory health, and customer insights.
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          {/* Filter Dropdown */}
          <select 
            className="border rounded-lg px-4 py-2 text-sm bg-white outline-none font-bold text-gray-600 shadow-sm hover:border-blue-400 transition cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>

          {/* Refresh Button */}
          <button 
            onClick={fetchData}
            className="bg-white border text-gray-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition shadow-sm"
          >
            <FaSync className={loading ? "animate-spin" : ""}/> Refresh
          </button>
          
          {/* Export Button */}
          <button 
            onClick={handleExport}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:from-green-700 hover:to-green-800 transition shadow-lg"
          >
            <FaDownload/> Export Excel
          </button>
        </div>
      </div>

      {/* ========== STATS CARDS ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((s, i) => (
          <div 
            key={i} 
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-3 rounded-xl ${s.bg} ${s.color} text-xl group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1
                ${s.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
              >
                {s.isUp ? <FaArrowUp className="text-[10px]"/> : <FaArrowDown className="text-[10px]"/>}
                {s.grow}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{s.value}</h3>
            <p className="text-xs text-gray-500 uppercase font-bold mt-1 tracking-wide">{s.title}</p>
          </div>
        ))}
      </div>

      {/* ========== CHARTS ROW ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Sales Overview</h3>
              <p className="text-xs text-gray-400">Daily revenue for last 7 days</p>
            </div>
            <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
              <FaCalendarAlt/> {filter}
            </span>
          </div>
          
          {/* Bar Chart */}
          <div className="flex items-end justify-between h-64 gap-2 px-2">
            {(data?.sales_chart?.labels || []).map((label, i) => {
              const value = data?.sales_chart?.sales?.[i] || 0;
              const height = (value / maxSales) * 100;
              const orders = data?.sales_chart?.orders?.[i] || 0;
              
              return (
                <div key={i} className="w-full flex flex-col justify-end items-center gap-2 group">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-100 to-blue-50 rounded-t-lg transition-all duration-500 group-hover:from-blue-500 group-hover:to-blue-400 relative cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10 shadow-xl">
                      <div className="font-bold">₹{value.toLocaleString()}</div>
                      <div className="text-gray-300">{orders} orders</div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-bold">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Revenue</span>
            </div>
            <div className="text-xs text-gray-400">
              Total: ₹{(data?.sales_chart?.sales?.reduce((a,b) => a+b, 0) || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Top Selling Products</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-bold">
              Top 5
            </span>
          </div>
          
          <div className="space-y-3">
            {(data?.top_products || []).length > 0 ? (
              data.top_products.map((product, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm
                    ${i === 0 ? 'bg-yellow-100 text-yellow-600' : 
                      i === 1 ? 'bg-gray-100 text-gray-600' : 
                      i === 2 ? 'bg-orange-100 text-orange-600' : 
                      'bg-gray-50 text-gray-400'}`}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {product.category || 'General'} • {product.total_sold} Sold
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {product.revenue_formatted}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FaBoxOpen className="text-4xl mx-auto mb-2 opacity-50"/>
                <p className="text-sm">No products data</p>
              </div>
            )}
          </div>
          
          <button className="w-full mt-4 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            View All Products →
          </button>
        </div>
      </div>

      {/* ========== INVENTORY & CUSTOMERS ROW ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Inventory Health */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
              <FaBoxOpen className="text-orange-500"/> Inventory Health
            </h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {data?.inventory?.total_products || 0} Products
            </span>
          </div>
          
          <div className="space-y-5">
            {/* In Stock */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-600 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500"/> In Stock
                </span>
                <span className="font-bold text-gray-800">
                  {data?.inventory?.in_stock?.count || 0} ({data?.inventory?.in_stock?.percentage || 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.inventory?.in_stock?.percentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Low Stock */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-600 flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-500"/> Low Stock
                </span>
                <span className="font-bold text-orange-600">
                  {data?.inventory?.low_stock?.count || 0} ({data?.inventory?.low_stock?.percentage || 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.inventory?.low_stock?.percentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Out of Stock */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-600 flex items-center gap-2">
                  <FaTimesCircle className="text-red-500"/> Out of Stock
                </span>
                <span className="font-bold text-red-600">
                  {data?.inventory?.out_of_stock?.count || 0} ({data?.inventory?.out_of_stock?.percentage || 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.inventory?.out_of_stock?.percentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {(data?.inventory?.low_stock?.count > 0 || data?.inventory?.out_of_stock?.count > 0) && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs text-orange-700 font-medium flex items-center gap-2">
                <FaExclamationTriangle/>
                {data?.inventory?.out_of_stock?.count > 0 
                  ? `${data.inventory.out_of_stock.count} products need immediate restocking!`
                  : `${data.inventory.low_stock.count} products running low on stock`
                }
              </p>
            </div>
          )}
        </div>

        {/* Customer Insights */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
              <FaUsers className="text-purple-500"/> Customer Insights
            </h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {data?.customers?.total || 0} Total
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center">
              <h4 className="text-3xl font-bold text-purple-600">
                {data?.customers?.returning_percentage || 0}%
              </h4>
              <p className="text-xs font-bold text-purple-500 uppercase mt-1">Returning</p>
              <p className="text-xs text-gray-500 mt-1">
                {data?.customers?.returning || 0} users
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center">
              <h4 className="text-3xl font-bold text-blue-600">
                {data?.customers?.new_percentage || 0}%
              </h4>
              <p className="text-xs font-bold text-blue-500 uppercase mt-1">New Signups</p>
              <p className="text-xs text-gray-500 mt-1">
                {data?.customers?.new_signups || 0} users
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-gray-800">💡 Insight:</strong> Your retention rate is 
              {data?.customers?.returning_percentage >= 50 ? ' excellent' : ' growing'}! 
              {data?.customers?.best_category && (
                <> Customers love your <em className="text-purple-600 font-medium">{data.customers.best_category}</em> products.</>
              )}
              {data?.customers?.returning_percentage < 50 && (
                <> Consider launching a loyalty program to boost retention.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ========== RECENT ORDERS ========== */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Recent Orders</h3>
          <button className="text-xs text-blue-600 font-bold hover:underline">View All →</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent_orders || []).length > 0 ? (
                data.recent_orders.map((order, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-600 text-sm">{order.order_number}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date_formatted}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-800">{order.total_formatted}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full
                        ${order.status === 'completed' || order.status === 'delivered' 
                          ? 'bg-green-100 text-green-600' 
                          : order.status === 'pending' || order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-600'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    <FaShoppingCart className="text-4xl mx-auto mb-2 opacity-50"/>
                    <p>No recent orders</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <div className="mt-8 text-center text-xs text-gray-400">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}