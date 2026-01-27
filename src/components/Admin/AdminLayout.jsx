import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">

      {/* ===== SIDEBAR ===== */}
      {/* Sidebar component handles its own fixed/static positioning based on isOpen prop */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* ===== RIGHT CONTENT WRAPPER ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* --- MOBILE HEADER (Visible only on Mobile) --- */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shadow-sm z-20 flex-shrink-0">
          <span className="font-bold text-lg text-gray-800">Admin Panel</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none transition"
          >
            <FaBars className="text-xl" />
          </button>
        </header>

        {/* --- MAIN PAGE CONTENT --- */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 scroll-smooth">
          {/* Outlet renders the child routes (Dashboard, Products, etc.) */}
          <Outlet />
        </main>

      </div>

    </div>
  );
}