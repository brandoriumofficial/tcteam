import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaCloudUploadAlt, FaTags, FaSave, FaTimes, FaBullhorn, FaTicketAlt 
} from "react-icons/fa";
import { MdVisibility, MdCategory } from "react-icons/md";

export default function AddCategory() {
  const fileRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "Main Category",
    active: true,
    showOnHome: false,
    showOnMenu: false,
    showOnShop: true,
    seoTitle: "",
    seoDesc: "",
    keywords: "",
    selectedTags: ["Herbal"], // Default tag
    suitableFor: "All",
    seasonal: "None",
  });

  const availableTags = ["Organic", "Herbal", "Chemical Free", "Ayurveda Inspired"];

  // --- HANDLERS ---
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const toggle = (key) => setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
          <p className="text-xs text-gray-500">Create new product categories for your store.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 transition">Cancel</button>
          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">
            <FaSave /> Save Category
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= LEFT COLUMN (Main Info) ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. CATEGORY INFO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <MdCategory className="text-blue-600"/> Category Info
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="e.g. Hair Care / Skin Care" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Header Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows="4"
                  placeholder="Short intro about this category (max 600 characters)..." 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. TRADITIONAL DETAILS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <FaTags className="text-green-600"/> Traditional Care Details
            </h2>

            <div className="mb-4">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ayurvedic Tags</label>
               <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1 rounded-full border transition ${
                        form.selectedTags.includes(tag) 
                        ? "bg-green-100 text-green-700 border-green-300 font-bold" 
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Suitable For</label>
                 <select 
                    name="suitableFor" 
                    value={form.suitableFor} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                 >
                    <option>All</option>
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Seasonal Category</label>
                 <select 
                    name="seasonal" 
                    value={form.seasonal} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                 >
                    <option>None</option>
                    <option>Summer Care</option>
                    <option>Winter Care</option>
                    <option>Monsoon Hair Care</option>
                 </select>
              </div>
            </div>
          </div>

          {/* 3. MARKETING & SEO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <FaBullhorn className="text-purple-600"/> Marketing & SEO
            </h2>
            
            <div className="flex gap-3 mb-4">
               <button className="flex-1 border border-dashed border-purple-300 bg-purple-50 text-purple-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-100 transition">
                  <FaTicketAlt /> Create Category Coupon
               </button>
               <button className="flex-1 border border-dashed border-blue-300 bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition">
                  <FaBullhorn /> Promote this Category
               </button>
            </div>

            <div className="space-y-3">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Title</label>
                  <input name="seoTitle" value={form.seoTitle} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Meta Title"/>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Description</label>
                  <textarea name="seoDesc" value={form.seoDesc} onChange={handleChange} rows="2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Meta Description"></textarea>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Keywords</label>
                  <input name="keywords" value={form.keywords} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Comma separated keywords..."/>
               </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (Settings) ================= */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 1. STATUS & VISIBILITY */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <MdVisibility className="text-gray-600"/> Visibility & Status
            </h2>
            
            {/* Active Toggle */}
            <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
               <span className="text-sm font-bold text-gray-700">Category Status</span>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.active} onChange={() => toggle("active")} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  <span className="ml-2 text-xs font-bold text-gray-600">{form.active ? "Active" : "Hidden"}</span>
               </label>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
               {["showOnHome", "showOnMenu", "showOnShop"].map(key => (
                  <label key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                     <div className="relative flex items-center">
                        <input type="checkbox" checked={form[key]} onChange={() => toggle(key)} className="peer w-4 h-4 border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 appearance-none transition-colors"/>
                        <FaSave className="absolute text-white text-[10px] pointer-events-none opacity-0 peer-checked:opacity-100 left-[3px]" />
                     </div>
                     <span className="text-sm text-gray-600">
                        {key === "showOnHome" ? "Show on Homepage" : key === "showOnMenu" ? "Show on Menu" : "Show on Shop Page"}
                     </span>
                  </label>
               ))}
            </div>
          </div>

          {/* 2. CATEGORY TYPE */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Type</label>
             <select 
                name="type" 
                value={form.type} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white mb-4"
             >
                <option>Main Category</option>
                <option>Sub Category</option>
                <option>Collection</option>
             </select>

             <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-700 mb-2">Products in this category</p>
                <Link to="/admin/addproduct" className="block w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition">
                   + Add Products
                </Link>
                <p className="text-[10px] text-gray-400 mt-2 italic">Best Selling & New Launch products can be auto-assigned</p>
             </div>
          </div>

          {/* 3. IMAGE UPLOAD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2">Category Image</h2>
             
             <div 
               onClick={() => fileRef.current.click()} 
               className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition relative overflow-hidden group"
             >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="bg-gray-100 p-3 rounded-full mb-2 group-hover:scale-110 transition">
                       <FaCloudUploadAlt className="text-gray-400 text-xl" />
                    </div>
                    <span className="text-xs font-bold text-gray-500">Click to Upload</span>
                  </>
                )}
                {imagePreview && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                     <span className="text-white text-xs font-bold">Change Image</span>
                  </div>
                )}
             </div>
             <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleImageChange} />
          </div>

        </div>
      </div>
    </div>
  );
}