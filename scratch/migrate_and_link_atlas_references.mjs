// scratch/migrate_and_link_atlas_references.mjs
import { mongoose } from '../backend/db/mongoose.js';

const uri = "mongodb+srv://patelrudrabrij41_db_user:iVeqQeqjhbrzKiMQ@cluster0.2bdjxod.mongodb.net/libramind?appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.log("=== Migrating Atlas Loans References ===");
  const loans = await db.collection('loans').find({}).toArray();
  let updatedLoans = 0;

  for (const l of loans) {
    const rawBId = l.book_id ?? l.sqlite_book_id;
    const rawUId = l.user_id ?? l.sqlite_user_id;
    const rawCId = l.copy_id ?? l.sqlite_copy_id;

    const book = await db.collection('books').findOne({
      $or: [{ _id: rawBId }, { id: rawBId }, { sqlite_id: rawBId }]
    });

    const user = await db.collection('users').findOne({
      $or: [{ _id: rawUId }, { id: rawUId }, { sqlite_id: rawUId }]
    });

    let copy = null;
    if (rawCId) {
      copy = await db.collection('book_copies').findOne({
        $or: [{ _id: rawCId }, { id: rawCId }, { sqlite_id: rawCId }]
      });
    }

    const updateFields = {};
    if (typeof l.book_id === 'number') {
      updateFields.sqlite_book_id = l.book_id;
    }
    if (book && (!l.book_id || typeof l.book_id === 'number' || String(l.book_id) !== String(book._id))) {
      updateFields.book_id = book._id;
    }

    if (typeof l.user_id === 'number') {
      updateFields.sqlite_user_id = l.user_id;
    }
    if (user && (!l.user_id || typeof l.user_id === 'number' || String(l.user_id) !== String(user._id))) {
      updateFields.user_id = user._id;
    }

    if (typeof l.copy_id === 'number') {
      updateFields.sqlite_copy_id = l.copy_id;
    }
    if (copy && (!l.copy_id || typeof l.copy_id === 'number' || String(l.copy_id) !== String(copy._id))) {
      updateFields.copy_id = copy._id;
    }

    if (Object.keys(updateFields).length > 0) {
      await db.collection('loans').updateOne(
        { _id: l._id },
        { $set: updateFields }
      );
      updatedLoans++;
    }
  }
  console.log(`Updated ${updatedLoans} loans with ObjectId references while preserving sqlite_ids.`);

  console.log("=== Migrating Atlas Reservations References ===");
  const reservations = await db.collection('reservations').find({}).toArray();
  let updatedReservations = 0;

  for (const r of reservations) {
    const rawBId = r.book_id ?? r.sqlite_book_id;
    const rawUId = r.user_id ?? r.sqlite_user_id;

    const book = await db.collection('books').findOne({
      $or: [{ _id: rawBId }, { id: rawBId }, { sqlite_id: rawBId }]
    });

    const user = await db.collection('users').findOne({
      $or: [{ _id: rawUId }, { id: rawUId }, { sqlite_id: rawUId }]
    });

    const updateFields = {};
    if (typeof r.book_id === 'number') {
      updateFields.sqlite_book_id = r.book_id;
    }
    if (book && (!r.book_id || typeof r.book_id === 'number' || String(r.book_id) !== String(book._id))) {
      updateFields.book_id = book._id;
    }

    if (typeof r.user_id === 'number') {
      updateFields.sqlite_user_id = r.user_id;
    }
    if (user && (!r.user_id || typeof r.user_id === 'number' || String(r.user_id) !== String(user._id))) {
      updateFields.user_id = user._id;
    }

    if (Object.keys(updateFields).length > 0) {
      await db.collection('reservations').updateOne(
        { _id: r._id },
        { $set: updateFields }
      );
      updatedReservations++;
    }
  }
  console.log(`Updated ${updatedReservations} reservations with ObjectId references while preserving sqlite_ids.`);

  process.exit(0);
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
