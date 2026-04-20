/**
 * Firestore Database Manager
 * Uses Firebase Firestore as primary database with local fallback
 */

const fs = require('fs');
const path = require('path');

let admin = null;
let db = null;

// EMBEDDED DATA - All users from local db.json
// Password reset to password123 for all users
const EMBEDDED_DATA = {
  "users": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@admin.com",
      "password": "$2b$10$f46hq6M2kvF6Q0wxpFv3/uUgBF5phMj09ygg4Apn55518g/Tb6gVK",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "name": "Admin",
      "phone": "0912-345-6789",
      "bio": "Store owner",
      "storeName": "Crochet Haven",
      "location": "Manila"
    },
    {
      "id": "1774347276506",
      "username": "testuser",
      "email": "test@test.com",
      "password": "$2b$10$f46hq6M2kvF6Q0wxpFv3/uUgBF5phMj09ygg4Apn55518g/Tb6gVK",
      "role": "user",
      "createdAt": "2026-03-24T10:14:36.506Z"
    },
    {
      "id": "1774347329707",
      "username": "seller",
      "email": "seller@seller.com",
      "password": "$2b$10$f46hq6M2kvF6Q0wxpFv3/uUgBF5phMj09ygg4Apn55518g/Tb6gVK",
      "role": "user",
      "createdAt": "2026-03-24T10:15:29.707Z"
    },
    {
      "id": "1774349269283",
      "username": "newuser",
      "email": "newuser@test.com",
      "password": "$2b$10$f46hq6M2kvF6Q0wxpFv3/uUgBF5phMj09ygg4Apn55518g/Tb6gVK",
      "role": "user",
      "createdAt": "2026-03-24T10:47:49.283Z"
    },
    {
      "id": "1774487905169",
      "username": "testlogin",
      "email": "testlogin@test.com",
      "password": "$2b$10$f46hq6M2kvF6Q0wxpFv3/uUgBF5phMj09ygg4Apn55518g/Tb6gVK",
      "role": "user",
      "createdAt": "2026-03-26T01:18:25.169Z"
    },
    {
      "id": "1774578231396",
      "username": "mingyu",
      "email": "mingyu@gmail.com",
      "password": "$2b$10$f46hq6M2kvF6Q0wxpFv3/uUgBF5phMj09ygg4Apn55518g/Tb6gVK",
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
      "password": "$2b$10$f46hq6M2kvF6Q0wxpFv3/uUgBF5phMj09ygg4Apn55518g/Tb6gVK",
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
      "password": "$2b$10$f46hq6M2kvF6Q0wxpFv3/uUgBF5phMj09ygg4Apn55518g/Tb6gVK",
      "role": "user",
      "createdAt": "2026-03-29T00:25:34.759Z",
      "fullName": "Wonwoo Jeon",
      "phone": "09112233445",
      "address": "South Korea"
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

let cache = { users: [], products: [], orders: [] };

const getDbPath = () => {
  const possiblePaths = [
    path.join(__dirname, 'db.json'),
    path.join(__dirname, '../../public/db.json'),
    path.join(__dirname, '../../build/db.json'),
    path.join(process.cwd(), 'public/db.json'),
    path.join(process.cwd(), 'build/db.json'),
  ];
  
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        console.log('Found db.json at:', p);
        return p;
      }
    } catch {}
  }
  return null;
};

const LOCAL_DB_PATH = getDbPath();

const initializeFirebase = async () => {
  try {
    admin = require('firebase-admin');
    
    if (admin.apps.length) {
      db = admin.firestore();
      return true;
    }
    
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountJson) {
      console.log('No FIREBASE_SERVICE_ACCOUNT - using embedded data only');
      return false;
    }
    
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    console.log('Firebase connected');
    return true;
  } catch (error) {
    console.log('Firebase init failed:', error.message);
    return false;
  }
};

const initializeFirestore = async () => {
  console.log('Initializing database...');
  loadFromLocal();
  
  const firebaseReady = await initializeFirebase();
  
  if (firebaseReady && db) {
    try {
      const data = { users: [], products: [], orders: [] };
      
      const usersSnap = await db.collection('users').get();
      usersSnap.docs.forEach(d => data.users.push(d.data()));
      
      const productsSnap = await db.collection('products').get();
      productsSnap.docs.forEach(d => data.products.push(d.data()));
      
      const ordersSnap = await db.collection('orders').get();
      ordersSnap.docs.forEach(d => data.orders.push(d.data()));
      
      cache = data;
      console.log('Loaded from Firestore: ' + data.users.length + ' users');
    } catch (e) {
      console.log('Using embedded data');
    }
  }
  
  return true;
};

const loadFromLocal = () => {
  try {
    if (LOCAL_DB_PATH && fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      cache = JSON.parse(raw);
      console.log('Loaded from local: ' + (cache.users?.length || 0) + ' users');
    } else {
      console.log('Using embedded data');
      cache = { ...EMBEDDED_DATA };
    }
  } catch (e) {
    console.log('Using embedded data');
    cache = { ...EMBEDDED_DATA };
  }
  return true;
};

const saveToAll = (data) => {
  cache = data;
  
  if (db) {
    syncToFirestore(data).catch(() => {});
  }
};

const syncToFirestore = async (data) => {
  if (!db) return;
  
  try {
    const batch = db.batch();
    
    const usersRef = db.collection('users');
    const usersSnap = await usersRef.get();
    usersSnap.docs.forEach(d => batch.delete(d.ref));
    data.users.forEach(user => {
      usersRef.doc(user.id).set(user);
    });
    
    const productsRef = db.collection('products');
    const productsSnap = await productsRef.get();
    productsSnap.docs.forEach(d => batch.delete(d.ref));
    data.products.forEach(product => {
      productsRef.doc(product.id).set(product);
    });
    
    await batch.commit();
    console.log('Synced to Firestore');
  } catch (e) {
    console.log('Firestore sync failed');
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