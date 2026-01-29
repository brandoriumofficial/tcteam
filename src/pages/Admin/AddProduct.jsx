import React, { useState, useRef, useEffect } from "react";
import { 
  FaCloudUploadAlt, FaVideo, FaCheck, FaTrash, FaImage, 
  FaTruck, FaRulerCombined, FaBoxOpen, FaSave, FaGoogle, 
  FaPlusCircle, FaTimesCircle, FaHeading, FaList, FaListOl, 
  FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, 
  FaAlignRight, FaLink, FaQuoteLeft, FaUndo, FaRedo
} from "react-icons/fa";
import { 
  MdOutlineTitle, MdDescription, MdLocalOffer, 
  MdFormatColorText
} from "react-icons/md";
import { AiOutlineShopping } from "react-icons/ai";
import { TbHeading } from "react-icons/tb";

// --- DUMMY DATA ---
const AVAILABLE_OFFERS = [
  { id: 1, name: "Summer Sale", type: "percentage", value: 20, label: "Summer Sale (20% Off)", minPurchase: 1000 },
  { id: 2, name: "Flash Sale", type: "flat", value: 500, label: "Flat ₹500 Off", minPurchase: 2000 },
  { id: 3, name: "Buy 1 Get 1", type: "bogo", value: 0, label: "Buy 1 Get 1 Free", minPurchase: 0 },
  { id: 4, name: "Free Shipping", type: "shipping", value: 0, label: "Free Shipping", minPurchase: 1500 }
];

const AVAILABLE_COUPONS = [
  { id: 1, code: "SUMMER10", type: "percentage", value: 10, label: "Summer Sale (10% Off)", minPurchase: 500, usageLimit: 100, startDate: "2024-01-01", expiryDate: "2024-12-31", categories: ["All"] },
  { id: 2, code: "FLAT500", type: "flat", value: 500, label: "Flat ₹500 Off", minPurchase: 2000, usageLimit: 50, startDate: "2024-01-01", expiryDate: "2024-06-30", categories: ["All"] },
  { id: 3, code: "HAIRCARE20", type: "percentage", value: 20, label: "Hair Care Special (20% Off)", minPurchase: 1000, usageLimit: 200, startDate: "2024-02-01", expiryDate: "2024-03-31", categories: ["Hair Care"] }
];

const UNIT_OPTIONS = ["ml", "kg", "gm", "l", "piece", "pair", "set", "cm"];
const CATEGORIES = ["Hair Care", "Skin Care", "Body Care", "Face Care", "Makeup", "Fragrance", "Wellness"];
const BRANDS = ["Naturali", "Organic Touch", "PureGlow", "Herbal Essence", "Forest Secrets"];
const RIBBON_OPTIONS = ["New Arrival", "Best Seller", "Limited Edition", "Hot Deal", "Trending", "Premium"];

