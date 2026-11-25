// backend/db/seedSeats.js
// Seeds study pod seats if none exist in MongoDB or SQLite.
// Safe to call on every server / serverless cold start.

const mongoose = require('mongoose');
const Seat = require('../models/Seat');

let sqliteDb = null;
try {
  sqliteDb = require('./database');
} catch (err) {
  // SQLite not available (Vercel serverless)
}

// Canonical seat layout matching seed.js — 16 seats across 4 sections, 2 floors
const SEAT_CONFIGS = [
  // Floor 1 - Quiet Study Zone
  { seat_number: 'F1-Q01', floor: 'Floor 1', section: 'Quiet Study Zone',     has_power: 1, has_monitor: 0, status: 'available' },
  { seat_number: 'F1-Q02', floor: 'Floor 1', section: 'Quiet Study Zone',     has_power: 1, has_monitor: 1, status: 'available' },
  { seat_number: 'F1-Q03', floor: 'Floor 1', section: 'Quiet Study Zone',     has_power: 1, has_monitor: 0, status: 'available' },
  { seat_number: 'F1-Q04', floor: 'Floor 1', section: 'Quiet Study Zone',     has_power: 0, has_monitor: 0, status: 'available' },
  { seat_number: 'F1-Q05', floor: 'Floor 1', section: 'Quiet Study Zone',     has_power: 1, has_monitor: 1, status: 'available' },
  // Floor 1 - Collaborative Hub
  { seat_number: 'F1-C01', floor: 'Floor 1', section: 'Collaborative Hub',    has_power: 1, has_monitor: 0, status: 'available' },
  { seat_number: 'F1-C02', floor: 'Floor 1', section: 'Collaborative Hub',    has_power: 1, has_monitor: 0, status: 'available' },
  { seat_number: 'F1-C03', floor: 'Floor 1', section: 'Collaborative Hub',    has_power: 1, has_monitor: 1, status: 'available' },
  { seat_number: 'F1-C04', floor: 'Floor 1', section: 'Collaborative Hub',    has_power: 0, has_monitor: 0, status: 'available' },
  // Floor 2 - Garden Window Pods
  { seat_number: 'F2-G01', floor: 'Floor 2', section: 'Garden Window Pods',   has_power: 1, has_monitor: 1, status: 'available' },
  { seat_number: 'F2-G02', floor: 'Floor 2', section: 'Garden Window Pods',   has_power: 1, has_monitor: 1, status: 'available' },
  { seat_number: 'F2-G03', floor: 'Floor 2', section: 'Garden Window Pods',   has_power: 1, has_monitor: 0, status: 'available' },
  { seat_number: 'F2-G04', floor: 'Floor 2', section: 'Garden Window Pods',   has_power: 1, has_monitor: 0, status: 'available' },
  // Floor 2 - Research Nook
  { seat_number: 'F2-R01', floor: 'Floor 2', section: 'Research Nook',        has_power: 1, has_monitor: 1, status: 'available' },
  { seat_number: 'F2-R02', floor: 'Floor 2', section: 'Research Nook',        has_power: 1, has_monitor: 1, status: 'available' },
  { seat_number: 'F2-R03', floor: 'Floor 2', section: 'Research Nook',        has_power: 1, has_monitor: 0, status: 'maintenance' },
];

async function ensureMongoSeats() {
  if (mongoose.connection.readyState !== 1) return 0;
  try {
    const count = await Seat.countDocuments().maxTimeMS(4000);
    if (count > 0) return 0; // already seeded

    const docs = SEAT_CONFIGS.map((s, i) => ({
      ...s,
      sqlite_id: i + 1,
      current_user_id: null,
      sqlite_current_user_id: null,
      created_at: new Date()
    }));
    await Seat.insertMany(docs, { ordered: false });
    console.log(`[Seat Seeder] Inserted ${docs.length} study pod seats into MongoDB`);
    return docs.length;
  } catch (err) {
    if (err.code === 11000) return 0; // duplicate key — seats already exist
    console.warn('[Seat Seeder] MongoDB seat seed warning:', err.message);
    return 0;
  }
}

function ensureSqliteSeats() {
  if (!sqliteDb) return 0;
  try {
    const row = sqliteDb.prepare('SELECT COUNT(*) as c FROM seats').get();
    if (row && row.c > 0) return 0; // already seeded

    const insert = sqliteDb.prepare(`
      INSERT OR IGNORE INTO seats (seat_number, floor, section, has_power, has_monitor, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertMany = sqliteDb.transaction((rows) => {
      for (const s of rows) {
        insert.run(s.seat_number, s.floor, s.section, s.has_power, s.has_monitor, s.status);
      }
    });
    insertMany(SEAT_CONFIGS);
    console.log(`[Seat Seeder] Inserted ${SEAT_CONFIGS.length} study pod seats into SQLite`);
    return SEAT_CONFIGS.length;
  } catch (err) {
    console.warn('[Seat Seeder] SQLite seat seed warning:', err.message);
    return 0;
  }
}

async function ensureSeats() {
  const mongo = await ensureMongoSeats();
  const sqlite = ensureSqliteSeats();
  return { mongo, sqlite };
}

module.exports = { ensureSeats, SEAT_CONFIGS };
