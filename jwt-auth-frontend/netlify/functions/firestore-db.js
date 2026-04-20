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
      "password": "$2b$10$c2X4YVMPVWi.fGTObf5.Gef5jbJKerJIRyrHGg1yDr6JHyBCb26aq",
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
      "password": "$2b$10$c2X4YVMPVWi.fGTObf5.Gef5jbJKerJIRyrHGg1yDr6JHyBCb26aq",
      "role": "user",
      "createdAt": "2026-03-24T10:14:36.506Z"
    },
    {
      "id": "1774347329707",
      "username": "seller",
      "email": "seller@seller.com",
      "password": "$2b$10$c2X4YVMPVWi.fGTObf5.Gef5jbJKerJIRyrHGg1yDr6JHyBCb26aq",
      "role": "user",
      "createdAt": "2026-03-24T10:15:29.707Z"
    },
    {
      "id": "1774349269283",
      "username": "newuser",
      "email": "newuser@test.com",
      "password": "$2b$10$c2X4YVMPVWi.fGTObf5.Gef5jbJKerJIRyrHGg1yDr6JHyBCb26aq",
      "role": "user",
      "createdAt": "2026-03-24T10:47:49.283Z"
    },
    {
      "id": "1774487905169",
      "username": "testlogin",
      "email": "testlogin@test.com",
      "password": "$2b$10$c2X4YVMPVWi.fGTObf5.Gef5jbJKerJIRyrHGg1yDr6JHyBCb26aq",
      "role": "user",
      "createdAt": "2026-03-26T01:18:25.169Z"
    },
    {
      "id": "1774578231396",
      "username": "mingyu",
      "email": "mingyu@gmail.com",
      "password": "$2b$10$c2X4YVMPVWi.fGTObf5.Gef5jbJKerJIRyrHGg1yDr6JHyBCb26aq",
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
      "password": "$2b$10$c2X4YVMPVWi.fGTObf5.Gef5jbJKerJIRyrHGg1yDr6JHyBCb26aq",
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
      "password": "$2b$10$c2X4YVMPVWi.fGTObf5.Gef5jbJKerJIRyrHGg1yDr6JHyBCb26aq",
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
      console.log('Firebase already initialized');
      return true;
    }
    
    // Try multiple paths to find service account
    let serviceAccount = null;
    const possiblePaths = [
      path.join(__dirname, 'service-account.json'),
      path.join(__dirname, '../../service-account.json'),
      path.join(process.cwd(), 'service-account.json'),
    ];
    
    let serviceAccountPath = null;
    for (const p of possiblePaths) {
      try {
        if (fs.existsSync(p)) {
          serviceAccountPath = p;
          break;
        }
      } catch {}
    }
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    }
    
    if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
        serviceAccount = JSON.parse(serviceAccountContent);
        console.log('Loaded service account from:', serviceAccountPath);
      } catch (e) {
        console.log('Failed to load service account file:', e.message);
      }
    }
    
    // Try environment variable as fallback
    if (!serviceAccount) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccountJson) {
        try {
          serviceAccount = JSON.parse(serviceAccountJson);
          console.log('Loaded service account from env');
        } catch (e) {
          console.log('Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
        }
      }
    }
    
    if (!serviceAccount) {
      console.log('No service account found - using embedded data only');
      return false;
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    console.log('Firebase Firestore connected successfully');
    return true;
  } catch (error) {
    console.log('Firebase init failed:', error.message);
    return false;
  }
};

const initializeFirestore = async () => {
  console.log('Initializing database...');
  
  // Try to initialize Firebase first
  const firebaseReady = await initializeFirebase();
  
  if (firebaseReady && db) {
    try {
      // Read from Firestore directly
      const data = { users: [], products: [], orders: [] };
      
      const usersSnap = await db.collection('users').get();
      usersSnap.docs.forEach(d => data.users.push(d.data()));
      console.log('Firestore users count:', data.users.length);
      
      const productsSnap = await db.collection('products').get();
      productsSnap.docs.forEach(d => data.products.push(d.data()));
      console.log('Firestore products count:', data.products.length);
      
      const ordersSnap = await db.collection('orders').get();
      ordersSnap.docs.forEach(d => data.orders.push(d.data()));
      console.log('Firestore orders count:', data.orders.length);
      
      // Use Firestore data if it exists, otherwise fallback to embedded
      if (data.users.length > 0 || data.products.length > 0) {
        cache = data;
        console.log('Using Firestore as primary database');
        return true;
      } else {
        console.log('Firestore is empty - falling back to embedded data');
      }
    } catch (e) {
      console.log('Firestore read error:', e.message);
      console.log('Falling back to embedded data');
    }
  } else {
    console.log('Firebase not connected - using embedded data only');
  }
  
  // Load embedded data as fallback
  loadFromLocal();
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
  
  // Always save to local file first
  try {
    if (LOCAL_DB_PATH) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
      console.log('Saved to local file');
    }
  } catch (e) {
    console.log('Failed to save locally:', e.message);
  }
  
  // Try to sync to Firestore if connected
  if (db) {
    syncToFirestore(data).catch(err => console.log('Firestore sync failed:', err.message));
  }
};

const syncToFirestore = async (data) => {
  if (!db) {
    console.log('Firestore not connected, skipping sync');
    return;
  }
  
  try {
    // Sync users
    if (data.users && data.users.length > 0) {
      const usersRef = db.collection('users');
      for (const user of data.users) {
        await usersRef.doc(user.id).set(user, { merge: true });
      }
      console.log('Synced ' + data.users.length + ' users to Firestore');
    }
    
    // Sync products
    if (data.products && data.products.length > 0) {
      const productsRef = db.collection('products');
      for (const product of data.products) {
        await productsRef.doc(product.id).set(product, { merge: true });
      }
      console.log('Synced ' + data.products.length + ' products to Firestore');
    }
    
    // Sync orders
    if (data.orders && data.orders.length > 0) {
      const ordersRef = db.collection('orders');
      for (const order of data.orders) {
        await ordersRef.doc(order.id).set(order, { merge: true });
      }
      console.log('Synced ' + data.orders.length + ' orders to Firestore');
    }
    
    console.log('Successfully synced to Firestore');
  } catch (e) {
    console.log('Firestore sync error:', e.message);
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