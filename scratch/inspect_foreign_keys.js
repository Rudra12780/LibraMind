const { connect, mongoose } = require('../backend/db/mongoose');

async function inspectTypes() {
  await connect();
  const db = mongoose.connection.db;
  
  const book = await db.collection('books').findOne();
  console.log('Book sample:');
  console.log({
    _id: book._id,
    _id_type: typeof book._id,
    id: book.id,
    id_type: typeof book.id,
    sqlite_id: book.sqlite_id,
    sqlite_id_type: typeof book.sqlite_id,
    title: book.title,
    created_at: book.created_at,
    created_at_type: typeof book.created_at
  });

  const user = await db.collection('users').findOne();
  console.log('User sample:');
  console.log({
    _id: user._id,
    _id_type: typeof user._id,
    id: user.id,
    id_type: typeof user.id,
    sqlite_id: user.sqlite_id,
    role: user.role,
    created_at: user.created_at,
    created_at_type: typeof user.created_at,
    created_at_constructor: user.created_at?.constructor?.name
  });

  const loan = await db.collection('loans').findOne();
  console.log('Loan dates and types:');
  console.log({
    borrow_date: loan.borrow_date,
    borrow_date_type: typeof loan.borrow_date,
    borrow_date_constructor: loan.borrow_date?.constructor?.name,
    return_date: loan.return_date,
    return_date_type: typeof loan.return_date,
    return_date_constructor: loan.return_date?.constructor?.name,
    book_id: loan.book_id,
    book_id_type: typeof loan.book_id,
    user_id: loan.user_id,
    user_id_type: typeof loan.user_id
  });

  const resv = await db.collection('reservations').findOne();
  console.log('Reservation dates and types:');
  console.log({
    reservation_date: resv.reservation_date,
    reservation_date_type: typeof resv.reservation_date,
    reservation_date_constructor: resv.reservation_date?.constructor?.name,
    status: resv.status,
    book_id: resv.book_id,
    book_id_type: typeof resv.book_id
  });

  await mongoose.disconnect();
  process.exit(0);
}

inspectTypes().catch(e => {
  console.error(e);
  process.exit(1);
});
