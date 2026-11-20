const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const ReservationSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  sqlite_book_id: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sqlite_user_id: { type: Number, index: true },

  reservation_date: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['waiting', 'ready_for_pickup', 'fulfilled', 'cancelled', 'expired'], 
    default: 'waiting', 
    required: true 
  },
  queue_position: { type: Number, default: 1 },
  pickup_deadline: { type: Date, default: null },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'reservations'
});

// Partial unique index matching SQLite with distinct index name to avoid conflicts
ReservationSchema.index(
  { book_id: 1, user_id: 1 },
  { 
    name: 'idx_active_user_book_reservation',
    unique: true, 
    partialFilterExpression: { status: { $in: ['waiting', 'ready_for_pickup'] } } 
  }
);

ReservationSchema.index({ book_id: 1, status: 1, queue_position: 1 });
ReservationSchema.index({ user_id: 1, status: 1 });

module.exports = mongoose.model('Reservation', ReservationSchema);
