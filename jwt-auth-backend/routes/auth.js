const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";
const dbPath = path.join(__dirname, "../db.json");

// ── Helpers ──────────────────────────────────────────────────────────
const readDb = () => {
  try {
    const raw = fs.readFileSync(dbPath, "utf8");
    console.log("📂 Raw db.json contents:", raw); // DEBUG
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.users)) {
      console.log("⚠️  No users array found — initializing empty array");
      parsed.users = [];
      // Write it back immediately so the file is fixed
      fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (err) {
    console.error("❌ Error reading db.json:", err.message);
    // If file is missing/corrupt, create it fresh
    const fresh = { users: [], products: [], orders: [] };
    fs.writeFileSync(dbPath, JSON.stringify(fresh, null, 2));
    return fresh;
  }
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// ── POST /api/auth/register ──────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📝 Register attempt:", { username, email }); // DEBUG

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = readDb();
    console.log("👥 Current users in db:", db.users.map(u => ({ username: u.username, email: u.email }))); // DEBUG

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Check username
    const usernameTaken = db.users.some(
      (u) => u.username.trim().toLowerCase() === normalizedUsername
    );
    console.log(`🔍 Username "${normalizedUsername}" taken?`, usernameTaken); // DEBUG

    if (usernameTaken) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Check email
    const emailTaken = db.users.some(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );
    console.log(`🔍 Email "${normalizedEmail}" taken?`, emailTaken); // DEBUG

    if (emailTaken) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create user
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

    console.log(`✅ New user created: ${newUser.username} (${newUser.email})`);
    return res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const db = readDb();

    const user = db.users.find(
      (u) => u.username.trim().toLowerCase() === username.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id:       user.id,
        username: user.username,
        email:    user.email,
        role:     user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ User logged in: ${user.username} (role: ${user.role})`);
    return res.json({ token });

  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;