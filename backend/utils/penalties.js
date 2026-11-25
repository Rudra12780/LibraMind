const mongoose = require('mongoose');
const Loan = require('../models/Loan');
const User = require('../models/User');
const Book = require('../models/Book');
const BookCopy = require('../models/BookCopy');
const { buildIdFilter, serializeDoc, serializeDocs } = require('./idHelper');

let sqliteDb = null;
try {
  sqliteDb = require('../db/database');
} catch (e) {}

const DAILY_FINE_RATE = 1.0; // $1.00 per day overdue

/**
 * Helper: recalculates overdue statuses and fine amounts across active loans
 */
async function refreshLoanStatuses() {
  try {
    const now = new Date();
    if (mongoose.connection.readyState !== 1) {
      if (sqliteDb) {
        const activeLoans = sqliteDb.prepare("SELECT * FROM loans WHERE status IN ('active', 'overdue') AND return_date IS NULL").all();
        for (const loan of activeLoans) {
          if (!loan.due_date) continue;
          const dueDate = new Date(loan.due_date);
          if (now > dueDate) {
            const diffMs = now.getTime() - dueDate.getTime();
            const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const fine = Math.max(1.0, daysOverdue * DAILY_FINE_RATE);
            sqliteDb.prepare("UPDATE loans SET status = 'overdue', fine_amount = ? WHERE id = ?").run(fine, loan.id);
          }
        }
      }
      return;
    }

    const activeLoans = await Loan.find({
      status: { $in: ['active', 'overdue'] },
      return_date: null
    });

    for (const loan of activeLoans) {
      if (!loan.due_date) continue;
      const dueDate = new Date(loan.due_date);
      if (now > dueDate) {
        const diffMs = now.getTime() - dueDate.getTime();
        const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const fine = Math.max(1.0, daysOverdue * DAILY_FINE_RATE);
        loan.status = 'overdue';
        loan.fine_amount = fine;
        await loan.save();
      }
    }
  } catch (err) {
    console.error('Error in refreshLoanStatuses:', err.message);
  }
}

/**
 * Checks whether a user has outstanding circulation penalties or overdue loans.
 * If librarian sent a Penalty Payment Request (penalty_status = 'pending'),
 * book borrowing is blocked until the fine is settled.
 * @param {string|number} userId
 */
async function checkUserPenaltyStatus(userId) {
  if (!userId) {
    return {
      isBlocked: false,
      hasPendingPenalty: false,
      unpaidFines: 0,
      overdueCount: 0,
      penaltyLoans: [],
      returnWarning: { active: false, message: null, loanId: null, bookTitle: null },
      reason: null
    };
  }

  await refreshLoanStatuses();

  if (mongoose.connection.readyState !== 1) {
    if (sqliteDb) {
      const sUser = sqliteDb.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(userId, String(userId).toLowerCase());
      const hasPendingPenalty = Boolean(sUser && sUser.penalty_status === 'pending' && sUser.penalty_amount > 0);
      const fineAmount = hasPendingPenalty ? parseFloat(Number(sUser.penalty_amount).toFixed(2)) : 0.0;
      return {
        isBlocked: hasPendingPenalty,
        hasPendingPenalty,
        unpaidFines: fineAmount,
        overdueCount: 0,
        penaltyLoans: [],
        returnWarning: {
          active: Boolean(sUser && sUser.return_warning_active),
          message: sUser ? sUser.return_warning_message : null,
          loanId: sUser ? sUser.return_warning_loan_id : null,
          bookTitle: sUser ? sUser.return_warning_book_title : null
        },
        reason: hasPendingPenalty ? (sUser.penalty_reason || `Account blocked due to unpaid fine of $${fineAmount.toFixed(2)}`) : null
      };
    }
    return {
      isBlocked: false,
      hasPendingPenalty: false,
      unpaidFines: 0,
      overdueCount: 0,
      penaltyLoans: [],
      returnWarning: { active: false, message: null, loanId: null, bookTitle: null },
      reason: null
    };
  }

  const user = await User.findOne(buildIdFilter(userId));
  const uFilter = buildIdFilter(userId, 'user_id', 'sqlite_user_id');

  const overdueLoans = await Loan.find({
    ...uFilter,
    return_date: null,
    status: 'overdue'
  }).populate('book_id', 'title').populate('copy_id', 'copy_code');

  const formattedOverdueLoans = overdueLoans.map(l => ({
    ...serializeDoc(l),
    book_title: l.book_id?.title || '',
    copy_code: l.copy_id?.copy_code || ''
  }));

  const hasPendingPenalty = Boolean(user && user.penalty_status === 'pending' && user.penalty_amount > 0);
  const isBlocked = hasPendingPenalty;
  const fineAmount = hasPendingPenalty ? parseFloat(Number(user.penalty_amount).toFixed(2)) : 0.0;

  let reason = null;
  if (isBlocked) {
    reason = user.penalty_reason || `Account blocked from borrowing books due to unpaid circulation penalty of $${fineAmount.toFixed(2)}. Please settle your fine using the penalty QR code to restore borrowing privileges.`;
  }

  return {
    isBlocked,
    hasPendingPenalty,
    unpaidFines: fineAmount,
    penaltyAmount: user?.penalty_amount || 0,
    penaltyReason: user?.penalty_reason || null,
    penaltyQrCode: user?.penalty_qr_code || null,
    returnWarning: {
      active: Boolean(user?.return_warning_active),
      message: user?.return_warning_message || null,
      loanId: user?.return_warning_loan_id || null,
      bookTitle: user?.return_warning_book_title || null
    },
    overdueCount: formattedOverdueLoans.length,
    penaltyLoans: formattedOverdueLoans,
    reason
  };
}

module.exports = {
  DAILY_FINE_RATE,
  refreshLoanStatuses,
  checkUserPenaltyStatus
};
