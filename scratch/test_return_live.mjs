import { mongoose } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';
import Book from '../backend/models/Book.js';
import BookCopy from '../backend/models/BookCopy.js';
import User from '../backend/models/User.js';
import http from 'http';
import app from '../backend/server.js';
import jwt from '../backend/node_modules/jsonwebtoken/index.js';
import { JWT_SECRET } from '../backend/middleware/auth.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);

  // Find student Aarav Sharma
  const student = await User.findOne({ email: 'student@libramind.edu' });
  const book = await Book.findOne({ title: { $regex: 'Book Thief', $options: 'i' } });
  const copy = await BookCopy.findOne({ book_id: book._id });

  console.log('Student:', student._id, 'Book:', book._id, 'Copy:', copy._id);

  // Create a temporary active loan for testing return
  const testLoan = await Loan.create({
    book_id: book._id,
    sqlite_book_id: book.sqlite_id,
    copy_id: copy._id,
    sqlite_copy_id: copy.sqlite_id,
    user_id: student._id,
    sqlite_user_id: student.sqlite_id,
    borrow_date: new Date(),
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'active'
  });

  console.log('Created test loan:', testLoan._id);

  const token = jwt.sign(
    { id: student._id.toString(), email: student.email, role: student.role, name: student.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const server = http.createServer(app);
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;

  console.log(`Sending POST /api/loans/${testLoan._id}/return`);
  const res1 = await fetch(`http://127.0.0.1:${port}/api/loans/${testLoan._id}/return`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const body1 = await res1.json();
  console.log(`Response 1 (status ${res1.status}):`, body1);

  // Now test sending return again to see what happens on 2nd click!
  console.log(`Sending POST /api/loans/${testLoan._id}/return again`);
  const res2 = await fetch(`http://127.0.0.1:${port}/api/loans/${testLoan._id}/return`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const body2 = await res2.json();
  console.log(`Response 2 (status ${res2.status}):`, body2);

  // Clean up
  await Loan.deleteOne({ _id: testLoan._id });
  server.close();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
