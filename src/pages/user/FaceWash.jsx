import React, { useState } from 'react';
import { 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Check, 
  Star, 
  ArrowRight,
  ShoppingBag,
  Activity,
  PlayCircle,
  Search, // Ensure Search is imported
  X       // Ensure X is imported
} from 'lucide-react';

// --- DATA FOR INGREDIENTS SECTION ---
const ingredientsData = [
  { id: 1, name: "Neem", role: "Acne Fighter", img: "https://images.unsplash.com/photo-1599423985536-24eb22444d62?q=80&w=600", oldPrice: 399, price: 299, rating: 4.6 },
  { id: 2, name: "Aloe Vera", role: "Soothing Hydration", img: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600", oldPrice: 349, price: 249, rating: 4.8 },
  { id: 3, name: "Tulsi", role: "Pore Purifier", img: "https://images.unsplash.com/photo-1620917637477-d7e890c50005?q=80&w=600", oldPrice: 299, price: 199, rating: 4.5 },
  { id: 4, name: "Tea Tree", role: "Oil Control", img: "https://images.unsplash.com/photo-1629241974780-60b540f2f36d?q=80&w=600", oldPrice: 449, price: 329, rating: 4.7 },
  { id: 5, name: "Saffron", role: "Glow Booster", img: "https://images.unsplash.com/photo-1615485925763-8678628890a5?q=80&w=600", oldPrice: 599, price: 499, rating: 4.9 }, // Added extras for demo
  { id: 6, name: "Rose Water", role: "pH Balancing", img: "https://images.unsplash.com/photo-1616091093747-4c8d1234a7ad?q=80&w=600", oldPrice: 249, price: 189, rating: 4.6 },
];

const FaceWashPage = () => {
  const [quantity, setQuantity] = useState(1);

  // --- STATE FOR INGREDIENT SECTION SEARCH ---
  const [showIngSearch, setShowIngSearch] = useState(false);
  const [ingSearchQuery, setIngSearchQuery] = useState("");

  // Filter Logic
  const filteredIngredients = ingredientsData.filter(ing => 
    ing.name.toLowerCase().includes(ingSearchQuery.toLowerCase()) || 
    ing.role.toLowerCase().includes(ingSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans text-gray-700 selection:bg-[#166534] selection:text-white">
      
      {/* 1️⃣ HERO SECTION */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e6f4ea] via-[#fcfbf7] to-[#e6f4ea] z-0"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border-[40px] border-white/40 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#166534]/10 text-[#166534] text-xs font-bold uppercase tracking-widest shadow-sm">
                <Leaf size={14} /> 100% Soap Free Formula
              </div>
              <h1 className="font-serif text-5xl md:text-6xl text-[#166534] font-bold leading-tight">
                Gentle Cleanse. <br/>
                <span className="text-[#d4a373] italic">Naturally Clear Skin.</span>
              </h1>
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-lg">
                A pH-balanced daily cleanser infused with Neem and Tulsi. 
                Removes impurities without stripping your skin's natural moisture barrier.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Sulphate Free", "Paraben Free", "For Sensitive Skin"].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-[#166534]/5 text-[#166534] rounded-lg text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button className="px-8 py-4 bg-[#166534] text-white rounded-full font-bold shadow-lg shadow-green-900/10 hover:bg-[#12542b] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                  <ShoppingBag size={18} /> Buy Now - ₹349
                </button>
                <button className="px-8 py-4 bg-white border border-[#166534]/20 text-[#166534] rounded-full font-bold hover:bg-[#f0fdf4] transition-all flex items-center gap-2">
                  <Activity size={18} /> Know Your Skin
                </button>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white rounded-full shadow-2xl shadow-[#166534]/5"></div>
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" alt="Face Wash Bottle" className="relative z-10 h-[500px] object-contain drop-shadow-2xl animate-float"/>
              <div className="absolute bottom-10 left-0 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white flex items-center gap-3 animate-float-delayed">
                <img src="https://images.unsplash.com/photo-1599423985536-24eb22444d62?q=80&w=200" alt="Neem" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-[#166534] font-bold text-sm">Organic Neem</p>
                  <p className="text-xs text-gray-500">Purifies Pores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ KEY BENEFITS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl text-[#166534] font-bold">Why Your Skin Will Love It</h2>
            <div className="w-16 h-1 bg-[#d4a373] mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Deep Cleansing", desc: "Removes dirt & pollution without drying.", icon: <Droplet /> },
              { title: "Acne Control", desc: "Neem kills bacteria to prevent breakouts.", icon: <ShieldCheck /> },
              { title: "pH Balanced", desc: "Maintains skin's natural acidic barrier (5.5).", icon: <Activity /> },
              { title: "Instant Glow", desc: "Tulsi detoxifies for radiant skin.", icon: <Sparkles /> },
            ].map((item, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-[#fcfbf7] hover:bg-white border border-transparent hover:border-[#e6f4ea] hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#e6f4ea] flex items-center justify-center text-[#166534] mb-6 group-hover:scale-110 transition-transform">
                  {React.cloneElement(item.icon, { size: 32 })}
                </div>
                <h3 className="font-serif text-xl text-[#166534] font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ INGREDIENTS - WITH SEARCH FUNCTIONALITY */}
      <section className="py-20 bg-[#fcfbf7]">
        <div className="container mx-auto px-6">

          {/* Heading & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-[#d4a373] font-bold uppercase tracking-widest text-xs">
                Purest Extracts
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#166534] font-bold mt-2">
                Nature's Powerhouses
              </h2>
            </div>

            {/* --- SEARCH INTERFACE --- */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              {showIngSearch ? (
                <div className="flex items-center bg-white border border-[#166534]/20 rounded-full px-4 py-2 shadow-sm animate-fade-in w-full md:w-64">
                  <Search size={16} className="text-[#166534] mr-2" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Find Ingredient..." 
                    value={ingSearchQuery}
                    onChange={(e) => setIngSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-[#166534]"
                  />
                  <button onClick={() => { setShowIngSearch(false); setIngSearchQuery(""); }} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                   <a href="#" className="text-[#166534] font-bold hover:text-[#d4a373] flex items-center gap-1 transition-colors text-sm">
                    View Full List <ArrowRight size={16} />
                  </a>
                  <button 
                    onClick={() => setShowIngSearch(true)} 
                    className="w-10 h-10 bg-white border border-[#166534]/20 rounded-full flex items-center justify-center text-[#166534] hover:bg-[#166534] hover:text-white transition-all shadow-sm"
                    title="Search Ingredients"
                  >
                    <Search size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredIngredients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredIngredients.slice(0, 4).map((ing, i) => (
                <div
                  key={ing.id}
                  className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-lg transition flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={ing.img} alt={ing.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <span className="absolute top-3 left-3 bg-[#166534] text-white text-xs font-bold px-3 py-1 rounded-full">
                      Save ₹{ing.oldPrice - ing.price}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-serif text-xl text-[#166534] font-semibold">{ing.name}</h3>
                    <p className="text-[#d4a373] text-sm font-medium mb-2">{ing.role}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 line-through text-sm">₹{ing.oldPrice}</span>
                      <span className="text-lg font-bold text-gray-900">₹{ing.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                      ⭐ <span className="font-medium">{ing.rating}</span>
                    </div>
                    <button className="mt-auto w-full py-2 bg-[#166534] text-white rounded-xl font-semibold hover:bg-[#14532d] transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // EMPTY STATE IF SEARCH FAILS
            <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-gray-300">
               <p className="text-gray-500">No ingredients found matching "<span className="font-bold">{ingSearchQuery}</span>"</p>
               <button onClick={() => setIngSearchQuery("")} className="text-[#166534] font-bold mt-2 underline">Clear Search</button>
            </div>
          )}
        </div>
      </section>

      {/* 4️⃣ FORMULATION SAFETY */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-80">
            {["Sulphate Free", "Paraben Free", "Soap Free", "Dermatologically Tested", "Cruelty Free"].map((claim, i) => (
              <div key={i} className="flex items-center gap-3 text-[#166534]">
                <div className="w-8 h-8 rounded-full border border-[#166534]/20 flex items-center justify-center text-[#166534]">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="font-semibold text-sm tracking-wide uppercase">{claim}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ HOW TO USE */}
      <section className="py-20 bg-[#e6f4ea] relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl text-[#166534] font-bold">Your Daily Glow Ritual</h2>
            <p className="text-[#166534]/70 mt-2">Simple steps for clear, happy skin.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: 1, title: "Dampen", text: "Splash your face with lukewarm water to open pores." },
              { step: 2, title: "Massage", text: "Gently massage a coin-sized amount in circular motions." },
              { step: 3, title: "Rinse", text: "Wash off and pat dry. Feel the instant softness." },
            ].map((s, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] text-center border border-white hover:shadow-lg transition-all">
                <div className="w-12 h-12 mx-auto bg-[#166534] text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-green-900/20">
                  {s.step}
                </div>
                <h3 className="font-serif text-xl text-[#166534] font-bold mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ CUSTOMER LOVE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="mb-10">
            <h2 className="font-serif text-3xl text-[#166534] font-bold">Loved by 12,000+ Faces</h2>
          </div>
          <div className="bg-[#fcfbf7] p-10 rounded-[2.5rem] relative">
            <div className="flex justify-center gap-1 mb-6">
               {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="#d4a373" stroke="none" />)}
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#166534] leading-relaxed mb-6 italic">
              "Finally a face wash that controls my acne without making my skin feel like cardboard. It smells like a fresh garden!"
            </h3>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-200 rounded-full mb-2 overflow-hidden">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover"/>
              </div>
              <p className="font-bold text-[#166534]">Priya S.</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Verified Buyer</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ FINAL CTA */}
      <section className="relative py-28 overflow-hidden bg-[#fcfbf7]">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#d4a373]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#166534]/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.6),_transparent_70%)]"></div>
        </div>
        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-[40px] p-14 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] border border-white">
            <span className="inline-block mb-4 px-6 py-2 rounded-full bg-[#166534]/10 text-[#166534] font-semibold tracking-widest text-xs uppercase">
              100% Herbal Formula
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#166534] font-bold leading-tight">
              Your Everyday Cleanser,<br />
              <span className="text-gray-400">Crafted by Nature.</span>
            </h2>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
              Gentle on skin, powerful on impurities. Infused with Neem, Tulsi & Aloe for daily purity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
              <button className="group px-14 py-3 bg-[#166534] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-green-900/30 hover:-translate-y-1 transition-all flex items-center gap-3">
                Add to Cart – ₹349
              </button>
              <button className="px-12 py-3 bg-white text-[#166534] rounded-full font-bold text-lg border border-[#166534]/10 hover:bg-[#166534]/5 hover:shadow-lg transition-all">
                View Combos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 7s ease-in-out infinite 2s;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-fade-in {
           animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
           from { opacity: 0; width: 0; }
           to { opacity: 1; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default FaceWashPage;