import React, { useState } from 'react';
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Leaf, Sparkles 
} from 'lucide-react';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfbf7] font-sans text-gray-800 p-4 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#166534]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#d4a373]/10 rounded-full blur-[100px]"></div>

      {/* Main Card */}
      <div className="relative bg-white w-full max-w-[900px] min-h-[600px] rounded-[30px] shadow-2xl overflow-hidden flex">
        
        {/* =======================
            1. SIGN IN FORM (Left Side)
            Visible when isSignUp is FALSE
           ======================= */}
        <div className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 transition-all duration-700 ease-in-out bg-white z-10
          ${isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100 z-20'}`}>
          
          <div className="mb-8 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#166534]/10 text-[#166534] mb-4">
               <Leaf size={24} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#166534]">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-2">Log in to continue your wellness journey.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#166534] transition-colors" size={20} />
              <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] focus:ring-4 focus:ring-[#d4a373]/10 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400" />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#166534] transition-colors" size={20} />
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] focus:ring-4 focus:ring-[#d4a373]/10 rounded-xl py-3.5 pl-12 pr-12 outline-none transition-all placeholder:text-gray-400" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-[#166534]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
               <a href="#" className="text-xs font-bold text-[#166534] hover:underline">Forgot Password?</a>
            </div>

            <button className="w-full bg-gradient-to-r from-[#166534] to-[#12542b] text-white py-3.5 rounded-full font-bold shadow-xl shadow-green-900/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group">
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Mobile Only Switch */}
          <div className="mt-8 text-center md:hidden">
             <p className="text-sm text-gray-500">Don't have an account? <button onClick={toggleMode} className="font-bold text-[#166534]">Sign Up</button></p>
          </div>
        </div>


        {/* =======================
            2. SIGN UP FORM (Right Side)
            Visible when isSignUp is TRUE
           ======================= */}
        <div className={`absolute top-0 left-0 md:left-1/2 h-full w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 transition-all duration-700 ease-in-out bg-white z-10
          ${isSignUp ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'}`}>
          
          <div className="mb-6">
            <h2 className="font-serif text-3xl font-bold text-[#166534]">Create Account</h2>
            <p className="text-gray-400 text-sm mt-2">Join our community for exclusive benefits.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400" />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input type="password" placeholder="Password" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400" />
            </div>

            <button className="w-full bg-[#166534] text-white py-3.5 rounded-full font-bold shadow-lg shadow-green-900/20 hover:bg-[#14532d] hover:-translate-y-1 transition-all mt-4">
              Sign Up
            </button>
          </form>

          {/* Mobile Only Switch */}
          <div className="mt-8 text-center md:hidden">
             <p className="text-sm text-gray-500">Already a member? <button onClick={toggleMode} className="font-bold text-[#166534]">Sign In</button></p>
          </div>
        </div>


        {/* =======================
            3. OVERLAY PANEL (Green Slider)
            Desktop Only - Moves Left/Right
           ======================= */}
        <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50
          ${isSignUp ? '-translate-x-full rounded-r-[30px] rounded-l-[100px]' : 'translate-x-0 rounded-l-[30px] rounded-r-[100px]'}`}>
          
          <div className={`bg-[#166534] relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out flex items-center justify-center text-white
            ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>

            {/* CONTENT: Visible when showing Login Form (Overlay on Right) */}
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transition-all duration-700 top-0 right-0
               ${isSignUp ? 'translate-x-[20%] opacity-0' : 'translate-x-0 opacity-100'}`}>
               <Sparkles size={40} className="mb-4 text-[#d4a373]" />
               <h2 className="font-serif text-4xl font-bold mb-4">New Here?</h2>
               <p className="mb-8 text-white/80 font-light leading-relaxed">
                 Sign up and discover a new way to naturally heal your body and mind.
               </p>
               <button 
                 onClick={toggleMode}
                 className="px-10 py-3 border border-white rounded-full font-bold hover:bg-white hover:text-[#166534] transition-all"
               >
                 Create Account
               </button>
            </div>

            {/* CONTENT: Visible when showing Signup Form (Overlay on Left) */}
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transition-all duration-700 top-0 left-0
               ${isSignUp ? 'translate-x-0 opacity-100' : '-translate-x-[20%] opacity-0'}`}>
               <Leaf size={40} className="mb-4 text-[#d4a373]" />
               <h2 className="font-serif text-4xl font-bold mb-4">Welcome Back!</h2>
               <p className="mb-8 text-white/80 font-light leading-relaxed">
                 To keep connected with your personal wellness plan, please login.
               </p>
               <button 
                 onClick={toggleMode}
                 className="px-10 py-3 border border-white rounded-full font-bold hover:bg-white hover:text-[#166534] transition-all"
               >
                 Sign In
               </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;