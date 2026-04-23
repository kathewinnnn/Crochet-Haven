const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

let admin = null;
let db = null;
let firebaseInitialized = false;

let cache = {
  users: [],
  products: [],
  orders: [],
  carts: {}
};

const initializeFirebase = async () => {
  try {
    // First, always load from local db.json as the source of truth
    const localLoaded = loadFromLocal();
    if (!localLoaded) {
      console.warn('Failed to load local db.json, using minimal defaults');
      cache = {
        users: [{ id: "1", username: "admin", email: "admin@admin.com", role: "admin", createdAt: new Date().toISOString() }],
        products: [
          { id: "1", name: "Crochet Keychain", description: "Handmade crochet keychain", price: "50", category: "Accessories & Bouquet", images: ["/img/keychain/1.jpg"] },
          { id: "2", name: "Crochet Tote Bags", description: "Stylish crochet tote bag", price: "200", category: "Bags", images: ["/img/bag/1.jpg"] },
          { id: "3", name: "Crochet Scarf", description: "Warm and cozy crochet scarf", price: "150", category: "Clothing", images: ["/img/scarf/1.jpg"] },
          { id: "4", name: "Crochet Coasters", description: "Set of 4 decorative crochet coasters", price: "200", category: "Home Decor", images: ["/img/coaster/1.jpg"] },
          { id: "5", name: "Crochet Headband & Bandana", description: "Lightweight crochet headbands", price: "50", category: "Accessories & Bouquet", images: ["/img/headband/1.jpg"] },
          { id: "6", name: "Crochet Bouquet", description: "A handmade crochet bouquet", price: "200", category: "Accessories & Bouquet", images: ["/img/flower/1.jpg"] }
        ],
        orders: [], carts: {}, addresses: {}
      };
    }
    
    // Now try to initialize Firebase for real-time features
    admin = require('firebase-admin');
    
    if (admin.apps.length > 0) {
      db = admin.firestore();
      firebaseInitialized = true;
      console.log('Firebase already initialized');
    } else {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        firebaseInitialized = true;
        console.log('Firebase initialized with service account');
      } else {
        console.log('Firebase service account not configured, using local storage only');
        return true;
      }
    }
    
    // If Firebase is ready, sync local data to Firestore to ensure consistency
    if (firebaseInitialized && db) {
      console.log('Syncing complete local data to Firestore...');
      try {
        await syncToFirestore(cache);
        console.log('Firestore sync completed successfully');
      } catch (err) {
        console.warn('Firestore sync failed (non-critical):', err.message);
      }
    }
    
    return true;
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    console.warn('Stack trace:', error.stack);
    // Ensure we have at least minimal data
    if (!cache.products || cache.products.length === 0) {
      cache = {
        users: [{ id: "1", username: "admin", email: "admin@admin.com", role: "admin", createdAt: new Date().toISOString() }],
        products: [
          { id: "1", name: "Crochet Keychain", description: "Handmade crochet keychain", price: "50", category: "Accessories & Bouquet", images: ["/img/keychain/1.jpg"] },
          { id: "2", name: "Crochet Tote Bags", description: "Stylish crochet tote bag", price: "200", category: "Bags", images: ["/img/bag/1.jpg"] },
          { id: "3", name: "Crochet Scarf", description: "Warm and cozy crochet scarf", price: "150", category: "Clothing", images: ["/img/scarf/1.jpg"] },
          { id: "4", name: "Crochet Coasters", description: "Set of 4 decorative crochet coasters", price: "200", category: "Home Decor", images: ["/img/coaster/1.jpg"] },
          { id: "5", name: "Crochet Headband & Bandana", description: "Lightweight crochet headbands", price: "50", category: "Accessories & Bouquet", images: ["/img/headband/1.jpg"] },
          { id: "6", name: "Crochet Bouquet", description: "A handmade crochet bouquet", price: "200", category: "Accessories & Bouquet", images: ["/img/flower/1.jpg"] }
        ],
        orders: [], carts: {}, addresses: {}
      };
    }
    return true;
  }
};

