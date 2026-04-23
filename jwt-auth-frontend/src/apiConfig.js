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
  return 'http://localhost:5000';
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
    const url = `${API_BASE_URL}/api/orders`;
    console.log('API Debug - Fetching orders from:', url, 'Token provided:', !!token);

    const response = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: online ? 10000 : 3000
    });

    console.log('API Debug - Orders response status:', response.status);
    console.log('API Debug - Orders response data:', response.data);

    if (response.data) {
      await cacheOrders(response.data);
    }

    return response.data;
  } catch (error) {
    console.warn('API Debug - Failed to fetch orders from API:', error.message);
    console.warn('API Debug - Error response:', error.response?.status, error.response?.statusText);
    console.warn('API Debug - Error data:', error.response?.data?.substring(0, 200));

    const cached = await getCachedOrders();
    if (cached.length > 0) {
      console.log('API Debug - Using cached orders:', cached.length);
      return cached;
    }

    return [];
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

// Cart API functions
export const saveCartToServer = async (cartData) => {
  try {
    console.log('API Debug - Saving cart to server:', cartData.length, 'items');
    const token = localStorage.getItem('token') || localStorage.getItem('ch_token');
    const response = await axios.post(`${API_BASE_URL}/api/cart`, cartData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: 10000
    });
    console.log('API Debug - Cart saved successfully');
    return response.data;
  } catch (error) {
    console.warn('API Debug - Failed to save cart to server:', error.message);
    throw error;
  }
};

export const loadCartFromServer = async () => {
  try {
    console.log('API Debug - Loading cart from server');
    const token = localStorage.getItem('token') || localStorage.getItem('ch_token');
    const response = await axios.get(`${API_BASE_URL}/api/cart`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: 10000
    });
    console.log('API Debug - Cart loaded from server:', response.data.length, 'items');
    return response.data;
  } catch (error) {
    console.warn('API Debug - Failed to load cart from server:', error.message);
    return null;
  }
};

// Address API functions
export const saveAddressesToServer = async (addressesData) => {
  try {
    console.log('API Debug - Saving addresses to server:', addressesData.length, 'addresses');
    const token = localStorage.getItem('token') || localStorage.getItem('ch_token');
    const response = await axios.post(`${API_BASE_URL}/api/addresses`, addressesData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: 10000
    });
    console.log('API Debug - Addresses saved successfully');
    return response.data;
  } catch (error) {
    console.warn('API Debug - Failed to save addresses to server:', error.message);
    throw error;
  }
};

export const loadAddressesFromServer = async () => {
  try {
    console.log('API Debug - Loading addresses from server');
    const token = localStorage.getItem('token') || localStorage.getItem('ch_token');
    const response = await axios.get(`${API_BASE_URL}/api/addresses`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: 10000
    });
    console.log('API Debug - Addresses loaded from server:', response.data.length, 'addresses');
    return response.data;
  } catch (error) {
    console.warn('API Debug - Failed to load addresses from server:', error.message);
    return null;
  }
};

export default API_BASE_URL;
