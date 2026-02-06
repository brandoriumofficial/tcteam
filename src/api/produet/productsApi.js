// Add these imports at the top
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// Update API URL
import { API_URL } from '../API_URL';
// Add these functions for API calls
const api = {
  // Save product
  saveProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_URL}?action=save_product`, productData);
      return response.data;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_URL}?action=upload_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get product by ID
  getProduct: async (id) => {
    try {
      const response = await axios.get(`${API_URL}?action=get_product&id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
};

const handleSaveProduct = async () => {
  setSaving(true);
  setMessage({ type: '', text: '' });
  
  try {
    const productData = {
      ...formData,
      descriptionTabs,
      // Convert gallery images to proper format
      gallery: formData.gallery.map(img => ({
        url: img.url,
        alt: img.alt || ''
      })),
      // Convert variations
      variations: formData.variations.map(v => ({
        size: v.size,
        unit: v.unit,
        price: v.price,
        stock: v.stock,
        sku: v.sku
      })),
      // Convert FAQs
      faqs: formData.faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer
      }))
    };

    // Send to backend
    const result = await api.saveProduct(productData);
    
    setMessage({ 
      type: 'success', 
      text: 'Product saved successfully!' 
    });
    
    // If new product, redirect to edit page
    if (result.data && result.data.product_id) {
      navigate(`/edit-product/${result.data.product_id}`);
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

// Update image upload handler to use API
const handleImageUpload = async (e, field) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  
  try {
    const result = await api.uploadFile(file);
    
    if (result.success) {
      setFormData(prev => ({ 
        ...prev, 
        [field]: result.data.file_url 
      }));
      
      setMessage({ 
        type: 'success', 
        text: 'Image uploaded successfully!' 
      });
    }
  } catch (error) {
    setMessage({ 
      type: 'error', 
      text: 'Error uploading image' 
    });
  } finally {
    setUploading(false);
  }
};

// Load product data if editing
useEffect(() => {
  if (id) {
    loadProductData(id);
  }
}, [id]);

const loadProductData = async (productId) => {
  setLoading(true);
  try {
    const result = await api.getProduct(productId);
    
    if (result.success) {
      const product = result.data;
      
      // Update form state with product data
      setFormData({
        ...formData,
        ...product,
        category: product.category || [],
        tags: product.tags || ''
      });
      
      // Update description tabs
      if (product.description_tabs) {
        setDescriptionTabs(product.description_tabs);
      }
    }
  } catch (error) {
    setMessage({ 
      type: 'error', 
      text: 'Error loading product' 
    });
  } finally {
    setLoading(false);
  }
};

