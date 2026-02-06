import React, { useState, useEffect, useCallback } from "react";
import { 
  FaBox, FaSearch, FaPlus, FaMinus, FaEdit, FaTrash, FaSave, FaTimes, 
  FaExclamationTriangle, FaCheckCircle, FaClipboardList, FaSync, FaChevronLeft, FaChevronRight, FaInfoCircle
} from "react-icons/fa";
import { API_URL } from "../../api/API_URL";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = API_URL + "/admin/inventory";

// --- TOAST COMPONENT (Internal) ---
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm animate-slideIn transition-all transform ${
            toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
          }`}
        >
          {toast.type === 'success' ? <FaCheckCircle/> : toast.type === 'error' ? <FaTimes/> : <FaInfoCircle/>}
          <span>{toast.msg}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-4 opacity-70 hover:opacity-100"><FaTimes/></button>
        </div>
      ))}
    </div>
  );
};

export default function AdminInventory() {
  const navigate = useNavigate();
  
  // --- STATES ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0, totalValue: 0 });
  
  // Toast State
  const [toasts, setToasts] = useState([]);

  // Edit States
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  // --- TOAST FUNCTION ---
  const showToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- API CALLS ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: 'list',
        page: currentPage,
        limit: rowsPerPage,
        category: filterCategory,
        status: filterStatus,
        ...(search && { search: search })
      });

      const response = await fetch(`${API_BASE_URL}/inventory_api.php?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setCategories(data.categories || ["All"]);
        setTotalPages(data.pagination.totalPages);
        setTotalRows(data.pagination.totalRows);
      } else {
        showToast("Failed to fetch data", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      // showToast("Network Error", "error"); // Optional: silent fail for refresh
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, filterCategory, filterStatus, search]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory_api.php?action=stats`);
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) { console.error(error); }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, [fetchProducts, fetchStats]);

  // --- HANDLERS ---

  const updateStock = async (productId, change) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory_api.php?action=update-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, quantity: change })
      });
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => prev.map(item => item.id === productId ? { ...item, stock_qty: data.newStock } : item));
        fetchStats();
        showToast("Stock updated", "success");
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Error updating stock", "error");
    }
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditData({ ...product });
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory_api.php?action=update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...editData })
      });
      const data = await response.json();
      
      if (data.success) {
        showToast("Product updated successfully", "success");
        setEditId(null);
        fetchProducts();
        fetchStats();
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Error saving product", "error");
    }
  };

  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Delete "${productName}"? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/inventory_api.php?action=delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId })
      });
      const data = await response.json();
      
      if (data.success) {
        showToast("Product deleted", "success");
        fetchProducts();
        fetchStats();
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Error deleting product", "error");
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => { setCurrentPage(1); fetchProducts(); }, 500);
    return () => clearTimeout(timer);
  }, [search, filterCategory, filterStatus]);

  // Helpers
  const getStatusClass = (product) => {
    if (product.stock_status === 'Out of Stock' || product.stock_qty === 0) return "bg-red-100 text-red-700 border-red-200";
    if (product.stock_status === 'Low Stock' || product.stock_qty < product.low_stock_threshold) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStatusText = (product) => {
    if (product.stock_status === 'Out of Stock' || product.stock_qty === 0) return "Out of Stock";
    if (product.stock_status === 'Low Stock' || product.stock_qty < product.low_stock_threshold) return "Low Stock";
    return "In Stock";
  };

  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans text-gray-800 pb-20">
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaClipboardList className="text-blue-600"/> Inventory
          </h1>
          <p className="text-xs md:text-sm text-gray-500">Manage stock, prices & availability.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={() => { fetchProducts(); fetchStats(); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
          >
            <FaSync className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => navigate("/admin/addproduct")}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-md transition"
          >
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* STATS CARDS (Grid: 2 on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
        {[
          { label: "Total", value: stats.total, color: "blue", icon: <FaBox/> },
          { label: "In Stock", value: stats.total - stats.lowStock - stats.outOfStock, color: "green", icon: <FaCheckCircle/> },
          { label: "Low Stock", value: stats.lowStock, color: "orange", icon: <FaExclamationTriangle/> },
          { label: "Empty", value: stats.outOfStock, color: "red", icon: <FaTimes/> }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-4 rounded-xl shadow-sm border border-l-4 border-${stat.color}-500 flex items-center justify-between`}>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">{stat.label}</p>
              <h3 className={`text-xl md:text-2xl font-bold text-${stat.color}-600`}>{stat.value}</h3>
            </div>
            <div className={`p-2 md:p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg text-lg`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="flex-1 md:flex-none border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== 'All').map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
          <select 
            className="flex-1 md:flex-none border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Empty</option>
          </select>
        </div>
      </div>

      {/* TABLE SECTION - Responsive Scroll */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading inventory...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] md:text-[11px] font-bold">
                  <tr>
                    <th className="p-3 md:p-4">Product</th>
                    <th className="p-3 md:p-4">SKU / Cat</th>
                    <th className="p-3 md:p-4">Price</th>
                    <th className="p-3 md:p-4 text-center">Stock</th>
                    <th className="p-3 md:p-4">Status</th>
                    <th className="p-3 md:p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                  {products.length > 0 ? products.map((product) => {
                    const isEditing = editId === product.id;
                    return (
                      <tr key={product.id} className={`hover:bg-blue-50/30 transition ${isEditing ? "bg-blue-50" : ""}`}>
                        
                        {/* Name */}
                        <td className="p-3 md:p-4">
                          {isEditing ? (
                            <input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="border rounded p-1 w-full" />
                          ) : (
                            <div>
                              <p className="font-bold text-gray-800 line-clamp-1">{product.name}</p>
                              <span className="text-[10px] text-gray-500 font-bold uppercase">{product.brand || 'No Brand'}</span>
                            </div>
                          )}
                        </td>

                        {/* SKU */}
                        <td className="p-3 md:p-4">
                          {isEditing ? (
                            <div className="space-y-1">
                              <input value={editData.sku} onChange={(e) => setEditData({...editData, sku: e.target.value})} className="border rounded p-1 w-full" placeholder="SKU" />
                              <input value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})} className="border rounded p-1 w-full" placeholder="Cat" />
                            </div>
                          ) : (
                            <div>
                              <span className="font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] border">{product.sku || 'N/A'}</span>
                              <p className="text-[10px] text-gray-500 mt-1">{product.category || 'Uncategorized'}</p>
                            </div>
                          )}
                        </td>

                        {/* Price */}
                        <td className="p-3 md:p-4 font-bold text-gray-700">
                          {isEditing ? (
                            <div className="flex gap-1">
                              <input type="number" value={editData.base_price} onChange={(e) => setEditData({...editData, base_price: e.target.value})} className="border rounded p-1 w-16" placeholder="Base" />
                              <input type="number" value={editData.sale_price} onChange={(e) => setEditData({...editData, sale_price: e.target.value})} className="border rounded p-1 w-16" placeholder="Sale" />
                            </div>
                          ) : (
                            <div>
                              <div>₹{product.base_price}</div>
                              {product.sale_price > 0 && product.sale_price !== product.base_price && <div className="text-[10px] text-green-600">Sale: ₹{product.sale_price}</div>}
                            </div>
                          )}
                        </td>

                        {/* Stock Control */}
                        <td className="p-3 md:p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => updateStock(product.id, -1)} className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-600 rounded-full transition disabled:opacity-50" disabled={product.stock_qty <= 0}>
                              <FaMinus className="text-[8px] md:text-[10px]"/>
                            </button>
                            {isEditing ? (
                              <input type="number" value={editData.stock_qty} onChange={(e) => setEditData({...editData, stock_qty: Number(e.target.value)})} className="w-12 text-center border rounded p-1 font-bold" />
                            ) : (
                              <span className={`font-bold w-6 text-center ${product.stock_qty < (product.low_stock_threshold || 10) ? "text-red-600" : "text-gray-800"}`}>
                                {product.stock_qty}
                              </span>
                            )}
                            <button onClick={() => updateStock(product.id, 1)} className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-gray-100 hover:bg-green-100 text-gray-600 rounded-full transition">
                              <FaPlus className="text-[8px] md:text-[10px]"/>
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3 md:p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1 w-fit whitespace-nowrap ${getStatusClass(product)}`}>
                            {getStatusText(product) === "Low Stock" && <FaExclamationTriangle/>}
                            {getStatusText(product)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3 md:p-4 text-right">
                          {isEditing ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={saveEdit} className="p-1.5 md:p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"><FaSave/></button>
                              <button onClick={() => setEditId(null)} className="p-1.5 md:p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"><FaTimes/></button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => startEdit(product)} className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><FaEdit/></button>
                              <button onClick={() => deleteProduct(product.id, product.name)} className="p-1.5 md:p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><FaTrash/></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-400">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-gray-500">
                <span className="font-bold">{startRow}-{endRow}</span> / <span className="font-bold">{totalRows}</span>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  className="border rounded px-1 py-1 text-xs outline-none bg-white"
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <div className="flex gap-1">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"><FaChevronLeft className="text-xs"/></button>
                  <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(c => c + 1)} className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"><FaChevronRight className="text-xs"/></button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}