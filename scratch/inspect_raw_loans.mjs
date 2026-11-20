// scratch/inspect_raw_loans.mjs
import { mongoose } from '../backend/db/mongoose.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const rawLoans = await mongoose.connection.db.collection('loans').find({}).limit(5).toArray();
  console.log('Raw MongoDB documents from "loans":');
  console.log(JSON.stringify(rawLoans, null, 2));

  const rawBooks = await mongoose.connection.db.collection('books').find({}).limit(3).toArray();
  console.log('\nSample raw books:');
  console.log(JSON.stringify(rawBooks.map(b => ({ _id: b._id, id: b.id, sqlite_id: b.sqlite_id, title: b.title })), null, 2));

  const rawUsers = await mongoose.connection.db.collection('users').find({}).limit(3).toArray();
  console.log('\nSample raw users:');
  console.log(JSON.stringify(rawUsers.map(u => ({ _id: u._id, id: u.id, sqlite_id: u.sqlite_id, name: u.name, role: u.role })), null, 2));

  const rawCopies = await mongoose.connection.db.collection('book_copies').find({}).limit(3).toArray();
  console.log('\nSample raw copies:');
  console.log(JSON.stringify(rawCopies.map(c => ({ _id: c._id, id: c.id, sqlite_id: c.sqlite_id, copy_code: c.copy_code, book_id: c.book_id })), null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
