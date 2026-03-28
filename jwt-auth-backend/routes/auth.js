econst express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { verifyToken } = require("../middleware/authMiddleware");

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
    const { username, email, password, fullName, phone, address, avatar } = req.body;
    console.log("📝 Register attempt:", { username, email, fullName }); // DEBUG

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
      fullName: fullName ? fullName.trim() : "",
      phone: phone ? phone.trim() : "",
      address: address ? address.trim() : "",
      avatar: avatar || "",
    };

    db.users.push(newUser);
    writeDb(db);

    console.log(`✅ New user created: ${newUser.username} (${newUser.email})`);
    
    // Return user data (excluding password)
    const { password, ...userResponse } = newUser;
    return res.status(201).json(userResponse);

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
        fullName: user.fullName || "",
        phone:    user.phone || "",
        address:  user.address || "",
        createdAt: user.createdAt,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ User logged in: ${user.username} (role: ${user.role})`);
    // Return both token and user data for frontend to use
    return res.json({ 
      token,
      user: {
        id:        user.id,
        username:  user.username,
        email:     user.email,
        fullName:  user.fullName || "",
        phone:     user.phone || "",
        address:   user.address || "",
        role:      user.role,
        avatar:    user.avatar || null,
        createdAt: user.createdAt,
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

// ── GET /api/auth/profile ─────────────────────────────────────────
router.get("/profile", verifyToken, (req, res) => {
  try {
    const db = readDb();
    const user = db.users.find((u) => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return user profile data (excluding password)
    const { password, ...userProfile } = user;
    return res.json(userProfile);
  } catch (err) {
    console.error("❌ Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/auth/profile ─────────────────────────────────────────
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { fullName, phone, address, avatar, storeName, location, bio } = req.body;
    const db = readDb();
    
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update user profile fields (including fullName, phone, address, avatar, storeName, location, bio)
    db.users[userIndex] = {
      ...db.users[userIndex],
      fullName: fullName || db.users[userIndex].fullName || "",
      phone: phone || db.users[userIndex].phone || "",
      address: address || db.users[userIndex].address || "",
      avatar: avatar || db.users[userIndex].avatar || "",
      storeName: storeName || db.users[userIndex].storeName || "",
      location: location || db.users[userIndex].location || "",
      bio: bio || db.users[userIndex].bio || "",
    };
    
    writeDb(db);
    
    const { password, ...updatedProfile } = db.users[userIndex];
    return res.json(updatedProfile);
  } catch (err) {
    console.error("❌ Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/auth/delete-account ─────────────────────────────────────
router.post("/delete-account", verifyToken, async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const db = readDb();
    // Use the user ID from the token (verified by verifyToken middleware)
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = db.users[userIndex];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Remove user from users array
    db.users.splice(userIndex, 1);

    // Also remove user's orders
    if (db.orders) {
      db.orders = db.orders.filter(order => order.userId !== req.user.id);
    }

    writeDb(db);

    console.log(`✅ Account deleted: ${user.username} (${user.email})`);
    return res.json({ message: "Account deleted successfully" });

  } catch (err) {
    console.error("❌ Delete account error:", err);
    return res.status(500).json({ message: "Server error during account deletion" });
  }
});

// ── PUT /api/auth/change-password ─────────────────────────────────────
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = db.users[userIndex];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    db.users[userIndex].password = hashedNewPassword;

    writeDb(db);

    console.log(`✅ Password changed for user: ${user.username}`);
    return res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("❌ Change password error:", err);
    return res.status(500).json({ message: "Server error during password change" });
  }
});

module.exports = router;