const loadFromLocal = () => {
  try {
    const fs = require('fs');
    const path = require('path');
    const localPath = path.join(__dirname, 'db.json');
    console.log('Loading db.json from:', localPath);
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, 'utf8');
      const localData = JSON.parse(raw);
      // Ensure all required fields exist
      if (!localData.products) localData.products = [];
      if (!localData.users) localData.users = [];
      if (!localData.orders) localData.orders = [];
      if (!localData.carts) localData.carts = {};
      if (!localData.addresses) localData.addresses = {};
      
      // Migration: ensure confirmed field exists on all orders
      let migrated = false;
      localData.orders = localData.orders.map(order => {
        if (order.confirmed === undefined) {
          migrated = true;
          return { ...order, confirmed: false };
        }
        return order;
      });
      if (migrated) {
        console.log('Migrated orders: added confirmed=false to existing orders');
        // Save the migrated data back
        try {
          fs.writeFileSync(localPath, JSON.stringify(localData, null, 2));
          console.log('Saved migrated db.json');
        } catch (e) {
          console.warn('Failed to save migrated db.json:', e.message);
        }
      }
      
      cache = localData;
      console.log(`Loaded complete local data: ${cache.products.length} products, ${cache.users.length} users, ${cache.orders.length} orders`);
      
      if (db && firebaseInitialized) {
        console.log('Syncing complete local data to Firestore...');
        try {
          await syncToFirestore(cache);
          console.log('Firestore sync completed successfully');
        } catch (err) {
          console.warn('Firestore sync failed (non-critical):', err.message);
        }
      }
      return true;
    } else {
      console.warn('db.json not found at:', localPath);
      cache = getDefaultData();
    }
  } catch (e) {
    console.warn('Failed to load local file:', e.message);
    cache = getDefaultData();
  }
  return true;
};

