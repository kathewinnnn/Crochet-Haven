// Centralized API Configuration
// This allows the frontend to work both locally and when deployed

// For local development, use localhost:5000
// For production (Firebase), use your deployed backend URL

const getApiUrl = () => {
  // Check if we're in production (not on localhost)
  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  
  if (isProduction) {
    // TODO: Replace with your deployed backend URL when hosting
    // Example: "https://your-backend.onrender.com"
    return "https://jwt-auth-backend-7fmj.onrender.com"; // Change this to your production URL
  }
  
  return "http://localhost:5000";
};

export const API_BASE_URL = getApiUrl();

// Export specific API endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PRODUCTS: `${API_BASE_URL}/products`,
  ORDERS: `${API_BASE_URL}/orders`,
};

export default API_BASE_URL;