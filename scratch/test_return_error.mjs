import { mongoose } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';
import Book from '../backend/models/Book.js';
import BookCopy from '../backend/models/BookCopy.js';
import Reservation from '../backend/models/Reservation.js';
import User from '../backend/models/User.js';
import Notification from '../backend/models/Notification.js';
import { buildIdFilter } from '../backend/utils/idHelper.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);

  // Find an active loan or temporarily test with the loan
  const loanId = '6ae6d393bdba6f9d221a8633';
  const loan = await Loan.findOne(buildIdFilter(loanId))
    .populate('book_id')
    .populate('copy_id')
    .populate('user_id');

  console.log('Loan copy_id:', loan.copy_id);
  console.log('Loan book_id:', loan.book_id ? loan.book_id.title : null);
  console.log('Loan user_id:', loan.user_id ? loan.user_id.name : null);

  // Let's test the exact code in handleBookReturn step-by-step
  let book = loan.book_id;
  let user = loan.user_id;
  let copy = loan.copy_id;
  const now = new Date();

  console.log('Testing notification creation:');
  try {
    const notif = await Notification.create({
      user_id: user._id,
      title: 'Book Return Confirmed',
      message: `Test return`,
      type: 'return',
      link: '/dashboard',
      created_at: now
    });
    console.log('Notification created successfully:', notif._id);
    await Notification.deleteOne({ _id: notif._id });
  } catch (err) {
    console.error('Notification error:', err);
  }

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
