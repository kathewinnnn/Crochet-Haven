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
const dbPath = path.join(__dirname, 'db.json');

const PORT = process.env.PORT || 5000;

// ─── DB helpers ───────────────────────────────────────────────────────────────
const readDb = () => {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.users)    parsed.users    = [];
    if (!parsed.products) parsed.products = [];
    if (!parsed.orders)   parsed.orders   = [];
    return parsed;
  } catch {
    return { users: [], products: [], orders: [] };
  }
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// ─── JWT helper — returns decoded payload or null ─────────────────────────────
const decodeToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
};

// ─── Auth routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const db = readDb();
    const normUser  = username.trim().toLowerCase();
    const normEmail = email.trim().toLowerCase();

    if (db.users.some(u => u.username.trim().toLowerCase() === normUser))
      return res.status(400).json({ message: "Username is already taken" });
    if (db.users.some(u => u.email.trim().toLowerCase() === normEmail))
      return res.status(400).json({ message: "Email is already registered" });

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
  } catch {
    return res.status(500).json({ message: "Server error during registration" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password are required" });

    const db   = readDb();
    const user = db.users.find(u => u.username.trim().toLowerCase() === username.trim().toLowerCase());
    if (!user) return res.status(401).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({ token });
  } catch {
    return res.status(500).json({ message: "Server error during login" });
  }
});

app.get('/api/auth/check-username', (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username is required" });
    const db = readDb();
    const taken = db.users.some(u => u.username.trim().toLowerCase() === username.trim().toLowerCase());
    return res.json({ available: !taken });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// ─── DELETE account ───────────────────────────────────────────────────────────
// POST (not DELETE) so Netlify Functions can read the body reliably.
// Frontend sends { username, password } — no JWT required so even an
// expired token doesn't block the user from deleting their account.
app.post('/api/auth/delete-account', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password are required" });

    const db   = readDb();
    const idx  = db.users.findIndex(
      u => u.username.trim().toLowerCase() === username.trim().toLowerCase()
    );
    if (idx === -1)
      return res.status(404).json({ message: "Account not found" });

    const user    = db.users[idx];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password. Please try again." });

    // Remove the user and all their orders from the DB
    db.users  = db.users.filter((_, i) => i !== idx);
    db.orders = db.orders.filter(o => o.userId !== user.id);
    writeDb(db);

    return res.json({ message: "Account deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Server error during account deletion" });
  }
});

// ─── Products routes ──────────────────────────────────────────────────────────
app.get('/products', (req, res) => {
  try { res.json(readDb().products); }
  catch { res.status(500).json({ error: "Failed to read products" }); }
});

app.post('/products', (req, res) => {
  try {
    const db = readDb();
    const newProduct = { ...req.body };
    db.products.push(newProduct);
    writeDb(db);
    res.status(201).json(newProduct);
  } catch { res.status(500).json({ error: "Failed to add product" }); }
});

app.put('/products/:id', (req, res) => {
  try {
    const db    = readDb();
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Product not found" });
    db.products[index] = { ...req.body };
    writeDb(db);
    res.json(db.products[index]);
  } catch { res.status(500).json({ error: "Failed to update product" }); }
});

app.delete('/products/:id', (req, res) => {
  try {
    const db       = readDb();
    const filtered = db.products.filter(p => p.id !== req.params.id);
    if (filtered.length === db.products.length)
      return res.status(404).json({ error: "Product not found" });
    db.products = filtered;
    writeDb(db);
    res.json({ message: "Product deleted" });
  } catch { res.status(500).json({ error: "Failed to delete product" }); }
});

// ─── Orders routes ────────────────────────────────────────────────────────────
app.get('/orders', (req, res) => {
  try {
    const decoded = decodeToken(req.headers.authorization);
    const db      = readDb();
    const all     = db.orders || [];
    if (decoded?.role === 'admin') return res.json(all);
    if (decoded?.id) return res.json(all.filter(o => o.userId === decoded.id));
    return res.json([]);
  } catch {
    res.status(500).json({ error: "Failed to read orders" });
  }
});

