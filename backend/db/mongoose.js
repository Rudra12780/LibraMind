// backend/db/mongoose.js – Mongoose v9+ connection utility
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

// Connection string – fall back to local MongoDB if not provided in environment
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/libramind';

/**
 * Connects to MongoDB if not already connected.
 * Returns the Mongoose connection instance.
 * Does NOT call process.exit() – rejects the promise so calling code can handle errors gracefully.
 */
async function connect() {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    // 1 = connected, 2 = connecting
    return mongoose.connection;
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
    return mongoose.connection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = { connect, mongoose };
