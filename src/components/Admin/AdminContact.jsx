import React, { useState, useMemo } from "react";
import { 
  FaEnvelope, FaPhoneAlt, FaSearch, FaFilter, FaCheck, FaReply, FaTrash, 
  FaUser, FaClock, FaCalendarAlt, FaEnvelopeOpenText 
} from "react-icons/fa";

// --- DUMMY DATA ---
const generateData = () => {
  const data = [];
  const subjects = ["Order Issue", "Product Query", "Collaboration", "Refund Request"];
  for (let i = 1; i <= 20; i++) {
    data.push({
      id: i,
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      phone: `+91 98765 432${i < 10 ? '0' + i : i}`,
      subject: subjects[i % 4],
      message: "Hello, I wanted to know about the bulk discount availability for your herbal hair oil products. Please reply soon.",
      date: `2026-01-${(i % 30) + 1}`,
      time: `${10 + (i % 12)}:30 ${i % 2 === 0 ? "AM" : "PM"}`,
      status: i % 3 === 0 ? "Replied" : i % 2 === 0 ? "Read" : "New"
    });
  }
  return data;
};

export default function AdminContact() {
  
  // --- STATES ---
  const [messages, setMessages] = useState(generateData());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

 
  // --- FILTER & PAGINATION ---
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchSearch = msg.name.toLowerCase().includes(search.toLowerCase()) || 
                          msg.email.toLowerCase().includes(search.toLowerCase()) || 
                          msg.subject.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" ? true : msg.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [messages, search, filterStatus]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMessages.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredMessages.length / rowsPerPage);

  // --- ACTIONS ---
  const markAsRead = (id) => {
    setMessages(prev => prev.map(msg => msg.id === id && msg.status === "New" ? { ...msg, status: "Read" } : msg));
  };

  const deleteMessage = (id) => {
    if(window.confirm("Delete this inquiry?")) setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleReply = (email, subject) => {
    window.location.href = `mailto:${email}?subject=Re: ${subject}`;
  };

  // --- HELPER: Status Color ---
  const getStatusColor = (status) => {
    switch(status) {
      case "New": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Read": return "bg-gray-100 text-gray-600 border-gray-200";
      case "Replied": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <FaEnvelopeOpenText className="text-blue-600"/> Customer Inquiries
           </h1>
           <p className="text-xs text-gray-500 mt-1">Manage support tickets and contact form submissions.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-xs font-bold text-gray-600">
           Total: {messages.length} | New: <span className="text-blue-600">{messages.filter(m=>m.status==="New").length}</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search Name, Email, Subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-3">
            <select className="border rounded-lg px-3 py-2 text-sm bg-white outline-none" onChange={(e)=>setFilterStatus(e.target.value)}>
               <option value="All">All Status</option>
               <option value="New">New</option>
               <option value="Read">Read</option>
               <option value="Replied">Replied</option>
            </select>
         </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="space-y-4">
         {currentRows.length > 0 ? (
            currentRows.map((msg) => (
               <div 
                 key={msg.id} 
                 className={`bg-white rounded-xl shadow-sm border p-5 transition-all hover:shadow-md ${msg.status === "New" ? "border-l-4 border-l-blue-500" : "border-gray-200"}`}
                 onClick={() => markAsRead(msg.id)}
               >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-4">
                     {/* User Info */}
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                           <FaUser/>
                        </div>
                        <div>
                           <h3 className="font-bold text-gray-800 text-sm">{msg.name}</h3>
                           <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer"><FaEnvelope/> {msg.email}</span>
                              <span className="flex items-center gap-1"><FaPhoneAlt/> {msg.phone}</span>
                           </div>
                        </div>
                     </div>

                     {/* Date & Status */}
                     <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                           <div className="text-xs font-bold text-gray-700 flex items-center justify-end gap-1"><FaCalendarAlt className="text-gray-400"/> {msg.date}</div>
                           <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1 mt-0.5"><FaClock/> {msg.time}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(msg.status)}`}>
                           {msg.status}
                        </span>
                     </div>
                  </div>

                  {/* Message Body */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                     <h4 className="text-xs font-bold text-gray-800 uppercase mb-1">Subject: {msg.subject}</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                     <button onClick={(e) => { e.stopPropagation(); handleReply(msg.email, msg.subject); }} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition">
                        <FaReply/> Reply
                     </button>
                     {msg.status === "New" && (
                        <button onClick={(e) => { e.stopPropagation(); markAsRead(msg.id); }} className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded transition">
                           <FaCheck/> Mark Read
                        </button>
                     )}
                     <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition">
                        <FaTrash/> Delete
                     </button>
                  </div>
               </div>
            ))
         ) : (
            <div className="text-center p-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
               No inquiries found matching your filters.
            </div>
         )}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
         <span className="text-xs text-gray-500">Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, filteredMessages.length)} of {filteredMessages.length}</span>
         <div className="flex gap-2">
            <button disabled={currentPage===1} onClick={()=>setCurrentPage(c=>c-1)} className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(c=>c+1)} className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50">Next</button>
         </div>
      </div>

    </div>
  );
}