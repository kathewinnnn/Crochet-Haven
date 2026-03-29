// API configuration that works with Netlify functions
// In production, API calls go to the same domain via Netlify functions

const getApiUrl = () => {
  // For development, use relative paths - proxy will forward to backend
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Point to Render backend
  if (process.env.NODE_ENV === 'production') {
    return 'https://jwt-auth-backend-obe2.onrender.com';
  }
  
  // Default to relative path for development
  return '';
};

// Build dynamic endpoints based on current base URL
const buildEndpoints = (baseUrl) => ({
  AUTH: `${baseUrl}/api/auth`,
  PRODUCTS: `${baseUrl}/products`,
  ORDERS: `${baseUrl}/orders`,
});

export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = buildEndpoints(API_BASE_URL);

export default API_BASE_URL;
