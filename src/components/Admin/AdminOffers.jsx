import React, { useState, useEffect } from "react";
import { 
  FaGift, FaPlus, FaTrash, FaTags, FaShoppingBag, 
  FaCheckCircle, FaTimesCircle, FaPercentage, FaBoxOpen 
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { offerApi } from "../../api/coupen/offerApi";

// Product List for Dropdown
const productList = [
    { id: 101, name: "Mini Face Wash 50ml" },
    { id: 102, name: "Hair Oil Sample" },
    { id: 103, name: "Aloe Vera Gel" },
    { id: 104, name: "Travel Kit Pouch" },
    { id: 105, name: "Rose Water Spray" }
];

export default function AdminOffers() {
  
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- FORM STATE ---
  const [offerType, setOfferType] = useState("BOGO"); // BOGO | SPEND | BULK
  const [formData, setFormData] = useState({
    title: "", validity: "", 
    buyQty: 2, getQty: 1, // BOGO
    minAmount: 500, freeProduct: "", // Spend & Get
    bulkQty: 3, discount: 15 // Bulk Discount
  });

  // --- INITIAL LOAD ---
  const loadOffers = async () => {
    try {
      await offerApi.setup(); // Auto-create table
      const data = await offerApi.getAll();
      if(Array.isArray(data)) setOffers(data);
    } catch (error) {
      toast.error("Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadOffers(); }, []);

  // --- HANDLERS ---
  const openModal = () => {
    setFormData({ 
      title: "", validity: "", 
      buyQty: 1, getQty: 1, minAmount: 500, freeProduct: productList[0].name, 
      bulkQty: 3, discount: 10 
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if(!formData.title || !formData.validity) {
        toast.warning("Please fill Title and Validity date");
        return;
    }

    let logicText = "";
    
    // Logic Text Generation
    if(offerType === "BOGO") {
        logicText = `Buy ${formData.buyQty} Get ${formData.getQty} Free`;
    } else if (offerType === "SPEND") {
        if(!formData.freeProduct) { toast.warning("Select a product"); return; }
        logicText = `Free '${formData.freeProduct}' on orders above ₹${formData.minAmount}`;
    } else if (offerType === "BULK") {
        logicText = `Get ${formData.discount}% Off on buying ${formData.bulkQty} items`;
    }

    const payload = {
        ...formData,
        type: offerType,
        logic: logicText
    };

    try {
      await offerApi.create(payload);
      toast.success("Offer Created Successfully!");
      setIsModalOpen(false);
      loadOffers(); // Refresh list
    } catch (error) {
      toast.error("Error creating offer");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    
    // Optimistic UI Update
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));

    try {
      await offerApi.toggleStatus(id, newStatus);
      toast.info(`Offer is now ${newStatus}`);
    } catch (e) {
      toast.error("Status update failed");
      loadOffers(); // Revert on fail
    }
  };

  const deleteOffer = async (id) => {
    if(window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await offerApi.delete(id);
        setOffers(prev => prev.filter(o => o.id !== id));
        toast.success("Offer Deleted");
      } catch (e) {
        toast.error("Deletion failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaGift className="text-pink-600"/> Smart Offers Manager
           </h1>
           <p className="text-sm text-gray-500 mt-1">Manage BOGO, Free Gifts & Bulk Discounts</p>
        </div>
        <button onClick={openModal} className="bg-pink-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-pink-700 shadow-lg shadow-pink-200 flex items-center gap-2 transition-transform active:scale-95">
           <FaPlus/> Create Offer
        </button>
      </div>

      {/* --- CARDS GRID --- */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">Loading offers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden hover:shadow-md transition duration-300">
                 
                 {/* Status Badge */}
                 <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${offer.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {offer.status}
                 </div>
  
                 {/* Icon & Title */}
                 <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl text-xl shadow-sm
                       ${offer.type === "BOGO" ? "bg-blue-50 text-blue-600" : 
                         offer.type === "SPEND" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"}`}>
                       {offer.type === "BOGO" ? <FaTags/> : offer.type === "SPEND" ? <FaGift/> : <FaPercentage/>}
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{offer.type === 'SPEND' ? 'Spend & Get' : offer.type}</span>
                        <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2">{offer.title}</h3>
                    </div>
                 </div>
                 
                 {/* Logic Box */}
                 <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4 min-h-[60px] flex items-center">
                    <p className="text-sm text-gray-700 font-medium flex items-start gap-2">
                        <FaCheckCircle className="text-green-500 text-xs mt-1 flex-shrink-0"/> 
                        {offer.logic_display}
                    </p>
                 </div>

                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <FaBoxOpen/> Valid until: <span className="font-medium text-gray-700">{offer.validity}</span>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => toggleStatus(offer.id, offer.status)} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${offer.status === "Active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                       {offer.status === "Active" ? <><FaTimesCircle/> Deactivate</> : <><FaCheckCircle/> Activate</>}
                    </button>
                    <button onClick={() => deleteOffer(offer.id)} className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition">
                        <FaTrash/>
                    </button>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* --- MODAL --- */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
               
               <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800 text-lg">Create New Offer</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition text-xl">✖</button>
               </div>

               <div className="p-6 space-y-6">
                  
                  {/* Title */}
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Offer Title</label>
                     <input 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition" 
                        placeholder="Ex: Monsoon Sale"
                     />
                  </div>

                  {/* Logic Type Tabs */}
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Offer Logic</label>
                     <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
                        {[
                           {id:"BOGO", label:"Buy X Get Y"}, 
                           {id:"SPEND", label:"Spend & Get"}, 
                           {id:"BULK", label:"Bulk Discount"}
                        ].map(t => (
                           <button 
                              key={t.id}
                              onClick={() => setOfferType(t.id)}
                              className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all shadow-sm ${offerType === t.id ? "bg-white text-pink-600 ring-1 ring-black/5" : "text-gray-500 hover:bg-gray-200 shadow-none"}`}
                           >
                              {t.label}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* DYNAMIC FIELDS CONTAINER */}
                  <div className="bg-pink-50/50 p-5 rounded-xl border border-pink-100 space-y-4">
                     
                     {/* 1. BOGO LOGIC */}
                     {offerType === "BOGO" && (
                        <div className="flex items-center gap-4">
                           <div className="flex-1">
                              <label className="text-[10px] font-bold text-pink-700 uppercase block mb-1">Buy Qty</label>
                              <input type="number" value={formData.buyQty} onChange={(e)=>setFormData({...formData, buyQty: e.target.value})} className="w-full border-pink-200 rounded-lg p-2.5 text-sm focus:ring-pink-500"/>
                           </div>
                           <span className="text-pink-300 font-bold mt-4">+</span>
                           <div className="flex-1">
                              <label className="text-[10px] font-bold text-pink-700 uppercase block mb-1">Get Free Qty</label>
                              <input type="number" value={formData.getQty} onChange={(e)=>setFormData({...formData, getQty: e.target.value})} className="w-full border-pink-200 rounded-lg p-2.5 text-sm focus:ring-pink-500"/>
                           </div>
                        </div>
                     )}

                     {/* 2. SPEND & GET LOGIC */}
                     {offerType === "SPEND" && (
                        <>
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase block mb-1">Min Order Value (₹)</label>
                              <input type="number" value={formData.minAmount} onChange={(e)=>setFormData({...formData, minAmount: e.target.value})} className="w-full border-pink-200 rounded-lg p-2.5 text-sm"/>
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase block mb-1">Select Free Product</label>
                              <div className="relative">
                                <select 
                                    value={formData.freeProduct} 
                                    onChange={(e)=>setFormData({...formData, freeProduct: e.target.value})} 
                                    className="w-full border-pink-200 rounded-lg p-2.5 text-sm bg-white appearance-none cursor-pointer"
                                >
                                    <option value="">-- Choose Product --</option>
                                    {productList.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                                <FaShoppingBag className="absolute right-3 top-3 text-pink-300 pointer-events-none"/>
                              </div>
                           </div>
                        </>
                     )}

                     {/* 3. BULK DISCOUNT */}
                     {offerType === "BULK" && (
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase block mb-1">Min Quantity</label>
                              <input type="number" value={formData.bulkQty} onChange={(e)=>setFormData({...formData, bulkQty: e.target.value})} className="w-full border-pink-200 rounded-lg p-2.5 text-sm"/>
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase block mb-1">Discount %</label>
                              <div className="relative">
                                <input type="number" value={formData.discount} onChange={(e)=>setFormData({...formData, discount: e.target.value})} className="w-full border-pink-200 rounded-lg p-2.5 text-sm pl-8"/>
                                <FaPercentage className="absolute left-3 top-3 text-pink-300 text-xs"/>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Validity */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Valid Until</label>
                    <input type="date" value={formData.validity} onChange={(e)=>setFormData({...formData, validity: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 text-sm"/>
                  </div>

                  <button onClick={handleSave} className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-pink-700 shadow-lg shadow-pink-200 transition active:scale-95">
                     Save Offer
                  </button>

               </div>
            </div>
         </div>
      )}

    </div>
  );
}