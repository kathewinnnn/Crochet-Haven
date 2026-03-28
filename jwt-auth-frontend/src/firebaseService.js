// Firebase Firestore Service
// This replaces json-server with Firebase Firestore operations

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { db, auth } from "./firebase";

// Helper to handle Firestore errors
const handleFirestoreError = (error) => {
  console.error("Firestore Error:", error);
  throw error;
};

// ==================== AUTH SERVICE ====================

// Register new user
export const registerUser = async (email, password, userData) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, {
      displayName: userData.username || userData.name
    });

    // Save additional user data to Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      username: userData.username,
      email: email,
      name: userData.name || "",
      phone: userData.phone || "",
      role: userData.role || "user",
      createdAt: serverTimestamp(),
      ...userData
    });

    return { user, ...userData };
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
    let userData = null;
    
    userDoc.forEach((doc) => {
      userData = { id: doc.id, ...doc.data() };
    });

    return { user, userData };
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Get user profile by UID
export const getUserProfile = async (uid) => {
  try {
    const userDocs = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
    let userData = null;
    
    userDocs.forEach((doc) => {
      userData = { id: doc.id, ...doc.data() };
    });
    
    return userData;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Update user profile
export const updateUserProfile = async (uid, userData) => {
  try {
    const userDocs = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
    
    userDocs.forEach(async (docSnapshot) => {
      const userRef = doc(db, "users", docSnapshot.id);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    });
  } catch (error) {
    handleFirestoreError(error);
  }
};

// ==================== PRODUCTS SERVICE ====================

// Get all products
export const getAllProducts = async () => {
  try {
    const products = [];
    const querySnapshot = await getDocs(collection(db, "products"));
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...productData };
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    return { id: productId, ...productData };
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const products = [];
    const querySnapshot = await getDocs(
      query(collection(db, "products"), where("category", "==", category))
    );
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Get products by seller
export const getProductsBySeller = async (sellerId) => {
  try {
    const products = [];
    const querySnapshot = await getDocs(
      query(collection(db, "products"), where("sellerId", "==", sellerId))
    );
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// ==================== ORDERS SERVICE ====================

// Get all orders
export const getAllOrders = async () => {
  try {
    const orders = [];
    const querySnapshot = await getDocs(
      query(collection(db, "orders"), orderBy("createdAt", "desc"))
    );
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Create new order
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Update order
export const updateOrder = async (orderId, orderData) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      ...orderData,
      updatedAt: serverTimestamp()
    });
    return { id: orderId, ...orderData };
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "cancelled",
      cancelledAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Get orders by user
export const getOrdersByUser = async (userId) => {
  try {
    const orders = [];
    const querySnapshot = await getDocs(
      query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    );
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// Get orders by seller
export const getOrdersBySeller = async (sellerId) => {
  try {
    const orders = [];
    const querySnapshot = await getDocs(
      query(collection(db, "orders"), where("sellerId", "==", sellerId), orderBy("createdAt", "desc"))
    );
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    handleFirestoreError(error);
  }
};

// ==================== DATA MIGRATION ====================

// Import data from JSON (for initial migration)
export const importData = async (jsonData) => {
  try {
    // Import users
    if (jsonData.users && Array.isArray(jsonData.users)) {
      for (const user of jsonData.users) {
        // Note: You'll need to migrate existing users differently
        // as they have different password hashing
        console.log("User:", user.username);
      }
    }

    // Import products
    if (jsonData.products && Array.isArray(jsonData.products)) {
      for (const product of jsonData.products) {
        const { id, ...productData } = product;
        await addDoc(collection(db, "products"), {
          ...productData,
          importedAt: serverTimestamp()
        });
      }
      console.log(`Imported ${jsonData.products.length} products`);
    }

    // Import orders
    if (jsonData.orders && Array.isArray(jsonData.orders)) {
      for (const order of jsonData.orders) {
        const { id, ...orderData } = order;
        await addDoc(collection(db, "orders"), {
          ...orderData,
          importedAt: serverTimestamp()
        });
      }
      console.log(`Imported ${jsonData.orders.length} orders`);
    }

    return true;
  } catch (error) {
    handleFirestoreError(error);
  }
};

export default {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  // Products
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySeller,
  // Orders
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  cancelOrder,
  getOrdersByUser,
  getOrdersBySeller,
  // Migration
  importData
};