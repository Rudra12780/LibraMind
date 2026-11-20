import { connect } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';
import User from '../backend/models/User.js';
import Book from '../backend/models/Book.js';
import BookCopy from '../backend/models/BookCopy.js';
import Notification from '../backend/models/Notification.js';
import { buildIdFilter } from '../backend/utils/idHelper.js';
import { logAudit } from '../backend/middleware/auth.js';

async function main() {
  await connect();
  const student = await User.findOne({ email: 'student@libramind.edu' });
  const librarian = await User.findOne({ email: 'librarian@libramind.edu' });
  const book = await Book.findOne({});
  const copy = await BookCopy.findOne({ book_id: book._id });

  console.log('Testing with student:', student?._id, 'librarian:', librarian?._id);

  const testLoan = await Loan.create({
    book_id: book._id,
    copy_id: copy._id,
    user_id: student._id,
    borrow_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'overdue',
    fine_amount: 5.0
  });

  console.log('Created testLoan:', testLoan._id);

  // Test send-return-warning logic
  try {
    const loan = await Loan.findOne(buildIdFilter(testLoan._id.toString()))
      .populate('book_id')
      .populate('user_id');

    let member = loan.user_id;
    let b = loan.book_id;
    const bookTitle = b?.title || 'Book';
    const warningMsg = `Your return date for "${bookTitle}" has passed.`;

    if (member && member._id) {
      await User.updateOne(
        { _id: member._id },
        {
          $set: {
            return_warning_active: 1,
            return_warning_message: warningMsg,
            return_warning_loan_id: loan.sqlite_id || 0,
            return_warning_book_title: bookTitle
          }
        }
      );
      console.log('User updateOne succeeded');
    }

    await Loan.updateOne(
      { _id: loan._id },
      {
        $set: {
          warning_sent: 1,
          warning_sent_at: new Date()
        }
      }
    );
    console.log('Loan updateOne succeeded');

    await Notification.create({
      user_id: member._id,
      title: 'Urgent',
      message: warningMsg,
      type: 'due',
      link: '/dashboard',
      created_at: new Date()
    });
    console.log('Notification create succeeded');

    logAudit(librarian._id.toString(), 'RETURN_WARNING_SENT', `Sent warning to ${member?.name}`);
    console.log('logAudit called');
  } catch (err) {
    console.error('ERROR in sendReturnWarning:', err);
  }

  // Now test handleBookReturn logic
  try {
    const loan = await Loan.findOne(buildIdFilter(testLoan._id.toString()))
      .populate('book_id')
      .populate('copy_id')
      .populate('user_id');

    console.log('Loan for return:', loan._id, 'status:', loan.status);
    let book = loan.book_id;
    let user = loan.user_id;
    let copy = loan.copy_id;
    const now = new Date();

    loan.status = 'returned';
    loan.return_date = now;
    loan.fine_amount = 0;
    await Loan.updateOne(
      { _id: loan._id },
      {
        $set: {
          status: 'returned',
          return_date: now,
          fine_amount: 0
        }
      }
    );
    console.log('Loan marked as returned in DB');

    const bookTitle = book?.title || 'Book';
    const bFilter = book ? buildIdFilter(book._id, 'book_id', 'sqlite_book_id') : {};

    const Reservation = (await import('../backend/models/Reservation.js')).default;
    const nextReservation = await Reservation.findOne({
      ...bFilter,
      status: 'waiting'
    }).sort({ queue_position: 1, reservation_date: 1 });

    if (nextReservation && copy) {
      console.log('Next reservation found');
    } else {
      if (copy) {
        copy.status = 'available';
        await copy.save();
        console.log('Copy saved available');
      }
      if (book) {
        await Book.updateOne({ _id: book._id }, { $inc: { available_copies: 1 } });
        console.log('Book available_copies incremented');
      }
    }

    if (user && user._id) {
      await Notification.create({
        user_id: user._id,
        title: 'Book Return Confirmed',
        message: `"${bookTitle}" returned.`,
        type: 'return',
        link: '/dashboard',
        created_at: now
      });
      console.log('User return notification created');
    }

    logAudit(librarian._id.toString(), 'BOOK_RETURNED', `Returned "${bookTitle}"`);
    console.log('Return completed successfully!');
  } catch (err) {
    console.error('ERROR in handleBookReturn:', err);
  }

  // Clean up
  await Loan.deleteOne({ _id: testLoan._id });
  process.exit(0);
}

main().catch(err => {
  console.error('Main caught:', err);
  process.exit(1);
});
