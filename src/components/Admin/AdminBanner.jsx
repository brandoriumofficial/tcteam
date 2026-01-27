import React, { useState } from "react";
import { 
  FaImages, FaVideo, FaPlus, FaEdit, FaTrash, FaPlay, FaEye, FaSortNumericDown, 
  FaLaptop, FaMobileAlt, FaLink 
} from "react-icons/fa";

// --- DUMMY DATA ---
const initialBanners = [
  {
    id: 1,
    type: "Image",
    media: "https://via.placeholder.com/800x300/e0f7fa/006064?text=Summer+Sale",
    title: "Summer Hair Care Sale",
    page: "Homepage",
    section: "Main Slider",
    order: 1,
    status: "Active"
  },
  {
    id: 2,
    type: "Video",
    media: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Ayurvedic Rituals Video",
    page: "Product Detail",
    section: "Description Area",
    order: 2,
    status: "Active"
  }
];

export default function AdminBanner() {
  
  const [banners, setBanners] = useState(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "", type: "Image", media: "", page: "Homepage", section: "Main Slider", 
    order: 1, link: "", status: "Active"
  });

  const [filterPage, setFilterPage] = useState("All");

  // --- HANDLERS ---

  // 1. File Upload Handler (Image/Video)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if(file) {
      setFormData({...formData, media: URL.createObjectURL(file)});
    }
  };

  // 2. Save
  const handleSave = () => {
    if(!formData.title || !formData.media) return alert("Title & Media Required!");
    
    if(editId) {
      setBanners(prev => prev.map(b => b.id === editId ? { ...formData, id: editId } : b));
    } else {
      setBanners([...banners, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  // 3. Delete
  const handleDelete = (id) => {
    if(window.confirm("Delete this banner?")) setBanners(prev => prev.filter(b => b.id !== id));
  };

  // 4. Modal Open
  const openModal = (banner = null) => {
    if(banner) {
      setEditId(banner.id);
      setFormData(banner);
    } else {
      setEditId(null);
      setFormData({ 
        title: "", type: "Image", media: "", page: "Homepage", section: "Main Slider", 
        order: banners.length + 1, link: "", status: "Active" 
      });
    }
    setIsModalOpen(true);
  };

  // Filter Logic
  const filteredBanners = banners.filter(b => filterPage === "All" ? true : b.page === filterPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaImages className="text-purple-600"/> Banners & Video Ads
           </h1>
           <p className="text-xs text-gray-500 mt-1">Manage sliders, videos, and promotional content across pages.</p>
        </div>
        <div className="flex gap-3">
           <select className="border rounded-lg px-3 py-2 text-xs outline-none bg-white" onChange={(e)=>setFilterPage(e.target.value)}>
              <option value="All">All Pages</option>
              <option>Homepage</option>
              <option>Shop Page</option>
              <option>Product Detail</option>
              <option>Cart / Checkout</option>
           </select>
           <button onClick={() => openModal()} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 shadow-lg flex items-center gap-2">
              <FaPlus/> Add Media
           </button>
        </div>
      </div>

      {/* --- GRID DISPLAY --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredBanners.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition relative">
               
               {/* MEDIA PREVIEW */}
               <div className="h-40 w-full bg-black relative flex items-center justify-center overflow-hidden">
                  {item.type === "Video" ? (
                     <>
                        <video src={item.media} className="w-full h-full object-cover opacity-80" muted loop />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <FaPlay className="text-white text-3xl opacity-80"/>
                        </div>
                     </>
                  ) : (
                     <img src={item.media} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  )}
                  
                  {/* Status Badge */}
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === "Active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                     {item.status}
                  </span>
               </div>

               {/* INFO SECTION */}
               <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{item.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                     <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-bold flex items-center gap-1">
                        <FaLaptop className="text-[9px]"/> {item.page}
                     </span>
                     <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-bold">
                        {item.section}
                     </span>
                     <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded border font-bold flex items-center gap-1">
                        <FaSortNumericDown/> Order: {item.order}
                     </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                     <button onClick={() => openModal(item)} className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded flex items-center justify-center gap-1">
                        <FaEdit/> Edit
                     </button>
                     <button onClick={() => handleDelete(item.id)} className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded">
                        <FaTrash/>
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
               
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800">{editId ? "Edit Media" : "Add New Media"}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">✖</button>
               </div>

               <div className="p-6 space-y-4">
                  
                  {/* Media Type & Upload */}
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Media Type</label>
                        <select value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="w-full border rounded p-2 text-sm bg-white">
                           <option>Image</option><option>Video</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Upload File</label>
                        <div className="relative border rounded p-1.5 bg-white flex items-center overflow-hidden">
                           <input type="file" accept={formData.type === "Video" ? "video/*" : "image/*"} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                           <span className="text-xs text-gray-500 truncate pl-1">{formData.media ? "File Selected" : "Click to Upload"}</span>
                           <div className="ml-auto bg-gray-200 p-1 rounded">{formData.type === "Video" ? <FaVideo/> : <FaImages/>}</div>
                        </div>
                     </div>
                  </div>

                  {/* Preview Area */}
                  {formData.media && (
                     <div className="h-32 w-full bg-black rounded-lg overflow-hidden flex items-center justify-center border">
                        {formData.type === "Video" ? (
                           <video src={formData.media} controls className="h-full w-full object-contain" />
                        ) : (
                           <img src={formData.media} alt="Preview" className="h-full w-full object-cover" />
                        )}
                     </div>
                  )}

                  {/* Details */}
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Title / Alt Text</label>
                     <input value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="e.g. Monsoon Sale Banner" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Target Page</label>
                        <select value={formData.page} onChange={(e)=>setFormData({...formData, page: e.target.value})} className="w-full border rounded p-2 text-sm bg-white">
                           <option>Homepage</option><option>Shop Page</option><option>Product Detail</option><option>Cart / Checkout</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Section</label>
                        <select value={formData.section} onChange={(e)=>setFormData({...formData, section: e.target.value})} className="w-full border rounded p-2 text-sm bg-white">
                           <option>Main Slider (Top)</option><option>Middle Banner</option><option>Bottom Promo</option><option>Sidebar Ad</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Sort Order</label>
                        <input type="number" value={formData.order} onChange={(e)=>setFormData({...formData, order: e.target.value})} className="w-full border rounded p-2 text-sm" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Redirect Link</label>
                        <input value={formData.link} onChange={(e)=>setFormData({...formData, link: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="/shop/hair-oil" />
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Status</label>
                     <div className="flex gap-2">
                        <button onClick={()=>setFormData({...formData, status: "Active"})} className={`flex-1 py-2 text-xs font-bold rounded border ${formData.status==="Active"?"bg-green-50 text-green-600 border-green-200":"bg-white text-gray-500"}`}>Active</button>
                        <button onClick={()=>setFormData({...formData, status: "Inactive"})} className={`flex-1 py-2 text-xs font-bold rounded border ${formData.status==="Inactive"?"bg-red-50 text-red-600 border-red-200":"bg-white text-gray-500"}`}>Inactive</button>
                     </div>
                  </div>

                  <button onClick={handleSave} className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-purple-700 shadow-lg">
                     {editId ? "Update Media" : "Add Media"}
                  </button>

               </div>
            </div>
         </div>
      )}

    </div>
  );
}