app.post('/orders', (req, res) => {
  try {
    const decoded = decodeToken(req.headers.authorization);
    const db      = readDb();
    const order = {
      id:        Date.now().toString(),
      userId:    decoded?.id       || null,
      username:  decoded?.username || null,
      ...req.body,
      createdAt: new Date().toISOString(),
      status:    "Pending",
    };
    if (!db.orders) db.orders = [];
    db.orders.push(order);
    writeDb(db);
    res.status(201).json(order);
  } catch {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get('/orders/latest', (req, res) => {
  try {
    const db     = readDb();
    const orders = db.orders || [];
    if (orders.length === 0)
      return res.json({ latestOrderId: null, latestTimestamp: null });
    const latest = orders[orders.length - 1];
    res.json({ latestOrderId: latest.id, latestTimestamp: latest.createdAt });
  } catch { res.status(500).json({ error: "Failed to get latest order" }); }
});

app.get('/orders/count', (req, res) => {
  try {
    const db = readDb();
    res.json({ count: db.orders ? db.orders.length : 0 });
  } catch { res.status(500).json({ error: "Failed to get order count" }); }
});

app.put('/orders/:id', (req, res) => {
  try {
    const db    = readDb();
    const index = db.orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Order not found" });
    db.orders[index] = { ...db.orders[index], status: req.body.status };
    writeDb(db);
    res.json(db.orders[index]);
  } catch { res.status(500).json({ error: "Failed to update order" }); }
});

app.post('/orders/:id/cancel', (req, res) => {
  try {
    const db    = readDb();
    const index = db.orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Order not found" });
    db.orders[index] = { ...db.orders[index], status: "Cancelled" };
    writeDb(db);
    res.json(db.orders[index]);
  } catch { res.status(500).json({ error: "Failed to cancel order" }); }
});

module.exports = app;

// ─── Netlify Functions handler ────────────────────────────────────────────────
exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: 'OK' }) };
  }

  let body = event.body;
  if (body && typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body) body = {};

  const authHeader = (event.headers || {}).authorization || (event.headers || {}).Authorization || '';
  const decoded    = decodeToken(authHeader);

  const p      = event.path;
  const method = event.httpMethod;

  let responseData = null;
  let statusCode   = 200;

  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    if (p === '/api/auth/register' && method === 'POST') {
      const { username, email, password } = body;
      if (!username || !email || !password) {
        statusCode = 400; responseData = { message: "All fields are required" };
      } else {
        const db        = readDb();
        const normUser  = username.trim().toLowerCase();
        const normEmail = email.trim().toLowerCase();
        if (db.users.some(u => u.username.trim().toLowerCase() === normUser)) {
          statusCode = 400; responseData = { message: "Username is already taken" };
        } else if (db.users.some(u => u.email.trim().toLowerCase() === normEmail)) {
          statusCode = 400; responseData = { message: "Email is already registered" };
        } else {
          const hashed  = await bcrypt.hash(password, 10);
          const newUser = { id: Date.now().toString(), username: username.trim(), email: email.trim(), password: hashed, role: "user", createdAt: new Date().toISOString() };
          db.users.push(newUser); writeDb(db);
          statusCode = 201; responseData = { message: "Registration successful" };
        }
      }
    }

    else if (p === '/api/auth/login' && method === 'POST') {
      const { username, password } = body;
      if (!username || !password) {
        statusCode = 400; responseData = { message: "Username and password are required" };
      } else {
        const db   = readDb();
        const user = db.users.find(u => u.username.trim().toLowerCase() === username.trim().toLowerCase());
        if (!user) {
          statusCode = 401; responseData = { message: "Invalid username or password" };
        } else {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            statusCode = 401; responseData = { message: "Invalid username or password" };
          } else {
            const token = jwt.sign(
              { id: user.id, username: user.username, email: user.email, role: user.role },
              JWT_SECRET, { expiresIn: "7d" }
            );
            responseData = { token };
          }
        }
      }
    }

    else if (p.startsWith('/api/auth/check-username') && method === 'GET') {
      const username = (event.queryStringParameters || {}).username;
      if (!username) { statusCode = 400; responseData = { message: "Username required" }; }
      else {
        const db    = readDb();
        const taken = db.users.some(u => u.username.trim().toLowerCase() === username.trim().toLowerCase());
        responseData = { available: !taken };
      }
    }

    // ── DELETE ACCOUNT ────────────────────────────────────────────────────────
    // Uses POST so Netlify can reliably read the request body.
    // Expects { username, password } — verifies password against the stored
    // bcrypt hash, then removes the user + all their orders from db.json.
    else if (p === '/api/auth/delete-account' && method === 'POST') {
      const { username, password, email } = body;
      if (!password) {
        statusCode = 400; responseData = { message: "Password is required" };
      } else {
        const db  = readDb();
        // Find user by username OR email
        let idx = -1;
        let user = null;
        
        if (username) {
          idx = db.users.findIndex(
            u => u.username.trim().toLowerCase() === username.trim().toLowerCase()
          );
        }
        
        // If not found by username, try email
        if (idx === -1 && email) {
          idx = db.users.findIndex(
            u => u.email && u.email.trim().toLowerCase() === email.trim().toLowerCase()
          );
        }
        
        if (idx === -1) {
          statusCode = 404; responseData = { message: "Account not found" };
        } else {
          user    = db.users[idx];
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            statusCode = 401; responseData = { message: "Incorrect password. Please try again." };
          } else {
            db.users  = db.users.filter((_, i) => i !== idx);
            db.orders = db.orders.filter(o => o.userId !== user.id);
            writeDb(db);
            responseData = { message: "Account deleted successfully" };
          }
        }
      }
    }

    // ── Products ──────────────────────────────────────────────────────────────
    else if (p === '/products' && method === 'GET') {
      responseData = readDb().products;
    }
    else if (p === '/products' && method === 'POST') {
      const db = readDb(); const np = { ...body }; db.products.push(np); writeDb(db); statusCode = 201; responseData = np;
    }
    else if (p.startsWith('/products/') && method === 'PUT') {
      const id = p.split('/products/')[1]; const db = readDb();
      const i  = db.products.findIndex(p => p.id === id);
      if (i === -1) { statusCode = 404; responseData = { error: "Product not found" }; }
      else { db.products[i] = { ...body }; writeDb(db); responseData = db.products[i]; }
    }
    else if (p.startsWith('/products/') && method === 'DELETE') {
      const id = p.split('/products/')[1]; const db = readDb();
      const f  = db.products.filter(p => p.id !== id);
      if (f.length === db.products.length) { statusCode = 404; responseData = { error: "Product not found" }; }
      else { db.products = f; writeDb(db); responseData = { message: "Product deleted" }; }
    }

    // ── Orders ────────────────────────────────────────────────────────────────
    else if (p === '/orders/latest' && method === 'GET') {
      const db = readDb(); const orders = db.orders || [];
      if (!orders.length) responseData = { latestOrderId: null, latestTimestamp: null };
      else { const l = orders[orders.length - 1]; responseData = { latestOrderId: l.id, latestTimestamp: l.createdAt }; }
    }

    else if (p === '/orders/count' && method === 'GET') {
      const db = readDb(); responseData = { count: db.orders ? db.orders.length : 0 };
    }

    else if (p === '/orders' && method === 'GET') {
      const db  = readDb();
      const all = db.orders || [];
      if (decoded?.role === 'admin') responseData = all;
      else if (decoded?.id) responseData = all.filter(o => o.userId === decoded.id);
      else responseData = [];
    }

    else if (p === '/orders' && method === 'POST') {
      const db    = readDb();
      const order = {
        id:       Date.now().toString(),
        userId:   decoded?.id       || null,
        username: decoded?.username || null,
        ...body,
        createdAt: new Date().toISOString(),
        status:    "Pending",
      };
      if (!db.orders) db.orders = [];
      db.orders.push(order); writeDb(db);
      statusCode = 201; responseData = order;
    }

    else if (p.startsWith('/orders/') && p.includes('/cancel') && method === 'POST') {
      const id = p.split('/orders/')[1].split('/cancel')[0];
      const db = readDb(); const i = db.orders.findIndex(o => o.id === id);
      if (i === -1) { statusCode = 404; responseData = { error: "Order not found" }; }
      else { db.orders[i] = { ...db.orders[i], status: "Cancelled" }; writeDb(db); responseData = db.orders[i]; }
    }

    else if (p.startsWith('/orders/') && method === 'PUT') {
      const id = p.split('/orders/')[1];
      const db = readDb(); const i = db.orders.findIndex(o => o.id === id);
      if (i === -1) { statusCode = 404; responseData = { error: "Order not found" }; }
      else { db.orders[i] = { ...db.orders[i], status: body.status }; writeDb(db); responseData = db.orders[i]; }
    }

    else { statusCode = 404; responseData = { error: "Not found" }; }

  } catch (err) {
    console.error('Handler error:', err);
    statusCode = 500; responseData = { error: "Internal server error" };
  }

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(responseData),
  };
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});