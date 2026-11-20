import { mongoose } from '../backend/db/mongoose.js';
import Loan from '../backend/models/Loan.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const loans = await db.collection('loans').find({}).toArray();
  console.log(`Total loans in MongoDB: ${loans.length}`);
  const statusCounts = {};
  for (const l of loans) {
    statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
  }
  console.log('Status counts:', statusCounts);
  if (loans.length > 0) {
    console.log('Sample loan:', loans[0]);
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
