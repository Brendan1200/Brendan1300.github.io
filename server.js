// ==========================
// server.js (Node.js backend with roles)
// ==========================
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ==========================
// Middleware
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend files

// ==========================
// Data file
// ==========================
const USERS_FILE = path.join(__dirname, "data", "users.json");

// Load users from JSON, or create empty array if not exist
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
  const raw = fs.readFileSync(USERS_FILE);
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error parsing users.json, resetting file.");
    fs.writeFileSync(USERS_FILE, "[]");
    return [];
  }
}

// Save users back to JSON
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ==========================
// API Routes
// ==========================

// Register
app.post("/api/register", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const newUser = { username, password, role: role || "user" };
  users.push(newUser);
  saveUsers(users);
  res.json({ message: "Registered successfully", user: { username, role: newUser.role } });
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please fill in both username and password" });
  }

  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password!" });
  }

  res.json({
    message: "Login successful",
    username: user.username,
    role: user.role
  });
});

// Get all users (admin only)
// Optional: secure with a query param or token in future
app.get("/api/users", (req, res) => {
  const users = loadUsers();
  res.json(users.map(u => ({ username: u.username, role: u.role })));
});

// ==========================
// Start server
// ==========================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


