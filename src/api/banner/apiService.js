import {API_URL} from "../../api/API_URL";
const API_URL1 = API_URL+"/admin/banners/api.php"; 

export const bannerApi = {
  // Read
  getAll: async () => {
    const res = await fetch(`${API_URL1}?action=read`);
    return await res.json();
  },

  // Create (Multipart for File)
  create: async (formData) => {
    const res = await fetch(`${API_URL1}?action=create`, {
      method: "POST",
      body: formData, // Auto sets Content-Type to multipart/form-data
    });
    return await res.json();
  },

  // Update
  update: async (formData) => {
    const res = await fetch(`${API_URL1}?action=update`, {
      method: "POST", // Using POST for file upload even in update
      body: formData,
    });
    return await res.json();
  },

  // Delete
  delete: async (id) => {
    const res = await fetch(`${API_URL1}?action=delete&id=${id}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};
