import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// Icons import (Make sure to install: npm install react-icons)
import { FaCloudUploadAlt, FaVideo, FaCalendarAlt, FaPlus, FaTimes, FaCheck } from "react-icons/fa";
import { MdOutlineInventory, MdLocalShipping, MdAttachMoney, MdClose } from "react-icons/md";

export default function AddProduct() {
  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    name: "",
    shortDesc: "",
    longDesc: "",
    sku: "",
    category: "",
    oldPrice: "",
    newPrice: "",
    onSale: "No",
    couponApplicable: "No",
    couponCode: "",
    couponDiscount: "",
    minPurchase: "",
    couponExpiry: "",
    stock: "",
    lowStock: "",
    flashStart: "",
    flashEnd: "",
    offerName: "",
    weight: "",
    delivery: "",
    ribbon: "",
  });

  /* ================= STATE MANAGEMENT ================= */
  const [categories, setCategories] = useState([
    "Hair Spray", "Lip Care", "Moisturizer", "New Launch", "Shampoo", "Shop", "Skin Care", "Toner",
  ]);
  
  const [showStartCal, setShowStartCal] = useState(false);
  const [showEndCal, setShowEndCal] = useState(false);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [showCreateCat, setShowCreateCat] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [offerActive, setOfferActive] = useState(false);
  const [reviewsEnabled, setReviewsEnabled] = useState(true);
  const [avgRating, setAvgRating] = useState("4.5");
  const [reviewCount, setReviewCount] = useState("120");
  const [featuredReview, setFeaturedReview] = useState("");
  const [verifiedReview, setVerifiedReview] = useState(true);
  const [selectedCats, setSelectedCats] = useState([]);

  /* ================= REFS & HANDLERS ================= */
  const startRef = useRef(null);
  const endRef = useRef(null);
  const calRef = useRef(null);
  const [showCouponCal, setShowCouponCal] = useState(false);
  const [couponTime, setCouponTime] = useState("00:00");

  const toggleCategory = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const formatDateTime = (date, time) => {
    const d = new Date(date);
    const [hh, mm] = time.split(":");
    d.setHours(hh);
    d.setMinutes(mm);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()} ${time}`;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Close calendar on outside click
  useEffect(() => {
    const close = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) setShowCouponCal(false);
      if (startRef.current && !startRef.current.contains(e.target)) setShowStartCal(false);
      if (endRef.current && !endRef.current.contains(e.target)) setShowEndCal(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">Create a new item for your traditional care catalog.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition">Discard</button>
          <button className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">Publish Product</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= LEFT MAIN CONTENT ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. MEDIA SECTION */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4">Product Media</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition group">
                <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200 transition">
                  <FaCloudUploadAlt className="text-2xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-700">Upload Images</h4>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
              {/* Video Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition group">
                <div className="bg-purple-100 p-3 rounded-full mb-3 group-hover:bg-purple-200 transition">
                  <FaVideo className="text-2xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-700">Upload Video</h4>
                <p className="text-xs text-gray-400 mt-1">Optional promo video</p>
              </div>
            </div>
          </div>

          {/* 2. GENERAL INFO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  name="name"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g. Ayurvedic Hair Oil"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ribbon Label</label>
                <input
                  name="ribbon"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. Best Seller"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
               {/* Toolbar */}
               <div className="flex gap-1 border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-2">
                 {['B', 'I', 'U', '🔗', '≡'].map(btn => (
                   <button key={btn} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-sm font-bold">{btn}</button>
                 ))}
                 <button className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 flex items-center gap-1">✨ AI Generate</button>
               </div>
               <textarea
                 name="longDesc"
                 rows="5"
                 className="w-full px-4 py-2 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                 placeholder="Write product description here..."
                 onChange={handleChange}
               ></textarea>
            </div>
          </div>

          {/* 3. PRICING & COUPONS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold flex items-center gap-2"><MdAttachMoney className="text-xl"/> Pricing</h2>
               {/* On Sale Toggle */}
               <label className="flex items-center cursor-pointer gap-2">
                  <span className="text-sm font-medium text-gray-700">On Sale</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={form.onSale === "Yes"} onChange={(e) => setForm({...form, onSale: e.target.checked ? "Yes" : "No"})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
               </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                     <input name="oldPrice" type="number" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" onChange={handleChange} />
                  </div>
               </div>
               <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                     <input name="newPrice" type="number" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none border-green-200 bg-green-50/20" placeholder="0.00" onChange={handleChange} />
                  </div>
               </div>
            </div>

            {/* Coupon Section */}
            <div className="border-t pt-4">
              <label className="flex items-center cursor-pointer gap-2 mb-4">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={form.couponApplicable === "Yes"} onChange={(e) => setForm({...form, couponApplicable: e.target.checked ? "Yes" : "No"})} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">Apply Coupon Code</span>
               </label>

               {form.couponApplicable === "Yes" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg animate-fadeIn">
                    <input name="couponCode" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg uppercase placeholder-gray-400" placeholder="CODE (e.g. SAVE20)" onChange={handleChange} />
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                       <input name="couponDiscount" type="number" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg" placeholder="Discount %" onChange={handleChange} />
                    </div>
                    
                    {/* Date Picker */}
                    <div className="relative md:col-span-2" ref={calRef}>
                       <label className="text-xs text-gray-500 block mb-1">Coupon Expiry</label>
                       <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                          <input readOnly value={form.couponExpiry} className="w-full px-4 py-2 outline-none text-sm" placeholder="Select Date & Time" />
                          <button onClick={() => setShowCouponCal(!showCouponCal)} className="px-3 text-gray-500 hover:text-blue-600"><FaCalendarAlt/></button>
                       </div>
                       {showCouponCal && (
                         <div className="absolute top-full right-0 mt-2 z-50 bg-white shadow-xl border rounded-lg p-2">
                           <Calendar onChange={(d) => setForm({...form, couponExpiry: formatDateTime(d, couponTime)})} />
                           <div className="mt-2 flex gap-2 items-center">
                              <span className="text-xs">Time:</span>
                              <input type="time" value={couponTime} onChange={(e) => setCouponTime(e.target.value)} className="border rounded p-1 text-sm"/>
                           </div>
                         </div>
                       )}
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* 4. FLASH SALE */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-orange-600 flex items-center gap-2">⚡ Flash Deal</h2>
               <button onClick={() => setOfferActive(!offerActive)} className={`text-xs px-3 py-1 rounded-full font-bold transition ${offerActive ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                 {offerActive ? "ACTIVE" : "INACTIVE"}
               </button>
             </div>
             
             <div className={`transition-all ${offerActive ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                <input name="offerName" type="text" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg" placeholder="Offer Name (e.g. Diwali Blast)" onChange={handleChange} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Start Date */}
                   <div className="relative" ref={startRef}>
                      <label className="text-xs font-bold text-gray-500">Starts At</label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white mt-1">
                          <input readOnly value={form.flashStart} className="w-full px-4 py-2 outline-none text-sm" placeholder="DD-MM-YYYY HH:MM" />
                          <button onClick={() => setShowStartCal(!showStartCal)} className="px-3 text-gray-500"><FaCalendarAlt/></button>
                       </div>
                       {showStartCal && (
                         <div className="absolute top-full left-0 mt-2 z-20 bg-white shadow-xl border rounded-lg p-2">
                            <Calendar onChange={(d) => setForm({...form, flashStart: formatDateTime(d, startTime)})} />
                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full mt-2 border rounded p-1"/>
                         </div>
                       )}
                   </div>

                   {/* End Date */}
                   <div className="relative" ref={endRef}>
                      <label className="text-xs font-bold text-gray-500">Ends At</label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white mt-1">
                          <input readOnly value={form.flashEnd} className="w-full px-4 py-2 outline-none text-sm" placeholder="DD-MM-YYYY HH:MM" />
                          <button onClick={() => setShowEndCal(!showEndCal)} className="px-3 text-gray-500"><FaCalendarAlt/></button>
                       </div>
                       {showEndCal && (
                         <div className="absolute top-full right-0 mt-2 z-20 bg-white shadow-xl border rounded-lg p-2">
                            <Calendar onChange={(d) => setForm({...form, flashEnd: formatDateTime(d, endTime)})} />
                            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full mt-2 border rounded p-1"/>
                         </div>
                       )}
                   </div>
                </div>
             </div>
          </div>

          {/* 5. INVENTORY & SHIPPING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Inventory */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${Number(form.stock) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {Number(form.stock) > 0 ? "In Stock" : "Out of Stock"}
                </div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MdOutlineInventory/> Inventory</h2>
                <div className="space-y-3">
                   <div>
                     <label className="text-xs font-bold text-gray-500">Quantity</label>
                     <input name="stock" type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" onChange={handleChange} />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500">Low Stock Alert</label>
                     <input name="lowStock" type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" onChange={handleChange} />
                   </div>
                </div>
             </div>

             {/* Shipping */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MdLocalShipping/> Shipping</h2>
                <div className="space-y-3">
                   <div>
                     <label className="text-xs font-bold text-gray-500">Weight (kg)</label>
                     <input name="weight" type="number" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="0.5" onChange={handleChange} />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500">Delivery Est.</label>
                     <input name="delivery" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="3-5 Business Days" onChange={handleChange} />
                   </div>
                </div>
             </div>
          </div>

          {/* 6. ADMIN REVIEWS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-purple-500">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Admin Review Control</h2>
                <label className="flex items-center cursor-pointer gap-2">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={reviewsEnabled} onChange={() => setReviewsEnabled(!reviewsEnabled)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
               </label>
             </div>

             {reviewsEnabled && (
                <div className="animate-fadeIn space-y-4">
                   <div className="flex gap-4">
                      <div className="w-1/2">
                         <label className="text-xs font-bold text-gray-500">Avg Rating</label>
                         <input value={avgRating} onChange={(e) => setAvgRating(e.target.value)} type="number" step="0.1" className="w-full border rounded-lg p-2" />
                      </div>
                      <div className="w-1/2">
                         <label className="text-xs font-bold text-gray-500">Total Reviews</label>
                         <input value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} type="number" className="w-full border rounded-lg p-2" />
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-500">Featured Review Text</label>
                      <textarea value={featuredReview} onChange={(e) => setFeaturedReview(e.target.value)} className="w-full border rounded-lg p-2 text-sm" rows="2" placeholder="Great organic product..."></textarea>
                   </div>
                   
                   {/* Preview Box */}
                   <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 mt-2">
                      <div className="text-xs text-gray-400 uppercase font-bold mb-1">Live Preview</div>
                      <div className="text-yellow-500 text-sm font-bold">★ {avgRating} <span className="text-gray-400 font-normal">({reviewCount} reviews)</span></div>
                      <p className="text-sm text-gray-600 italic mt-1">"{featuredReview || "Featured review text..."}"</p>
                      {verifiedReview && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mt-2 inline-block">🌿 Verified Ayurvedic Purchase</span>}
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Categories Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800">Categories</h3>
               <button onClick={() => setShowCreateCat(true)} className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"><FaPlus/></button>
             </div>
             
             {/* New Category Input */}
             {showCreateCat && (
               <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn">
                  <input autoFocus type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full text-sm p-1 border rounded mb-2" placeholder="New category name..." />
                  <div className="flex gap-2 justify-end">
                     <button onClick={() => setShowCreateCat(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                     <button onClick={() => {if(newCategory){setCategories([...categories, newCategory]); setNewCategory(""); setShowCreateCat(false)}}} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Add</button>
                  </div>
               </div>
             )}

             <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition select-none">
                    <div className="relative flex items-center">
                      <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer appearance-none"/>
                      <FaCheck className="absolute text-white text-[10px] pointer-events-none opacity-0 peer-checked:opacity-100 left-[2px]"/>
                    </div>
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
             </div>
          </div>

          {/* Quick Stats or Tips */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
             <h4 className="font-bold text-blue-800 mb-2 text-sm">Selling Tips</h4>
             <ul className="text-xs text-blue-700 space-y-2 list-disc pl-4">
                <li>Use high-quality images (1080x1080).</li>
                <li>Write detailed descriptions for better SEO.</li>
                <li>Set competitive prices based on market.</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}