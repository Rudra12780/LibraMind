import { mongoose } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';
import Book from '../backend/models/Book.js';
import BookCopy from '../backend/models/BookCopy.js';
import Reservation from '../backend/models/Reservation.js';
import User from '../backend/models/User.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const book = await db.collection('books').findOne({ title: { $regex: 'Book Thief', $options: 'i' } });
  console.log('Book:', book ? { _id: book._id, title: book.title, id: book.id, available: book.available_copies } : 'None');

  if (book) {
    const copy = await db.collection('book_copies').findOne({ barcode: 'LM-EM-39-C1' });
    console.log('Copy LM-EM-39-C1:', copy);

    const loans = await db.collection('loans').find({
      $or: [
        { book_id: book._id },
        { sqlite_book_id: book.sqlite_id },
        { copy_id: copy?._id }
      ]
    }).toArray();
    console.log('Loans found for this book/copy:', loans.length);
    for (const l of loans) {
      console.log('Loan:', {
        _id: l._id,
        status: l.status,
        user_id: l.user_id,
        book_id: l.book_id,
        copy_id: l.copy_id,
        due_date: l.due_date,
        return_date: l.return_date
      });
    }

    const reservations = await db.collection('reservations').find({
      $or: [
        { book_id: book._id },
        { sqlite_book_id: book.sqlite_id }
      ]
    }).toArray();
    console.log('Reservations for this book:', reservations);
  }

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
