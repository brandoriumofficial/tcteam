import React, { useState, useMemo } from "react";
import { 
  FaUsers, FaGift, FaChartLine, FaCheckCircle, FaTimesCircle, FaEdit, 
  FaTrash, FaPlus, FaSearch, FaFilter, FaInfoCircle, FaSave, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";

// --- DUMMY DATA GENERATOR ---
const generateData = () => {
  const data = [];
  const statuses = ["Completed", "Pending", "Cancelled"];
  const rewards = ["Approved", "Pending", "Rejected"];
  
  for(let i=1; i<=35; i++) {
    data.push({
      id: i,
      referrer: `User ${i}`,
      referred: `Friend ${i}`,
      code: `REF${1000+i}`,
      orderStatus: statuses[i%3],
      rewardStatus: rewards[i%3],
      date: `2026-01-${(i%30)+1}`,
      amount: (Math.random() * 500).toFixed(0)
    });
  }
  return data;
};

export default function AdminReferral() {
  
  // --- STATES ---
  const [referralList, setReferralList] = useState(generateData());
  const [isReferralSystemEnabled, setIsReferralSystemEnabled] = useState(true);
  
  // Rules State
  const [rules, setRules] = useState({
    type: "Flat Discount",
    value: 100,
    minOrder: 499,
    validity: "30 Days",
    category: "All Products"
  });

  // Pagination & Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    referrer: "", referred: "", code: "", orderStatus: "Pending", rewardStatus: "Pending", date: "", amount: ""
  });

  // --- PAGINATION LOGIC ---
  const filteredData = useMemo(() => {
    return referralList.filter(r => {
      const matchSearch = r.referrer.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" ? true : r.rewardStatus === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [referralList, search, filterStatus]);

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // --- HANDLERS ---
  
  // Save Rule
  const saveRules = () => alert("Referral Rules Updated Successfully!");

  // Open Modal (Add/Edit)
  const openModal = (referral = null) => {
    if (referral) {
      setEditId(referral.id);
      setFormData(referral);
    } else {
      setEditId(null);
      setFormData({ referrer: "", referred: "", code: "", orderStatus: "Pending", rewardStatus: "Pending", date: new Date().toISOString().split('T')[0], amount: "" });
    }
    setIsModalOpen(true);
  };

  // Save Referral (Add/Edit)
  const handleSave = () => {
    if (!formData.referrer || !formData.code) return alert("Fill required fields");
    
    if (editId) {
      setReferralList(prev => prev.map(r => r.id === editId ? { ...formData, id: editId } : r));
    } else {
      setReferralList(prev => [{ ...formData, id: Date.now() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Delete
  const handleDelete = (id) => {
    if(window.confirm("Delete this record?")) setReferralList(prev => prev.filter(r => r.id !== id));
  };

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": case "Completed": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Rejected": case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaGift className="text-purple-600"/> Referral Program
           </h1>
           <p className="text-xs text-gray-500 mt-1">Manage rewards, track referrals, and configure rules.</p>
        </div>
        <div className="flex items-center gap-4">
           {/* System Toggle */}
           <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
              <span className="text-xs font-bold text-gray-600">System Status:</span>
              <button 
                onClick={() => setIsReferralSystemEnabled(!isReferralSystemEnabled)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${isReferralSystemEnabled ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"}`}
              >
                <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
              </button>
              <span className={`text-xs font-bold ${isReferralSystemEnabled ? "text-green-600" : "text-gray-400"}`}>
                {isReferralSystemEnabled ? "ON" : "OFF"}
              </span>
           </div>
           
           <button 
             onClick={() => openModal()}
             disabled={!isReferralSystemEnabled}
             className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 shadow-lg flex items-center gap-2 disabled:opacity-50"
           >
              <FaPlus/> Add Referral
           </button>
        </div>
      </div>

      {/* --- STATS & RULES GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         
         {/* Stats Cards */}
         <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
               <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total Referrals</p>
               <h3 className="text-2xl font-bold text-blue-600">{referralList.length}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-green-500">
               <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Approved</p>
               <h3 className="text-2xl font-bold text-green-600">{referralList.filter(r=>r.rewardStatus==="Approved").length}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-yellow-500">
               <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Pending Payouts</p>
               <h3 className="text-2xl font-bold text-yellow-600">{referralList.filter(r=>r.rewardStatus==="Pending").length}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-purple-500">
               <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total Rewards</p>
               <h3 className="text-2xl font-bold text-purple-600">₹{(referralList.length * 50).toLocaleString()}</h3>
            </div>
            
            {/* How it Works Info */}
            <div className="col-span-2 md:col-span-4 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
               <FaInfoCircle className="text-blue-600 text-xl mt-1 flex-shrink-0"/>
               <div>
                  <h4 className="font-bold text-sm text-blue-800">How Referral Works?</h4>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                     1. Existing user shares their unique code (e.g. REF1001). <br/>
                     2. New user signs up & places an order above the <strong>Min Order Value</strong>. <br/>
                     3. Once order is <strong>Completed</strong>, Reward status automatically becomes <strong>Approved</strong>.
                  </p>
               </div>
            </div>
         </div>

         {/* Rules Configuration */}
         <div className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition ${!isReferralSystemEnabled ? "opacity-50 pointer-events-none" : ""}`}>
            <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2"><FaEdit/> Configuration</h3>
            <div className="space-y-3">
               <div className="grid grid-cols-2 gap-3">
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase">Reward Type</label>
                     <select className="w-full border rounded p-1.5 text-xs bg-white" value={rules.type} onChange={(e)=>setRules({...rules, type: e.target.value})}>
                        <option>Flat Discount</option><option>% Commission</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase">Value</label>
                     <input type="number" className="w-full border rounded p-1.5 text-xs" value={rules.value} onChange={(e)=>setRules({...rules, value: e.target.value})}/>
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Min Order Amount (₹)</label>
                  <input type="number" className="w-full border rounded p-1.5 text-xs" value={rules.minOrder} onChange={(e)=>setRules({...rules, minOrder: e.target.value})}/>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Reward Validity</label>
                  <select className="w-full border rounded p-1.5 text-xs bg-white" value={rules.validity} onChange={(e)=>setRules({...rules, validity: e.target.value})}>
                     <option>30 Days</option><option>60 Days</option><option>Lifetime</option>
                  </select>
               </div>
               <button onClick={saveRules} className="w-full bg-gray-800 text-white py-2 rounded-lg text-xs font-bold hover:bg-black transition">Save Rules</button>
            </div>
         </div>

      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         
         {/* Table Header / Filter */}
         <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">Referral History</h3>
            <div className="flex gap-3 w-full md:w-auto">
               <div className="relative w-full md:w-64">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"/>
                  <input className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:border-purple-500" placeholder="Search referrer, code..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
               </div>
               <select className="border rounded-lg px-2 py-1.5 text-xs outline-none bg-white" onChange={(e)=>setFilterStatus(e.target.value)}>
                  <option value="All">All Status</option><option>Approved</option><option>Pending</option><option>Rejected</option>
               </select>
            </div>
         </div>

         {/* Dense Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] font-bold">
                  <tr>
                     <th className="p-3">#</th>
                     <th className="p-3">User Details</th>
                     <th className="p-3">Code / Date</th>
                     <th className="p-3">Order Status</th>
                     <th className="p-3">Reward Status</th>
                     <th className="p-3">Reward Amt</th>
                     <th className="p-3 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-xs">
                  {currentItems.map((r, i) => (
                     <tr key={r.id} className="hover:bg-purple-50/20 transition">
                        <td className="p-3 text-gray-400 font-mono">{(currentPage - 1) * rowsPerPage + i + 1}</td>
                        <td className="p-3">
                           <div className="flex flex-col">
                              <span className="font-bold text-gray-800">From: {r.referrer}</span>
                              <span className="text-gray-500">To: {r.referred}</span>
                           </div>
                        </td>
                        <td className="p-3">
                           <div className="flex flex-col">
                              <span className="font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded w-fit border">{r.code}</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">{r.date}</span>
                           </div>
                        </td>
                        <td className="p-3">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusColor(r.orderStatus)}`}>
                              Order: {r.orderStatus}
                           </span>
                        </td>
                        <td className="p-3">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusColor(r.rewardStatus)}`}>
                              Reward: {r.rewardStatus}
                           </span>
                        </td>
                        <td className="p-3 font-bold text-gray-800">₹{r.amount || rules.value}</td>
                        <td className="p-3 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={()=>openModal(r)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition"><FaEdit/></button>
                              <button onClick={()=>handleDelete(r.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded transition"><FaTrash/></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         <div className="bg-white px-4 py-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-xs text-gray-500">
               Showing <span className="font-bold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)}</span> of {filteredData.length}
            </div>
            <div className="flex items-center gap-3">
               <select className="border rounded px-1 py-1 text-xs" value={rowsPerPage} onChange={(e)=>{setRowsPerPage(Number(e.target.value)); setCurrentPage(1)}}>
                  <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
               </select>
               <div className="flex gap-1">
                  <button disabled={currentPage===1} onClick={()=>setCurrentPage(c=>c-1)} className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"><FaChevronLeft className="text-xs"/></button>
                  <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(c=>c+1)} className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"><FaChevronRight className="text-xs"/></button>
               </div>
            </div>
         </div>

      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">{editId ? "Edit Referral" : "Add New Referral"}</h3>
                  <button onClick={()=>setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">✖</button>
               </div>
               <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Referrer Name</label>
                        <input value={formData.referrer} onChange={(e)=>setFormData({...formData, referrer: e.target.value})} className="w-full border rounded p-2 text-xs"/>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Referred Name</label>
                        <input value={formData.referred} onChange={(e)=>setFormData({...formData, referred: e.target.value})} className="w-full border rounded p-2 text-xs"/>
                     </div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase">Referral Code</label>
                     <input value={formData.code} onChange={(e)=>setFormData({...formData, code: e.target.value})} className="w-full border rounded p-2 text-xs uppercase"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Order Status</label>
                        <select value={formData.orderStatus} onChange={(e)=>setFormData({...formData, orderStatus: e.target.value})} className="w-full border rounded p-2 text-xs bg-white">
                           <option>Pending</option><option>Completed</option><option>Cancelled</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Reward Status</label>
                        <select value={formData.rewardStatus} onChange={(e)=>setFormData({...formData, rewardStatus: e.target.value})} className="w-full border rounded p-2 text-xs bg-white">
                           <option>Pending</option><option>Approved</option><option>Rejected</option>
                        </select>
                     </div>
                  </div>
                  <button onClick={handleSave} className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-purple-700 transition mt-2">Save Record</button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}