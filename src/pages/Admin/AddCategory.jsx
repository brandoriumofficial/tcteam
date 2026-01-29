import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaCloudUploadAlt, FaTags, FaSave, FaTimes, FaBullhorn, FaTicketAlt, FaImage, FaBoxOpen 
} from "react-icons/fa";
import { MdVisibility, MdCategory, MdLink } from "react-icons/md";

export default function AddCategory() {
  // Refs for file uploads
  const thumbnailRef = useRef(null);
  const bannerRef = useRef(null);

  // Preview States
  const [thumbPreview, setThumbPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Dropdown Toggle State for Products
  const [isProdDropdownOpen, setIsProdDropdownOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Mock Data for Products (Backend se aayega)
  const allProducts = [
    { id: 1, name: "Herbal Hair Oil" },
    { id: 2, name: "Face Glow Serum" },
    { id: 3, name: "Ayurvedic Shampoo" },
    { id: 4, name: "Neem Face Wash" },
    { id: 5, name: "Body Lotion" },
  ];

  const [form, setForm] = useState({
    name: "",
    slug: "", // Added Slug
    description: "",
    type: "Main Category",
    active: true,
    showOnHome: false,
    showOnMenu: false,
    showOnShop: true,
    seoTitle: "",
    seoDesc: "",
    keywords: "",
    selectedTags: ["Herbal"], 
    suitableFor: "All",
    seasonal: "None",
    assignedProducts: [], // Added for Manual Product Selection
  });

  const availableTags = ["Organic", "Herbal", "Chemical Free", "Ayurveda Inspired", "Vegan"];

  // --- HANDLERS ---
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const toggle = (key) => setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  // Slug Generator Logic
  const handleSlugChange = (e) => {
    // Replace spaces with dashes and remove special chars
    const value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    setForm({ ...form, slug: value });
  };

  // Tag Handlers
  const removeTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== "") {
      e.preventDefault();
      if (!form.selectedTags.includes(tagInput.trim())) {
        setForm(prev => ({ ...prev, selectedTags: [...prev.selectedTags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const togglePredefinedTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  // Product Selection Handlers
  const toggleProduct = (prodId) => {
    setForm(prev => {
      const isSelected = prev.assignedProducts.includes(prodId);
      return {
        ...prev,
        assignedProducts: isSelected 
          ? prev.assignedProducts.filter(id => id !== prodId)
          : [...prev.assignedProducts, prodId]
      };
    });
  };

  // Image Handlers
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'thumbnail') setThumbPreview(url);
      if (type === 'banner') setBannerPreview(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
          <p className="text-xs text-gray-500">Create new product categories with banners & SEO.</p>
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
          
          {/* 1. CATEGORY INFO & SLUG */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <MdCategory className="text-blue-600"/> Category Info
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name</label>
                    <input 
                    name="name" 
                    value={form.name} 
                    onChange={(e) => {
                        handleChange(e);
                        // Auto-generate slug if slug is empty
                        if(!form.slug) setForm(prev => ({...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}))
                    }} 
                    placeholder="e.g. Hair Care" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <MdLink /> Category Slug (URL)
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
                        <span className="text-gray-400 text-xs">/shop/</span>
                        <input 
                        name="slug" 
                        value={form.slug} 
                        onChange={handleSlugChange} 
                        placeholder="hair-care" 
                        className="w-full bg-transparent py-2 text-sm focus:outline-none ml-1 text-gray-700 font-medium"
                        />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Header Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows="4"
                  placeholder="Short intro about this category..." 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. PRODUCT ASSIGNMENT (Multi Select) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <FaBoxOpen className="text-orange-600"/> Assign Products
            </h2>
            
            <div className="relative">
                <button 
                    onClick={() => setIsProdDropdownOpen(!isProdDropdownOpen)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-left text-sm bg-white flex justify-between items-center"
                >
                    <span className={form.assignedProducts.length === 0 ? "text-gray-400" : "text-gray-800"}>
                        {form.assignedProducts.length > 0 
                         ? `${form.assignedProducts.length} Products Selected` 
                         : "Select products to show in this category"}
                    </span>
                    <span className="text-gray-500 text-xs">▼</span>
                </button>

                {isProdDropdownOpen && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 shadow-xl rounded-lg mt-1 max-h-60 overflow-y-auto p-2">
                        {allProducts.map(prod => (
                            <label key={prod.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={form.assignedProducts.includes(prod.id)}
                                    onChange={() => toggleProduct(prod.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{prod.name}</span>
                            </label>
                        ))}
                    </div>
                )}
                
                {/* Selected Preview chips */}
                {form.assignedProducts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {form.assignedProducts.map(id => {
                            const prod = allProducts.find(p => p.id === id);
                            return prod ? (
                                <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded border border-orange-200">
                                    {prod.name}
                                    <FaTimes className="cursor-pointer hover:text-orange-900" onClick={() => toggleProduct(id)}/>
                                </span>
                            ) : null;
                        })}
                    </div>
                )}
            </div>
          </div>

          {/* 3. TAGS & FILTERS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <FaTags className="text-green-600"/> Tags & Filters
            </h2>

            <div className="mb-4">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Manage Tags</label>
               
               {/* Input Area */}
               <div className="flex gap-2 mb-3">
                   <input 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Type tag & press Enter..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                   />
                   <button 
                    onClick={() => {
                        if(tagInput.trim()) {
                            setForm(prev => ({ ...prev, selectedTags: [...prev.selectedTags, tagInput.trim()] }));
                            setTagInput("");
                        }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700"
                   >Add</button>
               </div>

               {/* Selected Tags Chips */}
               <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[40px]">
                  {form.selectedTags.length === 0 && <span className="text-xs text-gray-400 italic">No tags selected</span>}
                  {form.selectedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded border border-green-200 font-medium">
                        {tag}
                        <FaTimes className="cursor-pointer text-green-600 hover:text-green-900" onClick={() => removeTag(tag)}/>
                    </span>
                  ))}
               </div>

               {/* Suggestions */}
               <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-400 self-center">Suggestions:</span>
                  {availableTags.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => togglePredefinedTag(tag)}
                      className={`text-xs px-2 py-1 rounded border transition ${
                        form.selectedTags.includes(tag) ? "opacity-50 cursor-not-allowed bg-gray-100" : "bg-white hover:bg-gray-50 text-gray-600"
                      }`}
                      disabled={form.selectedTags.includes(tag)}
                    >
                      + {tag}
                    </button>
                  ))}
               </div>
            </div>

          </div>

          {/* 4. MARKETING & SEO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <FaBullhorn className="text-purple-600"/> Marketing & SEO
            </h2>
            <div className="space-y-3">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Title</label>
                  <input name="seoTitle" value={form.seoTitle} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Meta Title"/>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Description</label>
                  <textarea name="seoDesc" value={form.seoDesc} onChange={handleChange} rows="2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Meta Description"></textarea>
               </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (Settings & Images) ================= */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 1. STATUS & VISIBILITY */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b pb-2 flex items-center gap-2">
              <MdVisibility className="text-gray-600"/> Visibility
            </h2>
            
            <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
               <span className="text-sm font-bold text-gray-700">Status</span>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.active} onChange={() => toggle("active")} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
               </label>
            </div>

            <div className="space-y-2">
               {["showOnHome", "showOnMenu", "showOnShop"].map(key => (
                  <label key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                     <input type="checkbox" checked={form[key]} onChange={() => toggle(key)} className="w-4 h-4 rounded border-gray-300 text-blue-600"/>
                     <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                     </span>
                  </label>
               ))}
            </div>
          </div>

          {/* 2. CATEGORY TYPE */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hierarchy</label>
             <select name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                <option>Main Category</option>
                <option>Sub Category</option>
                <option>Collection</option>
             </select>
          </div>

          {/* 3. THUMBNAIL UPLOAD (Square) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b pb-2">Thumbnail (Icon)</h2>
             
             <div 
               onClick={() => thumbnailRef.current.click()} 
               className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition relative overflow-hidden group"
             >
                {thumbPreview ? (
                  <img src={thumbPreview} alt="Thumbnail" className="absolute inset-0 w-full h-full object-contain p-2" />
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-gray-400 text-2xl mb-2" />
                    <span className="text-xs text-gray-500">Upload Icon (1:1)</span>
                  </>
                )}
             </div>
             <input type="file" ref={thumbnailRef} hidden accept="image/*" onChange={(e) => handleImageChange(e, 'thumbnail')} />
          </div>

          {/* 4. BANNER UPLOAD (Rectangle) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b pb-2">Banner Image</h2>
             
             <div 
               onClick={() => bannerRef.current.click()} 
               className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition relative overflow-hidden group"
             >
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <FaImage className="text-gray-400 text-2xl mb-2" />
                    <span className="text-xs text-gray-500 text-center px-4">Upload Wide Banner (Desktop)</span>
                  </>
                )}
                {bannerPreview && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white text-xs font-bold">Change Banner</span>
                    </div>
                )}
             </div>
             <input type="file" ref={bannerRef} hidden accept="image/*" onChange={(e) => handleImageChange(e, 'banner')} />
          </div>

        </div>
      </div>
    </div>
  );
}