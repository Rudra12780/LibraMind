const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const WishlistSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sqlite_user_id: { type: Number, index: true },
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  sqlite_book_id: { type: Number, index: true },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'wishlist'
});

WishlistSchema.index({ user_id: 1, book_id: 1 }, { unique: true });
WishlistSchema.index({ book_id: 1 });

module.exports = mongoose.model('Wishlist', WishlistSchema);
