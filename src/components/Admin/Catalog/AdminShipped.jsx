import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { 
  FaShippingFast, FaSearch, FaFilter, FaPlus, FaCalendarAlt, FaEdit, FaTrash, 
  FaMapMarkerAlt, FaPhoneAlt, FaBox, FaExclamationTriangle, FaExternalLinkAlt,
  FaChevronLeft, FaChevronRight 
} from "react-icons/fa";

// --- DUMMY DATA GENERATOR (25 Records) ---
const generateData = () => {
  const couriers = ["BlueDart", "Delhivery", "Ecom Express", "Flipkart"];
  const statuses = ["In Transit", "Delivered", "Shipped", "Returned", "Delayed"];
  const data = [];
  
  for (let i = 1; i <= 25; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    // Simulate delay logic: random chance
    const isDelayed = status === "In Transit" && Math.random() > 0.7; 
    
    data.push({
      id: `ORD-2026-${100 + i}`,
      customer: `Customer ${i}`,
      phone: `+91 98765 432${i < 10 ? '0'+i : i}`,
      address: `${i * 12}, Mg Road, Bangalore, KA`,
      product: i % 2 === 0 ? "Herbal Hair Oil (200ml)" : "Ayurvedic Face Cream",
      qty: Math.floor(Math.random() * 5) + 1,
      courier: couriers[i % 4],
      tracking: `TRK${8800 + i}IN`,
      weight: `${(Math.random() * 2).toFixed(1)} kg`,
      shipDate: `2026-01-${10 + (i%15)}`,
      status: isDelayed ? "Delayed" : status,
      risk: isDelayed ? "High" : "Low"
    });
  }
  return data;
};

