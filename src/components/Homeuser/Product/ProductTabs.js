import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaCheckCircle, FaTimesCircle, FaBolt } from "react-icons/fa"; 
import { FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { fetchProductsByCategory } from "../../../api/user/produtes";
import NewLaunches from "../NewLaunches";
import { API_URL } from "../../../api/API_URL";

const tabs = ["Hair", "Skin", "Body"];

/* --- STATIC FALLBACK DATA --- */
const staticProducts = {
  hair: [
    { id: "h1", slug: "naturali-anti-hairfall-shampoo", title: "Naturali Anti-Hairfall Shampoo", price: "₹453", oldPrice: "₹533", rating: 4.63, reviews: 317, img: "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg", detail: "Strengthens roots", variants: ["200ML", "370ML", "500ML"] },
    { id: "h2", slug: "naturali-anti-dandruff-shampoo", title: "Naturali Anti-Dandruff Shampoo", price: "₹453", oldPrice: "₹533", rating: 4.76, reviews: 136, img: "https://static.wixstatic.com/media/efc433_64956fa734094daba96103d7d9ebea54~mv2.png", hoverImg: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png", detail: "Controls dandruff", variants: ["200ML", "370ML", "500ML"] },
    { id: "h3", slug: "naturali-anti-hairfall-conditioner", title: "Naturali Anti-Hairfall Conditioner", price: "₹305", oldPrice: "₹359", rating: 4.75, reviews: 12, img: "https://static.wixstatic.com/media/efc433_7a85405c57f7426ba783e337026b6602~mv2.png", hoverImg: "https://static.wixstatic.com/media/efc433_cbac1b80430b4d84bcbb397ab8d691d1~mv2.jpeg", detail: "Deep nourishment", variants: ["200ML", "370ML", "500ML"] },
    { id: "h4", slug: "naturali-hair-fall-arrest-shampoo", title: "Naturali Hair Fall Arrest Shampoo", price: "₹416", oldPrice: "₹490", rating: 4.55, reviews: 1616, img: "https://static.wixstatic.com/media/efc433_0e37903034a84e99875181bca9ed7464~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_64956fa734094daba96103d7d9ebea54~mv2.png", detail: "Reduces hair fall", variants: ["200ML", "370ML", "500ML"] },
  ],
  skin: [
    { id: "s1", slug: "vitamin-c-facewash", title: "Vitamin-C Facewash", price: "₹249", oldPrice: "₹299", rating: 4.72, reviews: 214, img: "https://static.wixstatic.com/media/efc433_860ed21764984c5c83bd8be8b29a7297~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_860ed21764984c5c83bd8be8b29a7297~mv2.jpeg", detail: "Brightens skin & removes impurities", variants: ["100ML", "200ML"] },
    { id: "s2", slug: "vitamin-c-toner", title: "Vitamin-C Toner", price: "₹199", oldPrice: "₹249", rating: 4.65, reviews: 182, img: "https://static.wixstatic.com/media/efc433_7e4b5d040f954b6997fe7254f358ffc6~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_7e4b5d040f954b6997fe7254f358ffc6~mv2.jpeg", detail: "Tightens pores & refreshes skin", variants: ["100ML", "200ML"] },
    { id: "s3", slug: "vitamin-c-moisturizer", title: "Vitamin-C Moisturizer", price: "₹399", oldPrice: "₹499", rating: 4.78, reviews: 96, img: "https://static.wixstatic.com/media/efc433_d6e2f3f5e6624593a45a2cb766dcab39~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_d6e2f3f5e6624593a45a2cb766dcab39~mv2.jpeg", detail: "Deep hydration & glowing skin", variants: ["50ML", "100ML"] },
    { id: "s4", slug: "vitamin-c-serum", title: "Vitamin-C Serum", price: "₹499", oldPrice: "₹599", rating: 4.81, reviews: 328, img: "https://static.wixstatic.com/media/efc433_49c13bdabbf341d6b437d72e21dc7ca0~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_49c13bdabbf341d6b437d72e21dc7ca0~mv2.jpeg", detail: "Reduces spots & boosts radiance", variants: ["30ML", "50ML"] },
    { id: "s5", slug: "tea-tree-facewash", title: "Tea Tree with Salicylic Acid Facewash", price: "₹249", oldPrice: "₹349", rating: 4.02, reviews: 200, img: "https://static.wixstatic.com/media/efc433_1565128e8c0141af9c3c5917aada17ec~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_1565128e8c0141af9c3c5917aada17ec~mv2.jpeg", detail: "Controls acne & excess oil", variants: ["100ML", "200ML"] },
    { id: "s6", slug: "tea-tree-toner", title: "Tea Tree with Salicylic Acid Toner", price: "₹249", oldPrice: "₹349", rating: 4.02, reviews: 200, img: "https://static.wixstatic.com/media/efc433_0cbeebb168fe4aa2b393f17072d6c4d6~mv2.jpg", hoverImg: "https://static.wixstatic.com/media/efc433_0cbeebb168fe4aa2b393f17072d6c4d6~mv2.jpg", detail: "Unclogs pores & balances oil", variants: ["100ML", "200ML"] },
    { id: "s7", slug: "tea-tree-moisturizer", title: "Tea Tree Moisturizer", price: "₹249", oldPrice: "₹349", rating: 4.02, reviews: 200, img: "https://static.wixstatic.com/media/efc433_ece5e32d13ed46e2b6437dbf263a990f~mv2.jpg", hoverImg: "https://static.wixstatic.com/media/efc433_ece5e32d13ed46e2b6437dbf263a990f~mv2.jpg", detail: "Lightweight hydration", variants: ["50ML", "100ML"] },
    { id: "s8", slug: "tea-tree-serum", title: "Tea Tree Serum", price: "₹249", oldPrice: "₹349", rating: 4.02, reviews: 200, img: "https://static.wixstatic.com/media/efc433_51e8a71e5e57461d876c8044e87b9dff~mv2.jpeg", hoverImg: "https://static.wixstatic.com/media/efc433_51e8a71e5e57461d876c8044e87b9dff~mv2.jpeg", detail: "Targets active acne", variants: ["30ML", "50ML"] },
  ],
  body: [
    { id: "b1", slug: "rice-soap", title: "Rice Soap", price: "₹249", oldPrice: "₹349", rating: 4.02, reviews: 200, img: "https://static.wixstatic.com/media/efc433_6797ad2ce8f546f39569dc1f17163666~mv2.jpg", hoverImg: "https://static.wixstatic.com/media/efc433_6797ad2ce8f546f39569dc1f17163666~mv2.jpg", detail: "Brightens skin", variants: ["75g", "125g"] },
    { id: "b2", slug: "kumkumadi-soap", title: "KumKumadi Soap", price: "₹249", oldPrice: "₹349", rating: 4.02, reviews: 200, img: "https://static.wixstatic.com/media/efc433_5e93c8fc6b78471fb9fa94a45915584a~mv2.jpg", hoverImg: "https://static.wixstatic.com/media/efc433_5e93c8fc6b78471fb9fa94a45915584a~mv2.jpg", detail: "Ayurvedic glow", variants: ["75g", "125g"] },
    { id: "b3", slug: "charcoal-soap", title: "Charcoal Soap", price: "₹249", oldPrice: "₹349", rating: 4.02, reviews: 200, img: "https://static.wixstatic.com/media/efc433_7439f150e2dd47d48ecbc07345d15310~mv2.jpg", hoverImg: "https://static.wixstatic.com/media/efc433_7439f150e2dd47d48ecbc07345d15310~mv2.jpg", detail: "Deep pore cleansing", variants: ["75g", "125g"] },
  ]
};

/* --- Helper function to format variations --- */
const formatVariations = (variations) => {
  console.log("Formatting variations:", variations);
  if (!variations) return [];
  
  // If variations is an array of strings
  if (Array.isArray(variations) && variations.length > 0 && typeof variations[0] === 'string') {
    return variations;
  }
  
  // If variations is an array of objects (from API)
  if (Array.isArray(variations) && variations.length > 0 && typeof variations[0] === 'object') {
    // Create string representations like "200ML", "100ML", etc.
    return variations.map(variation => {
      if (variation.size && variation.unit) {
        return `${variation.size}${variation.unit}`;
      }
      if (variation.label) {
        return variation.label;
      }
      if (variation.size) {
        return `${variation.size}`;
      }
      return 'Default';
    });
  }
  
  // Default fallback
  return [];
};

/* --- PRODUCT ITEM COMPONENT --- */
const ProductItem = ({ item, isCenter, triggerToast }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Format variations properly
  const formattedVariants = formatVariations(item.variations || item.variants || staticProducts[item.category]?.find(p => p.id === item.id)?.variants || []);
  const [selectedVariant, setSelectedVariant] = useState(formattedVariants[0] || "370ML");

  const increaseQty = () => setQuantity(quantity + 1);
  const decreaseQty = () => { if (quantity > 1) setQuantity(quantity - 1); };

  // Wishlist Toggle
  const toggleWishlist = (e) => {
    e.stopPropagation(); 
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    triggerToast(newState ? "Added to Wishlist ❤️" : "Removed from Wishlist 💔");
  };

  // Add to Cart
  const handleAddToCart = () => {
    const cartItem = {
      productId: item.id,
      productSlug: item.slug,
      title: item.title || item.name,
      price: item.sale_price || item.price || item.base_price,
      image: item.img || item.feature_image,
      quantity: quantity,
      variant: selectedVariant
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = existingCart.findIndex(
      ci => ci.productId === item.id && ci.variant === selectedVariant
    );

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: existingCart }));
    triggerToast("Added to Cart 🛒");
  };

  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return '₹0';
    if (typeof price === 'string' && price.includes('₹')) return price;
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Get sale price
  const getSalePrice = () => {
    if (item.sale_price) return formatPrice(item.sale_price);
    if (item.price) return formatPrice(item.price);
    return '₹0';
  };

  // Get base price
  const getBasePrice = () => {
    if (item.base_price) return formatPrice(item.base_price);
    if (item.oldPrice) return formatPrice(item.oldPrice);
    return '';
  };

  const mobileScaleClass = isCenter 
    ? "scale-105 shadow-[0_20px_40px_rgba(198,162,61,0.25)] border-[#c6a23d] z-10" 
    : "scale-95 opacity-80 border-transparent z-0";

  return (
    <div
      className={`
        flex flex-col items-center text-center 
        bg-white rounded-3xl 
        p-3 sm:p-5   
        shadow-[0_10px_30px_rgba(47,125,50,0.15)]
        border border-[#e7e2c7]
        hover:shadow-[0_16px_40px_rgba(47,125,50,0.25)]
        transition-all duration-500 ease-in-out
        min-w-[280px] sm:min-w-[330px]
        relative
        ${mobileScaleClass} md:scale-100 md:opacity-100 md:border-[#e7e2c7] md:shadow-[0_10px_30px_rgba(47,125,50,0.15)]
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ribbon Badge */}
      {item.ribbon && (
        <div 
          className="absolute top-4 left-0 z-20 px-3 py-1 text-xs font-bold text-white rounded-r-full shadow-md"
          style={{ backgroundColor: item.badge_color || '#e11d48' }}
        >
          {item.ribbon}
        </div>
      )}
      
      <div className={`relative w-full h-[300px] sm:h-[340px] rounded-2xl overflow-hidden bg-transparent shrink-0`}>
        
        {/* Wishlist Icon */}
        <button 
          onClick={toggleWishlist}
          className={`
            absolute bottom-3 right-3 z-30 
            w-10 h-10 flex items-center justify-center rounded-full 
            bg-white/90 backdrop-blur-md shadow-lg border border-gray-100
            transition-all duration-300 ease-in-out
            active:scale-90 hover:scale-110
            group
          `}
        >
          {isWishlisted ? (
            <FaHeart className="text-[#e11d48] text-lg drop-shadow-sm animate-pulse" />
          ) : (
            <FaRegHeart className="text-gray-400 text-lg group-hover:text-[#e11d48] transition-colors" />
          )}
        </button>

        <img 
          src={item.img ? (item.img.includes('http') ? item.img : `${API_URL}/${item.img}`) : `${API_URL}/${item.feature_image}`} 
          alt={item.title || item.name} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${hovered ? "scale-105" : "scale-100"}`} 
        />
        
        <img 
          src={item.hoverImg ? (item.hoverImg.includes('http') ? item.hoverImg : `${API_URL}/${item.hoverImg}`) : `${API_URL}/${item.side_image || item.img}`} 
          alt="hover" 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-110"}`} 
        />
        
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center px-6 transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <p className="text-white text-sm font-medium tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform">
            {item.detail || item.short_description || 'Premium quality product'}
          </p>
        </div>
      </div>

      <h3 className="mt-3 text-sm sm:text-base font-semibold text-[#2f7d32] leading-snug line-clamp-2 h-[40px] flex items-center justify-center px-2">
        {item.title || item.name}
      </h3>

      <div className="flex items-center justify-center gap-1 mt-1 text-xs">
        <div className="flex text-[#c6a23d]">
          {Array.from({ length: 5 }).map((_, idx) => (
            <FaStar 
              key={idx} 
              className={idx < Math.round(item.rating || 4) ? "text-[#c8a14b]" : "text-gray-300"} 
            />
          ))}
        </div>
        <span className="ml-1 font-medium">{parseFloat(item.rating || 0).toFixed(2)}</span>
        <span className="text-gray-400 mx-1">|</span>
        <span className="text-gray-500">{item.reviews || item.review_count || 0} reviews</span>
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-1">
        <p className="text-sm sm:text-base font-bold text-gray-800">
          MRP: {getSalePrice()}
          {getBasePrice() && (
            <span className="line-through text-gray-400 ml-2 font-normal text-xs">
              {getBasePrice()}
            </span>
          )}
        </p>
        
        {formattedVariants.length > 0 && (
          <div className="relative inline-block mb-1">
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="appearance-none bg-[#fffbf2] border border-[#e0d6c2] text-gray-800 font-bold text-[11px] sm:text-xs py-1.5 pl-4 pr-8 rounded-full focus:outline-none focus:border-[#c8a14b] cursor-pointer uppercase tracking-wide"
            >
              {formattedVariants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={12} />
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between gap-2 mt-3 px-1">
        {/* Quantity */}
        <div className="flex items-center bg-[#f2efe4] rounded-lg h-[42px] w-[75px] justify-between px-1 shrink-0 border border-[#e0d6c2]">
          <button onClick={decreaseQty} className="w-7 h-full flex items-center justify-center text-lg text-gray-600 hover:text-black pb-1 hover:bg-black/5 rounded-l-md transition-colors">−</button>
          <span className="font-bold text-gray-800 text-sm">{quantity}</span>
          <button onClick={increaseQty} className="w-7 h-full flex items-center justify-center text-lg text-gray-600 hover:text-black pb-1 hover:bg-black/5 rounded-r-md transition-colors">+</button>
        </div>

        {/* Add to Cart */}
        <button onClick={handleAddToCart} className="custom-cart-btn">
          <div className="icon-wrapper">
            <svg className="cart-icon" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" className="product-icon">
              <path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"></path>
            </svg>
          </div>
          <span className="text-[10px] sm:text-xs font-bold tracking-wide">ADD</span>
        </button>

      </div>
    </div>
  );
};

/* --- TOAST COMPONENT --- */
const ToastNotification = ({ show, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[9999] 
                     flex items-center gap-3 px-6 py-3 
                     bg-[#1a1a1a]/90 backdrop-blur-md text-white 
                     rounded-full shadow-2xl border border-white/10"
        >
          {message.includes("Removed") ? (
            <FaTimesCircle className="text-red-400 text-lg" />
          ) : (
            <FaCheckCircle className="text-green-400 text-lg" />
          )}
          <span className="text-sm font-semibold tracking-wide">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* --- MAIN COMPONENT --- */
export default function CategoryDetailSection() {
  const [activeTab, setActiveTab] = useState("Hair");
  const sliderRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: "" });

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProductsByCategory(activeTab.toLowerCase());
        if (data && data.length > 0) {
          // Process API data to ensure it has proper structure
          const processedData = data.map(product => ({
            id: product.id,
            slug: product.slug,
            title: product.name,
            name: product.name,
            price: product.sale_price,
            base_price: product.base_price,
            oldPrice: product.base_price,
            rating: parseFloat(product.rating || 0),
            reviews: product.review_count || 0,
            img: product.feature_image,
            feature_image: product.feature_image,
            side_image: product.side_image,
            hoverImg: product.side_image || product.feature_image,
            detail: product.short_description,
            variations: product.variations,
            variants: formatVariations(product.variations),
            ribbon: product.ribbon,
            badge_color: product.badge_color            
          }));
          console.log(`Loaded ${processedData.length} products for tab: ${activeTab}`);
          setProducts(processedData);
        } else {
          // Use static fallback
          setProducts(staticProducts[activeTab.toLowerCase()] || []);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(staticProducts[activeTab.toLowerCase()] || []);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeTab]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const displayProducts = isMobile && products.length > 0 ? [...products, ...products, ...products] : products;

  const scrollLeft = () => { 
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };
  
  const scrollRight = () => { 
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  // Auto scroll for mobile
  useEffect(() => {
    if (!isMobile || products.length === 0) return;
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollLeft = 0;
    setCenterIndex(0);
    
    let intervalId;
    const startScroll = setTimeout(() => {
      const cardWidth = 280 + 16;
      const handleScroll = () => {
        const centerPosition = slider.scrollLeft + (slider.clientWidth / 2);
        const index = Math.floor(centerPosition / cardWidth) % products.length;
        setCenterIndex(index);
      };
      slider.addEventListener("scroll", handleScroll);
      
      const autoScroll = () => {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (slider.scrollLeft >= maxScroll - 10) {
          slider.scrollTo({ left: 0, behavior: 'smooth' }); 
        } else {
          slider.scrollBy({ left: cardWidth, behavior: 'smooth' }); 
        }
      };
      intervalId = setInterval(autoScroll, 2000);
      
      return () => {
        slider.removeEventListener("scroll", handleScroll);
        clearInterval(intervalId);
      };
    }, 300);
    
    return () => clearTimeout(startScroll);
  }, [activeTab, products, isMobile]);

  return (
    <>
      <style>{`
        .custom-cart-btn {
          flex: 1;
          max-width: 90px;
          height: 42px;
          border: none;
          border-radius: 10px; 
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px; 
          color: white;
          font-weight: 500;
          position: relative;
          background: linear-gradient(135deg, #6b9a4c 0%, #2f7d32 100%);
          box-shadow: 0 5px 15px rgba(47, 125, 50, 0.3);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          overflow: hidden;
        }
        .custom-cart-btn:active { transform: scale(0.96); }
        .custom-cart-btn:hover { background: linear-gradient(135deg, #7ab356 0%, #388e3c 100%); }
        
        .buy-now-btn {
          flex: 1;
          max-width: 80px;
          height: 42px;
          border: none;
          border-radius: 10px; 
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px; 
          color: white;
          font-weight: 600;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
        }
        .buy-now-btn:active { transform: scale(0.96); }
        .buy-now-btn:hover { 
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }
        
        .icon-wrapper { position: relative; width: 1em; height: 1em; display: flex; align-items: center; justify-content: center; }
        .cart-icon { z-index: 2; width: 100%; height: 100%; }
        .product-icon { position: absolute; width: 12px; border-radius: 3px; left: 1px; bottom: 2px; opacity: 0; z-index: 1; fill: rgb(211, 211, 211); }
        .custom-cart-btn:hover .product-icon { animation: slide-in-top 1.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes slide-in-top { 0% { transform: translateY(-25px); opacity: 1; } 100% { transform: translateY(0) rotate(-90deg); opacity: 1; } }
        .custom-cart-btn:hover .cart-icon { animation: slide-in-left 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes slide-in-left { 0% { transform: translateX(-5px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        
        .tab-wrapper {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .tab-btn {
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 14px;
          border: 2px solid #e0d6c2;
          background: white;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .tab-btn:hover {
          border-color: #c6a23d;
          color: #c6a23d;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, #c6a23d 0%, #a8892f 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(198, 162, 61, 0.3);
        }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Toast */}
      <ToastNotification show={toast.show} message={toast.message} />

      <section className="bg-[#fdf6e4] pt-0 pb-8 md:pt-2 md:pb-10 px-4 relative">
        {/* Tabs */}
        <div className="tab-wrapper">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-[1400px] mx-auto">
          {/* Navigation Arrows */}
          {products.length > 3 && (
            <>
              <button onClick={scrollLeft} className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center hover:bg-[#c6a23d] hover:text-white transition z-20">
                <FiChevronLeft size={22} />
              </button>
              <button onClick={scrollRight} className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center hover:bg-[#c6a23d] hover:text-white transition z-20">
                <FiChevronRight size={22} />
              </button>
            </>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#c6a23d] border-t-transparent"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                ref={sliderRef}
                key={activeTab}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className={`
                  flex gap-4 md:gap-6 
                  pb-4 pt-2
                  overflow-x-auto 
                  scroll-smooth 
                  select-none 
                  scrollbar-hide
                  ${activeTab === "Body" || products.length <= 3 ? "md:justify-center" : ""}
                `}
              >
                {displayProducts.map((item, i) => (
                  <ProductItem 
                    key={`${item.id}-${i}`} 
                    item={item} 
                    isCenter={i % products.length === centerIndex} 
                    triggerToast={triggerToast}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
      <NewLaunches />
    </>
  );
}