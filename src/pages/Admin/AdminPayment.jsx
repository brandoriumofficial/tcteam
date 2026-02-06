import React, { useState, useEffect, useCallback } from "react";
import { 
  FaCreditCard, FaSearch, FaFilter, FaPlus, FaDownload, FaEdit, 
  FaCheck, FaTimes, FaFileInvoice, FaSync, FaRupeeSign, FaUser, FaPhone,FaClock 
} from "react-icons/fa";
import { API_URL } from "../../api/API_URL";

const API_BASE_URL = API_URL + "/admin/payments";

export default function AdminPayment() {
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    codPending: 0
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  // AdminPayment.jsx में loading state को fix करें
const fetchPayments = useCallback(async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      action: 'list',
      page: currentPage,
      limit: rowsPerPage,
      ...(filterMethod !== 'All' && { method: filterMethod }),
      ...(filterStatus !== 'All' && { status: filterStatus }),
      ...(search && { search: search })
    });

    const response = await fetch(`${API_BASE_URL}/payments_api.php?${params}`);
    const data = await response.json();
    
    if (data.success) {
      setPayments(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRows(data.pagination?.totalRows || 0);
    } else {
      console.error("Failed:", data.message);
      setPayments([]);
    }
  } catch (error) {
    console.error("Error:", error);
    setPayments([]);
  } finally {
    setLoading(false);
  }
}, [currentPage, rowsPerPage, filterMethod, filterStatus, search]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments_api.php?action=stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Stats error:", error);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [fetchPayments, fetchStats]);

  const confirmCOD = async (orderId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments_api.php?action=confirm-cod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId })
      });

      const data = await response.json();
      
      if (data.success) {
        setPayments(prev => prev.map(p => 
          p.id === orderId ? { ...p, codConfirmed: data.codConfirmed } : p
        ));
        alert(data.message);
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      console.error("COD error:", error);
      alert('Error confirming COD');
    }
  };

  const generateInvoice = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments_api.php?action=generate-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update invoice status
        setPayments(prev => prev.map(p => 
          p.id === orderId ? { ...p, invoice_generated: true } : p
        ));
        
        // Show invoice data
        alert(`Invoice generated!\nInvoice ID: ${data.invoice.invoice_id}\nAmount: ₹${data.invoice.amount}`);
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      console.error("Invoice error:", error);
      alert('Error generating invoice');
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments_api.php?action=update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          order_id: orderId,
          payment_status: newStatus
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setPayments(prev => prev.map(p => 
          p.id === orderId ? { ...p, status: newStatus } : p
        ));
        alert('Status updated successfully!');
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert('Error updating status');
    }
  };

  const openEditModal = (payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingPayment) return;

    try {
      const response = await fetch(`${API_BASE_URL}/payments_api.php?action=update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: editingPayment.id,
          payment_status: editingPayment.status,
          payment_method: editingPayment.method,
          order_status: editingPayment.order_status
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Payment updated successfully!');
        setIsModalOpen(false);
        setEditingPayment(null);
        fetchPayments();
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert('Error saving payment');
    }
  };

  const formatDate = (date) => {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
};


  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPayments();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filterMethod, filterStatus]);

  const getStatusColor = (status) => {
    switch(status) {
      case "Paid":
      case "Success": 
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending": 
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Failed": 
        return "bg-red-100 text-red-700 border-red-200";
      case "Refunded": 
        return "bg-gray-100 text-gray-700 border-gray-200";
      default: 
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const formatProducts = (products) => {
    if (!products) return 'No products';
    
    if (typeof products === 'string') {
      return products.length > 50 ? products.substring(0, 50) + '...' : products;
    }
    
    if (Array.isArray(products)) {
      const productNames = products.map(p => p.product_name).join(', ');
      return productNames.length > 50 ? productNames.substring(0, 50) + '...' : productNames;
    }
    
    return 'Products';
  };

  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

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
        <div className="flex gap-3">
          <button 
            onClick={() => { fetchPayments(); fetchStats(); }}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            <FaSync className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Transactions</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FaCreditCard className="text-xl"/>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Amount</p>
              <h3 className="text-2xl font-bold text-green-600 flex items-center gap-1">
                <FaRupeeSign className="text-lg"/> {stats.totalAmount.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <FaCheck className="text-xl"/>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">COD Pending</p>
              <h3 className="text-2xl font-bold text-orange-600">{stats.codPending}</h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <FaClock className="text-xl"/>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search Order ID, Customer, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
            value={filterMethod}
            onChange={(e) => {
              setFilterMethod(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Methods</option>
            <option value="COD">COD</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
          
          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading payments...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer Info</th>
                    <th className="p-4">Products</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">COD</th>
                    <th className="p-4 text-center">Invoice</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {payments.length > 0 ? payments.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition">
                      
                      <td className="p-4 font-mono font-bold text-blue-600">
                        {p.id}
                      </td>
                      
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="font-medium text-gray-800 flex items-center gap-1">
                            <FaUser className="text-xs text-gray-400"/> {p.customer}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <FaPhone className="text-xs"/> {p.customer_phone}
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-[150px]">
                            {p.customer_email}
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4 text-xs text-gray-600 max-w-[150px]">
                        {formatProducts(p.products_list || p.items)}
                      </td>
                      
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {p.method}
                        </span>
                      </td>
                      
                      <td className="p-4 font-bold text-gray-900">
                        <div className="flex flex-col">
                          <div>₹{p.amount}</div>
                          {p.discount_amount > 0 && (
                            <div className="text-xs text-green-600">
                              Disc: ₹{p.discount_amount}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <select 
                          value={p.status}
                          onChange={(e) => updatePaymentStatus(p.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border outline-none ${getStatusColor(p.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                      
                      <td className="p-4 text-gray-500 text-xs">
                        {formatDate(p.date)}
                      </td>

                      <td className="p-4 text-center">
                        {p.method === "COD" ? (
                          <button 
                            onClick={() => confirmCOD(p.id, p.codConfirmed)}
                            className={`px-3 py-1 rounded text-xs font-bold transition ${p.codConfirmed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                          >
                            {p.codConfirmed ? "Confirmed" : "Confirm"}
                          </button>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <button 
                          onClick={() => generateInvoice(p.id)}
                          className={`p-2 rounded-lg transition ${p.invoice_generated ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}`}
                          title={p.invoice_generated ? "Invoice Generated" : "Generate Invoice"}
                        >
                          <FaFileInvoice className="text-lg"/>
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <button 
                          onClick={() => openEditModal(p)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          title="Edit Payment"
                        >
                          <FaEdit/>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="10" className="p-8 text-center text-gray-400">
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              
              <div className="text-xs text-gray-500">
                Showing {startRow}-{endRow} of {totalRows} payments
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rows:</span>
                  <select 
                    className="border rounded px-1 py-1 text-xs outline-none bg-white focus:border-blue-500"
                    value={rowsPerPage}
                    onChange={(e) => { 
                      setRowsPerPage(Number(e.target.value)); 
                      setCurrentPage(1); 
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex gap-1">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page = i + 1;
                    if(totalPages > 5 && currentPage > 3) {
                      page = currentPage - 2 + i;
                    }
                    if(page > totalPages) return null;
                    
                    return (
                      <button 
                        key={page} 
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 text-xs font-bold rounded border transition ${
                          currentPage === page 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button 
                    disabled={currentPage === totalPages || totalPages === 0} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && editingPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">✏️ Edit Payment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">✖</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Order ID</label>
                  <input 
                    value={editingPayment.id}
                    disabled
                    className="w-full border rounded-lg p-2 text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                  <input 
                    type="date"
                    value={formatDate(editingPayment.date)}
                    onChange={(e) => setEditingPayment({...editingPayment, date: e.target.value})}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Customer</label>
                <input 
                  value={editingPayment.customer}
                  disabled
                  className="w-full border rounded-lg p-2 text-sm bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Payment Method</label>
                  <select 
                    value={editingPayment.method}
                    onChange={(e) => setEditingPayment({...editingPayment, method: e.target.value})}
                    className="w-full border rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="COD">COD</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Amount (₹)</label>
                  <input 
                    type="number"
                    value={editingPayment.amount}
                    disabled
                    className="w-full border rounded-lg p-2 text-sm bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Payment Status</label>
                  <select 
                    value={editingPayment.status}
                    onChange={(e) => setEditingPayment({...editingPayment, status: e.target.value})}
                    className="w-full border rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Order Status</label>
                  <select 
                    value={editingPayment.order_status}
                    onChange={(e) => setEditingPayment({...editingPayment, order_status: e.target.value})}
                    className="w-full border rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending Payment">Pending Payment</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700"
                >
                  Update Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}