// scratch/inspect_atlas_data.js – Inspect existing data counts in MongoDB Atlas
const { connect, mongoose } = require('../backend/db/mongoose');
const User = require('../backend/models/User');
const Book = require('../backend/models/Book');
const BookCopy = require('../backend/models/BookCopy');
const Loan = require('../backend/models/Loan');
const Reservation = require('../backend/models/Reservation');
const Seat = require('../backend/models/Seat');

async function inspectAtlas() {
  await connect();
  console.log('MongoDB Atlas Connected. Checking collections counts:\n');
  const userCount = await User.countDocuments();
  const bookCount = await Book.countDocuments();
  const copyCount = await BookCopy.countDocuments();
  const loanCount = await Loan.countDocuments();
  const resvCount = await Reservation.countDocuments();
  const seatCount = await Seat.countDocuments();

  console.log(`Users count:        ${userCount}`);
  console.log(`Books count:        ${bookCount}`);
  console.log(`Book Copies count:  ${copyCount}`);
  console.log(`Loans count:        ${loanCount}`);
  console.log(`Reservations count: ${resvCount}`);
  console.log(`Seats count:        ${seatCount}`);

  if (loanCount > 0) {
    const loans = await Loan.find().limit(3);
    console.log('\nSample Loans:');
    console.log(JSON.stringify(loans, null, 2));
  }

  if (bookCount > 0) {
    const books = await Book.find().limit(3);
    console.log('\nSample Books:');
    console.log(JSON.stringify(books, null, 2));
  }

  if (resvCount > 0) {
    const resvs = await Reservation.find().limit(3);
    console.log('\nSample Reservations:');
    console.log(JSON.stringify(resvs, null, 2));
  }

  await mongoose.disconnect();
  process.exit(0);
}

inspectAtlas().catch(e => {
  console.error(e);
  process.exit(1);
});

