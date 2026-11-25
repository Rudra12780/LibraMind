const express = require('express');
const mongoose = require('mongoose');

const Loan = require('../models/Loan');
const Book = require('../models/Book');
const BookCopy = require('../models/BookCopy');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');

const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');
const { DAILY_FINE_RATE, refreshLoanStatuses, checkUserPenaltyStatus } = require('../utils/penalties');
const { generateQRCodeSVG } = require('../utils/qrGenerator');
const { buildIdFilter, serializeDoc, serializeDocs } = require('../utils/idHelper');

let sqliteDb = null;
try {
  sqliteDb = require('../db/database');
} catch (e) {
  console.warn('SQLite database connection failed in loans router:', e.message);
}

const router = express.Router();

const MAX_LOANS_PER_STUDENT = 10;
const MAX_RENEWALS = 2;
const LOAN_DURATION_DAYS = 14;

async function resolveUserDocAndIds(userIdOrMembership, fallbackEmail = null) {
  if (!userIdOrMembership && !fallbackEmail) return { userDoc: null, mongoUserId: null, sqliteUserId: null };
  let userDoc = null;
  if (mongoose.connection.readyState === 1) {
    try {
      if (userIdOrMembership) userDoc = await User.findOne(buildIdFilter(userIdOrMembership));
      if (!userDoc && fallbackEmail) userDoc = await User.findOne({ email: String(fallbackEmail).toLowerCase() });
    } catch (_) {}
  }
  let mongoUserId = userDoc?._id || (mongoose.Types.ObjectId.isValid(String(userIdOrMembership)) ? new mongoose.Types.ObjectId(String(userIdOrMembership)) : null);
  let sqliteUserId = userDoc?.sqlite_id || (!isNaN(Number(userIdOrMembership)) ? Number(userIdOrMembership) : null);
  if (!sqliteUserId && sqliteDb) {
    try {
      const emailToTry = userDoc?.email || fallbackEmail || (typeof userIdOrMembership === 'string' && userIdOrMembership.includes('@') ? userIdOrMembership : null);
      if (emailToTry) {
        const sUser = sqliteDb.prepare('SELECT id FROM users WHERE lower(email) = lower(?)').get(emailToTry);
        if (sUser) sqliteUserId = sUser.id;
      }
      if (!sqliteUserId && userIdOrMembership) {
        const sUser = sqliteDb.prepare('SELECT id FROM users WHERE id = ? OR membership_id = ?').get(userIdOrMembership, userIdOrMembership);
        if (sUser) sqliteUserId = sUser.id;
      }
    } catch (_) {}
  }
  return { userDoc, mongoUserId, sqliteUserId };
}

// Bulletproof Notification Dispatcher - Guarantees notification never throws or aborts transaction
async function safeCreateNotification(data) {
  try {
    let targetUserId = data.user_id;
    if (!targetUserId) return null;
    if (!mongoose.Types.ObjectId.isValid(String(targetUserId))) {
      const u = await User.findOne(buildIdFilter(targetUserId));
      if (u) targetUserId = u._id;
      else return null;
    }
    return await Notification.create({
      ...data,
      user_id: new mongoose.Types.ObjectId(String(targetUserId)),
      link: data.link || '',
      created_at: data.created_at || new Date()
    });
  } catch (err) {
    console.warn('safeCreateNotification suppressed error:', err.message);
    return null;
  }
}

// Get current user's penalty and account block status
router.get('/penalty-status', authenticateToken, async (req, res) => {
  try {
    const status = await checkUserPenaltyStatus(req.user.id);
    const user = await User.findOne(buildIdFilter(req.user.id));
    const hasPendingPenalty = user?.penalty_status === 'pending' && user?.penalty_amount > 0;

    res.json({
      ...status,
      isBlocked: status.isBlocked || hasPendingPenalty,
      hasPendingPenalty,
      penaltyAmount: user?.penalty_amount || status.unpaidFines,
      penaltyReason: user?.penalty_reason,
      penaltyQrCode: user?.penalty_qr_code
    });
  } catch (err) {
    console.error('Penalty status error:', err);
    res.status(500).json({ error: 'Failed to retrieve penalty status' });
  }
});

// Barcode copy lookup: returns physical copy, parent book, and associated/waiting patron
router.get('/copy-lookup/:barcode', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const rawBarcode = req.params.barcode ? req.params.barcode.trim() : '';
    if (!rawBarcode) {
      return res.status(400).json({ error: 'Barcode is required' });
    }

    const copy = await BookCopy.findOne({ copy_code: new RegExp(`^${rawBarcode}$`, 'i') });
    if (!copy) {
      return res.status(404).json({ error: `Physical copy barcode "${rawBarcode}" not found.` });
    }

    const book = await Book.findOne(buildIdFilter(copy.book_id));
    let assignedUser = null;

    // Check active loan on this copy
    const cFilter = buildIdFilter(copy._id, 'copy_id', 'sqlite_copy_id');
    const activeLoan = await Loan.findOne({
      ...cFilter,
      status: { $in: ['active', 'borrowed', 'overdue'] }
    }).populate('user_id');

    if (activeLoan && activeLoan.user_id) {
      const u = activeLoan.user_id;
      assignedUser = {
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        membership_id: u.membership_id,
        phone: u.phone,
        relation: `Active Borrower (Due ${new Date(activeLoan.due_date).toLocaleDateString()})`
      };
    } else if (book) {
      // Check hold reservation on this book
      const bFilter = buildIdFilter(book._id, 'book_id', 'sqlite_book_id');
      const hold = await Reservation.findOne({
        ...bFilter,
        status: { $in: ['ready_for_pickup', 'waiting'] }
      })
        .populate('user_id')
        .sort({ queue_position: 1, reservation_date: 1 });

      if (hold && hold.user_id) {
        const u = hold.user_id;
        assignedUser = {
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          membership_id: u.membership_id,
          phone: u.phone,
          relation: hold.status === 'ready_for_pickup' ? 'Ready for Pickup Hold' : `Waiting List (Queue #${hold.queue_position || 1})`
        };
      }
    }

    res.json({
      copy: serializeDoc(copy),
      book: serializeDoc(book),
      assignedUser
    });
  } catch (err) {
    console.error('Barcode lookup error:', err);
    res.status(500).json({ error: 'Failed to look up barcode details' });
  }
});

