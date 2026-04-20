/**
 * Firestore Database Manager (Synchronous API)
 * Uses Firebase Firestore as primary database with local cache
 */

const fs = require('fs');
const path = require('path');

// Firebase Admin SDK
let admin = null;
let db = null;
let firestoreInitialized = false;

// Local cache - loaded at startup, updated on every write
let cache = { users: [], products: [], orders: [] };

// Correct path for Netlify deployment
const getDbPath = () => {
  const possiblePaths = [
    path.join(__dirname, 'db.json'),                      // Same directory as function (netlify/functions/db.json)
    path.join(__dirname, '../../db.json'),                // From jwt-auth-frontend root (for local dev)
    path.join(__dirname, '../../jwt-auth-frontend/db.json'), // From project root
    path.join(process.cwd(), 'db.json'),                 // Current working directory
    path.join(process.cwd(), 'jwt-auth-frontend/db.json'), // CWD with base
    path.join(__dirname, '../db.json'),                  // One directory up
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