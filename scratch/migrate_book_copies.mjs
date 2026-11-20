import { mongoose } from '../backend/db/mongoose.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const books = await db.collection('books').find({}).toArray();
  const bookMapBySqliteId = new Map();
  const bookMapByMongoId = new Map();

  for (const b of books) {
    if (b.sqlite_id !== undefined && b.sqlite_id !== null) {
      bookMapBySqliteId.set(Number(b.sqlite_id), b._id);
    }
    if (b.id !== undefined && b.id !== null) {
      bookMapBySqliteId.set(Number(b.id), b._id);
    }
    bookMapByMongoId.set(b._id.toString(), b._id);
  }

  const copies = await db.collection('book_copies').find({}).toArray();
  console.log(`Scanning ${copies.length} copies...`);
  let updatedCount = 0;

  for (const c of copies) {
    let targetBookObjectId = null;
    let sqliteBookId = c.sqlite_book_id || (typeof c.book_id === 'number' ? c.book_id : null);

    if (c.book_id && mongoose.Types.ObjectId.isValid(String(c.book_id)) && bookMapByMongoId.has(String(c.book_id))) {
      targetBookObjectId = new mongoose.Types.ObjectId(String(c.book_id));
    } else if (typeof c.book_id === 'number' && bookMapBySqliteId.has(c.book_id)) {
      targetBookObjectId = bookMapBySqliteId.get(c.book_id);
    } else if (c.sqlite_book_id && bookMapBySqliteId.has(c.sqlite_book_id)) {
      targetBookObjectId = bookMapBySqliteId.get(c.sqlite_book_id);
    }

    if (targetBookObjectId) {
      const isAlreadyObjId = c.book_id instanceof mongoose.Types.ObjectId && String(c.book_id) === String(targetBookObjectId);
      if (!isAlreadyObjId || c.sqlite_book_id !== sqliteBookId) {
        await db.collection('book_copies').updateOne(
          { _id: c._id },
          {
            $set: {
              book_id: targetBookObjectId,
              sqlite_book_id: sqliteBookId || c.book_id
            }
          }
        );
        updatedCount++;
      }
    }
  }

  console.log(`Successfully updated ${updatedCount} book copies to valid ObjectId references!`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