const getDefaultData = () => ({
  users: [
    {
      id: "1",
      username: "admin",
      email: "admin@admin.com",
      password: "$2b$10$QQg0KErxtA9nJ4yVCH.HBOEwH.RbroYM3otlARXoHagJcIT/T5A.i",
      role: "admin",
      createdAt: "2024-01-01T00:00:00.000Z",
      name: "Admin",
      phone: "0912-345-6789",
      bio: "Store owner",
      storeName: "Crochet Haven",
      location: "Manila"
    }
  ],
  products: [
    {
      id: "1",
      name: "Crochet Keychain",
      description: "Handmade crochet keychain with cute design",
      price: "50",
      category: "Accessories & Bouquet",
      images: ["/img/keychain/1.jpg", "/img/keychain/2.jpg", "/img/keychain/3.jpg", "/img/keychain/4.jpg", "/img/keychain/5.jpg", "/img/keychain/6.jpg", "/img/keychain/7.jpg", "/img/keychain/8.jpg", "/img/keychain/9.jpg", "/img/keychain/10.jpg", "/img/keychain/11.jpg", "/img/keychain/12.jpg"]
    },
    {
      id: "2",
      name: "Crochet Tote Bags",
      description: "Stylish crochet tote bag for everyday use",
      price: "200",
      category: "Bags",
      images: ["/img/bag/1.jpg", "/img/bag/2.jpg", "/img/bag/3.jpg", "/img/bag/4.jpg", "/img/bag/5.jpg", "/img/bag/6.jpg"]
    },
    {
      id: "3",
      name: "Crochet Scarf",
      description: "Warm and cozy crochet scarf",
      price: "150",
      category: "Clothing",
      images: ["/img/scarf/1.jpg", "/img/scarf/2.jpg", "/img/scarf/3.jpg", "/img/scarf/4.jpg", "/img/scarf/5.jpg"]
    },
    {
      id: "4",
      name: "Crochet Coasters",
      description: "Set of 4 decorative crochet coasters",
      price: "200",
      category: "Home Decor",
      images: ["/img/coaster/1.jpg", "/img/coaster/2.jpg", "/img/coaster/3.jpg", "/img/coaster/4.jpg", "/img/coaster/5.jpg", "/img/coaster/6.jpg"]
    },
    {
      id: "5",
      name: "Crochet Headband & Bandana",
      description: "Lightweight crochet headbands designed for comfort and a cute, casual look",
      price: "50",
      category: "Accessories & Bouquet",
      images: ["/img/headband/1.jpg", "/img/headband/2.jpg", "/img/headband/3.jpg", "/img/headband/4.jpg", "/img/headband/5.jpg", "/img/headband/6.jpg", "/img/headband/7.jpg", "/img/headband/8.jpg", "/img/headband/9.jpg"]
    },
    {
      id: "6",
      name: "Crochet Bouquet",
      description: "A handmade crochet bouquet that lasts forever—beautiful, meaningful, and perfect for any occasion",
      price: "200",
      category: "Accessories & Bouquet",
      images: ["/img/flower/1.jpg", "/img/flower/2.jpg", "/img/flower/3.jpg", "/img/flower/4.jpg", "/img/flower/5.jpg", "/img/flower/6.jpg", "/img/flower/7.jpg", "/img/flower/8.jpg", "/img/flower/9.jpg", "/img/flower/10.jpg", "/img/flower/11.jpg"]
    }
  ],
  orders: [],
  carts: {},
  addresses: {}
});
      console.log('Using default complete data with 6 products');
    }
  } catch (e) {
    console.warn('Failed to load local file:', e.message);
    // Return complete default data
    cache = {
      users: [{ id: "1", username: "admin", email: "admin@admin.com", role: "admin", createdAt: new Date().toISOString() }],
      products: [
        { id: "1", name: "Crochet Keychain", description: "Handmade crochet keychain", price: "50", category: "Accessories & Bouquet", images: Array(12).fill("/img/keychain/1.jpg") },
        { id: "2", name: "Crochet Tote Bags", description: "Stylish crochet tote bag", price: "200", category: "Bags", images: Array(6).fill("/img/bag/1.jpg") },
        { id: "3", name: "Crochet Scarf", description: "Warm and cozy crochet scarf", price: "150", category: "Clothing", images: Array(5).fill("/img/scarf/1.jpg") },
        { id: "4", name: "Crochet Coasters", description: "Set of 4 decorative crochet coasters", price: "200", category: "Home Decor", images: Array(6).fill("/img/coaster/1.jpg") },
        { id: "5", name: "Crochet Headband & Bandana", description: "Lightweight crochet headbands", price: "50", category: "Accessories & Bouquet", images: Array(9).fill("/img/headband/1.jpg") },
        { id: "6", name: "Crochet Bouquet", description: "A handmade crochet bouquet", price: "200", category: "Accessories & Bouquet", images: Array(11).fill("/img/flower/1.jpg") }
      ],
      orders: [],
      carts: {}
    };
  }
  return true;
};
    }
  } catch (e) {
    console.warn('Failed to load local file:', e.message);
    // Provide default data structure with sample products
    cache = {
      users: [
        {
          id: "1",
          username: "admin",
          email: "admin@admin.com",
          password: "$2b$10$QQg0KErxtA9nJ4yVCH.HBOEwH.RbroYM3otlARXoHagJcIT/T5A.i",
          role: "admin",
          createdAt: "2024-01-01T00:00:00.000Z",
          name: "Admin",
          phone: "0912-345-6789",
          bio: "Store owner",
          storeName: "Crochet Haven",
          location: "Manila"
        }
      ],
      products: [
        {
          id: "1",
          name: "Crochet Keychain",
          description: "Handmade crochet keychain with cute design",
          price: "50",
          category: "Accessories & Bouquet",
          images: ["/img/keychain/1.jpg", "/img/keychain/2.jpg", "/img/keychain/3.jpg"]
        },
        {
          id: "2",
          name: "Crochet Tote Bags",
          description: "Stylish crochet tote bag for everyday use",
          price: "200",
          category: "Bags",
          images: ["/img/bag/1.jpg", "/img/bag/2.jpg", "/img/bag/3.jpg"]
        },
        {
          id: "3",
          name: "Crochet Scarf",
          description: "Warm and cozy crochet scarf",
          price: "150",
          category: "Clothing",
          images: ["/img/scarf/1.jpg", "/img/scarf/2.jpg", "/img/scarf/3.jpg"]
        },
        {
          id: "4",
          name: "Crochet Coasters",
          description: "Set of 4 decorative crochet coasters",
          price: "200",
          category: "Home Decor",
          images: ["/img/coaster/1.jpg", "/img/coaster/2.jpg", "/img/coaster/3.jpg"]
        }
      ],
      orders: [],
      carts: {}
    };
  }
  return true;
};

