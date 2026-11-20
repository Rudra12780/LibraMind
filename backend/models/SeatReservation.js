const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const SeatReservationSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  seat_id: { type: Schema.Types.ObjectId, ref: 'Seat', required: true },
  sqlite_seat_id: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sqlite_user_id: { type: Number, index: true },
  date: { type: String, required: true, trim: true },
  time_slot: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active', 
    required: true 
  },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'seat_reservations'
});

// Partial unique index mirroring SQLite
SeatReservationSchema.index(
  { seat_id: 1, date: 1, time_slot: 1 },
  { 
    name: 'idx_seat_active_reservation',
    unique: true, 
    partialFilterExpression: { status: 'active' } 
  }
);

SeatReservationSchema.index({ user_id: 1, date: 1 });
SeatReservationSchema.index({ status: 1 });

module.exports = mongoose.model('SeatReservation', SeatReservationSchema);
