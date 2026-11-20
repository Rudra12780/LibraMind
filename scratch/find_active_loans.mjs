import { mongoose } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const activeLoans = await Loan.find({ status: { $in: ['active', 'borrowed', 'overdue'] } }).limit(10);
  console.log(`Found ${activeLoans.length} active/borrowed/overdue loans:`);
  for (const l of activeLoans) {
    console.log(`Loan ${l._id}: book_id=${l.book_id}, user_id=${l.user_id}, status=${l.status}`);
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
