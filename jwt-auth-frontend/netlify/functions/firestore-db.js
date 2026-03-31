/**
 * Firestore Database Manager (Synchronous API)
 * This module replaces local db.json with Firebase Firestore
 * Uses local cache for sync operations, async background sync to Firestore
 */

const fs = require('fs');
const path = require('path');

// Firebase Admin SDK
let admin = null;
let db = null;

// Local cache - loaded at startup, updated on every write
let cache = { users: [], products: [], orders: [] };
const LOCAL_DB_PATH = path.join(__dirname, '../../db.json');

/**
 * Initialize Firestore connection and load initial data
 */
const initializeFirestore = async () => {
  try {
    admin = require('firebase-admin');
    
    // Check if already initialized
    if (admin.apps.length) {
      console.log('Firebase already initialized');
      db = admin.firestore();
      await loadFromFirestore();
      return true;
    }
    
    // Get credentials from environment
    let serviceAccount;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      serviceAccount = require(serviceAccountPath);
    } else if (serviceAccountJson) {
      try {
        serviceAccount = JSON.parse(serviceAccountJson);
      } catch (e) {
        console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', e.message);
        return loadFromLocal();
      }
    } else {
      console.log('Firebase service account not configured');
      return loadFromLocal();
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    console.log('Firebase Firestore connected as primary database');
    
    // Try to load from Firestore first
    await loadFromFirestore();
    return true;
  } catch (error) {
    console.warn('Firebase not available, using local data:', error.message);
    return loadFromLocal();
  }
};

/**
 * Load data from local file (fallback)
 */
const loadFromLocal = () => {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      cache = JSON.parse(raw);
      console.log('Loaded data from local file');
    }
  } catch (e) {
    console.warn('Failed to load local file:', e.message);
    cache = { users: [], products: [], orders: [] };
  }
  return true;
};

/**
 * Load data from Firestore
 */
const loadFromFirestore = async () => {
  if (!db) return false;
  
  try {
    const data = { users: [], products: [], orders: [] };
    
    const usersSnap = await db.collection('users').get();
    usersSnap.docs.forEach(d => data.users.push(d.data()));
    
    const productsSnap = await db.collection('products').get();
    productsSnap.docs.forEach(d => data.products.push(d.data()));
    
    const ordersSnap = await db.collection('orders').get();
    ordersSnap.docs.forEach(d => data.orders.push(d.data()));
    
    cache = data;
    console.log(`Loaded from Firestore: ${data.users.length} users, ${data.products.length} products, ${data.products.length} orders`);
    return true;
  } catch (error) {
    console.warn('Failed to load from Firestore:', error.message);
    return loadFromLocal();
  }
};

/**
 * Save data - updates local cache + local file + async Firestore sync
 * Returns sync (no await) for performance
 */
const saveToAll = (data) => {
  // Update cache immediately
  cache = data;
  
  // Save to local file
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn('Failed to save local file:', e.message);
  }
  
  // Async sync to Firestore (non-blocking)
  if (db) {
    syncToFirestore(data).catch(err => 
      console.warn('Firestore sync failed:', err.message)
    );
  }
};

/**
 * Background sync to Firestore
 */
const syncToFirestore = async (data) => {
  if (!db) return false;
  
  try {
    const batch = db.batch();
    
    // Sync users
    const usersRef = db.collection('users');
    const usersSnap = await usersRef.get();
    usersSnap.docs.forEach(d => batch.delete(d.ref));
    data.users.forEach(user => {
      usersRef.doc(user.id || Date.now().toString()).set(user);
    });
    
    // Sync products
    const productsRef = db.collection('products');
    const productsSnap = await productsRef.get();
    productsSnap.docs.forEach(d => batch.delete(d.ref));
    data.products.forEach(product => {
      productsRef.doc(product.id || Date.now().toString()).set(product);
    });
    
    // Sync orders
    const ordersRef = db.collection('orders');
    const ordersSnap = await ordersRef.get();
    ordersSnap.docs.forEach(d => batch.delete(d.ref));
    data.orders.forEach(order => {
      ordersRef.doc(order.id || Date.now().toString()).set(order);
    });
    
    await batch.commit();
    console.log('Data synced to Firestore');
    return true;
  } catch (error) {
    console.error('Firestore sync error:', error.message);
    return false;
  }
};

// Sync API - returns cached data (synchronous)
const readDb = () => cache;

// Write API - triggers async Firestore sync
const writeDb = (data) => saveToAll(data);

module.exports = {
  initializeFirestore,
  readDb,
  writeDb,
  get db() { return db; }
};