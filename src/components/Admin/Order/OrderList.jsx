import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  FaEye, FaTrash, FaEdit, FaSearch, FaFilter, FaFileInvoiceDollar, 
  FaChevronLeft, FaChevronRight, FaBoxOpen 
} from "react-icons/fa";

// --- DUMMY DATA GENERATOR ---
const generateOrders = () => {
  const data = [];
  const statuses = ["Processing", "Completed", "Pending Payment", "Cancelled", "Shipped"];
  const payments = ["UPI", "COD", "Card", "Net Banking"];
  
  for(let i=1; i<=35; i++) {
    const hasCoupon = Math.random() > 0.5;
    data.push({
      id: `ORD-${202600 + i}`,
      date: `2026-01-${(i%30)+1}`,
      customer: {
        name: `Customer ${i}`,
        phone: `+91 98765 43${10+i}`,
        email: `cust${i}@mail.com`
      },
      products: [
        { name: i%2===0 ? "Herbal Hair Oil" : "Neem Face Wash", sku: i%2===0 ? "HO-001" : "FW-022", qty: Math.floor(Math.random()*3)+1 }
      ],
      moreItems: Math.floor(Math.random() * 2), // 0, 1 or 2 extra items
      financials: {
        total: (Math.random() * 2000 + 500).toFixed(0),
        discount: hasCoupon ? 150 : 0,
        coupon: hasCoupon ? `SAVE${10+i}` : null
      },
      payment: {
        method: payments[i % 4],
        status: i%3 === 0 ? "Paid" : "Pending"
      },
      status: statuses[i % 5]
    });
  }
  return data;
};

export default function OrderList() {
  
  const [orders, setOrders] = useState(generateOrders());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- FILTER & PAGINATION LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchSearch = 
        order.id.toLowerCase().includes(search.toLowerCase()) || 
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.phone.includes(search);
      
      const matchStatus = filterStatus === "All" ? true : order.status === filterStatus;
      
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  // Slicing data for current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // --- HANDLERS ---
  const deleteOrder = (id) => {
    if(window.confirm(`Are you sure you want to delete Order ${id}?`)) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  // --- HELPER: Status Colors ---
  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-200";
      case "Shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaFileInvoiceDollar className="text-blue-600"/> Order Management
           </h1>
           <p className="text-xs text-gray-500 mt-1">View, track and manage all customer orders.</p>
        </div>
        <Link to="/admin/order/new" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 transition">
           + Create Manual Order
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
         
         {/* Search */}
         <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"/>
            <input 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search by Order ID, Name, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>

         {/* Status Filter */}
         <div className="flex gap-3 w-full md:w-auto">
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
               <option value="All">All Status</option>
               <option value="Processing">Processing</option>
               <option value="Shipped">Shipped</option>
               <option value="Completed">Completed</option>
               <option value="Cancelled">Cancelled</option>
               <option value="Pending Payment">Pending Payment</option>
            </select>
         </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-gray-100 text-gray-600 uppercase text-[11px] font-bold border-b border-gray-200">
                  <tr>
                     <th className="p-4">Order ID & Date</th>
                     <th className="p-4">Customer Info</th>
                     <th className="p-4">Product Details</th>
                     <th className="p-4">Financials</th>
                     <th className="p-4">Payment</th>
                     <th className="p-4">Status</th>
                     <th className="p-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                  {currentRows.length > 0 ? currentRows.map((order) => (
                     <tr key={order.id} className="hover:bg-blue-50/20 transition">
                        
                        {/* 1. ID & Date */}
                        <td className="p-4">
                           <div className="flex flex-col">
                              <Link to={`/admin/order/${order.id}`} className="font-bold text-blue-600 font-mono hover:underline">{order.id}</Link>
                              <span className="text-[10px] text-gray-500 mt-1">{order.date}</span>
                           </div>
                        </td>

                        {/* 2. Customer */}
                        <td className="p-4">
                           <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-gray-800 text-xs">{order.customer.name}</span>
                              <span className="text-[10px] text-gray-500">{order.customer.phone}</span>
                              <span className="text-[10px] text-gray-400">{order.customer.email}</span>
                           </div>
                        </td>

                        {/* 3. Products */}
                        <td className="p-4">
                           <div className="flex items-start gap-2">
                              <div className="bg-gray-100 p-1.5 rounded text-gray-500"><FaBoxOpen/></div>
                              <div>
                                 <p className="text-xs font-medium text-gray-800">
                                    {order.products[0].name} <span className="text-gray-500">x{order.products[0].qty}</span>
                                 </p>
                                 <p className="text-[10px] text-gray-400 font-mono">SKU: {order.products[0].sku}</p>
                                 
                                 {/* Shows if more items exist */}
                                 {order.moreItems > 0 && (
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded-full">
                                       +{order.moreItems} More
                                    </span>
                                 )}
                              </div>
                           </div>
                        </td>

                        {/* 4. Financials (Coupon Logic) */}
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="font-bold text-gray-900">₹{order.financials.total}</span>
                              {order.financials.discount > 0 ? (
                                 <div className="flex flex-col mt-1">
                                    <span className="text-[10px] text-green-600">Saved: ₹{order.financials.discount}</span>
                                    <span className="text-[9px] bg-purple-50 text-purple-600 px-1 rounded border border-purple-100 w-fit">
                                       🎟 {order.financials.coupon}
                                    </span>
                                 </div>
                              ) : (
                                 <span className="text-[10px] text-gray-400">- No Coupon -</span>
                              )}
                           </div>
                        </td>

                        {/* 5. Payment */}
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-700">{order.payment.method}</span>
                              <span className={`text-[9px] uppercase font-bold w-fit px-1.5 rounded mt-1 ${order.payment.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                 {order.payment.status}
                              </span>
                           </div>
                        </td>

                        {/* 6. Order Status */}
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                              {order.status}
                           </span>
                        </td>

                        {/* 7. Actions */}
                        <td className="p-4 text-right">
                           <div className="flex justify-end gap-2">
                              <Link to={`/admin/order/${order.id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition" title="View / Edit">
                                 <FaEdit/>
                              </Link>
                              <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition" title="Delete">
                                 <FaTrash/>
                              </button>
                           </div>
                        </td>

                     </tr>
                  )) : (
                     <tr>
                        <td colSpan="7" className="p-8 text-center text-gray-400">No orders found matching your filters.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* PAGINATION FOOTER */}
         <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <div className="text-xs text-gray-500">
               Showing <span className="font-bold">{indexOfFirstRow + 1}-{Math.min(indexOfLastRow, filteredOrders.length)}</span> of <span className="font-bold">{filteredOrders.length}</span> orders
            </div>

            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rows:</span>
                  <select 
                    className="border rounded px-1 py-1 text-xs outline-none bg-white focus:border-blue-500"
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  >
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                     <option value={50}>50</option>
                  </select>
               </div>

               <div className="flex gap-1">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                  >
                     <FaChevronLeft className="text-xs"/>
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                     let page = i + 1;
                     if(totalPages > 5 && currentPage > 3) page = currentPage - 2 + i;
                     if(page > totalPages) return null;
                     return (
                        <button 
                           key={page} 
                           onClick={() => setCurrentPage(page)}
                           className={`w-7 h-7 text-xs font-bold rounded border transition ${currentPage === page ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"}`}
                        >
                           {page}
                        </button>
                     )
                  })}

                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 transition"
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