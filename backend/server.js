const express = require("express");
const cors = require("cors"); // Handles cross-origin requests from frontend
const bcrypt = require("bcryptjs"); // Encrypts passwords
const jwt = require("jsonwebtoken"); // NEW: For signing and verifying tokens
const db = require("./db"); // Connects to your db.js file
require("dotenv").config(); // Loads environment variables from .env

const app = express();

// Middleware
// Configure CORS for production-friendly deployment. ALLOWED_ORIGINS can be a comma-separated list
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').split(',').map(s => s.trim());
const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (like curl/postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: This origin is not allowed: ' + origin));
    }
  }
};
app.use(cors(corsOptions));
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


const http = require('http');
const { Server: IOServer } = require('socket.io');

// ------- Helper: Calculate Trust Score -------
async function calculateTrustScore(userId) {
  try {
    const numericUserId = Number(userId);
    if (Number.isNaN(numericUserId)) return null;

    // base: verified email
    const userRes = await db.query('SELECT verified FROM users WHERE id = $1', [numericUserId]);
    if (userRes.rows.length === 0) return null;
    const verified = userRes.rows[0].verified ? 20 : 0;

    // count transactions proxy: number of reviews where seller_id = userId
    const txRes = await db.query('SELECT COUNT(*) AS cnt FROM reviews WHERE seller_id = $1', [numericUserId]);
    const transactions = parseInt(txRes.rows[0].cnt || 0, 10);
    const txScore = transactions * 5;

    // positive/negative reviews
    const posRes = await db.query("SELECT COUNT(*) AS cnt FROM reviews WHERE seller_id = $1 AND rating >= 4", [numericUserId]);
    const negRes = await db.query("SELECT COUNT(*) AS cnt FROM reviews WHERE seller_id = $1 AND rating <= 2", [numericUserId]);
    const posScore = parseInt(posRes.rows[0].cnt || 0, 10) * 3;
    const negScore = parseInt(negRes.rows[0].cnt || 0, 10) * -5;

    // reports
    const rptRes = await db.query('SELECT COUNT(*) AS cnt FROM reports WHERE reporter_id IS NOT NULL AND listing_id IS NOT NULL AND status IS NOT NULL AND (SELECT seller_id FROM listings WHERE listings.id = reports.listing_id) = $1', [numericUserId]);
    const reports = parseInt(rptRes.rows[0].cnt || 0, 10);
    const rptScore = reports * -10;

    const total = verified + txScore + posScore + negScore + rptScore;

    // persist
    await db.query('UPDATE users SET trust_score = $1 WHERE id = $2', [total, numericUserId]);
    return total;
  } catch (err) {
    console.error('Error calculating trust score:', err.message);
    return null;
  }
}

