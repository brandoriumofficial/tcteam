import React, { useState } from "react";
import { 
  FaBox, FaSearch, FaPlus, FaMinus, FaEdit, FaTrash, FaSave, FaTimes, 
  FaExclamationTriangle, FaCheckCircle, FaClipboardList 
} from "react-icons/fa";

// --- DUMMY DATA ---
const initialInventory = [
  { id: 1, product: "Herbal Amla Hair Oil", category: "Hair Care", variant: "200 ml", batch: "TC-HO-0125", stock: 8, price: 350 },
  { id: 2, product: "Ayurvedic Face Cream", category: "Skin Care", variant: "50 gm", batch: "TC-FC-2201", stock: 45, price: 500 },
  { id: 3, product: "Neem Body Wash", category: "Body Care", variant: "500 ml", batch: "TC-BW-0992", stock: 0, price: 250 },
  { id: 4, product: "Sandalwood Soap", category: "Skin Care", variant: "100 gm", batch: "TC-SO-8821", stock: 120, price: 150 },
  { id: 5, product: "Kumkumadi Tailam", category: "Face Care", variant: "30 ml", batch: "TC-KT-1100", stock: 5, price: 899 },
];

export default function AdminInventory() {
  
  // --- STATES ---
  const [inventory, setInventory] = useState(initialInventory);
  
  // Edit States
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ product: "", category: "Hair Care", variant: "", batch: "", stock: "", price: "" });

  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- HELPERS ---
  const getStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  // --- HANDLERS ---

  // 1. Stock Updates (+/-)
  const updateStock = (id, amount) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + amount);
        return { ...item, stock: newStock };
      }
      return item;
    }));
  };

  // 2. Add Item
  const handleAddItem = () => {
    if (!newItem.product || !newItem.batch) return alert("Product & Batch are required!");
    const newEntry = {
      ...newItem,
      id: Date.now(),
      stock: Number(newItem.stock) || 0,
      price: Number(newItem.price) || 0
    };
    setInventory([newEntry, ...inventory]);
    setNewItem({ product: "", category: "Hair Care", variant: "", batch: "", stock: "", price: "" });
    setIsModalOpen(false);
  };

  // 3. Edit Item
  const startEdit = (item) => {
    setEditId(item.id);
    setEditData(item);
  };

  const saveEdit = () => {
    setInventory(prev => prev.map(item => item.id === editId ? editData : item));
    setEditId(null);
  };

  const deleteItem = (id) => {
    if(window.confirm("Delete this inventory record?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- FILTER LOGIC ---
  const filteredData = inventory.filter(item => {
    const status = getStatus(item.stock);
    const matchSearch = item.product.toLowerCase().includes(search.toLowerCase()) || item.batch.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" ? true : item.category === filterCategory;
    const matchStatus = filterStatus === "All" ? true : status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  // --- STATS CALCULATION ---
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.stock > 0 && i.stock < 10).length;
  const outOfStockItems = inventory.filter(i => i.stock === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaClipboardList className="text-blue-600"/> Inventory Management
           </h1>
           <p className="text-sm text-gray-500">Track batches, stocks, and expiration.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition"
        >
           <FaPlus/> Add New Stock
        </button>
      </div>

      {/* --- TOP SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         {/* Total Products */}
         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Total Products</p>
               <h3 className="text-2xl font-bold text-gray-800">{totalItems}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FaBox className="text-xl"/></div>
         </div>

         {/* Low Stock Warning */}
         <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-orange-500 flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Low Stock Alert</p>
               <h3 className="text-2xl font-bold text-orange-600">{lowStockItems}</h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><FaExclamationTriangle className="text-xl"/></div>
         </div>

         {/* Out of Stock */}
         <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-red-500 flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Out of Stock</p>
               <h3 className="text-2xl font-bold text-red-600">{outOfStockItems}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><FaTimes className="text-xl"/></div>
         </div>
      </div>

      {/* --- FILTERS BAR (ABOVE TABLE) --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
         
         <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search by Product Name or Batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>

         <div className="flex gap-3 w-full md:w-auto">
            <select className="border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500" onChange={(e)=>setFilterCategory(e.target.value)}>
               <option value="All">All Categories</option>
               <option>Hair Care</option>
               <option>Skin Care</option>
               <option>Face Care</option>
               <option>Body Care</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500" onChange={(e)=>setFilterStatus(e.target.value)}>
               <option value="All">All Status</option>
               <option>In Stock</option>
               <option>Low Stock</option>
               <option>Out of Stock</option>
            </select>
         </div>
      </div>

      {/* --- MAIN INVENTORY TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-gray-100 text-gray-600 uppercase text-[11px] font-bold">
                  <tr>
                     <th className="p-4">Product Info</th>
                     <th className="p-4">Batch / Variant</th>
                     <th className="p-4">Price</th>
                     <th className="p-4 text-center">Stock Control</th>
                     <th className="p-4">Status</th>
                     <th className="p-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredData.map(item => {
                     const status = getStatus(item.stock);
                     const isEditing = editId === item.id;

                     return (
                        <tr key={item.id} className={`hover:bg-blue-50/30 transition ${isEditing ? "bg-blue-50" : ""}`}>
                           
                           {/* Product Name */}
                           <td className="p-4">
                              {isEditing ? (
                                 <input value={editData.product} onChange={(e)=>setEditData({...editData, product: e.target.value})} className="border rounded p-1 w-full text-xs" />
                              ) : (
                                 <div>
                                    <p className="font-bold text-gray-800">{item.product}</p>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">{item.category}</span>
                                 </div>
                              )}
                           </td>

                           {/* Batch & Variant */}
                           <td className="p-4">
                              {isEditing ? (
                                 <div className="space-y-1">
                                    <input value={editData.batch} onChange={(e)=>setEditData({...editData, batch: e.target.value})} className="border rounded p-1 w-full text-xs uppercase" placeholder="BATCH" />
                                    <input value={editData.variant} onChange={(e)=>setEditData({...editData, variant: e.target.value})} className="border rounded p-1 w-full text-xs" placeholder="VAR" />
                                 </div>
                              ) : (
                                 <div>
                                    <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs border">{item.batch}</span>
                                    <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                                 </div>
                              )}
                           </td>

                           {/* Price */}
                           <td className="p-4 font-bold text-gray-700">
                              {isEditing ? (
                                 <input type="number" value={editData.price} onChange={(e)=>setEditData({...editData, price: e.target.value})} className="border rounded p-1 w-20 text-xs" />
                              ) : (
                                 `₹${item.price}`
                              )}
                           </td>

                           {/* Stock Control (+/-) */}
                           <td className="p-4">
                              <div className="flex items-center justify-center gap-3">
                                 <button onClick={() => updateStock(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-600 rounded-full transition disabled:opacity-50">
                                    <FaMinus className="text-[10px]"/>
                                 </button>
                                 
                                 {isEditing ? (
                                    <input type="number" value={editData.stock} onChange={(e)=>setEditData({...editData, stock: Number(e.target.value)})} className="w-12 text-center border rounded p-1 text-sm font-bold" />
                                 ) : (
                                    <span className={`font-bold w-8 text-center text-base ${item.stock < 10 ? "text-red-600" : "text-gray-800"}`}>{item.stock}</span>
                                 )}
                                 
                                 <button onClick={() => updateStock(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-green-100 text-gray-600 rounded-full transition">
                                    <FaPlus className="text-[10px]"/>
                                 </button>
                              </div>
                           </td>

                           {/* Status Badge */}
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1 w-fit
                                 ${status === "In Stock" ? "bg-green-100 text-green-700 border-green-200" : 
                                   status === "Low Stock" ? "bg-orange-100 text-orange-700 border-orange-200" : 
                                   "bg-red-100 text-red-700 border-red-200"}`}>
                                 {status === "Low Stock" && <FaExclamationTriangle/>}
                                 {status}
                              </span>
                           </td>

                           {/* Actions */}
                           <td className="p-4 text-right">
                              {isEditing ? (
                                 <div className="flex justify-end gap-2">
                                    <button onClick={saveEdit} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Save"><FaSave/></button>
                                    <button onClick={() => setEditId(null)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Cancel"><FaTimes/></button>
                                 </div>
                              ) : (
                                 <div className="flex justify-end gap-2">
                                    <button onClick={() => startEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Edit">
                                       <FaEdit/>
                                    </button>
                                    <button onClick={() => deleteItem(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="Delete">
                                       <FaTrash/>
                                    </button>
                                 </div>
                              )}
                           </td>

                        </tr>
                     );
                  })}
               </tbody>
            </table>
            
            {filteredData.length === 0 && (
               <div className="p-10 text-center text-gray-400">No inventory matches your search.</div>
            )}
         </div>
      </div>

      {/* --- ADD NEW ITEM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800">Add New Stock</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">✖</button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                    <input value={newItem.product} onChange={(e)=>setNewItem({...newItem, product: e.target.value})} className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Herbal Shampoo" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Variant</label>
                       <input value={newItem.variant} onChange={(e)=>setNewItem({...newItem, variant: e.target.value})} className="w-full border rounded-lg p-2 text-sm" placeholder="200ml" />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Batch No</label>
                       <input value={newItem.batch} onChange={(e)=>setNewItem({...newItem, batch: e.target.value})} className="w-full border rounded-lg p-2 text-sm uppercase" placeholder="BATCH-01" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                       <select value={newItem.category} onChange={(e)=>setNewItem({...newItem, category: e.target.value})} className="w-full border rounded-lg p-2 text-sm bg-white">
                          <option>Hair Care</option><option>Skin Care</option><option>Body Care</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                       <input type="number" value={newItem.price} onChange={(e)=>setNewItem({...newItem, price: e.target.value})} className="w-full border rounded-lg p-2 text-sm" placeholder="0" />
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Initial Stock</label>
                    <input type="number" value={newItem.stock} onChange={(e)=>setNewItem({...newItem, stock: e.target.value})} className="w-full border rounded-lg p-2 text-sm" placeholder="0" />
                 </div>
                 <button onClick={handleAddItem} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition">Add to Inventory</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}