const loadFromFirestore = async () => {
  if (!db) return false;
  
  try {
    console.log('Firestore: Attempting to load data from Firestore collections...');
    const data = { users: [], products: [], orders: [], carts: {}, addresses: {} };
    
    const usersSnap = await db.collection('users').get();
    usersSnap.docs.forEach(d => data.users.push(d.data()));
    console.log('Firestore: Loaded', data.users.length, 'users');
    
    const productsSnap = await db.collection('products').get();
    productsSnap.docs.forEach(d => data.products.push(d.data()));
    console.log('Firestore: Loaded', data.products.length, 'products');
    
    const ordersSnap = await db.collection('orders').get();
    ordersSnap.docs.forEach(d => data.orders.push(d.data()));
    console.log('Firestore: Loaded', data.orders.length, 'orders');
    
    // Only use Firestore data if it has actual content
    if (data.users.length > 0 && data.products.length > 0) {
      cache = data;
      firebaseInitialized = true;
      console.log('Firestore data loaded successfully');
      return true;
    } else {
      console.log('Firestore collections are empty, falling back to local db.json');
      return loadFromLocal();
    }
  } catch (error) {
    console.warn('Failed to load from Firestore:', error.message);
    return loadFromLocal();
  }
};

const saveToAll = async (data) => {
  cache = data;

  console.log('Serverless Debug - Saving data, Firestore initialized:', firebaseInitialized);
  console.log('Serverless Debug - Data to save:', {
    users: data.users?.length || 0,
    products: data.products?.length || 0,
    orders: data.orders?.length || 0
  });

  try {
    const fs = require('fs');
    const path = require('path');
    // Save to the same location that loadFromLocal loads from
    const localPath = path.join(__dirname, 'db.json');
    fs.writeFileSync(localPath, JSON.stringify(data, null, 2));
    console.log('Data saved to local file:', localPath);
  } catch (e) {
    console.warn('Failed to save local file:', e.message);
  }

  if (db && firebaseInitialized) {
    try {
      await syncToFirestore(data);
      console.log('Data synced to Firestore successfully');
    } catch (err) {
      console.warn('Firestore sync failed:', err.message);
    }
  } else {
    console.log('Firestore not available, data only saved locally');
  }
};

