// scratch/test_resolve_loan.mjs
import { mongoose } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';
import User from '../backend/models/User.js';
import Book from '../backend/models/Book.js';
import BookCopy from '../backend/models/BookCopy.js';
import { buildIdFilter } from '../backend/utils/idHelper.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  console.log('Connected to Atlas');

  const loans = await Loan.find({}).limit(5);
  for (const l of loans) {
    console.log('\n--- Loan ID:', l._id.toString(), 'Status:', l.status, '---');
    console.log('Raw fields:', { book_id: l.book_id, user_id: l.user_id, copy_id: l.copy_id, sqlite_book_id: l.sqlite_book_id, sqlite_user_id: l.sqlite_user_id });

    // Try finding book
    const bId = l.book_id || l.sqlite_book_id;
    const book = await Book.findOne(buildIdFilter(bId, '_id', 'sqlite_id')).lean();
    console.log('Resolved Book:', book ? `${book.title} (ID: ${book._id}, sqlite: ${book.sqlite_id})` : 'NOT FOUND');

    // Try finding user
    const uId = l.user_id || l.sqlite_user_id;
    const user = await User.findOne(buildIdFilter(uId, '_id', 'sqlite_id')).lean();
    console.log('Resolved User:', user ? `${user.name} (ID: ${user._id}, sqlite: ${user.sqlite_id})` : 'NOT FOUND');

    // Try finding copy
    const cId = l.copy_id || l.sqlite_copy_id;
    const copy = await BookCopy.findOne(buildIdFilter(cId, '_id', 'sqlite_id')).lean();
    console.log('Resolved Copy:', copy ? `${copy.copy_code} (ID: ${copy._id}, sqlite: ${copy.sqlite_id})` : 'NOT FOUND');
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
