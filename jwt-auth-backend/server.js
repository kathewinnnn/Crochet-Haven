const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors()); // Allow all origins for development
app.use(express.json({ limit: '10mb' }));
app.use("/api/auth", authRoutes);

const dbPath = path.join(__dirname, "db.json");

// Helper function to read db.json
const readDb = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

// Helper function to write to db.json
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Products routes
app.get("/products", (req, res) => {
  try {
    const db = readDb();
    res.json(db.products);
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.post("/products", (req, res) => {
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

app.put("/products/:id", (req, res) => {
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

app.delete("/products/:id", (req, res) => {
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
app.get("/orders", (req, res) => {
  try {
    const db = readDb();
    res.json(db.orders || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to read orders" });
  }
});

app.post("/orders", (req, res) => {
  try {
    const db = readDb();
    const order = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: "Pending"
    };
    if (!db.orders) {
      db.orders = [];
    }
    db.orders.push(order);
    writeDb(db);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.put("/orders/:id", (req, res) => {
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

app.post("/orders/:id/cancel", (req, res) => {
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

// Delete order
app.delete("/orders/:id", (req, res) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const index = db.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      db.orders.splice(index, 1);
      writeDb(db);
      res.json({ message: "Order deleted successfully" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Delete account endpoint
app.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    
    // Decode the token to get user info
    const jwt = require("jsonwebtoken");
    const SECRET_KEY = process.env.JWT_SECRET || "mySecretKey";
    
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === decoded.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const user = db.users[userIndex];
    
    // Verify password
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    
    // Remove user from users array
    db.users.splice(userIndex, 1);
    
    // Also remove user's orders
    if (db.orders) {
      db.orders = db.orders.filter(order => order.userId !== decoded.id);
    }
    
    writeDb(db);
    
    console.log(`✅ Account deleted: ${user.username} (${user.email})`);
    return res.json({ message: "Account deleted successfully" });

  } catch (err) {
    console.error("❌ Delete account error:", err);
    return res.status(500).json({ message: "Server error during account deletion" });
  }
};

// Account deletion route
app.post("/api/auth/delete-account", (req, res) => app.deleteAccount(req, res));

// Get latest order (for polling)
app.get("/orders/latest", (req, res) => {
  try {
    const db = readDb();
    const orders = db.orders || [];
    if (orders.length === 0) {
      return res.json({ latestOrderId: null, latestTimestamp: null });
    }
    // Get the most recent order
    const latestOrder = orders[orders.length - 1];
    res.json({
      latestOrderId: latestOrder.id,
      latestTimestamp: latestOrder.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get latest order" });
  }
});

// Get order count (for polling)
app.get("/orders/count", (req, res) => {
  try {
    const db = readDb();
    const orders = db.orders || [];
    res.json({ count: orders.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to get order count" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
