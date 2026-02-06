import {API_URL} from "../API_URL";
const API_URL1 = `${API_URL}/admin/coupons/index.php`; 

export const offerApi = {
  // 1. Setup Table
  setup: async () => {
    return fetch(`${API_URL1}?action=setup`).then(res => res.json());
  },

  // 2. Get All
  getAll: async () => {
    const res = await fetch(`${API_URL1}?action=read`);
    return await res.json();
  },

  // 3. Create
  create: async (data) => {
    const res = await fetch(`${API_URL1}?action=create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // 4. Update Status
  toggleStatus: async (id, status) => {
    const res = await fetch(`${API_URL1}?action=update_status`, {
      method: "POST", // Can use POST for updates too
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    return await res.json();
  },

  // 5. Delete
  delete: async (id) => {
    const res = await fetch(`${API_URL}?action=delete&id=${id}`, {
      method: "DELETE", // Or GET if your server prefers
    });
    return await res.json();
  },
};