import { connect, mongoose } from '../backend/db/mongoose.js';
import Reservation from '../backend/models/Reservation.js';
import Book from '../backend/models/Book.js';
import User from '../backend/models/User.js';
import Notification from '../backend/models/Notification.js';

async function run() {
  await connect();
  console.log('Connected to MongoDB');

  // 1. Find or create a test book with 0 available copies
  let book = await Book.findOne({ available_copies: 0 });
  if (!book) {
    book = await Book.create({
      title: 'Waitlist Test Book ' + Date.now(),
      author: 'Test Author',
      isbn: 'TEST-' + Date.now(),
      category: 'Science',
      total_copies: 2,
      available_copies: 0,
      description: 'Zero copies available book'
    });
    console.log('Created zero-copy test book:', book.title);
  } else {
    console.log('Using zero-copy test book:', book.title);
  }

  // 2. Find students
  const students = await User.find({ role: 'student' }).limit(3);
  if (students.length < 2) {
    console.log('Need at least 2 students in DB. Found:', students.length);
  }

  const studentA = students[0];
  const studentB = students[1];

  // Clean previous holds for this book
  await Reservation.deleteMany({ book_id: book._id });

  // 3. Student A reserves (should get queue_position = 1)
  const timeA = new Date();
  const resA = await Reservation.create({
    book_id: book._id,
    user_id: studentA._id,
    status: 'waiting',
    queue_position: 1,
    reservation_date: timeA,
    created_at: timeA
  });
  console.log(`Student A (${studentA.name}) queued at:`, timeA.toISOString(), 'Position:', resA.queue_position);

  // Wait a fraction of a second to ensure distinct timestamp
  await new Promise(r => setTimeout(r, 1100));

  // 4. Student B reserves (should get queue_position = 2)
  const timeB = new Date();
  const resB = await Reservation.create({
    book_id: book._id,
    user_id: studentB._id,
    status: 'waiting',
    queue_position: 2,
    reservation_date: timeB,
    created_at: timeB
  });
  console.log(`Student B (${studentB.name}) queued at:`, timeB.toISOString(), 'Position:', resB.queue_position);

  // 5. Test Query sorting order-wise (queue_position: 1, reservation_date: 1)
  const fetched = await Reservation.find({ book_id: book._id })
    .populate('book_id')
    .populate('user_id', 'name email membership_id')
    .sort({ queue_position: 1, reservation_date: 1 });

  console.log('\n--- VERIFYING ORDER-WISE RETRIEVAL ---');
  fetched.forEach((r, idx) => {
    const d = new Date(r.reservation_date || r.created_at);
    const dateFormatted = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeFormatted = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    console.log(`Order #${idx + 1}: ${r.user_id.name} -> Queue #${r.queue_position} | Exact Time: ${dateFormatted} at ${timeFormatted} (ISO: ${d.toISOString()})`);
  });

  if (fetched[0].queue_position !== 1 || String(fetched[0].user_id._id) !== String(studentA._id)) {
    throw new Error('Order verification failed: First in queue was not Student A');
  }
  if (fetched[1].queue_position !== 2 || String(fetched[1].user_id._id) !== String(studentB._id)) {
    throw new Error('Order verification failed: Second in queue was not Student B');
  }

  // 6. Test Notification dispatch
  const notifyNotif = await Notification.create({
    user_id: studentA._id,
    title: 'Waiting List Queue Update',
    message: `Circulation Desk Notice: Your request for "${book.title}" is at waiting queue position #${resA.queue_position}. Copies will be issued as soon as returned by patrons.`,
    type: 'reservation',
    link: '/dashboard',
    created_at: new Date()
  });
  console.log('Notification dispatched successfully. ID:', notifyNotif._id);

  console.log('\n✅ ALL WAITING LIST & ORDER-WISE TIMESTAMP TESTS PASSED!');
  process.exit(0);
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
