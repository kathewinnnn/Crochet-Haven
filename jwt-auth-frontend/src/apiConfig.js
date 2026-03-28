// API configuration for connecting to backend
// Update the RENDER_URL when you deploy to Render

const getApiUrl = () => {
  // For production (deployed on Render/Netlify), use your Render URL
  // Replace with your actual Render backend URL after deployment
  // Example: https://jwt-auth-backend.onrender.com
  const RENDER_URL = 'https://jwt-auth-backend-jgb3.onrender.com';
  
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    return RENDER_URL;
  }
  
  // For development, use localhost
  // Your json-server runs on port 5000
  return 'http://localhost:5000';
};

const buildEndpoints = (baseUrl) => ({
  AUTH: `${baseUrl}/api/auth`,
  PRODUCTS: `${baseUrl}/products`,
  ORDERS: `${baseUrl}/orders`,
});

export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = buildEndpoints(API_BASE_URL);

export default API_BASE_URL;
