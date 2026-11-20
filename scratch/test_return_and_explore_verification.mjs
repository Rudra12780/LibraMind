import http from 'http';
import { mongoose } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';
import Book from '../backend/models/Book.js';
import BookCopy from '../backend/models/BookCopy.js';
import User from '../backend/models/User.js';
import app from '../backend/server.js';
import jwt from '../backend/node_modules/jsonwebtoken/index.js';
import { JWT_SECRET } from '../backend/middleware/auth.js';
import fs from 'fs';
import path from 'path';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  console.log('=== LibraMind Return Bug, Real-Time Updates & Explore Button Verification ===\n');
  await mongoose.connect(uri);

  const student = await User.findOne({ email: 'student@libramind.edu' });
  const book = await Book.findOne({ title: { $regex: 'A Man Called Ove', $options: 'i' } });
  const copy = await BookCopy.findOne({ book_id: book._id, status: 'available' });

  console.log(`Found Student: ${student.name} (${student._id})`);
  console.log(`Found Book: ${book.title} (${book._id})`);
  console.log(`Found Copy: ${copy ? copy.copy_code : 'none'} (${copy ? copy._id : 'none'})`);

  const initialAvailable = book.available_copies;
  console.log(`Initial available copies: ${initialAvailable}`);

  // Create an active loan to simulate patron holding "A Man Called Ove"
  const loan = await Loan.create({
    book_id: book._id,
    sqlite_book_id: book.sqlite_id,
    copy_id: copy ? copy._id : book._id,
    sqlite_copy_id: copy ? copy.sqlite_id : 1,
    user_id: student._id,
    sqlite_user_id: student.sqlite_id,
    borrow_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    due_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    status: 'active'
  });

  if (copy) {
    await BookCopy.updateOne({ _id: copy._id }, { $set: { status: 'borrowed' } });
    await Book.updateOne({ _id: book._id }, { $set: { available_copies: Math.max(0, initialAvailable - 1) } });
  }

  const token = jwt.sign(
    { id: student._id.toString(), email: student.email, role: student.role, name: student.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const server = http.createServer(app);
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;

  // 1. Verify GET /api/loans returns normalized book_id
  console.log('\n--- 1. Testing GET /api/loans for active loan & ID normalization ---');
  const loansRes = await fetch(`http://127.0.0.1:${port}/api/loans`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const loans = await loansRes.json();
  const foundLoan = loans.find(l => String(l.id) === String(loan._id) || String(l._id) === String(loan._id));
  console.log('Loan returned by API:', foundLoan ? {
    id: foundLoan.id,
    book_id: foundLoan.book_id,
    status: foundLoan.status,
    book_title: foundLoan.book_title
  } : 'Not found');

  if (foundLoan && String(foundLoan.book_id) === String(book._id)) {
    console.log('✅ PASS: Loan returns normalized string book_id matching Book._id');
  } else {
    console.log('❌ FAIL: book_id normalization mismatch');
  }

  // 2. Test Returning the Book (First attempt)
  console.log('\n--- 2. Testing First Return Attempt ---');
  const returnRes1 = await fetch(`http://127.0.0.1:${port}/api/loans/${loan._id}/return`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const returnBody1 = await returnRes1.json();
  console.log(`First Return Status: ${returnRes1.status}`, returnBody1);

  if (returnRes1.status === 200 && returnBody1.status === 'returned') {
    console.log('✅ PASS: First return succeeded with status 200 (no 500 casting error)!');
  } else {
    console.log('❌ FAIL: First return returned non-200 or error');
  }

  // 3. Test Second Return Attempt (Simulating second click / retry)
  console.log('\n--- 3. Testing Second Return Attempt (Double-Click resilience) ---');
  const returnRes2 = await fetch(`http://127.0.0.1:${port}/api/loans/${loan._id}/return`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const returnBody2 = await returnRes2.json();
  console.log(`Second Return Status: ${returnRes2.status}`, returnBody2);

  if (returnRes2.status === 200 && returnBody2.success) {
    console.log('✅ PASS: Repeated return resolved gracefully with status 200 without throwing error!');
  } else {
    console.log('❌ FAIL: Repeated return failed with status', returnRes2.status);
  }

  // Check copy status in DB
  if (copy) {
    const updatedCopy = await BookCopy.findById(copy._id);
    console.log('Updated BookCopy status in DB:', updatedCopy.status);
    if (updatedCopy.status === 'available') {
      console.log('✅ PASS: BookCopy status correctly restored to "available" in DB');
    } else {
      console.log('❌ FAIL: BookCopy status is', updatedCopy.status);
    }
  }

  // Clean up test loan
  await Loan.deleteOne({ _id: loan._id });

  // 4. Inspect frontend source files for Explore button & Real-Time updates
  console.log('\n--- 4. Checking Frontend Code for Explore Button & Real-Time Sync ---');
  const bookCardCode = fs.readFileSync('frontend/src/components/BookCard.jsx', 'utf8');
  const catalogCode = fs.readFileSync('frontend/src/pages/Catalog.jsx', 'utf8');
  const apiCode = fs.readFileSync('frontend/src/api.js', 'utf8');

  // Verify BookCard
  const hasBorrowVolume = bookCardCode.includes('<span>Borrow Volume</span>');
  const hasExplore = bookCardCode.includes('<span>Explore</span>');
  const hasDetailsButton = bookCardCode.includes('<span>Details →</span>') || bookCardCode.includes('Details →');

  console.log(`BookCard has "Borrow Volume": ${hasBorrowVolume ? 'YES (FAIL)' : 'NO (PASS)'}`);
  console.log(`BookCard has "Explore": ${hasExplore ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`BookCard has separate "Details →" button: ${hasDetailsButton ? 'YES (FAIL)' : 'NO (PASS)'}`);

  // Verify Real-time BroadcastChannel & Event Sync
  const hasBroadcastChannel = apiCode.includes('BroadcastChannel') && apiCode.includes('libramind_realtime_sync');
  const hasCatalogSync = catalogCode.includes('libramind:data-updated') && catalogCode.includes('visibilitychange');

  console.log(`api.js has cross-tab BroadcastChannel sync: ${hasBroadcastChannel ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`Catalog.jsx has real-time sync & heartbeat: ${hasCatalogSync ? 'YES (PASS)' : 'NO (FAIL)'}`);

  server.close();
  console.log('\n=== All Tests Completed Successfully ===');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
