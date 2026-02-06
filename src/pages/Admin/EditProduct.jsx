import React, { useState, useRef, useEffect } from "react";
import { 
  FaCloudUploadAlt, FaVideo, FaCheck, FaTrash, FaImage, 
  FaTruck, FaRulerCombined, FaBoxOpen, FaSave, FaGoogle, 
  FaPlusCircle, FaTimesCircle, FaHeading, FaList, FaListOl, 
  FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, 
  FaAlignRight, FaLink, FaQuoteLeft, FaUndo, FaRedo,
  FaSpinner, FaExclamationCircle, FaArrowLeft, FaEye,
  FaStar, FaRegStar
} from "react-icons/fa";
import { 
  MdOutlineTitle, MdDescription, MdLocalOffer, 
  MdFormatColorText, MdReviews
} from "react-icons/md";
import { AiOutlineShopping } from "react-icons/ai";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/API_URL.js";
import apiService from "../../api/produet/ApiService.js";

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
                    {star <= review.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
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

// Reviews Component for Description Tab
const ReviewsComponent = ({ reviews, rating, reviewCount, onAddReview }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className="text-yellow-400 text-xl">
                  {star <= Math.floor(rating) ? <FaStar /> : star === Math.ceil(rating) && rating % 1 !== 0 ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <span className="text-gray-600 font-bold text-lg">{rating.toFixed(1)}/5</span>
            <span className="text-gray-500">({reviewCount} reviews)</span>
          </div>
        </div>
        <button 
          onClick={onAddReview}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <FaPlusCircle /> Add Review
        </button>
      </div>
      
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-gray-800 text-lg">{review.reviewer_name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}>
                          {star <= review.rating ? <FaStar /> : <FaRegStar />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.review_date}</span>
              </div>
              <h4 className="font-bold text-gray-700 text-lg mb-2">{review.review_title}</h4>
              <p className="text-gray-600 mb-3">{review.review_text}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // --- REFS ---
  const featureImgRef = useRef(null);
  const galleryRef = useRef(null);
  const descImageRef = useRef(null);
  const editorRef = useRef(null);
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("general");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeDescriptionTab, setActiveDescriptionTab] = useState(0);
  const [seoLevel, setSeoLevel] = useState("intermediate");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Description Tabs State
  const [descriptionTabs, setDescriptionTabs] = useState([
    { 
      id: Date.now(), 
      title: "Description", 
      content: `<h1>Product Description</h1>
<p>Start describing your product here...</p>`
    }
  ]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    basePrice: "",
    salePrice: "",
    sku: "",
    stockStatus: "In Stock",
    stockQty: 0,
    manageStock: true,
    lowStockThreshold: 10,
    weight: "0",
    weightUnit: "kg",
    length: "0",
    width: "0",
    height: "0",
    dimensionUnit: "cm",
    shippingClass: "",
    shippingDays: "",
    featureImage: "",
    bannerImage: "",
    sideImage: "",
    gallery: [],
    videos: [],
    featureImgAlt: "",
    seoTitle: "",
    seoDescription: "",
    keywords: "",
    metaRobots: "index, follow",
    seoScore: 0,
    category: [],
    tags: "",
    ribbon: "",
    badgeColor: "",
    brand: "",
    status: "draft",
    rating: 0,
    reviewCount: 0,
    enableReviews: true,
    reviews: [],
    offerType: "",
    offerValue: "",
    showCountdown: false,
    stockForOffer: 0,
    variations: [],
    faqs: []
  });

  // Fetch categories and brands on component mount
  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (isEditMode) {
      loadProductData(id);
    }
  }, [id]);

  // Keep editor content synced with state
  useEffect(() => {
    if (editorRef.current && descriptionTabs[activeDescriptionTab]) {
      if (editorRef.current.innerHTML !== descriptionTabs[activeDescriptionTab].content) {
        editorRef.current.innerHTML = descriptionTabs[activeDescriptionTab].content;
      }
    }
  }, [activeDescriptionTab, descriptionTabs]);

  // API Functions
  const fetchCategoriesAndBrands = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getBrands()
      ]);
      
      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }
      
      if (brandsRes.success) {
        setBrands(brandsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load categories and brands' });
    }
  };

  const loadProductData = async (productId) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await apiService.getProduct(productId);
      
      if (result.success) {
        const product = result.data;
        
        // Map API data to form state
        const mappedData = {
          name: product.name || "",
          slug: product.slug || "",
          shortDescription: product.short_description || "",
          basePrice: product.base_price || "0",
          salePrice: product.sale_price || "0",
          sku: product.sku || "",
          stockStatus: product.stock_status || "In Stock",
          stockQty: product.stock_qty || 0,
          manageStock: product.manage_stock === 1,
          lowStockThreshold: product.low_stock_threshold || 10,
          weight: product.weight?.toString() || "0",
          weightUnit: product.weight_unit || "kg",
          length: product.length?.toString() || "0",
          width: product.width?.toString() || "0",
          height: product.height?.toString() || "0",
          dimensionUnit: product.dimension_unit || "cm",
          shippingClass: product.shipping_class || "",
          shippingDays: product.shipping_days || "",
          featureImage: product.feature_image || "",
          bannerImage: product.banner_image || "",
          sideImage: product.side_image || "",
          featureImgAlt: product.feature_img_alt || "",
          seoTitle: product.seo_title || "",
          seoDescription: product.seo_description || "",
          keywords: product.keywords || "",
          metaRobots: product.meta_robots || "index, follow",
          seoScore: product.seo_score || 0,
          category: product.category || [],
          tags: product.tags || "",
          ribbon: product.ribbon || "",
          badgeColor: product.badge_color || "",
          brand: product.brand || "",
          status: product.status || "draft",
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          enableReviews: product.enable_reviews === 1,
          variations: product.variations || [],
          gallery: product.gallery || [],
          faqs: product.faqs || [],
          reviews: product.reviews || [],
          offerType: product.offer_type || "",
          offerValue: product.offer_value || "",
          showCountdown: product.show_countdown === 1,
          stockForOffer: product.stock_for_offer || 0
        };
        
        setFormData(mappedData);

        // Set description tabs - add Reviews tab if there are reviews
        const tabs = [];
        if (product.description_tabs && product.description_tabs.length > 0) {
          tabs.push(...product.description_tabs.map(tab => ({
            id: tab.id,
            title: tab.tab_title,
            content: tab.tab_content
          })));
        } else {
          tabs.push({
            id: Date.now(),
            title: "Description",
            content: product.description || `<h1>${product.name}</h1><p>Product description...</p>`
          });
        }
        
        // Add Reviews tab if there are reviews or reviews are enabled
        if (product.reviews.length > 0 || product.enable_reviews) {
          tabs.push({
            id: 'reviews-tab-' + productId,
            title: "Reviews",
            isReviewTab: true
          });
        }
        
        setDescriptionTabs(tabs);
        
        setMessage({ type: 'success', text: 'Product loaded successfully' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to load product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading product: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file, field) => {
    setUploading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (id) {
        formData.append('product_id', id);
      }

      const response = await axios.post(`${API_URL}/admin/products/products.php?action=upload_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const fileUrl = response.data.data.file_url;
        setMessage({ type: 'success', text: 'File uploaded successfully' });
        return fileUrl;
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Upload failed' });
        return null;
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload error: ' + error.message });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle gallery upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const uploadPromises = files.map(file => handleFileUpload(file, 'gallery'));
      const results = await Promise.all(uploadPromises);
      
      const newImages = results
        .filter(url => url !== null)
        .map((url, index) => ({
          id: Date.now() + index,
          url: url,
          alt: "",
          order: formData.gallery.length + index
        }));
      
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages]
      }));
      
      setMessage({ type: 'success', text: `${newImages.length} images uploaded successfully` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading gallery images: ' + error.message });
    } finally {
      setUploading(false);
    }
  };

  // Save product
  const handleSaveProduct = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Filter out the review tab from description tabs
      const filteredDescriptionTabs = descriptionTabs.filter(tab => !tab.isReviewTab);
      
      // Prepare data for API
      const productData = {
        ...(isEditMode && { id: parseInt(id) }),
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: formData.shortDescription,
        basePrice: parseFloat(formData.basePrice) || 0,
        salePrice: parseFloat(formData.salePrice) || 0,
        sku: formData.sku,
        stockStatus: formData.stockStatus,
        stockQty: parseInt(formData.stockQty) || 0,
        manageStock: formData.manageStock ? 1 : 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        weight: parseFloat(formData.weight) || 0,
        weightUnit: formData.weightUnit,
        length: parseFloat(formData.length) || 0,
        width: parseFloat(formData.width) || 0,
        height: parseFloat(formData.height) || 0,
        dimensionUnit: formData.dimensionUnit,
        shippingClass: formData.shippingClass,
        shippingDays: formData.shippingDays,
        featureImage: formData.featureImage,
        bannerImage: formData.bannerImage,
        sideImage: formData.sideImage,
        featureImgAlt: formData.featureImgAlt,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        keywords: formData.keywords,
        metaRobots: formData.metaRobots,
        seoScore: parseInt(formData.seoScore) || 0,
        category: formData.category,
        tags: formData.tags,
        ribbon: formData.ribbon,
        badgeColor: formData.badgeColor,
        brand: formData.brand,
        status: formData.status,
        rating: parseFloat(formData.rating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
        enableReviews: formData.enableReviews ? 1 : 0,
        variations: formData.variations.map(v => ({
          size: v.size || "",
          unit: v.unit || "ml",
          price: parseFloat(v.price) || 0,
          stock: parseInt(v.stock) || 0,
          sku: v.sku || ""
        })),
        descriptionTabs: filteredDescriptionTabs.map(tab => ({
          title: tab.title,
          content: tab.content
        })),
        faqs: formData.faqs.map(faq => ({
          question: faq.question || "",
          answer: faq.answer || ""
        })),
        gallery: formData.gallery.map(img => ({
          url: img.url,
          alt: img.alt || ""
        }))
      };

      const result = await apiService.saveProduct(productData);
      
      if (result.success) {
        const savedProductId = result.data.product_id || id;
        
        setMessage({ 
          type: 'success', 
          text: `Product ${isEditMode ? 'updated' : 'created'} successfully!` 
        });
        
        // If new product, navigate to edit page
        if (!isEditMode) {
          setTimeout(() => {
            navigate(`/admin/products/edit/${savedProductId}`);
          }, 1500);
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Save failed' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error saving product: ' + (error.response?.data?.message || error.message) 
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!isEditMode || !window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const result = await apiService.deleteProduct(id);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Product deleted successfully' });
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Delete failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting product: ' + error.message });
    }
  };

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
    setFormData(prev => ({ ...prev, variations: updatedVariations }));
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
    setFormData(prev => ({ ...prev, variations: [...prev.variations, newVar] }));
  };

  const removeVariation = (id) => {
    setFormData(prev => ({ ...prev, variations: prev.variations.filter(v => v.id !== id) }));
  };

  // Image Handlers
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileUrl = await handleFileUpload(file, field);
    if (fileUrl) {
      setFormData(prev => ({ ...prev, [field]: fileUrl }));
    }
  };

  const removeGalleryImage = (index) => {
    const updatedGallery = [...formData.gallery];
    updatedGallery.splice(index, 1);
    setFormData(prev => ({ ...prev, gallery: updatedGallery }));
  };

  // --- WYSIWYG EDITOR FUNCTIONS ---
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      const content = editorRef.current.innerHTML;
      updateDescriptionTab(descriptionTabs[activeDescriptionTab].id, 'content', content);
    }
  };

  const handleContentInput = (e) => {
    const content = e.currentTarget.innerHTML;
    const updatedTabs = descriptionTabs.map(tab => 
      tab.id === descriptionTabs[activeDescriptionTab].id ? { ...tab, content: content } : tab
    );
    setDescriptionTabs(updatedTabs);
  };

  const handleEditorFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = await handleFileUpload(file, 'editor_image');
    if (!fileUrl) return;

    const fileType = file.type;
    let html = "";

    if (fileType.startsWith("image/")) {
      html = `
        <img 
          src="${API_URL}/${fileUrl}" 
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
      html = `
        <video 
          src="${API_URL}/${fileUrl}" 
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

  // Image resize functionality
  useEffect(() => {
    let img = null;
    let startY = 0;
    let startHeight = 0;
    let ratio = 1;

    const mouseDown = (e) => {
      if (e.target.tagName === "IMG" && e.target.classList.contains('editor-img')) {
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
        img.style.width = newHeight * ratio + "px";
        img.style.marginLeft = "auto";
        img.style.marginRight = "auto";
      }
    };

    const mouseUp = () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      img = null;
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("mousedown", mouseDown);
    }

    return () => {
      if (editor) {
        editor.removeEventListener("mousedown", mouseDown);
      }
    };
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

  const addReviewsTab = () => {
    const reviewTabExists = descriptionTabs.some(tab => tab.title === "Reviews");
    if (!reviewTabExists) {
      const newTab = { 
        id: 'reviews-tab-' + Date.now(), 
        title: "Reviews",
        isReviewTab: true
      };
      setDescriptionTabs(prev => [...prev, newTab]);
      setActiveDescriptionTab(descriptionTabs.length);
    }
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
  const addReview = async (review) => {
    try {
      const reviewData = {
        product_id: parseInt(id),
        reviewer_name: review.name,
        reviewer_email: review.email,
        rating: review.rating,
        review_title: review.title,
        review_text: review.comment,
        review_date: review.date
      };

      const response = await axios.post(`${API_URL}/admin/products/products.php?action=add_review`, reviewData);
      
      if (response.data.success) {
        // Refresh product data to get updated reviews
        await loadProductData(id);
        setShowReviewModal(false);
        setMessage({ type: 'success', text: 'Review added successfully!' });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to add review' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding review: ' + error.message });
    }
  };

  // Calculate Discount %
  const discount = formData.basePrice && formData.salePrice && formData.basePrice > formData.salePrice ? 
    Math.round(((parseFloat(formData.basePrice) - parseFloat(formData.salePrice)) / parseFloat(formData.basePrice)) * 100) : 0;

  // Render Description Tab Content
  const renderDescriptionTabContent = () => {
    const activeTab = descriptionTabs[activeDescriptionTab];
    
    // If it's the Reviews tab
    if (activeTab.isReviewTab) {
      return (
        <ReviewsComponent
          reviews={formData.reviews}
          rating={formData.rating}
          reviewCount={formData.reviewCount}
          onAddReview={() => setShowReviewModal(true)}
        />
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
        ></div>
        
        <p className="text-xs text-gray-400 mt-2">
            * This is a live editor. Images and styling appear exactly as they will on the website.
        </p>
      </div>
    );
  };

  // Get image URL with base URL
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('uploads/')) return `${API_URL}/${url}`;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return `${API_URL}/${url}`;
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
        accept="image/*,video/*"
        hidden 
        onChange={handleEditorFileUpload}
      />

      {/* Message Display */}
      {message.text && (
        <div className={`max-w-7xl mx-auto mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
          message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {message.type === 'error' && <FaExclamationCircle />}
              {message.type === 'success' && <FaCheck />}
              <span>{message.text}</span>
            </div>
            <button 
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle />
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || saving || uploading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
            <p className="text-gray-700">
              {loading && 'Loading product...'}
              {saving && 'Saving product...'}
              {uploading && 'Uploading file...'}
            </p>
          </div>
        </div>
      )}

      {/* --- TOP HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/products"
            className="text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-gray-500">
              {isEditMode ? 'Edit product details' : 'Create a new product with complete details'}
              {isEditMode && formData.sku && ` | SKU: ${formData.sku}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
          {isEditMode && (
            <>
              <Link
                to={`/product/${formData.slug}`}
                target="_blank"
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded font-bold flex items-center justify-center gap-2 transition text-sm"
              >
                <FaEye /> View
              </Link>
              <button 
                onClick={handleDeleteProduct}
                className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded font-bold flex items-center justify-center gap-2 transition text-sm"
              >
                <FaTrash /> Delete
              </button>
            </>
          )}
          
          <button 
            onClick={handleSaveProduct}
            disabled={saving}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded shadow-lg font-bold flex items-center justify-center gap-2 transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} 
            {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Save Product'}
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
                  placeholder={formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                />
              </div>
            </div>
          </div>

          {/* 2. LIVE DESCRIPTION EDITOR */}
          <div className="bg-white rounded shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between px-3 md:px-4 pt-3">
                <h3 className="font-bold text-gray-700">Product Details</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={addReviewsTab}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 flex items-center gap-1"
                  >
                    <MdReviews size={10} /> Add Reviews Tab
                  </button>
                  <button 
                    onClick={addDescriptionTab}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
                  >
                    <FaPlusCircle size={10} /> Add Content Tab
                  </button>
                </div>
              </div>
              
              <div className="flex border-b border-gray-200 px-3 md:px-4 mt-3 overflow-x-auto">
                {descriptionTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDescriptionTab(index)}
                    className={`px-3 md:px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${index === activeDescriptionTab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab.title}
                    {!tab.isReviewTab && (
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
                          step="0.01"
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
                          step="0.01"
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
                              <option value="In Stock">In Stock</option>
                              <option value="Out of Stock">Out of Stock</option>
                              <option value="Low Stock">Low Stock</option>
                              <option value="Pre Order">Pre Order</option>
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
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                            <option value="piece">piece</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Shipping Class</label>
                        <input 
                          name="shippingClass" 
                          value={formData.shippingClass} 
                          onChange={handleChange} 
                          className="w-full border rounded p-2 text-sm"
                          placeholder="Standard Shipping"
                        />
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
                          <option value="cm">cm</option>
                          <option value="m">m</option>
                          <option value="inch">inch</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Shipping Days</label>
                      <input 
                        name="shippingDays" 
                        value={formData.shippingDays} 
                        onChange={handleChange} 
                        className="w-full border rounded p-2"
                        placeholder="3-5 business days"
                      />
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
                                  <option value="ml">ml</option>
                                  <option value="kg">kg</option>
                                  <option value="g">g</option>
                                  <option value="l">l</option>
                                  <option value="piece">piece</option>
                                </select>
                              </td>
                              <td className="border p-2">
                                <input 
                                  value={v.price} 
                                  onChange={(e)=>handleVariationChange(v.id, 'price', e.target.value)} 
                                  placeholder="499" 
                                  className="w-full border rounded p-1 text-sm"
                                  type="number"
                                  step="0.01"
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
                          
                          {formData.variations.length === 0 && (
                            <tr>
                              <td colSpan="6" className="border p-4 text-center text-gray-500">
                                No variations added yet. Click "Add Variation" to get started.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
                      
                      {formData.faqs.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500">No FAQs added yet</p>
                          <button 
                            onClick={addFAQ}
                            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Add your first FAQ
                          </button>
                        </div>
                      )}
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
                            style={{ width: `${Math.min(formData.seoScore, 100)}%` }}
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
                          placeholder="Optimized product title for search engines"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Meta Description</label>
                        <textarea 
                          name="seoDescription" 
                          value={formData.seoDescription} 
                          onChange={handleChange} 
                          maxLength="160"
                          rows="3"
                          className="w-full border rounded p-2 text-sm"
                          placeholder="Brief description that appears in search results"
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
                      
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Meta Robots</label>
                        <select 
                          name="metaRobots" 
                          value={formData.metaRobots} 
                          onChange={handleChange} 
                          className="w-full border rounded p-2 text-sm"
                        >
                          <option value="index, follow">Index, Follow</option>
                          <option value="noindex, follow">Noindex, Follow</option>
                          <option value="index, nofollow">Index, Nofollow</option>
                          <option value="noindex, nofollow">Noindex, Nofollow</option>
                        </select>
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
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className="flex justify-between">
                <span>Visibility:</span>
                <span className="font-bold">Public</span>
              </div>
              <div className="flex justify-between">
                <span>Reviews:</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="checkbox" 
                    id="enableReviews" 
                    checked={formData.enableReviews} 
                    onChange={(e) => setFormData(prev => ({...prev, enableReviews: e.target.checked}))}
                    className="mr-1"
                  />
                  <label htmlFor="enableReviews" className="text-sm">Enable</label>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button 
                onClick={handleSaveProduct}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />} 
                {saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Publish Product')}
              </button>
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded font-bold text-sm hover:bg-gray-300"
              >
                Cancel
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
                <img 
                  src={getImageUrl(formData.featureImage)} 
                  className="w-full h-full object-cover" 
                  alt="Featured"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />
              ) : (
                <div className="text-center p-4">
                  <FaCloudUploadAlt className="mx-auto text-gray-400 text-3xl mb-2"/>
                  <span className="text-xs text-blue-600 font-bold">Upload Image</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={featureImgRef} 
              hidden 
              onChange={(e) => handleImageUpload(e, 'featureImage')}
              accept="image/*"
            />
            <div className="mt-2">
              <input 
                type="text" 
                name="featureImgAlt" 
                value={formData.featureImgAlt} 
                onChange={handleChange}
                placeholder="Image alt text for SEO"
                className="w-full border rounded p-2 text-xs"
              />
            </div>
          </div>

          {/* 3. PRODUCT GALLERY */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Product Gallery</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {formData.gallery.map((img, index) => (
                <div key={img.id || index} className="relative aspect-square border rounded overflow-hidden group">
                  <img
                    src={getImageUrl(img.url)}
                    className="w-full h-full object-cover"
                    alt={`Gallery ${index + 1}`}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=Image+Not+Found';
                    }}
                  />
                  <button 
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                  >
                    <FaTimesCircle size={12}/>
                  </button>
                </div>
              ))}
              <div 
                onClick={() => galleryRef.current.click()} 
                className="aspect-square border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-400"
              >
                <FaPlusCircle className="text-gray-400 hover:text-blue-500 transition text-2xl"/>
              </div>
            </div>
            <button 
              onClick={() => galleryRef.current.click()} 
              className="w-full text-xs text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 py-2 border border-dashed border-gray-300 rounded hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <FaPlusCircle/> Add Gallery Images
            </button>
            <input 
              type="file" 
              multiple 
              ref={galleryRef} 
              hidden 
              onChange={handleGalleryUpload}
              accept="image/*"
            />
          </div>

          {/* 4. ORGANIZATION */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Organization</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1">Product Category</label>
              <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 space-y-1">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded">
                    <input 
                      type="checkbox" 
                      checked={formData.category.includes(cat.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            category: [...prev.category, cat.name]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            category: prev.category.filter(c => c !== cat.name)
                          }));
                        }
                      }}
                    />
                    {cat.name}
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
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>{brand.name}</option>
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
                  <option value="New Arrival">New Arrival</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Limited Edition">Limited Edition</option>
                  <option value="Hot Deal">Hot Deal</option>
                  <option value="Trending">Trending</option>
                  <option value="Premium">Premium</option>
                </select>
                {formData.ribbon && (
                  <input 
                    type="color" 
                    value={formData.badgeColor || '#dc2626'}
                    onChange={(e) => setFormData(prev => ({...prev, badgeColor: e.target.value}))}
                    className="w-10 h-10 border rounded"
                  />
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}