// 1. Send Book Return Warning to Patron (Librarian/Admin)
router.post('/:id/send-return-warning', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const loan = await Loan.findOne(buildIdFilter(req.params.id))
      .populate('book_id')
      .populate('user_id');

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    if (loan.status === 'returned' || loan.return_date) {
      return res.status(400).json({ error: 'This volume has already been returned. Cannot send return warning.' });
    }

    let member = loan.user_id;
    if (!member || !member._id) {
      member = await User.findOne(buildIdFilter(loan.user_id || loan.sqlite_user_id));
    }
    let book = loan.book_id;
    if (!book || !book._id) {
      book = await Book.findOne(buildIdFilter(loan.book_id || loan.sqlite_book_id));
    }

    const bookTitle = book?.title || 'Book';
    const warningMsg = `Your book return date for "${bookTitle}" has passed. The physical volume must be returned to the library desk immediately to avoid circulation penalty assessment.`;

    if (member && member._id) {
      try {
        await User.updateOne(
          { _id: member._id },
          {
            $set: {
              return_warning_active: 1,
              return_warning_message: warningMsg,
              return_warning_loan_id: loan.sqlite_id || 0,
              return_warning_book_title: bookTitle
            }
          }
        );
      } catch (uErr) {
        console.warn('User warning status update error:', uErr.message);
      }
    }

    try {
      await Loan.updateOne(
        { _id: loan._id },
        {
          $set: {
            warning_sent: 1,
            warning_sent_at: new Date()
          }
        }
      );
    } catch (lErr) {
      console.warn('Loan warning status update error:', lErr.message);
    }

    if (member && member._id) {
      await safeCreateNotification({
        user_id: member._id,
        title: '⚠️ Urgent: Book Return Date Passed',
        message: warningMsg,
        type: 'due',
        link: '/dashboard',
        created_at: new Date()
      });
    }

    try {
      logAudit(req.user.id, 'RETURN_WARNING_SENT', `Sent return warning to student ${member?.name || 'Patron'} (${member?.email || ''}) for volume "${bookTitle}"`);
    } catch (_) {}

    res.json({
      success: true,
      message: `Book Return Warning sent to ${member?.name || 'Patron'}. A warning banner will appear when they sign in.`,
      loanId: loan._id.toString(),
      userId: member ? member._id.toString() : null
    });
  } catch (err) {
    console.error('Send return warning error:', err);
    res.status(500).json({ error: err.message || 'Failed to send return warning' });
  }
});

// Dismiss Return Warning (Student upon login acknowledgment)
router.post('/dismiss-return-warning', authenticateToken, async (req, res) => {
  try {
    await User.updateOne(buildIdFilter(req.user.id), {
      $set: { return_warning_active: 0 }
    });
    res.json({ success: true, message: 'Warning acknowledged' });
  } catch (err) {
    console.error('Dismiss return warning error:', err);
    res.status(500).json({ error: 'Failed to dismiss warning' });
  }
});

// 2. Issue penalty and send QR code to user / Send Penalty Payment Request (Librarian/Admin)
router.post(['/:id/issue-penalty-qr', '/:id/send-penalty-request'], authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const loan = await Loan.findOne(buildIdFilter(req.params.id))
      .populate('book_id')
      .populate('user_id');

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    let member = loan.user_id;
    if (!member || !member._id) {
      member = await User.findOne(buildIdFilter(loan.user_id || loan.sqlite_user_id));
    }
    let book = loan.book_id;
    if (!book || !book._id) {
      book = await Book.findOne(buildIdFilter(loan.book_id || loan.sqlite_book_id));
    }

    const borrowDate = new Date(loan.borrow_date);
    const now = new Date();
    const daysElapsed = Math.floor((now - borrowDate) / (1000 * 60 * 60 * 24));
    const penaltyAmount = Math.max(15.0, (daysElapsed - 14) * 2.0);

    const qrPayload = `libramind://fine-pay?user=${member ? member._id : loan.user_id}&loan=${loan._id}&amount=${penaltyAmount.toFixed(2)}&issued=${now.toISOString()}`;
    const qrDataUrl = generateQRCodeSVG(qrPayload);

    const bookTitle = book?.title || 'Book';

    if (member) {
      member.penalty_qr_code = qrDataUrl;
      member.penalty_amount = penaltyAmount;
      member.penalty_reason = `Circulation overdue penalty: "${bookTitle}" reached ${Math.max(15, daysElapsed)} days on loan.`;
      member.penalty_status = 'pending';
      member.return_warning_active = 0;
      await member.save();
    }

    loan.status = 'overdue';
    loan.fine_amount = penaltyAmount;
    loan.fine_paid = 0;
    await loan.save();

    if (member) {
      await Notification.create({
        user_id: member._id,
        title: 'Circulation Penalty Issued: QR Payment Required',
        message: `Your loan for "${bookTitle}" has exceeded 14 days. A circulation fine of $${penaltyAmount.toFixed(2)} has been issued. Please scan your penalty QR code to restore borrowing privileges.`,
        type: 'overdue',
        link: '/dashboard',
        created_at: new Date()
      });
    }

    logAudit(req.user.id, 'PENALTY_QR_ISSUED', `Issued $${penaltyAmount.toFixed(2)} penalty QR code to student ${member?.name} (${member?.email}) for loan #${loan._id}`);

    res.json({
      success: true,
      message: `Penalty fine of $${penaltyAmount.toFixed(2)} issued. QR code sent to student ${member?.name || 'patron'}.`,
      penaltyAmount,
      qrCode: qrDataUrl,
      userId: member ? member._id.toString() : null
    });
  } catch (err) {
    console.error('Issue penalty QR error:', err);
    res.status(500).json({ error: 'Failed to issue penalty and QR code' });
  }
});

// Cancel / Waive penalty for a specific loan (Librarian/Admin)
router.post('/:id/cancel-penalty', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const loan = await Loan.findOne(buildIdFilter(req.params.id))
      .populate('book_id')
      .populate('user_id');

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    let member = loan.user_id;
    if (!member || !member._id) {
      member = await User.findOne(buildIdFilter(loan.user_id || loan.sqlite_user_id));
    }
    let book = loan.book_id;
    if (!book || !book._id) {
      book = await Book.findOne(buildIdFilter(loan.book_id || loan.sqlite_book_id));
    }

    const bookTitle = book?.title || 'Book';

    if (member) {
      member.penalty_status = 'none';
      member.penalty_qr_code = '';
      member.penalty_amount = 0;
      member.penalty_reason = '';
      await member.save();
    }

    loan.fine_amount = 0;
    loan.fine_paid = 1;
    await loan.save();

    if (member) {
      await Notification.create({
        user_id: member._id,
        title: 'Circulation Penalty Cancelled',
        message: `Your overdue circulation penalty for "${bookTitle}" has been cancelled/waived by library staff. Your borrowing privileges are fully restored.`,
        type: 'announcement',
        link: '/dashboard',
        created_at: new Date()
      });
    }

    logAudit(req.user.id, 'PENALTY_CANCELLED', `Librarian cancelled overdue penalty on loan #${loan._id} for patron ${member?.name} (${member?.email})`);

    res.json({
      success: true,
      message: `Penalty on "${bookTitle}" successfully cancelled for ${member?.name || 'patron'}. Borrowing privileges restored.`,
      userId: member ? member._id.toString() : null,
      loanId: loan._id.toString()
    });
  } catch (err) {
    console.error('Cancel penalty error:', err);
    res.status(500).json({ error: 'Failed to cancel penalty' });
  }
});

