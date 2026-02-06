// src/services/GetProdutes.js

// Using proxy
const API_BASE = process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost/tcteam/backend/admin/products/products.php';

export const GetProdutes = {
  GET_PRODUCTS: `${API_BASE}?action=get_products`,
  
  GET_PRODUCT: (id) => `${API_BASE}?action=get_product&id=${id}`,
  
  SAVE_PRODUCT: `${API_BASE}?action=save_product`,
  
  DELETE_PRODUCT: (id) => `${API_BASE}?action=delete_product&id=${id}`,
  
  UPDATE_STATUS: (id) => `${API_BASE}?action=update_status&id=${id}`,
  
  BULK_DELETE: `${API_BASE}?action=bulk_delete`,
  
  UPLOAD_FILE: `${API_BASE}?action=upload_file`,
  
  UPLOAD_IMAGE: `${API_BASE}?action=upload_image`,
  
  DELETE_IMAGE: `${API_BASE}?action=delete_image`,
  
  GET_CATEGORIES: `${API_BASE}?action=get_categories`,
  
  GET_BRANDS: `${API_BASE}?action=get_brands`,
  
  TEST_API: `${API_BASE}?action=test`,
};