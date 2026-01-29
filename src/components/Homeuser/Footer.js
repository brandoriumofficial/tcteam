import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  MessageCircle, 
  Send,
  Leaf,
  MapPin,
  Mail
} from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }


  return (
    <footer className="bg-[#fcfbf7] text-gray-700 font-sans border-t border-[#166534]/10">
      
      <div className="w-full h-2 bg-gradient-to-r from-[#166534] via-[#d4a373] to-[#166534]"></div>

      <div className="container mx-auto px-6 pt-16 pb-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#166534] rounded-full flex items-center justify-center text-[#d4a373]">
                <Leaf size={20} />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#166534]">Traditional Care</h2>
                <span className="text-[10px] tracking-widest uppercase text-[#d4a373]">Est. 1985</span>
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed text-gray-600">
              Rooted in Ayurveda. Crafted with Care. <br/>
              We bring the secrets of ancient Indian wellness to your modern daily ritual.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-[#166534]">
                <MapPin size={16} className="shrink-0" />
                <span>128 Heritage Rd, Kerala, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#166534]">
                <Mail size={16} className="shrink-0" />
                <span>care@traditionalcare.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#166534] mb-6 relative inline-block">
              Shop Categories
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#d4a373]"></span>
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                "Hair Care", 
                "Skin Care", 
                "Body Wellness", 
                "Ayurvedic Ingredients", 
                "Gift Combos", 
                "New Launches",
                "Men's Range"
              ].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="hover:text-[#166534] hover:translate-x-1 transition-all duration-300 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#166534] mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#d4a373]"></span>
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { name: "About Us", path: "/about" },
                { name: "Our Blog", path: "/blog" },
                { name: "Contact Support", path: "/contact" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Return & Refund", path: "/refunds" },
                { name: "Track Order", path: "/track" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-[#166534] hover:translate-x-1 transition-all duration-300 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#166534] mb-2">Join Our Family 🌿</h3>
              <p className="text-xs text-gray-500 mb-4">
                Subscribe for Ayurvedic tips, exclusive offers, and early access to new harvests.
              </p>
              
              <form className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full pl-4 pr-12 py-3 rounded-lg bg-white border border-[#166534]/20 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                />
                <button 
                  type="button" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#166534] text-white rounded-md flex items-center justify-center hover:bg-[#14532d] transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>

            <div>
              <p className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook size={18} />, url: "#" },
                  { icon: <Instagram size={18} />, url: "#" },
                  { icon: <Youtube size={18} />, url: "#" },
                  { icon: <Linkedin size={18} />, url: "#" },
                  { icon: <MessageCircle size={18} />, url: "#" }
                ].map((social, idx) => (
                  <a 
                    key={idx} 
                    href={social.url}
                    className="w-9 h-9 rounded-full bg-white border border-[#166534]/20 flex items-center justify-center text-[#166534] hover:bg-[#166534] hover:text-[#d4a373] hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#166534]/10 py-8 mb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#166534]">Available On:</span>
            <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="h-6 flex items-center font-bold text-lg text-slate-800">Amazon</div>
              <div className="h-6 flex items-center font-bold text-lg text-blue-600">Flipkart</div>
              <div className="h-6 flex items-center font-bold text-lg text-yellow-500">Blinkit</div>
              <div className="h-6 flex items-center font-bold text-lg text-purple-700">Nykaa</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 pt-8 border-t border-[#166534]/10">
          <p>&copy; {new Date().getFullYear()} Traditional Care Pvt Ltd. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1"> Made with <span className="text-red-500">♥</span> in India</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;