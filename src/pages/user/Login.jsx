// src/pages/Auth/AuthPage.jsx
import React, { useState } from 'react';
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Leaf, Sparkles, Phone
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import { apiRegister, apiLogin, apiGoogleLogin } from '../../api/authApi'; 

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setShowPassword(false);
    setForm({ name: "", email: "", password: "", phone: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle successful login/register - redirect based on user_type
  const handleAuthSuccess = (res) => {
    // Store in localStorage
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("user_type", res.user_type);

    toast.success(res.message || "Success!");

    // Redirect based on user type
    setTimeout(() => {
      if (res.user_type === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 500);
  };

  // Google Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await apiGoogleLogin({ token: credentialResponse.credential });
      handleAuthSuccess(res);
    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error(err?.message || "Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login Failed. Please try again.");
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // REGISTER
        const res = await apiRegister({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone
        });

        toast.success(res.message || "Registered successfully! Please Login.");
        toggleMode(); 
      } else {
        // LOGIN
        const res = await apiLogin({ 
          email: form.email, 
          password: form.password 
        });
        
        handleAuthSuccess(res);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      
      // Show validation errors if any
      if (err.errors) {
        const errorMessages = Object.values(err.errors).join(', ');
        toast.error(errorMessages);
      } else {
        toast.error(err?.message || "Action failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfbf7] font-sans text-gray-800 p-4 relative overflow-hidden">
      
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#166534]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#d4a373]/10 rounded-full blur-[100px]"></div>

      {/* Main Card */}
      <div className="relative bg-white w-full max-w-[900px] min-h-[600px] rounded-[30px] shadow-2xl overflow-hidden flex">
        
        {/* ========== SIGN IN FORM ========== */}
        <div className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 transition-all duration-700 ease-in-out bg-white z-10
          ${isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100 z-20'}`}>
          
          <div className="mb-6 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#166534]/10 text-[#166534] mb-4">
               <Leaf size={24} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#166534]">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-2">Log in to continue your wellness journey.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#166534] transition-colors" size={20} />
              <input 
                type="email" 
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email Address" 
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] focus:ring-4 focus:ring-[#d4a373]/10 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400" 
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#166534] transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Password" 
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] focus:ring-4 focus:ring-[#d4a373]/10 rounded-xl py-3.5 pl-12 pr-12 outline-none transition-all placeholder:text-gray-400" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-3.5 text-gray-400 hover:text-[#166534]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
               <a href="/forgot-password" className="text-xs font-bold text-[#166534] hover:underline">
                 Forgot Password?
               </a>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-[#166534] to-[#12542b] text-white py-3.5 rounded-full font-bold shadow-xl shadow-green-900/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  Sign In 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-6 flex flex-col items-center">
            <p className="text-xs text-gray-400 mb-3">Or continue with</p>
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
              />
            </div>
          </div>

          <div className="mt-6 text-center md:hidden">
             <p className="text-sm text-gray-500">
               Don't have an account? 
               <button onClick={toggleMode} className="font-bold text-[#166534] ml-1">Sign Up</button>
             </p>
          </div>
        </div>

        {/* ========== SIGN UP FORM ========== */}
        <div className={`absolute top-0 left-0 md:left-1/2 h-full w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 transition-all duration-700 ease-in-out bg-white z-10
          ${isSignUp ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'}`}>
          
          <div className="mb-4 text-center md:text-left">
            <h2 className="font-serif text-3xl font-bold text-[#166534]">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">Join our community for exclusive benefits.</p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#166534] transition-colors" size={18} />
              <input 
                type="text" 
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Full Name" 
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400" 
              />
            </div>
            
            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#166534] transition-colors" size={18} />
              <input 
                type="email" 
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email Address" 
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400" 
              />
            </div>

            {/* Phone */}
            <div className="relative group">
              <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#166534] transition-colors" size={18} />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Mobile Number"
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#166534] transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Password (min 6 chars)" 
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#d4a373] rounded-xl py-3 pl-12 pr-12 outline-none transition-all placeholder:text-gray-400" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-3.5 text-gray-400 hover:text-[#166534]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#166534] text-white py-3.5 rounded-full font-bold shadow-lg shadow-green-900/20 hover:bg-[#14532d] hover:-translate-y-1 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Google Login for Sign Up */}
          <div className="mt-4 flex flex-col items-center">
             <p className="text-xs text-gray-400 mb-2">Or join with</p>
             <div className="w-full flex justify-center">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signup_with"
                />
             </div>
          </div>

          <div className="mt-4 text-center md:hidden">
             <p className="text-sm text-gray-500">
               Already a member? 
               <button onClick={toggleMode} className="font-bold text-[#166534] ml-1">Sign In</button>
             </p>
          </div>
        </div>

        {/* ========== OVERLAY PANEL (Green Slider) ========== */}
        <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50
          ${isSignUp ? '-translate-x-full rounded-r-[30px] rounded-l-[100px]' : 'translate-x-0 rounded-l-[30px] rounded-r-[100px]'}`}>
          
          <div className={`bg-[#166534] relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out flex items-center justify-center text-white
            ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>

            {/* When showing Login Form */}
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

            {/* When showing Signup Form */}
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