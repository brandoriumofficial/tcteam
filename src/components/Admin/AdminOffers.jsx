import React, { useState } from "react";
import { 
  FaGift, FaPlus, FaTrash, FaEdit, FaTags, FaShoppingBag, FaPercentage, FaCheckCircle, FaTimesCircle 
} from "react-icons/fa";

// --- DUMMY DATA ---
const initialOffers = [
  {
    id: 1,
    title: "Mega Deal: Buy 4 Get 1 Free",
    type: "BOGO",
    logic: "Buy 4 products from All Categories, Get 1 Free",
    code: "B4G1",
    status: "Active",
    validity: "2026-12-31"
  },
  {
    id: 2,
    title: "Free Gift on ₹300+",
    type: "Spend & Get",
    logic: "Spend above ₹300, Get 'Mini Face Wash' Free",
    code: "AUTO-APPLY",
    status: "Active",
    validity: "2026-06-30"
  },
  {
    id: 3,
    title: "Hair Care Trio",
    type: "Category Bundle",
    logic: "Buy any 3 items from Hair Care, Get Flat 20% Off",
    code: "HAIR20",
    status: "Inactive",
    validity: "2026-02-28"
  }
];

export default function AdminOffers() {
  
  const [offers, setOffers] = useState(initialOffers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // --- FORM STATE ---
  const [offerType, setOfferType] = useState("BOGO"); // BOGO | SPEND | BUNDLE
  const [formData, setFormData] = useState({
    title: "", code: "", validity: "", 
    buyQty: 4, getQty: 1, // For BOGO
    minAmount: 300, freeGift: "Mini Kit", // For Spend
    category: "Hair Care", catQty: 3, discount: 20 // For Bundle
  });

  // --- HANDLERS ---
  const openModal = (offer = null) => {
    if (offer) {
      setEditId(offer.id);
      // Logic to populate form would go here (simplified for demo)
      setFormData({ ...formData, title: offer.title, code: offer.code }); 
    } else {
      setEditId(null);
      setFormData({ 
        title: "", code: "", validity: "", 
        buyQty: 1, getQty: 1, minAmount: 0, freeGift: "", 
        category: "All", catQty: 1, discount: 0 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    let logicText = "";
    
    // Auto-Generate Logic Text based on Type
    if(offerType === "BOGO") {
        logicText = `Buy ${formData.buyQty} Get ${formData.getQty} Free`;
    } else if (offerType === "Spend & Get") {
        logicText = `Spend above ₹${formData.minAmount}, Get '${formData.freeGift}' Free`;
    } else {
        logicText = `Buy ${formData.catQty} from ${formData.category}, Get ${formData.discount}% Off`;
    }

    const newOffer = {
        id: editId || Date.now(),
        title: formData.title || `${offerType} Offer`,
        type: offerType,
        logic: logicText,
        code: formData.code || "AUTO",
        status: "Active",
        validity: formData.validity || "2026-12-31"
    };

    if(editId) {
        setOffers(prev => prev.map(o => o.id === editId ? newOffer : o));
    } else {
        setOffers([...offers, newOffer]);
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: o.status === "Active" ? "Inactive" : "Active" } : o));
  };

  const deleteOffer = (id) => {
    if(window.confirm("Delete this offer?")) setOffers(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaGift className="text-pink-600"/> Smart Offers & Bundles
           </h1>
           <p className="text-xs text-gray-500 mt-1">Create "Buy X Get Y", "Free Gifts", and "Combo Deals".</p>
        </div>
        <button onClick={() => openModal()} className="bg-pink-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-pink-700 shadow-lg flex items-center gap-2">
           <FaPlus/> Create New Offer
        </button>
      </div>

      {/* --- OFFER CARDS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden group hover:shadow-md transition">
               
               {/* Status Badge */}
               <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase ${offer.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {offer.status}
               </div>

               <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full text-xl flex-shrink-0 
                     ${offer.type === "BOGO" ? "bg-blue-50 text-blue-600" : 
                       offer.type === "Spend & Get" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"}`}>
                     {offer.type === "BOGO" ? <FaTags/> : offer.type === "Spend & Get" ? <FaGift/> : <FaShoppingBag/>}
                  </div>
                  
                  <div className="flex-1">
                     <h3 className="font-bold text-gray-800">{offer.title}</h3>
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{offer.type}</p>
                     
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                        <p className="text-sm text-gray-700 font-medium">"{offer.logic}"</p>
                     </div>

                     <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                           Code: <strong>{offer.code}</strong>
                        </span>
                        <span>Valid till: {offer.validity}</span>
                     </div>
                  </div>
               </div>

               {/* Actions */}
               <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={() => toggleStatus(offer.id)} className={`text-xs font-bold flex items-center gap-1 ${offer.status === "Active" ? "text-red-500" : "text-green-500"}`}>
                     {offer.status === "Active" ? <><FaTimesCircle/> Deactivate</> : <><FaCheckCircle/> Activate</>}
                  </button>
                  <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"><FaEdit/> Edit</button>
                  <button onClick={() => deleteOffer(offer.id)} className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline"><FaTrash/> Delete</button>
               </div>
            </div>
         ))}
      </div>

      {/* --- CREATE MODAL --- */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
               
               <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800 text-lg">Create Smart Offer</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">✖</button>
               </div>

               <div className="p-6 space-y-5">
                  
                  {/* Offer Title */}
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Campaign Title</label>
                     <input 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                        placeholder="e.g. Monsoon Special Deal"
                     />
                  </div>

                  {/* LOGIC SELECTOR */}
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Select Logic Type</label>
                     <div className="grid grid-cols-3 gap-2">
                        {["BOGO", "Spend & Get", "Category Bundle"].map(type => (
                           <button 
                              key={type}
                              onClick={() => setOfferType(type)}
                              className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition ${offerType === type ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                           >
                              {type}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* DYNAMIC FORM FIELDS */}
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                     
                     {/* 1. BOGO LOGIC */}
                     {offerType === "BOGO" && (
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase">Buy Quantity</label>
                              <input type="number" value={formData.buyQty} onChange={(e)=>setFormData({...formData, buyQty: e.target.value})} className="w-full border rounded p-2 text-sm"/>
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase">Get Free Qty</label>
                              <input type="number" value={formData.getQty} onChange={(e)=>setFormData({...formData, getQty: e.target.value})} className="w-full border rounded p-2 text-sm"/>
                           </div>
                           <div className="col-span-2 text-xs text-gray-500 italic">
                              *Logic: Customer adds {Number(formData.buyQty) + Number(formData.getQty)} items, pays for {formData.buyQty}.
                           </div>
                        </div>
                     )}

                     {/* 2. SPEND & GET LOGIC */}
                     {offerType === "Spend & Get" && (
                        <div className="space-y-3">
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase">Min Cart Amount (₹)</label>
                              <input type="number" value={formData.minAmount} onChange={(e)=>setFormData({...formData, minAmount: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="300"/>
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase">Free Product Name</label>
                              <input value={formData.freeGift} onChange={(e)=>setFormData({...formData, freeGift: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="Search Product..."/>
                           </div>
                        </div>
                     )}

                     {/* 3. CATEGORY BUNDLE */}
                     {offerType === "Category Bundle" && (
                        <div className="space-y-3">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="text-[10px] font-bold text-pink-700 uppercase">Category</label>
                                 <select value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full border rounded p-2 text-sm bg-white">
                                    <option>Hair Care</option><option>Skin Care</option><option>Oils</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[10px] font-bold text-pink-700 uppercase">Min Quantity</label>
                                 <input type="number" value={formData.catQty} onChange={(e)=>setFormData({...formData, catQty: e.target.value})} className="w-full border rounded p-2 text-sm"/>
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-pink-700 uppercase">Discount (%)</label>
                              <input type="number" value={formData.discount} onChange={(e)=>setFormData({...formData, discount: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="20"/>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Common Fields */}
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Promo Code</label>
                        <input value={formData.code} onChange={(e)=>setFormData({...formData, code: e.target.value})} className="w-full border rounded-lg p-2 text-sm uppercase" placeholder="Leave empty for Auto-Apply"/>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Validity</label>
                        <input type="date" value={formData.validity} onChange={(e)=>setFormData({...formData, validity: e.target.value})} className="w-full border rounded-lg p-2 text-sm"/>
                     </div>
                  </div>

                  <button onClick={handleSave} className="w-full bg-pink-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-pink-700 shadow-lg">
                     Save Offer
                  </button>

               </div>
            </div>
         </div>
      )}

    </div>
  );
}