// Review Modal Component
const ReviewModal = ({ show, onClose, onAddReview }) => {
  const [review, setReview] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    comment: "",
    date: new Date().toISOString().split('T')[0]
  });

  if (!show) return null;

  const handleSubmit = () => {
    if (review.name && review.comment) {
      onAddReview({
        ...review,
        id: Date.now(),
        verified: false,
        helpful: 0,
        notHelpful: 0
      });
      setReview({
        name: "",
        email: "",
        rating: 5,
        title: "",
        comment: "",
        date: new Date().toISOString().split('T')[0]
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Add Review</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimesCircle size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={review.name}
                onChange={(e) => setReview({...review, name: e.target.value})}
                className="w-full border rounded-lg p-2"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={review.email}
                onChange={(e) => setReview({...review, email: e.target.value})}
                className="w-full border rounded-lg p-2"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReview({...review, rating: star})}
                    className="text-2xl"
                  >
                    {star <= review.rating ? '★' : '☆'}
                  </button>
                ))}
                <span className="ml-2 text-gray-600">{review.rating}/5</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
              <input
                type="text"
                value={review.title}
                onChange={(e) => setReview({...review, title: e.target.value})}
                className="w-full border rounded-lg p-2"
                placeholder="Great product!"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({...review, comment: e.target.value})}
                rows="4"
                className="w-full border rounded-lg p-2"
                placeholder="Share your experience with this product..."
              />
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Submit Review
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AddProductComplete() {
  
  // --- REFS ---
  const featureImgRef = useRef(null);
  const galleryRef = useRef(null);
  const videoRef = useRef(null);
  const descImageRef = useRef(null);
  const editorRef = useRef(null); // Ref for WYSIWYG editor
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("general");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeDescriptionTab, setActiveDescriptionTab] = useState(0);
  const [seoLevel, setSeoLevel] = useState("intermediate");
  
  // Description Tabs State (Now storing HTML directly)
  const [descriptionTabs, setDescriptionTabs] = useState([
    { 
      id: 1, 
      title: "Description", 
      content: `<h1>Naturali Anti-Frizz Shampoo</h1>
<h2>Why Choose Our Shampoo?</h2>
<p>Our anti-frizz shampoo is specially formulated to tame frizzy hair and restore natural shine. Perfect for all hair types.</p>
<ul>
<li>Reduces frizz by 80%</li>
<li>Adds natural shine</li>
<li>Strengthens hair from roots</li>
<li>Free from harsh chemicals</li>
</ul>
<h2>Key Ingredients</h2>
<p>• Aloe Vera Extract<br>• Coconut Oil<br>• Argan Oil<br>• Vitamin E<br>• Natural Proteins</p>`
    },
    { 
      id: 2, 
      title: "How to Use", 
      content: `<h2>Usage Instructions</h2>
<ol>
<li>Wet hair thoroughly with warm water</li>
<li>Apply a small amount to scalp</li>
<li>Massage gently for 2-3 minutes</li>
<li>Rinse completely</li>
<li>Follow with conditioner</li>
</ol>
<h2>Tips</h2>
<ul>
<li>Use 2-3 times weekly</li>
<li>Avoid hot water</li>
<li>Pat dry, don't rub</li>
</ul>`
    },
    { 
      id: 3, 
      title: "Reviews", 
      content: "Customer reviews will appear here"
    },
    { 
      id: 4, 
      title: "Ingredients", 
      content: `<h2>Full Ingredients List</h2>
<ul>
<li>Aloe Vera Extract</li>
<li>Coconut Oil</li>
<li>Argan Oil</li>
<li>Vitamin E</li>
<li>Natural Proteins</li>
<li>Keratin</li>
<li>Biotin</li>
<li>Jojoba Oil</li>
</ul>`
    }
  ]);
  
  const [formData, setFormData] = useState({
    // Header
    name: "Naturali Anti-Frizz Shampoo", 
    slug: "naturali-anti-frizz-shampoo-repair",
    
    // Descriptions
    shortDescription: "This anti-frizz shampoo tames frizzy hair and restores natural shine. Specially formulated with natural ingredients.",
    
    // Main Pricing
    basePrice: "599", 
    salePrice: "499",
    taxClass: "Standard (18% GST)",
    
    // Offers & Coupons
    selectedOffer: "",
    selectedCoupon: "",
    offers: [],
    coupons: [],
    
    // Inventory
    sku: "NAS-001", 
    stockStatus: "In Stock",
    stockQty: 100,
    manageStock: true,
    lowStockThreshold: 10,
    backorders: "no",
    lowStockAlert: true,
    
    // Shipping
    weight: "0.5", 
    weightUnit: "kg",
    length: "10", 
    width: "5", 
    height: "15",
    dimensionUnit: "cm",
    shippingClass: "Free Shipping",
    shippingDays: "3-5",
    
    // Variations
    hasVariations: true,
    variations: [
      { id: 1, size: "100ml", price: "299", stock: 50, sku: "NAS-001-S", unit: "ml" },
      { id: 2, size: "250ml", price: "499", stock: 30, sku: "NAS-001-M", unit: "ml" },
      { id: 3, size: "500ml", price: "899", stock: 20, sku: "NAS-001-L", unit: "ml" }
    ],

    // Media
    featureImage: null,
    bannerImage: null,
    sideImage: null,
    gallery: [],
    videos: [],
    
    // Image Settings
    featureImgAlt: "Naturali Anti-Frizz Shampoo - Best for frizzy hair",
    
    // SEO
    seoTitle: "Naturali Anti-Frizz Shampoo | Buy Online at Best Price",
    seoDesc: "Get Naturali Anti-Frizz Shampoo for smooth, shiny hair. Reduces frizz by 80%. Free shipping available. Shop now!",
    keywords: "anti-frizz shampoo, hair care, natural shampoo, frizzy hair solution",
    metaRobots: "index, follow",
    seoScore: 85,
    
    // Sidebar
    category: ["Hair Care"],
    tags: "shampoo, anti-frizz, hair care, natural, organic",
    ribbon: "Best Seller",
    badgeColor: "bg-red-500",
    brand: "Naturali",
    status: "active",
    
    // Reviews
    rating: 4.8,
    reviewCount: 124,
    enableReviews: true,
    reviews: [
      {
        id: 1,
        name: "Priya Sharma",
        rating: 5,
        title: "Best shampoo ever!",
        comment: "My hair has never been this smooth and shiny. Highly recommended!",
        date: "2024-01-15",
        verified: true,
        helpful: 24,
        notHelpful: 2
      },
      {
        id: 2,
        name: "Rahul Verma",
        rating: 4,
        title: "Good product",
        comment: "Works well but could have better fragrance.",
        date: "2024-01-10",
        verified: false,
        helpful: 12,
        notHelpful: 1
      }
    ],
    
    // Offer Settings
    offerType: "discount",
    offerValue: "20",
    showCountdown: true,
    stockForOffer: 50,
    
    // FAQ
    faqs: [
      { 
        id: 1, 
        question: "How to use this shampoo?", 
        answer: "Apply on wet hair, massage for 2-3 minutes, and rinse thoroughly. Use 2-3 times a week for best results." 
      },
      { 
        id: 2, 
        question: "Is it suitable for colored hair?", 
        answer: "Yes, it's completely safe for colored and chemically treated hair. It helps maintain color vibrancy." 
      }
    ]
  });

  // Keep editor content synced with state
  useEffect(() => {
    if (editorRef.current && descriptionTabs[activeDescriptionTab]) {
      // Only set innerHTML if it's drastically different to avoid cursor jumping
      if (editorRef.current.innerHTML !== descriptionTabs[activeDescriptionTab].content) {
        editorRef.current.innerHTML = descriptionTabs[activeDescriptionTab].content;
      }
    }
  }, [activeDescriptionTab]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Variations
  const handleVariationChange = (id, field, value) => {
    const updatedVariations = formData.variations.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    );
    setFormData({ ...formData, variations: updatedVariations });
  };

  const addVariation = () => {
    const newVar = { 
      id: Date.now(), 
      size: "", 
      price: "", 
      stock: 0, 
      sku: "",
      unit: "ml"
    };
    setFormData({ ...formData, variations: [...formData.variations, newVar] });
  };

  const removeVariation = (id) => {
    setFormData({ ...formData, variations: formData.variations.filter(v => v.id !== id) });
  };

  // Image Handlers
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: "",
      order: formData.gallery.length
    }));
    setFormData(prev => ({ 
      ...prev, 
      gallery: [...prev.gallery, ...newImages] 
    }));
  };

  const removeGalleryImage = (index) => {
    const updatedGallery = [...formData.gallery];
    updatedGallery.splice(index, 1);
    setFormData(prev => ({ ...prev, gallery: updatedGallery }));
  };

  // Video Handlers
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => ({
      url: URL.createObjectURL(file),
      title: file.name,
      type: file.type,
      thumbnail: null
    }));
    setFormData(prev => ({ 
      ...prev, 
      videos: [...prev.videos, ...newVideos] 
    }));
  };

  // --- WYSIWYG EDITOR FUNCTIONS ---
  
  // Apply formatting commands (Bold, Italic, etc.)
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    if(editorRef.current) {
        editorRef.current.focus();
        // Update state immediately
        const content = editorRef.current.innerHTML;
        updateDescriptionTab(descriptionTabs[activeDescriptionTab].id, 'content', content);
    }
  };

  // Handle Content Change in Editable Div
  const handleContentInput = (e) => {
    const content = e.currentTarget.innerHTML;
    const updatedTabs = descriptionTabs.map(tab => 
        tab.id === descriptionTabs[activeDescriptionTab].id ? { ...tab, content: content } : tab
    );
    // We avoid using setDescriptionTabs directly here inside the 'onInput' to avoid re-rendering loop issues
    // Instead we update a ref or use a debouncer in a real app, 
    // but for this example, we will update the state locally.
    setDescriptionTabs(updatedTabs);
  };

  // Handle Image Upload for Visual Editor
const handleEditorFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  const fileType = file.type;

  reader.onload = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    let html = "";

    if (fileType.startsWith("image/")) {
      // IMAGE HTML
      html = `
        <img 
          src="${reader.result}" 
          class="editor-img"
          style="
            height:200px;
            width:auto;
            max-width:100%;
            border-radius:8px;
            margin:10px auto;
            display:block;
            cursor: ns-resize;
          "
        />
      `;
    } else if (fileType.startsWith("video/")) {
      // VIDEO HTML
      html = `
        <video 
          src="${reader.result}" 
          controls
          style="
            max-width:100%;
            height:auto;
            border-radius:8px;
            margin:10px auto;
            display:block;
          "
        ></video>
      `;
    } else {
      alert("Only image or video files allowed!");
      return;
    }

    document.execCommand("insertHTML", false, html);
  };

  reader.readAsDataURL(file);
};
useEffect(() => {
  let img = null;
  let startY = 0;
  let startHeight = 0;
  let ratio = 1;

  const mouseDown = (e) => {
    if (e.target.tagName === "IMG") {
      img = e.target;
      startY = e.clientY;
      startHeight = img.offsetHeight;
      ratio = img.offsetWidth / img.offsetHeight;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }
  };

  const mouseMove = (e) => {
    if (!img) return;

    const newHeight = startHeight + (e.clientY - startY);
    if (newHeight > 50) {
      img.style.height = newHeight + "px";
      img.style.width = newHeight * ratio + "px"; // width auto
      img.style.marginLeft = "auto";
      img.style.marginRight = "auto";
    }
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
    img = null;
  };

  editorRef.current?.addEventListener("mousedown", mouseDown);
}, []);


  // Add Description Tab
  const addDescriptionTab = () => {
    const newTab = { 
      id: Date.now(), 
      title: "New Tab", 
      content: "<p>Start writing here...</p>"
    };
    setDescriptionTabs(prev => [...prev, newTab]);
    setActiveDescriptionTab(descriptionTabs.length);
  };

  const updateDescriptionTab = (id, field, value) => {
    const updatedTabs = descriptionTabs.map(tab => 
      tab.id === id ? { ...tab, [field]: value } : tab
    );
    setDescriptionTabs(updatedTabs);
  };

  const removeDescriptionTab = (id) => {
    if (descriptionTabs.length <= 1) return;
    
    const updatedTabs = descriptionTabs.filter(tab => tab.id !== id);
    setDescriptionTabs(updatedTabs);
    
    if (activeDescriptionTab >= updatedTabs.length) {
      setActiveDescriptionTab(updatedTabs.length - 1);
    }
  };

  // Add FAQ
  const addFAQ = () => {
    const newFAQ = { 
      id: Date.now(), 
      question: "", 
      answer: "" 
    };
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFAQ]
    }));
  };

  const updateFAQ = (id, field, value) => {
    const updatedFaqs = formData.faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  const removeFAQ = (id) => {
    const updatedFaqs = formData.faqs.filter(faq => faq.id !== id);
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  // Add Review
  const addReview = (review) => {
    setFormData(prev => ({
      ...prev,
      reviews: [...prev.reviews, review],
      reviewCount: prev.reviewCount + 1,
      rating: parseFloat(((prev.rating * prev.reviewCount + review.rating) / (prev.reviewCount + 1)).toFixed(1))
    }));
  };

  // Add Offer
  const addOffer = () => {
    if (formData.selectedOffer) {
      const selectedOffer = AVAILABLE_OFFERS.find(o => o.id == formData.selectedOffer);
      if (selectedOffer && !formData.offers.some(o => o.id === selectedOffer.id)) {
        setFormData(prev => ({
          ...prev,
          offers: [...prev.offers, selectedOffer]
        }));
      }
    }
  };

  const removeOffer = (id) => {
    setFormData(prev => ({
      ...prev,
      offers: prev.offers.filter(offer => offer.id !== id)
    }));
  };

  // Add Coupon
  const addCoupon = () => {
    if (formData.selectedCoupon) {
      const selectedCoupon = AVAILABLE_COUPONS.find(c => c.id == formData.selectedCoupon);
      if (selectedCoupon && !formData.coupons.some(c => c.id === selectedCoupon.id)) {
        setFormData(prev => ({
          ...prev,
          coupons: [...prev.coupons, selectedCoupon]
        }));
      }
    }
  };

  const removeCoupon = (id) => {
    setFormData(prev => ({
      ...prev,
      coupons: prev.coupons.filter(coupon => coupon.id !== id)
    }));
  };

  // Calculate Discount %
  const discount = formData.basePrice && formData.salePrice ? 
    Math.round(((parseFloat(formData.basePrice) - parseFloat(formData.salePrice)) / parseFloat(formData.basePrice)) * 100) : 0;

  // Render Description Tab Content
  const renderDescriptionTabContent = () => {
    const activeTab = descriptionTabs[activeDescriptionTab];
    
    // If it's the specific "Reviews" tab which is read-only or special component
    if (activeTab.title === "Reviews") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-yellow-400 text-xl">
                      {star <= Math.floor(formData.rating) ? '★' : star === Math.ceil(formData.rating) && formData.rating % 1 !== 0 ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 font-bold text-lg">{formData.rating}/5</span>
                <span className="text-gray-500">({formData.reviewCount} reviews)</span>
              </div>
            </div>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <FaPlusCircle /> Add Review
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.reviews.map(review => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-800 text-lg">{review.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}>
                            {star <= review.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <h4 className="font-bold text-gray-700 text-lg mb-2">{review.title}</h4>
                <p className="text-gray-600 mb-3">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // VISUAL EDITOR (WYSIWYG)
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={activeTab.title}
              onChange={(e) => updateDescriptionTab(activeTab.id, 'title', e.target.value)}
              className="text-xl font-bold border-none outline-none bg-transparent"
              placeholder="Tab Title"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => removeDescriptionTab(activeTab.id)}
              className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
              disabled={descriptionTabs.length <= 1}
            >
              <FaTrash /> Remove Tab
            </button>
          </div>
        </div>
        
        {/* Editor Toolbar */}
        <div className="bg-gray-50 border rounded-t-lg p-2 flex flex-wrap gap-1 sticky top-0 z-10 shadow-sm">
           {/* Text Style */}
           <select 
             onChange={(e) => execCmd('formatBlock', e.target.value)} 
             className="h-9 px-2 text-sm border rounded bg-white"
             defaultValue=""
           >
             <option value="P">Paragraph</option>
             <option value="H1">Heading 1</option>
             <option value="H2">Heading 2</option>
             <option value="H3">Heading 3</option>
             <option value="BLOCKQUOTE">Quote</option>
           </select>

           <div className="w-px h-9 bg-gray-300 mx-1"></div>

           {/* Basic Formatting */}
           <button onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="Bold">
             <FaBold />
           </button>
           <button onClick={() => execCmd('italic')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="Italic">
             <FaItalic />
           </button>
           <button onClick={() => execCmd('underline')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="Underline">
             <FaUnderline />
           </button>
           
           <div className="w-px h-9 bg-gray-300 mx-1"></div>

           {/* Lists & Align */}
           <button onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="Bullet List">
             <FaList />
           </button>
           <button onClick={() => execCmd('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="Numbered List">
             <FaListOl />
           </button>
           <button onClick={() => execCmd('justifyLeft')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="Align Left">
             <FaAlignLeft />
           </button>
           <button onClick={() => execCmd('justifyCenter')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="Align Center">
             <FaAlignCenter />
           </button>

           <div className="w-px h-9 bg-gray-300 mx-1"></div>

           <button 
             onClick={() => descImageRef.current.click()} 
             className="p-2 hover:bg-blue-100 text-blue-600 rounded flex items-center gap-1" 
             title="Insert Image"
           >
             <FaImage /> <span className="text-xs font-bold hidden sm:inline">Image</span>
           </button>
           <button 
             onClick={() => {
                const url = prompt("Enter link URL:");
                if(url) execCmd('createLink', url);
             }} 
             className="p-2 hover:bg-gray-200 rounded text-gray-700" 
             title="Link"
           >
             <FaLink />
           </button>
           
           <div className="w-px h-9 bg-gray-300 mx-1"></div>
           
           <button onClick={() => execCmd('undo')} className="p-2 hover:bg-gray-200 rounded text-gray-700"><FaUndo/></button>
           <button onClick={() => execCmd('redo')} className="p-2 hover:bg-gray-200 rounded text-gray-700"><FaRedo/></button>
        </div>
        
        {/* WYSIWYG Editable Area */}
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleContentInput}
          className="w-full border-x border-b rounded-b-lg p-6 min-h-[400px] outline-none prose max-w-none focus:ring-2 focus:ring-blue-100 bg-white overflow-y-auto"
          style={{ 
            height: 'auto', 
            minHeight: '400px',
            backgroundColor: 'white'
          }}
          // Initial content is handled by useEffect to prevent cursor jumping on every keystroke
        ></div>
        
        <p className="text-xs text-gray-400 mt-2">
            * This is a live editor. Images and styling appear exactly as they will on the website.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-4 font-sans text-gray-700 pb-20">
      
      {/* Review Modal */}
      <ReviewModal 
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onAddReview={addReview}
      />
      
      {/* Hidden inputs for editor uploads */}
     <input 
  type="file" 
  ref={descImageRef} 
  accept="image/*,video/*"   // ✅ image + video dono
  hidden 
  onChange={handleEditorFileUpload}
/>

      {/* --- TOP HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 max-w-7xl mx-auto gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-xs text-gray-500">Create a new product with complete details</p>
        </div>
        <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 md:px-4 py-2 rounded font-bold flex items-center justify-center gap-2 transition text-sm">
            <FaTimesCircle /> Cancel
          </button>
          <button 
            onClick={() => {
              // Prepare data for backend
              const productData = {
                ...formData,
                descriptionTabs,
                // SEO data
                seo: {
                  title: formData.seoTitle,
                  description: formData.seoDesc,
                  keywords: formData.keywords.split(',').map(k => k.trim()),
                  metaRobots: formData.metaRobots,
                  score: formData.seoScore
                }
              };
              console.log('Product Data for Backend:', productData);
              alert('Product saved! Check console for data.');
            }}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded shadow-lg font-bold flex items-center justify-center gap-2 transition text-sm md:text-base"
          >
            <FaSave /> Save Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
        
        {/* ================= LEFT COLUMN (MAIN EDITOR) [75%] ================= */}
        <div className="lg:col-span-3 space-y-4 md:space-y-6">
          
          {/* 1. TITLE & SLUG */}
          <div className="bg-white p-4 md:p-5 rounded shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <MdOutlineTitle className="text-blue-500" />
              <span className="text-sm font-bold text-gray-600">Product Title</span>
            </div>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Product Name (e.g. Naturali Anti-Frizz Shampoo)" 
              className="w-full text-lg md:text-xl font-bold border border-gray-300 rounded p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            
            {/* Permalink */}
            <div className="mt-4 flex flex-col md:flex-row md:items-center text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              <span className="font-bold mr-1">Permalink:</span>
              <div className="flex items-center w-full">
                <span className="text-blue-600 text-sm">https://mystore.com/product/</span>
                <input 
                  type="text" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleChange}
                  className="bg-transparent border-b border-gray-400 text-gray-800 focus:border-blue-500 outline-none px-1 mx-1 flex-1 font-mono text-xs md:text-sm"
                />
              </div>
            </div>
          </div>

          {/* 2. LIVE DESCRIPTION EDITOR (REPLACED MARKDOWN) */}
          <div className="bg-white rounded shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between px-3 md:px-4 pt-3">
                <h3 className="font-bold text-gray-700">Product Details</h3>
                <button 
                  onClick={addDescriptionTab}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
                >
                  <FaPlusCircle size={10} /> Add Tab
                </button>
              </div>
              
              <div className="flex border-b border-gray-200 px-3 md:px-4 mt-3 overflow-x-auto">
                {descriptionTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDescriptionTab(index)}
                    className={`px-3 md:px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${index === activeDescriptionTab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab.title}
                    {tab.title !== "Reviews" && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDescriptionTab(tab.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                        disabled={descriptionTabs.length <= 1}
                      >
                        <FaTimesCircle size={12} />
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-6">
              {renderDescriptionTabContent()}
            </div>
          </div>

          {/* 3. PRODUCT DATA TABS */}
          <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-48 bg-gray-100 border-b md:border-r border-gray-200 pt-4 pb-2 md:pb-10 px-2 space-y-1 flex md:flex-col overflow-x-auto">
                {[
                  {id: 'general', icon: <AiOutlineShopping/>, label: 'General'},
                  {id: 'inventory', icon: <FaBoxOpen/>, label: 'Inventory'},
                  {id: 'shipping', icon: <FaTruck/>, label: 'Shipping'},
                  {id: 'variations', icon: <FaRulerCombined/>, label: 'Variations'},
                  {id: 'offers', icon: <MdLocalOffer/>, label: 'Offers'},
                  {id: 'faq', icon: <MdDescription/>, label: 'FAQ'},
                  {id: 'seo', icon: <FaGoogle/>, label: 'SEO'}
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left px-3 py-2 text-xs font-bold flex items-center gap-2 rounded transition whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT AREA */}
              <div className="flex-1 p-4 md:p-6 min-h-[400px] overflow-y-auto">
                 
                {/* -- GENERAL TAB -- */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Regular Price (₹)</label>
                        <input 
                          type="number" 
                          name="basePrice" 
                          value={formData.basePrice} 
                          onChange={handleChange} 
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Sale Price (₹)</label>
                        <input 
                          type="number" 
                          name="salePrice" 
                          value={formData.salePrice} 
                          onChange={handleChange} 
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                    
                    {discount > 0 && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div>
                            <span className="text-sm font-bold text-blue-800">Discount:</span>
                            <span className="text-sm text-gray-600 ml-2">₹{formData.basePrice} → ₹{formData.salePrice}</span>
                          </div>
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold inline-block w-fit">
                            {discount}% OFF
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* -- INVENTORY TAB -- */}
                {activeTab === 'inventory' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">SKU</label>
                        <input 
                          name="sku" 
                          value={formData.sku} 
                          onChange={handleChange} 
                          className="w-full border rounded p-2" 
                          placeholder="e.g. PROD-001"
                        />
                      </div>
                      <div className="flex items-center">
                        <div>
                          <input 
                            type="checkbox" 
                            id="manageStock" 
                            checked={formData.manageStock} 
                            onChange={(e) => setFormData(prev => ({...prev, manageStock: e.target.checked}))}
                            className="mr-2"
                          />
                          <label htmlFor="manageStock" className="text-sm font-bold">Manage Stock</label>
                        </div>
                      </div>
                    </div>
                    
                    {formData.manageStock && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Stock Quantity</label>
                            <input 
                              type="number" 
                              name="stockQty" 
                              value={formData.stockQty} 
                              onChange={handleChange} 
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Low Stock Threshold</label>
                            <input 
                              type="number" 
                              name="lowStockThreshold" 
                              value={formData.lowStockThreshold} 
                              onChange={handleChange} 
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Stock Status</label>
                            <select 
                              name="stockStatus" 
                              value={formData.stockStatus} 
                              onChange={handleChange} 
                              className="w-full border rounded p-2 text-sm"
                            >
                              <option>In Stock</option>
                              <option>Out of Stock</option>
                              <option>On Backorder</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* -- SHIPPING TAB -- */}
                {activeTab === 'shipping' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Weight</label>
                        <div className="flex gap-2">
                          <input 
                            name="weight" 
                            value={formData.weight} 
                            onChange={handleChange} 
                            className="flex-1 border rounded p-2" 
                            placeholder="0.5"
                          />
                          <select 
                            name="weightUnit" 
                            value={formData.weightUnit} 
                            onChange={handleChange} 
                            className="w-24 border rounded p-2 text-sm"
                          >
                            {UNIT_OPTIONS.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Shipping Class</label>
                        <select 
                          name="shippingClass" 
                          value={formData.shippingClass} 
                          onChange={handleChange} 
                          className="w-full border rounded p-2 text-sm"
                        >
                          <option>Standard Shipping</option>
                          <option>Express Shipping</option>
                          <option>Free Shipping</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Dimensions (L × W × H)</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <input 
                            placeholder="Length" 
                            name="length" 
                            value={formData.length} 
                            onChange={handleChange} 
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <div>
                          <input 
                            placeholder="Width" 
                            name="width" 
                            value={formData.width} 
                            onChange={handleChange} 
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <div>
                          <input 
                            placeholder="Height" 
                            name="height" 
                            value={formData.height} 
                            onChange={handleChange} 
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <select 
                          name="dimensionUnit" 
                          value={formData.dimensionUnit} 
                          onChange={handleChange} 
                          className="border rounded p-2 text-sm"
                        >
                          <option>cm</option>
                          <option>m</option>
                          <option>inch</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* -- VARIATIONS TAB -- */}
                {activeTab === 'variations' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold">Product Variations</h3>
                        <p className="text-xs text-gray-500">Add different sizes and prices</p>
                      </div>
                      <button 
                        onClick={addVariation} 
                        className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold flex items-center gap-2"
                      >
                        <FaPlusCircle/> Add Variation
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border p-2 text-left text-xs font-bold uppercase text-gray-500">Size/Volume</th>
                            <th className="border p-2 text-left text-xs font-bold uppercase text-gray-500">Unit</th>
                            <th className="border p-2 text-left text-xs font-bold uppercase text-gray-500">Price (₹)</th>
                            <th className="border p-2 text-left text-xs font-bold uppercase text-gray-500">Stock</th>
                            <th className="border p-2 text-left text-xs font-bold uppercase text-gray-500">SKU</th>
                            <th className="border p-2 text-left text-xs font-bold uppercase text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.variations.map((v) => (
                            <tr key={v.id} className="hover:bg-gray-50">
                              <td className="border p-2">
                                <input 
                                  value={v.size} 
                                  onChange={(e)=>handleVariationChange(v.id, 'size', e.target.value)} 
                                  placeholder="e.g. 100ml" 
                                  className="w-full border rounded p-1 text-sm"
                                />
                              </td>
                              <td className="border p-2">
                                <select 
                                  value={v.unit} 
                                  onChange={(e)=>handleVariationChange(v.id, 'unit', e.target.value)} 
                                  className="w-full border rounded p-1 text-sm"
                                >
                                  {UNIT_OPTIONS.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="border p-2">
                                <input 
                                  value={v.price} 
                                  onChange={(e)=>handleVariationChange(v.id, 'price', e.target.value)} 
                                  placeholder="499" 
                                  className="w-full border rounded p-1 text-sm"
                                />
                              </td>
                              <td className="border p-2">
                                <input 
                                  type="number" 
                                  value={v.stock} 
                                  onChange={(e)=>handleVariationChange(v.id, 'stock', e.target.value)} 
                                  className="w-full border rounded p-1 text-sm"
                                />
                              </td>
                              <td className="border p-2">
                                <input 
                                  value={v.sku} 
                                  onChange={(e)=>handleVariationChange(v.id, 'sku', e.target.value)} 
                                  className="w-full border rounded p-1 text-sm"
                                />
                              </td>
                              <td className="border p-2">
                                <button 
                                  onClick={() => removeVariation(v.id)} 
                                  className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* -- OFFERS TAB -- */}
                {activeTab === 'offers' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Offers</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Select Offer</label>
                          <select 
                            value={formData.selectedOffer} 
                            onChange={(e) => setFormData(prev => ({...prev, selectedOffer: e.target.value}))}
                            className="w-full border rounded p-2"
                          >
                            <option value="">-- Select an Offer --</option>
                            {AVAILABLE_OFFERS.map(offer => (
                              <option key={offer.id} value={offer.id}>{offer.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button 
                            onClick={addOffer}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold flex items-center justify-center gap-2"
                          >
                            <FaPlusCircle /> Add Offer
                          </button>
                        </div>
                      </div>
                      
                      {formData.offers.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-700">Active Offers:</h4>
                          {formData.offers.map(offer => (
                            <div key={offer.id} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded">
                              <div>
                                <div className="font-bold">{offer.label}</div>
                                <div className="text-xs text-gray-600">
                                  {offer.type === 'percentage' ? `${offer.value}% Off` : 
                                   offer.type === 'flat' ? `₹${offer.value} Off` : 
                                   'Buy 1 Get 1 Free'} | Min: ₹{offer.minPurchase}
                                </div>
                              </div>
                              <button 
                                onClick={() => removeOffer(offer.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTimesCircle />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Coupons</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Select Coupon</label>
                          <select 
                            value={formData.selectedCoupon} 
                            onChange={(e) => setFormData(prev => ({...prev, selectedCoupon: e.target.value}))}
                            className="w-full border rounded p-2"
                          >
                            <option value="">-- Select a Coupon --</option>
                            {AVAILABLE_COUPONS.map(coupon => (
                              <option key={coupon.id} value={coupon.id}>{coupon.label} ({coupon.code})</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button 
                            onClick={addCoupon}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold flex items-center justify-center gap-2"
                          >
                            <FaPlusCircle /> Add Coupon
                          </button>
                        </div>
                      </div>
                      
                      {formData.coupons.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-700">Active Coupons:</h4>
                          {formData.coupons.map(coupon => (
                            <div key={coupon.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-bold flex items-center gap-2">
                                    <MdLocalOffer /> {coupon.code}
                                    <span className="text-sm font-normal text-gray-600">({coupon.label})</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => removeCoupon(coupon.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTimesCircle />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -- FAQ TAB -- */}
                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-800">Frequently Asked Questions</h3>
                      <button 
                        onClick={addFAQ}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold flex items-center gap-2"
                      >
                        <FaPlusCircle /> Add FAQ
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.faqs.map(faq => (
                        <div key={faq.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b">
                            <input 
                              type="text" 
                              value={faq.question} 
                              onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                              placeholder="Enter question..."
                              className="w-full font-bold text-gray-700 bg-transparent border-none outline-none text-lg"
                            />
                          </div>
                          <div className="p-4">
                            <textarea 
                              value={faq.answer} 
                              onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                              placeholder="Enter answer..."
                              rows="3"
                              className="w-full text-gray-600 border rounded p-3 outline-none resize-y"
                            />
                          </div>
                          <div className="bg-gray-50 p-3 border-t flex justify-end">
                            <button 
                              onClick={() => removeFAQ(faq.id)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                            >
                              <FaTrash /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* -- SEO TAB -- */}
                {activeTab === 'seo' && (
                  <div className="space-y-8">
                    <div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                        <h3 className="text-lg font-bold text-gray-800">SEO Settings</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">SEO Level:</span>
                          <select 
                            value={seoLevel} 
                            onChange={(e) => setSeoLevel(e.target.value)}
                            className="border rounded p-1 text-sm"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-gray-800">SEO Score: {formData.seoScore}/100</h4>
                          </div>
                          <div className="text-3xl font-bold text-blue-600">{formData.seoScore}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                            style={{ width: `${formData.seoScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">SEO Title</label>
                        <input 
                          name="seoTitle" 
                          value={formData.seoTitle} 
                          onChange={handleChange} 
                          maxLength="60"
                          className="w-full border rounded p-2 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Meta Description</label>
                        <textarea 
                          name="seoDesc" 
                          value={formData.seoDesc} 
                          onChange={handleChange} 
                          maxLength="160"
                          rows="3"
                          className="w-full border rounded p-2 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Focus Keywords</label>
                        <input 
                          name="keywords" 
                          value={formData.keywords} 
                          onChange={handleChange} 
                          placeholder="comma, separated, keywords" 
                          className="w-full border rounded p-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. PRODUCT SHORT DESCRIPTION */}
          <div className="bg-white p-4 md:p-5 rounded shadow-sm border border-gray-200">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
              <MdDescription /> Product Short Description
            </label>
            <textarea 
              name="shortDescription" 
              rows="4" 
              className="w-full border rounded p-3 text-sm focus:border-blue-500 outline-none"
              placeholder="Brief summary for product cards..."
              value={formData.shortDescription}
              onChange={handleChange}
            ></textarea>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (SIDEBAR) [25%] ================= */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          
          {/* 1. PUBLISH STATUS */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Publish</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Status:</span>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>
              <div className="flex justify-between">
                <span>Visibility:</span>
                <span className="font-bold">Public</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button 
                onClick={() => alert("Product Saved!")}
                className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FaCheck /> Save Product
              </button>
            </div>
          </div>

          {/* 2. PRODUCT IMAGE */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase flex items-center gap-2">
              <FaImage /> Featured Image
            </h3>
            <div 
              onClick={() => featureImgRef.current.click()}
              className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative"
            >
              {formData.featureImage ? (
                <img src={formData.featureImage} className="w-full h-full object-cover" alt="Featured"/>
              ) : (
                <div className="text-center p-4">
                  <FaCloudUploadAlt className="mx-auto text-gray-400 text-3xl mb-2"/>
                  <span className="text-xs text-blue-600 font-bold">Upload Image</span>
                </div>
              )}
            </div>
            <input type="file" ref={featureImgRef} hidden onChange={(e) => handleImageUpload(e, 'featureImage')}/>
          </div>

          {/* 3. PRODUCT GALLERY */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Product Gallery</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {formData.gallery.map((img, index) => (
                <div key={index} className="relative aspect-square border rounded overflow-hidden group">
                  <img src={img.url} className="w-full h-full object-cover"/>
                  <button 
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <FaTimesCircle size={12}/>
                  </button>
                </div>
              ))}
              {formData.gallery.length < 6 && (
                <div 
                  onClick={() => galleryRef.current.click()} 
                  className="aspect-square border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-400"
                >
                  <FaPlusCircle className="text-gray-400 hover:text-blue-500 transition"/>
                </div>
              )}
            </div>
            <button 
              onClick={() => galleryRef.current.click()} 
              className="w-full text-xs text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 py-2 border border-dashed border-gray-300 rounded hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <FaPlusCircle/> Add Gallery Images
            </button>
            <input type="file" multiple ref={galleryRef} hidden onChange={handleGalleryUpload}/>
          </div>

          {/* 4. ORGANIZATION */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Organization</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1">Product Category</label>
              <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 space-y-1">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded">
                    <input 
                      type="checkbox" 
                      checked={formData.category.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            category: [...prev.category, cat]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            category: prev.category.filter(c => c !== cat)
                          }));
                        }
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1">Product Tags</label>
              <input 
                name="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                placeholder="Separate with commas" 
                className="w-full border rounded p-2 text-sm"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1">Brand</label>
              <select 
                value={formData.brand} 
                onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
                className="w-full border rounded p-2 text-sm"
              >
                {BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Ribbon / Badge</label>
              <div className="flex gap-2">
                <select 
                  value={formData.ribbon} 
                  onChange={(e) => setFormData(prev => ({...prev, ribbon: e.target.value}))}
                  className="flex-1 border rounded p-2 text-sm"
                >
                  <option value="">Select Badge</option>
                  {RIBBON_OPTIONS.map(ribbon => (
                    <option key={ribbon} value={ribbon}>{ribbon}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}