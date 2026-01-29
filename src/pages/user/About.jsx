import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Droplet, 
  Sun, 
  ArrowRight, 
  Star, 
  Heart, 
  Quote, 
  Sparkles,
  History,
  Users,
  Feather
} from 'lucide-react';

const AboutUs = () => {

  // --- STATES ---
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Skincare");

  // --- DATA: TIMELINE ---
  const timelineData = [
    {
      title: "Ancient Wisdom",
      icon: <History size={20} />,
      heading: "Roots in Ancient Ayurveda",
      content: `Our story begins with ancient Ayurvedic scriptures,
      where nature was the healer and balance was the goal.
      Every formula is inspired by centuries-old wisdom.`
    },
    {
      title: "Family Recipes",
      icon: <Users size={20} />,
      heading: "Passed Down Through Generations",
      content: `From grandmother’s notebooks to modern labs,
      our recipes are preserved with care, love, and respect.
      Nothing rushed. Nothing artificial.`
    },
    {
      title: "Modern Care",
      icon: <Sun size={20} />,
      heading: "Tradition Meets Today",
      content: `We blend time-tested rituals with modern science
      to create products that fit today’s lifestyle
      without losing their soul.`
    }
  ];

  // --- DATA: RITUALS (Skincare vs Haircare) ---
  const ritualsContent = {
    Skincare: {
      featured: {
        tag: "Featured Ritual",
        title: "Radiance Glow Ritual",
        desc: "A complete Ayurvedic skincare ritual infused with saffron, turmeric and herbal oils to restore natural glow.",
        items: ["Kumkumadi Face Oil", "Saffron Cleanser", "Rose Water Toner"],
        price: "₹1,299",
        image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800"
      },
      products: [
        { name: "Kumkumadi Oil", sub: "Saffron & Turmeric", price: "₹499", img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800" },
        { name: "Aloe Gel", sub: "Pure Hydration", price: "₹299", img: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800" },
        { name: "Rose Toner", sub: "Pore Tightening", price: "₹399", img: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800" },
        { name: "Face Pack", sub: "Sandalwood Clay", price: "₹599", img: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800" },
      ]
    },
    Haircare: {
      featured: {
        tag: "Hair Strengthening",
        title: "Kesh Strong Roots Kit",
        desc: "Revitalize your scalp with the power of Bhringraj and Amla. This ritual reduces hair fall and promotes thick, healthy growth.",
        items: ["Bhringraj Hair Oil", "Neem Wood Comb", "Hibiscus Mask"],
        price: "₹1,499",
        image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=800"
      },
      products: [
        { name: "Bhringraj Oil", sub: "Root Strength", price: "₹699", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800" },
        { name: "Shikakai Wash", sub: "Gentle Cleanser", price: "₹450", img: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800" },
        { name: "Hair Serum", sub: "Frizz Control", price: "₹550", img: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800" },
        { name: "Scalp Scrub", sub: "Tea Tree Detox", price: "₹600", img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800" },
      ]
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTimelineIndex((prev) => (prev + 1) % timelineData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-[#fefdf6] overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1615486511484-92e172cc416d?q=80&w=2070&auto=format&fit=crop" 
            alt="Herbs Background" 
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fefdf6] via-[#fefdf6]/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#166534]/10 text-[#166534] border border-[#166534]/20 backdrop-blur-sm">
              <Leaf size={16} />
              <span className="text-sm font-semibold tracking-wide uppercase">100% Natural | Ayurveda Inspired</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#166534] leading-tight">
              Rooted in Tradition. <br />
              <span className="text-[#d4a373] italic">Perfected for Today.</span>
            </h1>
            
            <div className="p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-xl max-w-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                Experience the harmony of ancient wisdom and modern science. 
                Pure, potent, and personalized care for your holistic well-being.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-[#166534] text-white rounded-full font-medium hover:bg-[#14532d] transition-colors shadow-lg shadow-green-900/20 flex items-center gap-2">
                <Sparkles size={18} /> Explore Products
              </button>
              <button className="px-8 py-3 border-2 border-[#166534] text-[#166534] rounded-full font-medium hover:bg-[#166534] hover:text-white transition-all">
                Our Story
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop" 
                alt="Product Hero" 
                className="rounded-[2rem] shadow-2xl w-full max-w-md mx-auto object-cover h-[600px]"
              />
              <div className="absolute -left-8 top-20 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border-l-4 border-[#d4a373] animate-pulse-slow">
                <p className="font-serif text-[#166534] font-bold text-xl">100%</p>
                <p className="text-xs text-gray-600 uppercase tracking-wider">Organic Ingredients</p>
              </div>
            </div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-[#d4a373]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#166534]/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY TIMELINE */}
      <section className="py-20 bg-[#fefdf6] relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            <div className="relative border-l-2 border-[#d4a373]/30 pl-8 py-4 space-y-12">
              {timelineData.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setTimelineIndex(idx)}
                  className="relative group cursor-pointer"
                >
                  <span
                    className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-[#fefdf6]
                    ${timelineIndex === idx ? 'bg-[#166534] scale-125' : 'bg-[#d4a373]/70'}
                    transition-all`}
                  ></span>

                  <h3
                    className={`text-xl font-serif font-bold flex items-center gap-3 transition-colors
                    ${timelineIndex === idx ? 'text-[#166534]' : 'text-gray-400'}
                    group-hover:text-[#166534]`}
                  >
                    {item.icon}
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 md:p-12 rounded-tl-[4rem] rounded-br-[4rem] shadow-xl border border-gray-100 relative overflow-hidden transition-all duration-700 flex-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#166534]/5 rounded-bl-full"></div>
              <h2 className="font-serif text-4xl text-[#166534] mb-6 animate-fade-in">
                {timelineData[timelineIndex].heading}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed animate-slide-up">
                {timelineData[timelineIndex].content}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUNDERS & VISIONARIES (NEW SECTION) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#fefdf6] to-white"></div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#d4a373] uppercase tracking-widest text-xs font-bold mb-2 block">The Visionaries</span>
            <h2 className="font-serif text-4xl text-[#166534] font-bold">Meet the Founders</h2>
            <div className="w-24 h-1 bg-[#d4a373] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            
            {/* Founder 1 */}
            <div className="bg-[#fefdf6] p-8 rounded-[2rem] border border-[#166534]/10 hover:shadow-2xl transition-all group">
              <div className="flex items-center gap-6 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" 
                  alt="Founder" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <h3 className="font-serif text-2xl text-[#166534] font-bold">Dr. Aarav Mehta</h3>
                  <p className="text-[#d4a373] font-medium uppercase text-sm tracking-wider">Founder & Lead Vaidya</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed mb-6">
                "Ayurveda isn't just about herbs; it's about connecting with your own nature. My mission was to bottle the purity of my grandfather's recipes for the modern world."
              </p>
              <div className="flex justify-end">
                <Feather className="text-[#166534]/20 w-10 h-10" />
              </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-[#fefdf6] p-8 rounded-[2rem] border border-[#166534]/10 hover:shadow-2xl transition-all group">
              <div className="flex items-center gap-6 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop" 
                  alt="Co-Founder" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <h3 className="font-serif text-2xl text-[#166534] font-bold">Isha Kapoor</h3>
                  <p className="text-[#d4a373] font-medium uppercase text-sm tracking-wider">Co-Founder & Product Head</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed mb-6">
                "We wanted to create a brand that doesn't ask you to choose between efficacy and safety. Traditional Care is that promise kept."
              </p>
              <div className="flex justify-end">
                <Feather className="text-[#166534]/20 w-10 h-10" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. VALUES SECTION */}
      <section className="py-24 bg-[#fcfbf7] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#166534 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Ethically Sourced", desc: "We work directly with farmers to ensure fair wages and purity.", icon: <Leaf /> },
              { title: "Cruelty Free", desc: "Never tested on animals. Kind to you, kind to them.", icon: <Heart /> },
              { title: "Toxin Free", desc: "No parabens, sulfates, or artificial fragrances. Just nature.", icon: <Droplet /> }
            ].map((value, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#166534] to-[#14532d] flex items-center justify-center text-[#d4a373] mb-6 group-hover:rotate-12 transition-transform duration-500">
                  {React.cloneElement(value.icon, { size: 32 })}
                </div>
                <h3 className="font-serif text-2xl text-[#166534] mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CURATED RITUALS (UPDATED - INTERACTIVE) */}
      <section className="py-24 bg-[#fefdf6] relative">
        <div className="container mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl text-[#166534] font-bold">
              Curated Rituals
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Handpicked essentials designed to work better together
            </p>
          </div>

          {/* Interactive Toggle Tabs */}
          <div className="flex justify-center gap-6 mb-16">
            {["Skincare", "Haircare"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-8 py-3 rounded-full font-serif text-sm tracking-widest uppercase transition-all duration-300
                ${activeCategory === tab
                  ? "bg-[#166534] text-white shadow-lg scale-105"
                  : "bg-white border border-[#166534]/20 text-[#166534] hover:bg-[#166534]/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Content Container */}
          <div className="animate-fade-in-up key={activeCategory}"> 
            
            {/* Featured Product Card */}
            <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
              <div className="relative bg-white rounded-[2.5rem] p-12 shadow-xl border border-[#d4a373]/20">
                <span className="absolute top-6 left-6 bg-[#d4a373] text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  {ritualsContent[activeCategory].featured.tag}
                </span>

                <h3 className="font-serif text-3xl text-[#166534] mb-3 mt-4">
                  {ritualsContent[activeCategory].featured.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {ritualsContent[activeCategory].featured.desc}
                </p>

                <ul className="text-sm text-gray-500 space-y-2 mb-8">
                  {ritualsContent[activeCategory].featured.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#166534]"></div> {item}</li>
                  ))}
                </ul>

                <div className="flex items-center gap-6">
                  <span className="text-2xl font-bold text-gray-800">{ritualsContent[activeCategory].featured.price}</span>
                  <button className="bg-[#166534] text-white px-8 py-3 rounded-full hover:bg-[#14532d] transition shadow-lg shadow-green-900/20 flex items-center gap-2">
                    View Ritual <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Dynamic Image */}
              <div className="flex justify-center relative">
                <div className="absolute inset-0 bg-[#d4a373]/20 rounded-full blur-[100px] -z-10"></div>
                <img
                  src={ritualsContent[activeCategory].featured.image}
                  alt="Featured Combo"
                  className="h-[420px] object-cover rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500"
                />
              </div>
            </div>

            {/* Horizontal Product Strip */}
            <div className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x">
              {ritualsContent[activeCategory].products.map((item, i) => (
                <div
                  key={i}
                  className="min-w-[260px] snap-start bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#d4a373]/30 group"
                >
                  <div className="h-44 bg-[#f8fcf9] flex items-center justify-center rounded-t-2xl p-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-serif text-[#166534] text-lg font-bold">
                      {item.name}
                    </h4>
                    <p className="text-xs uppercase tracking-wide text-[#d4a373] mb-3 font-semibold">
                      {item.sub}
                    </p>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                      <span className="font-bold text-gray-800">{item.price}</span>
                      <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] flex items-center justify-center hover:bg-[#166534] hover:text-white transition-colors cursor-pointer">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. NATURE'S INGREDIENTS */}
      <section className="py-20 bg-[#166534] text-[#fefdf6] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[#d4a373] uppercase tracking-widest text-sm mb-2">Pure & Potent</p>
              <h2 className="font-serif text-4xl font-bold">Nature's Ingredients</h2>
            </div>
            <div className="text-white/60 hidden sm:block">Scroll to explore →</div>
          </div>

          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide">
            {[
              { name: "Neem", desc: "The ultimate purifier.", img: "https://images.unsplash.com/photo-1599423985536-24eb22444d62?q=80&w=1000&auto=format&fit=crop" },
              { name: "Saffron", desc: "For golden radiance.", img: "https://images.unsplash.com/photo-1627883296030-d3a3394747c3?q=80&w=1000" },
              { name: "Aloe Vera", desc: "Deep hydration & healing.", img: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=1000" },
              { name: "Amla", desc: "Vitamin C powerhouse.", img: "https://images.unsplash.com/photo-1576506542790-512445485a3d?q=80&w=1000" },
            ].map((ing, i) => (
              <div key={i} className="min-w-[280px] snap-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors">
                <div className="h-40 overflow-hidden">
                  <img src={ing.img} alt={ing.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-[#d4a373] mb-2">{ing.name}</h3>
                  <p className="text-white/80 font-light">{ing.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <Quote size={48} className="text-[#d4a373] mx-auto mb-8 opacity-50" />
          
          <div className="mb-8">
            <h3 className="font-serif text-3xl md:text-5xl text-[#166534] leading-tight mb-6">
              "I have never felt more connected to my skin. It feels like a ritual, not a routine."
            </h3>
            <div className="flex justify-center gap-1 mb-6">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={20} className="fill-[#d4a373] text-[#d4a373] animate-pulse" style={{animationDelay: `${s * 0.1}s`}} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#166534] p-1 mb-4">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000" alt="User" className="w-full h-full rounded-full object-cover" />
            </div>
            <p className="font-bold text-[#166534]">Elena R.</p>
            <p className="text-sm text-gray-500">Verified Buyer</p>
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#166534] to-[#0f4625]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-serif text-4xl md:text-6xl text-[#fefdf6] mb-6">
            Reconnect With Nature
          </h2>
          <p className="text-[#d4a373] text-xl mb-10 max-w-2xl mx-auto font-light">
            Care that your body understands. Embrace the purity of tradition today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-4 bg-[#fefdf6] text-[#166534] rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(254,253,246,0.3)] transition-all">
              🌿 Shop Natural Care
            </button>
            <button className="px-10 py-4 border border-[#d4a373] text-[#d4a373] rounded-full font-bold text-lg hover:bg-[#d4a373] hover:text-[#166534] transition-all">
              🤍 Talk to Us
            </button>
          </div>
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;