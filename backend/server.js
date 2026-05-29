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


// ==========================================
//        PHASE 2: MARKETPLACE ROUTES
// ==========================================

/**
 * ROUTE 4: CREATE A NEW CAMPUS LISTING
 * Secure route: Uses authMiddleware to verify the user before letting them sell an item
 */
app.post("/api/listings", authMiddleware, async (req, res) => {
  const { title, description, price, category, image_url } = req.body;
  
  // Extracted dynamically from the verified JWT payload inside authMiddleware
  const seller_id = req.user.id; 

  // Basic validation check
  if (!title || !description || !price || !category) {
    return res.status(400).json({ error: "Please fill out all required fields (title, description, price, category)" });
  }

  try {
    const newListing = await db.query(
      `INSERT INTO listings (title, description, price, category, image_url, seller_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, title, description, price, category, image_url, seller_id, status, created_at`,
      [title, description, parseFloat(price), category, image_url || null, seller_id]
    );

    res.status(201).json({
      message: "Listing posted successfully on Campus Marketplace!",
      listing: newListing.rows[0]
    });

  } catch (err) {
    console.error("Error creating listing:", err.message);
    res.status(500).json({ error: "Internal server database error while creating listing" });
  }
});

/**
 * ROUTE 5 (UPGRADED): FETCH ALL ACTIVE LISTINGS (WITH OPTIONAL CATEGORY FILTER)
 * Public route: Supports custom query filter parameters like /api/listings?category=Books
 */
app.get("/api/listings", async (req, res) => {
  const { category } = req.query;

  try {
    let queryText = `
      SELECT listings.*, users.name as seller_name, users.email as seller_email 
      FROM listings 
      JOIN users ON listings.seller_id = users.id 
      WHERE listings.status = 'available'
    `;
    const queryParams = [];

    // If a category query filter is present, securely append it to the parameterized query array
    if (category) {
      queryText += ` AND listings.category = $1`;
      queryParams.push(category);
    }

    queryText += ` ORDER BY listings.created_at DESC`;

    const activeListings = await db.query(queryText, queryParams);
    res.status(200).json(activeListings.rows);

  } catch (err) {
    console.error("Error fetching listings:", err.message);
    res.status(500).json({ error: "Internal server database error while fetching listings" });
  }
});

/**
 * ROUTE 6: FETCH A SINGLE LISTING BY ID
 * Public route: Fetches details for an individual item card layout view
 */
app.get("/api/listings/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await db.query(
      `SELECT listings.*, users.name as seller_name, users.email as seller_email 
       FROM listings 
       JOIN users ON listings.seller_id = users.id 
       WHERE listings.id = $1`,
      [id]
    );

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json(listing.rows[0]);
  } catch (err) {
    console.error("Error fetching single listing:", err.message);
    res.status(500).json({ error: "Internal server database error" });
  }
});

/**
 * ROUTE 7: DELETE A LISTING (SECURE OWNER ENFORCEMENT)
 * Secure route: Verifies user token integrity and prevents unauthorized deletions
 */
app.delete("/api/listings/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const current_user_id = req.user.id;

  try {
    // 1. Fetch listing entry to assess who owns it
    const listingCheck = await db.query("SELECT seller_id FROM listings WHERE id = $1", [id]);

    if (listingCheck.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // 2. Safety Check: Enforce data casting type equality matching
    if (parseInt(listingCheck.rows[0].seller_id) !== parseInt(current_user_id)) {
      return res.status(403).json({ error: "Unauthorized! You can only delete your own listings." });
    }

    // 3. Execution
    await db.query("DELETE FROM listings WHERE id = $1", [id]);
    res.status(200).json({ message: "Listing deleted successfully!" });

  } catch (err) {
    console.error("Error deleting listing:", err.message);
    res.status(500).json({ error: "Internal server database error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});