export default function AdminShipped() {
  // --- STATES ---
  const [orders, setOrders] = useState(generateData());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- PAGINATION LOGIC ---
  const filteredData = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.tracking.toLowerCase().includes(search.toLowerCase()) || 
                          o.customer.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" ? true : o.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // --- HELPERS ---
  const getStatusStyle = (status) => {
    switch(status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Delayed": return "bg-red-100 text-red-700 border-red-200 animate-pulse";
      case "In Transit": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Returned": return "bg-gray-100 text-gray-700 border-gray-300";
      default: return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const trackPackage = (trackingId) => {
    alert(`Redirecting to courier partner website for ID: ${trackingId}`);
    // window.open(`https://courier-link.com/track/${trackingId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-6">
        <div>
           <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <FaShippingFast className="text-blue-600"/> Logistics & Shipments
           </h1>
           <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
             <strong>How Tracking Works:</strong> This system syncs with courier APIs every 2 hours. 
             Orders marked as <span className="text-red-600 font-bold">"Delayed"</span> indicate packages stuck at a hub for {'>'} 48 hours. 
             Use the <strong>Track</strong> button to see real-time location.
           </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2">
           <FaPlus/> Manual Shipment
        </button>
      </div>

      {/* --- STATS SUMMARY --- */}
      <div className="grid grid-cols-4 gap-4 mb-6">
         <div className="bg-white p-3 rounded-lg border shadow-sm">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Total Shipments</p>
            <p className="text-lg font-bold text-gray-800">{orders.length}</p>
         </div>
         <div className="bg-white p-3 rounded-lg border shadow-sm border-l-4 border-l-blue-500">
            <p className="text-[10px] font-bold text-gray-500 uppercase">In Transit</p>
            <p className="text-lg font-bold text-blue-600">{orders.filter(o => o.status === "In Transit").length}</p>
         </div>
         <div className="bg-white p-3 rounded-lg border shadow-sm border-l-4 border-l-red-500">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Action Required (Delayed)</p>
            <p className="text-lg font-bold text-red-600">{orders.filter(o => o.status === "Delayed").length}</p>
         </div>
         <div className="bg-white p-3 rounded-lg border shadow-sm border-l-4 border-l-green-500">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Delivered This Month</p>
            <p className="text-lg font-bold text-green-600">{orders.filter(o => o.status === "Delivered").length}</p>
         </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4 flex gap-4 items-center justify-between">
         <div className="relative w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"/>
            <input 
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Search Order ID, Tracking No, Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2">
            <select className="border rounded px-3 py-1.5 text-xs bg-gray-50 outline-none" onChange={(e) => setFilterStatus(e.target.value)}>
               <option value="All">All Status</option>
               <option>In Transit</option><option>Delivered</option><option>Delayed</option><option>Returned</option>
            </select>
         </div>
      </div>

      {/* --- DENSE TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                     <th className="p-3 w-10">#</th>
                     <th className="p-3">Order Details</th>
                     <th className="p-3">Customer Info</th>
                     <th className="p-3">Logistics Details</th>
                     <th className="p-3">Dates</th>
                     <th className="p-3">Live Status</th>
                     <th className="p-3 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-xs">
                  {currentItems.map((o, index) => (
                     <tr key={o.id} className="hover:bg-blue-50/20 transition">
                        
                        <td className="p-3 text-gray-400 font-mono">
                           {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>

                        <td className="p-3">
                           <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-blue-600 font-mono">{o.id}</span>
                              <span className="text-gray-600 truncate w-32" title={o.product}><FaBox className="inline mr-1 text-[10px]"/>{o.product}</span>
                              <span className="text-[10px] text-gray-400">Qty: {o.qty}</span>
                           </div>
                        </td>

                        <td className="p-3">
                           <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-gray-800">{o.customer}</span>
                              <span className="text-gray-500 flex items-center gap-1"><FaPhoneAlt className="text-[9px]"/> {o.phone}</span>
                              <span className="text-[10px] text-gray-400 truncate w-40" title={o.address}><FaMapMarkerAlt className="inline text-[9px] mr-1"/>{o.address}</span>
                           </div>
                        </td>

                        <td className="p-3">
                           <div className="flex flex-col gap-1">
                              <span className="font-bold text-gray-700">{o.courier}</span>
                              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded border w-fit text-gray-600">{o.tracking}</span>
                              <span className="text-[10px] text-gray-400">Wt: {o.weight}</span>
                           </div>
                        </td>

                        <td className="p-3">
                           <div className="flex flex-col">
                              <span className="text-gray-500">Shipped: <span className="text-gray-800 font-medium">{o.shipDate}</span></span>
                              <span className="text-gray-400 text-[10px]">Est: +3 Days</span>
                           </div>
                        </td>

                        <td className="p-3">
                           <div className="flex flex-col items-start gap-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusStyle(o.status)}`}>
                                 {o.status}
                              </span>
                              {o.status === "Delayed" && (
                                 <span className="flex items-center gap-1 text-[10px] text-red-600 font-bold bg-red-50 px-1 rounded">
                                    <FaExclamationTriangle/> Stuck 48h+
                                 </span>
                              )}
                           </div>
                        </td>

                        <td className="p-3 text-right">
                           <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => trackPackage(o.tracking)}
                                className="px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-bold hover:bg-blue-100 flex items-center gap-1"
                              >
                                 <FaExternalLinkAlt/> Track
                              </button>
                              <button className="p-1.5 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded"><FaEdit/></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* --- PAGINATION FOOTER --- */}
         <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center gap-4">
            <div className="text-xs text-gray-500">
               Showing <span className="font-bold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-bold">{filteredData.length}</span>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rows:</span>
                  <select 
                    value={rowsPerPage} 
                    onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1)}}
                    className="border rounded px-1 py-1 text-xs outline-none bg-white"
                  >
                     <option value={5}>5</option>
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                     <option value={50}>50</option>
                  </select>
               </div>

               <div className="flex gap-1">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                     <FaChevronLeft className="text-xs"/>
                  </button>
                  {Array.from({length: Math.min(5, totalPages)}, (_,i) => (
                     <button 
                        key={i} 
                        onClick={() => setCurrentPage(i+1)}
                        className={`w-6 h-6 text-xs font-bold rounded border ${currentPage === i+1 ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                     >
                        {i+1}
                     </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                     <FaChevronRight className="text-xs"/>
                  </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}