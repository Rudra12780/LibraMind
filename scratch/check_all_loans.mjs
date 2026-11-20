// scratch/check_all_loans.mjs
import { mongoose } from '../backend/db/mongoose.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const loans = await mongoose.connection.db.collection('loans').find({}).toArray();
  console.log(`Total loans in MongoDB Atlas: ${loans.length}`);
  
  let numericBookIdCount = 0;
  let objectIdBookIdCount = 0;
  for (const l of loans) {
    if (typeof l.book_id === 'number') numericBookIdCount++;
    else objectIdBookIdCount++;
  }
  console.log(`Numeric book_id: ${numericBookIdCount}, ObjectId/string book_id: ${objectIdBookIdCount}`);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
