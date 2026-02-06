import React, { useState, useEffect } from "react";
import { 
  FaUser, FaBoxOpen, FaTrash, FaSave, FaMoneyBillWave, 
  FaCreditCard, FaGooglePay, FaUniversity, FaTags, FaSpinner, FaSearch
} from "react-icons/fa";
// API Imports (Path apne project ke hisab se set karein)
import { checkCouponApi, createOrderApi, fetchProductsApi } from "../../../api/services/api"; 

export default function AdminOrder() {
  
  // --- STATES ---
  const [productList, setProductList] = useState([]); // API se aane wala data
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "", pincode: "", city: "" });
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState({ method: "COD", status: "Pending", txnId: "" });
  const [orderStatus, setOrderStatus] = useState("Pending Payment");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); 
  const [couponMsg, setCouponMsg] = useState("");

  // --- 1. LOAD PRODUCTS ON MOUNT ---
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoadingProducts(true);
    const data = await fetchProductsApi();
    if(Array.isArray(data)) {
        setProductList(data);
    }
    setLoadingProducts(false);
  };

  // --- HANDLERS ---

  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const addRow = () => {
    setItems([...items, { 
        id: Date.now(), 
        unique_id: "", // Dropdown value
        name: "", 
        sku: "", 
        oldPrice: 0, 
        newPrice: 0, 
        qty: 1, 
        total: 0 
    }]);
  };

  const updateRow = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        let updates = { [field]: value };

        // --- PRODUCT SELECTION LOGIC ---
        if (field === "unique_id") {
          // Find the selected product from our API list
          const prod = productList.find(p => p.unique_id === value);
          
          if (prod) {
            updates = { 
              unique_id: prod.unique_id,
              // Data for Backend
              productId: prod.product_id, 
              variationId: prod.variation_id, // Null if simple product
              
              name: prod.name, 
              sku: prod.sku, 
              oldPrice: prod.oldPrice, 
              newPrice: prod.newPrice,
              total: prod.newPrice * item.qty 
            };
          }
        }

        // --- QUANTITY CHANGE LOGIC ---
        if (field === "qty") {
          const qty = Number(value);
          if(qty < 1) return item; // Prevent 0 or negative
          updates.total = item.newPrice * qty;
        }

        return { ...item, ...updates };
      }
      return item;
    }));
  };

  const removeRow = (id) => setItems(prev => prev.filter(i => i.id !== id));

  // --- CALCULATIONS ---
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  
  // Savings Calculation (Old Price - New Price)
  const totalSavings = items.reduce((acc, item) => {
    if (item.oldPrice > item.newPrice) {
      return acc + ((item.oldPrice - item.newPrice) * item.qty);
    }
    return acc;
  }, 0);
  
  const couponDiscount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount); 

  // --- API ACTIONS ---

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    if (items.length === 0) return alert("Add items first!");

    setLoading(true);
    setCouponMsg("");
    
    // Check coupon via API
    const result = await checkCouponApi(couponCode, subtotal);
    
    setLoading(false);
    if (result.success) {
      setAppliedCoupon(result.data);
      setCouponMsg(`Success! Saved ₹${result.data.discount_amount}`);
    } else {
      setAppliedCoupon(null);
      setCouponMsg(result.message);
    }
  };

  const handleSave = async () => {
    if(!customer.name || !customer.phone) return alert("Customer Name & Phone are required!");
    if(items.length === 0) return alert("Add at least one product!");

    // Validate that all rows have a product selected
    const invalidItems = items.filter(i => !i.name);
    if(invalidItems.length > 0) return alert("Please select a product for all rows.");

    const finalOrder = {
      customer,
      items, // Contains productId & variationId
      payment,
      orderStatus,
      date: orderDate,
      financials: { 
        subtotal, 
        totalSavings, 
        couponDiscount, 
        grandTotal,
        couponCode: appliedCoupon ? appliedCoupon.code : null 
      }
    };

    setLoading(true);
    const result = await createOrderApi(finalOrder);
    setLoading(false);

    if (result.success) {
      alert(`Order Created! ID: ${result.order_id}`);
      // Clear Form
      setItems([]);
      setAppliedCoupon(null);
      setCouponCode("");
      setCustomer({ name: "", phone: "", email: "", address: "", pincode: "", city: "" });
    } else {
      alert("Error: " + result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Manual Order</h1>
            <p className="text-xs text-gray-500">Inventory & price will be fetched from database</p>
         </div>
         <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-700 flex items-center gap-2 transition disabled:opacity-50">
            {loading ? <FaSpinner className="animate-spin"/> : <FaSave/>} Save Order
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* LEFT COLUMN: PRODUCTS */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2"><FaBoxOpen/> Order Items</h3>
                  <button onClick={addRow} className="text-blue-600 text-xs font-bold hover:underline">+ Add Row</button>
               </div>
               
               <div className="p-4">
                  {loadingProducts ? (
                      <div className="text-center p-4 text-gray-400 text-sm">Loading Products...</div>
                  ) : (
                  <table className="w-full text-left text-sm">
                     <thead className="text-gray-500 uppercase text-[10px] font-bold border-b">
                        <tr>
                           <th className="py-2 w-5/12">Product / Variation</th>
                           <th className="py-2 w-2/12">Price</th>
                           <th className="py-2 w-2/12">Qty</th>
                           <th className="py-2 w-2/12 text-right">Total</th>
                           <th className="py-2 w-1/12"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                           <tr key={item.id}>
                              <td className="py-3 pr-2">
                                 {/* PRODUCT DROPDOWN */}
                                 <select 
                                   className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-blue-500"
                                   value={item.unique_id}
                                   onChange={(e) => updateRow(item.id, "unique_id", e.target.value)}
                                 >
                                    <option value="">-- Select Product --</option>
                                    {productList.map(p => (
                                       <option key={p.unique_id} value={p.unique_id}>
                                          {p.name} (SKU: {p.sku}) {p.stock < 5 ? `[Low Stock: ${p.stock}]` : ''}
                                       </option>
                                    ))}
                                 </select>
                              </td>

                              <td className="py-3">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800">₹{item.newPrice}</span>
                                    {item.oldPrice > item.newPrice && (
                                        <span className="text-[10px] text-gray-400 line-through">₹{item.oldPrice}</span>
                                    )}
                                </div>
                              </td>

                              <td className="py-3">
                                 <input 
                                    type="number" min="1" 
                                    className="w-16 border rounded-lg p-1.5 text-center bg-white focus:ring-1 focus:ring-blue-500"
                                    value={item.qty} 
                                    onChange={(e) => updateRow(item.id, "qty", e.target.value)} 
                                 />
                              </td>

                              <td className="py-3 text-right font-bold text-blue-600">₹{item.total}</td>
                              
                              <td className="py-3 text-center">
                                 <button onClick={()=>removeRow(item.id)} className="text-red-400 hover:text-red-600 transition"><FaTrash/></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  )}
                  
                  {items.length === 0 && !loadingProducts && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg mt-2">
                          <p className="text-gray-400 text-xs">Click "+ Add Row" to start billing.</p>
                      </div>
                  )}
               </div>
            </div>

            {/* TOTALS & COUPON SECTION */}
            <div className="flex justify-end">
               <div className="w-full md:w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  
                  {/* Coupon Input */}
                  <div className="mb-4 pb-4 border-b">
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Apply Coupon</label>
                     <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full border rounded-lg pl-9 p-2 text-sm" 
                                placeholder="ENTER CODE" 
                            />
                        </div>
                        <button 
                            onClick={handleApplyCoupon}
                            disabled={loading || appliedCoupon}
                            className={`px-4 rounded-lg text-xs font-bold transition ${appliedCoupon ? 'bg-green-100 text-green-700' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                        >
                            {appliedCoupon ? "APPLIED" : "APPLY"}
                        </button>
                     </div>
                     {couponMsg && (
                        <p className={`text-[10px] mt-1 font-medium ${appliedCoupon ? 'text-green-600' : 'text-red-500'}`}>
                           {couponMsg}
                        </p>
                     )}
                  </div>

                  {/* Final Calculation */}
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between text-gray-600">
                        <span>Items Total</span>
                        <span>₹{subtotal}</span>
                     </div>
                     
                     {totalSavings > 0 && (
                        <div className="flex justify-between text-green-600 text-xs">
                            <span>Total Savings</span>
                            <span>- ₹{totalSavings}</span>
                        </div>
                     )}
                     
                     {appliedCoupon && (
                        <div className="flex justify-between text-blue-600 font-bold bg-blue-50 p-2 rounded">
                            <span>Coupon ({appliedCoupon.code})</span>
                            <span>- ₹{appliedCoupon.discount_amount}</span>
                        </div>
                     )}

                     <div className="border-t pt-3 mt-3 flex justify-between text-xl font-bold text-gray-900">
                        <span>Grand Total</span>
                        <span>₹{grandTotal}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: CUSTOMER & PAYMENT */}
         <div className="lg:col-span-1 space-y-6">
            
            {/* Customer Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><FaUser className="text-blue-500"/> Customer Details</h3>
               <div className="space-y-3">
                  <input name="name" value={customer.name} onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Full Name *" />
                  <input name="phone" value={customer.phone} onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Phone Number *" />
                  <input name="email" value={customer.email} onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Email (Optional)" />
                  <textarea name="address" value={customer.address} onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" rows="3" placeholder="Full Shipping Address"></textarea>
                  <div className="grid grid-cols-2 gap-2">
                     <input name="city" value={customer.city} onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="City" />
                     <input name="pincode" value={customer.pincode} onChange={handleCustomerChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Pincode" />
                  </div>
               </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><FaMoneyBillWave className="text-green-600"/> Payment Info</h3>
               <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                      {id: "COD", icon: <FaMoneyBillWave/>}, 
                      {id: "UPI", icon: <FaGooglePay/>}, 
                      {id: "Card", icon: <FaCreditCard/>}, 
                      {id: "NetBanking", icon: <FaUniversity/>}
                    ].map(m => (
                     <button key={m.id} onClick={() => setPayment({ ...payment, method: m.id })}
                       className={`p-2 rounded border text-xs font-bold flex flex-col items-center gap-1 transition ${payment.method === m.id ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                        <span className="text-lg">{m.icon}</span> {m.id}
                     </button>
                  ))}
               </div>
               
               {payment.method !== "COD" && (
                   <div className="mb-3">
                       <input 
                         className="w-full border rounded-lg p-2 text-sm bg-gray-50"
                         placeholder="Transaction ID / Ref No."
                         onChange={(e) => setPayment({...payment, txnId: e.target.value})}
                       />
                   </div>
               )}

               <div className="space-y-3">
                   <div>
                       <label className="text-[10px] font-bold text-gray-500 uppercase">Order Date</label>
                       <input type="date" value={orderDate} onChange={(e)=>setOrderDate(e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                   </div>
                   <div>
                       <label className="text-[10px] font-bold text-gray-500 uppercase">Status</label>
                       <select value={orderStatus} onChange={(e)=>setOrderStatus(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white">
                            <option>Pending Payment</option>
                            <option>Processing</option>
                            <option>On Hold</option>
                            <option>Completed</option>
                       </select>
                   </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}