const DB_NAME = 'crochet-haven-db';
const DB_VERSION = 1;
const STORES = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  USERS: 'users',
  CART: 'cart',
  SETTINGS: 'settings'
};

let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      if (!database.objectStoreNames.contains(STORES.PRODUCTS)) {
        database.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.ORDERS)) {
        database.createObjectStore(STORES.ORDERS, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.USERS)) {
        database.createObjectStore(STORES.USERS, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.CART)) {
        database.createObjectStore(STORES.CART, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
        database.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };
  });
};

export const cacheProducts = async (products) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.PRODUCTS, 'readwrite');
    const store = tx.objectStore(STORES.PRODUCTS);
    
    products.forEach(product => {
      store.put(product);
    });
    
    store.put({ id: '_lastUpdated', lastUpdated: new Date().toISOString() });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error caching products:', error);
    return false;
  }
};

export const getCachedProducts = async () => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.PRODUCTS, 'readonly');
    const store = tx.objectStore(STORES.PRODUCTS);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results = request.result.filter(p => p.id !== '_lastUpdated');
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached products:', error);
    return [];
  }
};

export const getCacheTimestamp = async () => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.PRODUCTS, 'readonly');
    const store = tx.objectStore(STORES.PRODUCTS);
    const request = store.get('_lastUpdated');
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.lastUpdated);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    return null;
  }
};

export const cacheOrders = async (orders) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.ORDERS, 'readwrite');
    const store = tx.objectStore(STORES.ORDERS);
    
    orders.forEach(order => {
      store.put(order);
    });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error caching orders:', error);
    return false;
  }
};

export const getCachedOrders = async () => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.ORDERS, 'readonly');
    const store = tx.objectStore(STORES.ORDERS);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached orders:', error);
    return [];
  }
};

export const cacheUser = async (user) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.USERS, 'readwrite');
    const store = tx.objectStore(STORES.USERS);
    store.put(user);
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error caching user:', error);
    return false;
  }
};

export const getCachedUser = async () => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.USERS, 'readonly');
    const store = tx.objectStore(STORES.USERS);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result.length > 0) {
          resolve(request.result[0]);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached user:', error);
    return null;
  }
};

export const cacheCart = async (items) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.CART, 'readwrite');
    const store = tx.objectStore(STORES.CART);
    
    store.clear();
    items.forEach(item => {
      store.put(item);
    });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error caching cart:', error);
    return false;
  }
};

export const getCachedCart = async () => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.CART, 'readonly');
    const store = tx.objectStore(STORES.CART);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached cart:', error);
    return [];
  }
};

export const saveSetting = async (key, value) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.SETTINGS, 'readwrite');
    const store = tx.objectStore(STORES.SETTINGS);
    store.put({ key, value });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error saving setting:', error);
    return false;
  }
};

export const getSetting = async (key) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORES.SETTINGS, 'readonly');
    const store = tx.objectStore(STORES.SETTINGS);
    const request = store.get(key);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.value);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting setting:', error);
    return null;
  }
};

export const isOnline = () => {
  return navigator.onLine;
};

export default {
  cacheProducts,
  getCachedProducts,
  getCacheTimestamp,
  cacheOrders,
  getCachedOrders,
  cacheUser,
  getCachedUser,
  cacheCart,
  getCachedCart,
  saveSetting,
  getSetting,
  isOnline,
  STORES
};