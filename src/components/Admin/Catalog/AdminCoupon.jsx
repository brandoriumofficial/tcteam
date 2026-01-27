import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { 
  FaTag, FaBullhorn, FaCalendarAlt, FaTrash, FaEdit, FaCheck, 
  FaTimes, FaPlus, FaSave, FaSearch, FaFilter, FaSortAmountDown, 
  FaCopy, FaPause, FaPlay, FaEye, FaCalendarCheck, FaClock, 
  FaPercent, FaRupeeSign, FaShoppingCart, FaImage, FaTimesCircle,
  FaSun, FaMoon
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from "./ConfirmModal";

export default function AdminCoupon() {
  
  // --- STATES --- //
  const [darkMode, setDarkMode] = useState(false);
  
  // 1. Business Snapshot Stats
  const [stats, setStats] = useState({
    activeCoupons: 12,
    expiringSoon: 3,
    expiredCoupons: 5,
    activeOffers: 7
  });

  // 2. Coupon List & Form
  const [coupons, setCoupons] = useState([
    { 
      id: 1, 
      code: "HAIR10", 
      discount: "10%", 
      discountType: "percentage",
      discountValue: 10,
      min: "500", 
      category: "Hair Care", 
      product: "All Hair Products",
      usageLimit: 100,
      usedCount: 45,
      status: "Active", 
      expiry: "2026-06-30 23:59",
      startDate: "2024-01-01 00:00",
      tags: ["Herbal", "Seasonal"]
    },
    { 
      id: 2, 
      code: "SKIN20", 
      discount: "₹200", 
      discountType: "flat",
      discountValue: 200,
      min: "1000", 
      category: "Skin Care", 
      product: "Face Wash & Creams",
      usageLimit: 50,
      usedCount: 50,
      status: "Expired", 
      expiry: "2024-12-31 23:59",
      startDate: "2024-01-01 00:00",
      tags: ["Organic", "Festival"]
    },
    { 
      id: 3, 
      code: "WELCOME25", 
      discount: "25%", 
      discountType: "percentage",
      discountValue: 25,
      min: "0", 
      category: "All Categories", 
      product: "All Products",
      usageLimit: 200,
      usedCount: 120,
      status: "Active", 
      expiry: "2024-12-15 23:59", // Expiring soon
      startDate: "2024-01-01 00:00",
      tags: ["Welcome", "New User"]
    },
  ]);

  const [couponForm, setCouponForm] = useState({
    id: null, 
    code: "", 
    discount: "", 
    discountType: "percentage",
    discountValue: "",
    min: "", 
    category: "All Categories", 
    product: "All Products",
    usageLimit: "",
    usedCount: 0,
    status: "Active", 
    expiry: "",
    startDate: "",
    tags: []
  });

  // 3. Offer List & Form
  const [offers, setOffers] = useState([
    { 
      id: 1, 
      name: "Hair Care Mega Offer", 
      desc: "Flat 20% OFF on Ayurvedic Hair Oils & Shampoo", 
      status: "Active", 
      type: "Flat Discount",
      discount: "20%",
      category: "Hair Care",
      products: ["Hair Oil", "Shampoo", "Conditioner"],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      bannerImage: "https://via.placeholder.com/400x100/8b5cf6/ffffff?text=Hair+Care+Special",
      tags: ["Herbal", "Ayurveda", "Seasonal"]
    },
    { 
      id: 2, 
      name: "Winter Skin Care", 
      desc: "Buy 2 Get 1 Free on Herbal Creams", 
      status: "Upcoming", 
      type: "Buy X Get Y",
      discount: "Buy 2 Get 1",
      category: "Skin Care",
      products: ["Face Cream", "Body Lotion", "Sunscreen"],
      startDate: "2024-12-01",
      endDate: "2025-02-28",
      bannerImage: "https://via.placeholder.com/400x100/f59e0b/ffffff?text=Winter+Special",
      tags: ["Winter", "Herbal", "Combo"]
    },
    { 
      id: 3, 
      name: "Diwali Festival Sale", 
      desc: "30% OFF + Free Gift on orders above ₹1500", 
      status: "Active", 
      type: "Combo Offer",
      discount: "30% + Gift",
      category: "All Categories",
      products: ["All Products"],
      startDate: "2024-10-20",
      endDate: "2024-11-15",
      bannerImage: "https://via.placeholder.com/400x100/ef4444/ffffff?text=Diwali+Special",
      tags: ["Festival", "Limited", "Gift"]
    },
  ]);

  const [offerForm, setOfferForm] = useState({
    id: null, 
    name: "", 
    desc: "", 
    type: "Flat Discount",
    discount: "",
    category: "Hair Care",
    products: [],
    status: "Active",
    startDate: "",
    endDate: "",
    bannerImage: "",
    tags: []
  });

  // 4. Filter & Search States
  const [couponSearch, setCouponSearch] = useState("");
  const [couponFilter, setCouponFilter] = useState({
    category: "All",
    status: "All",
    sortBy: "expiry"
  });

  // 5. UI States
  const [showCouponCal, setShowCouponCal] = useState(false);
  const [showCouponStartCal, setShowCouponStartCal] = useState(false);
  const [showOfferStartCal, setShowOfferStartCal] = useState(false);
  const [showOfferEndCal, setShowOfferEndCal] = useState(false);
  const [activeTagInput, setActiveTagInput] = useState("");
  const [modal, setModal] = useState({ show: false, type: "", id: null });
  
  // Refs
  const calRef = useRef();
  const tagInputRef = useRef();

  // --- EFFECTS --- //
  
  // Click outside calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calRef.current && !calRef.current.contains(event.target)) {
        setShowCouponCal(false);
        setShowCouponStartCal(false);
        setShowOfferStartCal(false);
        setShowOfferEndCal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update stats automatically
  useEffect(() => {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    
    const activeCoupons = coupons.filter(c => c.status === "Active").length;
    const expiringSoon = coupons.filter(c => {
      const expiry = new Date(c.expiry);
      return expiry > today && expiry <= sevenDaysLater && c.status === "Active";
    }).length;
    const expiredCoupons = coupons.filter(c => c.status === "Expired").length;
    const activeOffers = offers.filter(o => o.status === "Active").length;
    
    setStats({ activeCoupons, expiringSoon, expiredCoupons, activeOffers });
  }, [coupons, offers]);

  // Auto-update coupon status based on dates
  useEffect(() => {
    const today = new Date();
    const updatedCoupons = coupons.map(coupon => {
      const expiry = new Date(coupon.expiry);
      const start = new Date(coupon.startDate);
      
      // If usage limit reached
      if (coupon.usedCount >= coupon.usageLimit && coupon.status !== "Expired") {
        return { ...coupon, status: "Inactive" };
      }
      
      // If expired
      if (expiry < today && coupon.status !== "Expired") {
        return { ...coupon, status: "Expired" };
      }
      
      // If not yet started
      if (start > today && coupon.status === "Active") {
        return { ...coupon, status: "Upcoming" };
      }
      
      return coupon;
    });
    
    setCoupons(updatedCoupons);
  }, []);

  // --- HANDLERS --- //

  // 1. COUPON HANDLERS
  const handleCouponChange = (e) => {
    const { name, value } = e.target;
    setCouponForm(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === "discountType" && { discountValue: "" }) // Reset value when type changes
    }));
  };

  const saveCoupon = () => {
    if (!couponForm.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    
    if (!couponForm.discountValue) {
      toast.error("Discount value is required");
      return;
    }
    
    if (!couponForm.expiry) {
      toast.error("Expiry date is required");
      return;
    }

    const discountDisplay = couponForm.discountType === "percentage" 
      ? `${couponForm.discountValue}%` 
      : `₹${couponForm.discountValue}`;

    const newCoupon = {
      ...couponForm,
      discount: discountDisplay,
      id: couponForm.id || Date.now(),
      usedCount: couponForm.usedCount || 0
    };

    if (couponForm.id) {
      // Update Existing
      setCoupons(prev => prev.map(c => c.id === couponForm.id ? newCoupon : c));
      toast.success("Coupon updated successfully!");
    } else {
      // Add New
      setCoupons(prev => [...prev, newCoupon]);
      toast.success("Coupon created successfully!");
    }
    
    // Reset form
    setCouponForm({
      id: null, code: "", discount: "", discountType: "percentage", discountValue: "",
      min: "", category: "All Categories", product: "All Products", usageLimit: "",
      usedCount: 0, status: "Active", expiry: "", startDate: "", tags: []
    });
  };

  const editCoupon = (coupon) => {
    setCouponForm({
      ...coupon,
      discountValue: coupon.discountType === "percentage" 
        ? parseInt(coupon.discount) 
        : parseInt(coupon.discount.replace('₹', '')),
      discountType: coupon.discount.includes('%') ? "percentage" : "flat"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCouponStatus = (id) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status === "Active" ? "Inactive" : "Active";
        toast.info(`Coupon ${newStatus.toLowerCase()}`);
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.info(`Copied: ${code}`);
  };

  const confirmDelete = (type, id) => {
    setModal({ show: true, type, id });
  };

  const handleDelete = () => {
    if (modal.type === "coupon") {
      setCoupons(prev => prev.filter(c => c.id !== modal.id));
      toast.success("Coupon deleted successfully!");
    } else if (modal.type === "offer") {
      setOffers(prev => prev.filter(o => o.id !== modal.id));
      toast.success("Offer deleted successfully!");
    }
    setModal({ show: false, type: "", id: null });
  };

  // 2. OFFER HANDLERS
  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setOfferForm(prev => ({ ...prev, [name]: value }));
  };

  const saveOffer = () => {
    if (!offerForm.name.trim()) {
      toast.error("Offer name is required");
      return;
    }
    
    const newOffer = {
      ...offerForm,
      id: offerForm.id || Date.now(),
      products: offerForm.products.length ? offerForm.products : ["All Products"]
    };

    if (offerForm.id) {
      setOffers(prev => prev.map(o => o.id === offerForm.id ? newOffer : o));
      toast.success("Offer updated successfully!");
    } else {
      setOffers(prev => [...prev, newOffer]);
      toast.success("Offer created successfully!");
    }
    
    setOfferForm({
      id: null, name: "", desc: "", type: "Flat Discount", discount: "",
      category: "Hair Care", products: [], status: "Active",
      startDate: "", endDate: "", bannerImage: "", tags: []
    });
  };

  const editOffer = (offer) => {
    setOfferForm(offer);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleOfferStatus = (id) => {
    setOffers(prev => prev.map(o => {
      if (o.id === id) {
        const newStatus = o.status === "Active" ? "Inactive" : "Active";
        toast.info(`Offer ${newStatus.toLowerCase()}`);
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  // 3. TAG HANDLERS
  const addTag = (type) => {
    if (!activeTagInput.trim()) return;
    
    const newTag = activeTagInput.trim();
    if (type === "coupon") {
      if (!couponForm.tags.includes(newTag)) {
        setCouponForm(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
    } else {
      if (!offerForm.tags.includes(newTag)) {
        setOfferForm(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
    }
    setActiveTagInput("");
    tagInputRef.current?.focus();
  };

  const removeTag = (type, tagToRemove) => {
    if (type === "coupon") {
      setCouponForm(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    } else {
      setOfferForm(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    }
  };

  // 4. DATE HANDLERS
  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getFullYear())}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 23:59`;
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // 5. FILTER & SORT
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
                         coupon.category.toLowerCase().includes(couponSearch.toLowerCase());
    const matchesCategory = couponFilter.category === "All" || coupon.category === couponFilter.category;
    const matchesStatus = couponFilter.status === "All" || coupon.status === couponFilter.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch(couponFilter.sortBy) {
      case "expiry":
        return new Date(a.expiry) - new Date(b.expiry);
      case "discount":
        return (b.discountValue || 0) - (a.discountValue || 0);
      case "usage":
        return (b.usedCount / b.usageLimit) - (a.usedCount / a.usageLimit);
      default:
        return 0;
    }
  });

  // 6. PRODUCT OFFERS VIEW
  const productOffers = [
    { id: 1, name: "Hair Oil", discount: "20% OFF", validTill: "30 June", status: "Active", type: "Flat Discount" },
    { id: 2, name: "Face Wash", discount: "Buy 1 Get 1", validTill: "15 July", status: "Upcoming", type: "Buy X Get Y" },
    { id: 3, name: "Body Lotion", discount: "15% OFF", validTill: "25 May", status: "Active", type: "Flat Discount" },
    { id: 4, name: "Shampoo", discount: "₹100 OFF", validTill: "10 August", status: "Active", type: "Flat Discount" },
  ];

  // --- RENDER --- //
  return (
    <div className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />
      <ConfirmModal 
        isOpen={modal.show}
        onClose={() => setModal({ show: false, type: "", id: null })}
        onConfirm={handleDelete}
        type={modal.type}
      />

      {/* 🔝 TOP SECTION – Business Snapshot */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaTag className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}/>
            Coupons & Offers Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              v2.0.1
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stats Cards */}
          <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FaTag className="text-green-600"/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Coupons</p>
                <p className="text-2xl font-bold">{stats.activeCoupons}</p>
              </div>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${(stats.activeCoupons/20)*100}%` }}></div>
            </div>
          </div>

          <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <FaClock className="text-yellow-600"/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringSoon}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600 font-medium">Within 7 days</div>
          </div>

          <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <FaTimesCircle className="text-red-600"/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Expired Coupons</p>
                <p className="text-2xl font-bold">{stats.expiredCoupons}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Requires cleanup</div>
          </div>

          <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FaBullhorn className="text-purple-600"/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Offers</p>
                <p className="text-2xl font-bold">{stats.activeOffers}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-purple-600 font-medium">Running campaigns</div>
          </div>
        </div>
      </div>

      {/* 🧾 MAIN LAYOUT (2 Column Power UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* --- 🎟️ COUPON MANAGER (LEFT SIDE) --- */}
        <div className={`rounded-xl shadow-lg border p-6 transition-all ${couponForm.id ? "border-blue-500 ring-2 ring-blue-50" : darkMode ? "border-gray-700" : "border-gray-200"} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FaTag className="text-blue-500"/>
              {couponForm.id ? "✏️ Edit Coupon" : "➕ Create New Coupon"}
            </h2>
            {couponForm.id && (
              <button 
                onClick={() => setCouponForm({
                  id:null, code:"", discount:"", discountType:"percentage", discountValue:"",
                  min:"", category:"All Categories", product:"All Products", usageLimit:"",
                  status:"Active", expiry:"", startDate:"", tags:[]
                })}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Coupon Code *</label>
                <input 
                  name="code" 
                  value={couponForm.code} 
                  onChange={handleCouponChange} 
                  className={`w-full border rounded-lg p-2 text-sm uppercase font-bold ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                  placeholder="e.g. HAIR10" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Discount Type</label>
                <select 
                  name="discountType" 
                  value={couponForm.discountType} 
                  onChange={handleCouponChange}
                  className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {couponForm.discountType === "percentage" ? "Discount % *" : "Discount Amount (₹) *"}
                </label>
                <div className="flex items-center">
                  <span className={`border border-r-0 rounded-l-lg p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                    {couponForm.discountType === "percentage" ? <FaPercent className="text-gray-400"/> : <FaRupeeSign className="text-gray-400"/>}
                  </span>
                  <input 
                    name="discountValue" 
                    type="number"
                    value={couponForm.discountValue} 
                    onChange={handleCouponChange} 
                    className={`w-full border rounded-r-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    placeholder={couponForm.discountType === "percentage" ? "10" : "200"} 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Min Purchase (₹)</label>
                <div className="flex items-center">
                  <span className={`border border-r-0 rounded-l-lg p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                    <FaRupeeSign className="text-gray-400"/>
                  </span>
                  <input 
                    name="min" 
                    value={couponForm.min} 
                    onChange={handleCouponChange} 
                    className={`w-full border rounded-r-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    placeholder="500" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <select 
                  name="category" 
                  value={couponForm.category} 
                  onChange={handleCouponChange} 
                  className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                >
                  <option>All Categories</option>
                  <option>Hair Care</option>
                  <option>Skin Care</option>
                  <option>Body Care</option>
                  <option>Ayurveda</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Usage Limit</label>
                <input 
                  name="usageLimit" 
                  type="number"
                  value={couponForm.usageLimit} 
                  onChange={handleCouponChange} 
                  className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                  placeholder="100" 
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative" ref={calRef}>
                <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                <div 
                  className={`flex items-center border rounded-lg p-2 cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
                  onClick={() => setShowCouponStartCal(!showCouponStartCal)}
                >
                  <input 
                    readOnly 
                    value={couponForm.startDate} 
                    placeholder="Select start date" 
                    className={`w-full text-sm outline-none cursor-pointer ${darkMode ? 'bg-gray-700' : ''}`}
                  />
                  <FaCalendarAlt className="text-gray-400"/>
                </div>
                {showCouponStartCal && (
                  <div className={`absolute top-full z-10 mt-1 shadow-xl border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <Calendar 
                      onChange={(d) => { 
                        setCouponForm({...couponForm, startDate: formatDate(d)}); 
                        setShowCouponStartCal(false); 
                      }} 
                      className={darkMode ? 'bg-gray-800 text-white' : ''}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date *</label>
                <div 
                  className={`flex items-center border rounded-lg p-2 cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
                  onClick={() => setShowCouponCal(!showCouponCal)}
                >
                  <input 
                    readOnly 
                    value={couponForm.expiry} 
                    placeholder="Select expiry date" 
                    className={`w-full text-sm outline-none cursor-pointer ${darkMode ? 'bg-gray-700' : ''}`}
                  />
                  <FaCalendarAlt className="text-gray-400"/>
                </div>
                {showCouponCal && (
                  <div className={`absolute top-full z-10 mt-1 shadow-xl border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <Calendar 
                      onChange={(d) => { 
                        setCouponForm({...couponForm, expiry: formatDate(d)}); 
                        setShowCouponCal(false); 
                      }}
                      className={darkMode ? 'bg-gray-800 text-white' : ''}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Tags</label>
              <div className="flex gap-2 mt-1">
                <input
                  ref={tagInputRef}
                  value={activeTagInput}
                  onChange={(e) => setActiveTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag("coupon")}
                  className={`flex-1 border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                  placeholder="Add tag and press Enter"
                />
                <button 
                  onClick={() => addTag("coupon")}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200"
                >
                  Add
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {couponForm.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag("coupon", tag)} className="text-blue-900 hover:text-blue-950">
                      <FaTimes className="text-xs"/>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status & Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Status</label>
                <button 
                  onClick={() => setCouponForm({...couponForm, status: couponForm.status === "Active" ? "Inactive" : "Active"})}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${couponForm.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {couponForm.status}
                </button>
              </div>

              <div className="flex gap-3">
                <button className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button 
                  onClick={saveCoupon} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2"
                >
                  <FaSave/>
                  {couponForm.id ? "Update Coupon" : "Add Coupon"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- 🛍️ OFFER MANAGER (RIGHT SIDE) --- */}
        <div className={`rounded-xl shadow-lg border border-t-4 border-t-purple-500 p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FaBullhorn className="text-purple-500"/>
              Create Traditional Care Offer
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Offer Status</span>
              <button 
                onClick={() => setOfferForm({...offerForm, status: offerForm.status === "Active" ? "Inactive" : "Active"})}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${offerForm.status === "Active" ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"}`}
              >
                <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
              </button>
              <span className={`text-xs font-bold ${offerForm.status === "Active" ? "text-green-600" : "text-gray-500"}`}>
                {offerForm.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Offer Name *</label>
              <input 
                name="name"
                value={offerForm.name}
                onChange={handleOfferChange}
                className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                placeholder="e.g. Mega Herbal Sale" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <select 
                  name="category"
                  value={offerForm.category}
                  onChange={handleOfferChange}
                  className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                >
                  <option>Hair Care</option>
                  <option>Skin Care</option>
                  <option>Body Care</option>
                  <option>All Categories</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Offer Type</label>
                <select 
                  name="type"
                  value={offerForm.type}
                  onChange={handleOfferChange}
                  className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                >
                  <option>Flat Discount</option>
                  <option>Buy X Get Y</option>
                  <option>Combo Offer</option>
                  <option>Free Gift</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Offer Description</label>
              <textarea 
                name="desc"
                value={offerForm.desc}
                onChange={handleOfferChange}
                className={`w-full border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                rows="2" 
                placeholder="Ayurvedic benefits, herbs, seasonal usage..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative" ref={calRef}>
                <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                <div 
                  className={`flex items-center border rounded-lg p-2 cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
                  onClick={() => setShowOfferStartCal(!showOfferStartCal)}
                >
                  <input 
                    readOnly 
                    value={offerForm.startDate} 
                    placeholder="Select start date" 
                    className={`w-full text-sm outline-none cursor-pointer ${darkMode ? 'bg-gray-700' : ''}`}
                  />
                  <FaCalendarAlt className="text-gray-400"/>
                </div>
                {showOfferStartCal && (
                  <div className={`absolute bottom-full mb-1 bg-white shadow-xl border rounded-lg z-20 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                    <Calendar 
                      onChange={(d) => { 
                        setOfferForm({...offerForm, startDate: formatDate(d)}); 
                        setShowOfferStartCal(false); 
                      }}
                      className={darkMode ? 'bg-gray-800 text-white' : ''}
                    />
                  </div>
                )}
              </div>
              
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                <div 
                  className={`flex items-center border rounded-lg p-2 cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
                  onClick={() => setShowOfferEndCal(!showOfferEndCal)}
                >
                  <input 
                    readOnly 
                    value={offerForm.endDate} 
                    placeholder="Select end date" 
                    className={`w-full text-sm outline-none cursor-pointer ${darkMode ? 'bg-gray-700' : ''}`}
                  />
                  <FaCalendarAlt className="text-gray-400"/>
                </div>
                {showOfferEndCal && (
                  <div className={`absolute bottom-full right-0 mb-1 bg-white shadow-xl border rounded-lg z-20 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                    <Calendar 
                      onChange={(d) => { 
                        setOfferForm({...offerForm, endDate: formatDate(d)}); 
                        setShowOfferEndCal(false); 
                      }}
                      className={darkMode ? 'bg-gray-800 text-white' : ''}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Banner Image URL</label>
              <div className="flex items-center gap-2">
                <span className={`border border-r-0 rounded-l-lg p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                  <FaImage className="text-gray-400"/>
                </span>
                <input 
                  name="bannerImage"
                  value={offerForm.bannerImage}
                  onChange={handleOfferChange}
                  className={`w-full border rounded-r-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                  placeholder="https://example.com/banner.jpg" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Offer Tags</label>
              <div className="flex gap-2 mt-1">
                <input
                  value={activeTagInput}
                  onChange={(e) => setActiveTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag("offer")}
                  className={`flex-1 border rounded-lg p-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                  placeholder="Add offer tag"
                />
                <button 
                  onClick={() => addTag("offer")}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200"
                >
                  Add
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {["Herbal", "Chemical Free", "Ayurveda Inspired", "Seasonal"].concat(offerForm.tags).map((tag, index) => (
                  <span key={index} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                    {tag}
                    {index >= 4 && (
                      <button onClick={() => removeTag("offer", tag)} className="text-purple-900 hover:text-purple-950">
                        <FaTimes className="text-xs"/>
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg font-bold text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button 
                onClick={saveOffer}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-purple-700 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
              >
                <FaPlus/>
                {offerForm.id ? "Update Offer" : "Create Offer"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
        {/* --- 1. COUPONS TABLE WITH FILTERS --- */}
        <div className="lg:col-span-2">
          <div className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            
            {/* Filter & Sort Bar */}
            <div className={`px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <h2 className="font-bold text-lg">Available Coupons</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                  <input
                    type="text"
                    value={couponSearch}
                    onChange={(e) => setCouponSearch(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                    placeholder="Search by code or category..."
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <select 
                    value={couponFilter.category}
                    onChange={(e) => setCouponFilter({...couponFilter, category: e.target.value})}
                    className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                  >
                    <option value="All">All Categories</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Body Care">Body Care</option>
                  </select>

                  <select 
                    value={couponFilter.status}
                    onChange={(e) => setCouponFilter({...couponFilter, status: e.target.value})}
                    className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>

                  <select 
                    value={couponFilter.sortBy}
                    onChange={(e) => setCouponFilter({...couponFilter, sortBy: e.target.value})}
                    className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                  >
                    <option value="expiry">Sort by Expiry</option>
                    <option value="discount">Sort by Discount</option>
                    <option value="usage">Sort by Usage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={`uppercase text-xs font-bold ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Min Order</th>
                    <th className="p-3">Used</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Expiry</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                  {filteredCoupons.map(coupon => {
                    const progress = (coupon.usedCount / coupon.usageLimit) * 100;
                    const isExpiringSoon = () => {
                      const expiry = new Date(coupon.expiry);
                      const today = new Date();
                      const sevenDaysLater = new Date();
                      sevenDaysLater.setDate(today.getDate() + 7);
                      return expiry > today && expiry <= sevenDaysLater && coupon.status === "Active";
                    };

                    return (
                      <tr key={coupon.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-blue-50'} transition`}>
                        <td className="p-3">
                          <div className="font-mono font-bold text-blue-600">{coupon.code}</div>
                          <div className="text-xs text-gray-500">{coupon.category}</div>
                        </td>
                        <td className="p-3 font-bold">{coupon.discount}</td>
                        <td className="p-3">₹{coupon.min}</td>
                        <td className="p-3">
                          <div className="text-xs font-medium">{coupon.usedCount}/{coupon.usageLimit}</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className={`h-1.5 rounded-full ${progress >= 80 ? 'bg-red-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{progress.toFixed(1)}% used</div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${coupon.status === "Active" ? "bg-green-100 text-green-700" : coupon.status === "Expired" ? "bg-red-100 text-red-700" : coupon.status === "Upcoming" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                              {coupon.status}
                            </span>
                            {isExpiringSoon() && (
                              <span className="text-[9px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-bold">
                                Expiring Soon
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-gray-500 text-xs">{formatDateDisplay(coupon.expiry)}</div>
                          {isExpiringSoon() && (
                            <div className="text-[10px] text-orange-600 font-medium">
                              {Math.ceil((new Date(coupon.expiry) - new Date()) / (1000 * 60 * 60 * 24))} days left
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => copyCouponCode(coupon.code)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                              title="Copy Code"
                            >
                              <FaCopy className="text-xs"/>
                            </button>
                            <button 
                              onClick={() => editCoupon(coupon)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                              title="Edit"
                            >
                              <FaEdit className="text-xs"/>
                            </button>
                            <button 
                              onClick={() => toggleCouponStatus(coupon.id)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-yellow-600"
                              title={coupon.status === "Active" ? "Pause" : "Resume"}
                            >
                              {coupon.status === "Active" ? <FaPause className="text-xs"/> : <FaPlay className="text-xs"/>}
                            </button>
                            <button 
                              onClick={() => confirmDelete("coupon", coupon.id)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                              title="Delete"
                            >
                              <FaTrash className="text-xs"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- 2. RIGHT SIDE: OFFERS & PRODUCT VIEW --- */}
        <div className="space-y-6">
          
          {/* Active Offers */}
          <div>
            <h2 className="font-bold text-lg mb-4">Active Offers</h2>
            <div className="space-y-4">
              {offers.map(offer => (
                <div 
                  key={offer.id} 
                  className={`p-4 rounded-xl border-l-4 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} ${
                    offer.status === "Active" ? "border-l-green-500" : 
                    offer.status === "Upcoming" ? "border-l-yellow-500" : 
                    "border-l-red-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      offer.status === "Active" ? "bg-green-100 text-green-700" : 
                      offer.status === "Upcoming" ? "bg-yellow-100 text-yellow-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {offer.status}
                    </span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => editOffer(offer)}
                        className="text-gray-400 hover:text-blue-600 p-1"
                      >
                        <FaEdit/>
                      </button>
                      <button 
                        onClick={() => toggleOfferStatus(offer.id)}
                        className="text-gray-400 hover:text-yellow-600 p-1"
                      >
                        {offer.status === "Active" ? <FaPause/> : <FaPlay/>}
                      </button>
                      <button 
                        onClick={() => confirmDelete("offer", offer.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <FaTrash/>
                      </button>
                    </div>
                  </div>
                  {offer.bannerImage && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={offer.bannerImage} 
                        alt={offer.name} 
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x100/cccccc/666666?text=${encodeURIComponent(offer.name)}`;
                        }}
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-800">{offer.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{offer.desc}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {offer.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product-wise Offer View */}
          <div>
            <h2 className="font-bold text-lg mb-4">Product-wise Offers</h2>
            <div className="grid grid-cols-1 gap-3">
              {productOffers.map(product => (
                <div 
                  key={product.id} 
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaShoppingCart className="text-blue-600"/>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-green-600">{product.discount}</span>
                        <span className="text-xs text-gray-500">• {product.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        product.status === "Active" ? "bg-green-100 text-green-700" : 
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {product.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">Till {product.validTill}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}