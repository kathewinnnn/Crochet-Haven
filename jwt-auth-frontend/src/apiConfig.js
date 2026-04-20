// API configuration that works with Netlify functions + Firebase
// In production, API calls go to the same domain via Netlify functions

const getApiUrl = () => {
  // For development, use relative paths - proxy will forward to backend
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // In production (Netlify), use relative paths to Netlify functions
  if (process.env.NODE_ENV === 'production') {
    return '';  // Will use /api/Netlify functions
  }
  
  // Default to relative path for development
  return '';
};

// Build dynamic endpoints based on current base URL
const buildEndpoints = (baseUrl) => ({
  AUTH: `${baseUrl}/api/auth`,
  PRODUCTS: `${baseUrl}/api/products`,
  ORDERS: `${baseUrl}/api/orders`,
});

export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = buildEndpoints(API_BASE_URL);

export default API_BASE_URL;
