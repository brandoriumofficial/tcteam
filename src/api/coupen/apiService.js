// api/coupen/apiService.js
import { API_URL } from "../API_URL";

export const api = {
  // --- COUPONS ---
  getCoupons: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/coupons/coupons.php`);
      const result = await response.json();
      
      // Check if response has success property
      if (result.success) {
        return result.data;
      } else {
        console.error("API Error:", result.message);
        throw new Error(result.message || "Failed to fetch coupons");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  },
  
  saveCoupon: async (data) => {
    try {
      // Determine Method: POST (Create) or PUT (Update)
      const method = data.id ? 'PUT' : 'POST';
      
      // Prepare data for API
      const apiData = {
        code: data.code,
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue) || 0,
        minPurchase: parseFloat(data.min) || 0,
        category: data.category || 'All',
        usageLimit: parseInt(data.usageLimit) || 100,
        status: data.status || 'active',
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        expiryDate: data.expiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: data.tags || []
      };
      
      // Add ID if updating
      if (data.id) {
        apiData.id = data.id;
      }
      
      const response = await fetch(`${API_URL}/admin/coupons/coupons.php`, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || "Failed to save coupon");
      }
    } catch (error) {
      console.error("Save Error:", error);
      throw error;
    }
  },
  
  deleteCoupon: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/coupons/coupons.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || "Failed to delete coupon");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      throw error;
    }
  },

  // --- OFFERS ---
  getOffers: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/coupons/offers.php`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch offers");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  },
  
  saveOffer: async (data) => {
    try {
      const method = data.id ? 'PUT' : 'POST';
      
      // Prepare data for API
      const apiData = {
        name: data.name,
        description: data.desc || '',
        offer_type: data.type || 'Flat Discount',
        discount_details: data.discount || '',
        category: data.category || '',
        products: data.products || [],
        status: data.status || 'active',
        start_date: data.startDate || new Date().toISOString().split('T')[0],
        end_date: data.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        banner_image: data.bannerImage || '',
        tags: data.tags || [],
        priority: parseInt(data.priority) || 1
      };
      
      // Add ID if updating
      if (data.id) {
        apiData.id = data.id;
      }
      
      const response = await fetch(`${API_URL}/admin/coupons/offers.php`, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || "Failed to save offer");
      }
    } catch (error) {
      console.error("Save Error:", error);
      throw error;
    }
  },
  
  deleteOffer: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/coupons/offers.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || "Failed to delete offer");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      throw error;
    }
  }
};