// Approve / Confirm penalty (Librarian/Admin - Requirement 10)
router.post(['/:id/penalty/approve', '/penalties/:id/approve'], authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const loan = await Loan.findOne(buildIdFilter(req.params.id))
      .populate('book_id')
      .populate('user_id');

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    let member = loan.user_id;
    if (!member || !member._id) {
      member = await User.findOne(buildIdFilter(loan.user_id || loan.sqlite_user_id));
    }
    let book = loan.book_id;
    if (!book || !book._id) {
      book = await Book.findOne(buildIdFilter(loan.book_id || loan.sqlite_book_id));
    }

    const bookTitle = book?.title || 'Book';
    const fineAmount = loan.fine_amount || member?.penalty_amount || 15.0;

    loan.penalty_status = 'confirmed';
    await loan.save();

    if (member) {
      member.penalty_status = 'confirmed';
      await member.save();

      await Notification.create({
        user_id: member._id,
        title: 'Circulation Penalty Confirmed by Librarian',
        message: `Your penalty fine of $${fineAmount.toFixed(2)} for overdue loan "${bookTitle}" has been reviewed and confirmed by library staff. Please settle this fine via QR code to clear your circulation hold.`,
        type: 'overdue',
        link: '/dashboard',
        created_at: new Date()
      });
    }

    logAudit(req.user.id, 'PENALTY_CONFIRMED', `Librarian confirmed circulation penalty of $${fineAmount.toFixed(2)} for patron ${member?.name} (${member?.email}) on volume "${bookTitle}"`);

    res.json({
      success: true,
      message: `Penalty on "${bookTitle}" successfully confirmed for ${member?.name || 'patron'}.`,
      loanId: loan._id.toString(),
      fineAmount
    });
  } catch (err) {
    console.error('Approve penalty error:', err);
    res.status(500).json({ error: 'Failed to approve penalty' });
  }
});

// Decline / Waive penalty with reason (Librarian/Admin - Requirement 10)
router.post(['/:id/penalty/decline', '/penalties/:id/decline'], authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const { reason = 'Penalty declined and waived upon librarian administrative review' } = req.body;
    const loan = await Loan.findOne(buildIdFilter(req.params.id))
      .populate('book_id')
      .populate('user_id');

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    let member = loan.user_id;
    if (!member || !member._id) {
      member = await User.findOne(buildIdFilter(loan.user_id || loan.sqlite_user_id));
    }
    let book = loan.book_id;
    if (!book || !book._id) {
      book = await Book.findOne(buildIdFilter(loan.book_id || loan.sqlite_book_id));
    }

    const bookTitle = book?.title || 'Book';

    loan.fine_amount = 0;
    loan.fine_paid = 1;
    loan.penalty_status = 'declined';
    await loan.save();

    if (member) {
      member.penalty_status = 'none';
      member.penalty_qr_code = '';
      member.penalty_amount = 0;
      member.penalty_reason = '';
      await member.save();

      await Notification.create({
        user_id: member._id,
        title: 'Circulation Penalty Declined & Waived',
        message: `Your circulation penalty for "${bookTitle}" was reviewed and declined by library staff. Reason: ${reason}. Full borrowing privileges have been restored.`,
        type: 'announcement',
        link: '/dashboard',
        created_at: new Date()
      });
    }

    logAudit(req.user.id, 'PENALTY_DECLINED', `Librarian declined penalty on loan #${loan._id} for patron ${member?.name}. Reason: ${reason}`);

    res.json({
      success: true,
      message: `Penalty on "${bookTitle}" successfully declined and waived for ${member?.name || 'patron'}. Borrowing privileges restored.`,
      loanId: loan._id.toString()
    });
  } catch (err) {
    console.error('Decline penalty error:', err);
    res.status(500).json({ error: 'Failed to decline penalty' });
  }
});

// Waive all penalties for a user (Librarian/Admin)
router.post('/waive-user-penalty/:userId', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const member = await User.findOne(buildIdFilter(req.params.userId));
    if (!member) {
      return res.status(404).json({ error: 'Patron not found' });
    }

    member.penalty_status = 'none';
    member.penalty_qr_code = '';
    member.penalty_amount = 0;
    member.penalty_reason = '';
    await member.save();

    const uFilter = buildIdFilter(member._id, 'user_id', 'sqlite_user_id');
    await Loan.updateMany(uFilter, {
      $set: { fine_amount: 0, fine_paid: 1 }
    });

    await Notification.create({
      user_id: member._id,
      title: 'Circulation Penalty Waived',
      message: 'All outstanding circulation penalties on your account have been waived by library staff. Full borrowing privileges are restored.',
      type: 'announcement',
      link: '/dashboard',
      created_at: new Date()
    });

    logAudit(req.user.id, 'PENALTY_WAIVED_USER', `Librarian waived all circulation penalties for patron ${member.name} (${member.email})`);

    res.json({
      success: true,
      message: `All circulation penalties waived for ${member.name}. Account is in good standing.`,
      userId: member._id.toString()
    });
  } catch (err) {
    console.error('Waive user penalty error:', err);
    res.status(500).json({ error: 'Failed to waive patron penalties' });
  }
});

// Pay / clear penalty via QR code
router.post('/pay-penalty-qr', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne(buildIdFilter(req.user.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const fineAmount = user.penalty_amount || 0;

    user.penalty_status = 'paid';
    user.penalty_qr_code = '';
    user.penalty_amount = 0;
    user.penalty_reason = '';
    await user.save();

    const uFilter = buildIdFilter(user._id, 'user_id', 'sqlite_user_id');
    await Loan.updateMany(
      { ...uFilter, fine_amount: { $gt: 0 } },
      { $set: { fine_paid: 1 } }
    );

    await Notification.create({
      user_id: user._id,
      title: 'Penalty Cleared & Privileges Restored',
      message: `Your penalty fine of $${fineAmount > 0 ? fineAmount.toFixed(2) : '15.00'} has been successfully settled. Your book borrowing privileges have been fully restored!`,
      type: 'due',
      link: '/dashboard',
      created_at: new Date()
    });

    logAudit(user._id.toString(), 'PENALTY_QR_PAID', `Settled penalty fine of $${fineAmount.toFixed(2)} via QR scan`);

    res.json({
      success: true,
      message: 'Penalty fine successfully settled! All borrowing privileges are restored.',
      amountPaid: fineAmount
    });
  } catch (err) {
    console.error('Pay penalty QR error:', err);
    res.status(500).json({ error: 'Failed to process penalty payment' });
  }
});

// Get authenticated user's current penalty details
router.get('/user-penalty', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne(buildIdFilter(req.user.id));
    res.json({
      penaltyStatus: user?.penalty_status || 'none',
      penaltyAmount: user?.penalty_amount || 0,
      penaltyReason: user?.penalty_reason || null,
      penaltyQrCode: user?.penalty_qr_code || null,
      hasPendingPenalty: user?.penalty_status === 'pending' && user?.penalty_amount > 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve penalty details' });
  }
});

