// Centralized API Configuration
// This allows the frontend to work both locally and when deployed

// Use environment variable for production, fallback to localhost for development
// For Netlify deployment, set REACT_APP_API_URL in Netlify dashboard
const getApiUrl = () => {
  // Check for environment variable first (works in both dev and production)
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback: check if we're on localhost
  // This works at runtime in development
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      return "http://localhost:5000";
    }
  }
  
  // Default production URL (Render.com)
  return "https://crochet-haven-r62p.onrender.com";
};

export const API_BASE_URL = getApiUrl();

// Export specific API endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PRODUCTS: `${API_BASE_URL}/products`,
  ORDERS: `${API_BASE_URL}/orders`,
};

export default API_BASE_URL;
