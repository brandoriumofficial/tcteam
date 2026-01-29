import React, { useState } from 'react';
import { 
  Droplet, 
  Sparkles, 
  Sun, 
  Wind, 
  ArrowRight, 
  Star, 
  ShoppingBag,
  Leaf,
  CheckCircle,
  ShieldCheck,
  Search, // Imported
  X       // Imported
} from 'lucide-react';

const HairCarePage = () => {
  // --- MOCK DATA ---
  
  const categories = [
    { name: "Ayurvedic Oils", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=1000", desc: "Deep nourishment for scalp roots." },
    { name: "Herbal Cleansers", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1000", desc: "Sulphate-free gentle cleaning." },
    { name: "Hair Masks", image: "https://images.unsplash.com/photo-1556228720-192732958769?q=80&w=1000", desc: "Intense repair & hydration." },
    { name: "Serums & Tonics", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000", desc: "Frizz control & shine." },
  ];

  const products = [
    { 
      id: 1, 
      name: "Bhringraj & Amla Hair Oil", 
      price: 1299, 
      oldPrice: 1499,
      image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800",
      ingredients: ["Bhringraj", "Amla", "Sesame"],
      rating: 4.9
    },
    { 
      id: 2, 
      name: "Hibiscus Shampoo", 
      price: 850, 
      oldPrice: 999,
      image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=800",
      ingredients: ["Hibiscus", "Reetha", "Shikakai"],
      rating: 4.8
    },
    { 
      id: 3, 
      name: "Neem & Tea Tree Mask", 
      price: 999, 
      oldPrice: null,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800",
      ingredients: ["Neem", "Tea Tree", "Clay"],
      rating: 4.7
    },
    { 
      id: 4, 
      name: "Saffron Hair Serum", 
      price: 1450, 
      oldPrice: 1800,
      image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800",
      ingredients: ["Kashmiri Saffron", "Almond"],
      rating: 5.0
    },
  ];

  const concerns = [
    { title: "Hair Fall Control", icon: <Leaf />, desc: "Strengthen roots with Bhringraj." },
    { title: "Dandruff Relief", icon: <Wind />, desc: "Purify scalp with Neem & Lemon." },
    { title: "Dry & Frizzy", icon: <Droplet />, desc: "Hydrate with Coconut Milk." },
    { title: "Premature Greying", icon: <Sparkles />, desc: "Restore pigment with Amla." },
  ];

  // --- SEARCH STATE ---
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- FILTER LOGIC ---
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-[#fefdf6] font-sans text-gray-800 selection:bg-[#d4a373] selection:text-white">
      
      {/* 1️⃣ HERO SECTION */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-[#fcfbf7] to-[#e6f4ea] z-0"></div>
        {/* Glow Effect */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#166534]/10 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#166534]/10 text-[#166534] text-xs font-bold uppercase tracking-widest shadow-sm">
                <Leaf size={14} /> Ayurvedic Hair Ritual
              </div>
              <h1 className="font-serif text-5xl md:text-6xl text-[#166534] font-bold leading-tight">
                Strong Roots. <br />
                <span className="italic text-[#d4a373]">Naturally Beautiful Hair.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Nourish your scalp with time-tested oils and cleansers.
                Reduce hair fall, boost growth, and restore natural shine.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Hair Fall Control", "Sulphate Free", "All Hair Types"].map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-[#166534]/5 text-[#166534] rounded-lg text-sm font-medium">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <button className="px-8 py-4 bg-[#166534] text-white rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2">
                  <ShoppingBag size={18} /> Shop Hair Care
                </button>
                <button className="px-8 py-4 bg-white border border-[#166534]/20 text-[#166534] rounded-full font-bold hover:bg-[#f0fdf4] transition-all">
                  Take Hair Quiz
                </button>
              </div>
              <div className="flex gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-[#d4a373]" />
                Clinically Tested & Herbal Safe
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute w-[420px] h-[420px] bg-white rounded-full shadow-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800"
                alt="Hair Oil"
                className="relative z-10 h-[500px] object-contain drop-shadow-2xl animate-float"
              />
              <div className="absolute bottom-8 right-0 bg-white/80 backdrop-blur p-3 rounded-2xl shadow-lg flex gap-3 animate-float-delayed">
                <img
                  src="https://images.unsplash.com/photo-1599423985536-24eb22444d62?q=80&w=200"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-[#166534] font-bold text-sm">Bhringraj</p>
                  <p className="text-xs text-gray-500">Boosts Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ CATEGORIES */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-[#166534] font-bold">Pure & Potent Categories</h2>
            <div className="w-16 h-1 bg-[#d4a373] mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#166534] via-[#166534]/20 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-2xl text-white mb-1">{cat.name}</h3>
                  <p className="text-[#d4a373] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ HAIR CONCERN SOLUTIONS */}
      <section className="py-16 bg-[#fefdf6]">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-3xl text-[#166534] font-bold mb-10 text-center">Shop By Concern</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {concerns.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#166534]/10 hover:border-[#d4a373] hover:shadow-lg transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#fefdf6] flex items-center justify-center text-[#166534] mb-4 group-hover:bg-[#166534] group-hover:text-[#d4a373] transition-colors">
                  {React.cloneElement(item.icon, { size: 24 })}
                </div>
                <h4 className="font-serif text-lg font-bold text-[#166534] mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4️⃣ FEATURED PRODUCTS (BEST SELLERS) - WITH SEARCH */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          
          {/* HEADER & SEARCH BAR */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="font-serif text-4xl text-[#166534] font-bold">Best Sellers</h2>
              <p className="text-gray-500 mt-2">Loved by thousands for effective results.</p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              {showSearch ? (
                // Search Input Open
                <div className="flex items-center bg-white border border-[#166534]/30 rounded-full px-4 py-2 shadow-sm animate-fade-in w-full md:w-72">
                  <Search size={18} className="text-[#166534] mr-2" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Find product (e.g. Amla)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-base text-[#166534] placeholder-gray-400"
                  />
                  <button 
                    onClick={() => { setShowSearch(false); setSearchQuery(""); }} 
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                // Search Icon Closed
                <div className="flex items-center gap-4">
                   <a href="#" className="text-[#d4a373] font-bold hover:underline flex items-center gap-1 text-sm mr-2">
                    View All <ArrowRight size={16} />
                  </a>
                  <button 
                    onClick={() => setShowSearch(true)}
                    className="w-10 h-10 bg-white border border-[#166534]/20 rounded-full flex items-center justify-center text-[#166534] hover:bg-[#166534] hover:text-white transition-all shadow-sm"
                    title="Search Best Sellers"
                  >
                    <Search size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT GRID */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group border border-green-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-80 bg-[#fefdf6] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex gap-2 flex-wrap mb-2">
                      {product.ingredients.map((ing, i) => (
                        <span key={i} className="text-[10px] uppercase font-bold tracking-wider text-[#d4a373] bg-[#fefdf6] px-2 py-1 rounded-sm">
                          {ing}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif text-xl text-[#166534] font-semibold mb-2">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-2">
                      {product.oldPrice && (
                        <p className="text-gray-400 line-through text-sm">₹{product.oldPrice}</p>
                      )}
                      <p className="text-gray-800 font-bold text-lg">₹{product.price}</p>
                      {product.oldPrice && (
                        <span className="text-green-700 font-semibold text-sm">
                          Save ₹{product.oldPrice - product.price}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                      <Star size={14} className="fill-[#d4a373] text-[#d4a373]" /> {product.rating}
                    </div>

                    <button className="mt-auto w-full py-2 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // EMPTY STATE
            <div className="text-center py-16 bg-[#fefdf6] rounded-2xl border border-dashed border-gray-300">
               <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 shadow-sm">
                  <Search size={28} />
               </div>
               <p className="text-gray-500">No products found for "<span className="font-bold">{searchQuery}</span>"</p>
               <button onClick={() => setSearchQuery("")} className="mt-3 text-[#166534] font-bold underline">
                 Show All Products
               </button>
            </div>
          )}
        </div>
      </section>

      {/* 5️⃣ AYURVEDIC RITUAL - Storytelling */}
      <section className="py-24 bg-[#166534] text-[#fefdf6] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">The 3-Step Kesh Ritual</h2>
            <p className="text-[#d4a373] italic">Ancient wisdom for modern hair concerns</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-[#d4a373]/30 border-t border-dashed border-[#d4a373]"></div>
            {[
              { step: "01", title: "Oiling (Snehana)", desc: "Massage warm oil into scalp to nourish roots and calm the mind." },
              { step: "02", title: "Cleansing (Kshalana)", desc: "Wash with gentle herbal cleansers that remove dirt without stripping oils." },
              { step: "03", title: "Masking (Lepana)", desc: "Apply a nutrient-dense pack to repair damage and seal the cuticles." }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#fefdf6]/10 backdrop-blur border border-[#d4a373] flex items-center justify-center text-3xl font-serif font-bold text-[#d4a373] mb-6 shadow-lg shadow-black/20">
                  {s.step}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">{s.title}</h3>
                <p className="text-[#fefdf6]/80 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ EXPERT CTA */}
      <section className="py-20 bg-[#f0fdf4]">
        <div className="container mx-auto px-6">
          <div className="bg-[#166534]/5 rounded-3xl p-10 md:p-16 text-center border border-[#166534]/10 relative overflow-hidden">
            <Leaf className="absolute top-0 right-0 text-[#166534]/10 w-64 h-64 -translate-y-1/2 translate-x-1/2" />
            <h2 className="font-serif text-3xl md:text-5xl text-[#166534] font-bold mb-6 relative z-10">
              Not sure what suits your hair?
            </h2>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto relative z-10">
              Every hair type is unique according to Ayurveda. Take our 2-minute quiz or speak to a Vaidya to find your perfect match.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <button className="px-8 py-3 bg-[#166534] text-white rounded-full font-bold hover:shadow-xl transition-all">
                Talk to an Expert
              </button>
              <button className="px-8 py-3 border-2 border-[#166534] text-[#166534] rounded-full font-bold hover:bg-[#166534] hover:text-white transition-all">
                Take Hair Quiz
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ TRUST BADGES */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { text: "100% Natural", icon: <Leaf /> },
              { text: "No Sulphates/Parabens", icon: <ShieldCheck /> },
              { text: "Dermatologically Tested", icon: <CheckCircle /> },
              { text: "Cruelty Free", icon: <Star /> }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 text-[#166534] opacity-80 hover:opacity-100 transition-opacity">
                {React.cloneElement(badge.icon, { size: 24, className: "text-[#d4a373]" })}
                <span className="font-semibold text-sm tracking-wide uppercase">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; width: 0; } to { opacity: 1; width: 100%; } }
      `}</style>
    </div>
  );
};

export default HairCarePage;