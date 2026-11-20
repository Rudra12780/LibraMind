import { mongoose } from '../backend/db/mongoose.js';
import BookCopy from '../backend/models/BookCopy.js';
import Book from '../backend/models/Book.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const copies = await db.collection('book_copies').find({}).toArray();
  console.log(`Total book_copies: ${copies.length}`);

  let numericBookIdCount = 0;
  for (const c of copies) {
    if (typeof c.book_id === 'number' || !mongoose.Types.ObjectId.isValid(String(c.book_id))) {
      numericBookIdCount++;
    }
  }
  console.log(`Copies with numeric or invalid ObjectId book_id: ${numericBookIdCount}`);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
