const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const LoanSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  sqlite_book_id: { type: Number, index: true },
  copy_id: { type: Schema.Types.ObjectId, ref: 'BookCopy', required: false, default: null },
  sqlite_copy_id: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sqlite_user_id: { type: Number, index: true },

  borrow_date: { type: Date, default: Date.now },
  due_date: { type: Date, required: true },
  return_date: { type: Date, default: null },
  status: { 
    type: String, 
    enum: ['active', 'returned', 'overdue'], 
    default: 'active', 
    required: true 
  },
  renewal_count: { type: Number, default: 0 },
  fine_amount: { type: Number, default: 0.0 },
  fine_paid: { type: Number, default: 0 },
  warning_sent: { type: Number, default: 0 },
  warning_sent_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'loans'
});

LoanSchema.index({ status: 1, user_id: 1 });
LoanSchema.index({ book_id: 1, status: 1 });
LoanSchema.index({ copy_id: 1, status: 1 });
LoanSchema.index({ status: 1, due_date: 1 });
LoanSchema.index({ borrow_date: 1 });

module.exports = mongoose.model('Loan', LoanSchema);
