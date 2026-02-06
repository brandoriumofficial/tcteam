import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEdit, FaTrash, FaPlus, FaSearch, FaFilter,
  FaAngleLeft, FaAngleRight, FaBoxOpen, FaEye,
  FaCheck, FaTimes, FaSync, FaImage, FaStar,
  FaTag, FaCalendarAlt, FaShippingFast
} from "react-icons/fa";
import { debounce } from 'lodash';
import apiService from '../../api/produet/ApiService';
import { API_URL } from '../../api/API_URL';
export default function AllProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getProducts(
        currentPage,
        itemsPerPage,
        statusFilter === "all" ? "" : statusFilter,
        search
      );

      if (response.success) {
        console.log('Fetched products:', response.data.products);
        const productsWithData = response.data.products.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug || '',
          category: product.category || 'Uncategorized',
          sku: product.sku || 'N/A',
          image: product.feature_image || 'https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg?semt=ais_hybrid&w=740&q=80',
          oldPrice: product.base_price || 0,
          newPrice: product.sale_price || product.base_price || 0,
          discount: product.discount_percentage || '0%',
          inventory: product.stock_qty || 0,
          reviews: product.rating || 0,
          status: product.status || 'draft',
          stockStatus: product.stock_status || 'In Stock',
          created_at: product.created_at || '',
          created_date: product.created_date || '',
          brand: product.brand || '',
          ribbon: product.ribbon || '',
          seo_score: product.seo_score || 0,
          tags: product.tags || '',
          variant_count: product.variant_count || 0,
          gallery_count: product.gallery_count || 0,
          // For timer (demo purposes)
          timer: Math.floor(Math.random() * 10000),
          coupon: product.coupon_code || '-',
          offer: product.offer_type || '-'
        }));

        setProducts(productsWithData);
        setTotalProducts(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 1);
      } else {
        setError(response.message || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Error connecting to server');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, statusFilter, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  // Timer logic for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prev =>
        prev.map(p => ({
          ...p,
          timer: p.timer > 0 ? p.timer - 1 : 0
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [products]);

  const formatTime = (sec) => {
    if (sec <= 0) return <span className="text-gray-400 text-[10px]">-</span>;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return <span className="text-red-600 font-mono font-bold text-xs">{h}h {m}m {s}s</span>;
  };

  // Handle product deletion
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await apiService.deleteProduct(id);
        if (response.success) {
          alert('Product deleted successfully');
          fetchProducts();
          setSelected(prev => prev.filter(item => item !== id));
        } else {
          alert(response.message || 'Failed to delete product');
        }
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }
  };

  // Handle bulk deletion
  const deleteSelected = async () => {
    if (selected.length === 0) {
      alert('No products selected');
      return;
    }

    if (window.confirm(`Delete ${selected.length} selected product(s)?`)) {
      try {
        // This would need a bulk delete endpoint
        const deletePromises = selected.map(id => apiService.deleteProduct(id));
        await Promise.all(deletePromises);

        alert(`${selected.length} products deleted successfully`);
        fetchProducts();
        setSelected([]);
      } catch (err) {
        alert('Error deleting products: ' + err.message);
      }
    }
  };

  // Handle status update
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await apiService.updateStatus(id, newStatus);
      if (response.success) {
        setProducts(prev =>
          prev.map(p =>
            p.id === id ? { ...p, status: newStatus } : p
          )
        );
      } else {
        alert(response.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = products.map(p => p.id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold">Active</span>;
      case 'draft':
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-bold">Draft</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded text-[10px] font-bold">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-bold">{status}</span>;
    }
  };

  // Get stock status badge
  const getStockBadge = (status, quantity) => {
    if (status === 'Out of Stock' || quantity <= 0) {
      return <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">Out of Stock</span>;
    } else if (status === 'Low Stock' || quantity < 10) {
      return <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded text-[10px] font-bold">Low Stock</span>;
    } else {
      return <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold">In Stock</span>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Refresh products
  const handleRefresh = () => {
    fetchProducts();
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-xs text-gray-500">
            {loading ? 'Loading...' : `${totalProducts} products found`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
            </select>

            <button
              onClick={handleRefresh}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 transition flex items-center gap-2"
              title="Refresh"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {selected.length > 0 && (
            <button
              onClick={deleteSelected}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition flex items-center gap-2"
            >
              <FaTrash /> Delete ({selected.length})
            </button>
          )}

          <Link
            to="/admin/addproduct"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Product
          </Link>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search by Name, SKU, Category, Tags..."
            defaultValue={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaFilter />
            <span>{loading ? '...' : totalProducts} Items</span>
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* --- LOADING STATE --- */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading products...</p>
        </div>
      )}

      {/* --- ERROR STATE --- */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-bold">Error Loading Products</p>
          <p>{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* --- TABLE --- */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-[11px] uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3 w-8 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={products.length > 0 && products.every(p => selected.includes(p.id))}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-3">Sr No.</th>
                  <th className="p-3">Image</th>
                  <th className="p-3 min-w-[180px]">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Inventory</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {products.length > 0 ? (
                  products.map((p, index) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-blue-50 transition ${selected.includes(p.id) ? "bg-blue-50" : ""}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(p.id)}
                          onChange={() => handleSelectOne(p.id)}
                          className="rounded border-gray-300"
                        />
                      </td>

                      <td className="p-3 text-gray-500 font-mono">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      <td className="p-3">
                        <div className="relative">
                          <img
                            src={p.image ? `${API_URL}/${p.image}` : ''}
                            alt={p.name}
                            className="w-10 h-10 rounded border border-gray-200 object-cover bg-gray-100"
                            
                          />
                          {p.gallery_count > 0 && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                              +{p.gallery_count}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 truncate max-w-[180px]" title={p.name}>
                            {p.name}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.brand && (
                              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {p.brand}
                              </span>
                            )}
                            {p.ribbon && (
                              <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                                {p.ribbon}
                              </span>
                            )}
                            {p.variant_count > 0 && (
                              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                {p.variant_count} variants
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-gray-600 max-w-[120px] truncate" title={p.category}>
                        {p.category}
                      </td>

                      <td className="p-3 font-mono text-gray-500 text-[10px]">{p.sku}</td>

                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">₹{p.newPrice}</span>
                          {p.oldPrice > p.newPrice && (
                            <span className="text-[10px] text-gray-400 line-through">₹{p.oldPrice}</span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        {p.discount !== '0%' ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            {p.discount} OFF
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[10px]">-</span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-700">{p.inventory} pcs</span>
                          {getStockBadge(p.stockStatus, p.inventory)}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span className="text-orange-500 font-bold flex items-center gap-0.5">
                            <FaStar size={10} /> {p.reviews}
                          </span>
                          {p.seo_score > 0 && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
                              SEO: {p.seo_score}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(p.status)}
                          <select
                            value={p.status}
                            onChange={(e) => updateStatus(p.id, e.target.value)}
                            className="text-[9px] border border-gray-300 rounded px-1 py-0.5 outline-none focus:border-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                          </select>
                        </div>
                      </td>

                      <td className="p-3 text-gray-500 text-[10px]">
                        {formatDate(p.created_at)}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/product/${p.slug}`}
                            target="_blank"
                            className="text-gray-600 hover:bg-gray-100 p-1.5 rounded transition"
                            title="View"
                          >
                            <FaEye size={12} />
                          </Link>
                          <Link
                            to={`/admin/editproduct/${p.id}`}
                            className="text-green-600 hover:bg-green-100 p-1.5 rounded transition"
                            title="Edit"
                          >
                            <FaEdit size={12} />
                          </Link>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-red-600 hover:bg-red-100 p-1.5 rounded transition"
                            title="Delete"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="p-10 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <FaBoxOpen className="text-3xl mb-2 opacity-50" />
                        No products found
                        {search && (
                          <p className="text-xs mt-1">Try a different search term</p>
                        )}
                        <Link
                          to="/admin/addproduct"
                          className="mt-4 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Add Your First Product
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION --- */}
          {totalProducts > 0 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-gray-500">
                Showing <span className="font-bold">
                  {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, totalProducts)}
                </span> of <span className="font-bold">{totalProducts}</span> products
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => c - 1)}
                    className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Previous"
                  >
                    <FaAngleLeft size={14} />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      page = currentPage - 2 + i;
                    }
                    if (page > totalPages) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 text-xs font-bold rounded border ${currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          } transition`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 1 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-7 h-7 text-xs font-bold rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 transition`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => c + 1)}
                    className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Next"
                  >
                    <FaAngleRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}