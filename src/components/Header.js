import React, { useEffect, useState, useMemo, useRef } from "react";
import logo from "../pic/logo.png";
import { FaChevronDown, FaShoppingCart, FaSearch } from "react-icons/fa";
import { FiHeart, FiUser } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";

export default function Header({ cartCount, onCartClick }) {


  const location = useLocation();

 

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const typingRef = useRef(null);
  const dropdownRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const placeholderTexts = useMemo(
    () => [
      "Search for Facewash...",
      "Try Hair Care...",
      "Explore Combos...",
      "Discover Skin Care...",
    ],
    []
  );

  const closeMobileMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

 if (location.pathname.startsWith("/admin")) {
    return null;
  }


  return (
    <>
      <div className="tc-offer-bar">
        <span
          id="offer-text"
          style={{
            opacity: fade ? 1 : 0,
            transition: "opacity 0.7s ease-in-out",
            whiteSpace: "nowrap"
          }}
        >
          {offers[index]}
        </span>
      </div>

     <nav className="bg-white shadow-md fixed w-full z-50 left-0 top-[42px]">


        {/* ========== DESKTOP HEADER (SINGLE ROW + LESS SPACE) ========== */}
        <div
          className="hidden md:flex items-center justify-between gap-8"
          style={{
            background: "linear-gradient(90deg, #fdf6e4, #ffffff)",
            padding: "6px 24px",   // space kam kiya
            borderBottom: "1px solid #e5e7eb"
          }}
        >

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Traditional Care" style={{ height: "42px" }} />
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#15803d" }}>
              Traditional Care
            </span>
          </div>

          {/* SEARCH */}
          <div style={{ flex: 1, maxWidth: "520px", margin: "0 20px" }}>
            <input
              type="text"
              value={searchTerm}
              placeholder={typedPlaceholder}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "2px solid #000",
                width: "100%",
                outline: "none"
              }}
            />
          </div>

          {/* NAV LINKS (same row) */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-semibold text-green-800 hover:text-green-600">
              Home
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="font-semibold text-green-800 hover:text-green-600 flex items-center gap-1"
              >
                All Products
                <FaChevronDown
                  className={`text-sm transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white shadow-xl rounded-lg w-52 py-3 z-50">
                  <Link to="/products/combo" className="block px-5 py-2 hover:bg-green-50">
                    Combo
                  </Link>
                  <Link to="/products/haircare" className="block px-5 py-2 hover:bg-green-50">
                    Hair Care
                  </Link>
                  <Link to="/products/facewash" className="block px-5 py-2 hover:bg-green-50">
                    Facewash
                  </Link>
                  <Link to="/products" className="block px-5 py-2 hover:bg-green-50">
                    All Products
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about" className="font-semibold text-green-800 hover:text-green-600">
              About
            </Link>

            <Link to="/contact" className="font-semibold text-green-800 hover:text-green-600">
              Contact
            </Link>
          </div>

          {/* RIGHT ICONS (NO SOCIAL ICONS NOW) */}
          <div className="flex items-center gap-6">
            <FiHeart style={{ fontSize: "24px", cursor: "pointer" }} />

            <div className="relative cursor-pointer" onClick={onCartClick}>
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    background: "#ef4444",
                    color: "white",
                    fontSize: "11px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>

            <Link
              to="/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "10px",
                border: "2px solid #000",
                color: "#000",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <FiUser style={{ fontSize: "20px" }} />
              Login
            </Link>
          </div>
        </div>

        {/* ========== MOBILE HEADER (UNCHANGED) ========== */}
        <div className="md:hidden bg-[#fdf6e4] border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow"
              >
                <svg
                  className="w-6 h-6 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow"
              >
                <FaSearch size={18} className="text-green-700" />
              </button>
            </div>

            <img src={logo} alt="Traditional Care" style={{ height: "34px" }} />

            <div className="flex items-center gap-4">
              <FiHeart size={22} />

              <div className="relative cursor-pointer" onClick={onCartClick}>
                <FaShoppingCart size={22} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-8px",
                      background: "#ef4444",
                      color: "white",
                      fontSize: "11px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              <Link to="/login">
                <FiUser size={22} />
              </Link>
            </div>
          </div>

          {searchOpen && (
            <div className="flex items-center gap-1 mt-1">
              <input
                type="text"
                value={searchTerm}
                placeholder={typedPlaceholder}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-xl outline-none"
              />

              <button
                onClick={() => setSearchOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div
            className="md:hidden fixed left-0 right-0 bottom-0 z-[999] bg-black/40"
            style={{ top: "72px" }}
          >
            <div
              className="bg-white w-full max-w-[320px] h-full shadow-xl px-4 py-4 overflow-y-auto"
              style={{ height: "calc(100vh - 72px)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-green-700 text-lg">
                  Traditional Care
                </span>

                <button
                  onClick={closeMobileMenu}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <Link
                to="/"
                className="block px-3 py-3 rounded hover:bg-green-50 font-medium"
                onClick={closeMobileMenu}
              >
                Home
              </Link>

              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-full flex justify-between items-center px-3 py-3 rounded hover:bg-green-50 font-medium"
              >
                Products
                <FaChevronDown
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-green-200 pl-3">
                  <Link to="/products/skincare" className="block py-2 text-sm hover:text-green-600" onClick={closeMobileMenu}>
                    Skin Care
                  </Link>
                  <Link to="/products/haircare" className="block py-2 text-sm hover:text-green-600" onClick={closeMobileMenu}>
                    Hair Care
                  </Link>
                  <Link to="/products/wellness" className="block py-2 text-sm hover:text-green-600" onClick={closeMobileMenu}>
                    Wellness
                  </Link>
                  <Link to="/products/more" className="block py-2 text-sm hover:text-green-600" onClick={closeMobileMenu}>
                    More…
                  </Link>
                </div>
              )}

              <Link
                to="/about"
                className="block px-3 py-3 rounded hover:bg-green-50 font-medium"
                onClick={closeMobileMenu}
              >
                About
              </Link>

              <Link
                to="/contact"
                className="block px-3 py-3 rounded hover:bg-green-50 font-medium"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-4 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <Link
                to="/login"
                className="mt-4 block text-center px-3 py-2 rounded-lg border border-green-600 text-green-600 font-semibold hover:bg-green-600 hover:text-white"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
