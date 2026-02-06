const API_URL = 'http://localhost/tcteam/backend';
const clientId = "917835524460-2r5fnf00ruhc8boop1j99k9njcsqae26.apps.googleusercontent.com";
const clientsercet= "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";
export { API_URL, clientId, clientsercet };

// export const API_URLS = {
//   // Products API
//   PRODUCTS: `${API_BASE_URL}/products/products.php`,
  
//   // Categories API
//   CATEGORIES: `${API_BASE_URL}/categories/categories.php`,
  
//   // Tags API
//   TAGS: `${API_BASE_URL}/categories/tags.php`,
  
//   // Users API (Authentication)
//   USERS: `${API_BASE_URL}/users/users.php`,
  
//   // Offers API
//   OFFERS: `${API_BASE_URL}/offers/offers.php`,
  
//   // Coupons API
//   COUPONS: `${API_BASE_URL}/coupons/coupons.php`,
  
//   // Uploads base URL
//   UPLOADS: `${API_BASE_URL}/uploads`
// };

// // Helper function for API calls
// export const apiCall = async (url, method = 'GET', data = null) => {
//   const token = localStorage.getItem('token');
  
//   const headers = {
//     'Content-Type': 'application/json',
//   };
  
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   const options = {
//     method,
//     headers,
//   };
  
//   if (data) {
//     options.body = JSON.stringify(data);
//   }
  
//   try {
//     const response = await fetch(url, options);
//     const result = await response.json();
    
//     if (!response.ok) {
//       throw new Error(result.message || 'API call failed');
//     }
    
//     return result;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

// // Form data API call for file uploads
// export const apiFormDataCall = async (url, formData) => {
//   const token = localStorage.getItem('token');
  
//   const headers = {};
  
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers,
//       body: formData
//     });
    
//     const result = await response.json();
    
//     if (!response.ok) {
//       throw new Error(result.message || 'API call failed');
//     }
    
//     return result;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };