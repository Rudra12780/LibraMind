const path = require('path');
const mongoose = require(path.join(process.cwd(), 'backend', 'node_modules', 'mongoose'));
require(path.join(process.cwd(), 'backend', 'node_modules', 'dotenv')).config({ path: './backend/.env' });
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/libramind';

mongoose.connect(uri, { serverSelectionTimeoutMS: 1500 }).then(async () => {
  const Book = require('./backend/models/Book');
  await Book.updateOne({ sqlite_id: 6 }, { $set: { cover_image: '/uploads/book_6_cover.svg' } });
  console.log('Updated Book 6 in MongoDB');
  process.exit(0);
}).catch((e) => {
  console.log('MongoDB not connected or offline, SQLite was updated.');
  process.exit(0);
});
