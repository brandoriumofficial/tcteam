// src/api/authApi.js
import { API_URL } from './API_URL';

// 1. LOGIN API
export async function apiLogin(data) {
  try {
    const response = await fetch(`${API_URL}/user/login/login.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    console.log("Login Response:", json); // Debug log

    // If response is not ok, throw error
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Login failed');
    }

    // Save to localStorage immediately
    if (json.token) {
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
      localStorage.setItem('user_type', json.user_type);
      console.log("Data saved to localStorage:", {
        token: json.token,
        user: json.user,
        user_type: json.user_type
      });
    }

    return json;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
}

// 2. REGISTER API
export async function apiRegister(data) {
  try {
    const response = await fetch(`${API_URL}/user/login/register.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const json = await response.json();
    console.log("Register Response:", json);

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Registration failed');
    }

    return json;
  } catch (error) {
    console.error("Register API Error:", error);
    throw error;
  }
}

// 3. GOOGLE LOGIN API
export async function apiGoogleLogin(data) {
  try {
    const response = await fetch(`${API_URL}/user/login/google_login.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    console.log("Google Login Response:", json);

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Google Login failed');
    }

    // Save to localStorage
    if (json.token) {
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
      localStorage.setItem('user_type', json.user_type);
    }

    return json;
  } catch (error) {
    console.error("Google Login API Error:", error);
    throw error;
  }
}

// 4. LOGOUT API
export async function apiLogout() {
  const token = localStorage.getItem('token');
  
  try {
    if (token) {
      await fetch(`${API_URL}/user/logout/logout.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    }
  } catch (error) {
    console.error("Logout API Error:", error);
  } finally {
    // Clear localStorage regardless of API result
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    console.log("LocalStorage cleared");
  }
  
  return { success: true, message: 'Logged out' };
}

// 5. CHECK AUTH STATUS
export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

// 6. GET USER INFO
export function getUserInfo() {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

// 7. GET USER TYPE
export function getUserType() {
  return localStorage.getItem('user_type');
}