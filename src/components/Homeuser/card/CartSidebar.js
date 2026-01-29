import React, { useState, useEffect } from "react";
import { 
  HiX, 
  HiMinus, 
  HiPlus, 
  HiOutlineTrash, 
  HiOutlineShoppingBag, 
  HiTag 
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function CartSidebar({
  isOpen,
  onClose,
  cart = [], // Props se jo cart aayega
  onQuantityChange, // Parent function (optional)
  onRemove,         // Parent function (optional)
}) {
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  // --- LOCAL STATE (To make buttons work instantly) ---
  const [localCart, setLocalCart] = useState([]);

  // --- DEMO DATA (Default if cart empty) ---
  const demoCart = [
    {
      id: 101,
      name: "Traditional Onion Hair Oil",
      final_price: 499,
      quantity: 1,
      image: "https://m.media-amazon.com/images/I/51LNBCOt4JL._UF1000,1000_QL80_.jpg",
      selectedVariation: { size: "200ml" }
    },
    {
      id: 102,
      name: "Ayurvedic Vitamin C Face Wash",
      final_price: 299,
      quantity: 2,
      image: "https://www.biotique.com/cdn/shop/products/Face-Glow-Fairness-Cream-50g.jpg",
      selectedVariation: { size: "100ml" }
    }
  ];

  // Initialize Cart on Load or Open
  useEffect(() => {
    if (cart && cart.length > 0) {
      setLocalCart(cart);
    } else {
      // Demo data load karo taaki aap test kar sako
      setLocalCart(demoCart);
    }
  }, [cart, isOpen]);


  // --- 1. HANDLE QUANTITY INCREASE / DECREASE ---
  const updateQuantity = (id, delta) => {
    setLocalCart(prevCart => 
      prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 }; // Min 1
        }
        return item;
      })
    );

    // Call parent if provided (Real app sync)
    if (onQuantityChange) onQuantityChange(id, delta);
  };

  // --- 2. HANDLE DELETE ITEM ---
  const removeItem = (id) => {
    setLocalCart(prevCart => prevCart.filter(item => item.id !== id));

    // Call parent if provided
    if (onRemove) onRemove(id);
  };

  const handleStartShopping = () => {
    onClose();
    navigate("/products");
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  // --- CALCULATE TOTAL DYNAMICALLY ---
  const subtotal = localCart.reduce(
    (acc, item) => acc + (item.final_price * item.quantity),
    0
  );

  return (
    <>
      <style>{`
        .buy-button { display: flex; justify-content: center; align-items: center; padding: 10px 15px; gap: 10px; background-color: #15803d; outline: 2px #15803d solid; outline-offset: -2px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.3s ease; width: 100%; margin-top: 12px; height: 44px; }
        .buy-button .text { color: white; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; transition: 0.3s; }
        .buy-button svg { fill: white; transition: 0.3s; }
        .buy-button:hover { background-color: transparent; }
        .buy-button:hover .text { color: #15803d; }
        .buy-button:hover svg { fill: #15803d; }
        .buy-button:active { transform: scale(0.98); }
      `}</style>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[999] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div
        className={`
          fixed top-0 right-0 h-[100dvh] 
          w-full sm:w-[360px] 
          bg-white shadow-xl z-[1000] 
          transform transition-transform duration-300 ease-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <HiOutlineShoppingBag className="text-xl text-[#15803d]" />
            <h2 className="text-lg font-bold text-gray-800">
              My Cart <span className="text-[#15803d] text-xs font-medium">({localCart.length})</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
            <HiX className="text-xl" />
          </button>
        </div>

        {/* --- ITEMS LIST --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9fafb]">
          {localCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
              <HiOutlineShoppingBag className="text-6xl text-gray-300" />
              <div>
                <p className="text-base font-semibold text-gray-600">Cart is empty</p>
                <p className="text-xs text-gray-400">Add items to get started</p>
              </div>
              <button onClick={handleStartShopping} className="px-6 py-2 bg-[#15803d] text-white rounded-md text-xs font-bold hover:bg-[#14532d] transition shadow mt-2">
                Start Shopping
              </button>
            </div>
          ) : (
            localCart.map((item) => {
              // Image Handling (Array or String)
              const img = Array.isArray(item.image) ? item.image[0] : item.image;
              const size = item.selectedVariation?.size;

              return (
                <div key={item.id} className="flex gap-3 p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-shadow">
                  
                  {/* Image */}
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-100 flex items-center justify-center">
                    <img src={img || "https://via.placeholder.com/100"} alt={item.name} className="w-full h-full object-contain p-0.5 mix-blend-multiply" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 leading-tight" title={item.name}>
                        {item.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">Size: <span className="font-medium text-gray-700">{size || "Std"}</span></p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[#15803d] font-bold text-sm">₹{item.final_price * item.quantity}</p>
                      
                      {/* --- CONTROLS (WORKING) --- */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-50 rounded border border-gray-200 h-6">
                          {/* MINUS */}
                          <button 
                            className="w-6 h-full flex items-center justify-center text-gray-600 hover:text-[#15803d] hover:bg-white rounded-l transition active:bg-gray-200"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <HiMinus className="text-[9px]" />
                          </button>
                          
                          <span className="w-6 text-center text-xs font-semibold text-gray-800">{item.quantity}</span>
                          
                          {/* PLUS */}
                          <button 
                            className="w-6 h-full flex items-center justify-center text-gray-600 hover:text-[#15803d] hover:bg-white rounded-r transition active:bg-gray-200"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <HiPlus className="text-[9px]" />
                          </button>
                        </div>

                        {/* DELETE */}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                        >
                          <HiOutlineTrash className="text-base" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- FOOTER --- */}
        {localCart.length > 0 && (
          <div className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 flex-shrink-0">
            
            {/* Promo Code */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full pl-8 pr-16 py-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-[#15803d] focus:bg-white transition-all"
              />
              <HiTag className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <button className="absolute right-1 top-1 bottom-1 px-3 bg-gray-900 text-white text-[10px] font-bold rounded hover:bg-black transition-colors">
                APPLY
              </button>
            </div>

            {/* Total */}
            <div className="flex justify-between items-end mb-1">
              <span className="text-gray-600 text-sm font-medium">Subtotal</span>
              <span className="text-lg font-bold text-[#15803d]">₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-right mb-1">Calculated at checkout</p>

            {/* Buy Now Button */}
            <button className="buy-button" onClick={handleCheckout}>
              <svg viewBox="0 0 16 16" className="bi bi-cart-check" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"></path>
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
              </svg>
              <span className="text">Buy Now</span>
            </button>

          </div>
        )}
      </div>
    </>
  );
}