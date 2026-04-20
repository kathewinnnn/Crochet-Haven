const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

let admin = null;
let db = null;
let firebaseInitialized = false;

let cache = {
  users: [],
  products: [],
  orders: []
};

const initializeFirebase = async () => {
  try {
    admin = require('firebase-admin');
    
    if (admin.apps.length > 0) {
      db = admin.firestore();
      firebaseInitialized = true;
      await loadFromFirestore();
      return true;
    }
    
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      db = admin.firestore();
      firebaseInitialized = true;
      await loadFromFirestore();
      return true;
    }
    
    console.log('Firebase not configured, using local data');
    return loadFromLocal();
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    return loadFromLocal();
  }
};

const loadFromLocal = () => {
  try {
    const fs = require('fs');
    const path = require('path');
    const localPath = path.join(__dirname, '..', 'db.json');
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, 'utf8');
      cache = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load local file:', e.message);
    cache = { users: [], products: [], orders: [] };
  }
  return true;
};

const loadFromFirestore = async () => {
  if (!db) return false;
  
  try {
    const data = { users: [], products: [], orders: [] };
    
    const usersSnap = await db.collection('users').get();
    usersSnap.docs.forEach(d => data.users.push(d.data()));
    
    const productsSnap = await db.collection('products').get();
    productsSnap.docs.forEach(d => data.products.push(d.data()));
    
    const ordersSnap = await db.collection('orders').get();
    ordersSnap.docs.forEach(d => data.orders.push(d.data()));
    
    cache = data;
    console.log(`Loaded from Firestore: ${data.users.length} users, ${data.products.length} products`);
    return true;
  } catch (error) {
    console.warn('Failed to load from Firestore:', error.message);
    return loadFromLocal();
  }
};

const saveToAll = async (data) => {
  cache = data;
  
  try {
    const fs = require('fs');
    const path = require('path');
    const localPath = path.join(__dirname, '..', 'db.json');
    fs.writeFileSync(localPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn('Failed to save local file:', e.message);
  }
  
  if (db && firebaseInitialized) {
    await syncToFirestore(data).catch(err => 
      console.warn('Firestore sync failed:', err.message)
    );
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
  if (!admin) {
    await initializeFirebase();
  }
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: 'OK' }) };
  }

  let body = {};
  try {
    if (event.body) body = JSON.parse(event.body);
  } catch {}

  const path = event.path || event.rawUrl || '';
  const method = event.httpMethod;
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
          responseData = { message: "Invalid credentials" };
        } else {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            statusCode = 401;
            responseData = { message: "Invalid credentials" };
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
      const { username, password, email } = body;
      if (!password) {
        statusCode = 400;
        responseData = { message: "Password is required" };
      } else {
        let idx = -1;
        if (username) {
          idx = cache.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
        }
        if (idx === -1 && email) {
          idx = cache.users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
        }
        if (idx === -1) {
          statusCode = 404;
          responseData = { message: "Account not found" };
        } else {
          const user = cache.users[idx];
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            statusCode = 401;
            responseData = { message: "Incorrect password" };
          } else {
            cache.users.splice(idx, 1);
            cache.orders = cache.orders.filter(o => o.userId !== user.id);
            await saveToAll(cache);
            responseData = { message: "Account deleted successfully" };
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

    else if (path.includes('/products') && method === 'GET') {
      responseData = cache.products;
    }

    else if (path.includes('/products') && method === 'POST') {
      const newProduct = { ...body };
      cache.products.push(newProduct);
      await saveToAll(cache);
      statusCode = 201;
      responseData = newProduct;
    }

    else if (path.includes('/products/') && method === 'PUT') {
      const id = path.split('/products/')[1].split('?')[0];
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

    else if (path.includes('/products/') && method === 'DELETE') {
      const id = path.split('/products/')[1].split('?')[0];
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

    else if (path.includes('/orders') && method === 'GET') {
      responseData = cache.orders || [];
    }

    else if (path.includes('/orders') && method === 'POST') {
      const decoded = decodeToken(authHeader);
      const order = {
        id: Date.now().toString(),
        userId: decoded?.id || null,
        username: decoded?.username || null,
        ...body,
        createdAt: new Date().toISOString(),
        status: "Processing"
      };
      if (!cache.orders) cache.orders = [];
      cache.orders.push(order);
      await saveToAll(cache);
      statusCode = 201;
      responseData = order;
    }

    else if (path.includes('/orders/') && path.includes('/cancel') && method === 'POST') {
      const id = path.split('/orders/')[1].split('/cancel')[0];
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

    else if (path.includes('/orders/') && method === 'PUT') {
      const id = path.split('/orders/')[1].split('?')[0];
      const index = cache.orders.findIndex(o => o.id === id);
      if (index === -1) {
        statusCode = 404;
        responseData = { error: "Order not found" };
      } else {
        cache.orders[index] = { ...cache.orders[index], ...body };
        await saveToAll(cache);
        responseData = cache.orders[index];
      }
    }

    else if (path.includes('/orders/') && method === 'DELETE') {
      const id = path.split('/orders/')[1].split('?')[0];
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

    else if (path.includes('/orders/latest') && method === 'GET') {
      const orders = cache.orders || [];
      if (!orders.length) {
        responseData = { latestOrderId: null, latestTimestamp: null };
      } else {
        const latest = orders[orders.length - 1];
        responseData = { latestOrderId: latest.id, latestTimestamp: latest.createdAt };
      }
    }

    else if (path.includes('/orders/count') && method === 'GET') {
      responseData = { count: cache.orders ? cache.orders.length : 0 };
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