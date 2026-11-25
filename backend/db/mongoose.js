// backend/db/mongoose.js – Mongoose v9+ connection utility
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

// Connection string – fall back to local MongoDB if not provided in environment
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/libramind';

let connectPromise = null;

/**
 * Connects to MongoDB if not already connected (serverless-safe connection caching).
 * Returns the Mongoose connection instance.
 */
async function connect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!connectPromise) {
    connectPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      })
      .then(() => {
        console.log('✅ MongoDB connected');
        return mongoose.connection;
      })
      .catch((err) => {
        connectPromise = null;
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
      });
  }
  return connectPromise;
}

module.exports = { connect, mongoose };
