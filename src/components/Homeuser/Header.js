import React, { useEffect, useState, useMemo, useRef } from "react";
import logo from "../../pic/logo.png"; // Ensure path is correct
import { Link, useLocation, useNavigate } from "react-router-dom";

// Premium Icons
import { 
  HiOutlineShoppingBag, 
  HiOutlineHeart, 
  HiOutlineUser, 
  HiOutlineSearch, 
  HiOutlineMenuAlt3, 
  HiX,
  HiChevronDown,
  HiOutlineLogout,
  HiUserCircle
} from "react-icons/hi";
import { apiLogout } from "../../api/authApi"; // Path check kar lena
export default function Header({ cartCount, onCartClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATES ---
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // --- AUTH CHECK LOGIC ---
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]); // Re-check on route change (e.g. after login redirect)

  // --- LOGOUT LOGIC ---
  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    // 1. Agar token hai, to backend se logout karo
    if (token) {
      try {
        await apiLogout(token); // API Call
      } catch (error) {
        console.log("Server logout failed, clearing local data anyway.");
      }
    }

    // 2. Frontend se data clear karo
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // 3. States reset karo
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    setIsOpen(false);
    
    // 4. Redirect karo
    navigate("/login"); 
    // window.location.reload(); // Zarurat nahi hai agar state sahi manage ho rahi hai, par rakh sakte ho safety ke liye
  };

  // Typing Logic
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const typingRef = useRef(null);

  const placeholderTexts = useMemo(
    () => [
      "Search for Facewash...",
      "Try Hair Care...",
      "Explore Combos...",
      "Discover Skin Care...",
    ],
    []
  );

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Typing Effect
  useEffect(() => {
    const text = placeholderTexts[placeholderIndex];
    let index = 0;
    clearInterval(typingRef.current);
    setTypedPlaceholder("");

    typingRef.current = setInterval(() => {
      setTypedPlaceholder(text.slice(0, index + 1));
      index++;
      if (index === text.length) {
        clearInterval(typingRef.current);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        }, 1500);
      }
    }, 80);
    return () => clearInterval(typingRef.current);
  }, [placeholderIndex, placeholderTexts]);

  // Offer Logic
  const offers = [
    "🌿 Limited Time — Get 30% OFF on all products!",
    "🔥 Flash Deal — Flat 25% OFF today only!",
    "🎁 Buy 2 Get 1 Free on Hair Care!",
    "🚚 Free Delivery on orders above ₹499!",
    "💚 100% Ayurvedic & Chemical Free!"
  ];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % offers.length);
        setFade(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileDropdownOpen(false);
    setSearchOpen(false);
    setProfileDropdownOpen(false);
  }, [location]);

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* ================= HEADER CONTAINER (FIXED) ================= */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        
        {/* 1. OFFER BAR */}
        <div className="bg-[#15803d] text-white text-[10px] sm:text-xs font-medium py-1.5 text-center tracking-wider h-[30px] flex items-center justify-center relative overflow-hidden">
          <span className={`transition-opacity duration-700 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {offers[index]}
          </span>
        </div>

        {/* 2. NAVBAR */}
        <nav className="bg-white border-b h-[65px] flex items-center relative overflow-visible">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full flex items-center justify-between">

            {/* --- LEFT: LOGO --- */}
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="text-lg md:text-xl font-bold text-[#15803d] tracking-tight">Traditional</span>
                <span className="text-[9px] md:text-[11px] font-bold text-[#c6a23d] tracking-[0.2em] uppercase">Care</span>
              </div>
            </Link>

            {/* --- MIDDLE: SEARCH BAR (Desktop) --- */}
            <div className="hidden md:block flex-1 max-w-[420px] mx-6">
              <div className="relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={typedPlaceholder}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#15803d] focus:ring-4 focus:ring-[#15803d]/10 transition-all"
                />
                <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-[#15803d]" />
              </div>
            </div>

            {/* --- MIDDLE: LINKS (Desktop) --- */}
            <div className="hidden lg:flex items-center gap-6 font-semibold text-[14px] text-gray-700">
              <Link to="/" className="hover:text-[#15803d] transition-colors relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#15803d] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* PRODUCTS DROPDOWN */}
              <div className="relative group h-[65px] flex items-center">
                <div className="flex items-center gap-1 cursor-pointer hover:text-[#15803d]">
                  Products
                  <HiChevronDown className="text-xs transition group-hover:rotate-180" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block z-[999999]">
                  <div className="bg-white rounded-xl shadow-xl w-52 border overflow-hidden">
                    <Link to="/products/haircare" className="block px-5 py-2 hover:bg-green-50">Hair Care</Link>
                    <Link to="/products/skincare" className="block px-5 py-2 hover:bg-green-50">Skin Care</Link>
                    <Link to="/products/facewash" className="block px-5 py-2 hover:bg-green-50">Facewash</Link>
                    <Link to="/products/combo" className="block px-5 py-2 hover:bg-green-50">Combos</Link>
                  </div>
                </div>
              </div>

              <Link to="/about" className="hover:text-[#15803d] transition-colors relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#15803d] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* --- RIGHT: ICONS (Desktop) --- */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/wishlist" className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-[#c6a23d] transition-all relative group">
                <HiOutlineHeart className="text-2xl" />
              </Link>

              <div className="relative group cursor-pointer p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-[#15803d] transition-all" onClick={onCartClick}>
                <HiOutlineShoppingBag className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#c6a23d] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* AUTH BUTTON OR PROFILE DROPDOWN */}
              {isLoggedIn ? (
                <div className="relative">
                  {/* LOGGED IN: Profile Icon */}
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-gray-200 hover:shadow-md hover:border-[#15803d] transition-all"
                  >
                    <div className="bg-[#15803d]/10 text-[#15803d] p-1 rounded-full">
                       <HiOutlineUser className="text-xl" />
                    </div>
                    <HiChevronDown className={`text-gray-500 text-xs transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[50]">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-[#15803d] truncate">User</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#15803d]">
                        <HiUserCircle className="text-lg" /> My Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left">
                        <HiOutlineLogout className="text-lg" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* NOT LOGGED IN: Login Button */
                <Link to="/login" className="flex items-center gap-2 bg-[#15803d] hover:bg-[#14532d] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md active:scale-95 transition-all">
                  <HiOutlineUser className="text-lg" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* --- MOBILE TOP BAR ICONS --- */}
            <div className="flex md:hidden items-center gap-1">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-700 active:scale-90">
                <HiOutlineSearch className="text-2xl" />
              </button>
              
              <div className="relative p-2 text-gray-700 active:scale-90" onClick={onCartClick}>
                <HiOutlineShoppingBag className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#c6a23d] text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>

              <button onClick={() => setIsOpen(true)} className="p-2 text-gray-800 active:scale-90 ml-1">
                <HiOutlineMenuAlt3 className="text-2xl" />
              </button>
            </div>

          </div>

          {/* MOBILE SEARCH BAR */}
          <div className={`absolute top-full left-0 w-full bg-white px-4 overflow-hidden transition-all duration-300 shadow-md ${searchOpen ? 'max-h-14 py-2 border-t border-gray-100' : 'max-h-0 py-0'}`}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#15803d]"
            />
          </div>
        </nav>
      </header>

      {/* ================= SPACER ================= */}
      <div className="h-[95px]"></div>

      {/* ================= MOBILE DRAWER MENU ================= */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

        <div className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#f9fafb]">
            <span className="text-lg font-bold text-[#15803d]">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-white rounded-full text-gray-500 shadow-sm hover:text-red-500">
              <HiX className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-gray-700 font-medium hover:bg-green-50 hover:text-[#15803d] rounded-xl transition-colors">
              Home
            </Link>
            
            {/* Mobile Dropdown */}
            <div>
              <button 
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-green-50 hover:text-[#15803d] rounded-xl"
              >
                Products
                <HiChevronDown className={`text-xs transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-4 overflow-hidden transition-all duration-300 ${mobileDropdownOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-l-2 border-green-100 pl-2 space-y-1 my-1">
                  <Link to="/products/haircare" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#15803d]">Hair Care</Link>
                  <Link to="/products/skincare" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#15803d]">Skin Care</Link>
                  <Link to="/products/facewash" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#15803d]">Facewash</Link>
                  <Link to="/products/combo" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#15803d]">Combos</Link>
                </div>
              </div>
            </div>

            {isLoggedIn && (
               <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-gray-700 font-medium hover:bg-green-50 hover:text-[#15803d] rounded-xl transition-colors">
                 My Profile
               </Link>
            )}

            <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-gray-700 font-medium hover:bg-green-50 hover:text-[#15803d] rounded-xl transition-colors">
              About Us
            </Link>
          </div>

          <div className="p-5 border-t border-gray-100 bg-[#f9fafb]">
            {isLoggedIn ? (
               <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl font-semibold shadow-sm transition-all">
                 <HiOutlineLogout className="text-xl" />
                 <span>Logout</span>
               </button>
            ) : (
               <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full bg-[#15803d] text-white py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-transform">
                 <HiOutlineUser className="text-xl" />
                 <span>Login / Sign Up</span>
               </Link>
            )}
          </div>

        </div>
      </div>
    </>
  );
}