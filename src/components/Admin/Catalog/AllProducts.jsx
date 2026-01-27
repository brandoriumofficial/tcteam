import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaAngleLeft, FaAngleRight, FaBoxOpen 
} from "react-icons/fa";

// --- DUMMY DATA (Aapke Example + Extra for Pagination) ---
const initialProducts = [
  {
    id: "P001",
    name: "Traditional Herbal Hair Oil",
    category: "Hair Care",
    sku: "THO-001",
    image: "https://via.placeholder.com/40/e1f5fe/000?text=Oil",
    oldPrice: 499,
    newPrice: 349,
    discount: "30%",
    inventory: 120,
    reviews: 4.5,
    coupon: "CARE10",
    offer: "Limited Time",
    timer: 7183 // Seconds (approx 1h 59m)
  },
  {
    id: "P002",
    name: "Ayurvedic Skin Cream",
    category: "Skin Care",
    sku: "ASC-002",
    image: "https://via.placeholder.com/40/fce4ec/000?text=Crm",
    oldPrice: 699,
    newPrice: 499,
    discount: "28%",
    inventory: 0,
    reviews: 4.2,
    coupon: "SKIN15",
    offer: "Festival Offer",
    timer: 5383 // Seconds (approx 1h 29m)
  },
  // ... Generating extra data for pagination
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `P00${i + 3}`,
    name: i % 2 === 0 ? `Organic Face Wash ${i+1}` : `Herbal Shampoo ${i+1}`,
    category: i % 2 === 0 ? "Face Care" : "Hair Care",
    sku: `SKU-${100 + i}`,
    image: `https://via.placeholder.com/40?text=Prd`,
    oldPrice: 300 + (i * 10),
    newPrice: 200 + (i * 10),
    discount: "15%",
    inventory: i % 4 === 0 ? 0 : 50 + i,
    reviews: (3.5 + Math.random()).toFixed(1),
    coupon: i % 3 === 0 ? "SALE20" : "-",
    offer: i % 3 === 0 ? "Flash Sale" : "-",
    timer: i % 3 === 0 ? 3600 + (i * 100) : 0
  }))
];

export default function AllProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState([]);
  
  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- TIMER LOGIC (Real-time Countdown) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prev =>
        prev.map(p => ({
          ...p,
          timer: p.timer > 0 ? p.timer - 1 : 0
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec) => {
    if (sec <= 0) return <span className="text-gray-400 text-[10px]">-</span>;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return <span className="text-red-600 font-mono font-bold text-xs">{h}h {m}m {s}s</span>;
  };

  // --- FILTERING ---
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // --- PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // --- HANDLERS ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = currentItems.map(p => p.id);
      setSelected([...new Set([...selected, ...ids])]);
    } else {
      const ids = currentItems.map(p => p.id);
      setSelected(selected.filter(id => !ids.includes(id)));
    }
  };

  const handleSelectOne = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteProduct = (id) => {
    if(window.confirm("Delete this product?")) setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans text-gray-800">

      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
           <p className="text-xs text-gray-500">Inventory Management</p>
        </div>
        <div className="flex gap-2">
           {selected.length > 0 && (
             <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition">
               Delete Selected ({selected.length})
             </button>
           )}
           <Link to="/admin/addproduct" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition">
             <FaPlus /> Add New
           </Link>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4 flex items-center justify-between">
         <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Search by Name, SKU, Category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaFilter />
            <span>{filteredProducts.length} Items</span>
         </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            {/* TABLE HEADER */}
            <thead className="bg-gray-100 text-gray-600 text-[11px] uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="p-3 w-8 text-center"><input type="checkbox" onChange={handleSelectAll} checked={currentItems.length > 0 && currentItems.every(p => selected.includes(p.id))} /></th>
                <th className="p-3">Sr No.</th>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Old Price</th>
                <th className="p-3">New Price</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Inventory</th>
                <th className="p-3">Reviews</th>
                <th className="p-3">Coupon</th>
                <th className="p-3">Offer</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-gray-100 text-xs">
              {currentItems.length > 0 ? (
                currentItems.map((p, index) => (
                  <tr key={p.id} className={`hover:bg-blue-50 transition ${selected.includes(p.id) ? "bg-blue-50" : ""}`}>
                    
                    <td className="p-3 text-center"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => handleSelectOne(p.id)} /></td>
                    
                    <td className="p-3 text-gray-500 font-mono">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    
                    <td className="p-3">
                      <img src={p.image} alt="" className="w-8 h-8 rounded border border-gray-200 object-cover" />
                    </td>

                    <td className="p-3 font-semibold text-gray-800 max-w-[150px] truncate" title={p.name}>{p.name}</td>
                    
                    <td className="p-3 text-gray-600">{p.category}</td>
                    
                    <td className="p-3 font-mono text-gray-500">{p.sku}</td>
                    
                    <td className="p-3 text-gray-400 line-through">₹{p.oldPrice}</td>
                    
                    <td className="p-3 font-bold text-gray-900">₹{p.newPrice}</td>
                    
                    <td className="p-3 text-green-600 font-bold">{p.discount}</td>
                    
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700">{p.inventory} pcs</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded w-fit ${p.inventory > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {p.inventory > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-orange-500 font-bold">⭐ {p.reviews}</td>
                    
                    <td className="p-3">
                      {p.coupon !== "-" ? <span className="bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-mono">{p.coupon}</span> : "-"}
                    </td>

                    <td className="p-3 text-gray-600 truncate max-w-[100px]">{p.offer}<br/>{formatTime(p.timer)}</td>
                    

                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-600 hover:bg-blue-100 p-1.5 rounded transition"><FaEdit /></button>
                        <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:bg-red-100 p-1.5 rounded transition"><FaTrash /></button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15" className="p-10 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                       <FaBoxOpen className="text-3xl mb-2 opacity-50"/>
                       No products found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-xs text-gray-500">
              Showing <span className="font-bold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-bold">{filteredProducts.length}</span>
           </div>

           <div className="flex items-center gap-3">
              <select 
                 value={itemsPerPage} 
                 onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                 className="border rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
              >
                 <option value={10}>10 rows</option>
                 <option value={20}>20 rows</option>
                 <option value={50}>50 rows</option>
              </select>

              <div className="flex gap-1">
                 <button disabled={currentPage===1} onClick={()=>setCurrentPage(c=>c-1)} className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"><FaAngleLeft/></button>
                 
                 {/* Page Numbers */}
                 {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    let page = i + 1;
                    if(totalPages > 5 && currentPage > 3) page = currentPage - 2 + i;
                    if(page > totalPages) return null;
                    return (
                       <button key={page} onClick={()=>setCurrentPage(page)} className={`w-7 h-7 text-xs font-bold rounded border ${currentPage===page ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>{page}</button>
                    )
                 })}

                 <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(c=>c+1)} className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"><FaAngleRight/></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}