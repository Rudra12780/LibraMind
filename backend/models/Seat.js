const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const SeatSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  seat_number: { type: String, required: true, unique: true, trim: true },
  floor: { type: String, required: true, trim: true },
  section: { type: String, required: true, trim: true },
  has_power: { type: Number, default: 1 },
  has_monitor: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance'], 
    default: 'available', 
    required: true 
  },
  current_user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  sqlite_current_user_id: { type: Number, default: null },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'seats'
});

SeatSchema.index({ floor: 1, section: 1 });
SeatSchema.index({ status: 1 });

module.exports = mongoose.model('Seat', SeatSchema);
