const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['student', 'librarian', 'admin'], required: true },
  membership_id: { type: String, required: true, unique: true, trim: true },
  interests: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },

  phone: { type: String, default: '' },
  phone_verified: { type: Boolean, default: false },
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  gender: { type: String, default: '' },
  bio: { type: String, default: '' },
  profile_photo: { type: String, default: '' },
  is_profile_completed: { type: Number, default: 0 },

  penalty_qr_code: { type: String, default: '' },
  penalty_amount: { type: Number, default: 0 },
  penalty_reason: { type: String, default: '' },
  penalty_status: { type: String, default: 'none' },
  return_warning_active: { type: Number, default: 0 },
  return_warning_message: { type: String, default: '' },
  return_warning_loan_id: { type: Number, default: null },
  return_warning_book_title: { type: String, default: '' }
}, {
  timestamps: false,
  collection: 'users'
});

UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });

module.exports = mongoose.model('User', UserSchema);
