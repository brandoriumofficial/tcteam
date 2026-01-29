import React, { useState, useEffect, useRef } from "react";

import {
  FaShoppingCart,
  FaBoxOpen,
  FaWarehouse,
  FaTruck,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaUndo,
  FaHeadset,
  FaLongArrowAltRight,
  FaChevronRight,  FaChevronLeft,
  FaArrowRight,
  FaStar,
  FaLock,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import img from "../../pic/trust.svg";
import be from "../../pic/be.svg";
import bag from "../../pic/bag.svg";
const trustItems = [
  { icon: img },
  { icon: be },
  { icon: bag },
];


const categories = [ 
  { name: "Facewash", img: "https://m.media-amazon.com/images/I/51LNBCOt4JL._UF1000,1000_QL80_.jpg" }, 
  { name: "Face Cream", img: "https://www.biotique.com/cdn/shop/products/Face-Glow-Fairness-Cream-50g.jpg?v=1671093167" }, 
  { name: "Hair Oil", img: "https://magicaljar.com/wp-content/uploads/2022/07/1-4-1000x1000.jpg" }, 
  { name: "Shampoo", img: "https://naturali.co.in/cdn/shop/files/Naturali_PDP_Experiment_Hair_Fall_Arrest_Shampoo-01.webp" }, 
  { name: "Conditioner", img: "https://m.media-amazon.com/images/I/41ExLtOFuKL._UF1000,1000_QL80_.jpg" }, 
  { name: "Moisturizer", img: "https://www.drsheths.com/cdn/shop/files/CVCOFM.png" }, 
  { name: "Hair Spray", img: "https://www.arata.in/cdn/shop/files/sea-salt-hair-texture-spray-50-ml-styling-product-932.webp" }
];

const concernCollage = [
  {
    id: "hair", title: "Hair Care", tagline: "Best for Hair Growth", link: "/products/haircare", layout: "style1", 
    images: ["https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg", "https://magicaljar.com/wp-content/uploads/2022/07/1-4-1000x1000.jpg", "https://naturali.co.in/cdn/shop/files/Naturali_PDP_Experiment_Hair_Fall_Arrest_Shampoo-01.webp"]
  },
  {
    id: "skin", title: "Skin Glow", tagline: "Radiance & Brightening", link: "/products/skincare", layout: "style2", 
    images: ["https://www.biotique.com/cdn/shop/products/Face-Glow-Fairness-Cream-50g.jpg?v=1671093167", "https://m.media-amazon.com/images/I/51LNBCOt4JL._UF1000,1000_QL80_.jpg", "https://images.mamaearth.in/catalog/product/v/i/vit_c_face_wash_1.jpg"]
  },
  {
    id: "body", title: "Body Care", tagline: "Deep Hydration Therapy", link: "/products/bodycare", layout: "style3", 
    images: ["https://m.media-amazon.com/images/I/61+R+8-qj+L._AC_UF1000,1000_QL80_.jpg", "https://www.forestessentialsindia.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/o/soundarya_soap.jpg", "https://www.kamaayurveda.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/k/o/kokum_almond_body_butter_1.jpg"]
  },
  {
    id: "combo", title: "Super Combos", tagline: "All-in-One Essentials", link: "/products/combos", layout: "style4", 
    images: ["https://m.media-amazon.com/images/I/51LNBCOt4JL._UF1000,1000_QL80_.jpg", "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg", "https://magicaljar.com/wp-content/uploads/2022/07/1-4-1000x1000.jpg"]
  }
];

const newLaunchesData = [ 
  { title: "Naturali Anti-Dandruff Conditioner", price: 305, oldPrice: 359, rating: 4.6, reviews: 0, img: "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg", detail: "Controls dandruff, reduces itchiness & nourishes scalp", type: "new", variants: ["200ML", "370ML"] }, 
  { title: "Naturali Anti-Frizz Shampoo", price: 453, oldPrice: 533, rating: 5, reviews: 7, img: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png", detail: "Smoothens frizz, adds shine & strengthens hair", discount: "20% OFF", offerEndTime: Date.now() + 2 * 60 * 60 * 1000, type: "new", variants: ["200ML", "370ML", "1L"] }, 
  { title: "Naturali Anti-Frizz Conditioner", price: 305, oldPrice: 359, rating: 4.75, reviews: 4, img: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png", hoverImg: "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg", detail: "Deeply conditions hair & prevents dryness", discount: "10% OFF", offerEndTime: Date.now() + 6 * 60 * 60 * 1000, type: "new", variants: ["200ML", "370ML"] }, 
  { title: "Naturali Anti-Frizz Hair Mask", price: 594, oldPrice: 699, rating: 5, reviews: 1, img: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png", detail: "Repairs damaged hair & locks in moisture", type: "new", variants: ["200GM", "400GM"] } 
];

const bestSellersData = [ 
  { title: "Traditional Care Onion Shampoo", price: 499, oldPrice: 599, rating: 4.8, reviews: 1240, img: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg", detail: "Reduces hair fall, boosts growth & strengthens roots", discount: "10% OFF", offerEndTime: Date.now() + 5 * 60 * 60 * 1000, type: "best", variants: ["200ML", "370ML", "1L"] }, 
  { title: "Traditional Care Anti-Dandruff Shampoo", price: 453, oldPrice: 533, rating: 4.7, reviews: 980, img: "https://static.wixstatic.com/media/efc433_64956fa734094daba96103d7d9ebea54~mv2.png", hoverImg: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png", detail: "Eliminates dandruff & soothes itchy scalp", type: "best", variants: ["200ML", "370ML"] }, 
  { title: "Traditional Care Hair Conditioner", price: 305, oldPrice: 359, rating: 4.75, reviews: 740, img: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png", hoverImg: "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg", detail: "Deep nourishment for smooth & silky hair", discount: "20% OFF", offerEndTime: Date.now() + 6 * 60 * 60 * 1000, type: "best", variants: ["200ML", "370ML"] }, 
  { title: "Traditional Care Hair Growth Serum", price: 649, oldPrice: 749, rating: 4.9, reviews: 560, img: "https://static.wixstatic.com/media/efc433_49c13bdabbf341d6b437d72e21dc7ca0~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg", detail: "Stimulates follicles & promotes faster growth", type: "best", variants: ["30ML", "50ML"] } 
];

/* ================= CUSTOM HOOK: AUTO SCROLL (VIEWPORT BASED) ================= */
const useMobileAutoScroll = (ref, itemCount, cardWidth = 316) => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const slider = ref.current;
    if (!slider) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    }, { threshold: 0.2 });

    observer.observe(slider);

    let intervalId;

    if (isVisible) {
      intervalId = setInterval(() => {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (slider.scrollLeft >= maxScroll - 10) {
          slider.scrollTo({ left: 0, behavior: 'smooth' }); 
        } else {
          slider.scrollBy({ left: cardWidth, behavior: 'smooth' }); 
        }
      }, 2500); // Speed
    }

    const handleScroll = () => {
      const centerPosition = slider.scrollLeft + (slider.clientWidth / 2);
      const index = Math.floor(centerPosition / cardWidth) % itemCount;
      setCenterIndex(index);
    };

    slider.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
      slider.removeEventListener("scroll", handleScroll);
    };
  }, [ref, itemCount, isVisible, cardWidth]);

  return centerIndex;
};

/* ================= PRODUCT CARD COMPONENT ================= */
const useCountdown = (endTime) => {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => { if (!endTime) return; const interval = setInterval(() => { const diff = endTime - Date.now(); if (diff <= 0) { clearInterval(interval); setTime({ h: 0, m: 0, s: 0 }); return; } setTime({ h: Math.floor((diff / (1000 * 60 * 60)) % 24), m: Math.floor((diff / (1000 * 60)) % 60), s: Math.floor((diff / 1000) % 60) }); }, 1000); return () => clearInterval(interval); }, [endTime]); return time; };

