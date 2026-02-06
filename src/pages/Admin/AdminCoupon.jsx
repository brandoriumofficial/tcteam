import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { 
  FaTag, FaBullhorn, FaCalendarAlt, FaTrash, FaEdit, 
  FaPlus, FaSave, FaSearch, FaFilter, FaCopy, FaClock,
  FaPause, FaPlay, FaTimesCircle, FaSun, FaMoon, FaTimes
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from "../../api/coupen/apiService"; // Ensure this path is correct

// --- CONFIRM MODAL COMPONENT ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <FaTimesCircle className="text-red-600 text-xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Are you sure you want to delete this {type}? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function AdminCouponOffer() {
  
  // --- STATES ---
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("coupons");
  
  // Stats
  const [stats, setStats] = useState({
    activeCoupons: 0,
    expiringSoon: 0,
    expiredCoupons: 0,
    activeOffers: 0
  });

  // Data Lists
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);

  // Forms
  const [couponForm, setCouponForm] = useState({
    id: null, code: "", discount: "", discountType: "percentage", discountValue: "",
    min: "", category: "All Categories", product: "All Products", usageLimit: "",
    usedCount: 0, status: "Active", expiry: "", startDate: "", tags: []
  });

  const [offerForm, setOfferForm] = useState({
    id: null, name: "", desc: "", type: "Flat Discount", discount: "",
    category: "Hair Care", products: [], status: "Active",
    startDate: "", endDate: "", bannerImage: "", tags: [], priority: 1
  });

  // UI & Filters
  const [couponSearch, setCouponSearch] = useState("");
  const [couponFilter, setCouponFilter] = useState({ category: "All", status: "All", sortBy: "expiry" });
  const [offerSearch, setOfferSearch] = useState("");
  const [offerFilter, setOfferFilter] = useState({ category: "All", status: "All", sortBy: "priority" });

  // Calendar States
  const [showCouponCal, setShowCouponCal] = useState(false);
  const [showCouponStartCal, setShowCouponStartCal] = useState(false);
  const [showOfferStartCal, setShowOfferStartCal] = useState(false);
  const [showOfferEndCal, setShowOfferEndCal] = useState(false);
  const [activeTagInput, setActiveTagInput] = useState("");
  const [modal, setModal] = useState({ show: false, type: "", id: null });
  
  const calRef = useRef();
  const tagInputRef = useRef();

  // --- API FETCH FUNCTIONS ---

  const fetchCoupons = async () => {
    try {
      const data = await api.getCoupons();
      if (!Array.isArray(data)) {
        setCoupons([]);
        return;
      }
      
      const formatted = data.map(c => ({
        id: c.id,
        code: c.code,
        discountType: c.discount_type || c.discountType,
        discountValue: parseFloat(c.discount_value || c.discountValue) || 0,
        discount: (c.discount_type || c.discountType) === 'percentage' ? 
                  `${c.discount_value || c.discountValue}%` : 
                  `₹${c.discount_value || c.discountValue}`,
        min: c.min_purchase || c.minPurchase || 0,
        category: c.category || 'All',
        usageLimit: c.usage_limit || c.usageLimit || 100,
        usedCount: c.used_count || c.usedCount || 0,
        status: c.status || 'Active',
        expiry: c.expiry_date || c.expiryDate,
        startDate: c.start_date || c.startDate,
        tags: Array.isArray(c.tags) ? c.tags : (typeof c.tags === 'string' ? JSON.parse(c.tags) : []),
        createdAt: c.created_at || c.createdAt
      }));
      setCoupons(formatted);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupons");
    }
  };

  const fetchOffers = async () => {
    try {
      const data = await api.getOffers();
      if (!Array.isArray(data)) {
        setOffers([]);
        return;
      }
      
      const formatted = data.map(o => ({
        id: o.id,
        name: o.name,
        desc: o.description || o.desc,
        type: o.offer_type || o.type,
        discount: o.discount_details || o.discount,
        category: o.category || '',
        products: Array.isArray(o.products) ? o.products : (typeof o.products === 'string' ? JSON.parse(o.products) : []),
        status: o.status || 'Active',
        startDate: o.start_date || o.startDate,
        endDate: o.end_date || o.endDate,
        bannerImage: o.banner_image || o.bannerImage,
        tags: Array.isArray(o.tags) ? o.tags : (typeof o.tags === 'string' ? JSON.parse(o.tags) : []),
        priority: o.priority || 1,
        createdAt: o.created_at || o.createdAt
      }));
      setOffers(formatted);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchOffers();
  }, []);

  // Update Stats
  useEffect(() => {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    
    const activeCoupons = coupons.filter(c => c.status === "Active").length;
    const expiringSoon = coupons.filter(c => {
      if(!c.expiry) return false;
      const expiry = new Date(c.expiry);
      return expiry > today && expiry <= sevenDaysLater && c.status === "Active";
    }).length;
    
    setStats({
      activeCoupons,
      expiringSoon,
      expiredCoupons: coupons.filter(c => c.status === "Expired").length,
      activeOffers: offers.filter(o => o.status === "Active").length
    });
  }, [coupons, offers]);

  // Click outside listener for Calendar
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

  // --- HANDLERS ---

  // COUPON
  const handleCouponChange = (e) => {
    const { name, value } = e.target;
    setCouponForm(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === "discountType" && { discountValue: "" }) 
    }));
  };

  const saveCoupon = async () => {
    if (!couponForm.code.trim() || !couponForm.discountValue || !couponForm.expiry) {
      toast.error("Required: Code, Discount, Expiry");
      return;
    }

    try {
      await api.saveCoupon(couponForm);
      toast.success(couponForm.id ? "Coupon Updated!" : "Coupon Created!");
      setCouponForm({
        id: null, code: "", discount: "", discountType: "percentage", discountValue: "",
        min: "", category: "All Categories", product: "All Products", usageLimit: "",
        usedCount: 0, status: "Active", expiry: "", startDate: "", tags: []
      });
      fetchCoupons();
    } catch (error) {
      toast.error("Error saving coupon");
    }
  };

  const editCoupon = (coupon) => {
    setCouponForm(coupon);
    setActiveTab("coupons");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCouponStatus = async (id, currentStatus) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const updatedCoupon = { ...coupon, status: newStatus };
    try {
      await api.saveCoupon(updatedCoupon);
      toast.info(`Coupon ${newStatus.toLowerCase()}`);
      fetchCoupons();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // OFFER
  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setOfferForm(prev => ({ ...prev, [name]: value }));
  };

  const saveOffer = async () => {
    if (!offerForm.name.trim()) {
      toast.error("Offer name is required");
      return;
    }
    const dataToSend = {
      ...offerForm,
      products: offerForm.products.length ? offerForm.products : ["All Products"]
    };

    try {
      await api.saveOffer(dataToSend);
      toast.success(offerForm.id ? "Offer Updated!" : "Offer Created!");
      setOfferForm({
        id: null, name: "", desc: "", type: "Flat Discount", discount: "",
        category: "Hair Care", products: [], status: "Active",
        startDate: "", endDate: "", bannerImage: "", tags: [], priority: 1
      });
      fetchOffers();
    } catch (error) {
      toast.error("Error saving offer");
    }
  };

  const editOffer = (offer) => {
    setOfferForm(offer);
    setActiveTab("offers");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleOfferStatus = async (id, currentStatus) => {
    const offer = offers.find(o => o.id === id);
    if(!offer) return;
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const updatedOffer = { ...offer, status: newStatus };
    try {
      await api.saveOffer(updatedOffer);
      toast.info(`Offer ${newStatus.toLowerCase()}`);
      fetchOffers();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // DELETE
  const confirmDelete = (type, id) => {
    setModal({ show: true, type, id });
  };

  const handleDelete = async () => {
    try {
      if (modal.type === "coupon") {
        await api.deleteCoupon(modal.id);
        toast.success("Coupon deleted!");
        fetchCoupons();
      } else if (modal.type === "offer") {
        await api.deleteOffer(modal.id);
        toast.success("Offer deleted!");
        fetchOffers();
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
    setModal({ show: false, type: "", id: null });
  };

  // UTILS
  const addTag = (type) => {
    if (!activeTagInput.trim()) return;
    const newTag = activeTagInput.trim();
    if (type === "coupon") {
      if (!couponForm.tags.includes(newTag)) {
        setCouponForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
    } else {
      if (!offerForm.tags.includes(newTag)) {
        setOfferForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
    }
    setActiveTagInput("");
    tagInputRef.current?.focus();
  };

  const removeTag = (type, tagToRemove) => {
    if (type === "coupon") {
      setCouponForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    } else {
      setOfferForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 23:59:59`;
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.info(`Copied: ${code}`);
  };

  // FILTERS
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
                         coupon.category.toLowerCase().includes(couponSearch.toLowerCase());
    const matchesCategory = couponFilter.category === "All" || coupon.category === couponFilter.category;
    const matchesStatus = couponFilter.status === "All" || coupon.status === couponFilter.status;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch(couponFilter.sortBy) {
      case "expiry": return new Date(a.expiry) - new Date(b.expiry);
      case "discount": return (b.discountValue || 0) - (a.discountValue || 0);
      default: return 0;
    }
  });

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(offerSearch.toLowerCase());
    const matchesCategory = offerFilter.category === "All" || offer.category === offerFilter.category;
    const matchesStatus = offerFilter.status === "All" || offer.status === offerFilter.status;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if(offerFilter.sortBy === "priority") return a.priority - b.priority;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // --- RENDER ---
  return (
    <div className={`min-h-screen p-4 font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />
      <ConfirmModal isOpen={modal.show} onClose={() => setModal({ show: false, type: "", id: null })} onConfirm={handleDelete} type={modal.type} />

      {/* TOP SECTION */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <FaTag className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}/>
            <span className="hidden md:inline">Coupons & Offers</span> Admin
          </h1>
          {/* <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg shadow-sm ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-700'}`}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button> */}
        </div>

        {/* Stats Grid - Responsive 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<FaTag/>} color="green" title="Active Coupons" value={stats.activeCoupons} sub="Running" darkMode={darkMode}/>
          <StatCard icon={<FaBullhorn/>} color="purple" title="Active Offers" value={stats.activeOffers} sub="Campaigns" darkMode={darkMode}/>
          <StatCard icon={<FaClock/>} color="yellow" title="Expiring" value={stats.expiringSoon} sub="Next 7 days" darkMode={darkMode}/>
          <StatCard icon={<FaTimesCircle/>} color="red" title="Expired" value={stats.expiredCoupons} sub="Cleanup" darkMode={darkMode}/>
        </div>

        {/* Navigation Tabs - Scrollable on mobile */}
        <div className={`flex border-b overflow-x-auto ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <TabButton active={activeTab === "coupons"} onClick={() => setActiveTab("coupons")} icon={<FaTag/>} label="Coupons" count={coupons.length} darkMode={darkMode}/>
          <TabButton active={activeTab === "offers"} onClick={() => setActiveTab("offers")} icon={<FaBullhorn/>} label="Offers" count={offers.length} darkMode={darkMode}/>
        </div>
      </div>

      {/* --- COUPONS TAB --- */}
      {activeTab === "coupons" && (
        <div className="space-y-6">
          {/* Form */}
          <div className={`rounded-xl shadow-lg border p-4 md:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{couponForm.id ? "Edit Coupon" : "Create New"}</h2>
              {couponForm.id && <button onClick={() => setCouponForm({ id: null, code: "", discount: "", discountType: "percentage", discountValue: "", min: "", category: "All Categories", product: "All Products", usageLimit: "", status: "Active", expiry: "", startDate: "", tags: [] })} className="text-red-500 text-sm">Cancel</button>}
            </div>
            
            {/* Responsive Grid for Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <InputGroup label="Code" name="code" value={couponForm.code} onChange={handleCouponChange} darkMode={darkMode} />
               <div className="grid grid-cols-2 gap-2">
                 <SelectGroup label="Type" name="discountType" value={couponForm.discountType} onChange={handleCouponChange} options={[{val:"percentage", txt:"%"}, {val:"flat", txt:"Flat"}]} darkMode={darkMode} />
                 <InputGroup label="Value" name="discountValue" type="number" value={couponForm.discountValue} onChange={handleCouponChange} darkMode={darkMode} />
               </div>
               <InputGroup label="Min Purchase" name="min" type="number" value={couponForm.min} onChange={handleCouponChange} darkMode={darkMode} />
               <SelectGroup label="Category" name="category" value={couponForm.category} onChange={handleCouponChange} options={[{val:"All Categories", txt:"All"}, {val:"Hair Care", txt:"Hair"}, {val:"Skin Care", txt:"Skin"}]} darkMode={darkMode} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <DatePicker label="Start Date" value={couponForm.startDate} show={showCouponStartCal} setShow={setShowCouponStartCal} onChange={(d) => setCouponForm({...couponForm, startDate: formatDate(d)})} darkMode={darkMode} />
               <DatePicker label="Expiry Date" value={couponForm.expiry} show={showCouponCal} setShow={setShowCouponCal} onChange={(d) => setCouponForm({...couponForm, expiry: formatDate(d)})} darkMode={darkMode} />
            </div>

            <div className="mt-4">
              <TagInput tags={couponForm.tags} activeInput={activeTagInput} setActive={setActiveTagInput} addTag={() => addTag("coupon")} removeTag={(t) => removeTag("coupon", t)} darkMode={darkMode} />
              <button onClick={saveCoupon} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md">
                <FaSave className="inline mr-2"/> {couponForm.id ? "Update" : "Save"} Coupon
              </button>
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className={`rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
             <div className="overflow-x-auto"> {/* This enables horizontal scrolling on mobile */}
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className={`uppercase text-xs font-bold ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {filteredCoupons.map(c => (
                      <tr key={c.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                         <td className="p-3">
                           <div className="font-bold text-blue-500">{c.code}</div>
                           <div className="text-xs text-gray-400">{c.category}</div>
                         </td>
                         <td className="p-3 font-medium">{c.discount}</td>
                         <td className="p-3">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}>
                             {c.status}
                           </span>
                         </td>
                         <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => copyCouponCode(c.code)} className="p-2 bg-gray-100 rounded hover:bg-blue-100 text-gray-600"><FaCopy/></button>
                              <button onClick={() => editCoupon(c)} className="p-2 bg-gray-100 rounded hover:bg-green-100 text-gray-600"><FaEdit/></button>
                              <button onClick={() => toggleCouponStatus(c.id, c.status)} className="p-2 bg-gray-100 rounded hover:bg-yellow-100 text-gray-600">{c.status === "Active" ? <FaPause/> : <FaPlay/>}</button>
                              <button onClick={() => confirmDelete("coupon", c.id)} className="p-2 bg-gray-100 rounded hover:bg-red-100 text-red-500"><FaTrash/></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {/* --- OFFERS TAB --- */}
      {activeTab === "offers" && (
        <div className="space-y-6">
           <div className={`rounded-xl shadow-lg border p-4 md:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
             <h2 className="font-bold mb-4">{offerForm.id ? "Edit Offer" : "New Offer"}</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Name" name="name" value={offerForm.name} onChange={handleOfferChange} darkMode={darkMode} />
                <InputGroup label="Discount Detail" name="discount" value={offerForm.discount} onChange={handleOfferChange} darkMode={darkMode} />
                <InputGroup label="Category" name="category" value={offerForm.category} onChange={handleOfferChange} darkMode={darkMode} />
                
                {/* TextArea for Description */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                  <textarea 
                    name="desc"
                    value={offerForm.desc}
                    onChange={handleOfferChange}
                    className={`w-full border rounded-lg p-2 text-sm h-10 min-h-[40px] resize-y ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    placeholder="Offer details..."
                  />
                </div>
             </div>
             
             <div className="mt-4">
                <TagInput tags={offerForm.tags} activeInput={activeTagInput} setActive={setActiveTagInput} addTag={() => addTag("offer")} removeTag={(t) => removeTag("offer", t)} darkMode={darkMode} />
                <button onClick={saveOffer} className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 shadow-md">
                  <FaSave className="inline mr-2"/> {offerForm.id ? "Update" : "Save"} Offer
                </button>
             </div>
           </div>

           {/* Offers Grid - Stacks on mobile */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOffers.map(o => (
                <div key={o.id} className={`p-4 rounded-xl border border-l-4 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} ${o.status === 'Active' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="font-bold text-lg">{o.name}</h3>
                       <span className="text-xs text-gray-400">{o.category}</span>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => editOffer(o)} className="p-1.5 bg-gray-100 rounded hover:bg-blue-100"><FaEdit className="text-gray-600"/></button>
                       <button onClick={() => toggleOfferStatus(o.id, o.status)} className="p-1.5 bg-gray-100 rounded hover:bg-yellow-100">{o.status === "Active" ? <FaPause className="text-gray-600"/> : <FaPlay className="text-gray-600"/>}</button>
                       <button onClick={() => confirmDelete("offer", o.id)} className="p-1.5 bg-gray-100 rounded hover:bg-red-100"><FaTrash className="text-red-500"/></button>
                     </div>
                   </div>
                   <p className="text-sm text-gray-500 mt-2 line-clamp-2">{o.desc}</p>
                   <div className="mt-3 flex justify-between items-center bg-gray-50 p-2 rounded">
                     <span className="text-purple-600 font-bold">{o.discount}</span>
                     <span className={`text-xs px-2 py-1 rounded ${o.status==='Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{o.status}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

// --- HELPER COMPONENTS ---
const StatCard = ({icon, color, title, value, sub, darkMode}) => (
  <div className={`rounded-xl p-3 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600 shrink-0`}>{icon}</div>
      <div className="overflow-hidden">
        <p className="text-xs text-gray-500 truncate">{title}</p>
        <p className="text-xl font-bold truncate">{value}</p>
      </div>
    </div>
    <div className={`mt-1 text-[10px] text-${color}-600 font-medium`}>{sub}</div>
  </div>
);

const TabButton = ({active, onClick, icon, label, count, darkMode}) => (
  <button onClick={onClick} className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${active ? (darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-600') : 'border-transparent text-gray-400'}`}>
    {icon} {label} <span className="bg-gray-100 text-gray-600 px-2 rounded-full text-xs">{count}</span>
  </button>
);

const InputGroup = ({label, name, value, onChange, type="text", darkMode}) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
    <input name={name} value={value} onChange={onChange} type={type} className={`w-full border rounded-lg p-2 text-sm h-10 ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`} />
  </div>
);

const SelectGroup = ({label, name, value, onChange, options, darkMode}) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
    <select name={name} value={value} onChange={onChange} className={`w-full border rounded-lg p-2 text-sm h-10 ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
      {options.map(o => <option key={o.val} value={o.val}>{o.txt}</option>)}
    </select>
  </div>
);

const DatePicker = ({label, value, show, setShow, onChange, darkMode}) => (
  <div className="relative">
    <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
    <div className={`flex items-center border rounded-lg p-2 h-10 cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} onClick={() => setShow(!show)}>
      <input readOnly value={value} className={`w-full text-sm outline-none cursor-pointer bg-transparent`} />
      <FaCalendarAlt className="text-gray-400"/>
    </div>
    {show && <div className={`absolute top-full z-10 mt-1 shadow-xl border rounded-lg p-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}><Calendar onChange={(d) => {onChange(d); setShow(false);}} className={darkMode ? 'bg-gray-800 text-white' : ''}/></div>}
  </div>
);

const TagInput = ({tags, activeInput, setActive, addTag, removeTag, darkMode}) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase">Tags</label>
    <div className="flex gap-2 mt-1">
      <input value={activeInput} onChange={(e) => setActive(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTag()} className={`flex-1 border rounded-lg p-2 text-sm h-10 ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`} placeholder="Add tag..." />
      <button onClick={addTag} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm">Add</button>
    </div>
    <div className="flex gap-2 flex-wrap mt-2">
      {tags.map((tag, i) => <span key={i} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">{tag} <button onClick={() => removeTag(tag)}><FaTimes/></button></span>)}
    </div>
  </div>
);