const { mongoose } = require('../db/mongoose');
const { Schema } = mongoose;

const VisitPlannerSchema = new Schema({
  sqlite_id: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sqlite_user_id: { type: Number, index: true },
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  sqlite_book_id: { type: Number, index: true },
  visited: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'visit_planner'
});

VisitPlannerSchema.index({ user_id: 1, book_id: 1 }, { unique: true });
VisitPlannerSchema.index({ book_id: 1 });

module.exports = mongoose.model('VisitPlanner', VisitPlannerSchema);
