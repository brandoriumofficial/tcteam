import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaBolt, 
  FaShieldAlt, FaTruck, FaUndo, FaChevronDown, FaChevronUp,
  FaCheck, FaMinus, FaPlus, FaTimes, FaExclamationCircle
} from "react-icons/fa";
import { 
  fetchProductBySlug, 
  fetchProductVariations, 
  fetchProductGallery, 
  fetchProductFaqs, 
  fetchProductTabs, 
  createRazorpayOrder, 
  verifyPayment 
} from "../../api/user/produtes";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&auto=format";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Product States
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI States
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Customer Info
  const [customerInfo, setCustomerInfo] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: ''
  });

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setError("Product slug is missing");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading product data for slug:', slug);
        
        // Fetch product data first
        const productData = await fetchProductBySlug(slug);
        
        if (!productData || (productData.error && productData.error.message)) {
          throw new Error(productData?.error?.message || "Product not found");
        }
        
        if (productData && productData.id) {
          setProduct(productData);
          
          // Load other data in parallel
          const [variationsData, galleryData, faqsData, tabsData] = await Promise.allSettled([
            fetchProductVariations(slug),
            fetchProductGallery(slug),
            fetchProductFaqs(slug),
            fetchProductTabs(slug)
          ]);

          // Handle each promise result
          if (variationsData.status === 'fulfilled' && variationsData.value) {
            setVariations(variationsData.value || []);
          }

          if (galleryData.status === 'fulfilled' && galleryData.value) {
            setGallery(Array.isArray(galleryData.value) ? galleryData.value : []);
          }

          if (faqsData.status === 'fulfilled' && faqsData.value) {
            setFaqs(faqsData.value || []);
          }

          if (tabsData.status === 'fulfilled' && tabsData.value) {
            setTabs(tabsData.value || []);
          }

          // Set default variant
          if (productData.variations && productData.variations.length > 0) {
            setSelectedVariant(productData.variations[0]);
          } else if (variationsData.status === 'fulfilled' && variationsData.value && variationsData.value.length > 0) {
            setSelectedVariant(variationsData.value[0]);
          }

          // Check for Buy Now data
          const buyNowData = sessionStorage.getItem('buyNowData');
          if (buyNowData) {
            try {
              const data = JSON.parse(buyNowData);
              if (data.directBuy && data.slug === slug) {
                setQuantity(data.quantity || 1);
                setTimeout(() => setShowPaymentModal(true), 500);
              }
            } catch (e) {
              console.error('Error parsing buyNowData:', e);
            }
            sessionStorage.removeItem('buyNowData');
          }
        } else {
          throw new Error("Invalid product data received");
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError(error.message || "Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Get Current Price
  const getCurrentPrice = () => {
    if (!product) return { salePrice: 0, basePrice: 0 };
    
    let salePrice = 0;
    let basePrice = 0;
    
    if (selectedVariant) {
      salePrice = parseFloat(
        selectedVariant.price || 
        selectedVariant.sale_price || 
        product.sale_price || 
        product.price || 
        0
      );
      
      basePrice = parseFloat(
        selectedVariant.base_price || 
        product.base_price || 
        selectedVariant.price || 
        product.price || 
        0
      );
    } else {
      salePrice = parseFloat(product.sale_price || product.price || 0);
      basePrice = parseFloat(product.base_price || product.price || 0);
    }
    
    return { salePrice, basePrice };
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;
    
    const { salePrice } = getCurrentPrice();
    const cartItem = {
      productId: product.id,
      productSlug: product.slug,
      title: product.name,
      price: salePrice,
      image: product.feature_image || product.image || DEFAULT_IMAGE,
      quantity: quantity,
      variant: selectedVariant ? getVariantName(selectedVariant) : 'Default'
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const variantKey = selectedVariant ? getVariantName(selectedVariant) : 'Default';
    const idx = cart.findIndex(ci => 
      ci.productId === product.id && 
      ci.variant === variantKey
    );

    if (idx > -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    
    // Show success message
    alert(`${product.name} added to cart successfully!`);
  };

  // Process Payment
  const processPayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill all required fields (Name, Email, Phone, Address)');
      return;
    }

    setIsProcessing(true);

    try {
      const { salePrice } = getCurrentPrice();
      const totalAmount = salePrice * quantity;

      const orderData = await createRazorpayOrder({
        amount: totalAmount * 100, // Razorpay expects paise
        currency: 'INR',
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        variant: selectedVariant ? getVariantName(selectedVariant) : 'Default',
        customer: customerInfo
      });

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const options = {
        key: orderData.razorpay_key || process.env.RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Naturali',
        description: `Purchase: ${product.name} - ${selectedVariant ? getVariantName(selectedVariant) : ''}`,
        order_id: orderData.order_id,
        handler: async function(response) {
          try {
            const verifyData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyData.success) {
              setShowPaymentModal(false);
              navigate(`/order-success?order_id=${verifyData.order_id}`);
            } else {
              alert('Payment verification failed: ' + (verifyData.message || 'Unknown error'));
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
            alert('Error verifying payment. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        notes: {
          address: customerInfo.address,
          product_id: product.id
        },
        theme: { color: '#2f7d32' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response) => {
        alert(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setIsProcessing(false);
      });
      
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
      setIsProcessing(false);
    }
  };

  // Get all images safely
  const getAllImages = () => {
    const images = [];
    
    if (!product) return [DEFAULT_IMAGE];
    
    // Add main product images
    const mainImages = [
      product.feature_image,
      product.banner_image,
      product.side_image,
      product.image,
      product.thumbnail
    ];
    
    mainImages.forEach(img => {
      if (img && typeof img === 'string' && img.trim() !== '' && img !== 'null' && img !== 'undefined') {
        images.push(img);
      }
    });
    
    // Add gallery images
    if (Array.isArray(gallery)) {
      gallery.forEach(item => {
        if (item && typeof item === 'object') {
          const possibleKeys = ['media_url', 'image_url', 'url', 'src', 'image', 'full_url'];
          for (let key of possibleKeys) {
            if (item[key] && typeof item[key] === 'string' && item[key].trim() !== '') {
              images.push(item[key]);
              break;
            }
          }
        } else if (typeof item === 'string' && item.trim() !== '') {
          images.push(item);
        }
      });
    }
    
    // If no images found, use default
    if (images.length === 0) {
      return [DEFAULT_IMAGE];
    }
    
    return images;
  };

  // Get variation name
  const getVariantName = (variant) => {
    if (!variant) return 'Default';
    
    if (typeof variant === 'string') return variant;
    
    if (typeof variant === 'object') {
      if (variant.name) return variant.name;
      if (variant.variant_name) return variant.variant_name;
      if (variant.size && variant.unit) return `${variant.size}${variant.unit}`;
      if (variant.size) return variant.size.toString();
      if (variant.label) return variant.label;
      if (variant.title) return variant.title;
    }
    
    return 'Default';
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '0.00';
    return parseFloat(price).toFixed(2);
  };

  // Handle image error
  const handleImageError = (e) => {
    console.log('Image failed to load, using default');
    e.target.src = DEFAULT_IMAGE;
    e.target.onerror = null; // Prevent infinite loop
  };

  // Get current image URL safely
  const getCurrentImage = () => {
    const allImages = getAllImages();
    if (allImages.length === 0) {
      return DEFAULT_IMAGE;
    }
    const index = selectedImage >= 0 && selectedImage < allImages.length ? selectedImage : 0;
    return allImages[index];
  };

  // Handle Buy Now click
  const handleBuyNow = () => {
    if (product.stock_status !== 'In Stock') {
      alert('This product is out of stock');
      return;
    }
    setShowPaymentModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6e4]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2f7d32] border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-600">Loading product details...</p>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6e4] p-4">
        <FaExclamationCircle className="text-6xl text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error || "The product you're looking for doesn't exist or has been removed."}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-[#2f7d32] text-white rounded-lg hover:bg-[#27632a] transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { salePrice, basePrice } = getCurrentPrice();
  const discount = basePrice > salePrice && basePrice > 0 
    ? Math.round(((basePrice - salePrice) / basePrice) * 100) 
    : 0;
  
  const allImages = getAllImages();
  const currentImage = getCurrentImage();

  return (
    <div className="min-h-screen bg-[#fdf6e4]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onError={handleImageError}
                loading="lazy"
              />
              
              {discount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                >
                  {discount}% OFF
                </motion.div>
              )}

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition duration-300 hover:shadow-xl"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWishlisted ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-xl" />
                )}
              </button>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === idx 
                        ? 'border-[#2f7d32] shadow-lg scale-105' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} - view ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <FaStar 
                      key={star} 
                      className={star <= Math.round(product.rating || 4) ? 'text-[#c6a23d]' : 'text-gray-300'} 
                    />
                  ))}
                  <span className="ml-2 font-semibold">{product.rating || '4.5'}</span>
                </div>
                <span className="text-gray-500">({product.review_count || 0} Reviews)</span>
              </div>
            </div>

            <p className="text-gray-600 text-lg">{product.short_description || product.description?.substring(0, 200) + '...'}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#2f7d32]">₹{formatPrice(salePrice)}</span>
              {basePrice > salePrice && basePrice > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{formatPrice(basePrice)}</span>
                  <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                    Save ₹{formatPrice(basePrice - salePrice)}
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {variations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-lg">Select Variant:</h3>
                <div className="flex flex-wrap gap-3">
                  {variations.map((v, idx) => (
                    <button
                      key={v.id || `variant-${idx}`}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-200 ${
                        selectedVariant?.id === v.id
                          ? 'border-[#2f7d32] bg-[#2f7d32] text-white shadow-md'
                          : 'border-gray-300 hover:border-[#2f7d32] hover:shadow-sm'
                      }`}
                    >
                      {getVariantName(v)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-lg">Quantity:</span>
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <button 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)} 
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FaMinus size={14} />
                </button>
                <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                <button 
                  onClick={() => quantity < 10 && setQuantity(quantity + 1)} 
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  <FaPlus size={14} />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-2 ${product.stock_status === 'In Stock' ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock_status === 'In Stock' ? (
                <>
                  <FaCheck className="text-green-500" />
                  <span className="font-medium">In Stock</span>
                  <span className="text-sm text-gray-500 ml-2">• Usually ships in 24 hours</span>
                </>
              ) : (
                <>
                  <FaTimes className="text-red-500" />
                  <span className="font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status !== 'In Stock'}
                className="flex-1 py-4 rounded-xl bg-white border-2 border-[#2f7d32] text-[#2f7d32] font-bold flex items-center justify-center gap-3 hover:bg-[#f0f8f0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <FaShoppingCart /> ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock_status !== 'In Stock'}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-bold flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl"
              >
                <FaBolt /> BUY NOW
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center p-3 bg-white/50 rounded-xl hover:bg-white transition">
                <FaShieldAlt className="text-2xl text-[#2f7d32] mb-2" />
                <span className="text-sm font-medium text-gray-800">100% Authentic</span>
                <span className="text-xs text-gray-600">Quality Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white/50 rounded-xl hover:bg-white transition">
                <FaTruck className="text-2xl text-[#2f7d32] mb-2" />
                <span className="text-sm font-medium text-gray-800">Free Shipping</span>
                <span className="text-xs text-gray-600">Above ₹499</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white/50 rounded-xl hover:bg-white transition">
                <FaUndo className="text-2xl text-[#2f7d32] mb-2" />
                <span className="text-sm font-medium text-gray-800">Easy Returns</span>
                <span className="text-xs text-gray-600">10 Day Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Tabs */}
        {tabs.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex gap-2 border-b overflow-x-auto pb-1 scrollbar-thin">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id || `tab-${idx}`}
                  onClick={() => setActiveTab(idx)}
                  className={`px-6 py-3 font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeTab === idx 
                      ? 'text-[#2f7d32] border-b-2 border-[#2f7d32] bg-[#f0f8f0] rounded-t-lg' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.tab_title || tab.title || `Tab ${idx + 1}`}
                </button>
              ))}
            </div>
            <div className="py-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: tabs[activeTab]?.tab_content || 
                          tabs[activeTab]?.content || 
                          tabs[activeTab]?.description || 
                          '<p>No content available</p>' 
                }} 
              />
            </div>
          </div>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={faq.id || `faq-${index}`} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === (faq.id || index) ? null : (faq.id || index))}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold hover:bg-gray-50 transition"
                    aria-expanded={expandedFaq === (faq.id || index)}
                  >
                    <span className="text-lg">{faq.question || `Question ${index + 1}`}</span>
                    {expandedFaq === (faq.id || index) ? 
                      <FaChevronUp className="text-gray-500" /> : 
                      <FaChevronDown className="text-gray-500" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedFaq === (faq.id || index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-gray-600">
                          {faq.answer || 'No answer available'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isProcessing && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Complete Your Order</h2>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isProcessing}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 transition"
                    aria-label="Close modal"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>
                
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="flex gap-4">
                    <div className="relative">
                      <img 
                        src={product.feature_image || product.image || DEFAULT_IMAGE} 
                        alt={product.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={handleImageError}
                      />
                      <div className="absolute -top-2 -right-2 bg-[#2f7d32] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      {selectedVariant && (
                        <p className="text-sm text-gray-600 mt-1">
                          Variant: <span className="font-medium">{getVariantName(selectedVariant)}</span>
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <p className="text-sm text-gray-500">Unit Price</p>
                          <p className="font-bold text-[#2f7d32]">₹{formatPrice(salePrice)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-xl font-bold text-[#2f7d32]">₹{formatPrice(salePrice * quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-800">Shipping Details</h3>
                  
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f7d32] focus:border-transparent outline-none transition"
                    required
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email *"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f7d32] focus:border-transparent outline-none"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f7d32] focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  
                  <textarea
                    placeholder="Full Address *"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#2f7d32] focus:border-transparent outline-none"
                    rows="3"
                    required
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={customerInfo.pincode}
                      onChange={(e) => setCustomerInfo({...customerInfo, pincode: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-lg font-medium text-gray-800">Order Total</p>
                      <p className="text-sm text-gray-500">Including all taxes</p>
                    </div>
                    <span className="text-2xl font-bold text-[#2f7d32]">₹{formatPrice(salePrice * quantity)}</span>
                  </div>

                  <button
                    onClick={processPayment}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#2f7d32] to-[#388e3c] text-white font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <FaBolt /> Pay Securely ₹{formatPrice(salePrice * quantity)}
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <FaShieldAlt className="text-green-500" />
                    <p className="text-xs text-center text-gray-500">
                      100% Secure Payment • Powered by Razorpay • SSL Encrypted
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}