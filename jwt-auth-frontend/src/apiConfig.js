import { getCachedProducts, cacheProducts, getCachedOrders, cacheOrders, getCachedUser, cacheUser, isOnline } from './indexedDB';
import axios from 'axios';

const getApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Use relative paths for production (works with Netlify redirects)
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // Use localhost for development
  return '';
};

export const API_BASE_URL = getApiUrl();

export const getProductsWithCache = async () => {
  const online = isOnline();

  try {
    console.log('API Debug - Fetching products from:', `${API_BASE_URL}/api/products`);
    const response = await axios.get(`${API_BASE_URL}/api/products`, {
      timeout: online ? 10000 : 3000
    });

    console.log('API Debug - Products response:', response.data);
    if (response.data && response.data.length > 0) {
      await cacheProducts(response.data);
    }

    return response.data;
  } catch (error) {
    console.warn('API Debug - Failed to fetch products from API:', error.message);
    console.warn('API Debug - Error details:', error.response?.status, error.response?.data);

    const cached = await getCachedProducts();
    if (cached.length > 0) {
      console.log('API Debug - Using cached products:', cached.length);
      return cached;
    }

    return [];
  }
};

export const getOrdersWithCache = async (token) => {
  const online = isOnline();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: online ? 10000 : 3000
    });
    
    if (response.data) {
      await cacheOrders(response.data);
    }
    
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch orders, trying cache:', error.message);
    
    const cached = await getCachedOrders();
    return cached;
  }
};

export const saveUserWithCache = async (user) => {
  if (user) {
    await cacheUser(user);
  }
};

export const getUserFromCache = async () => {
  return await getCachedUser();
};

export default API_BASE_URL;
