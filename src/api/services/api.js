import { API_URL } from "../API_URL";
const API_BASE = API_URL;

export const checkCouponApi = async (code, cartTotal) => {
  try {
    const response = await fetch(`${API_BASE}/admin/coupons/checkcoupen.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, cartTotal }),
    });
    return await response.json();
  } catch (error) {
    console.error("Coupon API Error:", error);
    return { success: false, message: "Server Error" };
  }
};

export const createOrderApi = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE}/admin/orders/orders.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (error) {
    console.error("Order API Error:", error);
    return { success: false, message: "Server Error" };
  }
};
export const fetchProductsApi = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/products/get_products_for_order.php`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return [];
  }
};