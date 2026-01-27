import React, { useState, useEffect } from "react";
import { 
  FaSearch, FaGlobe, FaSave, FaGoogle, FaFacebook, FaTwitter, 
  FaTimes, FaInfoCircle, FaRobot, FaLink 
} from "react-icons/fa";

// --- DUMMY DATA FOR PAGES ---
const initialData = {
  home: {
    title: "Best Herbal Products Online | Nexus Ayurveda",
    desc: "Shop 100% natural and organic hair care, skin care products. Chemical free and certified ayurvedic solutions.",
    keywords: ["herbal", "ayurveda", "organic", "hair oil"],
    image: "",
    robots: "index, follow",
    canonical: "https://nexus-ayurveda.com/"
  },
  about: {
    title: "Our Story & Heritage | Nexus Ayurveda",
    desc: "Learn about our journey of bringing ancient ayurvedic wisdom to modern lifestyle.",
    keywords: ["heritage", "story", "founders"],
    image: "",
    robots: "index, follow",
    canonical: "https://nexus-ayurveda.com/about"
  },
  shop: {
    title: "Shop Traditional Care | All Products",
    desc: "Browse our wide range of shampoos, oils, and face creams.",
    keywords: ["shop", "buy online", "store"],
    image: "",
    robots: "index, follow",
    canonical: "https://nexus-ayurveda.com/shop"
  }
};

