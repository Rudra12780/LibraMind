const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const PasswordResetSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sqlite_user_id: { type: Number, index: true },
  token_hash: { type: String, required: true, unique: true },
  expires_at: { type: Date, required: true },
  used_at: { type: Date, default: null },
  ip_address: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'password_resets'
});

PasswordResetSchema.index({ user_id: 1, expires_at: 1 });

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
