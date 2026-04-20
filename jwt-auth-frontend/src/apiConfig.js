import { getCachedProducts, cacheProducts, getCachedOrders, cacheOrders, getCachedUser, cacheUser, isOnline } from './indexedDB';
import axios from 'axios';

const getApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  
  return '';
};

const buildEndpoints = (baseUrl) => ({
  AUTH: `${baseUrl}/api/auth`,
  PRODUCTS: `${baseUrl}/products`,
  ORDERS: `${baseUrl}/orders`,
});

export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = buildEndpoints(API_BASE_URL);

const fetchWithOfflineSupport = async (url, options = {}) => {
  const online = isOnline();
  
  try {
    const response = await axios({
      url,
      ...options,
      timeout: online ? 10000 : 3000
    });
    return response;
  } catch (error) {
    if (!online || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.log('Offline - using cached data');
      throw new Error('OFFLINE');
    }
    throw error;
  }
};

export const getProductsWithCache = async () => {
  const online = isOnline();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      timeout: online ? 10000 : 3000
    });
    
    if (response.data && response.data.length > 0) {
      await cacheProducts(response.data);
    }
    
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch products, trying cache:', error.message);
    
    const cached = await getCachedProducts();
    if (cached.length > 0) {
      console.log('Using cached products:', cached.length);
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

export { isOnline };

export default API_BASE_URL;
