import React, { useState } from "react";
import { 
  FaChartLine, FaBoxOpen, FaUsers, FaDownload, FaArrowUp, FaArrowDown, 
  FaCalendarAlt, FaMoneyBillWave 
} from "react-icons/fa";

// --- DUMMY DATA FOR CHARTS ---
const salesData = [40, 60, 45, 80, 55, 90, 70]; // Weekly sales
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AdminReports() {
  
  const [filter, setFilter] = useState("This Month");

  // --- TOP CARDS DATA ---
  const stats = [
    { title: "Total Revenue", value: "₹1,24,500", grow: "+12%", isUp: true, icon: <FaMoneyBillWave/>, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Orders", value: "1,450", grow: "+5%", isUp: true, icon: <FaBoxOpen/>, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Low Stock Items", value: "12", grow: "-2", isUp: false, icon: <FaArrowDown/>, color: "text-red-600", bg: "bg-red-100" },
    { title: "New Customers", value: "320", grow: "+18%", isUp: true, icon: <FaUsers/>, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaChartLine className="text-blue-600"/> Analytics & Reports
           </h1>
           <p className="text-xs text-gray-500 mt-1">Track business growth, inventory health, and customer insights.</p>
        </div>
        
        <div className="flex gap-3">
           <select 
             className="border rounded-lg px-3 py-2 text-xs bg-white outline-none font-bold text-gray-600"
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
           >
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
           </select>
           <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-black transition shadow-lg">
              <FaDownload/> Export Report
           </button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {stats.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
               <div className="flex justify-between items-start mb-2">
                  <div className={`p-3 rounded-lg ${s.bg} ${s.color} text-lg`}>{s.icon}</div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                     {s.grow}
                  </span>
               </div>
               <h3 className="text-2xl font-bold text-gray-800">{s.value}</h3>
               <p className="text-xs text-gray-500 uppercase font-bold mt-1">{s.title}</p>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* --- 1. SALES GROWTH CHART (Simulated) --- */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-800">Sales Overview</h3>
               <span className="text-xs text-gray-400 flex items-center gap-1"><FaCalendarAlt/> {filter}</span>
            </div>
            
            {/* Bar Chart Simulation */}
            <div className="flex items-end justify-between h-64 gap-2">
               {salesData.map((h, i) => (
                  <div key={i} className="w-full flex flex-col justify-end items-center gap-2 group">
                     <div 
                       className="w-full bg-blue-100 rounded-t-lg transition-all duration-500 group-hover:bg-blue-500 relative"
                       style={{ height: `${h}%` }}
                     >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                           ₹{h * 1000}
                        </div>
                     </div>
                     <span className="text-xs text-gray-500 font-bold">{labels[i]}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* --- 2. TOP PRODUCTS --- */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                     <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400">
                        #{i}
                     </div>
                     <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800">Herbal Hair Oil</h4>
                        <p className="text-xs text-gray-500">Hair Care • 120 Sold</p>
                     </div>
                     <span className="text-sm font-bold text-green-600">₹45k</span>
                  </div>
               ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
               View All Products
            </button>
         </div>

      </div>

      {/* --- 3. INVENTORY & STOCK HEALTH --- */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
         
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <FaBoxOpen className="text-orange-500"/> Inventory Health
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                  <span>In Stock</span> <span>85%</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
               </div>

               <div className="flex justify-between text-xs font-bold text-gray-500 mb-1 mt-4">
                  <span>Low Stock</span> <span>10%</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "10%" }}></div>
               </div>

               <div className="flex justify-between text-xs font-bold text-gray-500 mb-1 mt-4">
                  <span>Out of Stock</span> <span>5%</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "5%" }}></div>
               </div>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <FaUsers className="text-purple-500"/> Customer Insights
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
               <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="text-2xl font-bold text-purple-600">75%</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">Returning Users</p>
               </div>
               <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="text-2xl font-bold text-blue-600">25%</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">New Signups</p>
               </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
               <strong>Insight:</strong> Your retention rate is high! Customers love your <em>Hair Care</em> products. Consider launching a loyalty program for new users.
            </p>
         </div>

      </div>

    </div>
  );
}