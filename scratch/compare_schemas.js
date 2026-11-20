// scratch/compare_schemas.js – Automated audit of SQLite schema vs Mongoose models
const path = require('path');
const Database = require(path.join(__dirname, '..', 'backend', 'node_modules', 'better-sqlite3'));
const { mongoose } = require('../backend/db/mongoose');

const dbPath = path.join(__dirname, '..', 'backend', 'libramind.db');
const db = new Database(dbPath, { readonly: true });

const tableModelMapping = {
  users: require('../backend/models/User'),
  books: require('../backend/models/Book'),
  book_copies: require('../backend/models/BookCopy'),
  loans: require('../backend/models/Loan'),
  reservations: require('../backend/models/Reservation'),
  seats: require('../backend/models/Seat'),
  seat_reservations: require('../backend/models/SeatReservation'),
  notifications: require('../backend/models/Notification'),
  wishlist: require('../backend/models/Wishlist'),
  visit_planner: require('../backend/models/VisitPlanner'),
  password_resets: require('../backend/models/PasswordReset'),
  audit_logs: require('../backend/models/AuditLog'),
  otps: require('../backend/models/OTP')
};

console.log('=== SQLite Table vs Mongoose Model Detailed Comparison ===\n');

let allMatch = true;

for (const [table, model] of Object.entries(tableModelMapping)) {
  const columns = db.pragma(`table_info("${table}")`);
  const schemaPaths = Object.keys(model.schema.paths);
  
  const sqliteCols = columns.map(c => c.name);
  const missingInMongoose = sqliteCols.filter(col => {
    if (col === 'id') return !schemaPaths.includes('sqlite_id');
    return !schemaPaths.includes(col);
  });

  console.log(`Table [${table}] -> Model [${model.modelName}]:`);
  console.log(`  SQLite Columns (${columns.length}): ${sqliteCols.join(', ')}`);
  if (missingInMongoose.length === 0) {
    console.log(`  ✅ All ${sqliteCols.length} SQLite columns cleanly covered in Mongoose schema!`);
  } else {
    console.log(`  ❌ Missing in Mongoose: ${missingInMongoose.join(', ')}`);
    allMatch = false;
  }
  console.log('');
}

db.close();
if (!allMatch) process.exit(1);
console.log('Comparison verification finished with 100% field coverage.');
