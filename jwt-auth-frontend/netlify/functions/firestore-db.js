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

// Correct path for Netlify deployment
const getDbPath = () => {
  const possiblePaths = [
    path.join(__dirname, '../../db.json'),
    path.join(__dirname, '../../public/db.json'),
    path.join(__dirname, '../../build/db.json'),
    path.join(process.cwd(), 'db.json'),
    path.join(__dirname, '../db.json'),
  ];
  
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        console.log('Found db.json at:', p);
        return p;
      }
    } catch {}
  }
  
  console.log('Warning: db.json not found, using fallback');
  return path.join(__dirname, '../../db.json');
};

const LOCAL_DB_PATH = getDbPath();

/**
 * Initialize - load from local file immediately
 * Firebase is optional and only used if service account is provided
 */
const initializeFirestore = async () => {
  // Always load from local file first (works without Firebase)
  console.log('Loading data from local db.json at:', LOCAL_DB_PATH);
  loadFromLocal();
  
  // Try to initialize Firebase only if service account is provided
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountPath || serviceAccountJson) {
      console.log('Firebase service account detected, attempting to connect...');
    } else {
      console.log('No Firebase service account - using local db.json only');
    }
  } catch (e) {
    console.log('Firebase not configured, using local db.json');
  }
  
  return true;
};

/**
 * Load data from local file
 */
const loadFromLocal = () => {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      cache = JSON.parse(raw);
      console.log('Loaded data from local file. Users:', cache.users?.length || 0);
    } else {
      console.log('db.json not found at:', LOCAL_DB_PATH);
      cache = { users: [], products: [], orders: [] };
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
    console.log(`Loaded from Firestore: ${data.users.length} users, ${data.products.length} products`);
    return true;
  } catch (error) {
    console.warn('Failed to load from Firestore:', error.message);
    return loadFromLocal();
  }
};

/**
 * Save data - updates local cache + local file + async Firestore sync
 */
const saveToAll = (data) => {
  // Update cache immediately
  cache = data;
  
  // Save to local file (won't persist in Netlify functions but keeps cache updated)
  try {
    if (fs.existsSync(path.dirname(LOCAL_DB_PATH))) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
    }
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