// Pay fine for specific loan ID
router.post('/:id/pay-fine', authenticateToken, async (req, res) => {
  try {
    const loan = await Loan.findOne(buildIdFilter(req.params.id));
    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    if (req.user.role === 'student' && String(loan.user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to settle fines for another member' });
    }

    if (!loan.fine_amount || loan.fine_amount <= 0 || loan.fine_paid) {
      return res.status(400).json({ error: 'No outstanding fine on this volume' });
    }

    loan.fine_paid = 1;
    await loan.save();

    logAudit(req.user.id, 'FINE_PAID', `Paid circulation fine of $${loan.fine_amount.toFixed(2)} on loan #${loan._id}`);
    const postStatus = await checkUserPenaltyStatus(loan.user_id);

    res.json({
      message: `Fine of $${loan.fine_amount.toFixed(2)} successfully settled.`,
      amountPaid: loan.fine_amount,
      isBlocked: postStatus.isBlocked,
      holdCleared: !postStatus.isBlocked
    });
  } catch (err) {
    console.error('Pay single fine error:', err);
    res.status(500).json({ error: err.message || 'Failed to pay fine' });
  }
});

// Pay outstanding circulation fines & clear account hold
router.post('/pay-fines', authenticateToken, async (req, res) => {
  try {
    const { loan_id, payment_method = 'Campus Scholar Card' } = req.body;
    await refreshLoanStatuses();

    const uFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const query = {
      ...uFilter,
      fine_amount: { $gt: 0 },
      $or: [{ fine_paid: 0 }, { fine_paid: null }]
    };

    if (loan_id) {
      Object.assign(query, buildIdFilter(loan_id));
    }

    const unpaidLoans = await Loan.find(query);
    if (unpaidLoans.length === 0) {
      return res.status(400).json({ error: 'No outstanding fines found to settle.' });
    }

    let totalPaid = 0.0;
    for (const l of unpaidLoans) {
      totalPaid += l.fine_amount;
      l.fine_paid = 1;
      await l.save();
    }

    logAudit(req.user.id, 'FINE_PAID', `Paid circulation penalty of $${totalPaid.toFixed(2)} via ${payment_method}`);

    await Notification.create({
      user_id: req.user.id,
      title: 'Circulation Penalty Settled',
      message: `Payment of $${totalPaid.toFixed(2)} received. Your circulation hold has been cleared, and all borrowing, reservation, and study seat privileges are fully restored.`,
      type: 'due',
      link: '/dashboard',
      created_at: new Date()
    });

    const postStatus = await checkUserPenaltyStatus(req.user.id);

    res.json({
      message: `Successfully paid $${totalPaid.toFixed(2)} in circulation penalties.`,
      amountPaid: totalPaid,
      isBlocked: postStatus.isBlocked,
      holdCleared: !postStatus.isBlocked
    });
  } catch (err) {
    console.error('Fine payment error:', err);
    res.status(500).json({ error: err.message || 'Failed to process penalty payment' });
  }
});

// Get loans (filtered by authenticated user role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    await refreshLoanStatuses();
    const { status, userId } = req.query;

    const targetUserId = req.user.role === 'student' ? req.user.id : userId;
    const { userDoc, mongoUserId, sqliteUserId } = await resolveUserDocAndIds(targetUserId, req.user.role === 'student' ? req.user.email : null);

    if (mongoose.connection.readyState !== 1) {
      if (sqliteDb) {
        let sql = `
          SELECT l.*, b.title as book_title, b.author as book_author, b.cover_image, b.isbn, b.category, b.floor, b.section, b.shelf, b.total_copies, b.available_copies,
                 bc.copy_code, bc.condition as copy_condition,
                 u.name as student_name, u.email as student_email, u.membership_id,
                 u.penalty_status, u.penalty_amount, u.penalty_qr_code, u.return_warning_active, u.return_warning_message
          FROM loans l
          LEFT JOIN books b ON l.book_id = b.id
          LEFT JOIN book_copies bc ON l.copy_id = bc.id
          LEFT JOIN users u ON l.user_id = u.id
          WHERE 1=1
        `;
        const params = [];
        if (sqliteUserId) {
          sql += ' AND l.user_id = ?';
          params.push(sqliteUserId);
        }
        if (status && status !== 'all') {
          if (status === 'borrowed' || status === 'active') {
            sql += " AND l.status IN ('active', 'borrowed', 'overdue')";
          } else {
            sql += ' AND l.status = ?';
            params.push(status);
          }
        }
        sql += ' ORDER BY l.borrow_date DESC';
        const rows = sqliteDb.prepare(sql).all(...params);
        return res.json(rows.map(l => ({
          ...l,
          book_id: String(l.book_id),
          borrow_status: l.status === 'active' ? 'borrowed' : l.status,
          db_status: l.status,
          is_active: (l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue') && l.status !== 'returned'
        })));
      }
      return res.json([]);
    }

    const query = {};
    if (targetUserId) {
      const orClauses = [];
      if (mongoUserId) orClauses.push({ user_id: mongoUserId });
      if (sqliteUserId) orClauses.push({ sqlite_user_id: sqliteUserId });
      if (orClauses.length > 0) {
        query.$or = orClauses;
      } else {
        Object.assign(query, buildIdFilter(targetUserId, 'user_id', 'sqlite_user_id'));
      }
    }

    if (status && status !== 'all') {
      if (status === 'borrowed' || status === 'active') {
        query.status = { $in: ['active', 'borrowed', 'overdue'] };
      } else {
        query.status = status;
      }
    }

    const rawLoans = await Loan.find(query)
      .populate('book_id')
      .populate('copy_id')
      .populate('user_id')
      .sort({ borrow_date: -1 });

    const loans = rawLoans.map(l => {
      const b = l.book_id;
      const bc = l.copy_id;
      const u = l.user_id;
      const lObj = serializeDoc(l);

      const resolvedBookId = b?._id ? b._id.toString() : (b?.id !== undefined ? String(b.id) : (l.sqlite_book_id !== undefined ? String(l.sqlite_book_id) : String(l.book_id || '')));

      return {
        ...lObj,
        book_id: resolvedBookId,
        book_title: b?.title || 'Unknown Title',
        book_author: b?.author || '',
        cover_image: b?.cover_image || '',
        isbn: b?.isbn || '',
        category: b?.category || '',
        floor: b?.floor || 'Floor 1',
        shelf: b?.shelf || 'Shelf A-1',
        total_copies: b?.total_copies || 1,
        available_copies: b?.available_copies || 0,
        copy_code: bc?.copy_code || '',
        copy_condition: bc?.condition || 'Good',
        student_name: u?.name || 'Reader',
        student_email: u?.email || '',
        membership_id: u?.membership_id || '',
        penalty_status: u?.penalty_status || 'none',
        penalty_amount: u?.penalty_amount || 0,
        penalty_qr_code: u?.penalty_qr_code || '',
        return_warning_active: u?.return_warning_active || 0,
        return_warning_message: u?.return_warning_message || '',
        warning_sent: l.warning_sent || 0,
        warning_sent_at: l.warning_sent_at || null,
        status: l.status,
        borrow_status: l.status === 'active' ? 'borrowed' : l.status,
        db_status: l.status,
        is_active: l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue'
      };
    });

    res.json(loans);
  } catch (err) {
    console.error('Fetch loans error:', err);
    if (sqliteDb) {
      try {
        const { sqliteUserId } = await resolveUserDocAndIds(req.user.role === 'student' ? req.user.id : req.query.userId);
        let sql = `
          SELECT l.*, b.title as book_title, b.author as book_author, b.cover_image, b.isbn, b.category, b.floor, b.section, b.shelf, b.total_copies, b.available_copies,
                 bc.copy_code, bc.condition as copy_condition,
                 u.name as student_name, u.email as student_email, u.membership_id,
                 u.penalty_status, u.penalty_amount, u.penalty_qr_code, u.return_warning_active, u.return_warning_message
          FROM loans l
          LEFT JOIN books b ON l.book_id = b.id
          LEFT JOIN book_copies bc ON l.copy_id = bc.id
          LEFT JOIN users u ON l.user_id = u.id
          WHERE 1=1
        `;
        const params = [];
        if (sqliteUserId) {
          sql += ' AND l.user_id = ?';
          params.push(sqliteUserId);
        }
        sql += ' ORDER BY l.borrow_date DESC';
        const rows = sqliteDb.prepare(sql).all(...params);
        return res.json(rows.map(l => ({
          ...l,
          book_id: String(l.book_id),
          borrow_status: l.status === 'active' ? 'borrowed' : l.status,
          db_status: l.status,
          is_active: (l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue') && l.status !== 'returned'
        })));
      } catch (sqErr) {}
    }
    res.status(500).json({ error: 'Failed to retrieve loans' });
  }
});

