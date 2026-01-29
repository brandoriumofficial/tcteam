import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  MdDashboard, MdKeyboardArrowDown, MdKeyboardArrowUp, MdLogout, MdLocalOffer, 
  MdReviews, MdInventory, MdPayments, MdLocalShipping, MdGroupAdd, MdImage, MdBarChart 
} from "react-icons/md";
import { 
  FaBoxOpen, FaClipboardList, FaTags, FaTimes 
} from "react-icons/fa";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [catalogOpen, setCatalogOpen] = useState(true);
  const location = useLocation();

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  // Close sidebar on mobile when link clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      {/* OVERLAY (Only visible on Mobile when Sidebar is Open) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static flex flex-col h-screen`}
      >
        
        {/* --- BRAND HEADER --- */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="bg-blue-50 p-2 rounded-lg">
               <FaBoxOpen className="text-xl" />
            </div>
            <span className="text-lg font-bold tracking-wide text-gray-800">NEXUS<span className="text-blue-600">ADMIN</span></span>
          </div>
          {/* Close Button (Mobile Only) */}
          <button className="md:hidden text-gray-400 hover:text-red-500 text-xl transition" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* --- SCROLLABLE MENU AREA --- */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          
          {/* DASHBOARD */}
          <Link 
            to="/admin" 
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <MdDashboard className="text-lg" />
            <span>Dashboard</span>
          </Link>

          {/* CATALOG DROPDOWN */}
          <div className="mt-1">
            <button 
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all font-medium text-sm group"
            >
              <div className="flex items-center gap-3 group-hover:text-gray-900">
                <FaClipboardList className="text-lg text-gray-500 group-hover:text-blue-500 transition" />
                <span>Catalog</span>
              </div>
              {catalogOpen ? <MdKeyboardArrowUp className="text-gray-400"/> : <MdKeyboardArrowDown className="text-gray-400"/>}
            </button>
            
            {/* Sub Menu with Animation */}
            <div className={`overflow-hidden transition-all duration-300 ${catalogOpen ? "max-h-64 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
              <div className="ml-9 pl-3 border-l-2 border-gray-100 space-y-1">
                {[
                  { path: "/admin/addproduct", name: "Add Product" },
                  { path: "/admin/products", name: "All Products" },
                  { path: "/admin/addcategory", name: "Add Category" },
                  { path: "/admin/categories", name: "Categories" }
                ].map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`block px-3 py-2 text-xs font-medium rounded-md transition-colors ${isActive(item.path) ? "text-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* DIVIDER: SALES & MARKETING */}
          <div className="my-4 border-t border-gray-100 relative">
             <span className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Management</span>
          </div>

          <Link to="/admin/coupons" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/coupons") ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <FaTags className="text-lg" /> <span>Coupons & Offers</span>
          </Link>

          <Link to="/admin/offer" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/offer") ? "bg-pink-50 text-pink-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdLocalOffer className="text-lg" /> <span>Smart Bundles</span>
          </Link>

          <Link to="/admin/banner" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/banner") ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdImage className="text-lg" /> <span>Banners / Ads</span>
          </Link>

          <Link to="/admin/referral" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/referral") ? "bg-yellow-50 text-yellow-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdGroupAdd className="text-lg" /> <span>Referral Program</span>
          </Link>

          {/* DIVIDER: OPERATIONS */}
          <div className="my-4 border-t border-gray-100 relative">
             <span className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operations</span>
          </div>

          <Link to="/admin/pagebuilder" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/pagebuilder") ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdInventory className="text-lg" /> <span>Page Builder</span>
          </Link>

          <Link to="/admin/conact" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/conact") ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdInventory className="text-lg" /> <span>conact</span>
          </Link>
            <Link to="/admin/orders" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/orders") ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdInventory className="text-lg" /> <span>orders</span>
          </Link>
             <Link to="/admin/orders/list" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/orders/list") ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdInventory className="text-lg" /> <span>orders list</span>
          </Link>
          <Link to="/admin/inventory" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/inventory") ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdInventory className="text-lg" /> <span>Inventory Stock</span>
          </Link>
             <Link to="/admin/brand" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/brand") ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdInventory className="text-lg" /> <span>Brand</span>
          </Link>

          <Link to="/admin/shipped" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/shipped") ? "bg-cyan-50 text-cyan-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdLocalShipping className="text-lg" /> <span>Shipping & Tracking</span>
          </Link>

          <Link to="/admin/payments" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/payments") ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdPayments className="text-lg" /> <span>Payments & COD</span>
          </Link>
          
          <Link to="/admin/seo" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/seo") ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdInventory className="text-lg" /> <span>seo</span>
          </Link>


          <Link to="/admin/review" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/review") ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdReviews className="text-lg" /> <span>Customer Reviews</span>
          </Link>

          <Link to="/admin/reports" onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive("/admin/reports") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <MdBarChart className="text-lg" /> <span>Reports & Analytics</span>
          </Link>

        </nav>

        {/* --- FOOTER (USER PROFILE) --- */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
             <img src="https://via.placeholder.com/40" alt="Admin" className="w-9 h-9 rounded-full border border-gray-300" />
             <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">Admin User</p>
                <p className="text-[10px] text-gray-500">Super Admin</p>
             </div>
          </div>
          <button className="flex items-center justify-center gap-2 w-full px-3 py-2 text-red-600 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all text-xs font-bold shadow-sm">
            <MdLogout /> Logout
          </button>
        </div>

      </aside>
    </>
  );
}