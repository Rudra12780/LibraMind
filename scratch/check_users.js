const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
const User = require('../backend/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/libramind')
  .then(async () => {
    const users = await User.find({}, 'name email role membership_id');
    console.log('Users in MongoDB:');
    users.forEach(u => console.log(`- ${u.name} | ${u.email} | Role: ${u.role} | ID: ${u.membership_id}`));
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
