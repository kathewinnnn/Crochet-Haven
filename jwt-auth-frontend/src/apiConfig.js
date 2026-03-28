// API Configuration for JWT Auth Project

// Get the base API URL based on the current environment
const getApiUrl = () => {
  // Default to relative path (works in both dev and Netlify)
  let baseUrl = '';
  
  // Only use absolute URLs in specific environments
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Development: use localhost:5000 for backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      baseUrl = 'http://localhost:5000';
    }
    // Netlify preview/production: use relative paths
    else if (hostname.includes('netlify')) {
      baseUrl = ''; // Relative path
    }
    // For any other production, could use Render or other backend
    else {
      baseUrl = ''; // Relative path
    }
  }
  
  return baseUrl;
};

// Create endpoint builder function (called at runtime)
export const getApiEndpoints = () => {
  const baseUrl = getApiUrl();
  return {
    AUTH: `${baseUrl}/api/auth`,
    PRODUCTS: `${baseUrl}/products`,
    ORDERS: `${baseUrl}/orders`,
  };
};

// For backward compatibility - these are evaluated at module load time
// This may not work correctly in all environments
export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PRODUCTS: `${API_BASE_URL}/products`,
  ORDERS: `${API_BASE_URL}/orders`,
};

export default API_BASE_URL;

// Helper to get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper to get auth header
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
