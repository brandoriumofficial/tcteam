import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, 
  ArrowRight, Send, User, 
  MessageSquare, Sparkles, 
  Clock, CheckCircle, Leaf
} from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Consultation', // Default
    message: ''
  });

  const [activeField, setActiveField] = useState(null);

  // Topics as Pill Buttons instead of Dropdown
  const topics = ["Product Inquiry", "Consultation", "Order Status", "Partnership"];

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative bg-[#fefdf6] overflow-hidden py-24 font-sans selection:bg-[#166534] selection:text-white">
      
      {/* 🌿 1. BACKGROUND TEXTURES (The "Premium Paper" Feel) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }}>
      </div>
      
      {/* Organic Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#166534]/5 to-transparent rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4a373]/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#166534]/20 bg-white/50 backdrop-blur-sm text-[#166534] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles size={14} className="text-[#d4a373]" />
            We're Listening
          </div>
          <h2 className="font-serif text-5xl md:text-6xl text-[#166534] font-bold mb-6">
            Care Begins With a <br/>
            <span className="relative inline-block">
              <span className="relative z-10 text-[#d4a373] italic">Conversation</span>
              {/* Underline Decoration */}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#166534]/10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-gray-500 text-lg font-light">
            Whether you need a personalized ritual recommendation or just want to say hello, 
            our Vaidyas are ready to guide you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* 2️⃣ LEFT SIDE: Contact Methods (Stacked Cards) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* CARD 1: PHONE */}
            <div className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-[#166534] transform group-hover:scale-110 duration-700">
                <Phone size={100} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#166534]">
                    <Phone size={24} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#166534] text-white text-[10px] font-bold uppercase tracking-wide animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Online Now
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Talk to an Expert</p>
                <h3 className=" text-2xl text-[#166534] font-bold hover:text-[#d4a373] transition-colors cursor-pointer">
                  +91 987 654 3210
                </h3>
                <p className="text-xs text-gray-400 mt-2">Mon - Sat, 9:00 AM to 7:00 PM</p>
              </div>
            </div>

            {/* CARD 2: EMAIL */}
            <div className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-[#d4a373] transform group-hover:scale-110 duration-700">
                <Mail size={100} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#fffbeb] flex items-center justify-center text-[#d4a373] mb-4">
                  <Mail size={24} />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Drop us a line</p>
                <h3 className="font-serif text-2xl text-[#166534] font-bold hover:text-[#d4a373] transition-colors cursor-pointer">
                  care@traditional.com
                </h3>
                <p className="text-xs text-gray-400 mt-2">We usually respond within 2 hours.</p>
              </div>
            </div>

            {/* CARD 3: LOCATION (Mini Map Visual) */}
            <div className="group relative bg-[#166534] rounded-3xl p-8 shadow-xl text-white overflow-hidden cursor-pointer">
               {/* Background Map Pattern */}
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-105 transition-transform duration-700"></div>
               
               <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white mb-4">
                      <MapPin size={24} />
                    </div>
                    <p className="text-white/70 text-sm font-medium mb-1">Visit our Sanctuary</p>
                    <h3 className="font-serif text-xl font-bold leading-relaxed">
                      128 Heritage Road, <br/> Kerala, India
                    </h3>
                 </div>
                 <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-[#166534] transition-all">
                   <ArrowRight size={20} className="-rotate-45" />
                 </div>
               </div>
            </div>

          </div>

          {/* 3️⃣ RIGHT SIDE: Premium Form (The "Letter" Style) */}
          <div className="lg:col-span-7 relative">
            
            {/* Rotating Seal Badge */}
            <div className="hidden lg:flex absolute -top-6 -right-6 w-32 h-32 items-center justify-center z-20">
              <div className="absolute inset-0 border-2 border-[#d4a373] border-dashed rounded-full animate-spin-slow"></div>
              <div className="w-24 h-24 bg-[#166534] text-[#fefdf6] rounded-full flex flex-col items-center justify-center text-center shadow-lg">
                <span className="text-2xl font-bold">24h</span>
                <span className="text-[10px] uppercase tracking-wider">Response</span>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-[#f0f0f0] relative z-10">
              
              <form className="space-y-8">
                
                {/* 1. Name & Contact Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

  {/* NAME */}
  <div className="relative transition-all duration-300 md:col-span-2">
    <label className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-2 block ml-1">
      Your Name
    </label>

    <div
      className={`flex items-center bg-[#f8fcf9] rounded-2xl p-1 transition-all border 
      ${activeField === 'name'
        ? 'border-[#166534] ring-4 ring-[#166534]/5 bg-white'
        : 'border-transparent'}`}
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#d4a373] shadow-sm ml-1">
        <User size={18} />
      </div>

      <input
        type="text"
        name="name"
        onFocus={() => setActiveField('name')}
        onBlur={() => setActiveField(null)}
        className="w-full bg-transparent px-4 py-3 outline-none text-[#166534] font-medium placeholder-gray-400"
        placeholder="e.g. Aditi Sharma"
      />
    </div>
  </div>

  {/* EMAIL */}
  <div className="relative transition-all duration-300">
    <label className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-2 block ml-1">
      Email Address
    </label>

    <div
      className={`flex items-center bg-[#f8fcf9] rounded-2xl p-1 transition-all border 
      ${activeField === 'email'
        ? 'border-[#166534] ring-4 ring-[#166534]/5 bg-white'
        : 'border-transparent'}`}
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#d4a373] shadow-sm ml-1">
        <Mail size={18} />
      </div>

      <input
        type="email"
        name="email"
        onFocus={() => setActiveField('email')}
        onBlur={() => setActiveField(null)}
        className="w-full bg-transparent px-4 py-3 outline-none text-[#166534] font-medium placeholder-gray-400"
        placeholder="you@example.com"
      />
    </div>
  </div>

  {/* PHONE NUMBER */}
  <div className="relative transition-all duration-300 ">
    <label className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-2 block ml-1">
      Phone Number
    </label>

    <div
      className={`flex items-center bg-[#f8fcf9] rounded-2xl p-1 transition-all border 
      ${activeField === 'phone'
        ? 'border-[#166534] ring-4 ring-[#166534]/5 bg-white'
        : 'border-transparent'}`}
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#d4a373] shadow-sm ml-1">
        <Phone size={18} />
      </div>

      <input
        type="tel"
        name="phone"
        onFocus={() => setActiveField('phone')}
        onBlur={() => setActiveField(null)}
        className="w-full bg-transparent px-4 py-3 outline-none text-[#166534] font-medium placeholder-gray-400"
        placeholder="e.g. +91 98765 43210"
      />
    </div>
  </div>

</div>


                {/* 2. Topic Selection (Pill Buttons) */}
                <div>
                   <label className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-4 block ml-1">What can we help with?</label>
                   <div className="flex flex-wrap gap-3">
                     {topics.map((t) => (
                       <button
                         key={t}
                         type="button"
                         onClick={() => setFormState({...formState, topic: t})}
                         className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border
                           ${formState.topic === t 
                             ? 'bg-[#166534] text-white border-[#166534] shadow-md transform scale-105' 
                             : 'bg-[#f8fcf9] text-gray-500 border-transparent hover:border-[#166534]/30 hover:text-[#166534]'}`}
                       >
                         {t}
                       </button>
                     ))}
                   </div>
                </div>

                {/* 3. Message Area */}
                <div className={`relative transition-all duration-300`}>
                  <label className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-2 block ml-1">Your Message</label>
                  <div className={`relative bg-[#f8fcf9] rounded-3xl p-1 transition-all border ${activeField === 'message' ? 'border-[#166534] ring-4 ring-[#166534]/5 bg-white' : 'border-transparent'}`}>
                    <textarea 
                      rows="4"
                      name="message"
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField(null)}
                      className="w-full bg-transparent px-6 py-4 outline-none text-[#166534] font-medium placeholder-gray-400 resize-none"
                      placeholder="Tell us a bit more about what you're looking for..."
                    ></textarea>
                    <div className="absolute bottom-4 right-4 text-gray-300">
                      <MessageSquare size={20} />
                    </div>
                  </div>
                </div>

                {/* 4. Action Area */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                   <div className="flex items-center gap-2 text-gray-400 text-xs">
                     <CheckCircle size={14} className="text-[#166534]" />
                     <span>Your details are kept 100% confidential.</span>
                   </div>

                   <button 
                      type="button" 
                      className="w-full md:w-auto px-10 py-5 bg-[#166534] text-white rounded-2xl font-bold tracking-wide shadow-xl shadow-green-900/20 hover:shadow-2xl hover:bg-[#12542b] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden relative group"
                    >
                      <span className="relative z-10">Send Message</span>
                      <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                    </button>
                </div>

              </form>
            </div>
            
            {/* Background Decoration */}
            <Leaf className="absolute -bottom-12 -left-12 text-[#166534]/5 w-48 h-48 rotate-45 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;