const ProductCard = ({ item, isCenter = false }) => {
  const [hovered, setHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(item.variants ? item.variants[0] : "Standard");
  const time = useCountdown(item.offerEndTime);
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => { if (quantity > 1) setQuantity((prev) => prev - 1); };

  const mobileClass = isCenter 
    ? "scale-105 shadow-[0_20px_40px_rgba(47,125,50,0.25)] border-[#c6a23d] z-10" 
    : "scale-95 opacity-90 border-[#e7e2c7] z-0";

  return (
    <div className={`flex flex-col items-center text-center bg-white rounded-3xl p-3 sm:p-5 transition-all duration-500 ease-in-out min-w-[300px] sm:min-w-[330px] md:min-w-auto shrink-0 ${mobileClass} md:scale-100 md:opacity-100 md:hover:shadow-[0_16px_40px_rgba(47,125,50,0.25)] origin-center`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="w-full flex justify-between items-center mb-2 px-1 h-[25px]"><span className="bg-[#f0e6d2] text-[10px] sm:text-xs px-2 py-1 rounded-md text-[#4a3018] font-bold uppercase tracking-wider border border-[#d4c5a9]">{item.discount ? item.discount : item.type === "new" ? "New Launch" : "Best Seller"}</span>{item.offerEndTime && (<span className="bg-[#4a3018] text-white text-[10px] px-2 py-1 rounded-md font-mono tracking-widest">{String(time.h).padStart(2, "0")}:{String(time.m).padStart(2, "0")}:{String(time.s).padStart(2, "0")}</span>)}</div>
      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-transparent shrink-0 mb-2"><img src={item.img} alt={item.title} className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${hovered ? "scale-105" : "scale-100"}`} /><img src={item.hoverImg} alt="hover" className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-110"}`} /><div className={`absolute inset-0 bg-black/40 flex items-center justify-center px-6 transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}><p className="text-white text-sm">{item.detail}</p></div></div>
      <h3 className="mt-2 text-sm sm:text-base font-semibold text-[#2f7d32] leading-snug line-clamp-2 h-[42px] flex items-center justify-center">{item.title}</h3>
      <div className="flex items-center justify-center gap-1 mt-1 text-xs sm:text-sm"><div className="flex text-[#c6a23d]">{Array.from({ length: 5 }).map((_, idx) => (<FaStar key={idx} className={idx < Math.round(item.rating) ? "text-[#c8a14b]" : "text-gray-300"} />))}</div><span className="ml-1 font-medium">{item.rating}</span><span className="text-gray-400 mx-1">|</span><span className="text-gray-500">{item.reviews || 0} reviews</span></div>
      <div className="w-full mt-2 flex flex-col items-center gap-1"><p className="text-sm sm:text-base font-bold text-gray-800">MRP: ₹ {item.price}<span className="line-through text-gray-400 ml-2 font-normal text-xs">₹ {item.oldPrice}</span></p><div className="relative inline-block mb-1"><select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)} className="appearance-none bg-[#fffbf2] border border-[#e0d6c2] text-gray-800 font-bold text-[11px] sm:text-xs py-1 pl-3 pr-7 rounded-full focus:outline-none focus:border-[#c8a14b] cursor-pointer uppercase">{item.variants && item.variants.map((variant) => <option key={variant} value={variant}>{variant}</option>)}</select><FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={12} /></div></div>
      <div className="w-full flex items-center justify-between gap-3 mt-3 mt-auto"><div className="flex items-center bg-[#f2efe4] rounded-lg h-[45px] w-[80px] sm:w-[85px] justify-between px-1 shrink-0"><button onClick={decreaseQty} className="w-7 h-full flex items-center justify-center text-lg text-gray-600 hover:text-black pb-1">−</button><span className="font-bold text-gray-800 text-sm">{quantity}</span><button onClick={increaseQty} className="w-7 h-full flex items-center justify-center text-lg text-gray-600 hover:text-black pb-1">+</button></div><button className="custom-cart-btn"><div className="icon-wrapper"><svg className="cart-icon" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" className="product-icon"><path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"></path></svg></div><span className="text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap">ADD TO CART</span></button></div>
    </div>
  );
};

