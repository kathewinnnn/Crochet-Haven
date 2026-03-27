// API configuration that works with the proxy
// The proxy in package.json forwards requests to localhost:5000

const getApiUrl = () => {
  // For development, use relative paths - proxy will forward to backend
  // For production (Netlify), use relative path - API is served from same domain via netlify function
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Check if we're in production (Netlify)
  // Use relative path in production so it goes to the same domain
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // Default to relative path for development (proxy handles forwarding)
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