// Issue book to member (Librarian / Admin)
router.post('/issue', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const membership_id = req.body.membership_id || req.body.membershipId;
    const book_id = req.body.book_id || req.body.bookId;
    const copy_code = req.body.copy_code || req.body.copyCode;
    const loan_days = req.body.loan_days || req.body.loanDays || LOAN_DURATION_DAYS;

    if (!membership_id || (!book_id && !copy_code)) {
      return res.status(400).json({ error: 'Membership ID and Book/Copy details are required' });
    }

    const cleanMemberId = membership_id.trim();
    const member = await User.findOne({
      $or: [
        { membership_id: cleanMemberId },
        { email: cleanMemberId.toLowerCase() }
      ]
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found with provided ID' });
    }

    const penaltyStatus = await checkUserPenaltyStatus(member._id);
    const hasUnpaidPenalty = penaltyStatus.isBlocked || (member.penalty_status === 'pending' && member.penalty_amount > 0);

    if (hasUnpaidPenalty) {
      const fineToPay = member.penalty_amount > 0 ? member.penalty_amount : penaltyStatus.unpaidFines;
      return res.status(403).json({
        error: `Cannot issue book: Member ${member.name} has an active circulation hold due to unpaid penalties ($${fineToPay.toFixed(2)}) or overdue loans. Penalties must be settled before borrowing.`,
        penaltyBlocked: true,
        unpaidFines: fineToPay,
        overdueCount: penaltyStatus.overdueCount
      });
    }

    const uFilter = buildIdFilter(member._id, 'user_id', 'sqlite_user_id');
    const activeCount = await Loan.countDocuments({
      ...uFilter,
      status: { $in: ['active', 'overdue'] }
    });

    if (activeCount >= MAX_LOANS_PER_STUDENT) {
      return res.status(400).json({ error: `Member reached maximum borrowing limit of ${MAX_LOANS_PER_STUDENT} books.` });
    }

    let copy = null;
    if (copy_code) {
      copy = await BookCopy.findOne({ copy_code: new RegExp(`^${copy_code.trim()}$`, 'i') });
    }
    if (!copy && book_id) {
      const bFilter = buildIdFilter(book_id, 'book_id', 'sqlite_book_id');
      copy = await BookCopy.findOne({ ...bFilter, status: 'available' });
    }

    if (!copy) {
      return res.status(400).json({ error: 'No physical copy found for this book' });
    }

    if (copy.status !== 'available') {
      return res.status(400).json({ error: `Physical copy ${copy.copy_code} is currently ${copy.status}. Cannot issue.` });
    }

    const book = await Book.findOne(buildIdFilter(copy.book_id));
    if (!book) {
      return res.status(404).json({ error: 'Parent book not found' });
    }

    // Single active copy rule: A member cannot borrow the same book twice concurrently
    const bFilter = buildIdFilter(copy.book_id, 'book_id', 'sqlite_book_id');
    const existingActiveLoan = await Loan.findOne({
      ...bFilter,
      ...uFilter,
      status: { $in: ['active', 'borrowed', 'overdue'] }
    });

    if (existingActiveLoan) {
      return res.status(400).json({
        error: `Member ${member.name} already has an active borrowed copy of "${book.title}". Under library circulation rules, a member cannot borrow the same book twice concurrently. Please return the previous copy first.`
      });
    }

    const now = new Date();
    const dueDate = new Date(now.getTime() + parseInt(loan_days) * 24 * 60 * 60 * 1000);

    const loan = await Loan.create({
      book_id: book._id,
      copy_id: copy._id,
      user_id: member._id,
      borrow_date: now,
      due_date: dueDate,
      status: 'active',
      created_at: now
    });

    copy.status = 'borrowed';
    await copy.save();

    book.available_copies = Math.max(0, book.available_copies - 1);
    await book.save();

    await Notification.create({
      user_id: member._id,
      title: 'Book Borrowed',
      message: `You have checked out "${book.title}" (Copy: ${copy.copy_code}). Due date: ${dueDate.toLocaleDateString()}.`,
      type: 'borrow',
      link: '/dashboard',
      created_at: now
    });

    logAudit(req.user.id, 'LOAN_ISSUED', `Issued "${book.title}" [${copy.copy_code}] to ${member.name} (${member.email})`);

    res.status(201).json({
      message: 'Book issued successfully',
      loanId: loan._id.toString(),
      bookTitle: book.title,
      copyCode: copy.copy_code,
      memberName: member.name,
      dueDate: dueDate.toISOString()
    });
  } catch (err) {
    console.error('Issue book error:', err);
    res.status(400).json({ error: err.message || 'Failed to issue book' });
  }
});

