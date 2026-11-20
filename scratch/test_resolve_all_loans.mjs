// scratch/test_resolve_all_loans.mjs
import { mongoose } from '../backend/db/mongoose.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const loans = await db.collection('loans').find({}).toArray();
  console.log(`Checking resolution for all ${loans.length} loans...`);

  let resolvedCount = 0;
  for (const l of loans) {
    const bId = l.book_id ?? l.sqlite_book_id;
    const uId = l.user_id ?? l.sqlite_user_id;
    const cId = l.copy_id ?? l.sqlite_copy_id;

    const book = await db.collection('books').findOne({
      $or: [{ _id: bId }, { id: bId }, { sqlite_id: bId }]
    });

    const user = await db.collection('users').findOne({
      $or: [{ _id: uId }, { id: uId }, { sqlite_id: uId }]
    });

    const copy = await db.collection('book_copies').findOne({
      $or: [{ _id: cId }, { id: cId }, { sqlite_id: cId }]
    });

    if (book && user) {
      resolvedCount++;
    } else {
      console.log(`Unresolved loan ${l._id}: book=${book?.title || 'NONE'}, user=${user?.name || 'NONE'}, copy=${copy?.copy_code || 'NONE'}`);
    }
  }

  console.log(`Successfully matched ${resolvedCount} out of ${loans.length} loans!`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
