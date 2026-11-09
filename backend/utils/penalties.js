const db = require('../db/database');

const DAILY_FINE_RATE = 1.0; // $1.00 per day overdue

/**
 * Helper: recalculates overdue statuses and fine amounts across active loans
 */
function refreshLoanStatuses() {
  const now = new Date();
  const activeLoans = db.prepare("SELECT id, due_date, status, fine_amount FROM loans WHERE status IN ('active', 'overdue') AND return_date IS NULL").all();

  const updateStmt = db.prepare('UPDATE loans SET status = ?, fine_amount = ? WHERE id = ?');

  for (const loan of activeLoans) {
    const dueDate = new Date(loan.due_date);
    if (now > dueDate) {
      const diffMs = now - dueDate;
      const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const fine = Math.max(1.0, daysOverdue * DAILY_FINE_RATE);
      updateStmt.run('overdue', fine, loan.id);
    }
  }
}

/**
 * Checks whether a user has outstanding circulation penalties or overdue loans.
 * If librarian sent a Penalty Payment Request (penalty_status = 'pending'),
 * book borrowing is blocked until the fine is settled.
 * @param {number|string} userId
 */
function checkUserPenaltyStatus(userId) {
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

  refreshLoanStatuses();

  const user = db.prepare(`
    SELECT id, name, penalty_status, penalty_amount, penalty_reason, penalty_qr_code,
           return_warning_active, return_warning_message, return_warning_loan_id, return_warning_book_title
    FROM users WHERE id = ?
  `).get(userId);

  const overdueLoans = db.prepare(`
    SELECT l.*, b.title as book_title, bc.copy_code
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN book_copies bc ON l.copy_id = bc.id
    WHERE l.user_id = ? AND l.return_date IS NULL AND l.status = 'overdue'
  `).all(userId);

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
    overdueCount: overdueLoans.length,
    penaltyLoans: overdueLoans,
    reason
  };
}

module.exports = {
  DAILY_FINE_RATE,
  refreshLoanStatuses,
  checkUserPenaltyStatus
};

