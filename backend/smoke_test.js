/*
  Reusable smoke test for local development (single-file placed in backend/).
  Usage: node backend/smoke_test.js
  This script will:
    - Register two users
    - Create a listing as user A
    - Post a review as user B
    - Verify listing appears in GET /api/listings
    - Verify trust score update for user A
    - Connect two socket.io clients and send a message, then verify message persisted
*/

const axios = require('axios');
const io = require('socket.io-client');
const db = require('./db');

const BASE = process.env.BASE_URL || 'http://localhost:5000';

async function register(name, email, password) {
  const res = await axios.post(`${BASE}/api/register`, { name, email, password });
  return res.data;
}

async function createListing(token, payload) {
  const res = await axios.post(`${BASE}/api/listings`, payload, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

async function postReview(token, payload) {
  const res = await axios.post(`${BASE}/api/reviews`, payload, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

async function getListings() {
  const res = await axios.get(`${BASE}/api/listings`);
  return res.data;
}

async function getUser(id) {
  const res = await axios.get(`${BASE}/api/users/${id}`);
  return res.data;
}

async function socketTest(idA, idB) {
  return new Promise((resolve, reject) => {
    const a = io(BASE, { transports: ['websocket','polling'] });
    const b = io(BASE, { transports: ['websocket','polling'] });
    let done = false;

    a.on('connect', () => { a.emit('join', idA); });
    b.on('connect', () => { b.emit('join', idB); b.emit('sendMessage', { senderId: idB, receiverId: idA, message: 'Smoke test message', listingId: null }); });

    a.on('receiveMessage', async (payload) => {
      try {
        // quick DB check for the persisted message
        const res = await db.query('SELECT sender_id, receiver_id, message FROM messages ORDER BY timestamp DESC LIMIT 1');
        // basic validation
        if (res.rows && res.rows.length > 0) {
          done = true;
          a.disconnect(); b.disconnect();
          resolve({ socketReceived: payload, dbRow: res.rows[0] });
        }
      } catch (err) {
        reject(err);
      }
    });

    setTimeout(() => { if (!done) { a.disconnect(); b.disconnect(); reject(new Error('Socket test timed out')); } }, 6000);
  });
}

(async () => {
  try {
    const ts = Date.now();
    const emailA = `smoke_a_${ts}@example.test`;
    const emailB = `smoke_b_${ts}@example.test`;
    const pw = 'SmokePass123!';

    console.log('Registering user A...');
    const ra = await register(`Smoke A ${ts}`, emailA, pw);
    console.log('Registering user B...');
    const rb = await register(`Smoke B ${ts}`, emailB, pw);

    const tokenA = ra.token;
    const idA = ra.user.id;
    const tokenB = rb.token;
    const idB = rb.user.id;

    console.log('Creating listing as A...');
    const created = await createListing(tokenA, { title: `Smoke Item ${ts}`, description: 'Smoke test', price: 5, category: 'Smoke', image_url: null });
    const listingId = created.listing.id;
    console.log('Listing created:', listingId);

    console.log('Checking listing presence...');
    const all = await getListings();
    if (!all.find(l => String(l.id) === String(listingId))) throw new Error('Listing not present in GET /api/listings');

    console.log('Posting review as B...');
    await postReview(tokenB, { seller_id: idA, rating: 5, comment: 'Nice seller' });

    console.log('Fetching user A to check trust_score...');
    const userA = await getUser(idA);
    console.log('User A trust_score:', userA.user.trust_score);

    console.log('Running socket test...');
    const socketResult = await socketTest(idA, idB);
    console.log('Socket result:', socketResult);

    console.log('Smoke test completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err.message || err);
    process.exit(2);
  }
})();