export default function NewLaunches() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const collageRef = useRef(null); 
  const newLaunchRef = useRef(null);
  const bestSellerRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); 

  // Auto Scroll Categories (Desktop)
  useEffect(() => {
    if(window.innerWidth < 768) return; 
    const slider = sliderRef.current;
    let animationFrameId;
    const autoScroll = () => {
      if (slider && !isHovered) {
        slider.scrollLeft += 1;
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) slider.scrollLeft = 0;
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };
    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const scroll = (dir) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const handleCollageScroll = (direction, e) => {
    e.stopPropagation(); 
    let newIndex = activeIndex === null ? 0 : activeIndex;
    if (direction === "left") newIndex = Math.max(0, newIndex - 1);
    else newIndex = Math.min(concernCollage.length - 1, newIndex + 1);
    setActiveIndex(newIndex);
    if (collageRef.current) {
      const card = collageRef.current.children[newIndex];
      if (card) {
        const scrollTo = card.offsetLeft - (collageRef.current.clientWidth / 2) + (card.clientWidth / 2);
        collageRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
      }
    }
  };

  // --- MOBILE DATA HANDLING ---
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const mobileNewLaunches = isMobile ? [...newLaunchesData, ...newLaunchesData, ...newLaunchesData] : newLaunchesData;
  const mobileBestSellers = isMobile ? [...bestSellersData, ...bestSellersData, ...bestSellersData] : bestSellersData;
  
  // Create Mobile Concern Data (Triplicated)
  const mobileConcernData = isMobile ? [...concernCollage, ...concernCollage, ...concernCollage] : concernCollage;

  // --- USE HOOK FOR AUTO SCROLL (Mobile) ---
  const nlCenterIndex = useMobileAutoScroll(newLaunchRef, newLaunchesData.length);
  const bsCenterIndex = useMobileAutoScroll(bestSellerRef, bestSellersData.length);
  // Separate scroll hook for concern collage (width different ~ 85vw or 90vw)
  // Assuming width is roughly 90vw (approx 350-380px on mobile). We'll approximate or use element width.
  // Using a separate simple auto-scroll effect for concern collage since it doesn't need center zoom index
  
  useEffect(() => {
    if (!isMobile) return;
    const slider = collageRef.current;
    if (!slider) return;

    let intervalId;
    
    // Intersection Observer to run only when visible
    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            intervalId = setInterval(() => {
                const cardWidth = slider.children[0]?.clientWidth + 32 || 350; // card width + gap
                if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 10) {
                    slider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }, 2500);
        } else {
            clearInterval(intervalId);
        }
    }, { threshold: 0.2 });

    observer.observe(slider);

    return () => {
        clearInterval(intervalId);
        observer.disconnect();
    };
  }, [isMobile]);


  return (
    <>
      <style>{`
        /* --- GLOBAL STYLES --- */
        .custom-cart-btn { flex: 1; height: 45px; border: none; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 10px; color: white; font-weight: 500; position: relative; background: linear-gradient(135deg, #6b9a4c 0%, #2f7d32 100%); box-shadow: 0 5px 15px rgba(47, 125, 50, 0.3); transition: all 0.3s ease-in-out; cursor: pointer; overflow: hidden; }
        .custom-cart-btn:active { transform: scale(0.96); }
        .icon-wrapper { position: relative; width: 1em; height: 1em; display: flex; align-items: center; justify-content: center; }
        .cart-icon { z-index: 2; width: 100%; height: 100%; }
        .product-icon { position: absolute; width: 12px; border-radius: 3px; left: 1px; bottom: 2px; opacity: 0; z-index: 1; fill: rgb(211, 211, 211); }
        .custom-cart-btn:hover .product-icon { animation: slide-in-top 1.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes slide-in-top { 0% { transform: translateY(-25px); opacity: 1; } 100% { transform: translateY(0) rotate(-90deg); opacity: 1; } }
        .custom-cart-btn:hover .cart-icon { animation: slide-in-left 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes slide-in-left { 0% { transform: translateX(-5px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .marquee-section {padding: 12px 0; overflow: hidden; position: relative; color: white;  }
        .marquee-section::before, .marquee-section::after { content: ""; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 10; pointer-events: none; }
        .marquee-section::before { left: 0; background: linear-gradient(to right, #FDF6E4, transparent); }
        .marquee-section::after { right: 0; background: linear-gradient(to left, #FDF6E4, transparent); }
        .marquee-wrapper { display: flex; width: 100%; }
        .marquee-row { display: flex; width: max-content; align-items: center; }
        .marquee-item { display: flex; align-items: center; gap: 8px; margin: 0 45px; transition: all 0.3s ease; opacity: 0.9; }
        .marquee-item:hover { opacity: 1; transform: translateY(-1px); text-shadow: 0 0 8px rgba(251, 191, 36, 0.3); }
        .marquee-icon {  color: #fbbf24; }
        .marquee-text { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #ecfdf5; white-space: nowrap; }
        .separator { color: rgba(251, 191, 36, 0.4); font-size: 1.5rem; line-height: 0; margin-top: -3px; }
        .scroll-left { animation: scrollLeft 60s linear infinite; }
        .marquee-wrapper:hover .marquee-row { animation-play-state: paused; }
        @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      {/* <div className="marquee-section">
        <div className="marquee-wrapper">
          <div className="marquee-row scroll-left">
          {[...trustItems, ...trustItems, ...trustItems, ...trustItems].map((item, i) => (
  <div className="marquee-item" key={i}>
    <img
      src={item.icon}
      alt="trust"
      className="marquee-icon w-full h-full object-contain"
    />
  </div>
))}

          </div>
        </div>
      </div> */}

      {/* NEW LAUNCHES */}
      <section className="bg-[#fdf6e4] py-6 px-4">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-[#2f7d32] mb-6 md:mb-8 text-center md:text-left">New Launches</h2>
          <div 
            ref={newLaunchRef}
            className="flex gap-4 pb-4 px-2 overflow-x-auto scroll-smooth scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8"
          >
            {mobileNewLaunches.map((item, i) => (
              <ProductCard key={i} item={item} isCenter={i % newLaunchesData.length === nlCenterIndex} />
            ))}
          </div>
        </div>
      </section>

      {/* ZIG-ZAG FEATURE */}
      <section className="bg-[#fdf6e4] py-6 overflow-hidden border-t border-[#e0d6c2]">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2 relative h-[350px] md:h-[400px] flex justify-center items-center">
            <div className="absolute w-[200px] h-[280px] md:w-[260px] md:h-[340px] bg-white p-1.5 shadow-lg rounded-xl left-0 md:left-2 top-1/2 -translate-y-1/2 transform -rotate-[15deg] z-10 transition-all duration-300 ease-out hover:rotate-0 hover:scale-105 hover:z-50 cursor-pointer border-4 border-white"><img src="https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg" alt="Herbal" className="w-full h-full object-cover rounded-lg"/></div>
            <div className="absolute w-[200px] h-[280px] md:w-[260px] md:h-[340px] bg-white p-1.5 shadow-xl rounded-xl left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ease-out hover:scale-105 hover:z-50 cursor-pointer border-4 border-white"><img src="https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg" alt="Natural" className="w-full h-full object-cover rounded-lg"/></div>
            <div className="absolute w-[200px] h-[280px] md:w-[260px] md:h-[340px] bg-white p-1.5 shadow-lg rounded-xl right-0 md:right-2 top-1/2 -translate-y-1/2 transform rotate-[15deg] z-10 transition-all duration-300 ease-out hover:rotate-0 hover:scale-105 hover:z-50 cursor-pointer border-4 border-white"><img src="https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png" alt="Ayurvedic" className="w-full h-full object-cover rounded-lg"/></div>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#2f7d32] leading-tight">The Essence of <span className="text-[#c6a23d]">True Ayurveda</span></h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg mx-auto md:mx-0">At <strong>Traditional Care</strong>, we craft formulas from raw, potent herbs sourced from nature. Free from harsh chemicals, providing purity in every drop.</p>
            <div className="pt-3 flex justify-center md:justify-end pr-0 md:pr-10">
              <button className="flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-[#c6a23d] text-[#c6a23d] font-bold text-sm md:text-base rounded-full hover:bg-[#c6a23d] hover:text-black transition-all duration-300 shadow-md hover:shadow-xl group tracking-wide">EXPLORE MORE <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="py-6 bg-white shadow-inner relative border-t border-[#e0d6c2]">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0d2340] text-center mb-6 tracking-tight">Shop by <span className="text-[#15803d]">Category</span></h2>
          <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#15803d] hover:bg-[#15803d] hover:text-white transition-all duration-300 -ml-2 md:-ml-6 opacity-0 group-hover:opacity-100"><FaChevronLeft size={20} /></button>
            <div className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide py-4 px-2" ref={sliderRef} style={{ scrollBehavior: isHovered ? "smooth" : "auto" }}>
              {[...categories, ...categories, ...categories].map((item, index) => (
                <div key={index} className="flex-shrink-0 flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-transparent group-hover:border-[#c6a23d] shadow-md transition-all duration-300 relative bg-white"><img src={item.img} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div></div>
                  <p className="mt-4 text-sm md:text-lg font-semibold text-[#0d2340] group-hover:text-[#15803d] transition-colors">{item.name}</p>
                </div>
              ))}
            </div>
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#15803d] hover:bg-[#15803d] hover:text-white transition-all duration-300 -mr-2 md:-mr-6 opacity-0 group-hover:opacity-100"><FaChevronRight size={20} /></button>
          </div>
        </div>
      </section>

      {/* SHOP BY CONCERN (Mobile: Auto Scroll, No Buttons) */}
      <section className="bg-[#fdf6e4] py-8 border-t border-[#e0d6c2] w-full">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between mb-6 border-b border-[#e0d6c2] pb-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0d2340]">Shop by <span className="text-[#15803d]">Concern</span></h2>
          </div>

          <div 
            ref={collageRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-2 pb-10 pt-4 items-stretch w-full"
          >
            {mobileConcernData.map((card, index) => (
              <div 
                key={index} 
                onClick={(e) => { e.stopPropagation(); navigate(card.link); }} 
                className={`
                  group relative snap-center shrink-0 
                  w-[85vw] md:w-[45%] lg:w-[30%]
                  overflow-hidden rounded-[2.5rem] p-6 
                  bg-white border border-transparent hover:border-[#c6a23d]/30
                  transition-all duration-500 transform
                  cursor-pointer shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] 
                  hover:shadow-[0_20px_50px_-10px_rgba(47,125,50,0.25)] hover:-translate-y-2
                `}
              >
                <div className="absolute -top-4 -right-4 bg-gradient-to-bl from-[#2f5d3b] to-[#1a3826] h-8 w-8 rounded-full transition-transform duration-700 ease-out scale-1 origin-center group-hover:scale-[35] -z-0"></div>
                <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center bg-gradient-to-bl from-[#2f5d3b] to-[#1a3826] rounded-bl-[2rem] z-10 shadow-lg">
                   <FaArrowRight className="text-[#c6a23d] text-sm mr-2 mb-2 group-hover:text-white transition-colors" />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-2xl font-bold text-[#0d2340] leading-none group-hover:text-[#f3e9d2] transition-colors duration-500 drop-shadow-sm">{card.title}</h3>
                        <p className="text-sm text-[#15803d] mt-1 font-bold uppercase tracking-widest group-hover:text-[#c6a23d] transition-colors duration-500">{card.tagline}</p>
                      </div>
                    </div>
                    <div className="h-[280px] w-full relative bg-gray-50/80 rounded-[2rem] p-2 group-hover:bg-white/10 group-hover:backdrop-blur-md transition-all duration-500 border border-transparent group-hover:border-white/10">
                      {card.layout === "style1" && (
                        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
                          <div className="col-span-2 row-span-2 rounded-[1.5rem] overflow-hidden shadow-sm"><img src={card.images[0]} className="w-full h-full object-cover" /></div>
                          <div className="col-span-1 row-span-1 rounded-[1rem] overflow-hidden shadow-sm"><img src={card.images[1]} className="w-full h-full object-cover" /></div>
                          <div className="col-span-1 row-span-1 rounded-[1rem] overflow-hidden shadow-sm"><img src={card.images[2]} className="w-full h-full object-cover" /></div>
                        </div>
                      )}
                      {card.layout === "style2" && (
                        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
                          <div className="col-span-1 row-span-1 rounded-[1rem] overflow-hidden shadow-sm"><img src={card.images[1]} className="w-full h-full object-cover" /></div>
                          <div className="col-span-1 row-span-1 rounded-[1rem] overflow-hidden shadow-sm"><img src={card.images[2]} className="w-full h-full object-cover" /></div>
                          <div className="col-span-2 row-span-2 col-start-2 row-start-1 rounded-[1.5rem] overflow-hidden shadow-sm"><img src={card.images[0]} className="w-full h-full object-cover" /></div>
                        </div>
                      )}
                      {card.layout === "style3" && (
                        <div className="grid grid-cols-3 gap-2 h-full">
                          <div className="rounded-[1.5rem] overflow-hidden shadow-sm mt-4"><img src={card.images[0]} className="w-full h-full object-cover" /></div>
                          <div className="rounded-[1.5rem] overflow-hidden shadow-sm mb-4"><img src={card.images[1]} className="w-full h-full object-cover" /></div>
                          <div className="rounded-[1.5rem] overflow-hidden shadow-sm mt-4"><img src={card.images[2]} className="w-full h-full object-cover" /></div>
                        </div>
                      )}
                      {card.layout === "style4" && (
                        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                          <div className="col-span-1 row-span-2 rounded-[1.5rem] overflow-hidden shadow-sm"><img src={card.images[0]} className="w-full h-full object-cover" /></div>
                          <div className="col-span-1 row-span-1 rounded-[1rem] overflow-hidden shadow-sm"><img src={card.images[1]} className="w-full h-full object-cover" /></div>
                          <div className="col-span-1 row-span-1 rounded-[1rem] overflow-hidden shadow-sm"><img src={card.images[2]} className="w-full h-full object-cover" /></div>
                        </div>
                      )}
                    </div>
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end group-hover:border-white/20 transition-colors duration-500">
                        <span className="text-sm font-bold text-[#15803d] flex items-center gap-2 group-hover:text-[#f3e9d2] transition-colors duration-500 tracking-wide">
                            Shop Collection <FaLongArrowAltRight />
                        </span>
                    </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Buttons (Hidden on Mobile) */}
          <div className="hidden md:flex justify-end gap-2 mt-2 pr-4">
              <button 
                onClick={(e) => handleCollageScroll("left", e)} 
                className={`w-12 h-12 rounded-full border border-[#15803d] flex items-center justify-center transition-all ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed text-[#15803d]' : 'hover:bg-[#15803d] hover:text-white text-[#15803d]'}`}
                disabled={activeIndex === 0 && activeIndex !== null}
              >
                <FaChevronLeft size={18} />
              </button>
              <button 
                onClick={(e) => handleCollageScroll("right", e)} 
                className={`w-12 h-12 rounded-full border border-[#15803d] flex items-center justify-center transition-all ${activeIndex === concernCollage.length - 1 ? 'opacity-50 cursor-not-allowed text-[#15803d]' : 'hover:bg-[#15803d] hover:text-white text-[#15803d]'}`}
                disabled={activeIndex === concernCollage.length - 1}
              >
                <FaChevronRight size={18} />
              </button>
            </div>

        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="bg-[#fdf6e4] py-6 px-4 border-t border-[#e0d6c2]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-[#2f7d32] mb-6 md:mb-8 text-center md:text-left">Best Sellers</h2>
          
          <div 
            ref={bestSellerRef}
            className="flex gap-4 pb-4 px-2 overflow-x-auto scroll-smooth scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8"
          >
            {mobileBestSellers.map((item, i) => (
              <ProductCard 
                key={i} 
                item={item} 
                isCenter={i % bestSellersData.length === bsCenterIndex} 
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}