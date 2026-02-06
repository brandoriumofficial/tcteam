import React, { useState, useEffect } from "react";
import { 
  FaImages, FaVideo, FaPlus, FaEdit, FaTrash, FaPlay, FaSortNumericDown, FaLaptop
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bannerApi } from "../../api/banner/apiService";
import { API_URL } from "../../api/API_URL";
export default function AdminBanner() {
  
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Image");
  const [page, setPage] = useState("Homepage");
  const [section, setSection] = useState("Main Slider");
  const [order, setOrder] = useState(1);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [filterPage, setFilterPage] = useState("All");

  // --- LOAD DATA ---
  const fetchBanners = async () => {
    try {
      const data = await bannerApi.getAll();
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load banners");
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  // --- HANDLERS ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if(file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if(!title || (!mediaFile && !editId)) {
        toast.warning("Title & Media Required!");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("page", page);
    formData.append("section", section);
    formData.append("order", order);
    formData.append("link", link);
    formData.append("status", status);
    
    if(mediaFile) {
        formData.append("media", mediaFile);
    }

    try {
      if(editId) {
        formData.append("id", editId);
        await bannerApi.update(formData);
        toast.success("Banner Updated!");
      } else {
        await bannerApi.create(formData);
        toast.success("Banner Created!");
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      toast.error("Operation Failed");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this banner?")) {
        try {
            await bannerApi.delete(id);
            setBanners(prev => prev.filter(b => b.id !== id));
            toast.success("Deleted Successfully");
        } catch (error) {
            toast.error("Delete failed");
        }
    }
  };

  const openModal = (banner = null) => {
    if(banner) {
      setEditId(banner.id);
      setTitle(banner.title);
      setType(banner.type);
      setPage(banner.page);
      setSection(banner.section);
      setOrder(banner.sort_order);
      setLink(banner.link);
      setStatus(banner.status);
      setPreviewUrl(banner.media_full_url); // Use Full URL from API
      setMediaFile(null); // Reset file input
    } else {
      setEditId(null);
      setTitle("");
      setType("Image");
      setPage("Homepage");
      setSection("Main Slider");
      setOrder(banners.length + 1);
      setLink("");
      setStatus("Active");
      setPreviewUrl("");
      setMediaFile(null);
    }
    setIsModalOpen(true);
  };
const BACKEND_URL = "http://localhost/tcteam/backend";


  const filteredBanners = banners.filter(b => filterPage === "All" ? true : b.page === filterPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaImages className="text-purple-600"/> Banners & Video Ads
           </h1>
           <p className="text-xs text-gray-500 mt-1">Manage sliders, videos, and promotional content.</p>
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
       {filteredBanners.map((item) => {
 const imageUrl = item.media_full_url.startsWith("http")
  ? item.media_full_url.replace(
      "http://localhost",
      API_URL
    )
  : `${API_URL}${item.media_full_url}`;


  return (
    <div
      key={item.id}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition relative"
    >
      {/* MEDIA PREVIEW */}
      <div className="h-40 w-full bg-black relative flex items-center justify-center overflow-hidden">
        {item.type === "Video" ? (
          <>
            <video
              src={imageUrl}
              className="w-full h-full object-cover opacity-80"
              muted
              loop
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaPlay className="text-white text-3xl opacity-80" />
            </div>
          </>
        ) : (
          <img
            src={imageUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}

        {/* Status Badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${
            item.status === "Active"
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* INFO SECTION */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">
          {item.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-bold flex items-center gap-1">
            <FaLaptop className="text-[9px]" /> {item.page}
          </span>
          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-bold">
            {item.section}
          </span>
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded border font-bold flex items-center gap-1">
            <FaSortNumericDown /> Order: {item.sort_order}
          </span>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => openModal(item)}
            className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded flex items-center justify-center gap-1"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
})}

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
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Media Type</label>
                        <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full border rounded p-2 text-sm bg-white">
                           <option>Image</option><option>Video</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Upload File</label>
                        <div className="relative border rounded p-1.5 bg-white flex items-center overflow-hidden">
                           <input type="file" accept={type === "Video" ? "video/*" : "image/*"} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                           <span className="text-xs text-gray-500 truncate pl-1">{mediaFile ? "File Selected" : "Click to Upload"}</span>
                           <div className="ml-auto bg-gray-200 p-1 rounded">{type === "Video" ? <FaVideo/> : <FaImages/>}</div>
                        </div>
                     </div>
                  </div>

                  {/* Preview Area */}
                  {previewUrl && (
                     <div className="h-32 w-full bg-black rounded-lg overflow-hidden flex items-center justify-center border">
                        {type === "Video" ? (
                           <video src={previewUrl} controls className="h-full w-full object-contain" />
                        ) : (
                           <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        )}
                     </div>
                  )}

                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Title / Alt Text</label>
                     <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="e.g. Monsoon Sale Banner" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Target Page</label>
                        <select value={page} onChange={(e)=>setPage(e.target.value)} className="w-full border rounded p-2 text-sm bg-white">
                           <option>Homepage</option><option>Shop Page</option><option>Product Detail</option><option>Cart / Checkout</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Section</label>
                        <select value={section} onChange={(e)=>setSection(e.target.value)} className="w-full border rounded p-2 text-sm bg-white">
                           <option>Main Slider (Top)</option><option>Middle Banner</option><option>Bottom Promo</option><option>Sidebar Ad</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Sort Order</label>
                        <input type="number" value={order} onChange={(e)=>setOrder(e.target.value)} className="w-full border rounded p-2 text-sm" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Redirect Link</label>
                        <input value={link} onChange={(e)=>setLink(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="/shop/hair-oil" />
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Status</label>
                     <div className="flex gap-2">
                        <button onClick={()=>setStatus("Active")} className={`flex-1 py-2 text-xs font-bold rounded border ${status==="Active"?"bg-green-50 text-green-600 border-green-200":"bg-white text-gray-500"}`}>Active</button>
                        <button onClick={()=>setStatus("Inactive")} className={`flex-1 py-2 text-xs font-bold rounded border ${status==="Inactive"?"bg-red-50 text-red-600 border-red-200":"bg-white text-gray-500"}`}>Inactive</button>
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