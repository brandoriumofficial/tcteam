import React, { useState } from 'react';
import { 
  ShoppingBag, Eye, Leaf, Gift, CheckCircle, Star, 
  ArrowRight, Sparkles, ShieldCheck, Heart, Search, X 
} from 'lucide-react';

// --- 1. UPDATED MOCK DATA (Category Added) ---
const combosData = [
  {
    id: 1,
    name: "Complete Hair Growth Ritual",
    category: "Hair", // 👈 Category Added
    items: ["Bhringraj Oil", "Neem Comb", "Hair Mask"],
    originalPrice: 2499,
    price: 1899,
    saveAmount: 600,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000",
    badge: "Best Seller",
    rating: 4.9
  },
  {
    id: 2,
    name: "Radiant Skin Glow Kit",
    category: "Skin", // 👈 Category Added
    items: ["Kumkumadi Tailam", "Rose Toner", "Saffron Gel"],
    originalPrice: 3200,
    price: 2499,
    saveAmount: 701,
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000",
    badge: "Most Loved",
    rating: 4.8
  },
  {
    id: 3,
    name: "Body De-Stress Bundle",
    category: "Skin", // Body care treated as Skin for this demo
    items: ["Lavender Body Oil", "Bath Salts", "Loofah"],
    originalPrice: 1599,
    price: 1299,
    saveAmount: 300,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000",
    badge: null,
    rating: 4.7
  },
  {
    id: 4,
    name: "Daily Face Essentials",
    category: "Skin",
    items: ["Aloe Vera Gel", "Vitamin C Serum"],
    originalPrice: 1100,
    price: 899,
    saveAmount: 201,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1000",
    badge: "Expert Pick",
    rating: 4.6
  },
  {
    id: 5,
    name: "Ayurvedic Detox Pack",
    category: "Wellness", // New Category
    items: ["Triphala Powder", "Copper Bottle"],
    originalPrice: 1800,
    price: 1450,
    saveAmount: 350,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=1000",
    badge: null,
    rating: 4.9
  },
  {
    id: 6,
    name: "Men's Grooming Set",
    category: "Skin",
    items: ["Beard Oil", "Charcoal Face Wash"],
    originalPrice: 1400,
    price: 1100,
    saveAmount: 300,
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=1000",
    badge: "Trending",
    rating: 4.5
  }
];

const ComboPage = () => {
  // --- STATES ---
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // 👈 2. New State for Category

  // --- 3. FILTER LOGIC (Category + Search) ---
  const filteredCombos = combosData.filter((combo) => {
    const query = searchQuery.toLowerCase();
    
    // Check 1: Does it match the Search Text?
    const matchesSearch = 
      combo.name.toLowerCase().includes(query) ||
      combo.items.some(item => item.toLowerCase().includes(query));

    // Check 2: Does it match the Selected Category?
    const matchesCategory = selectedCategory === "All" || combo.category === selectedCategory;

    // Dono match hone chahiye
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans text-gray-800">
      <section className="py-20 min-h-[600px]">
        <div className="container mx-auto px-6">
          
          {/* HEADER & CONTROLS */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#166534] font-bold">Curated Rituals</h2>
              <p className="text-gray-500 mt-2">Choose the care that suits you best.</p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              
              {showSearch ? (
                // SEARCH BAR OPEN
                <div className="flex items-center bg-white border border-[#166534]/30 rounded-full px-4 py-2 shadow-sm animate-fade-in w-full md:w-96">
                  <Search size={18} className="text-[#166534] mr-2" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search kits..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-base text-[#166534] placeholder-gray-400"
                  />
                  <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-gray-400 hover:text-red-500 p-1">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                // CATEGORY BUTTONS & SEARCH ICON
                <div className="flex items-center gap-4">
                   <div className="hidden md:flex gap-4 mr-4">
                      {/* ALL Button */}
                      <button 
                        onClick={() => setSelectedCategory("All")}
                        className={`text-sm transition-colors ${selectedCategory === "All" ? "text-[#166534] font-bold border-b-2 border-[#166534]" : "text-gray-400 hover:text-[#166534]"}`}
                      >
                        All
                      </button>

                      {/* HAIR Button */}
                      <button 
                        onClick={() => setSelectedCategory("Hair")}
                        className={`text-sm transition-colors ${selectedCategory === "Hair" ? "text-[#166534] font-bold border-b-2 border-[#166534]" : "text-gray-400 hover:text-[#166534]"}`}
                      >
                        Hair
                      </button>

                      {/* SKIN Button */}
                      <button 
                        onClick={() => setSelectedCategory("Skin")}
                        className={`text-sm transition-colors ${selectedCategory === "Skin" ? "text-[#166534] font-bold border-b-2 border-[#166534]" : "text-gray-400 hover:text-[#166534]"}`}
                      >
                        Skin
                      </button>
                   </div>

                   <button 
                     onClick={() => setShowSearch(true)}
                     className="w-10 h-10 bg-white border border-[#166534]/20 rounded-full flex items-center justify-center text-[#166534] hover:bg-[#166534] hover:text-white transition-all shadow-sm"
                     title="Search Combos"
                   >
                     <Search size={20} />
                   </button>
                </div>
              )}
            </div>
          </div>

          {/* RESULTS GRID */}
          {filteredCombos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              {filteredCombos.map((combo) => (
                <div key={combo.id} className="group bg-white rounded-2xl border border-transparent hover:border-[#d4a373]/30 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
                  
                  {/* Image Section */}
                  <div className="relative h-72 overflow-hidden bg-[#f0fdf4]">
                    <img 
                      src={combo.image} 
                      alt={combo.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    {combo.badge && (
                      <div className="absolute top-4 left-4 bg-[#166534] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded shadow-md z-10">
                        {combo.badge}
                      </div>
                    )}

                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                      <Heart size={20} />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl font-bold text-[#166534] leading-tight group-hover:text-[#d4a373] transition-colors">
                        {combo.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 mt-2">
                      {combo.items.map((item, idx) => (
                        <span key={idx} className="text-xs bg-[#fcfbf7] border border-gray-200 text-gray-600 px-2 py-1 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-[#166534]">₹{combo.price}</span>
                        <span className="text-sm text-gray-400 line-through">₹{combo.originalPrice}</span>
                        <span className="text-xs font-bold text-[#b45309] bg-[#fffbeb] px-2 py-1 rounded border border-[#b45309]/20">
                          Save ₹{combo.saveAmount}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-3">
                        <button className="col-span-4 bg-[#166534] text-white py-3 rounded-xl font-semibold hover:bg-[#14532d] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/10">
                          <ShoppingBag size={18} /> Add Combo
                        </button>
                        <button className="col-span-1 border border-gray-200 rounded-xl flex items-center justify-center hover:border-[#166534] hover:text-[#166534] transition-colors">
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // EMPTY STATE
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={32} />
               </div>
               <h3 className="text-xl text-[#166534] font-bold">No Rituals Found</h3>
               <p className="text-gray-500 mt-2">
                 No {selectedCategory !== "All" ? selectedCategory : ""} combos match "<span className="font-semibold">{searchQuery}</span>".
               </p>
               <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} className="mt-6 px-6 py-2 bg-[#166534] text-white rounded-full text-sm font-semibold hover:bg-green-800 transition">
                  Clear Filters
               </button>
            </div>
          )}
        </div>
      </section>
      
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; width: 0; } to { opacity: 1; width: 100%; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ComboPage;