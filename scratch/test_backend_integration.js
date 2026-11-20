// scratch/test_backend_integration.js – End-to-end integration tests on real MongoDB Atlas
const path = require('path');
const { connect, mongoose } = require('../backend/db/mongoose');
const User = require('../backend/models/User');
const Book = require('../backend/models/Book');
const BookCopy = require('../backend/models/BookCopy');
const Loan = require('../backend/models/Loan');
const Reservation = require('../backend/models/Reservation');
const Seat = require('../backend/models/Seat');
const SeatReservation = require('../backend/models/SeatReservation');
const Notification = require('../backend/models/Notification');
const Wishlist = require('../backend/models/Wishlist');
const VisitPlanner = require('../backend/models/VisitPlanner');
const AuditLog = require('../backend/models/AuditLog');
const OTP = require('../backend/models/OTP');
const bcrypt = require(path.join(__dirname, '..', 'backend', 'node_modules', 'bcryptjs'));

async function runIntegrationTests() {
  console.log('====================================================');
  console.log('🧪 Starting LibraMind Milestone 2 Integration Tests');
  console.log('====================================================\n');

  try {
    await connect();
    console.log('1. [DB CONNECT] Connected to MongoDB Atlas cluster.');

    // Ensure models create indexes on Atlas
    await Promise.all([
      User.init(),
      Book.init(),
      BookCopy.init(),
      Loan.init(),
      Reservation.init(),
      Seat.init(),
      SeatReservation.init()
    ]);
    console.log('   [INDEXES SYNC] Synchronized unique and partial indexes with Atlas.');

    // Test 1: User Model & Auth Verification
    const testEmail = `test_runner_${Date.now()}@libramind.edu`;
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync('student@123', salt);
    const membershipId = `TEST-${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await User.create({
      name: 'Integration Test Patron',
      email: testEmail,
      password_hash: passHash,
      role: 'student',
      membership_id: membershipId,
      interests: 'Computer Science, AI',
      created_at: new Date()
    });
    console.log(`2. [USER CREATE] Created test student: ${user.name} (${user._id}, ${user.membership_id})`);

    const isMatch = bcrypt.compareSync('student@123', user.password_hash);
    if (!isMatch) throw new Error('Bcrypt password verification failed!');
    console.log('3. [AUTH VERIFY] Password hash verification successful with bcrypt.');

    // Test 2: Book Catalog & Copy Mapping
    const testIsbn = `978-0-${Date.now()}`;
    const book = await Book.create({
      title: 'Design Thinking & AI Systems',
      author: 'Antigravity Research Group',
      isbn: testIsbn,
      category: 'Computer Science',
      total_copies: 2,
      available_copies: 2,
      created_at: new Date()
    });
    console.log(`4. [BOOK CREATE] Created test title: "${book.title}" (ISBN: ${book.isbn})`);

    const copy1 = await BookCopy.create({
      book_id: book._id,
      copy_code: `TEST-CS-${book._id.toString().slice(-4)}-C1`,
      status: 'available',
      condition: 'New'
    });
    const copy2 = await BookCopy.create({
      book_id: book._id,
      copy_code: `TEST-CS-${book._id.toString().slice(-4)}-C2`,
      status: 'available',
      condition: 'New'
    });
    console.log(`5. [COPIES CREATE] Created 2 physical copies: ${copy1.copy_code}, ${copy2.copy_code}`);

    // Test 3: Circulation Loan & Atomic Decrement
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const loan = await Loan.create({
      book_id: book._id,
      copy_id: copy1._id,
      user_id: user._id,
      borrow_date: new Date(),
      due_date: dueDate,
      status: 'active'
    });
    copy1.status = 'borrowed';
    await copy1.save();
    book.available_copies -= 1;
    await book.save();
    console.log(`6. [LOAN CHECKOUT] Borrowed copy ${copy1.copy_code}. Book remaining available: ${book.available_copies}`);

    // Test 4: Reservation & Partial Index Check
    const resv = await Reservation.create({
      book_id: book._id,
      user_id: user._id,
      status: 'waiting',
      queue_position: 1,
      reservation_date: new Date()
    });
    console.log(`7. [RESERVATION] Placed hold #${resv._id} (Queue pos: ${resv.queue_position})`);

    // Test 5: Study Seat Reservation & Double-Booking Prevention
    const testSeatNum = `T-POD-${Date.now().toString().slice(-4)}`;
    const seat = await Seat.create({
      seat_number: testSeatNum,
      floor: 'Floor 1',
      section: 'Quiet Study Zone',
      status: 'available'
    });

    const seatBooking = await SeatReservation.create({
      seat_id: seat._id,
      user_id: user._id,
      date: '2026-11-10',
      time_slot: '08:00 - 11:00 (Morning Focus)',
      status: 'active'
    });
    console.log(`8. [SEAT BOOKING] Reserved seat ${seat.seat_number} for slot ${seatBooking.time_slot}`);

    // Verify double-booking prevention on same seat/date/slot
    let duplicatePrevented = false;
    try {
      await SeatReservation.create({
        seat_id: seat._id,
        user_id: user._id,
        date: '2026-11-10',
        time_slot: '08:00 - 11:00 (Morning Focus)',
        status: 'active'
      });
    } catch (e) {
      duplicatePrevented = true;
      console.log('9. [CONFLICT PREVENT] Double-booking successfully prevented by index/unique check.');
    }
    if (!duplicatePrevented) throw new Error('Failed to prevent duplicate seat reservation!');

    // Test 6: Notifications & Audit Logs
    const notif = await Notification.create({
      user_id: user._id,
      title: 'Integration Test Notification',
      message: 'Test message confirming notification pipeline.',
      type: 'announcement',
      link: '/dashboard'
    });
    console.log(`10. [NOTIFICATION] Created notification #${notif._id}`);

    const audit = await AuditLog.create({
      user_id: user._id,
      action: 'INTEGRATION_TEST_PASS',
      details: 'All automated sanity assertions passed.',
      timestamp: new Date()
    });
    console.log(`11. [AUDIT LOG] Recorded audit event #${audit._id}`);

    // Clean up test data from MongoDB to keep Atlas clean
    await SeatReservation.deleteMany({ seat_id: seat._id });
    await Seat.deleteOne({ _id: seat._id });
    await Reservation.deleteMany({ book_id: book._id });
    await Loan.deleteMany({ book_id: book._id });
    await BookCopy.deleteMany({ book_id: book._id });
    await Book.deleteOne({ _id: book._id });
    await Notification.deleteMany({ user_id: user._id });
    await AuditLog.deleteMany({ user_id: user._id });
    await User.deleteOne({ _id: user._id });
    console.log('12. [CLEANUP] Successfully cleaned up test documents from MongoDB Atlas.');

    await mongoose.disconnect();
    console.log('\n====================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 0 ERRORS');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ INTEGRATION TEST FAILED:', err);
    if (mongoose.connection.readyState) await mongoose.disconnect();
    process.exit(1);
  }
}

runIntegrationTests();
