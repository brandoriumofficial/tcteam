// src/api/user/products.js
import { API_URL } from "../API_URL";
const API_BASE_URL = API_URL;

const DEFAULT_IMAGE = 'https://via.placeholder.com/600x600/f5f5f5/999999?text=No+Image';

// API Helper Function
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}/user/products${endpoint}`;
    
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      body: options.body ? options.body : undefined,
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON
    const data = await response.json();
    return data;

  } catch (error) {
    // Return empty/default data instead of throwing
    return { success: false, error: error.message };
  }
};

// Fetch products by category
export const fetchProductsByCategory = async (category) => {
  try {
    const data = await apiCall(`/products.php`);
    
    if (data.success && data.products) {
      return data.products.map(product => ({
        ...product,
        img: product.feature_image || product.img || DEFAULT_IMAGE,
        hoverImg: product.side_image || product.hoverImg || product.feature_image || DEFAULT_IMAGE,
        feature_image: product.feature_image || DEFAULT_IMAGE,
      }));
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Fetch single product by slug
export const fetchProductBySlug = async (slug) => {
  try {
    if (!slug) return null;
    
    const data = await apiCall(`/product-detail.php?slug=${encodeURIComponent(slug)}`);
    
    if (data.success && data.product) {
      const product = data.product;
      return {
        ...product,
        feature_image: product.feature_image || DEFAULT_IMAGE,
        banner_image: product.banner_image || null,
        side_image: product.side_image || null,
        rating: parseFloat(product.rating) || 4.5,
        review_count: parseInt(product.review_count) || 0,
        base_price: parseFloat(product.base_price) || 0,
        sale_price: parseFloat(product.sale_price) || parseFloat(product.base_price) || 0,
        stock_status: product.stock_status || 'In Stock',
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Fetch product variations
export const fetchProductVariations = async (slug) => {
  try {
    if (!slug) return [];
    
    const data = await apiCall(`/product-variations.php?slug=${encodeURIComponent(slug)}`);
    
    if (data.success && data.variations) {
      return data.variations.map(v => ({
        ...v,
        id: v.id,
        name: v.name || v.variant_name || 'Default',
        price: parseFloat(v.sale_price || v.price) || 0,
        base_price: parseFloat(v.base_price || v.price) || 0,
        sale_price: parseFloat(v.sale_price || v.price) || 0,
      }));
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Fetch product gallery
export const fetchProductGallery = async (slug) => {
  try {
    if (!slug) return [];
    
    const data = await apiCall(`/product-gallery.php?slug=${encodeURIComponent(slug)}`);
    
    if (data.success && data.gallery && Array.isArray(data.gallery)) {
      return data.gallery
        .filter(item => item && (item.image_url || item.media_url || item.url))
        .map(item => ({
          id: item.id,
          image_url: item.image_url || item.media_url || item.url || DEFAULT_IMAGE,
          alt_text: item.alt_text || '',
        }));
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Fetch product FAQs
export const fetchProductFaqs = async (slug) => {
  try {
    if (!slug) return [];
    
    const data = await apiCall(`/product-faqs.php?slug=${encodeURIComponent(slug)}`);
    
    if (data.success && data.faqs) {
      return data.faqs;
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Fetch product tabs
export const fetchProductTabs = async (slug) => {
  try {
    if (!slug) return [];
    
    const data = await apiCall(`/product-tabs.php?slug=${encodeURIComponent(slug)}`);
    
    if (data.success && data.tabs) {
      return data.tabs;
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Create Razorpay Order
export const createRazorpayOrder = async (orderData) => {
  try {
    const data = await apiCall('/create-order.php', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    
    return data;
  } catch (error) {
    return { success: false, message: 'Failed to create order' };
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (paymentData) => {
  try {
    const data = await apiCall('/verify-payment.php', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    
    return data;
  } catch (error) {
    return { success: false, message: 'Payment verification failed' };
  }
};

// Export default
export default {
  fetchProductsByCategory,
  fetchProductBySlug,
  fetchProductVariations,
  fetchProductGallery,
  fetchProductFaqs,
  fetchProductTabs,
  createRazorpayOrder,
  verifyPayment,
};