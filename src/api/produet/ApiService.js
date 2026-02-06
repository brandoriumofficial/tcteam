// api/produet/ApiService.js

import axios from 'axios';
import { API_URL } from '../API_URL.js';

const API_BASE_URL = API_URL + "/admin/products/products.php";

const apiService = {
  // Get product by ID
  getProduct: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?action=get_product&id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Save/Update product
  saveProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}?action=save_product`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file, productId = 0) => {
    const formData = new FormData();
    formData.append('file', file);
    if (productId > 0) {
      formData.append('product_id', productId);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}?action=upload_file`, formData, {
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

  // Get categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}?action=get_categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get brands
  getBrands: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}?action=get_brands`);
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}?action=delete_product&id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get all products
  getProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}?action=get_products&${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Add review
  addReview: async (reviewData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}?action=add_review`, reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
};

export default apiService;