import React, { useState } from "react";
import { 
  FaUser, FaBoxOpen, FaTrash, FaPlus, FaSave, FaMoneyBillWave, 
  FaCreditCard, FaGooglePay, FaUniversity, FaMapMarkerAlt 
} from "react-icons/fa";

// --- DUMMY PRODUCTS DATABASE ---
const PRODUCTS_DB = [
  { id: 1, name: "Herbal Amla Oil", sku: "HO-001", oldPrice: 499, newPrice: 349, stock: 50 },
  { id: 2, name: "Ayurvedic Face Cream", sku: "FC-022", oldPrice: 899, newPrice: 699, stock: 30 },
  { id: 3, name: "Sandalwood Soap", sku: "SO-101", oldPrice: 150, newPrice: 99, stock: 100 },
  { id: 4, name: "Kumkumadi Tailam", sku: "KT-500", oldPrice: 1200, newPrice: 999, stock: 15 },
];

export default function AdminOrder() {
  
  // --- STATES ---
  
  // 1. Customer Details
  const [customer, setCustomer] = useState({
    name: "", phone: "", email: "", address: "", pincode: "", city: ""
  });

  // 2. Order Items
  const [items, setItems] = useState([]);

  // 3. Payment & Status
  const [payment, setPayment] = useState({ method: "COD", status: "Pending", txnId: "" });
  const [orderStatus, setOrderStatus] = useState("Pending Payment");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

  // --- HANDLERS ---

  // Handle Customer Inputs
  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // Add Empty Row
  const addRow = () => {
    setItems([...items, { id: Date.now(), productId: "", name: "", sku: "", oldPrice: 0, newPrice: 0, qty: 1, total: 0 }]);
  };

  // Update Item Logic (The Magic Happens Here)
  const updateRow = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        let updates = { [field]: value };

        // IF PRODUCT SELECTED -> Auto-fill Prices
        if (field === "productId") {
          const prod = PRODUCTS_DB.find(p => p.id === Number(value));
          if (prod) {
            updates = { 
              productId: prod.id, 
              name: prod.name, 
              sku: prod.sku, 
              oldPrice: prod.oldPrice, 
              newPrice: prod.newPrice,
              total: prod.newPrice * item.qty 
            };
          }
        }

        // IF QTY CHANGED -> Update Total
        if (field === "qty") {
          updates.total = item.newPrice * Number(value);
        }

        return { ...item, ...updates };
      }
      return item;
    }));
  };

  // Remove Item
  const removeRow = (id) => setItems(prev => prev.filter(i => i.id !== id));

  // Totals Calculation
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const totalSavings = items.reduce((acc, item) => acc + ((item.oldPrice - item.newPrice) * item.qty), 0);
  const grandTotal = subtotal; // Tax can be added here if needed

  // Save Order
  const handleSave = () => {
    if(!customer.name || !customer.phone) return alert("Customer Name & Phone are required!");
    if(items.length === 0) return alert("Add at least one product!");

    const finalOrder = {
      customer,
      items,
      payment,
      orderStatus,
      date: orderDate,
      financials: { subtotal, totalSavings, grandTotal }
    };

    console.log("Saving Order:", finalOrder);
    alert("Order Created Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
            <p className="text-xs text-gray-500">Manual order entry for phone/whatsapp orders.</p>
         </div>
         <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-700 flex items-center gap-2 transition">
            <FaSave/> Save Order
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* ================= LEFT COLUMN: PRODUCTS & BILLING ================= */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* 1. PRODUCT ENTRY */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2"><FaBoxOpen/> Order Items</h3>
                  <button onClick={addRow} className="text-blue-600 text-xs font-bold hover:underline">+ Add Product</button>
               </div>
               
               <div className="p-4">
                  <table className="w-full text-left text-sm">
                     <thead className="text-gray-500 uppercase text-[10px] font-bold border-b">
                        <tr>
                           <th className="py-2 w-5/12">Product Name</th>
                           <th className="py-2 w-2/12">Unit Price</th>
                           <th className="py-2 w-2/12">Qty</th>
                           <th className="py-2 w-2/12 text-right">Total</th>
                           <th className="py-2 w-1/12 text-center"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                           <tr key={item.id}>
                              <td className="py-3 pr-2">
                                 <select 
                                   className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                   value={item.productId}
                                   onChange={(e) => updateRow(item.id, "productId", e.target.value)}
                                 >
                                    <option value="">Select Product...</option>
                                    {PRODUCTS_DB.map(p => (
                                       <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>
                                    ))}
                                 </select>
                                 {item.sku && <p className="text-[10px] text-gray-400 mt-1 pl-1">SKU: {item.sku}</p>}
                              </td>
                              
                              <td className="py-3">
                                 <div className="flex flex-col">
                                    {/* PRICE LOGIC: Old Price Cut, New Price Bold */}
                                    {item.newPrice > 0 ? (
                                       <>
                                          <span className="font-bold text-gray-800">₹{item.newPrice}</span>
                                          {item.oldPrice > item.newPrice && (
                                             <span className="text-[10px] text-gray-400 line-through">₹{item.oldPrice}</span>
                                          )}
                                       </>
                                    ) : (
                                       <span className="text-gray-400">-</span>
                                    )}
                                 </div>
                              </td>

                              <td className="py-3">
                                 <input 
                                   type="number" min="1" 
                                   className="w-16 border rounded-lg p-1.5 text-center text-sm"
                                   value={item.qty}
                                   onChange={(e) => updateRow(item.id, "qty", Number(e.target.value))}
                                 />
                              </td>

                              <td className="py-3 text-right font-bold text-blue-600">
                                 ₹{item.total}
                              </td>

                              <td className="py-3 text-center">
                                 <button onClick={()=>removeRow(item.id)} className="text-red-400 hover:text-red-600 p-1"><FaTrash/></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  
                  {items.length === 0 && (
                     <div className="text-center p-6 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg mt-2">
                        No items added. Click "+ Add Product" to start.
                     </div>
                  )}
               </div>
            </div>

            {/* 2. TOTALS & CALCULATIONS */}
            <div className="flex justify-end">
               <div className="w-full md:w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between text-gray-600">
                        <span>Items Total</span>
                        <span>₹{subtotal}</span>
                     </div>
                     <div className="flex justify-between text-green-600">
                        <span>Total Savings (Festival Offer)</span>
                        <span>- ₹{totalSavings}</span>
                     </div>
                     <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Grand Total to Pay</span>
                        <span>₹{grandTotal}</span>
                     </div>
                  </div>
               </div>
            </div>

         </div>

         {/* ================= RIGHT COLUMN: CUSTOMER & PAYMENT ================= */}
         <div className="lg:col-span-1 space-y-6">
            
            {/* 1. CUSTOMER DETAILS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><FaUser className="text-blue-500"/> Customer Details</h3>
               <div className="space-y-3">
                  <input name="name" onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Full Name *" />
                  <input name="phone" onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Phone Number *" />
                  <input name="email" onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Email Address (Optional)" />
                  
                  <div className="border-t pt-3">
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Shipping Address</label>
                     <textarea name="address" onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" rows="2" placeholder="Street Address, Area..."></textarea>
                     <div className="grid grid-cols-2 gap-2 mt-2">
                        <input name="pincode" onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Pincode" />
                        <input name="city" onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="City" />
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. PAYMENT DETAILS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><FaMoneyBillWave className="text-green-500"/> Payment Info</h3>
               
               {/* Payment Method Selector */}
               <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                     { id: "COD", label: "COD", icon: <FaMoneyBillWave/> },
                     { id: "UPI", label: "UPI / GPay", icon: <FaGooglePay/> },
                     { id: "Card", label: "Card", icon: <FaCreditCard/> },
                     { id: "NetBanking", label: "Net Bank", icon: <FaUniversity/> }
                  ].map(m => (
                     <button 
                       key={m.id}
                       onClick={() => setPayment({ ...payment, method: m.id })}
                       className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition
                         ${payment.method === m.id ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                     >
                        <span className="text-lg mb-1">{m.icon}</span>
                        {m.label}
                     </button>
                  ))}
               </div>

               {/* Transaction ID (If not COD) */}
               {payment.method !== "COD" && (
                  <div className="mb-4 animate-fadeIn">
                     <label className="text-[10px] font-bold text-gray-500 uppercase">Transaction ID</label>
                     <input 
                        className="w-full border rounded-lg p-2 text-sm bg-gray-50" 
                        placeholder="e.g. UPI-123456789"
                        onChange={(e) => setPayment({...payment, txnId: e.target.value})}
                     />
                  </div>
               )}

               <div className="grid grid-cols-2 gap-3">
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase">Order Date</label>
                     <input type="date" value={orderDate} onChange={(e)=>setOrderDate(e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase">Order Status</label>
                     <select value={orderStatus} onChange={(e)=>setOrderStatus(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white">
                        <option>Pending Payment</option><option>Processing</option><option>Completed</option>
                     </select>
                  </div>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}