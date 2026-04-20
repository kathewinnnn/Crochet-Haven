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

// Embedded initial data for Netlify - simple test data
const EMBEDDED_DATA = {
  "users": [
    {
      "id": "1",
      "username": "testuser",
      "email": "test@test.com",
      "password": "$2b$10$vGMsWNi8xAIN.NhY.wiIceujvYh0.o2e7/WF.6est0paGNktUB93q",
      "role": "user",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "fullName": "Test User"
    }
  ],
  "products": [
    { "id": "1", "name": "Crochet Keychain", "description": "Handmade crochet keychain", "price": "50", "category": "Accessories", "images": ["/img/keychain/1.jpg"] },
    { "id": "2", "name": "Crochet Tote Bags", "description": "Stylish tote bag", "price": "200", "category": "Bags", "images": ["/img/bag/1.jpg"] },
    { "id": "3", "name": "Crochet Scarf", "description": "Warm scarf", "price": "150", "category": "Clothing", "images": ["/img/scarf/1.jpg"] },
    { "id": "4", "name": "Crochet Coasters", "description": "Set of 4 coasters", "price": "200", "category": "Home Decor", "images": ["/img/coaster/1.jpg"] },
    { "id": "5", "name": "Crochet Headband", "description": "Comfortable headband", "price": "50", "category": "Accessories", "images": ["/img/headband/1.jpg"] },
    { "id": "6", "name": "Crochet Bouquet", "description": "Beautiful bouquet", "price": "200", "category": "Accessories", "images": ["/img/flower/1.jpg"] }
  ],
  "orders": []
};

// Local cache
let cache = { users: [], products: [], orders: [] };

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

const initializeFirestore = async () => {
  console.log('Loading data from local db.json at:', LOCAL_DB_PATH);
  loadFromLocal();
  
  const firebaseReady = await initializeFirebase();
  
  if (firebaseReady && db) {
    firestoreInitialized = true;
    console.log('Attempting to load from Firestore...');
    await loadFromFirestore();
  } else {
    console.log('Using local db.json only');
  }
  
  return true;
};

const loadFromLocal = () => {
  try {
    if (LOCAL_DB_PATH && fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      cache = JSON.parse(raw);
      console.log('Loaded data from local file. Users:', cache.users?.length || 0);
    } else {
      console.log('Using embedded data');
      cache = { ...EMBEDDED_DATA };
    }
  } catch (e) {
    console.warn('Failed to load local file:', e.message, '- using embedded data');
    cache = { ...EMBEDDED_DATA };
  }
  return true;
};

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

const saveToAll = (data) => {
  cache = data;
  
  try {
    if (LOCAL_DB_PATH && fs.existsSync(path.dirname(LOCAL_DB_PATH))) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.warn('Failed to save local file:', e.message);
  }
  
  if (db) {
    syncToFirestore(data).catch(err => 
      console.warn('Firestore sync failed:', err.message)
    );
  }
};

const syncToFirestore = async (data) => {
  if (!db) return false;
  
  try {
    const batch = db.batch();
    
    const usersRef = db.collection('users');
    const usersSnap = await usersRef.get();
    usersSnap.docs.forEach(d => batch.delete(d.ref));
    data.users.forEach(user => {
      usersRef.doc(user.id || Date.now().toString()).set(user);
    });
    
    const productsRef = db.collection('products');
    const productsSnap = await productsRef.get();
    productsSnap.docs.forEach(d => batch.delete(d.ref));
    data.products.forEach(product => {
      productsRef.doc(product.id || Date.now().toString()).set(product);
    });
    
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

const readDb = () => cache;
const writeDb = (data) => saveToAll(data);

module.exports = {
  initializeFirestore,
  readDb,
  writeDb,
  get db() { return db; }
};