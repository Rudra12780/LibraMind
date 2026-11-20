import { mongoose } from '../backend/db/mongoose.js';
import BookCopy from '../backend/models/BookCopy.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const rawCopy = await db.collection('book_copies').findOne({ _id: new mongoose.Types.ObjectId('6ae6d391bdba6f9d221a85c1') });
  console.log('Raw copy in Mongo:', rawCopy);

  // Test copy.save() using Mongoose Model
  const modelCopy = await BookCopy.findById('6ae6d391bdba6f9d221a85c1');
  console.log('Mongoose BookCopy model findById:', modelCopy);
  try {
    modelCopy.status = 'available';
    await modelCopy.save();
    console.log('modelCopy.save() SUCCEEDED!');
  } catch (err) {
    console.error('modelCopy.save() FAILED:', err);
  }

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
