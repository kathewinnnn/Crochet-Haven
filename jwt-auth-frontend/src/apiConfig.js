// API configuration for hybrid deployment (Netlify frontend + Render backend)
// For production: set REACT_APP_API_URL in Netlify to your Render backend URL

const getApiUrl = () => {
  // Use environment variable if set (for external backend like Render)
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // In production without env var, use relative path (for Netlify functions)
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // Development: use relative path (proxy handles forwarding)
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
