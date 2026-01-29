import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Heart, 
  Eye, 
  ShoppingBag, 
  Star, 
  Search, 
  X,
  Clock, 
  Zap    
} from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Kumkumadi Face Oil",
    category: "Face Care",
    concern: "Dullness",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800",
    badge: "Best Seller",
    viewers: 12,
    benefit: "Restores natural glow",
    variants: [
      { size: "15ml", price: 1299, mrp: 1599 },
      { size: "30ml", price: 2399, mrp: 2999 },
      { size: "50ml", price: 3499, mrp: 4500 }
    ]
  },
  {
    id: 2,
    name: "Bhringraj Hair Cleanser",
    category: "Hair Care",
    concern: "Hair Fall",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800",
    badge: "Limited Stock",
    viewers: 8,
    benefit: "Strengthens roots",
    variants: [
      { size: "200ml", price: 649, mrp: 799 },
      { size: "500ml", price: 1299, mrp: 1599 },
      { size: "1L", price: 2199, mrp: 2800 }
    ]
  },
  {
    id: 3,
    name: "Sandalwood Body Wash",
    category: "Body Care",
    concern: "Dry Skin",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1556228720-192732958769?q=80&w=800",
    badge: null,
    viewers: 0,
    benefit: "Hydrates & soothes",
    variants: [
      { size: "250ml", price: 499, mrp: 599 },
      { size: "500ml", price: 899, mrp: 1100 }
    ]
  },


  {
    id: 4,
    name: "Neem & Tulsi Face Cleanser",
    category: "Face Care",
    concern: "Acne",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=800",
    badge: "New Launch",
    viewers: 5,
    benefit: "Purifies & controls oil",
    variants: [
      { size: "100ml", price: 399, mrp: 499 },
      { size: "200ml", price: 699, mrp: 899 }
    ]
  },
  {
    id: 5,
    name: "Ashwagandha Stress Relief Tea",
    category: "Wellness",
    concern: "Stress",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800",
    badge: "Trending",
    viewers: 18,
    benefit: "Calms mind & improves sleep",
    variants: [
      { size: "50g", price: 349, mrp: 449 },
      { size: "100g", price: 599, mrp: 799 }
    ]
  },
  {
    id: 6,
    name: "Aloe Vera Cooling Gel",
    category: "Skin Care",
    concern: "Sun Damage",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b3b?q=80&w=800",
    badge: "Customer Favorite",
    viewers: 9,
    benefit: "Soothes & repairs skin",
    variants: [
      { size: "100ml", price: 299, mrp: 399 },
      { size: "300ml", price: 699, mrp: 899 }
    ]
  },
  {
    id: 7,
    name: "Rose & Saffron Night Cream",
    category: "Face Care",
    concern: "Pigmentation",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800",
    badge: "Luxury Pick",
    viewers: 14,
    benefit: "Repairs skin overnight",
    variants: [
      { size: "30g", price: 1799, mrp: 2299 },
      { size: "50g", price: 2699, mrp: 3299 }
    ]
  }
];


const categories = ["All", "Face Care", "Hair Care", "Body Care", "Combos"];

// --- 1. COUNTDOWN TIMER COMPONENT ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#166534] text-white py-2 px-4 flex justify-center items-center gap-4 text-sm font-medium tracking-wide">
      <div className="flex items-center gap-2 animate-pulse">
        <Zap size={16} fill="yellow" className="text-yellow-400" />
        <span className="uppercase font-bold">Flash Sale Live!</span>
      </div>
      <div className="hidden sm:flex items-center gap-1 bg-white/20 rounded px-2 py-0.5">
        <Clock size={14} />
        <span>Ends in: {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
};

