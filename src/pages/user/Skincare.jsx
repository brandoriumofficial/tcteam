import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, Star, Leaf, Droplet, 
  ShieldCheck, Heart, Eye, ChevronDown, Filter 
} from 'lucide-react';

// --- Mock Data ---
const products = [
  {
    id: 1,
    name: "Kumkumadi Miraculous Fluid",
    type: "Face Serum",
    benefits: "Brightens & Reduces Pigmentation",
    price: 34.99,
    mrp: 49.99,
    rating: 4.9,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    badge: "Best Seller",
    viewers: 12
  },
  {
    id: 2,
    name: "Saffron & Neem Purifying Wash",
    type: "Face Wash",
    benefits: "Deep Cleansing for Acne",
    price: 18.50,
    mrp: 24.00,
    rating: 4.7,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=600",
    badge: "Herbal",
    viewers: 5
  },
  {
    id: 3,
    name: "Rose & Sandalwood Elixir",
    type: "Hydrating Gel",
    benefits: "Sooths Dry & Irritated Skin",
    price: 28.00,
    mrp: 35.00,
    rating: 4.8,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
    badge: null,
    viewers: 8
  },
  {
    id: 4,
    name: "Golden Turmeric Night Cream",
    type: "Night Cream",
    benefits: "Anti-aging & Repair",
    price: 42.00,
    mrp: 60.00,
    rating: 5.0,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=600",
    badge: "New Launch",
    viewers: 24
  }
];

const filters = ["All", "Acne", "Pigmentation", "Dryness", "Anti-aging"];

// --- Components ---

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100"
    >
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden bg-stone-100">
        {product.badge && (
          <span className="absolute top-3 left-3 bg-stone-900 text-stone-50 text-xs px-3 py-1 rounded-full uppercase tracking-wider z-10 font-medium">
            {product.badge}
          </span>
        )}
        {product.viewers > 10 && (
          <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-md text-stone-700 text-xs px-2 py-1 rounded-lg flex items-center gap-1 z-10 shadow-sm border border-white/50">
            <Eye size={12} className="text-[#7C9082]" /> {product.viewers} viewing
          </span>
        )}
        
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <button className="bg-white/90 backdrop-blur text-stone-900 px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
             Quick View
           </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-semibold text-[#7C9082] uppercase tracking-wide">{product.type}</p>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-[#BFA15F] text-[#BFA15F]" />
            <span className="text-xs font-medium text-stone-600">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-serif text-lg text-stone-900 leading-tight mb-1 group-hover:text-[#7C9082] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-stone-500 mb-4 font-light">{product.benefits}</p>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-stone-800">${product.price}</span>
            <span className="text-sm text-stone-400 line-through ml-2">${product.mrp}</span>
          </div>
          <button className="bg-[#7C9082] hover:bg-[#6A7F72] text-white p-2.5 rounded-xl shadow-lg shadow-[#7C9082]/30 transition-all active:scale-95 flex items-center justify-center">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function AyurvedicSkinCare() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-sans selection:bg-[#7C9082] selection:text-white">
      
      {/* --- Navbar (Simplified) --- */}
      <nav className="fixed w-full z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif text-2xl text-stone-800 tracking-tighter">Veda<span className="text-[#BFA15F]">.</span></div>
          <div className="flex items-center gap-6">
            <Search className="w-5 h-5 text-stone-600 cursor-pointer hover:text-[#7C9082] transition" />
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-stone-600 cursor-pointer hover:text-[#7C9082] transition" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#BFA15F] rounded-full"></span>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[10%] text-[#7C9082] opacity-20 pointer-events-none"
        >
          <Leaf size={120} strokeWidth={1} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-[5%] text-[#BFA15F] opacity-10 pointer-events-none"
        >
          <Leaf size={180} strokeWidth={1} />
        </motion.div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[#7C9082] font-medium tracking-[0.2em] text-sm uppercase mb-4 block"
          >
            Ancient Wisdom, Modern Glow
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-serif text-5xl md:text-7xl text-stone-800 mb-6 leading-tight"
          >
            Pure <span className="text-[#7C9082] italic">Ayurvedic</span> <br /> Skin Care
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
          >
            Glow naturally with time-tested herbal formulations crafted for the modern soul.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="bg-stone-800 text-[#F9F7F2] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#7C9082] transition-colors duration-300"
          >
            Explore Products &rarr;
          </motion.button>
        </div>
      </section>

      {/* --- Filter & Search Sticky Bar --- */}
      <div className="sticky top-16 z-40 bg-[#F9F7F2]/90 backdrop-blur-lg border-y border-stone-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all border ${
                  activeFilter === filter
                    ? "bg-[#7C9082] text-white border-[#7C9082]"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#7C9082] hover:text-[#7C9082]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search Kumkumadi, Aloe, Neem..." 
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-stone-200 focus:outline-none focus:border-[#7C9082] focus:ring-1 focus:ring-[#7C9082] text-sm placeholder-stone-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* --- Product Grid --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* --- Trust Section --- */}
      <section className="bg-white py-16 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Leaf, text: "100% Ayurvedic" },
            { icon: Droplet, text: "No Chemicals" },
            { icon: ShieldCheck, text: "Dermatologically Tested" },
            { icon: Heart, text: "Cruelty Free" },
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-3 group cursor-default"
            >
              <div className="p-4 bg-[#F9F7F2] rounded-full text-[#7C9082] group-hover:bg-[#7C9082] group-hover:text-white transition-colors duration-300">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <span className="text-stone-600 font-medium text-sm">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Reviews Preview --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-stone-800 mb-2">Loved by Nature Lovers</h2>
          <div className="flex justify-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-[#BFA15F] text-[#BFA15F]" />)}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ananya S.", text: "The Kumkumadi serum changed my skin texture in just two weeks. Feels so luxurious!" },
            { name: "Rahul M.", text: "Finally a face wash that doesn't dry out my skin. The neem scent is very grounding." },
            { name: "Sarah J.", text: "Packaging is beautiful and the night cream feels like pure silk. Highly recommended." },
          ].map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition">
              <p className="text-stone-600 italic mb-6 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8EDE9] flex items-center justify-center text-[#7C9082] font-serif font-bold">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-[#BFA15F]">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer CTA --- */}
      <section className="bg-gradient-to-b from-[#E8EDE9] to-[#F9F7F2] py-20 px-6 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-4">Not sure what your skin needs?</h2>
          <p className="text-stone-600 mb-8">Take our 2-minute dosha quiz to find your perfect regimen.</p>
          <button className="bg-[#7C9082] text-white px-8 py-3 rounded-full shadow-xl shadow-[#7C9082]/20 hover:scale-105 transition-transform duration-300 flex items-center gap-2 mx-auto">
            Take Skin Quiz <ChevronDown className="rotate-[-90deg]" size={16} />
          </button>
        </div>
      </section>

    </div>
  );
}