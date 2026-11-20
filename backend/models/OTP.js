const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const OTPSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  phone: { type: String, required: true, trim: true },
  otp_code: { type: String, required: true, trim: true },
  purpose: { type: String, enum: ['register', 'login'], default: 'login' },
  expires_at: { type: Date, required: true },
  used: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'otps'
});

OTPSchema.index({ phone: 1, used: 1, expires_at: 1 });
OTPSchema.index({ expires_at: 1 });

module.exports = mongoose.model('OTP', OTPSchema);
