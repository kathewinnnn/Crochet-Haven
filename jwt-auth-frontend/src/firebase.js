// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration - Replace with your actual config from Firebase Console
// Go to: Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyC-Eu-T8p8aA4PDTTK11DmdyHMSLrjPKfE",
  authDomain: "crochet-haven-adadb.firebaseapp.com",
  projectId: "crochet-haven-adadb",
  storageBucket: "crochet-haven-adadb.firebasestorage.app",
  messagingSenderId: "1069725766081",
  appId: "1:1069725766081:web:a8d468cfbc65f8712f5f40",
  measurementId: "G-K1G6Z2143J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;