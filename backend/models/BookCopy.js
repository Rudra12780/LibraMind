const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const BookCopySchema = new Schema({
  sqlite_id: { type: Number, index: true },
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  sqlite_book_id: { type: Number, index: true },
  copy_code: { type: String, required: true, unique: true, trim: true },
  status: { 
    type: String, 
    enum: ['available', 'borrowed', 'reserved', 'maintenance'], 
    default: 'available', 
    required: true 
  },
  condition: { 
    type: String, 
    enum: ['New', 'Good', 'Fair', 'Worn'], 
    default: 'Good' 
  },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'book_copies'
});

BookCopySchema.index({ book_id: 1, status: 1 });

module.exports = mongoose.model('BookCopy', BookCopySchema);
