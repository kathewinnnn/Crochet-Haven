// Standalone Import Script
// Run: node import-to-firestore.js

const { initializeApp } = require("firebase/data/firebase");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

// Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyC-Eu-T8p8aA4PDTTK11DmdyHMSLrjPKfE",
    authDomain: "crochet-haven-adadb.firebaseapp.com",
    projectId: "crochet-haven-adadb",
    storageBucket: "crochet-haven-adadb.firebasestorage.app",
    messagingSenderId: "1069725766081",
    appId: "1:1069725766081:web:a8d468cfbc65f8712f5f40",
    measurementId: "G-K1G6Z2143J"
  };

// This file is for reference only - you need firebase-admin for server-side import
// For client-side import, use the React component approach

console.log("For importing data from db.json, you have 3 options:");
console.log("");
console.log("1. MANUALLY via Firebase Console:");
console.log("   - Go to Firestore → Start collection 'products'");
console.log("   - Add each product manually");
console.log("");
console.log("2. BROWSER CONSOLE:");
console.log("   - After setting up firebase.js, run importData() in browser console");
console.log("");
console.log("3. CREATE A REACT COMPONENT:");
console.log("   - Add temporary route to ImportData component");
console.log("   - Click button to import products");
console.log("");

// NOTE: Full server-side import requires firebase-admin SDK
// which requires a service account from Firebase Console