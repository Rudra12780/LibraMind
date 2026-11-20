// scratch/inspect_db_loans.mjs
import { mongoose } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';
import User from '../backend/models/User.js';
import Book from '../backend/models/Book.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  const loans = await Loan.find({}).limit(10).lean();
  console.log(`Found ${loans.length} loans`);
  for (const l of loans) {
    console.log({
      id: l._id,
      status: l.status,
      book_id: l.book_id,
      user_id: l.user_id,
      copy_id: l.copy_id,
      due_date: l.due_date
    });
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
