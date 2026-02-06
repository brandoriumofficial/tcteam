import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  FaStar, FaSearch, FaTrash, FaEdit, FaCheck, FaTimes, 
  FaUserCircle, FaBoxOpen, FaSync, FaChartBar, FaTag 
} from "react-icons/fa";
import { API_URL } from "../../../api/API_URL";
const API_BASE_URL = API_URL + "/admin/reviews";

export default function AdminReview() {
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    recentReviews: 0
  });
  
  const [form, setForm] = useState({
    id: null,
    product: "",
    product_id: null,
    product_sku: "",
    customer: "",
    customer_email: "",
    title: "",
    review: "",
    rating: 0,
    status: "Approved"
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [search, setSearch] = useState("");
  const [filterStar, setFilterStar] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  
  const suggestionsRef = useRef(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: 'list',
        page: currentPage,
        limit: rowsPerPage,
        ...(filterStar !== 'All' && { rating: filterStar }),
        ...(filterStatus !== 'All' && { status: filterStatus.toLowerCase() }),
        ...(search && { search: search })
      });

      const response = await fetch(`${API_BASE_URL}/reviews_api.php?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalRows(data.pagination?.totalRows || 0);
      } else {
        console.error("Failed:", data.message);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, filterStar, filterStatus, search]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews_api.php?action=stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Stats error:", error);
    }
  }, []);

  const fetchProductSuggestions = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/reviews_api.php?action=product-suggestions&search=${searchTerm}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Suggestions error:", error);
      setSuggestions([]);
    }
  };

  const getProductIdByName = async (productName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews_api.php?action=get-product-id&name=${encodeURIComponent(productName)}`);
      const data = await response.json();
      
      if (data.success) {
        return {
          product_id: data.product_id,
          product_sku: data.product_sku
        };
      }
      return null;
    } catch (error) {
      console.error("Get product ID error:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [fetchReviews, fetchStats]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "product") {
      if (value.length > 1) {
        await fetchProductSuggestions(value);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      
      // Reset product_id when product name changes
      if (name === "product") {
        setForm(prev => ({ ...prev, product_id: null, product_sku: "" }));
      }
    }
  };

  const selectProduct = async (product) => {
    setForm({ 
      ...form, 
      product: product.name,
      product_id: product.id,
      product_sku: product.sku || ""
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRating = (rate) => {
    setForm({ ...form, rating: rate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product || !form.customer || !form.rating) {
      alert("Product, Customer, and Rating are required!");
      return;
    }

    try {
      // Get product ID if not already set
      let productId = form.product_id;
      if (!productId) {
        const productInfo = await getProductIdByName(form.product);
        if (productInfo) {
          productId = productInfo.product_id;
        }
      }

      const url = `${API_BASE_URL}/reviews_api.php?action=${isEditing ? 'update' : 'create'}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          status: form.status.toLowerCase()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(isEditing ? 'Review updated successfully!' : 'Review added successfully!');
        
        // Reset form
        setForm({
          id: null,
          product: "",
          product_id: null,
          product_sku: "",
          customer: "",
          customer_email: "",
          title: "",
          review: "",
          rating: 0,
          status: "Approved"
        });
        setIsEditing(false);
        setSuggestions([]);
        setShowSuggestions(false);
        
        // Refresh data
        fetchReviews();
        fetchStats();
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert('Error submitting review');
    }
  };

  const handleEdit = (review) => {
    setForm({
      id: review.id,
      product: review.product,
      product_id: review.product_id,
      product_sku: review.product_sku || "",
      customer: review.customer,
      customer_email: review.customer_email || "",
      title: review.title || "",
      review: review.review || "",
      rating: review.rating,
      status: review.status
    });
    setIsEditing(true);
    setShowSuggestions(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reviews_api.php?action=delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Review deleted successfully!');
        fetchReviews();
        fetchStats();
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert('Error deleting review');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews_api.php?action=toggle-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setReviews(prev => prev.map(r => 
          r.id === id ? { ...r, status: data.newStatus, status_raw: data.statusRaw } : r
        ));
        fetchStats();
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      console.error("Toggle error:", error);
      alert('Error updating status');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchReviews();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filterStar, filterStatus]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={`text-xs ${i < rating ? "text-yellow-400" : "text-gray-200"}`} />
    ));
  };

  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
        <p className="text-sm text-gray-500">Manage and moderate product reviews.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Reviews</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FaChartBar className="text-xl"/>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Average Rating</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-yellow-600">{stats.averageRating}</h3>
                <div className="flex">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
              <FaStar className="text-xl"/>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Recent (7 days)</p>
              <h3 className="text-2xl font-bold text-green-600">{stats.recentReviews}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <FaSync className="text-xl"/>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: ADD/EDIT FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              {isEditing ? "✏️ Edit Review" : "➕ Add Manual Review"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Autosuggest with Product ID */}
              <div className="relative" ref={suggestionsRef}>
                <label className="text-xs font-bold text-gray-500 uppercase">Product Name *</label>
                <div className="relative">
                  <input 
                    name="product" 
                    value={form.product} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Type product name..."
                    autoComplete="off"
                    required
                  />
                  {form.product_id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                        ID: {form.product_id}
                      </span>
                    </div>
                  )}
                </div>
                
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((prod, i) => (
                      <li 
                        key={i} 
                        onClick={() => selectProduct(prod)}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition"
                      >
                        <div className="font-medium">{prod.name}</div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <FaTag /> SKU: {prod.sku}
                          </span>
                          <span className="font-bold">₹{prod.price}</span>
                        </div>
                        <div className="text-xs text-blue-600 font-bold mt-1">
                          Product ID: {prod.id}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                {form.product_sku && (
                  <div className="mt-1 text-xs text-gray-500">
                    <span className="font-medium">SKU:</span> {form.product_sku}
                  </div>
                )}
              </div>

              {/* Customer Name */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Customer Name *</label>
                <input 
                  name="customer" 
                  value={form.customer} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              {/* Customer Email */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Customer Email</label>
                <input 
                  type="email"
                  name="customer_email" 
                  value={form.customer_email} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  placeholder="email@example.com"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar 
                      key={star}
                      className={`text-2xl cursor-pointer transition ${star <= form.rating ? "text-yellow-400" : "text-gray-300"}`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-gray-600">({form.rating}/5)</span>
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Review Title</label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-bold"
                  placeholder="e.g. Best product ever!"
                />
              </div>

              {/* Review Body */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Review Description</label>
                <textarea 
                  name="review" 
                  value={form.review} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  rows="3"
                  placeholder="Detailed feedback..."
                ></textarea>
              </div>

              {/* Status Select */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={() => { 
                      setIsEditing(false); 
                      setForm({
                        id: null,
                        product: "",
                        product_id: null,
                        product_sku: "",
                        customer: "",
                        customer_email: "",
                        title: "",
                        review: "",
                        rating: 0,
                        status: "Approved"
                      }); 
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }} 
                    className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition"
                >
                  {isEditing ? "Update Review" : "Submit Review"}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT: REVIEW LIST & FILTERS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input 
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Search Product, Customer or Title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select 
                className="border rounded-lg px-3 py-2 text-sm bg-white focus:border-blue-500 outline-none"
                value={filterStar}
                onChange={(e) => {
                  setFilterStar(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <select 
                className="border rounded-lg px-3 py-2 text-sm bg-white focus:border-blue-500 outline-none"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button 
                onClick={() => { fetchReviews(); fetchStats(); }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">Loading reviews...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.length > 0 ? (
                <>
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        
                        {/* User Info */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            <FaUserCircle className="text-2xl"/>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm">{review.customer}</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FaBoxOpen /> 
                              <span className="font-medium">{review.product}</span>
                              {review.product_id && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-2">
                                  ID: {review.product_id}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-xs text-gray-400 ml-2">{review.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          review.status === "Approved" ? "bg-green-100 text-green-700" : 
                          review.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {review.status}
                        </span>
                      </div>

                      {/* Review Content */}
                      <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {review.title && (
                          <h5 className="font-bold text-gray-800 text-sm mb-1">{review.title}</h5>
                        )}
                        <p className="text-sm text-gray-600">{review.review || 'No description provided.'}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => toggleStatus(review.id, review.status_raw || review.status.toLowerCase())}
                          className={`text-xs flex items-center gap-1 font-bold px-3 py-1 rounded ${
                            (review.status_raw === 'approved' || review.status === 'Approved') 
                              ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50" 
                              : "text-green-600 hover:text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {(review.status_raw === 'approved' || review.status === 'Approved') ? (
                            <><FaTimes/> Reject</>
                          ) : (
                            <><FaCheck/> Approve</>
                          )}
                        </button>
                        <button 
                          onClick={() => handleEdit(review)} 
                          className="text-xs flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded"
                        >
                          <FaEdit/> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(review.id)} 
                          className="text-xs flex items-center gap-1 font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded"
                        >
                          <FaTrash/> Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                      
                      <div className="text-xs text-gray-500">
                        Showing {startRow}-{endRow} of {totalRows} reviews
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Rows:</span>
                          <select 
                            className="border rounded px-1 py-1 text-xs outline-none bg-white focus:border-blue-500"
                            value={rowsPerPage}
                            onChange={(e) => { 
                              setRowsPerPage(Number(e.target.value)); 
                              setCurrentPage(1); 
                            }}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                        </div>

                        <div className="flex gap-1">
                          <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                          >
                            &lt;
                          </button>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page = i + 1;
                            if(totalPages > 5 && currentPage > 3) {
                              page = currentPage - 2 + i;
                            }
                            if(page > totalPages) return null;
                            
                            return (
                              <button 
                                key={page} 
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 text-xs font-bold rounded border transition ${
                                  currentPage === page 
                                    ? "bg-blue-600 text-white border-blue-600" 
                                    : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}

                          <button 
                            disabled={currentPage === totalPages || totalPages === 0} 
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                          >
                            &gt;
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                  <p>No reviews found matching filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}