import React, { useState } from "react";
import { 
  FaCreditCard, FaSearch, FaFilter, FaPlus, FaDownload, FaEdit, FaCheck, FaTimes, FaFileInvoice 
} from "react-icons/fa";

// --- DUMMY DATA ---
const initialPayments = [
  { id: "ORD1021", customer: "Rahul Sharma", method: "COD", amount: 799, status: "Pending", date: "2026-01-12", codConfirmed: false },
  { id: "ORD1022", customer: "Anjali Verma", method: "UPI", amount: 1299, status: "Success", date: "2026-01-13", codConfirmed: true },
  { id: "ORD1023", customer: "Priya Singh", method: "Card", amount: 2499, status: "Failed", date: "2026-01-14", codConfirmed: false },
  { id: "ORD1024", customer: "Amit Kumar", method: "Net Banking", amount: 599, status: "Refunded", date: "2026-01-15", codConfirmed: false },
];

export default function AdminPayment() {
  
  // --- STATES ---
  const [payments, setPayments] = useState(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "", customer: "", method: "COD", amount: "", status: "Pending", date: "", codConfirmed: false
  });

  // Filters
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- HANDLERS ---
  
  // 1. Open Modal (Add)
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ id: "", customer: "", method: "COD", amount: "", status: "Pending", date: "", codConfirmed: false });
    setIsModalOpen(true);
  };

  // 2. Open Modal (Edit)
  const openEditModal = (payment) => {
    setIsEditMode(true);
    setFormData(payment);
    setIsModalOpen(true);
  };

  // 3. Save Payment (Add/Edit)
  const handleSave = () => {
    if (!formData.id || !formData.customer || !formData.amount) return alert("Please fill required fields");

    if (isEditMode) {
      setPayments(prev => prev.map(p => p.id === formData.id ? formData : p));
    } else {
      setPayments([...payments, formData]);
    }
    setIsModalOpen(false);
  };

  // 4. COD Confirm Toggle
  const toggleCOD = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, codConfirmed: !p.codConfirmed } : p));
  };

  // 5. Download Invoice
  const downloadInvoice = (id) => {
    alert(`Downloading Invoice for ${id}...`);
  };

  // 6. Filtering
  const filteredData = payments.filter(p => {
    const matchSearch = p.id.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase());
    const matchMethod = filterMethod === "All" ? true : p.method === filterMethod;
    const matchStatus = filterStatus === "All" ? true : p.status === filterStatus;
    return matchSearch && matchMethod && matchStatus;
  });

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch(status) {
      case "Success": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Failed": return "bg-red-100 text-red-700 border-red-200";
      case "Refunded": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaCreditCard className="text-blue-600"/> Payment Transactions
           </h1>
           <p className="text-sm text-gray-500">Manage orders, refunds, and invoices.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition"
        >
           <FaPlus/> Record Payment
        </button>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search Order ID or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-3 w-full md:w-auto">
            <select className="border rounded-lg px-3 py-2 text-sm bg-white outline-none" onChange={(e)=>setFilterMethod(e.target.value)}>
               <option value="All">All Methods</option>
               <option>COD</option>
               <option>UPI</option>
               <option>Card</option>
               <option>Net Banking</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm bg-white outline-none" onChange={(e)=>setFilterStatus(e.target.value)}>
               <option value="All">All Status</option>
               <option>Success</option>
               <option>Pending</option>
               <option>Failed</option>
               <option>Refunded</option>
            </select>
         </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-gray-100 text-gray-600 uppercase text-[11px] font-bold">
                  <tr>
                     <th className="p-4">Order ID</th>
                     <th className="p-4">Customer</th>
                     <th className="p-4">Method</th>
                     <th className="p-4">Amount</th>
                     <th className="p-4">Status</th>
                     <th className="p-4">Date</th>
                     <th className="p-4 text-center">COD Confirm</th>
                     <th className="p-4 text-center">Invoice</th>
                     <th className="p-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredData.map(p => (
                     <tr key={p.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-4 font-mono font-bold text-blue-600">{p.id}</td>
                        <td className="p-4 font-medium text-gray-800">{p.customer}</td>
                        <td className="p-4 text-gray-600">{p.method}</td>
                        <td className="p-4 font-bold text-gray-900">₹{p.amount}</td>
                        
                        {/* Status Badge */}
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(p.status)}`}>
                              {p.status}
                           </span>
                        </td>
                        
                        <td className="p-4 text-gray-500 text-xs">{p.date}</td>

                        {/* COD Confirm Button */}
                        <td className="p-4 text-center">
                           {p.method === "COD" ? (
                              <button 
                                onClick={() => toggleCOD(p.id)}
                                className={`px-3 py-1 rounded text-xs font-bold transition ${p.codConfirmed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                              >
                                {p.codConfirmed ? "Confirmed" : "Confirm"}
                              </button>
                           ) : (
                              <span className="text-gray-300">-</span>
                           )}
                        </td>

                        {/* Invoice Button */}
                        <td className="p-4 text-center">
                           <button onClick={() => downloadInvoice(p.id)} className="text-gray-500 hover:text-blue-600 transition" title="Download Invoice">
                              <FaFileInvoice className="text-lg"/>
                           </button>
                        </td>

                        {/* Edit Action */}
                        <td className="p-4 text-right">
                           <button onClick={() => openEditModal(p)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition" title="Edit">
                              <FaEdit/>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {filteredData.length === 0 && (
               <div className="p-8 text-center text-gray-400">No payments found.</div>
            )}
         </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
              
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800 text-lg">
                    {isEditMode ? "✏️ Edit Payment" : "➕ Add Payment"}
                 </h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">✖</button>
              </div>

              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Order ID</label>
                       <input 
                         value={formData.id} 
                         onChange={(e)=>setFormData({...formData, id: e.target.value})} 
                         className="w-full border rounded-lg p-2 text-sm uppercase" 
                         placeholder="ORD-XXX"
                         disabled={isEditMode} // Cannot change ID in edit
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                       <input 
                         type="date"
                         value={formData.date} 
                         onChange={(e)=>setFormData({...formData, date: e.target.value})} 
                         className="w-full border rounded-lg p-2 text-sm" 
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Customer Name</label>
                    <input 
                      value={formData.customer} 
                      onChange={(e)=>setFormData({...formData, customer: e.target.value})} 
                      className="w-full border rounded-lg p-2 text-sm" 
                      placeholder="e.g. Rahul Sharma" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Payment Method</label>
                       <select 
                         value={formData.method} 
                         onChange={(e)=>setFormData({...formData, method: e.target.value})} 
                         className="w-full border rounded-lg p-2 text-sm bg-white"
                       >
                          <option>COD</option><option>UPI</option><option>Card</option><option>Net Banking</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Amount (₹)</label>
                       <input 
                         type="number"
                         value={formData.amount} 
                         onChange={(e)=>setFormData({...formData, amount: e.target.value})} 
                         className="w-full border rounded-lg p-2 text-sm" 
                         placeholder="0.00" 
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                    <select 
                      value={formData.status} 
                      onChange={(e)=>setFormData({...formData, status: e.target.value})} 
                      className="w-full border rounded-lg p-2 text-sm bg-white"
                    >
                       <option>Pending</option><option>Success</option><option>Failed</option><option>Refunded</option>
                    </select>
                 </div>

                 <div className="pt-2 flex gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200">Cancel</button>
                    <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg">
                       {isEditMode ? "Update Transaction" : "Save Record"}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}