const getApiUrl = () => {
  // Check for environment variable first (works in both dev and production)
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
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
