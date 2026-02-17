const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

let users = [
  { id: 1, username: "admin", password: "admin123", role: "admin", name: "Katherine Guzman", email: "kathewinnnn@gmail.com", phone: "+63 962 955 6678", bio: "Yarn yarn?", storeName: "Yarniverse", location: "Pilar, Abra", avatar: "https://via.placeholder.com/150" },
  { id: 2, username: "user", password: "user123", role: "user", name: "Regular User", email: "user@test.com", phone: "", bio: "", storeName: "", location: "", avatar: "https://via.placeholder.com/150" },
  { id: 3, username: "katherine", password: "katherine123", role: "seller", name: "Katherine Guzman", email: "katherine@gmail.com", phone: "+63 962 955 6678", bio: "Passionate seller of handmade crafts and unique items.", storeName: "Yarniverse", location: "Abra, Philippines", avatar: "https://via.placeholder.com/150" }
];

let userIdCounter = 3;
const SECRET_KEY = "mySecretKey";

// REGISTER ROUTE
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.username === username || u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Username or email already exists" });
  }
  
  // Create new user
  const newUser = {
    id: userIdCounter++,
    username,
    email,
    password,
    role: "user"
  };
  
  users.push(newUser);
  res.status(201).json({ message: "User registered successfully" });
});

// LOGIN ROUTE
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    u => u.username === username && u.password === password
  );
  
  if (!user) {
    return res.status(401).json({ message: "User not Registered" });
  }
  
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
// USER DASHBOARD ROUTE
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!` });
});
// ADMIN PANEL ROUTE
router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({ message: `Hello Admin ${req.user.username}` });
});

// GET USER PROFILE ROUTE
router.get("/profile", verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// UPDATE USER PROFILE ROUTE
router.put("/profile", verifyToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const { name, email, phone, bio, storeName, location, avatar } = req.body;
  
  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    phone,
    bio,
    storeName,
    location,
    avatar
  };
  
  const { password, ...userWithoutPassword } = users[userIndex];
  res.json(userWithoutPassword);
});

// CHANGE PASSWORD ROUTE
router.put("/change-password", verifyToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const { currentPassword, newPassword } = req.body;
  
  // Verify current password
  if (users[userIndex].password !== currentPassword) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }
  
  // Update password
  users[userIndex].password = newPassword;
  
  res.json({ message: "Password changed successfully" });
});

// SETUP 2FA ROUTE
router.post("/setup-2fa", verifyToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const { method, phone, backupEmail } = req.body;
  
  // Generate a 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store 2FA settings
  users[userIndex].twoFactorAuth = {
    enabled: true,
    method: method, // 'sms' or 'email'
    phone: method === 'sms' ? phone : users[userIndex].phone,
    backupEmail: method === 'email' ? backupEmail : users[userIndex].backupEmail,
    verificationCode: verificationCode,
    verified: false
  };
  
  // In production, send the verification code via SMS or email
  console.log(`2FA Verification Code for ${users[userIndex].username}: ${verificationCode}`);
  
  res.json({ 
    message: "Verification code sent",
    method: method,
    destination: method === 'sms' ? phone : backupEmail
  });
});

// VERIFY 2FA ROUTE
router.post("/verify-2fa", verifyToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const { verificationCode } = req.body;
  
  if (!users[userIndex].twoFactorAuth) {
    return res.status(400).json({ message: "2FA not setup" });
  }
  
  if (users[userIndex].twoFactorAuth.verificationCode !== verificationCode) {
    return res.status(400).json({ message: "Invalid verification code" });
  }
  
  // Mark as verified
  users[userIndex].twoFactorAuth.verified = true;
  
  res.json({ message: "2FA enabled successfully" });
});

// GET 2FA STATUS ROUTE
router.get("/2fa-status", verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  res.json({
    enabled: user.twoFactorAuth?.enabled || false,
    verified: user.twoFactorAuth?.verified || false,
    method: user.twoFactorAuth?.method || null
  });
});

// DISABLE 2FA ROUTE
router.post("/disable-2fa", verifyToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  
  delete users[userIndex].twoFactorAuth;
  
  res.json({ message: "2FA disabled successfully" });
});

module.exports = router;