// --- 2. UPDATED PRODUCT CARD ---
const ProductCard = ({ product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = product.variants ? product.variants[selectedVariantIndex] : { price: 0, mrp: 0 };

  return (
    <div className="group relative bg-white rounded-2xl border border-transparent hover:border-[#166534]/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden">
      
      {/* Image Area */}
      <div className="relative h-64 overflow-hidden bg-[#f0fdf4] p-6 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* --- LIVE BADGES (NEW) --- */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
           {/* Best Seller / Stock Badge */}
           {product.badge && (
            <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm
              ${product.badge === "Limited Stock" ? "bg-red-100 text-red-600" : "bg-white/90 backdrop-blur text-[#166534]"}`}>
              {product.badge}
            </div>
           )}
           
           {/* Live Viewers (Only if > 0) */}
           {product.viewers > 0 && (
             <div className="flex items-center gap-1 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full animate-fade-in">
               <Eye size={10} /> {product.viewers} viewing
             </div>
           )}
        </div>
        
        {/* Hover Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md hover:scale-110 transition-all">
            <Heart size={18} />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-[#166534] shadow-md hover:scale-110 transition-all">
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-[#d4a373] font-medium mb-1">{product.category}</p>
        <h3 className="font-serif text-lg text-[#166534] font-bold mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4 font-light truncate">{product.benefit}</p>
        
        {/* Variant Selector */}
        {product.variants && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariantIndex(index)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all duration-200 
                    ${selectedVariantIndex === index 
                      ? "bg-[#166534] text-white border-[#166534]" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#166534]"
                    }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Cart Section */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
          <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">₹{currentVariant.price}</span>
                {currentVariant.mrp > currentVariant.price && (
                   <span className="text-xs text-gray-400 line-through">₹{currentVariant.mrp}</span>
                )}
                {/* Save Percentage (New) */}
                {currentVariant.mrp > currentVariant.price && (
                   <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1 rounded">
                     {Math.round(((currentVariant.mrp - currentVariant.price)/currentVariant.mrp)*100)}% OFF
                   </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <Star size={10} fill="#d4a373" stroke="none" /> {product.rating}
              </div>
          </div>
          
          <button className="w-10 h-10 rounded-full bg-[#fcfbf7] text-[#166534] border border-[#166534]/20 flex items-center justify-center hover:bg-[#166534] hover:text-white transition-all shadow-sm group">
            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
const AllProducts = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(query) ||
                          product.concern.toLowerCase().includes(query) ||
                          product.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans text-gray-700 selection:bg-[#166534] selection:text-white">
      
      {/* 1. FLASH SALE TIMER BAR (Added at top) */}
      <CountdownTimer />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 text-center bg-gradient-to-b from-[#f0fdf4] to-[#fcfbf7]">
        <div className="container mx-auto px-6">
          <span className="text-[#d4a373] text-xs font-bold uppercase tracking-widest mb-3 block animate-fade-in">
            Pure & Potent
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#166534] font-bold mb-4 animate-fade-in">
            Our Complete Collection
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light text-lg animate-fade-in">
            Explore time-tested Ayurvedic formulations crafted for your modern wellness journey.
          </p>
        </div>
      </section>

      {/* STICKY BAR */}
      <div className="sticky top-0 z-40 bg-[#fcfbf7]/90 backdrop-blur-md border-b border-gray-200/50 py-4 shadow-sm h-[72px] flex items-center transition-all duration-300">
        <div className="container mx-auto px-6">
          {isSearchOpen ? (
            <div className="flex items-center gap-4 w-full animate-fade-in-up">
              <Search className="text-[#166534]" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg text-[#166534] placeholder-gray-400"
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="p-2 hover:bg-red-50 rounded-full hover:text-red-500 text-gray-500">
                <X size={24} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="hidden md:flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                      ${activeCategory === cat 
                        ? "bg-[#166534] text-white shadow-md" 
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#166534] hover:text-[#166534]"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="md:hidden">
                <span className="font-serif text-[#166534] font-bold text-lg">{activeCategory}</span>
              </div>
              <div className="flex gap-3 items-center">
                <button onClick={() => setIsSearchOpen(true)} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-[#166534] hover:bg-[#166534] hover:text-white transition-all shadow-sm">
                  <Search size={18} />
                </button>
                <button onClick={() => setShowMobileFilter(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-[#166534] transition-colors lg:hidden">
                  <Filter size={16} /> Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex gap-12 items-start">
          
          {/* SIDEBAR FILTERS */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 space-y-8">
            <div>
              <h3 className="font-serif text-[#166534] font-bold mb-4">By Concern</h3>
              <div className="space-y-3">
                {['Acne & Oil Control', 'Dryness & Dullness', 'Hair Fall', 'Dandruff'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-gray-300 group-hover:border-[#166534]"></div>
                    <span className="text-sm text-gray-600 group-hover:text-[#166534]">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-[#166534] font-bold mb-4">Price Range</h3>
              <div className="h-1 bg-gray-200 rounded-full w-full relative">
                <div className="absolute left-0 w-1/2 h-full bg-[#166534] rounded-full"></div>
                <div className="absolute left-1/2 w-4 h-4 bg-white border-2 border-[#166534] rounded-full -top-1.5 shadow-sm cursor-pointer"></div>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            {searchQuery && (
               <p className="mb-6 text-gray-500 text-sm">Showing results for "<span className="text-[#166534] font-bold">{searchQuery}</span>"</p>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl text-[#166534] font-bold">No Products Found</h3>
                <button onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }} className="mt-6 px-6 py-2 bg-[#166534] text-white rounded-full text-sm font-semibold">Clear Search</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AllProducts;