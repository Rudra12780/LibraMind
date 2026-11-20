const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true, trim: true },
  publisher: { type: String, default: '' },
  publication_year: { type: Number, default: null },
  category: { type: String, required: true, trim: true },
  language: { type: String, default: 'English' },
  edition: { type: String, default: '' },
  description: { type: String, default: '' },
  cover_image: { type: String, default: '' },
  floor: { type: String, default: 'Floor 1' },
  section: { type: String, default: 'Main Hall' },
  shelf: { type: String, default: 'Shelf A-1' },
  rack: { type: String, default: 'Rack 01' },
  total_copies: { type: Number, default: 1 },
  available_copies: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'books'
});

BookSchema.index({ category: 1 });
BookSchema.index({ title: 1 });
BookSchema.index({ author: 1 });
BookSchema.index({ available_copies: 1 });
BookSchema.index({ category: 1, available_copies: 1 });
BookSchema.index({ publication_year: -1 });

module.exports = mongoose.model('Book', BookSchema);
