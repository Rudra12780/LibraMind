import { connect } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';
import BookCopy from '../backend/models/BookCopy.js';

async function main() {
  await connect();
  const copy = await BookCopy.findOne({ copy_code: 'LM-EM-39-C1' });
  console.log('Copy LM-EM-39-C1:', copy ? { _id: copy._id, copy_code: copy.copy_code, book_id: copy.book_id, status: copy.status } : 'Not found');
  const loans = await Loan.find({
    $or: [
      { copy_id: copy?._id },
      { due_date: { $gte: new Date('2026-11-14'), $lte: new Date('2026-11-16') } }
    ]
  });
  console.log('Found loans:', loans.length);
  for (const l of loans) {
    console.log({
      _id: l._id,
      status: l.status,
      book_id: l.book_id,
      user_id: l.user_id,
      copy_id: l.copy_id,
      due_date: l.due_date,
      return_date: l.return_date,
      fine_amount: l.fine_amount
    });
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
