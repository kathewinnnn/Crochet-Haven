/**
 * Firebase Backup Utility
 * This module provides backup/restore functionality using Firebase Firestore
 * 
 * Usage:
 * - Initialize with Firebase config
 * - Call syncToFirebase() to backup local db.json to Firestore
 * - Call syncFromFirebase() to restore data from Firestore to local db.json
 */

const fs = require('fs');
const path = require('path');

// Firebase Admin SDK - initialize in your server
let admin = null;
let db = null;

/**
 * Initialize Firebase Admin SDK
 * Call this once at server startup with your service account credentials
 * Supports two formats:
 * 1. File path: FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
 * 2. Inline JSON: FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
 */
const initializeFirebase = () => {
  try {
    admin = require('firebase-admin');
    
    // Check if already initialized
    if (admin.apps.length) {
      console.log('Firebase already initialized');
      db = admin.firestore();
      return true;
    }
    
    // Try to get credentials from environment
    let serviceAccount;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      // Load from file
      serviceAccount = require(serviceAccountPath);
    } else if (serviceAccountJson) {
      // Parse inline JSON
      try {
        serviceAccount = JSON.parse(serviceAccountJson);
      } catch (e) {
        console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', e.message);
        return false;
      }
    } else {
      console.log('Firebase service account not configured');
      return false;
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    console.log('Firebase Firestore initialized successfully');
    return true;
  } catch (error) {
    console.warn('Firebase not available:', error.message);
    return false;
  }
};

/**
 * Sync local db.json to Firebase Firestore
 * @param {string} localDbPath - Path to local db.json file
 */
const syncToFirebase = async (localDbPath) => {
  if (!db) {
    console.log('Firebase not initialized, skipping backup');
    return false;
  }

  try {
    const rawData = fs.readFileSync(localDbPath, 'utf8');
    const data = JSON.parse(rawData);

    // Backup each collection
    const batch = db.batch();

    // Backup users
    if (data.users && data.users.length > 0) {
      const usersRef = db.collection('backup').doc('data').collection('users');
      // Clear existing and write new
      const snapshot = await usersRef.get();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      data.users.forEach(user => {
        usersRef.doc(user.id || Date.now().toString()).set(user);
      });
    }

    // Backup products
    if (data.products && data.products.length > 0) {
      const productsRef = db.collection('backup').doc('data').collection('products');
      const snapshot = await productsRef.get();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      data.products.forEach(product => {
        productsRef.doc(product.id || Date.now().toString()).set(product);
      });
    }

    // Backup orders
    if (data.orders && data.orders.length > 0) {
      const ordersRef = db.collection('backup').doc('data').collection('orders');
      const snapshot = await ordersRef.get();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      data.orders.forEach(order => {
        ordersRef.doc(order.id || Date.now().toString()).set(order);
      });
    }

    // Set metadata
    db.collection('backup').doc('metadata').set({
      lastBackup: admin.firestore.FieldValue.serverTimestamp(),
      version: '1.0'
    });

    await batch.commit();
    console.log('Successfully backed up to Firebase Firestore');
    return true;
  } catch (error) {
    console.error('Error backing up to Firebase:', error.message);
    return false;
  }
};

/**
 * Restore data from Firebase Firestore to local db.json
 * @param {string} localDbPath - Path to local db.json file
 */
const syncFromFirebase = async (localDbPath) => {
  if (!db) {
    console.log('Firebase not initialized, skipping restore');
    return false;
  }

  try {
    const data = { users: [], products: [], orders: [] };

    // Restore users
    const usersSnapshot = await db.collection('backup').doc('data').collection('users').get();
    usersSnapshot.docs.forEach(doc => {
      data.users.push(doc.data());
    });

    // Restore products
    const productsSnapshot = await db.collection('backup').doc('data').collection('products').get();
    productsSnapshot.docs.forEach(doc => {
      data.products.push(doc.data());
    });

    // Restore orders
    const ordersSnapshot = await db.collection('backup').doc('data').collection('orders').get();
    ordersSnapshot.docs.forEach(doc => {
      data.orders.push(doc.data());
    });

    // Write to local file
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2));
    console.log('Successfully restored from Firebase Firestore');
    return true;
  } catch (error) {
    console.error('Error restoring from Firebase:', error.message);
    return false;
  }
};

/**
 * Get backup status from Firebase
 */
const getBackupStatus = async () => {
  if (!db) {
    return { initialized: false };
  }

  try {
    const doc = await db.collection('backup').doc('metadata').get();
    return {
      initialized: true,
      lastBackup: doc.exists ? doc.data().lastBackup?.toDate() : null
    };
  } catch (error) {
    return { initialized: true, error: error.message };
  }
};

module.exports = {
  initializeFirebase,
  syncToFirebase,
  syncFromFirebase,
  getBackupStatus,
  db: null // Will be set after initialization
};