// Student Self-Checkout
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const rawBookId = req.body.book_id || req.body.bookId;
    const rawCopyCode = req.body.copy_code || req.body.copyCode;
    const loan_days = req.body.loan_days || req.body.loanDays || LOAN_DURATION_DAYS;

    if (!rawBookId && !rawCopyCode) {
      return res.status(400).json({ error: 'Book ID or copy code is required' });
    }

    if (mongoose.connection.readyState !== 1 && sqliteDb) {
      const { sqliteUserId } = await resolveUserDocAndIds(req.user.id);
      const sUser = sqliteDb.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(sqliteUserId || req.user.id, String(req.user.email || '').toLowerCase());
      if (!sUser) return res.status(404).json({ error: 'User not found' });
      const sBook = sqliteDb.prepare('SELECT * FROM books WHERE id = ? OR isbn = ?').get(rawBookId, rawBookId);
      if (!sBook) return res.status(404).json({ error: 'Book not found' });
      let copy = null;
      if (rawCopyCode) {
        copy = sqliteDb.prepare('SELECT * FROM book_copies WHERE copy_code = ?').get(rawCopyCode.trim());
      } else {
        copy = sqliteDb.prepare("SELECT * FROM book_copies WHERE book_id = ? AND status = 'available' LIMIT 1").get(sBook.id);
      }
      if (!copy) return res.status(400).json({ error: 'No physical copies currently available for checkout.' });
      const existingLoan = sqliteDb.prepare("SELECT * FROM loans WHERE book_id = ? AND user_id = ? AND status IN ('active', 'borrowed', 'overdue')").get(sBook.id, sUser.id);
      if (existingLoan) return res.status(400).json({ error: 'You already have an active borrowed copy of this book. Under library circulation policy, you can only borrow one copy of a title at a time.' });
      const now = new Date();
      const dueDate = new Date(now.getTime() + parseInt(loan_days) * 24 * 60 * 60 * 1000);
      sqliteDb.prepare("UPDATE book_copies SET status = 'borrowed' WHERE id = ?").run(copy.id);
      sqliteDb.prepare("UPDATE books SET available_copies = MAX(0, available_copies - 1) WHERE id = ?").run(sBook.id);
      const resIns = sqliteDb.prepare(`
        INSERT INTO loans (book_id, copy_id, user_id, borrow_date, due_date, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'active', ?)
      `).run(sBook.id, copy.id, sUser.id, now.toISOString(), dueDate.toISOString(), now.toISOString());
      return res.status(201).json({
        message: 'Checkout successful',
        loanId: String(resIns.lastInsertRowid),
        bookTitle: sBook.title,
        copyCode: copy.copy_code,
        dueDate: dueDate.toISOString()
      });
    }

    const member = await User.findOne(buildIdFilter(req.user.id));
    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    const penaltyStatus = await checkUserPenaltyStatus(member._id);
    const hasUnpaidPenalty = penaltyStatus.isBlocked || (member.penalty_status === 'pending' && member.penalty_amount > 0);

    if (hasUnpaidPenalty) {
      const fineToPay = member.penalty_amount > 0 ? member.penalty_amount : penaltyStatus.unpaidFines;
      return res.status(403).json({
        error: `Cannot borrow books: Your account has an outstanding circulation penalty fine of $${fineToPay.toFixed(2)}. Please scan and pay the fine using your penalty QR code to restore borrowing privileges.`,
        penaltyBlocked: true,
        unpaidFines: fineToPay,
        overdueCount: penaltyStatus.overdueCount
      });
    }

    const uFilter = buildIdFilter(member._id, 'user_id', 'sqlite_user_id');
    const activeCount = await Loan.countDocuments({
      ...uFilter,
      status: { $in: ['active', 'overdue'] }
    });

    if (activeCount >= MAX_LOANS_PER_STUDENT) {
      return res.status(400).json({ error: `You have reached the maximum borrowing limit of ${MAX_LOANS_PER_STUDENT} books.` });
    }

    let copy = null;
    if (rawCopyCode) {
      copy = await BookCopy.findOne({ copy_code: new RegExp(`^${rawCopyCode.trim()}$`, 'i') });
    }
    if (!copy && rawBookId) {
      const targetBook = await Book.findOne(buildIdFilter(rawBookId));
      if (targetBook) {
        const bFilter = buildIdFilter(targetBook._id, 'book_id', 'sqlite_book_id');
        const userHold = await Reservation.findOne({
          ...bFilter,
          ...uFilter,
          status: 'ready_for_pickup'
        });

        if (userHold) {
          copy = await BookCopy.findOne({ ...bFilter, status: 'reserved' });
          userHold.status = 'fulfilled';
          await userHold.save();
        } else {
          copy = await BookCopy.findOne({ ...bFilter, status: 'available' });
        }
      }
    }

    if (!copy) {
      return res.status(400).json({ error: 'No physical copies currently available for checkout.' });
    }

    if (copy.status !== 'available' && copy.status !== 'reserved') {
      return res.status(400).json({ error: `Copy ${copy.copy_code} is not available for checkout (Status: ${copy.status}).` });
    }

    // Only 1 copy of a book at a time per user
    const bFilter = buildIdFilter(copy.book_id, 'book_id', 'sqlite_book_id');
    const currentActiveLoan = await Loan.findOne({
      ...bFilter,
      ...uFilter,
      status: { $in: ['active', 'borrowed', 'overdue'] }
    });

    if (currentActiveLoan) {
      return res.status(400).json({
        error: 'You already have an active borrowed copy of this book. Under library circulation policy, you can only borrow one copy of a title at a time. Once you return your current copy, you may borrow it again.'
      });
    }

    const book = await Book.findOne(buildIdFilter(copy.book_id));
    const now = new Date();
    const dueDate = new Date(now.getTime() + parseInt(loan_days) * 24 * 60 * 60 * 1000);

    const loan = await Loan.create({
      book_id: book._id,
      sqlite_book_id: book.sqlite_id || null,
      copy_id: copy._id,
      sqlite_copy_id: copy.sqlite_id || null,
      user_id: member._id,
      sqlite_user_id: member.sqlite_id || (!isNaN(Number(req.user.id)) ? Number(req.user.id) : null),
      borrow_date: now,
      due_date: dueDate,
      status: 'active',
      created_at: now
    });

    copy.status = 'borrowed';
    await copy.save();

    book.available_copies = Math.max(0, book.available_copies - 1);
    await book.save();

    // Mirror to SQLite
    if (sqliteDb) {
      try {
        const sUserId = member.sqlite_id || sqliteDb.prepare('SELECT id FROM users WHERE email = ?').get(member.email)?.id;
        const sBookId = book.sqlite_id || sqliteDb.prepare('SELECT id FROM books WHERE isbn = ?').get(book.isbn)?.id;
        let sCopyId = copy.sqlite_id || null;
        if (sUserId && sBookId) {
          if (!sCopyId) {
            const availCopy = sqliteDb.prepare("SELECT id FROM book_copies WHERE book_id = ? AND status = 'available' LIMIT 1").get(sBookId);
            if (availCopy) sCopyId = availCopy.id;
          }
          if (sCopyId) {
            sqliteDb.prepare("UPDATE book_copies SET status = 'borrowed' WHERE id = ?").run(sCopyId);
          }
          sqliteDb.prepare("UPDATE books SET available_copies = MAX(0, available_copies - 1) WHERE id = ?").run(sBookId);
          sqliteDb.prepare(`
            INSERT INTO loans (book_id, copy_id, user_id, borrow_date, due_date, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'active', ?)
          `).run(sBookId, sCopyId, sUserId, now.toISOString(), dueDate.toISOString(), now.toISOString());
        }
      } catch (sqErr) {
        console.warn('SQLite mirror checkout warning:', sqErr.message);
      }
    }

    await Notification.create({
      user_id: member._id,
      title: 'Checkout Confirmed',
      message: `Successfully checked out "${book.title}" (Copy: ${copy.copy_code}). Due date: ${dueDate.toLocaleDateString()}.`,
      type: 'borrow',
      link: '/dashboard',
      created_at: now
    });

    logAudit(member._id.toString(), 'BOOK_CHECKOUT', `Student checked out "${book.title}" [${copy.copy_code}]`);

    res.status(201).json({
      message: 'Checkout successful',
      loanId: loan._id.toString(),
      bookTitle: book.title,
      copyCode: copy.copy_code,
      dueDate: dueDate.toISOString()
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(400).json({ error: err.message || 'Checkout failed' });
  }
});

