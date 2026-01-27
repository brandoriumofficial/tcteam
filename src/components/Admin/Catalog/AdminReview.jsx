import React, { useState, useEffect } from "react";
import { 
  FaStar, FaSearch, FaTrash, FaEdit, FaCheck, FaTimes, FaUserCircle, FaBoxOpen 
} from "react-icons/fa";

// --- DUMMY PRODUCTS FOR AUTO-SUGGEST ---
const productList = [
  "Traditional Herbal Hair Oil",
  "Ayurvedic Skin Glow Cream",
  "Organic Neem Face Wash",
  "Sandalwood Body Scrub",
  "Hibiscus Shampoo",
  "Aloe Vera Gel Pure"
];

// --- INITIAL REVIEWS DATA ---
const initialReviews = [
  {
    id: 1,
    product: "Traditional Herbal Hair Oil",
    customer: "Rahul Sharma",
    title: "Amazing Results!",
    review: "Hair fall kam ho gaya 2 weeks mein. Very natural smell.",
    rating: 5,
    date: "2024-02-10",
    status: "Approved"
  },
  {
    id: 2,
    product: "Organic Neem Face Wash",
    customer: "Priya Singh",
    title: "Good for acne",
    review: "Skin feels dry after use but pimples are gone.",
    rating: 4,
    date: "2024-02-12",
    status: "Pending"
  }
];

export default function AdminReview() {
  
  // --- STATE ---
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState({
    id: null,
    product: "",
    customer: "",
    title: "",
    review: "",
    rating: 0,
    status: "Approved"
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Filters
  const [search, setSearch] = useState("");
  const [filterStar, setFilterStar] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- HANDLERS ---

  // 1. Handle Form Input & Auto Suggestion
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "product") {
      if (value.length > 0) {
        const matches = productList.filter(p => p.toLowerCase().includes(value.toLowerCase()));
        setSuggestions(matches);
      } else {
        setSuggestions([]);
      }
    }
  };

  const selectProduct = (name) => {
    setForm({ ...form, product: name });
    setSuggestions([]);
  };

  // 2. Handle Star Rating Click
  const handleRating = (rate) => {
    setForm({ ...form, rating: rate });
  };

  // 3. Add or Update Review
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.product || !form.customer || !form.rating) return alert("Please fill required fields");

    if (isEditing) {
      setReviews(prev => prev.map(r => r.id === form.id ? { ...form, date: r.date } : r));
      setIsEditing(false);
    } else {
      const newReview = {
        ...form,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      setReviews([newReview, ...reviews]);
    }
    
    // Reset Form
    setForm({ id: null, product: "", customer: "", title: "", review: "", rating: 0, status: "Approved" });
  };

  // 4. Edit & Delete Actions
  const handleEdit = (review) => {
    setForm(review);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Rejected" : "Approved";
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  // --- FILTER LOGIC ---
  const filteredReviews = reviews.filter(r => {
    const matchSearch = r.product.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase());
    const matchStar = filterStar === "All" ? true : r.rating === parseInt(filterStar);
    const matchStatus = filterStatus === "All" ? true : r.status === filterStatus;
    return matchSearch && matchStar && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
        <p className="text-sm text-gray-500">Manage and moderate product reviews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= LEFT: ADD/EDIT FORM ================= */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              {isEditing ? "✏️ Edit Review" : "➕ Add Manual Review"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Autosuggest */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase">Product Name *</label>
                <input 
                  name="product" 
                  value={form.product} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Type to search..."
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {suggestions.map((prod, i) => (
                      <li key={i} onClick={() => selectProduct(prod)} className="p-2 text-sm hover:bg-blue-50 cursor-pointer">{prod}</li>
                    ))}
                  </ul>
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
                  <button type="button" onClick={() => { setIsEditing(false); setForm({ id: null, product: "", customer: "", title: "", review: "", rating: 0, status: "Approved" }) }} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-bold text-sm">Cancel</button>
                )}
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                  {isEditing ? "Update Review" : "Submit Review"}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* ================= RIGHT: REVIEW LIST & FILTERS ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input 
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Search Product or Customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select className="border rounded-lg px-3 py-2 text-sm bg-white" onChange={(e) => setFilterStar(e.target.value)}>
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <select className="border rounded-lg px-3 py-2 text-sm bg-white" onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
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
                          <FaBoxOpen /> <span>{review.product}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`text-xs ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`} />
                          ))}
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
                    <h5 className="font-bold text-gray-800 text-sm mb-1">{review.title}</h5>
                    <p className="text-sm text-gray-600">{review.review}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => toggleStatus(review.id, review.status)}
                      className={`text-xs flex items-center gap-1 font-bold ${review.status === "Approved" ? "text-orange-500 hover:text-orange-600" : "text-green-600 hover:text-green-700"}`}
                    >
                      {review.status === "Approved" ? <><FaTimes/> Reject</> : <><FaCheck/> Approve</>}
                    </button>
                    <button onClick={() => handleEdit(review)} className="text-xs flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700">
                      <FaEdit/> Edit
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="text-xs flex items-center gap-1 font-bold text-red-600 hover:text-red-700">
                      <FaTrash/> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <p>No reviews found matching filters.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}