const syncToFirestore = async (data) => {
  if (!db) return false;
  
  try {
    const batch = db.batch();
    
    const usersRef = db.collection('users');
    const usersSnap = await usersRef.get();
    usersSnap.docs.forEach(d => batch.delete(d.ref));
    data.users.forEach(user => {
      usersRef.doc(user.id || Date.now().toString()).set(user);
    });
    
    const productsRef = db.collection('products');
    const productsSnap = await productsRef.get();
    productsSnap.docs.forEach(d => batch.delete(d.ref));
    data.products.forEach(product => {
      productsRef.doc(product.id || Date.now().toString()).set(product);
    });
    
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

const readDb = () => cache;
const writeDb = async (data) => await saveToAll(data);

const decodeToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
};

exports.handler = async (event, context) => {
  console.log('Serverless Debug - Function called with path:', event.path, 'method:', event.httpMethod);

  // Initialize on first request - load complete data from local db.json
  if (!admin) {
    const initialized = await initializeFirebase();
    console.log('Server initialization complete. Firebase enabled:', firebaseInitialized);
    console.log('Current cache state - Products:', cache.products?.length || 0, 
                'Users:', cache.users?.length || 0, 
                'Orders:', cache.orders?.length || 0);
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('Serverless Debug - Handling OPTIONS request');
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: 'OK' }) };
  }

  let body = {};
  try {
    if (event.body) body = JSON.parse(event.body);
  } catch {}

  const path = event.path || event.rawUrl || '';
  const method = event.httpMethod;
  console.log('Serverless Debug - Processing request:', method, path);
  console.log('Serverless Debug - Full event.path:', event.path);
  console.log('Serverless Debug - Full event.rawUrl:', event.rawUrl);
  const authHeader = event.headers?.authorization || event.headers?.Authorization || '';

  let responseData = null;
  let statusCode = 200;

  try {
    if (path.includes('/api/auth/login') && method === 'POST') {
      const { username, password } = body;
      if (!username || !password) {
        statusCode = 400;
        responseData = { message: "Username and password required" };
      } else {
        const user = cache.users.find(u => 
          u.username.toLowerCase() === username.toLowerCase() ||
          u.email?.toLowerCase() === username.toLowerCase()
        );
        if (!user) {
          statusCode = 401;
          responseData = { message: "Invalid username/email or password" };
        } else {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            statusCode = 401;
            responseData = { message: "Invalid username/email or password" };
          } else {
            const token = jwt.sign(
              { id: user.id, username: user.username, email: user.email, role: user.role },
              JWT_SECRET,
              { expiresIn: "7d" }
            );
            const { password: _, ...userWithoutPassword } = user;
            responseData = { token, user: userWithoutPassword };
          }
        }
      }
    }

    else if (path.includes('/api/auth/register') && method === 'POST') {
      const { username, email, password, fullName, phone, address, avatar } = body;
      if (!username || !email || !password) {
        statusCode = 400;
        responseData = { message: "All fields required" };
      } else {
        if (cache.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
          statusCode = 400;
          responseData = { message: "Username taken" };
        } else if (cache.users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
          statusCode = 400;
          responseData = { message: "Email already registered" };
        } else {
          const hashed = await bcrypt.hash(password, 10);
          const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashed,
            role: "user",
            createdAt: new Date().toISOString(),
            fullName: fullName || "",
            phone: phone || "",
            address: address || "",
            avatar: avatar || ""
          };
          cache.users.push(newUser);
          await saveToAll(cache);
          const { password: _, ...userWithoutPassword } = newUser;
          statusCode = 201;
          responseData = { message: "Registration successful", ...userWithoutPassword };
        }
      }
    }

    else if (path.includes('/api/auth/check-username') && method === 'GET') {
      const params = event.queryStringParameters || {};
      const username = params.username;
      if (!username) {
        statusCode = 400;
        responseData = { message: "Username required" };
      } else {
        const taken = cache.users.some(u => u.username.toLowerCase() === username.toLowerCase());
        responseData = { available: !taken };
      }
    }

    else if (path.includes('/api/auth/delete-account') && method === 'POST') {
      console.log('Serverless Debug - Delete account endpoint called');
      const decoded = decodeToken(authHeader);
      console.log('Serverless Debug - Token decoded:', decoded ? { id: decoded.id, username: decoded.username } : 'No token');
      if (!decoded) {
        statusCode = 401;
        responseData = { message: "Unauthorized" };
      } else {
        const { username, password } = body;
        console.log('Serverless Debug - Delete request for username:', username);
        if (!username || !password) {
          statusCode = 400;
          responseData = { message: "Username and password are required" };
        } else {
          const idx = cache.users.findIndex(
            u => u.username.trim().toLowerCase() === username.trim().toLowerCase()
          );
          console.log('Serverless Debug - User found at index:', idx);
          if (idx === -1) {
            statusCode = 404;
            responseData = { message: "Account not found" };
          } else {
            const user = cache.users[idx];
            console.log('Serverless Debug - User to delete:', { id: user.id, username: user.username });
            // Verify the user is deleting their own account
            if (user.id !== decoded.id) {
              statusCode = 403;
              responseData = { message: "You can only delete your own account" };
            } else {
              const isMatch = await bcrypt.compare(password, user.password);
              console.log('Serverless Debug - Password match:', isMatch);
              if (!isMatch) {
                statusCode = 401;
                responseData = { message: "Incorrect password. Please try again." };
              } else {
                console.log('Serverless Debug - Deleting user and their orders');
                cache.users.splice(idx, 1);
                cache.orders = cache.orders.filter(o => o.userId !== user.id);
                await saveToAll(cache);
                console.log('Serverless Debug - User deleted successfully');
                responseData = { message: "Account deleted successfully" };
              }
            }
          }
        }
      }
    }

    else if (path.includes('/api/auth/change-password') && method === 'PUT') {
      const decoded = decodeToken(authHeader);
      if (!decoded) {
        statusCode = 401;
        responseData = { message: "Unauthorized" };
      } else {
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
          statusCode = 400;
          responseData = { message: "Current and new password required" };
        } else if (newPassword.length < 6) {
          statusCode = 400;
          responseData = { message: "Password must be at least 6 characters" };
        } else {
          const userIndex = cache.users.findIndex(u => u.id === decoded.id);
          if (userIndex === -1) {
            statusCode = 404;
            responseData = { message: "User not found" };
          } else {
            const user = cache.users[userIndex];
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
              statusCode = 401;
              responseData = { message: "Current password is incorrect" };
            } else {
              const hashedNewPassword = await bcrypt.hash(newPassword, 10);
              cache.users[userIndex].password = hashedNewPassword;
              await saveToAll(cache);
              responseData = { message: "Password changed successfully" };
            }
          }
        }
      }
    }

    else if (path.includes('/api/auth/profile') && method === 'GET') {
      const decoded = decodeToken(authHeader);
      if (!decoded) {
        statusCode = 401;
        responseData = { message: "Unauthorized" };
      } else {
        const user = cache.users.find(u => u.id === decoded.id);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          responseData = userWithoutPassword;
        } else {
          statusCode = 404;
          responseData = { message: "User not found" };
        }
      }
    }

    else if (path.includes('/api/auth/profile') && method === 'PUT') {
      const decoded = decodeToken(authHeader);
      if (!decoded) {
        statusCode = 401;
        responseData = { message: "Unauthorized" };
      } else {
        const { fullName, phone, address, avatar } = body;
        const userIndex = cache.users.findIndex(u => u.id === decoded.id);
        if (userIndex === -1) {
          statusCode = 404;
          responseData = { message: "User not found" };
        } else {
          if (fullName) cache.users[userIndex].fullName = fullName;
          if (phone) cache.users[userIndex].phone = phone;
          if (address) cache.users[userIndex].address = address;
          if (avatar !== undefined) cache.users[userIndex].avatar = avatar;
          await saveToAll(cache);
          const { password, ...userWithoutPassword } = cache.users[userIndex];
          responseData = userWithoutPassword;
        }
      }
    }

    else if (path.includes('/api/products') && method === 'GET') {
      console.log('Serving products from cache:', cache.products?.length || 0, 'items');
      if (cache.products && cache.products.length > 0) {
        console.log('Products list:', cache.products.map(p => `[${p.id}] ${p.name} (${p.category})`).join(', '));
        // Count products by category
        const categoryCount = cache.products.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {});
        console.log('Products by category:', categoryCount);
      }
      responseData = cache.products || [];
    }

    else if (path.includes('/api/products') && method === 'POST') {
      const newProduct = { ...body };
      cache.products.push(newProduct);
      await saveToAll(cache);
      statusCode = 201;
      responseData = newProduct;
    }

    else if (path.includes('/api/products/') && method === 'PUT') {
      const id = path.split('/api/products/')[1].split('?')[0];
      const index = cache.products.findIndex(p => p.id === id);
      if (index === -1) {
        statusCode = 404;
        responseData = { error: "Product not found" };
      } else {
        cache.products[index] = { ...body };
        await saveToAll(cache);
        responseData = cache.products[index];
      }
    }

    else if (path.includes('/api/products/') && method === 'DELETE') {
      const id = path.split('/api/products/')[1].split('?')[0];
      const filtered = cache.products.filter(p => p.id !== id);
      if (filtered.length === cache.products.length) {
        statusCode = 404;
        responseData = { error: "Product not found" };
      } else {
        cache.products = filtered;
        await saveToAll(cache);
        responseData = { message: "Product deleted" };
      }
    }

    else if (path.includes('/orders') && method === 'GET' && !path.includes('/latest') && !path.includes('/count') && !path.includes('/cancel')) {
      console.log('Serverless Debug - Serving orders endpoint, path:', path, 'auth header:', !!authHeader);
      const decoded = decodeToken(authHeader);
      if (!decoded || !decoded.id) {
        statusCode = 401;
        responseData = { error: "Authentication required" };
      } else {
        const allOrders = cache.orders || [];
        // Admin/seller users can see all orders, regular users only see their own
        let ordersToReturn;
        if (decoded.role === 'admin' || decoded.role === 'seller') {
          ordersToReturn = allOrders; // Return all orders for admin/seller
          console.log(`Serverless Debug - Returning ${ordersToReturn.length} orders for admin/seller user ${decoded.id}`);
        } else {
          ordersToReturn = allOrders.filter(order => order.userId === decoded.id); // Regular users only see their orders
          console.log(`Serverless Debug - Returning ${ordersToReturn.length} orders for regular user ${decoded.id}`);
        }
        responseData = ordersToReturn;
      }
      console.log('Serverless Debug - Returning orders data:', responseData);
    }

    else if (path.includes('/api/orders') && method === 'POST') {
      console.log('Serverless Debug - Processing order POST request');
      console.log('Serverless Debug - Auth header present:', !!authHeader);
      const decoded = decodeToken(authHeader);
      console.log('Serverless Debug - Decoded token:', decoded ? { id: decoded.id, username: decoded.username } : 'No token');
      console.log('Serverless Debug - Request body:', body);

      const order = {
        id: Date.now().toString(),
        userId: decoded?.id || null,
        username: decoded?.username || null,
        ...body,
        createdAt: new Date().toISOString(),
        status: "Processing"
      };

      console.log('Serverless Debug - Created order:', { id: order.id, userId: order.userId, total: order.total });

      if (!cache.orders) cache.orders = [];
      cache.orders.push(order);
      await saveToAll(cache);
      statusCode = 201;
      responseData = order;
      console.log('Serverless Debug - Order saved successfully');
    }

    else if (path.includes('/api/orders/') && path.includes('/cancel') && method === 'POST') {
      const id = path.split('/api/orders/')[1].split('/cancel')[0];
      const index = cache.orders.findIndex(o => o.id === id);
      if (index === -1) {
        statusCode = 404;
        responseData = { error: "Order not found" };
      } else {
        cache.orders[index].status = "Cancelled";
        await saveToAll(cache);
        responseData = cache.orders[index];
      }
    }

    else if (path.includes('/api/orders/') && method === 'PUT') {
      const id = path.split('/api/orders/')[1].split('?')[0];
      const index = cache.orders.findIndex(o => o.id === id);
      if (index === -1) {
        statusCode = 404;
        responseData = { error: "Order not found" };
      } else {
        const { status, confirmed } = body;
        if (status !== undefined) cache.orders[index].status = status;
        if (confirmed !== undefined) cache.orders[index].confirmed = confirmed;
        await saveToAll(cache);
        responseData = cache.orders[index];
      }
    }

    else if (path.includes('/api/orders/') && method === 'DELETE') {
      const id = path.split('/api/orders/')[1].split('?')[0];
      const index = cache.orders.findIndex(o => o.id === id);
      if (index === -1) {
        statusCode = 404;
        responseData = { error: "Order not found" };
      } else {
        cache.orders.splice(index, 1);
        await saveToAll(cache);
        responseData = { success: true, message: "Order deleted" };
      }
    }

    else if (path.includes('/api/orders/latest') && method === 'GET') {
      const orders = cache.orders || [];
      if (!orders.length) {
        responseData = { latestOrderId: null, latestTimestamp: null };
      } else {
        const latest = orders[orders.length - 1];
        responseData = { latestOrderId: latest.id, latestTimestamp: latest.createdAt };
      }
    }

    else if (path.includes('/api/orders/count') && method === 'GET') {
      responseData = { count: cache.orders ? cache.orders.length : 0 };
    }

    else if (path.includes('/api/cart') && method === 'GET') {
      const decoded = decodeToken(authHeader);
      if (!decoded) {
        statusCode = 401;
        responseData = { message: "Unauthorized" };
      } else {
        // Get user's cart from cache (we'll store carts in cache.carts)
        if (!cache.carts) cache.carts = {};
        const userCart = cache.carts[decoded.id] || [];
        console.log('Serving cart for user', decoded.id, ':', userCart.length, 'items');
        responseData = userCart;
      }
    }

    else if (path.includes('/api/cart') && method === 'POST') {
      const decoded = decodeToken(authHeader);
      if (!decoded) {
        statusCode = 401;
        responseData = { message: "Unauthorized" };
      } else {
        // Save user's cart to cache
        if (!cache.carts) cache.carts = {};
        cache.carts[decoded.id] = body;
        await saveToAll(cache);
        console.log('Saved cart for user', decoded.id, ':', body.length, 'items');
        responseData = { message: "Cart saved successfully" };
      }
    }

    else if (path.includes('/api/addresses') && method === 'GET') {
      const decoded = decodeToken(authHeader);
      if (!decoded) {
        statusCode = 401;
        responseData = { message: "Unauthorized" };
      } else {
        // Get user's addresses from cache
        if (!cache.addresses) cache.addresses = {};
        const userAddresses = cache.addresses[decoded.id] || [];
        console.log('Serving addresses for user', decoded.id, ':', userAddresses.length, 'addresses');
        responseData = userAddresses;
      }
    }

    else if (path.includes('/api/addresses') && method === 'POST') {
      const decoded = decodeToken(authHeader);
      if (!decoded) {
        statusCode = 401;
        responseData = { message: "Unauthorized" };
      } else {
        // Save user's addresses to cache
        if (!cache.addresses) cache.addresses = {};
        cache.addresses[decoded.id] = body;
        await saveToAll(cache);
        console.log('Saved addresses for user', decoded.id, ':', body.length, 'addresses');
        responseData = { message: "Addresses saved successfully" };
      }
    }

    else {
      statusCode = 404;
      responseData = { error: "Not found", path, method };
    }
  } catch (err) {
    console.error('Error:', err);
    statusCode = 500;
    responseData = { error: "Internal server error", message: err.message };
  }

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(responseData),
  };
};