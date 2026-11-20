import mongoose from 'mongoose';
import '../backend/models/index.js';

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/libramind');
  const SeatReservation = mongoose.model('SeatReservation');
  const User = mongoose.model('User');
  const Seat = mongoose.model('Seat');
  
  const user = await User.findOne({ email: 'aarav@libramind.edu' }) || await User.findOne({ role: 'student' });
  console.log('User found:', user?._id, user?.name, user?.email);
  
  if (user) {
    const resvs = await SeatReservation.find({ user_id: user._id });
    console.log('Reservations for user:', resvs.length);
    console.log(JSON.stringify(resvs, null, 2));
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);
