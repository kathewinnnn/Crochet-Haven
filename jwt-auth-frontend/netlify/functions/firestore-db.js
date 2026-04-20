/**
 * Firestore Database Manager (Synchronous API)
 * Uses Firebase Firestore as primary database with local cache
 * Now with embedded data for Netlify deployment
 */

const fs = require('fs');
const path = require('path');

// Firebase Admin SDK
let admin = null;
let db = null;
let firestoreInitialized = false;

// Embedded initial data for Netlify - this is used when db.json file is not available
const EMBEDDED_DATA = {
  "users": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@admin.com",
      "password": "$2b$10$QQg0KErxtA9nJ4yVCH.HBOEwH.RbroYM3otlARXoHagJcIT/T5A.i",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "fullName": "Admin",
      "phone": "0912-345-6789",
      "address": ""
    }
  ],
  "products": [],
  "orders": []
};

// Local cache - loaded at startup, updated on every write
let cache = { users: [], products: [], orders: [] };

// Correct path for Netlify deployment - check multiple locations
const getDbPath = () => {
  const possiblePaths = [
    path.join(__dirname, 'db.json'),
    path.join(__dirname, '../../public/db.json'),
    path.join(__dirname, '../../build/db.json'),
    path.join(process.cwd(), 'public/db.json'),
    path.join(process.cwd(), 'build/db.json'),
    path.join(process.cwd(), 'db.json'),
  ];
  
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        console.log('Found db.json at:', p);
        return p;
      }
    } catch {}
  }
  
  console.log('Warning: db.json not found, using embedded data');
  return null;
};

const LOCAL_DB_PATH = getDbPath();

const initializeFirebase = async () => {
  try {
    admin = require('firebase-admin');
    
    if (admin.apps.length) {
      console.log('Firebase already initialized');
      db = admin.firestore();
      return true;
    }
    
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountJson) {
      console.log('No FIREBASE_SERVICE_ACCOUNT env var - using local db.json only');
      return false;
    }
    
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    console.log('Firebase Firestore connected successfully');
    return true;
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    return false;
  }
};

/**
 * Initialize - load from local file first, then try Firestore
 */
const initializeFirestore = async () => {
  console.log('Loading data from local db.json at:', LOCAL_DB_PATH);
  loadFromLocal();
  
  const firebaseReady = await initializeFirebase();
  
  if (firebaseReady && db) {
    firestoreInitialized = true;
    console.log('Attempting to load from Firestore...');
    await loadFromFirestore();
  } else {
    console.log('Using local db.json only (no persistence)');
  }
  
  return true;
};

/**
 * Load data from local file or use embedded data
 */
const loadFromLocal = () => {
  try {
    if (LOCAL_DB_PATH && fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      cache = JSON.parse(raw);
      console.log('Loaded data from local file. Users:', cache.users?.length || 0);
    } else if (LOCAL_DB_PATH) {
      console.log('db.json not found at:', LOCAL_DB_PATH, '- using embedded data');
      cache = { ...EMBEDDED_DATA };
    } else {
      console.log('No db.json path - using embedded data');
      cache = { ...EMBEDDED_DATA };
    }
  } catch (e) {
    console.warn('Failed to load local file:', e.message, '- using embedded data');
    cache = { ...EMBEDDED_DATA };
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