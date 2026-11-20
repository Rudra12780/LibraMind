const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const AuditLogSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  sqlite_user_id: { type: Number, default: null },
  action: { type: String, required: true, trim: true },
  details: { type: String, default: '' },
  ip_address: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'audit_logs'
});

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ user_id: 1 });
AuditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
