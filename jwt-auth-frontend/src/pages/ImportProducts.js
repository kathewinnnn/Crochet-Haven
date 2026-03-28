// Simple Import Component - Add this to your React app temporarily
// Place in src/pages/ImportProducts.js

import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// UPDATE THIS with your Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyC-Eu-T8p8aA4PDTTK11DmdyHMSLrjPKfE",
    authDomain: "crochet-haven-adadb.firebaseapp.com",
    projectId: "crochet-haven-adadb",
    storageBucket: "crochet-haven-adadb.firebasestorage.app",
    messagingSenderId: "1069725766081",
    appId: "1:1069725766081:web:a8d468cfbc65f8712f5f40",
    measurementId: "G-K1G6Z2143J"
  };

// Your products data from db.json
const productsData = [
  {
    name: "Crochet Keychain",
    description: "Handmade crochet keychain with cute design",
    price: 50,
    category: "Accessories & Bouquet",
    images: ["/img/keychain/1.jpg", "/img/keychain/2.jpg", "/img/keychain/3.jpg"]
  },
  {
    name: "Crochet Tote Bags",
    description: "Stylish crochet tote bag for everyday use",
    price: 200,
    category: "Bags",
    images: ["/img/bag/1.jpg", "/img/bag/2.jpg", "/img/bag/3.jpg"]
  },
  {
    name: "Crochet Scarf",
    description: "Warm and cozy crochet scarf",
    price: 150,
    category: "Clothing",
    images: ["/img/scarf/1.jpg", "/img/scarf/2.jpg", "/img/scarf/3.jpg"]
  },
  {
    name: "Crochet Coasters",
    description: "Set of 4 decorative crochet coasters",
    price: 200,
    category: "Home Decor",
    images: ["/img/coaster/1.jpg", "/img/coaster/2.jpg", "/img/coaster/3.jpg"]
  },
  {
    name: "Crochet Headband & Bandana",
    description: "Lightweight crochet headbands designed for comfort and a cute, casual look",
    price: 50,
    category: "Accessories & Bouquet",
    images: ["/img/headband/1.jpg", "/img/headband/2.jpg", "/img/headband/3.jpg"]
  },
  {
    name: "Crochet Bouquet",
    description: "A handmade crochet bouquet that lasts forever—beautiful, meaningful, and perfect for any occasion",
    price: 200,
    category: "Accessories & Bouquet",
    images: ["/img/flower/1.jpg", "/img/flower/2.jpg", "/img/flower/3.jpg"]
  }
];

export default function ImportProducts() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState('');

  const handleImport = async () => {
    setImporting(true);
    setResult('Starting import...');
    
    try {
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      
      setResult(`Importing ${productsData.length} products...`);
      
      for (const product of productsData) {
        await addDoc(collection(db, "products"), {
          ...product,
          createdAt: serverTimestamp()
        });
        setResult(`✅ Imported: ${product.name}`);
      }
      
      setResult('🎉 All products imported successfully!');
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    }
    
    setImporting(false);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>📦 Firebase Product Importer</h1>
      <p>Click the button below to import your products to Firestore</p>
      
      <button 
        onClick={handleImport} 
        disabled={importing}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: importing ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: importing ? 'not-allowed' : 'pointer'
        }}
      >
        {importing ? 'Importing...' : 'Import Products'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0' }}>
          {result}
        </div>
      )}
    </div>
  );
}