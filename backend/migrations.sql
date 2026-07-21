-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  buyer_id TEXT,
  seller_id TEXT,
  rating INTEGER,
  comment TEXT,
  listing_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reporter_id TEXT,
  listing_id TEXT,
  reason TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id TEXT,
  receiver_id TEXT,
  message TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Add trust_score to users if missing
ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0;

-- Ensure listings have image_url column
ALTER TABLE listings ADD COLUMN IF NOT EXISTS image_url TEXT;
