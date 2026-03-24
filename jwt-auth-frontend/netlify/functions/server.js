const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";
const dbPath = path.join(__dirname, '../db.json');

// Helper functions
const readDb = () => {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.users) parsed.users = [];
    if (!parsed.products) parsed.products = [];
    if (!parsed.orders) parsed.orders = [];
    return parsed;
  } catch (err) {
    return { users: [], products: [], orders: [] };
  }
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = readDb();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (db.users.some(u => u.username.trim().toLowerCase() === normalizedUsername)) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    if (db.users.some(u => u.email.trim().toLowerCase() === normalizedEmail)) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      username: username.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDb(db);
    return res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error during registration" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const db = readDb();
    const user = db.users.find(u => u.username.trim().toLowerCase() === username.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Server error during login" });
  }
});

// Products routes
app.get('/products', (req, res) => {
  try {
    const db = readDb();
    res.json(db.products);
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.post('/products', (req, res) => {
  try {
    const db = readDb();
    const newProduct = { ...req.body };
    db.products.push(newProduct);
    writeDb(db);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.put('/products/:id', (req, res) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const updatedProduct = { ...req.body };
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      db.products[index] = updatedProduct;
      writeDb(db);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete('/products/:id', (req, res) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const filteredProducts = db.products.filter(p => p.id !== id);
    if (filteredProducts.length !== db.products.length) {
      db.products = filteredProducts;
      writeDb(db);
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Orders routes
app.get('/orders', (req, res) => {
  try {
    const db = readDb();
    res.json(db.orders || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to read orders" });
  }
});

app.post('/orders', (req, res) => {
  try {
    const db = readDb();
    const order = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: "Pending"
    };
    if (!db.orders) db.orders = [];
    db.orders.push(order);
    writeDb(db);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.put('/orders/:id', (req, res) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const { status } = req.body;
    const index = db.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      db.orders[index] = { ...db.orders[index], status };
      writeDb(db);
      res.json(db.orders[index]);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.post('/orders/:id/cancel', (req, res) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const index = db.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      db.orders[index] = { ...db.orders[index], status: "Cancelled" };
      writeDb(db);
      res.json(db.orders[index]);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

app.get('/orders/latest', (req, res) => {
  try {
    const db = readDb();
    const orders = db.orders || [];
    if (orders.length === 0) {
      return res.json({ latestOrderId: null, latestTimestamp: null });
    }
    const latestOrder = orders[orders.length - 1];
    res.json({ latestOrderId: latestOrder.id, latestTimestamp: latestOrder.createdAt });
  } catch (err) {
    res.status(500).json({ error: "Failed to get latest order" });
  }
});

app.get('/orders/count', (req, res) => {
  try {
    const db = readDb();
    res.json({ count: db.orders ? db.orders.length : 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to get order count" });
  }
});

// Export express app for local testing
module.exports = app;

// Netlify Functions handler
exports.handler = async (event, context) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'OK' }),
    };
  }

  // Parse body if it's a string
  let body = event.body;
  if (body && typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  // Create mock request
  const req = {
    method: event.httpMethod,
    path: event.path,
    params: {},
    query: event.queryStringParameters || {},
    headers: event.headers || {},
    body: body || {},
  };

  // Build path params from the URL
  const pathParts = event.path.split('/').filter(Boolean);
  if (pathParts.length > 1) {
    const routeParts = pathParts.slice(1); // skip the empty first part
    // Extract id from path like /orders/123 -> params.id = 123
    if (routeParts.length >= 2 && ['orders', 'products'].includes(routeParts[0])) {
      req.params.id = routeParts[1];
    }
  }

  // Mock response object
  let responseData = null;
  let statusCode = 200;
  const res = {
    status: function(code) {
      statusCode = code;
      return this;
    },
    json: function(data) {
      responseData = data;
      return this;
    },
    send: function(data) {
      responseData = data;
      return this;
    },
    setHeader: function() {},
  };

  // Route the request manually
  const { method, path, body: reqBody, params } = req;
  
  try {
    // Auth routes
    if (path === '/api/auth/register' && method === 'POST') {
      const { username, email, password } = reqBody;
      if (!username || !email || !password) {
        statusCode = 400;
        responseData = { message: "All fields are required" };
      } else {
        const db = readDb();
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        if (db.users.some(u => u.username.trim().toLowerCase() === normalizedUsername)) {
          statusCode = 400;
          responseData = { message: "Username is already taken" };
        } else if (db.users.some(u => u.email.trim().toLowerCase() === normalizedEmail)) {
          statusCode = 400;
          responseData = { message: "Email is already registered" };
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = {
            id: Date.now().toString(),
            username: username.trim(),
            email: email.trim(),
            password: hashedPassword,
            role: "user",
            createdAt: new Date().toISOString(),
          };
          db.users.push(newUser);
          writeDb(db);
          statusCode = 201;
          responseData = { message: "Registration successful" };
        }
      }
    }
    else if (path === '/api/auth/login' && method === 'POST') {
      const { username, password } = reqBody;
      if (!username || !password) {
        statusCode = 400;
        responseData = { message: "Username and password are required" };
      } else {
        const db = readDb();
        const user = db.users.find(u => u.username.trim().toLowerCase() === username.trim().toLowerCase());
        
        if (!user) {
          statusCode = 401;
          responseData = { message: "Invalid username or password" };
        } else {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            statusCode = 401;
            responseData = { message: "Invalid username or password" };
          } else {
            const token = jwt.sign(
              { id: user.id, username: user.username, email: user.email, role: user.role },
              JWT_SECRET,
              { expiresIn: "7d" }
            );
            responseData = { token };
          }
        }
      }
    }
    // Products routes
    else if (path === '/products' && method === 'GET') {
      const db = readDb();
      responseData = db.products;
    }
    else if (path === '/products' && method === 'POST') {
      const db = readDb();
      const newProduct = { ...reqBody };
      db.products.push(newProduct);
      writeDb(db);
      statusCode = 201;
      responseData = newProduct;
    }
    else if (path.startsWith('/products/') && method === 'PUT') {
      const id = path.split('/products/')[1];
      const db = readDb();
      const index = db.products.findIndex(p => p.id === id);
      if (index !== -1) {
        db.products[index] = { ...reqBody };
        writeDb(db);
        responseData = db.products[index];
      } else {
        statusCode = 404;
        responseData = { error: "Product not found" };
      }
    }
    else if (path.startsWith('/products/') && method === 'DELETE') {
      const id = path.split('/products/')[1];
      const db = readDb();
      const filteredProducts = db.products.filter(p => p.id !== id);
      if (filteredProducts.length !== db.products.length) {
        db.products = filteredProducts;
        writeDb(db);
        responseData = { message: "Product deleted" };
      } else {
        statusCode = 404;
        responseData = { error: "Product not found" };
      }
    }
    // Orders routes
    else if (path === '/orders' && method === 'GET') {
      const db = readDb();
      responseData = db.orders || [];
    }
    else if (path === '/orders' && method === 'POST') {
      const db = readDb();
      const order = {
        id: Date.now().toString(),
        ...reqBody,
        createdAt: new Date().toISOString(),
        status: "Pending"
      };
      if (!db.orders) db.orders = [];
      db.orders.push(order);
      writeDb(db);
      statusCode = 201;
      responseData = order;
    }
    else if (path.startsWith('/orders/') && !path.includes('/cancel') && method === 'PUT') {
      const id = path.split('/orders/')[1];
      const db = readDb();
      const { status } = reqBody;
      const index = db.orders.findIndex(o => o.id === id);
      if (index !== -1) {
        db.orders[index] = { ...db.orders[index], status };
        writeDb(db);
        responseData = db.orders[index];
      } else {
        statusCode = 404;
        responseData = { error: "Order not found" };
      }
    }
    else if (path.includes('/cancel') && method === 'POST') {
      const id = path.split('/orders/')[1].split('/cancel')[0];
      const db = readDb();
      const index = db.orders.findIndex(o => o.id === id);
      if (index !== -1) {
        db.orders[index] = { ...db.orders[index], status: "Cancelled" };
        writeDb(db);
        responseData = db.orders[index];
      } else {
        statusCode = 404;
        responseData = { error: "Order not found" };
      }
    }
    else if (path === '/orders/latest' && method === 'GET') {
      const db = readDb();
      const orders = db.orders || [];
      if (orders.length === 0) {
        responseData = { latestOrderId: null, latestTimestamp: null };
      } else {
        const latestOrder = orders[orders.length - 1];
        responseData = { latestOrderId: latestOrder.id, latestTimestamp: latestOrder.createdAt };
      }
    }
    else if (path === '/orders/count' && method === 'GET') {
      const db = readDb();
      responseData = { count: db.orders ? db.orders.length : 0 };
    }
    else {
      statusCode = 404;
      responseData = { error: "Not found" };
    }
  } catch (err) {
    console.error('Handler error:', err);
    statusCode = 500;
    responseData = { error: "Internal server error" };
  }

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
    body: JSON.stringify(responseData),
  };
};
