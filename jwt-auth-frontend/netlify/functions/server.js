const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

const EMBEDDED_DATA = {
  users: [
    { id: "1", username: "admin", email: "admin@admin.com", password: "$2b$10$8fF0dor3JqNqLGiLN6ks6OgFFBjR5Qu0/RtgGbJ2lt1Hf41yw3Ooi", role: "admin", createdAt: "2024-01-01T00:00:00.000Z" },
    { id: "2", username: "testuser", email: "test@test.com", password: "$2b$10$8fF0dor3JqNqLGiLN6ks6OgFFBjR5Qu0/RtgGbJ2lt1Hf41yw3Ooi", role: "user", createdAt: "2026-03-24T10:14:36.506Z" }
  ],
  products: [
    { id: "1", name: "Crochet Keychain", description: "Handmade crochet keychain", price: "50", category: "Accessories" },
    { id: "2", name: "Crochet Tote Bags", description: "Stylish tote bag", price: "200", category: "Bags" },
    { id: "3", name: "Crochet Scarf", description: "Warm scarf", price: "150", category: "Clothing" }
  ],
  orders: []
};

let cache = { ...EMBEDDED_DATA };

const readDb = () => cache;
const writeDb = (data) => { cache = data; };

const decodeToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
};

exports.handler = async (event, context) => {
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
              { id: user.id, username: user.username, role: user.role },
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
      const { username, email, password } = body;
      if (!username || !email || !password) {
        statusCode = 400;
        responseData = { message: "All fields required" };
      } else {
        if (cache.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
          statusCode = 400;
          responseData = { message: "Username taken" };
        } else {
          const hashed = await bcrypt.hash(password, 10);
          const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashed,
            role: "user",
            createdAt: new Date().toISOString()
          };
          cache.users.push(newUser);
          const { password: _, ...userWithoutPassword } = newUser;
          responseData = { message: "Registration successful", ...userWithoutPassword };
        }
      }
    }

    else if (path.includes('/products') && method === 'GET') {
      responseData = cache.products;
    }

    else if (path.includes('/orders') && method === 'GET') {
      responseData = cache.orders || [];
    }

    else if (path.includes('/orders') && method === 'POST') {
      const decoded = decodeToken(authHeader);
      const order = {
        id: Date.now().toString(),
        userId: decoded?.id || null,
        ...body,
        createdAt: new Date().toISOString(),
        status: "Processing"
      };
      if (!cache.orders) cache.orders = [];
      cache.orders.push(order);
      statusCode = 201;
      responseData = order;
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