// Return book handler
async function handleBookReturn(req, res) {
  try {
    const now = new Date();
    if (mongoose.connection.readyState !== 1 && sqliteDb) {
      const sLoan = sqliteDb.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);
      if (!sLoan) return res.status(404).json({ error: 'Loan record not found' });
      if (sLoan.status === 'returned' || sLoan.return_date) {
        return res.json({
          success: true,
          message: 'This volume has already been marked as returned.',
          fineAmount: sLoan.fine_amount || 0,
          status: 'returned',
          alreadyReturned: true
        });
      }
      const dueDate = new Date(sLoan.due_date);
      let fine = 0.0;
      if (now > dueDate) {
        const diffMs = now - dueDate;
        const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        fine = daysOverdue * DAILY_FINE_RATE;
      }
      sqliteDb.prepare("UPDATE loans SET status = 'returned', return_date = ?, fine_amount = ? WHERE id = ?").run(now.toISOString(), fine, sLoan.id);
      const nextRes = sqliteDb.prepare("SELECT * FROM reservations WHERE book_id = ? AND status = 'waiting' ORDER BY queue_position ASC, reservation_date ASC LIMIT 1").get(sLoan.book_id);
      if (nextRes) {
        const pickupDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
        sqliteDb.prepare("UPDATE reservations SET status = 'ready_for_pickup', pickup_deadline = ? WHERE id = ?").run(pickupDeadline, nextRes.id);
        if (sLoan.copy_id) {
          sqliteDb.prepare("UPDATE book_copies SET status = 'reserved' WHERE id = ?").run(sLoan.copy_id);
        }
      } else {
        if (sLoan.copy_id) {
          sqliteDb.prepare("UPDATE book_copies SET status = 'available' WHERE id = ?").run(sLoan.copy_id);
        }
        sqliteDb.prepare("UPDATE books SET available_copies = MIN(total_copies, available_copies + 1) WHERE id = ?").run(sLoan.book_id);
      }
      return res.json({
        success: true,
        message: 'Book returned successfully',
        fineAmount: fine,
        status: 'returned'
      });
    }

    const loan = await Loan.findOne(buildIdFilter(req.params.id))
      .populate('book_id')
      .populate('copy_id')
      .populate('user_id');

    if (!loan) {
      if (sqliteDb) {
        const sLoan = sqliteDb.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);
        if (sLoan) {
          sqliteDb.prepare("UPDATE loans SET status = 'returned', return_date = ? WHERE id = ?").run(now.toISOString(), sLoan.id);
          if (sLoan.copy_id) sqliteDb.prepare("UPDATE book_copies SET status = 'available' WHERE id = ?").run(sLoan.copy_id);
          sqliteDb.prepare("UPDATE books SET available_copies = MIN(total_copies, available_copies + 1) WHERE id = ?").run(sLoan.book_id);
          return res.json({ success: true, message: 'Book returned successfully', fineAmount: 0, status: 'returned' });
        }
      }
      return res.status(404).json({ error: 'Loan record not found' });
    }

    if (loan.status === 'returned' || loan.return_date) {
      return res.json({
        success: true,
        message: 'This volume has already been marked as returned.',
        fineAmount: loan.fine_amount || 0,
        status: 'returned',
        alreadyReturned: true
      });
    }

    let book = loan.book_id;
    if (!book || !book._id) {
      book = await Book.findOne(buildIdFilter(loan.book_id || loan.sqlite_book_id));
    }
    let user = loan.user_id;
    if (!user || !user._id) {
      user = await User.findOne(buildIdFilter(loan.user_id || loan.sqlite_user_id));
    }
    let copy = loan.copy_id;
    if (!copy || !copy._id) {
      copy = await BookCopy.findOne(buildIdFilter(loan.copy_id || loan.sqlite_copy_id));
    }

    const dueDate = new Date(loan.due_date);
    let fine = 0.0;
    if (now > dueDate) {
      const diffMs = now - dueDate;
      const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      fine = daysOverdue * DAILY_FINE_RATE;
    }

    loan.status = 'returned';
    loan.return_date = now;
    loan.fine_amount = fine;
    try {
      await Loan.updateOne(
        { _id: loan._id },
        {
          $set: {
            status: 'returned',
            return_date: now,
            fine_amount: fine
          }
        }
      );
    } catch (saveErr) {
      console.warn('Loan updateOne warning:', saveErr.message);
    }

    // Mirror return to SQLite
    if (sqliteDb) {
      try {
        const sLoanId = loan.sqlite_id || (!isNaN(Number(req.params.id)) ? Number(req.params.id) : null);
        if (sLoanId) {
          sqliteDb.prepare("UPDATE loans SET status = 'returned', return_date = ?, fine_amount = ? WHERE id = ?").run(now.toISOString(), fine, sLoanId);
        } else if (book?.isbn || book?.sqlite_id) {
          const sBookId = book.sqlite_id || sqliteDb.prepare('SELECT id FROM books WHERE isbn = ?').get(book.isbn)?.id;
          const sUserId = user?.sqlite_id || (!isNaN(Number(req.user.id)) ? Number(req.user.id) : null);
          if (sBookId && sUserId) {
            sqliteDb.prepare("UPDATE loans SET status = 'returned', return_date = ?, fine_amount = ? WHERE book_id = ? AND user_id = ? AND status != 'returned'").run(now.toISOString(), fine, sBookId, sUserId);
          }
        }
        if (book) {
          const sBookId = book.sqlite_id || sqliteDb.prepare('SELECT id FROM books WHERE isbn = ?').get(book.isbn)?.id;
          if (sBookId) {
            sqliteDb.prepare("UPDATE books SET available_copies = MIN(total_copies, available_copies + 1) WHERE id = ?").run(sBookId);
          }
        }
      } catch (sqErr) {
        console.warn('SQLite return sync warning:', sqErr.message);
      }
    }

    const bookTitle = book?.title || 'Book';
    const targetBookId = book?._id || loan.book_id;
    const bFilter = targetBookId ? buildIdFilter(targetBookId, 'book_id', 'sqlite_book_id') : null;

    // Check if there is an active reservation waiting for this specific book (FIFO order - Requirement 4 & 8)
    let nextReservation = null;
    if (bFilter) {
      try {
        nextReservation = await Reservation.findOne({
          ...bFilter,
          status: 'waiting'
        }).sort({ queue_position: 1, reservation_date: 1 });
      } catch (rFindErr) {
        console.warn('Reservation query warning on return:', rFindErr.message);
      }
    }

    if (nextReservation && copy) {
      try {
        await BookCopy.updateOne({ _id: copy._id }, { $set: { status: 'reserved' } });
      } catch (_) {}

      const pickupDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      try {
        nextReservation.status = 'ready_for_pickup';
        nextReservation.pickup_deadline = pickupDeadline;
        await Reservation.updateOne(
          { _id: nextReservation._id },
          {
            $set: {
              status: 'ready_for_pickup',
              pickup_deadline: pickupDeadline
            }
          }
        );
      } catch (resUpErr) {
        console.warn('Reservation update ready_for_pickup warning:', resUpErr.message);
      }

      await safeCreateNotification({
        user_id: nextReservation.user_id,
        title: 'Book Ready for Pickup!',
        message: `Your reserved book "${bookTitle}" is ready at the desk! Please pick it up by ${pickupDeadline.toLocaleString()}.`,
        type: 'pickup',
        link: '/dashboard',
        created_at: now
      });

      // Notify librarians about FIFO allocation (Requirement 8)
      try {
        const librarians = await User.find({ role: { $in: ['librarian', 'admin'] } });
        const waitingPatron = await User.findOne(buildIdFilter(nextReservation.user_id));
        for (const lib of librarians) {
          await safeCreateNotification({
            user_id: lib._id,
            title: '📖 Book Returned: Routed to Waiting Patron (FIFO)',
            message: `"${bookTitle}" was returned by ${user?.name || 'patron'}. Automatically routed to next eligible waiting patron: ${waitingPatron?.name || 'Patron'} (Queue #1). Pickup deadline set to 48 hours.`,
            type: 'pickup',
            link: '/librarian?tab=reservations',
            created_at: now
          });
        }
      } catch (notifErr) {
        console.warn('Failed to dispatch librarian return notification:', notifErr.message);
      }
    } else {
      if (copy) {
        try {
          copy.status = 'available';
          await copy.save();
        } catch (_) {
          await BookCopy.updateOne({ _id: copy._id }, { $set: { status: 'available' } });
        }
      }
      if (book) {
        try {
          await Book.updateOne({ _id: book._id }, { $inc: { available_copies: 1 } });
        } catch (_) {}
      }
    }

    if (user && user._id) {
      await safeCreateNotification({
        user_id: user._id,
        title: 'Book Return Confirmed',
        message: `"${bookTitle}" has been returned. ${fine > 0 ? `Outstanding fine: $${fine.toFixed(2)}` : 'Thank you!'}`,
        type: 'return',
        link: '/dashboard',
        created_at: now
      });
    }

    try {
      logAudit(req.user.id, 'BOOK_RETURNED', `Returned "${bookTitle}" from ${user?.name || 'Reader'}. Fine: $${fine}`);
    } catch (_) {}

    res.json({
      success: true,
      message: 'Book returned successfully',
      fineAmount: fine,
      status: 'returned'
    });
  } catch (err) {
    console.error('Return book error:', err);
    res.status(500).json({ error: err.message || 'Failed to process book return' });
  }
}

