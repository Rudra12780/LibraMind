// scratch/check_models.js – In-depth verification of Mongoose models and schema definitions
const { mongoose } = require('../backend/db/mongoose');

const models = [
  { name: 'User', model: require('../backend/models/User') },
  { name: 'Book', model: require('../backend/models/Book') },
  { name: 'BookCopy', model: require('../backend/models/BookCopy') },
  { name: 'Loan', model: require('../backend/models/Loan') },
  { name: 'Reservation', model: require('../backend/models/Reservation') },
  { name: 'Seat', model: require('../backend/models/Seat') },
  { name: 'SeatReservation', model: require('../backend/models/SeatReservation') },
  { name: 'Notification', model: require('../backend/models/Notification') },
  { name: 'Wishlist', model: require('../backend/models/Wishlist') },
  { name: 'VisitPlanner', model: require('../backend/models/VisitPlanner') },
  { name: 'PasswordReset', model: require('../backend/models/PasswordReset') },
  { name: 'AuditLog', model: require('../backend/models/AuditLog') },
  { name: 'OTP', model: require('../backend/models/OTP') }
];

console.log('--- 1. Verification of Model Registration ---');
let allPassed = true;

for (const { name, model } of models) {
  const registered = mongoose.models[name];
  if (!registered) {
    console.error(`❌ Model ${name} is NOT registered in mongoose.models!`);
    allPassed = false;
  } else {
    const fieldCount = Object.keys(model.schema.paths).length;
    const indexCount = model.schema.indexes().length;
    console.log(`✅ Model ${name.padEnd(16)}: ${fieldCount} fields, ${indexCount} indexes declared.`);
  }
}

console.log('\n--- 2. Critical Partial Index Verifications ---');
// Verify Reservation partial index
const resIndexes = mongoose.models.Reservation.schema.indexes();
const activeResIndex = resIndexes.find(([fields]) => fields.book_id && fields.user_id);
if (activeResIndex && activeResIndex[1]?.partialFilterExpression) {
  console.log('✅ Reservation partial unique index:', JSON.stringify(activeResIndex));
} else {
  console.error('❌ Reservation is missing partialFilterExpression on book_id + user_id!');
  allPassed = false;
}

// Verify SeatReservation partial index
const seatResIndexes = mongoose.models.SeatReservation.schema.indexes();
const activeSeatIndex = seatResIndexes.find(([fields]) => fields.seat_id && fields.date && fields.time_slot);
if (activeSeatIndex && activeSeatIndex[1]?.partialFilterExpression) {
  console.log('✅ SeatReservation partial unique index:', JSON.stringify(activeSeatIndex));
} else {
  console.error('❌ SeatReservation is missing partialFilterExpression on seat_id + date + time_slot!');
  allPassed = false;
}

console.log('\n--- 3. Check Mongoose Version & Options ---');
console.log(`Mongoose version: ${mongoose.version}`);

if (!allPassed) {
  console.error('\nVerification failed.');
  process.exit(1);
}

console.log('\nAll 13 Mongoose models successfully verified with zero errors.');
process.exit(0);
