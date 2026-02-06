// api/coupons.js
import axios from 'axios';
import { API_URL } from './config';

const COUPONS_API = API_URL + '/admin/coupons/coupons_api.php';
const OFFERS_API = API_URL + '/admin/offers/offers_api.php';
const CART_API = API_URL + '/api/cart/carts_api.php';

export const couponsApi = {
  // Get all coupons
  getCoupons: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${COUPONS_API}?action=list&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  // Create coupon
  createCoupon: async (couponData) => {
    try {
      const response = await axios.post(`${COUPONS_API}?action=create`, couponData);
      return response.data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  // Update coupon
  updateCoupon: async (couponData) => {
    try {
      const response = await axios.put(`${COUPONS_API}?action=update`, couponData);
      return response.data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  // Delete coupon
  deleteCoupon: async (couponId) => {
    try {
      const response = await axios.delete(`${COUPONS_API}?action=delete`, {
        data: { id: couponId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },

  // Validate coupon
  validateCoupon: async (couponData) => {
    try {
      const response = await axios.post(`${COUPONS_API}?action=validate`, couponData);
      return response.data;
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  },

  // Get coupon stats
  getCouponStats: async () => {
    try {
      const response = await axios.get(`${COUPONS_API}?action=stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching coupon stats:', error);
      throw error;
    }
  },

  // Get coupon suggestions
  getCouponSuggestions: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${COUPONS_API}?action=suggestions&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching coupon suggestions:', error);
      throw error;
    }
  },

  // Bulk generate coupons
  bulkGenerateCoupons: async (bulkData) => {
    try {
      const response = await axios.post(`${COUPONS_API}?action=bulk-generate`, bulkData);
      return response.data;
    } catch (error) {
      console.error('Error bulk generating coupons:', error);
      throw error;
    }
  }
};

export const offersApi = {
  // Get all offers
  getOffers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${OFFERS_API}?action=list&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  // Create offer
  createOffer: async (offerData) => {
    try {
      const response = await axios.post(`${OFFERS_API}?action=create`, offerData);
      return response.data;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },

  // Update offer
  updateOffer: async (offerData) => {
    try {
      const response = await axios.put(`${OFFERS_API}?action=update`, offerData);
      return response.data;
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  },

  // Delete offer
  deleteOffer: async (offerId) => {
    try {
      const response = await axios.delete(`${OFFERS_API}?action=delete`, {
        data: { id: offerId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  },

  // Validate offer
  validateOffer: async (offerData) => {
    try {
      const response = await axios.post(`${OFFERS_API}?action=validate`, offerData);
      return response.data;
    } catch (error) {
      console.error('Error validating offer:', error);
      throw error;
    }
  },

  // Get offer stats
  getOfferStats: async () => {
    try {
      const response = await axios.get(`${OFFERS_API}?action=stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offer stats:', error);
      throw error;
    }
  },

  // Get offer analytics
  getOfferAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${OFFERS_API}?action=analytics&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offer analytics:', error);
      throw error;
    }
  },

  // Get offer suggestions
  getOfferSuggestions: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${OFFERS_API}?action=suggestions&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offer suggestions:', error);
      throw error;
    }
  },

  // Assign offer to products
  assignOfferToProducts: async (assignmentData) => {
    try {
      const response = await axios.post(`${OFFERS_API}?action=assign-to-products`, assignmentData);
      return response.data;
    } catch (error) {
      console.error('Error assigning offer to products:', error);
      throw error;
    }
  },

  // Remove offer from products
  removeOfferFromProducts: async (removalData) => {
    try {
      const response = await axios.post(`${OFFERS_API}?action=remove-from-products`, removalData);
      return response.data;
    } catch (error) {
      console.error('Error removing offer from products:', error);
      throw error;
    }
  }
};

export const cartApi = {
  // Get cart
  getCart: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${CART_API}?action=get&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add to cart
  addToCart: async (cartData) => {
    try {
      const response = await axios.post(`${CART_API}?action=add`, cartData);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart
  updateCart: async (cartData) => {
    try {
      const response = await axios.put(`${CART_API}?action=update`, cartData);
      return response.data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },

  // Remove from cart
  removeFromCart: async (cartData) => {
    try {
      const response = await axios.delete(`${CART_API}?action=remove`, {
        data: cartData
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Apply coupon to cart
  applyCoupon: async (couponData) => {
    try {
      const response = await axios.post(`${CART_API}?action=apply-coupon`, couponData);
      return response.data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  },

  // Remove coupon from cart
  removeCoupon: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.delete(`${CART_API}?action=remove-coupon&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  },

  // Apply offer to cart
  applyOffer: async (offerData) => {
    try {
      const response = await axios.post(`${CART_API}?action=apply-offer`, offerData);
      return response.data;
    } catch (error) {
      console.error('Error applying offer:', error);
      throw error;
    }
  },

  // Remove offer from cart
  removeOffer: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.delete(`${CART_API}?action=remove-offer&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error removing offer:', error);
      throw error;
    }
  },

  // Calculate cart
  calculateCart: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${CART_API}?action=calculate&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error calculating cart:', error);
      throw error;
    }
  }
};