async function handleBookReturnWithOwnerCheck(req, res) {
  if (req.user.role === 'student') {
    let loan = null;
    if (mongoose.connection.readyState === 1) {
      loan = await Loan.findOne(buildIdFilter(req.params.id));
    }
    if (!loan && sqliteDb) {
      loan = sqliteDb.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);
      if (loan) {
        loan.sqlite_id = loan.id;
        loan.sqlite_user_id = loan.user_id;
      }
    }
    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }
    const { mongoUserId, sqliteUserId } = await resolveUserDocAndIds(req.user.id);
    const matchesUser =
      (mongoUserId && String(loan.user_id) === String(mongoUserId)) ||
      (sqliteUserId && String(loan.sqlite_user_id) === String(sqliteUserId)) ||
      String(loan.user_id) === String(req.user.id) ||
      String(loan.sqlite_user_id) === String(req.user.id);
    if (!matchesUser) {
      return res.status(403).json({ error: 'You can only return your own borrowed books.' });
    }
  }
  return handleBookReturn(req, res);
}

router.post('/:id/return', authenticateToken, handleBookReturnWithOwnerCheck);
router.put('/:id/return', authenticateToken, handleBookReturnWithOwnerCheck);

// Renew loan
router.post('/:id/renew', authenticateToken, async (req, res) => {
  try {
    let loan = null;
    if (mongoose.connection.readyState === 1) {
      loan = await Loan.findOne(buildIdFilter(req.params.id));
    }
    if (!loan && sqliteDb) {
      loan = sqliteDb.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);
      if (loan) {
        loan.sqlite_id = loan.id;
        loan.sqlite_user_id = loan.user_id;
      }
    }
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (req.user.role === 'student') {
      const { mongoUserId, sqliteUserId } = await resolveUserDocAndIds(req.user.id);
      const matchesUser =
        (mongoUserId && String(loan.user_id) === String(mongoUserId)) ||
        (sqliteUserId && String(loan.sqlite_user_id) === String(sqliteUserId)) ||
        String(loan.user_id) === String(req.user.id) ||
        String(loan.sqlite_user_id) === String(req.user.id);
      if (!matchesUser) {
        return res.status(403).json({ error: 'Not authorized to renew this loan' });
      }
    }

    if (loan.status === 'returned') {
      return res.status(400).json({ error: 'Cannot renew a returned loan' });
    }

    const penaltyStatus = await checkUserPenaltyStatus(loan.user_id);
    if (penaltyStatus.isBlocked) {
      return res.status(403).json({
        error: `Cannot renew loan: Your account is blocked due to unpaid circulation penalties ($${penaltyStatus.unpaidFines.toFixed(2)}) or overdue loans. Please settle your fines first.`,
        penaltyBlocked: true,
        unpaidFines: penaltyStatus.unpaidFines
      });
    }

    if (loan.renewal_count >= MAX_RENEWALS) {
      return res.status(400).json({ error: `Maximum of ${MAX_RENEWALS} renewals reached for this item.` });
    }

    const bFilter = buildIdFilter(loan.book_id, 'book_id', 'sqlite_book_id');
    const waitingRes = await Reservation.countDocuments({
      ...bFilter,
      status: 'waiting'
    });

    if (waitingRes > 0) {
      return res.status(400).json({ error: 'Cannot renew: Other students are currently waiting for this book.' });
    }

    const currentDue = new Date(loan.due_date);
    const newDue = new Date(currentDue.getTime() + LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);

    loan.due_date = newDue;
    loan.renewal_count = (loan.renewal_count || 0) + 1;
    loan.status = 'active';
    await loan.save();

    await Notification.create({
      user_id: loan.user_id,
      title: 'Loan Renewed',
      message: `Your loan has been renewed by ${LOAN_DURATION_DAYS} days. New due date: ${newDue.toLocaleDateString()}.`,
      type: 'borrow',
      link: '/dashboard',
      created_at: new Date()
    });

    res.json({
      message: 'Loan renewed successfully',
      newDueDate: newDue.toISOString(),
      renewalsRemaining: MAX_RENEWALS - loan.renewal_count
    });
  } catch (err) {
    console.error('Renew error:', err);
    res.status(500).json({ error: 'Failed to renew loan' });
  }
});

module.exports = router;
