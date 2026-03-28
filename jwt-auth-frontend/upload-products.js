// Simple Node.js script to upload products to Firestore
// Run: node upload-products.js

const { initializeApp } = require('firebase/data');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// ============================================
// UPDATE WITH YOUR FIREBASE CONFIG
// Get this from: Firebase Console → Project Settings → Your apps → Web app
// ============================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// ============================================
// YOUR PRODUCTS DATA
// ============================================
const productsData = [
  {
    name: "Crochet Keychain",
    description: "Handmade crochet keychain with cute design",
    price: 50,
    category: "Accessories & Bouquet",
    images: [
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
    name: "Crochet Tote Bags",
    description: "Stylish crochet tote bag for everyday use",
    price: 200,
    category: "Bags",
    images: [
      "/img/bag/1.jpg",
      "/img/bag/2.jpg",
      "/img/bag/3.jpg",
      "/img/bag/4.jpg",
      "/img/bag/5.jpg",
      "/img/bag/6.jpg"
    ]
  },
  {
    name: "Crochet Scarf",
    description: "Warm and cozy crochet scarf",
    price: 150,
    category: "Clothing",
    images: [
      "/img/scarf/1.jpg",
      "/img/scarf/2.jpg",
      "/img/scarf/3.jpg",
      "/img/scarf/4.jpg",
      "/img/scarf/5.jpg"
    ]
  },
  {
    name: "Crochet Coasters",
    description: "Set of 4 decorative crochet coasters",
    price: 200,
    category: "Home Decor",
    images: [
      "/img/coaster/1.jpg",
      "/img/coaster/2.jpg",
      "/img/coaster/3.jpg",
      "/img/coaster/4.jpg",
      "/img/coaster/5.jpg",
      "/img/coaster/6.jpg"
    ]
  },
  {
    name: "Crochet Headband & Bandana",
    description: "Lightweight crochet headbands designed for comfort and a cute, casual look",
    price: 50,
    category: "Accessories & Bouquet",
    images: [
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
    name: "Crochet Bouquet",
    description: "A handmade crochet bouquet that lasts forever—beautiful, meaningful, and perfect for any occasion",
    price: 200,
    category: "Accessories & Bouquet",
    images: [
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
// UPLOAD FUNCTION
// ============================================
async function uploadProducts() {
  console.log('🔄 Initializing Firebase...');
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase connected!');
    console.log(`📦 Uploading ${productsData.length} products...\n`);
    
    // Upload each product
    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      
      const docRef = await addDoc(collection(db, "products"), {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        createdAt: serverTimestamp()
      });
      
      console.log(`✅ ${i + 1}. ${product.name} (ID: ${docRef.id})`);
    }
    
    console.log('\n🎉 SUCCESS! All products uploaded to Firestore!');
    console.log('\n📌 Next steps:');
    console.log('   1. Update src/firebase.js with your Firebase config');
    console.log('   2. Run: npm run build');
    console.log('   3. Run: firebase deploy');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure you:');
    console.log('   1. Updated firebaseConfig with YOUR values');
    console.log('   2. Enabled Firestore in Firebase Console');
  }
}

// Run the upload
uploadProducts();