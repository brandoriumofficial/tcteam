import { API_URL } from "./API_URL";

const API_BASE = `${API_URL}/admin/categories`;

// Fetch all categories
export const fetchCategories = async (search = '') => {
  try {
    const url = search 
      ? `${API_BASE}/get_categories.php?search=${encodeURIComponent(search)}`
      : `${API_BASE}/get_categories.php`;
      
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to fetch categories:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Update category
export const updateCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE}/update_category.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, message: 'Network error' };
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE}/delete_category.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: categoryId })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, message: 'Network error' };
  }
};

// Toggle category status
export const toggleCategoryStatus = async (categoryId, currentStatus) => {
  try {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    const response = await fetch(`${API_BASE}/update_category.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: categoryId, 
        status: newStatus 
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling status:', error);
    return { success: false, message: 'Network error' };
  }
};