// backend/db/demoAccounts.js
// Idempotently ensures the three public demo accounts exist in every
// backing store (MongoDB when connected, SQLite when available).
// Safe to call on every server / serverless cold start.

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User');

let sqliteDb = null;
try {
  sqliteDb = require('./database');
} catch (err) {
  console.warn('SQLite unavailable for demo account bootstrap:', err.message);
}

const DEMO_ACCOUNTS = [
  {
    name: 'Aarav Sharma',
    email: 'student@libramind.edu',
    password: 'Student@123',
    role: 'student',
    membership_id: 'STU-1001',
    interests: 'Fiction & Literature, Philosophy, AI & Technology'
  },
  {
    name: 'Marcus Thorne',
    email: 'librarian@libramind.edu',
    password: 'Librarian@123',
    role: 'librarian',
    membership_id: 'LIB-5001',
    interests: 'Cataloging, Archival Preservation, Circulation Operations'
  },
  {
    name: 'Dr. Eleanor Vance',
    email: 'admin@libramind.edu',
    password: 'Admin@123',
    role: 'admin',
    membership_id: 'ADM-9001',
    interests: 'Library Administration, System Governance, Security'
  }
];

async function ensureMongoDemoAccounts(summary) {
  if (mongoose.connection.readyState !== 1) return;

  for (const account of DEMO_ACCOUNTS) {
    try {
      const existing = await User.findOne({ email: account.email }).maxTimeMS(4000);
      if (existing) {
        let dirty = false;
        if (existing.role !== account.role) {
          existing.role = account.role;
          dirty = true;
        }
        if (!existing.membership_id) {
          existing.membership_id = account.membership_id;
          dirty = true;
        }
        if (dirty) await existing.save();
        continue;
      }

      await User.create({
        name: account.name,
        email: account.email,
        password_hash: bcrypt.hashSync(account.password, 10),
        role: account.role,
        membership_id: account.membership_id,
        interests: account.interests,
        phone_verified: true,
        created_at: new Date()
      });
      summary.mongo.push(account.email);
    } catch (err) {
      console.warn(`Demo account bootstrap (Mongo) skipped ${account.email}:`, err.message);
    }
  }
}

function ensureSqliteDemoAccounts(summary) {
  if (!sqliteDb) return;

  for (const account of DEMO_ACCOUNTS) {
    try {
      const row = sqliteDb
        .prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)')
        .get(account.email);
      if (row) continue;

      sqliteDb.prepare(`
        INSERT INTO users (name, email, password_hash, role, membership_id, interests, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        account.name,
        account.email,
        bcrypt.hashSync(account.password, 10),
        account.role,
        account.membership_id,
        account.interests
      );
      summary.sqlite.push(account.email);
    } catch (err) {
      console.warn(`Demo account bootstrap (SQLite) skipped ${account.email}:`, err.message);
    }
  }
}

/**
 * Create any missing demo accounts. Never throws.
 * @returns {Promise<{mongo: string[], sqlite: string[], skipped: boolean}>}
 */
async function ensureDemoAccounts() {
  const summary = { mongo: [], sqlite: [], skipped: false };

  if (mongoose.connection.readyState !== 1 && !sqliteDb) {
    summary.skipped = true;
    return summary;
  }

  await ensureMongoDemoAccounts(summary);
  ensureSqliteDemoAccounts(summary);

  if (summary.mongo.length || summary.sqlite.length) {
    console.log(
      `[Demo accounts] created: ${[...summary.mongo, ...summary.sqlite].join(', ')}`
    );
  }

  return summary;
}

module.exports = { DEMO_ACCOUNTS, ensureDemoAccounts };
