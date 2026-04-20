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
// Includes all existing users, products, and orders from the local db.json
const EMBEDDED_DATA = {
  "users": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@admin.com",
      "password": "$2b$10$JtwZ8qpYXLcx9zxDrmJdbufrB6pJ0tFlftIJiOW4wYjhtfO1K1Cz6",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "name": "Admin",
      "phone": "0912-345-6789",
      "bio": "Store owner",
      "storeName": "Crochet Haven",
      "location": "Manila",
      "avatar": null
    },
    {
      "id": "1774347276506",
      "username": "testuser",
      "email": "test@test.com",
      "password": "$2b$10$TcDE5YN9JOs3ELzMwXGHq.cMJPaeaebMzMTWu6t7NmmcLIw7FoLXq",
      "role": "user",
      "createdAt": "2026-03-24T10:14:36.506Z"
    },
    {
      "id": "1774347329707",
      "username": "seller",
      "email": "seller@seller.com",
      "password": "$2b$10$JMJtGfqNK4df4fMEz9XEiORW0CTt7kpRPLxSi23JcDOER.9PKuGYO",
      "role": "user",
      "createdAt": "2026-03-24T10:15:29.707Z"
    },
    {
      "id": "1774349269283",
      "username": "newuser",
      "email": "newuser@test.com",
      "password": "$2b$10$X6.xq7tyfr8sjfssWtmsGOUVds.qnfv31EKWnGa0QHuwGF3IienQO",
      "role": "user",
      "createdAt": "2026-03-24T10:47:49.283Z"
    },
    {
      "id": "1774487905169",
      "username": "testlogin",
      "email": "testlogin@test.com",
      "password": "$2b$10$KyWlUTz56kzbVTeW8GKAMe2i61B5H9JHJ2Uu4DzwQtxVWrdM1Rrbq",
      "role": "user",
      "createdAt": "2026-03-26T01:18:25.169Z"
    },
    {
      "id": "1774578231396",
      "username": "mingyu",
      "email": "mingyu@gmail.com",
      "password": "$2b$10$j4z5LHxevZgxjnkshzb1MexCvzbEYoGVOTCKRC4DytyvAMywKInLy",
      "role": "user",
      "createdAt": "2026-03-27T02:23:51.396Z",
      "fullName": "Mingyu Kim",
      "phone": "09123456789",
      "address": "South Korea"
    },
    {
      "id": "1774693960548",
      "username": "katherine",
      "email": "itsmemae45@gmail.com",
      "password": "$2b$10$qeEEpD2FVkPhxCUfhNJIMe0kuaTfKU83lgi37KOknKD0WZE7H6d/K",
      "role": "user",
      "createdAt": "2026-03-28T10:32:40.548Z",
      "fullName": "Katherine Mae V. Guzman",
      "phone": "09629556678",
      "address": "Nanangduan, Pilar, Abra"
    },
    {
      "id": "1774743934759",
      "username": "wonwoo",
      "email": "wonwoo@gmail.com",
      "password": "$2b$10$I03tPQKInzK.7MkF3UBggegLSqy79dm1Gz1GQQnej8690eGZe/T4e",
      "role": "user",
      "createdAt": "2026-03-29T00:25:34.759Z",
      "fullName": "Wonwoo Jeon",
      "phone": "09112233445",
      "address": "Urijib, South Korea"
    }
  ],
  "products": [
    {
      "id": "1",
      "name": "Crochet Keychain",
      "description": "Handmade crochet keychain with cute design",
      "price": "50",
      "category": "Accessories & Bouquet",
      "images": ["/img/keychain/1.jpg", "/img/keychain/2.jpg", "/img/keychain/3.jpg", "/img/keychain/4.jpg", "/img/keychain/5.jpg", "/img/keychain/6.jpg", "/img/keychain/7.jpg", "/img/keychain/8.jpg", "/img/keychain/9.jpg", "/img/keychain/10.jpg", "/img/keychain/11.jpg", "/img/keychain/12.jpg"]
    },
    {
      "id": "2",
      "name": "Crochet Tote Bags",
      "description": "Stylish crochet tote bag for everyday use",
      "price": "200",
      "category": "Bags",
      "images": ["/img/bag/1.jpg", "/img/bag/2.jpg", "/img/bag/3.jpg", "/img/bag/4.jpg", "/img/bag/5.jpg", "/img/bag/6.jpg"]
    },
    {
      "id": "3",
      "name": "Crochet Scarf",
      "description": "Warm and cozy crochet scarf",
      "price": "150",
      "category": "Clothing",
      "images": ["/img/scarf/1.jpg", "/img/scarf/2.jpg", "/img/scarf/3.jpg", "/img/scarf/4.jpg", "/img/scarf/5.jpg"]
    },
    {
      "id": "4",
      "name": "Crochet Coasters",
      "description": "Set of 4 decorative crochet coasters",
      "price": "200",
      "category": "Home Decor",
      "images": ["/img/coaster/1.jpg", "/img/coaster/2.jpg", "/img/coaster/3.jpg", "/img/coaster/4.jpg", "/img/coaster/5.jpg", "/img/coaster/6.jpg"]
    },
    {
      "id": "5",
      "name": "Crochet Headband & Bandana",
      "description": "Lightweight crochet headbands designed for comfort and a cute, casual look",
      "price": "50",
      "category": "Accessories & Bouquet",
      "images": ["/img/headband/1.jpg", "/img/headband/2.jpg", "/img/headband/3.jpg", "/img/headband/4.jpg", "/img/headband/5.jpg", "/img/headband/6.jpg", "/img/headband/7.jpg", "/img/headband/8.jpg", "/img/headband/9.jpg"]
    },
    {
      "id": "6",
      "name": "Crochet Bouquet",
      "description": "A handmade crochet bouquet that lasts forever—beautiful, meaningful, and perfect for any occasion",
      "price": "200",
      "category": "Accessories & Bouquet",
      "images": ["/img/flower/1.jpg", "/img/flower/2.jpg", "/img/flower/3.jpg", "/img/flower/4.jpg", "/img/flower/5.jpg", "/img/flower/6.jpg", "/img/flower/7.jpg", "/img/flower/8.jpg", "/img/flower/9.jpg", "/img/flower/10.jpg", "/img/flower/11.jpg"]
    }
  ],
  "orders": [
    {
      "id": "1774579927803",
      "userId": "1774578231396",
      "username": "mingyu",
      "customer": { "fullName": "Mingyu Kim", "email": "mingyu@gmail.com", "phone": "09123456789", "address": "Urijib, South Korea", "city": "Sout Korea", "zipCode": "1234", "paymentMethod": "cod", "gcashNumber": "", "gcashAccountName": "", "gcashPassword": "", "paymayaNumber": "", "paymayaAccountName": "", "paymayaPassword": "", "cardNumber": "", "cardExpiry": "", "cardCvv": "", "cardName": "", "orderNote": "" },
      "paymentMethod": "cod",
      "items": [{ "id": "4", "name": "Crochet Coasters", "price": 200, "quantity": 1, "selectedImage": "/img/coaster/5.jpg" }],
      "total": 200,
      "createdAt": "2026-03-27T02:52:07.803Z",
      "status": "Cancelled"
    },
    {
      "id": "1774695388007",
      "userId": "1774693960548",
      "username": "katherine",
      "customer": { "fullName": "Katherine Mae V. Guzman", "email": "itsmemae45@gmail.com", "phone": "09629556678", "address": "Nanangduan, Pilar, Abra", "city": "Abra", "zipCode": "2812", "paymentMethod": "cod", "gcashNumber": "", "gcashAccountName": "", "gcashPassword": "", "paymayaNumber": "", "paymayaAccountName": "", "paymayaPassword": "", "cardNumber": "", "cardExpiry": "", "cardCvv": "", "cardName": "", "orderNote": "" },
      "paymentMethod": "cod",
      "items": [{ "id": "5", "name": "Crochet Headband & Bandana", "price": 50, "quantity": 1, "selectedImage": "/img/headband/1.jpg" }],
      "total": 50,
      "createdAt": "2026-03-28T10:56:28.007Z",
      "status": "Delivered"
    },
    {
      "id": "1774695452496",
      "userId": "1774578231396",
      "username": "mingyu",
      "customer": { "fullName": "Mingyu Kim", "email": "mingyu@gmail.com", "phone": "09123456789", "address": "Urijib, South Korea", "city": "South Korea", "zipCode": "1234", "paymentMethod": "gcash", "gcashNumber": "09629556678", "gcashAccountName": "Mingyu Kim", "gcashPassword": "123456", "paymayaNumber": "", "paymayaAccountName": "", "paymayaPassword": "", "cardNumber": "", "cardExpiry": "", "cardCvv": "", "cardName": "", "orderNote": "" },
      "paymentMethod": "gcash",
      "items": [{ "id": "6", "name": "Crochet Bouquet", "price": 200, "quantity": 1, "selectedImage": "/img/flower/1.jpg" }],
      "total": 200,
      "createdAt": "2026-03-28T10:57:32.496Z",
      "status": "Shipped"
    },
    {
      "id": "1774744076697",
      "userId": "1774743934759",
      "username": "wonwoo",
      "customer": { "fullName": "Wonwoo Jeon", "email": "wonwoo@gmail.com", "phone": "09112233445", "address": "Urijib, South Korea", "city": "South Korea", "zipCode": "1234", "paymentMethod": "cod", "gcashNumber": "", "gcashAccountName": "", "gcashPassword": "", "paymayaNumber": "", "paymayaAccountName": "", "paymayaPassword": "", "cardNumber": "", "cardExpiry": "", "cardCvv": "", "cardName": "", "orderNote": "" },
      "paymentMethod": "cod",
      "items": [{ "id": "1", "name": "Crochet Keychain", "price": 50, "quantity": 1, "selectedImage": "/img/keychain/4.jpg" }],
      "total": 50,
      "createdAt": "2026-03-29T00:27:56.697Z",
      "status": "Processing"
    }
  ]
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