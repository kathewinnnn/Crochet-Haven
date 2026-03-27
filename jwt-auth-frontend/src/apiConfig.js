// API configuration that works with the proxy
// The proxy in package.json forwards requests to localhost:5000

const getApiUrl = () => {
  // For development, use relative paths - proxy will forward to backend
  // For production, use environment variable or empty (relative)
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Default to relative path for development (proxy handles forwarding)
  return "";
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
