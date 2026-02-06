import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { 
  FaBars, FaSearch, FaBell, FaDollarSign, FaShoppingCart, FaUsers, FaArrowUp, FaArrowDown 
} from "react-icons/fa";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import Sidebar from "./Sidebar";

// --- MOCK DATA ---
const chartData = [
  { name: "Mon", income: 4000, orders: 2400 },
  { name: "Tue", income: 3000, orders: 1398 },
  { name: "Wed", income: 5000, orders: 3800 },
  { name: "Thu", income: 2780, orders: 3908 },
  { name: "Fri", income: 1890, orders: 4800 },
  { name: "Sat", income: 2390, orders: 3800 },
  { name: "Sun", income: 3490, orders: 4300 },
];

const recentOrders = [
  { id: "#ORD-5501", product: "MacBook Pro M2", user: "Esther Howard", date: "12 Nov", amount: "$1,200", status: "Completed" },
  { id: "#ORD-5502", product: "iPhone 14 Pro", user: "Wade Warren", date: "12 Nov", amount: "$999", status: "Pending" },
  { id: "#ORD-5503", product: "Sony WH-1000XM5", user: "Jenny Wilson", date: "11 Nov", amount: "$350", status: "Cancelled" },
  { id: "#ORD-5504", product: "Apple Watch Ultra", user: "Guy Hawkins", date: "10 Nov", amount: "$799", status: "Completed" },
];

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, change, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
    </div>
    <div className="flex items-center mt-4 text-sm">
      <span className={`flex items-center font-semibold ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
        {change >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
        {Math.abs(change)}%
      </span>
      <span className="text-gray-400 ml-2">vs last month</span>
    </div>
  </div>
);

// --- HOME PAGE CONTENT ---
const DashboardHome = () => (
  <div className="space-y-6">
    {/* 4 Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Revenue" value="$48,250" change={12.5} icon={<FaDollarSign />} color="bg-blue-600" />
      <StatCard title="Total Orders" value="3,400" change={-2.4} icon={<FaShoppingCart />} color="bg-indigo-500" />
      <StatCard title="New Customers" value="856" change={8.1} icon={<FaUsers />} color="bg-purple-500" />
      <StatCard title="Avg Sale" value="$240" change={1.2} icon={<FaUsers />} color="bg-orange-500" />
    </div>

    {/* Chart Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Revenue Analytics</h2>
          <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500">
            <option>This Week</option>
            <option>Last Month</option>
          </select>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Widget */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Top Selling</h2>
        <div className="space-y-4">
          {["Nike Air Max", "Playstation 5", "Airpods Pro", "Samsung S23"].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-blue-600 font-bold shadow-sm">#{i+1}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item}</p>
                  <p className="text-xs text-gray-500">320 sales</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-700">$12k</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Orders Table */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
        <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-100">
              <th className="py-3 font-medium">Order ID</th>
              <th className="py-3 font-medium">Product</th>
              <th className="py-3 font-medium">Customer</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 font-bold text-blue-600">{order.id}</td>
                <td className="py-3">{order.product}</td>
                <td className="py-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {order.user.charAt(0)}
                  </div>
                  {order.user}
                </td>
                <td className="py-3 text-gray-500">{order.date}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 font-bold text-right">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- MAIN LAYOUT COMPONENT ---
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      {/* <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} /> */}

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FaBars className="text-lg" />
            </button>
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
              <FaSearch className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search orders, products..." className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
              <FaBell className="text-xl" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-9 h-9 rounded-full ring-2 ring-blue-100" />
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-800">John Doe</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            {/* Placeholder routes for navigation */}
            <Route path="*" element={<DashboardHome />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}