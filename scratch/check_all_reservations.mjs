// scratch/check_all_reservations.mjs
import { mongoose } from '../backend/db/mongoose.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const reservations = await mongoose.connection.db.collection('reservations').find({}).toArray();
  console.log(`Total reservations in MongoDB Atlas: ${reservations.length}`);
  
  let numeric = 0, obj = 0;
  for (const r of reservations) {
    if (typeof r.book_id === 'number') numeric++;
    else obj++;
  }
  console.log(`Numeric book_id: ${numeric}, ObjectId/string book_id: ${obj}`);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
