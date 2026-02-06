import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { 
  FaCloudUploadAlt, FaTags, FaSave, FaTimes, FaBullhorn, FaImage, FaBoxOpen,
  FaSpinner, FaCheck, FaExclamationTriangle
} from "react-icons/fa";
import { MdVisibility, MdCategory, MdLink, MdArrowBack } from "react-icons/md";
import {API_URL} from "../../api/API_URL.js";

export default function AddCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Refs for file uploads
  const thumbnailRef = useRef(null);
  const bannerRef = useRef(null);

  // States
  const [thumbPreview, setThumbPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Dropdown States
  const [isProdDropdownOpen, setIsProdDropdownOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Data States
  const [allProducts, setAllProducts] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    "Organic", "Herbal", "Chemical Free", "Ayurveda Inspired", "Vegan",
    "Premium", "Natural", "Handmade", "Cruelty Free", "Eco Friendly"
  ]);

  // Form State
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    type: "Main Category",
    active: true,
    showOnHome: false,
    showOnMenu: false,
    showOnShop: true,
    seoTitle: "",
    seoDesc: "",
    keywords: "",
    selectedTags: ["Herbal"], 
    suitableFor: "All",
    seasonal: "None",
    assignedProducts: [],
  });

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchCategory(id);
    }
    fetchProducts();
    fetchTags();
  }, [id]);

  // API Base URL

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/products/products.php`, {
        params: { token, limit: 100 }
      });
      if (response.data.success) {
        setAllProducts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch Tags
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/categories/tags.php`);
      if (response.data.success) {
        setAvailableTags(response.data.data || availableTags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Fetch Category for Edit
  const fetchCategory = async (categoryId) => {
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/categories/categories.php`, {
        params: { id: categoryId, token }
      });
      
      if (response.data.success) {
        const category = response.data.data;
        
        setForm({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          type: category.type || "Main Category",
          active: category.active == 1,
          showOnHome: category.show_on_home == 1,
          showOnMenu: category.show_on_menu == 1,
          showOnShop: category.show_on_shop == 1,
          seoTitle: category.seo_title || "",
          seoDesc: category.seo_description || "",
          keywords: category.keywords || "",
          selectedTags: category.selectedTags || [],
          suitableFor: category.suitable_for || "All",
          seasonal: category.seasonal || "None",
          assignedProducts: category.assignedProducts?.map(p => p.id) || [],
        });

        // Set image previews
        if (category.thumbnail_image) {
          setThumbPreview(`${API_URL}/../uploads/categories/${category.thumbnail_image}?t=${Date.now()}`);
        }
        if (category.banner_image) {
          setBannerPreview(`${API_URL}/../uploads/categories/${category.banner_image}?t=${Date.now()}`);
        }
      } else {
        setMessage({ type: "error", text: response.data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch category data" });
    } finally {
      setFetching(false);
    }
  };

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Auto-generate slug from name
    if (name === "name" && !id) {
      const slug = value.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
  };

  const toggle = (key) => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    setForm(prev => ({ ...prev, slug: value }));
  };

  // Tag Handlers
  const removeTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== "") {
      e.preventDefault();
      if (!form.selectedTags.includes(tagInput.trim())) {
        setForm(prev => ({ 
          ...prev, 
          selectedTags: [...prev.selectedTags, tagInput.trim()] 
        }));
      }
      setTagInput("");
    }
  };

  const addCustomTag = () => {
    if (tagInput.trim() && !form.selectedTags.includes(tagInput.trim())) {
      setForm(prev => ({ 
        ...prev, 
        selectedTags: [...prev.selectedTags, tagInput.trim()] 
      }));
      setTagInput("");
    }
  };

  const togglePredefinedTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  // Product Handlers
  const toggleProduct = (prodId) => {
    setForm(prev => {
      const isSelected = prev.assignedProducts.includes(prodId);
      return {
        ...prev,
        assignedProducts: isSelected 
          ? prev.assignedProducts.filter(id => id !== prodId)
          : [...prev.assignedProducts, prodId]
      };
    });
  };

  const selectAllProducts = () => {
    const allProductIds = allProducts.map(p => p.id);
    setForm(prev => ({
      ...prev,
      assignedProducts: prev.assignedProducts.length === allProductIds.length 
        ? [] 
        : allProductIds
    }));
  };

  // Image Handlers
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 2MB" });
      return;
    }

    const url = URL.createObjectURL(file);
    if (type === 'thumbnail') {
      setThumbPreview(url);
      setThumbFile(file);
    } else {
      setBannerPreview(url);
      setBannerFile(file);
    }

    // Clear message
    setMessage({ type: '', text: '' });
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Category name is required";
    if (!form.slug.trim()) newErrors.slug = "Slug is required";
    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Category
  const saveCategory = async () => {
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors in the form" });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");
      
      // Add form data
      Object.keys(form).forEach(key => {
        if (key === 'selectedTags' || key === 'assignedProducts') {
          formData.append(key, JSON.stringify(form[key]));
        } else if (typeof form[key] === 'boolean') {
          formData.append(key, form[key] ? 1 : 0);
        } else {
          formData.append(key, form[key]);
        }
      });

      // Add files
      if (thumbFile) {
        formData.append('thumbnail', thumbFile);
      }
      if (bannerFile) {
        formData.append('banner', bannerFile);
      }

      // Add authentication
      formData.append('token', token);

      let response;
      if (id) {
        // Update
        formData.append('id', id);
        response = await axios.post(`${API_URL}/admin/categories/categories.php?action=update`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create
        response = await axios.post(`${API_URL}/admin/categories/categories.php?action=create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        setMessage({ 
          type: "success", 
          text: response.data.message 
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/categories');
        }, 2000);
      } else {
        setMessage({ 
          type: "error", 
          text: response.data.message || "Failed to save category" 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "An error occurred" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Get selected product names
  const getSelectedProductNames = () => {
    return form.assignedProducts.map(productId => {
      const product = allProducts.find(p => p.id === productId);
      return product ? product.name : `Product #${productId}`;
    });
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/categories')}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <MdArrowBack className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {id ? 'Edit Category' : 'Add New Category'}
            </h1>
            <p className="text-sm text-gray-500">
              {id ? 'Update existing category details' : 'Create new product categories with banners & SEO'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              form.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {form.active ? 'Active' : 'Inactive'}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {form.type}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/categories')}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={saveCategory}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> {id ? 'Update Category' : 'Save Category'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`max-w-7xl mx-auto mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <FaCheck className="text-green-600" />
            ) : (
              <FaExclamationTriangle className="text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <MdCategory className="text-blue-600 text-lg" />
              <h2 className="text-sm font-bold text-gray-800 uppercase">Category Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                    Category Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Hair Care, Skin Care"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2 flex items-center gap-1">
                    <MdLink /> Category Slug (URL) *
                  </label>
                  <div className={`flex items-center border rounded-lg px-3 ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <span className="text-gray-500 text-sm">/category/</span>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleSlugChange}
                      placeholder="hair-care"
                      className="flex-1 bg-transparent py-3 text-sm focus:outline-none ml-1"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Use lowercase letters, numbers, and hyphens only
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe this category... (optional)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <p className="text-gray-500 text-xs mt-1">
                  {form.description.length}/500 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                    Suitable For
                  </label>
                  <select
                    name="suitableFor"
                    value={form.suitableFor}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>All</option>
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                    <option>Unisex</option>
                    <option>Babies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                    Seasonal
                  </label>
                  <select
                    name="seasonal"
                    value={form.seasonal}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>None</option>
                    <option>Summer</option>
                    <option>Winter</option>
                    <option>Monsoon</option>
                    <option>All Season</option>
                    <option>Festive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Assignment Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <FaBoxOpen className="text-orange-600" />
              <h2 className="text-sm font-bold text-gray-800 uppercase">Assign Products</h2>
            </div>
            
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  {form.assignedProducts.length} product(s) selected
                </span>
                <button
                  onClick={selectAllProducts}
                  className="text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  {form.assignedProducts.length === allProducts.length 
                    ? 'Deselect All' 
                    : 'Select All'}
                </button>
              </div>
              
              <button
                onClick={() => setIsProdDropdownOpen(!isProdDropdownOpen)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left bg-white flex justify-between items-center hover:border-blue-400 transition"
              >
                <span className={form.assignedProducts.length === 0 ? "text-gray-400" : "text-gray-800"}>
                  {form.assignedProducts.length > 0 
                    ? `${form.assignedProducts.length} Products Selected` 
                    : "Select products to show in this category"}
                </span>
                <span className="text-gray-500">{isProdDropdownOpen ? '▲' : '▼'}</span>
              </button>

              {isProdDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 shadow-xl rounded-lg mt-1 max-h-60 overflow-y-auto">
                  <div className="p-3 border-b bg-gray-50">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="p-2">
                    {allProducts.length > 0 ? (
                      allProducts.map(prod => (
                        <label
                          key={prod.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.assignedProducts.includes(prod.id)}
                            onChange={() => toggleProduct(prod.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{prod.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            #{prod.id}
                          </span>
                        </label>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <FaBoxOpen className="text-2xl mx-auto mb-2 text-gray-300" />
                        <p>No products available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Selected Products Preview */}
              {form.assignedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 p-3 bg-gray-50 rounded-lg border">
                  {getSelectedProductNames().map((name, index) => {
                    const productId = form.assignedProducts[index];
                    return (
                      <span
                        key={productId}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 text-sm rounded-lg border border-orange-200"
                      >
                        {name}
                        <FaTimes
                          className="ml-1 cursor-pointer hover:text-orange-900"
                          onClick={() => toggleProduct(productId)}
                        />
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tags Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <FaTags className="text-green-600" />
              <h2 className="text-sm font-bold text-gray-800 uppercase">Tags & Filters</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-3">
                Add Tags
              </label>
               
              {/* Input Area */}
              <div className="flex gap-2 mb-4">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type tag name and press Enter..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={addCustomTag}
                  className="bg-green-600 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2"
                >
                  <FaTags /> Add
                </button>
              </div>

              {/* Selected Tags */}
              <div className="mb-6">
                <p className="text-xs text-gray-600 mb-2">Selected Tags:</p>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border min-h-[50px]">
                  {form.selectedTags.length === 0 ? (
                    <span className="text-sm text-gray-400 italic">No tags added yet</span>
                  ) : (
                    form.selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm px-3 py-2 rounded-lg border border-green-200 font-medium"
                      >
                        {tag}
                        <FaTimes
                          className="cursor-pointer hover:text-green-900"
                          onClick={() => removeTag(tag)}
                        />
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Suggested Tags */}
              <div>
                <p className="text-xs text-gray-600 mb-2">Popular Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => togglePredefinedTag(tag)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                        form.selectedTags.includes(tag)
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {form.selectedTags.includes(tag) ? '✓ ' : '+ '}{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <FaBullhorn className="text-purple-600" />
              <h2 className="text-sm font-bold text-gray-800 uppercase">SEO Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  SEO Title
                </label>
                <input
                  name="seoTitle"
                  value={form.seoTitle}
                  onChange={handleChange}
                  placeholder="Meta title for search engines"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Recommended: 50-60 characters ({form.seoTitle.length})
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  SEO Description
                </label>
                <textarea
                  name="seoDesc"
                  value={form.seoDesc}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Meta description for search results"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Recommended: 150-160 characters ({form.seoDesc.length})
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Keywords
                </label>
                <textarea
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Comma separated keywords (e.g., herbal, natural, organic)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Settings & Images */}
        <div className="lg:col-span-1 space-y-6">
          {/* Visibility Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <MdVisibility className="text-gray-600" />
              <h2 className="text-sm font-bold text-gray-800 uppercase">Visibility Settings</h2>
            </div>
            
            <div className="space-y-4">
              {/* Status Toggle */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                <div>
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <p className="text-xs text-gray-500">
                    {form.active ? 'Category is visible' : 'Category is hidden'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.active}
                    onChange={() => toggle("active")}
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Display Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Display On:</h3>
                {[
                  { key: 'showOnHome', label: 'Home Page', desc: 'Show on homepage' },
                  { key: 'showOnMenu', label: 'Main Menu', desc: 'Show in navigation menu' },
                  { key: 'showOnShop', label: 'Shop Page', desc: 'Show in shop page' }
                ].map(({ key, label, desc }) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={() => toggle(key)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm text-gray-700">{label}</span>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Category Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
              Category Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option>Main Category</option>
              <option>Sub Category</option>
              <option>Collection</option>
              <option>Featured</option>
              <option>Trending</option>
            </select>
            <p className="text-gray-500 text-xs mt-2">
              Defines category hierarchy and display rules
            </p>
          </div>

          {/* Thumbnail Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase">Thumbnail Image</h2>
              {thumbPreview && (
                <button
                  onClick={() => {
                    setThumbPreview(null);
                    setThumbFile(null);
                    if (thumbnailRef.current) thumbnailRef.current.value = '';
                  }}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mb-4">Square icon (1:1 ratio, 300×300px recommended)</p>
            
            <div
              onClick={() => thumbnailRef.current.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition relative overflow-hidden group"
            >
              {thumbPreview ? (
                <>
                  <img
                    src={thumbPreview}
                    alt="Thumbnail preview"
                    className="absolute inset-0 w-full h-full object-cover p-2"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                      Change Image
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-gray-400 text-3xl mb-3" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 2MB)</span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={thumbnailRef}
              hidden
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'thumbnail')}
            />
          </div>

          {/* Banner Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase">Banner Image</h2>
              {bannerPreview && (
                <button
                  onClick={() => {
                    setBannerPreview(null);
                    setBannerFile(null);
                    if (bannerRef.current) bannerRef.current.value = '';
                  }}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mb-4">Wide banner (16:9 ratio, 1200×400px recommended)</p>
            
            <div
              onClick={() => bannerRef.current.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition relative overflow-hidden group"
            >
              {bannerPreview ? (
                <>
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                      Change Banner
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <FaImage className="text-gray-400 text-3xl mb-3" />
                  <span className="text-sm text-gray-500">Click to upload banner</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 2MB)</span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={bannerRef}
              hidden
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'banner')}
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tags</span>
                <span className="font-medium">{form.selectedTags.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Products</span>
                <span className="font-medium">{form.assignedProducts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  form.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {form.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Visibility</span>
                <span className="text-xs font-medium text-gray-700">
                  {[form.showOnHome, form.showOnMenu, form.showOnShop].filter(Boolean).length}/3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}