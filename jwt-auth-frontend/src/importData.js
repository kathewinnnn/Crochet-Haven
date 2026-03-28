const firebaseConfig = {
    apiKey: "AIzaSyC-Eu-T8p8aA4PDTTK11DmdyHMSLrjPKfE",
    authDomain: "crochet-haven-adadb.firebaseapp.com",
    projectId: "crochet-haven-adadb",
    storageBucket: "crochet-haven-adadb.firebasestorage.app",
    messagingSenderId: "1069725766081",
    appId: "1:1069725766081:web:a8d468cfbc65f8712f5f40",
    measurementId: "G-K1G6Z2143J"
  };

// ============================================
// YOUR DATA FROM DB.JSON - PRODUCTS ONLY
// ============================================
const productsData = [
  {
    "name": "Crochet Keychain",
    "description": "Handmade crochet keychain with cute design",
    "price": "50",
    "category": "Accessories & Bouquet",
    "images": [
      "/img/keychain/1.jpg",
      "/img/keychain/2.jpg",
      "/img/keychain/3.jpg",
      "/img/keychain/4.jpg",
      "/img/keychain/5.jpg",
      "/img/keychain/6.jpg",
      "/img/keychain/7.jpg",
      "/img/keychain/8.jpg",
      "/img/keychain/9.jpg",
      "/img/keychain/10.jpg",
      "/img/keychain/11.jpg",
      "/img/keychain/12.jpg"
    ]
  },
  {
    "name": "Crochet Tote Bags",
    "description": "Stylish crochet tote bag for everyday use",
    "price": "200",
    "category": "Bags",
    "images": [
      "/img/bag/1.jpg",
      "/img/bag/2.jpg",
      "/img/bag/3.jpg",
      "/img/bag/4.jpg",
      "/img/bag/5.jpg",
      "/img/bag/6.jpg"
    ]
  },
  {
    "name": "Crochet Scarf",
    "description": "Warm and cozy crochet scarf",
    "price": "150",
    "category": "Clothing",
    "images": [
      "/img/scarf/1.jpg",
      "/img/scarf/2.jpg",
      "/img/scarf/3.jpg",
      "/img/scarf/4.jpg",
      "/img/scarf/5.jpg"
    ]
  },
  {
    "name": "Crochet Coasters",
    "description": "Set of 4 decorative crochet coasters",
    "price": "200",
    "category": "Home Decor",
    "images": [
      "/img/coaster/1.jpg",
      "/img/coaster/2.jpg",
      "/img/coaster/3.jpg",
      "/img/coaster/4.jpg",
      "/img/coaster/5.jpg",
      "/img/coaster/6.jpg"
    ]
  },
  {
    "name": "Crochet Headband & Bandana",
    "description": "Lightweight crochet headbands designed for comfort and a cute, casual look",
    "price": "50",
    "category": "Accessories & Bouquet",
    "images": [
      "/img/headband/1.jpg",
      "/img/headband/2.jpg",
      "/img/headband/3.jpg",
      "/img/headband/4.jpg",
      "/img/headband/5.jpg",
      "/img/headband/6.jpg",
      "/img/headband/7.jpg",
      "/img/headband/8.jpg",
      "/img/headband/9.jpg"
    ]
  },
  {
    "name": "Crochet Bouquet",
    "description": "A handmade crochet bouquet that lasts forever—beautiful, meaningful, and perfect for any occasion",
    "price": "200",
    "category": "Accessories & Bouquet",
    "images": [
      "/img/flower/1.jpg",
      "/img/flower/2.jpg",
      "/img/flower/3.jpg",
      "/img/flower/4.jpg",
      "/img/flower/5.jpg",
      "/img/flower/6.jpg",
      "/img/flower/7.jpg",
      "/img/flower/8.jpg",
      "/img/flower/9.jpg",
      "/img/flower/10.jpg",
      "/img/flower/11.jpg"
    ]
  }
];

// ============================================
// IMPORT FUNCTION - RUN THIS IN CONSOLE
// ============================================

async function importProducts() {
  console.log("🔄 Initializing Firebase...");
  
  // Load Firebase SDK dynamically
  try {
    // Check if Firebase is already loaded
    if (typeof firebase === 'undefined') {
      console.log("⚠️ Firebase SDK not loaded. Please ensure you're running this in a browser with firebase.js loaded, OR use the manual import method below.");
      console.log("");
      console.log("📝 ALTERNATIVE: Use Firebase Console to manually add products:");
      console.log("   1. Go to Firestore Database");
      console.log("   2. Click 'Start collection' → name: 'products'");
      console.log("   3. Click 'Add document' → add each product manually");
      return;
    }
    
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    
    console.log("✅ Firebase initialized!");
    console.log(`📦 Importing ${productsData.length} products...`);
    
    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      
      await db.collection("products").add({
        name: product.name,
        description: product.description,
        price: parseFloat(product.price) || 0,
        category: product.category,
        images: product.images || [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Imported: ${product.name}`);
    }
    
    console.log("");
    console.log("🎉 SUCCESS! All products imported to Firestore!");
    console.log("");
    console.log("📌 Next steps:");
    console.log("   1. Update src/firebase.js with your actual Firebase config");
    console.log("   2. Update your React components to use Firebase");
    console.log("   3. Deploy to Firebase Hosting");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// ============================================
// RUN THIS
// ============================================
console.log("===========================================");
console.log("Firebase Product Import Utility");
console.log("===========================================");
console.log("");
console.log("⚠️  IMPORTANT: Before running this:");
console.log("   1. Update firebaseConfig at the top with YOUR Firebase values");
console.log("   2. Make sure Firebase SDK is loaded in your app");
console.log("");
console.log("✅ To start import, type: importProducts()");
console.log("===========================================");