// ------- User endpoints (Phase 3) -------
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userRes = await db.query('SELECT id, name, email, college, verified, trust_score, created_at FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = userRes.rows[0];

    // fetch listings
    const listingsRes = await db.query('SELECT id, title, price, category, image_url, status, created_at FROM listings WHERE seller_id = $1 AND status = $2 ORDER BY created_at DESC', [id, 'available']);
    // fetch reviews where seller_id = id
    const reviewsRes = await db.query('SELECT id, buyer_id, rating, comment, created_at FROM reviews WHERE seller_id = $1 ORDER BY created_at DESC', [id]);

    res.json({ user, listings: listingsRes.rows, reviews: reviewsRes.rows });
  } catch (err) {
    console.error('GET user error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, college, avatar } = req.body;
  // only the user can update their own profile
  if (parseInt(req.user.id) !== parseInt(id)) return res.status(403).json({ error: 'Forbidden' });
  try {
    await db.query('UPDATE users SET name = COALESCE($1, name), college = COALESCE($2, college) WHERE id = $3', [name, college, id]);
    // NOTE: avatar storage not implemented; keep URL in a profile table if needed
    const updated = await db.query('SELECT id, name, email, college, verified, trust_score, created_at FROM users WHERE id = $1', [id]);
    res.json({ user: updated.rows[0] });
  } catch (err) {
    console.error('PUT user error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ------- Reviews & Reports (Trust System) -------
app.post('/api/reviews', authMiddleware, async (req, res) => {
  const { seller_id, rating, comment, listing_id } = req.body;
  const buyer_id = req.user.id;
  if (!seller_id || !rating) return res.status(400).json({ error: 'Missing seller_id or rating' });
  try {
    const insert = await db.query('INSERT INTO reviews (buyer_id, seller_id, rating, comment, listing_id, created_at) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *', [buyer_id, seller_id, rating, comment || null, listing_id || null]);
    // Recalculate trust score for seller
    await calculateTrustScore(seller_id);
    res.status(201).json({ review: insert.rows[0] });
  } catch (err) {
    console.error('Error creating review:', err.message);
    res.status(500).json({ error: 'Internal server database error while creating review' });
  }
});

app.post('/api/reports', authMiddleware, async (req, res) => {
  const { listing_id, reason } = req.body;
  const reporter_id = req.user.id;
  if (!listing_id || !reason) return res.status(400).json({ error: 'Missing listing_id or reason' });
  try {
    const insert = await db.query('INSERT INTO reports (reporter_id, listing_id, reason, status, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING *', [reporter_id, listing_id, reason, 'open']);
    // Find seller and check report count to auto-flag
    const sellerRes = await db.query('SELECT seller_id FROM listings WHERE id = $1', [listing_id]);
    if (sellerRes.rows.length > 0) {
      const sellerId = sellerRes.rows[0].seller_id;
      const rptCountRes = await db.query('SELECT COUNT(*) AS cnt FROM reports WHERE listing_id IN (SELECT id FROM listings WHERE seller_id = $1) AND status = $2', [sellerId, 'open']);
      const rptCount = parseInt(rptCountRes.rows[0].cnt || 0, 10);
      if (rptCount >= 3) {
        // flag user: set status or soft-ban (here we set trust_score negative)
        await db.query("UPDATE users SET trust_score = COALESCE(trust_score,0) - 50 WHERE id = $1", [sellerId]);
      }
      // recalc trust
      await calculateTrustScore(sellerId);
    }
    res.status(201).json({ report: insert.rows[0] });
  } catch (err) {
    console.error('Error creating report:', err.message);
    res.status(500).json({ error: 'Internal server database error while creating report' });
  }
});

// ------- Enhance listings GET: search, price, sort, pagination -------
app.get('/api/listings', async (req, res) => {
  const { category, search, minPrice, maxPrice, sortBy, page, limit } = req.query;
  try {
    let queryText = `
      SELECT listings.*, users.name as seller_name, users.email as seller_email 
      FROM listings 
      JOIN users ON listings.seller_id = users.id 
      WHERE listings.status = 'available'
    `;
    const queryParams = [];
    let idx = 1;

    if (category) {
      queryText += ` AND listings.category = $${idx++}`;
      queryParams.push(category);
    }

    if (search) {
      queryText += ` AND (listings.title ILIKE $${idx} OR listings.description ILIKE $${idx})`;
      queryParams.push(`%${search}%`);
      idx++;
    }

    if (minPrice) {
      queryText += ` AND listings.price >= $${idx++}`;
      queryParams.push(Number(minPrice));
    }

    if (maxPrice) {
      queryText += ` AND listings.price <= $${idx++}`;
      queryParams.push(Number(maxPrice));
    }

    // Sorting
    if (sortBy === 'price-low') queryText += ` ORDER BY listings.price ASC`;
    else if (sortBy === 'price-high') queryText += ` ORDER BY listings.price DESC`;
    else if (sortBy === 'popular') queryText += ` ORDER BY listings.views DESC`;
    else queryText += ` ORDER BY listings.created_at DESC`;

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const lim = Math.max(1, parseInt(limit) || 20);
    const offset = (pageNum - 1) * lim;
    queryText += ` LIMIT $${idx++} OFFSET $${idx++}`;
    queryParams.push(lim, offset);

    const activeListings = await db.query(queryText, queryParams);
    res.status(200).json(activeListings.rows);

  } catch (err) {
    console.error('Error fetching listings (enhanced):', err.message);
    res.status(500).json({ error: 'Internal server database error while fetching listings' });
  }
});

// ------- Socket.io: Real-time Chat (Phase 4) -------
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: allowedOrigins }
});

io.on('connection', (socket) => {
  // each client should emit 'join' with their userId
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('sendMessage', async (payload) => {
    // payload: { senderId, receiverId, message, listingId }
    try {
      const { senderId, receiverId, message, listingId } = payload;
      // persist message
      await db.query('INSERT INTO messages (sender_id, receiver_id, message, timestamp) VALUES ($1,$2,$3,NOW())', [senderId, receiverId, message]);
      // emit to receiver's room
      io.to(`user_${receiverId}`).emit('receiveMessage', { senderId, message, listingId, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error('Socket message persist error:', err.message);
    }
  });
});

// Health check for deployment platforms to probe
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server (with Socket.io) running on port ${PORT}`);
});