export default function AdminSEO() {
  
  const [selectedPage, setSelectedPage] = useState("home");
  const [formData, setFormData] = useState(initialData.home);
  const [keywordInput, setKeywordInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic"); // basic | social | advanced

  // Update form when page changes
  useEffect(() => {
    setFormData(initialData[selectedPage]);
  }, [selectedPage]);

  // --- HANDLERS ---
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Keyword on Enter
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.keywords.includes(keywordInput.trim())) {
        setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
      }
      setKeywordInput("");
    }
  };

  // Remove Keyword
  const removeKeyword = (tag) => {
    setFormData({ ...formData, keywords: formData.keywords.filter(k => k !== tag) });
  };

  const handleSave = () => {
    alert(`SEO Updated for ${selectedPage.toUpperCase()} page!`);
    // Here you would save 'formData' to your backend
  };

  // Character Count Color Helper
  const getLengthColor = (len, min, max) => {
    if (len === 0) return "text-gray-400";
    if (len >= min && len <= max) return "text-green-600";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaSearch className="text-blue-600"/> SEO Manager
           </h1>
           <p className="text-xs text-gray-500 mt-1">Optimize meta tags, social previews, and search visibility.</p>
        </div>
        <div className="flex gap-3 items-center bg-white p-2 rounded-lg border shadow-sm">
           <span className="text-xs font-bold text-gray-500 uppercase px-2">Editing:</span>
           <select 
             className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded px-3 py-1.5 outline-none focus:border-blue-500 font-bold uppercase"
             value={selectedPage}
             onChange={(e) => setSelectedPage(e.target.value)}
           >
              <option value="home">Home Page</option>
              <option value="about">About Us</option>
              <option value="shop">Shop / Catalog</option>
              <option value="contact">Contact Us</option>
              <option value="blog">Blog Section</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= LEFT: EDIT FORM ================= */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                 <button onClick={()=>setActiveTab("basic")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab==="basic"?"bg-white text-blue-600 border-t-2 border-t-blue-600":"text-gray-500 hover:text-gray-700"}`}>
                    <FaGoogle/> Basic SEO
                 </button>
                 <button onClick={()=>setActiveTab("social")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab==="social"?"bg-white text-purple-600 border-t-2 border-t-purple-600":"text-gray-500 hover:text-gray-700"}`}>
                    <FaFacebook/> Social Media
                 </button>
                 <button onClick={()=>setActiveTab("advanced")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab==="advanced"?"bg-white text-orange-600 border-t-2 border-t-orange-600":"text-gray-500 hover:text-gray-700"}`}>
                    <FaRobot/> Advanced
                 </button>
              </div>

              {/* --- TAB CONTENT --- */}
              <div className="p-6 space-y-5">
                 
                 {/* 1. BASIC SEO */}
                 {activeTab === "basic" && (
                    <div className="space-y-4 animate-fadeIn">
                       <div>
                          <div className="flex justify-between">
                             <label className="text-xs font-bold text-gray-500 uppercase">Meta Title</label>
                             <span className={`text-xs font-bold ${getLengthColor(formData.title.length, 30, 60)}`}>{formData.title.length} / 60</span>
                          </div>
                          <input 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Page Title"
                          />
                       </div>

                       <div>
                          <div className="flex justify-between">
                             <label className="text-xs font-bold text-gray-500 uppercase">Meta Description</label>
                             <span className={`text-xs font-bold ${getLengthColor(formData.desc.length, 120, 160)}`}>{formData.desc.length} / 160</span>
                          </div>
                          <textarea 
                            name="desc" 
                            value={formData.desc} 
                            onChange={handleChange} 
                            rows="3"
                            className="w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Brief description for search engines..."
                          ></textarea>
                       </div>

                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Keywords / Hashtags</label>
                          <div className="border rounded-lg p-2 bg-white flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500">
                             {formData.keywords.map((tag, i) => (
                                <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-blue-100">
                                   #{tag} <FaTimes className="cursor-pointer hover:text-red-500" onClick={() => removeKeyword(tag)}/>
                                </span>
                             ))}
                             <input 
                               value={keywordInput}
                               onChange={(e) => setKeywordInput(e.target.value)}
                               onKeyDown={handleKeywordKeyDown}
                               className="flex-1 text-sm outline-none min-w-[100px]"
                               placeholder="Type & Enter..."
                             />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">Press Enter to add tags. Used for meta keywords.</p>
                       </div>
                    </div>
                 )}

                 {/* 2. SOCIAL MEDIA (OG) */}
                 {activeTab === "social" && (
                    <div className="space-y-4 animate-fadeIn">
                       <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mb-4 flex gap-2">
                          <FaInfoCircle className="text-purple-600 mt-0.5"/>
                          <p className="text-xs text-purple-800">These settings control how your page looks when shared on Facebook, WhatsApp, Twitter, etc.</p>
                       </div>
                       
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Social Share Image (OG:Image)</label>
                          <div className="flex gap-4 mt-1">
                             <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                                <span className="text-xs text-gray-400">Preview</span>
                             </div>
                             <div className="flex-1">
                                <input type="file" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
                                <p className="text-[10px] text-gray-400 mt-2">Recommended size: 1200 x 630 pixels</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* 3. ADVANCED */}
                 {activeTab === "advanced" && (
                    <div className="space-y-4 animate-fadeIn">
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><FaLink/> Canonical URL</label>
                          <input 
                            name="canonical" 
                            value={formData.canonical} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg p-2 text-sm mt-1 bg-gray-50 font-mono"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><FaRobot/> Robots Meta Tag</label>
                          <select 
                            name="robots" 
                            value={formData.robots} 
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 text-sm mt-1 bg-white"
                          >
                             <option value="index, follow">Index, Follow (Recommended)</option>
                             <option value="noindex, follow">NoIndex, Follow</option>
                             <option value="index, nofollow">Index, NoFollow</option>
                             <option value="noindex, nofollow">NoIndex, NoFollow</option>
                          </select>
                       </div>
                    </div>
                 )}

                 {/* FOOTER ACTIONS */}
                 <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 transition">
                       <FaSave/> Save Changes
                    </button>
                 </div>

              </div>
           </div>
        </div>

        {/* ================= RIGHT: PREVIEW BOX ================= */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* GOOGLE PREVIEW */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                 <FaGoogle className="text-blue-500"/> Google Search Preview
              </h3>
              
              <div className="bg-white p-1 rounded">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="flex flex-col">
                       <span className="text-xs text-gray-800 font-medium">Nexus Ayurveda</span>
                       <span className="text-[10px] text-gray-500">{formData.canonical}</span>
                    </div>
                 </div>
                 <h4 className="text-xl text-blue-800 hover:underline cursor-pointer truncate font-medium">
                    {formData.title || "Page Title"}
                 </h4>
                 <p className="text-sm text-gray-600 mt-1 line-clamp-3 leading-snug">
                    {formData.desc || "Meta description will appear here..."}
                 </p>
              </div>
           </div>

           {/* SOCIAL PREVIEW */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                 <FaFacebook className="text-blue-700"/> Social Share Preview
              </h3>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                 <div className="h-32 bg-gray-200 w-full flex items-center justify-center text-gray-400 text-xs">
                    Image Preview (1200x630)
                 </div>
                 <div className="p-3 bg-white">
                    <p className="text-[10px] text-gray-500 uppercase">NEXUS-AYURVEDA.COM</p>
                    <h4 className="font-bold text-gray-900 text-sm mt-1 truncate">{formData.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{formData.desc}</p>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}