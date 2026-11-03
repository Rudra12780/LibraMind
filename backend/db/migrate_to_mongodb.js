require('dotenv').config();
const path = require('path');
const { MongoClient } = require('mongodb');
const Database = require('better-sqlite3');

const URI = process.env.MONGODB_URI || 'mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = process.env.MONGODB_DB_NAME || 'libramind';

async function migrate() {
  const sqliteDbPath = path.join(__dirname, '..', 'libramind.db');
  console.log(`Connecting to SQLite at: ${sqliteDbPath}`);
  const sqliteDb = new Database(sqliteDbPath, { readonly: true });

  console.log(`Connecting to MongoDB Atlas Cluster...`);
  const client = new MongoClient(URI);

  try {
    await client.connect();
    console.log(`Successfully connected to MongoDB Atlas!`);
    const db = client.db(DB_NAME);

    const tables = [
      'users',
      'books',
      'book_copies',
      'loans',
      'reservations',
      'seats',
      'seat_reservations',
      'notifications',
      'wishlist',
      'visit_planner',
      'password_resets',
      'audit_logs'
    ];

    for (const tableName of tables) {
      const collection = db.collection(tableName);
      const records = sqliteDb.prepare(`SELECT * FROM "${tableName}"`).all();

      if (records.length > 0) {
        try {
          await collection.drop();
        } catch (e) {}

        const docs = records.map(r => ({
          ...r,
          sqlite_id: r.id
        }));

        const result = await collection.insertMany(docs);
        console.log(`[OK] Collection "${tableName}": synced ${result.insertedCount} documents.`);
      } else {
        await db.createCollection(tableName).catch(() => {});
        console.log(`[OK] Collection "${tableName}": created (empty).`);
      }
    }

    // Ensure Indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await db.collection('users').createIndex({ membership_id: 1 }, { unique: true }).catch(() => {});
    await db.collection('books').createIndex({ isbn: 1 }, { unique: true }).catch(() => {});
    await db.collection('book_copies').createIndex({ copy_code: 1 }, { unique: true }).catch(() => {});
    await db.collection('seats').createIndex({ seat_number: 1 }, { unique: true }).catch(() => {});

    console.log(`\nMigration completed successfully to database "${DB_NAME}".`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    sqliteDb.close();
    await client.close();
  }
}

migrate();

