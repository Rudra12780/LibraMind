const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sqlite_user_id: { type: Number, index: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ['borrow', 'return', 'due', 'overdue', 'reservation', 'pickup', 'announcement', 'seat', 'warning', 'payment', 'info'], 
    required: true 
  },
  link: { type: String, default: '' },
  is_read: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'notifications'
});

NotificationSchema.index({ user_id: 1, created_at: -1 });
NotificationSchema.index({ user_id: 1, is_read: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
