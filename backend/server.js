const express = require("express");
const cors = require("cors"); // Handles cross-origin requests from frontend
const bcrypt = require("bcryptjs"); // Encrypts passwords
const jwt = require("jsonwebtoken"); // NEW: For signing and verifying tokens
const db = require("./db"); // Connects to your db.js file
require("dotenv").config(); // Loads environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to read JSON bodies in requests

// Your existing home route
app.get("/", (req, res) => {
  res.send("Campus Marketplace Backend Running");
});

// ==========================================
// ROUTE 1: The Registration Route (Updated with JWT)
// ==========================================
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill out all fields" });
  }

  try {
    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];

    // NEW: Generate a token right after registration so they are automatically logged in
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" } // Token expires automatically in 1 day
    );

    res.status(201).json({
      message: "User registered successfully!",
      token, // Returning the secure token
      user
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server database error" });
  }
});

// ==========================================
// ROUTE 2: The Login Route (Updated with JWT)
// ==========================================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide both email and password" });
  }

  try {
    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (userCheck.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userCheck.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // NEW: Generate a secure token containing the user's ID and email payload
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    delete user.password; 

    res.status(200).json({
      message: "Login successful!",
      token, // Returning the secure token to the client
      user
    });

  } catch (err) {
    console.error("Login database error:", err.message);
    res.status(500).json({ error: "Internal server database error" });
  }
});

// ==========================================
// NEW MIDDLEWARE: Authentication Guard
// ==========================================
// This intercepts requests to secure routes and verifies their token wristband
const authMiddleware = (req, res, next) => {
  // Grab token from the 'Authorization' header (Format: Bearer <token>)
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Decrypt and verify token structure against our JWT_SECRET
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Append user data payload (id, email) to request object
    next(); // Pass control forward to the actual route handler
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

// ==========================================
// ROUTE 3: NEW: Test Protected Route
// ==========================================
// Only users with a valid token can hit this endpoint successfully
app.get("/api/protected-test", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to the secret marketplace area!",
    authenticatedUser: req.user // Displays the data extracted from the token
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});