const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');
const { DAILY_FINE_RATE, refreshLoanStatuses, checkUserPenaltyStatus } = require('../utils/penalties');
const { generateQRCodeSVG } = require('../utils/qrGenerator');

const router = express.Router();

const MAX_LOANS_PER_STUDENT = 10; // Generous limit for student research & reading
const MAX_RENEWALS = 2;
const LOAN_DURATION_DAYS = 14;

// Get current user's penalty and account block status
router.get('/penalty-status', authenticateToken, (req, res) => {
  try {
    const status = checkUserPenaltyStatus(req.user.id);
    const user = db.prepare('SELECT penalty_status, penalty_amount, penalty_reason, penalty_qr_code FROM users WHERE id = ?').get(req.user.id);
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
router.get('/copy-lookup/:barcode', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const rawBarcode = req.params.barcode ? req.params.barcode.trim() : '';
    if (!rawBarcode) {
      return res.status(400).json({ error: 'Barcode is required' });
    }

    const copy = db.prepare('SELECT * FROM book_copies WHERE UPPER(copy_code) = UPPER(?)').get(rawBarcode);
    if (!copy) {
      return res.status(404).json({ error: `Physical copy barcode "${rawBarcode}" not found.` });
    }

    const book = db.prepare('SELECT id, title, author, category, isbn, cover_image, available_copies, total_copies FROM books WHERE id = ?').get(copy.book_id);

    let assignedUser = null;

    // Check active loan on this copy
    const activeLoan = db.prepare(`
      SELECT l.*, u.name, u.email, u.membership_id, u.phone
      FROM loans l
      JOIN users u ON l.user_id = u.id
      WHERE l.copy_id = ? AND l.status IN ('active', 'borrowed', 'overdue')
    `).get(copy.id);

    if (activeLoan) {
      assignedUser = {
        id: activeLoan.user_id,
        name: activeLoan.name,
        email: activeLoan.email,
        membership_id: activeLoan.membership_id,
        phone: activeLoan.phone,
        relation: `Active Borrower (Due ${new Date(activeLoan.due_date).toLocaleDateString()})`
      };
    } else {
      // Check hold reservation on this book
      const hold = db.prepare(`
        SELECT r.*, u.name, u.email, u.membership_id, u.phone
        FROM reservations r
        JOIN users u ON r.user_id = u.id
        WHERE r.book_id = ? AND r.status IN ('ready_for_pickup', 'waiting')
        ORDER BY CASE WHEN r.status = 'ready_for_pickup' THEN 1 ELSE 2 END, r.queue_position ASC, r.reservation_date ASC
        LIMIT 1
      `).get(copy.book_id);

      if (hold) {
        assignedUser = {
          id: hold.user_id,
          name: hold.name,
          email: hold.email,
          membership_id: hold.membership_id,
          phone: hold.phone,
          relation: hold.status === 'ready_for_pickup' ? 'Ready for Pickup Hold' : `Waiting List (Queue #${hold.queue_position || 1})`
        };
      }
    }

    res.json({
      copy,
      book,
      assignedUser
    });
  } catch (err) {
    console.error('Barcode lookup error:', err);
    res.status(500).json({ error: 'Failed to look up barcode details' });
  }
});

// 1. Send Book Return Warning to Patron (Librarian/Admin)
router.post('/:id/send-return-warning', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = db.prepare(`
      SELECT l.*, b.title as book_title, u.id as member_id, u.name as member_name, u.email as member_email
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `).get(loanId);

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    const warningMsg = `Your book return date for "${loan.book_title}" has passed. The physical volume must be returned to the library desk immediately to avoid circulation penalty assessment.`;

    const tx = db.transaction(() => {
      // Set active return warning on student account
      db.prepare(`
        UPDATE users SET
          return_warning_active = 1,
          return_warning_message = ?,
          return_warning_loan_id = ?,
          return_warning_book_title = ?
        WHERE id = ?
      `).run(warningMsg, loan.id, loan.book_title, loan.member_id);

      // Mark loan warning sent
      db.prepare(`
        UPDATE loans SET
          warning_sent = 1,
          warning_sent_at = datetime('now')
        WHERE id = ?
      `).run(loan.id);

      // Send high-priority notification to student
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, '⚠️ Urgent: Book Return Date Passed', ?, 'due', '/dashboard')
      `).run(loan.member_id, warningMsg);

      logAudit(req.user.id, 'RETURN_WARNING_SENT', `Sent return warning to student ${loan.member_name} (${loan.member_email}) for volume "${loan.book_title}"`);
    });

    tx();

    res.json({
      success: true,
      message: `Book Return Warning sent to ${loan.member_name}. A warning banner will appear when they sign in.`,
      loanId: loan.id,
      userId: loan.member_id
    });
  } catch (err) {
    console.error('Send return warning error:', err);
    res.status(500).json({ error: 'Failed to send return warning' });
  }
});

// Dismiss Return Warning (Student upon login acknowledgment)
router.post('/dismiss-return-warning', authenticateToken, (req, res) => {
  try {
    db.prepare(`
      UPDATE users SET
        return_warning_active = 0
      WHERE id = ?
    `).run(req.user.id);
    res.json({ success: true, message: 'Warning acknowledged' });
  } catch (err) {
    console.error('Dismiss return warning error:', err);
    res.status(500).json({ error: 'Failed to dismiss warning' });
  }
});

// 2. Issue penalty and send QR code to user / Send Penalty Payment Request (Librarian/Admin)
router.post(['/:id/issue-penalty-qr', '/:id/send-penalty-request'], authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = db.prepare(`
      SELECT l.*, b.title as book_title, u.name as member_name, u.email as member_email
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `).get(loanId);

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    const borrowDate = new Date(loan.borrow_date);
    const now = new Date();
    const daysElapsed = Math.floor((now - borrowDate) / (1000 * 60 * 60 * 24));
    
    // Standard fine for 15+ days: $15.00 base penalty
    const penaltyAmount = Math.max(15.0, (daysElapsed - 14) * 2.0);

    // Generate pure vector SVG QR code data URL
    const qrPayload = `libramind://fine-pay?user=${loan.user_id}&loan=${loan.id}&amount=${penaltyAmount.toFixed(2)}&issued=${now.toISOString()}`;
    const qrDataUrl = generateQRCodeSVG(qrPayload);

    // Update user record
    db.prepare(`
      UPDATE users SET
        penalty_qr_code = ?,
        penalty_amount = ?,
        penalty_reason = ?,
        penalty_status = 'pending',
        return_warning_active = 0
      WHERE id = ?
    `).run(
      qrDataUrl,
      penaltyAmount,
      `Circulation overdue penalty: "${loan.book_title}" reached ${Math.max(15, daysElapsed)} days on loan.`,
      loan.user_id
    );

    // Also update loan fine amount and status to overdue
    db.prepare(`
      UPDATE loans SET
        status = 'overdue',
        fine_amount = ?,
        fine_paid = 0
      WHERE id = ?
    `).run(penaltyAmount, loan.id);

    // Send high-priority notification to student
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, 'Circulation Penalty Issued: QR Payment Required', ?, 'overdue', '/dashboard')
    `).run(
      loan.user_id,
      `Your loan for "${loan.book_title}" has exceeded 14 days. A circulation fine of $${penaltyAmount.toFixed(2)} has been issued. Please scan your penalty QR code to restore borrowing privileges.`
    );

    logAudit(req.user.id, 'PENALTY_QR_ISSUED', `Issued $${penaltyAmount.toFixed(2)} penalty QR code to student ${loan.member_name} (${loan.member_email}) for loan #${loan.id}`);

    res.json({
      success: true,
      message: `Penalty fine of $${penaltyAmount.toFixed(2)} issued. QR code sent to student ${loan.member_name}.`,
      penaltyAmount,
      qrCode: qrDataUrl,
      userId: loan.user_id
    });
  } catch (err) {
    console.error('Issue penalty QR error:', err);
    res.status(500).json({ error: 'Failed to issue penalty and QR code' });
  }
});

// Cancel / Waive penalty for a specific loan (Librarian/Admin)
router.post('/:id/cancel-penalty', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = db.prepare(`
      SELECT l.*, b.title as book_title, u.id as member_id, u.name as member_name, u.email as member_email
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `).get(loanId);

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    const cancelTx = db.transaction(() => {
      // 1. Clear penalty on user record
      db.prepare(`
        UPDATE users SET
          penalty_status = 'none',
          penalty_qr_code = NULL,
          penalty_amount = 0,
          penalty_reason = NULL
        WHERE id = ?
      `).run(loan.member_id);

      // 2. Clear loan fine and mark fine_paid = 1
      db.prepare(`
        UPDATE loans SET
          fine_amount = 0,
          fine_paid = 1
        WHERE id = ?
      `).run(loan.id);

      // 3. Send notification to student confirming cancellation
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, 'Circulation Penalty Cancelled', ?, 'announcement', '/dashboard')
      `).run(
        loan.member_id,
        `Your overdue circulation penalty for "${loan.book_title}" has been cancelled/waived by library staff. Your borrowing privileges are fully restored.`
      );

      // 4. Audit log
      logAudit(req.user.id, 'PENALTY_CANCELLED', `Librarian cancelled overdue penalty on loan #${loan.id} for patron ${loan.member_name} (${loan.member_email})`);
    });

    cancelTx();

    res.json({
      success: true,
      message: `Penalty on "${loan.book_title}" successfully cancelled for ${loan.member_name}. Borrowing privileges restored.`,
      userId: loan.member_id,
      loanId: loan.id
    });
  } catch (err) {
    console.error('Cancel penalty error:', err);
    res.status(500).json({ error: 'Failed to cancel penalty' });
  }
});

// Waive all penalties for a user (Librarian/Admin)
router.post('/waive-user-penalty/:userId', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const userId = req.params.userId;
    const member = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId);
    if (!member) {
      return res.status(404).json({ error: 'Patron not found' });
    }

    const waiveTx = db.transaction(() => {
      db.prepare(`
        UPDATE users SET
          penalty_status = 'none',
          penalty_qr_code = NULL,
          penalty_amount = 0,
          penalty_reason = NULL
        WHERE id = ?
      `).run(userId);

      db.prepare(`
        UPDATE loans SET
          fine_amount = 0,
          fine_paid = 1
        WHERE user_id = ? AND (fine_paid = 0 OR fine_paid IS NULL)
      `).run(userId);

      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, 'Circulation Penalty Waived', ?, 'announcement', '/dashboard')
      `).run(
        userId,
        `All outstanding circulation penalties on your account have been waived by library staff. Full borrowing privileges are restored.`
      );

      logAudit(req.user.id, 'PENALTY_WAIVED_USER', `Librarian waived all circulation penalties for patron ${member.name} (${member.email})`);
    });

    waiveTx();

    res.json({
      success: true,
      message: `All circulation penalties waived for ${member.name}. Account is in good standing.`,
      userId
    });
  } catch (err) {
    console.error('Waive user penalty error:', err);
    res.status(500).json({ error: 'Failed to waive patron penalties' });
  }
});

// Pay / clear penalty via QR code
router.post('/pay-penalty-qr', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.prepare('SELECT id, name, email, penalty_amount, penalty_status FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const fineAmount = user.penalty_amount || 0;

    // Clear penalty on user
    db.prepare(`
      UPDATE users SET
        penalty_status = 'paid',
        penalty_qr_code = NULL,
        penalty_amount = 0,
        penalty_reason = NULL
      WHERE id = ?
    `).run(userId);

    // Clear fines on user's active/overdue loans
    db.prepare(`
      UPDATE loans SET
        fine_paid = 1
      WHERE user_id = ? AND fine_amount > 0 AND (fine_paid = 0 OR fine_paid IS NULL)
    `).run(userId);

    // Notify user of clearance
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, 'Penalty Cleared & Privileges Restored', ?, 'due', '/dashboard')
    `).run(
      userId,
      `Your penalty fine of $${fineAmount > 0 ? fineAmount.toFixed(2) : '15.00'} has been successfully settled. Your book borrowing privileges have been fully restored!`
    );

    logAudit(userId, 'PENALTY_QR_PAID', `Settled penalty fine of $${fineAmount.toFixed(2)} via QR scan`);

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
router.get('/user-penalty', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, name, penalty_status, penalty_amount, penalty_reason, penalty_qr_code
      FROM users WHERE id = ?
    `).get(req.user.id);

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
router.post('/:id/pay-fine', authenticateToken, (req, res) => {
  try {
    const loanId = req.params.id;
    const userId = req.user.id;

    const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    if (req.user.role === 'student' && loan.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to settle fines for another member' });
    }

    if (!loan.fine_amount || loan.fine_amount <= 0 || loan.fine_paid) {
      return res.status(400).json({ error: 'No outstanding fine on this volume' });
    }

    db.prepare('UPDATE loans SET fine_paid = 1 WHERE id = ?').run(loanId);

    logAudit(userId, 'FINE_PAID', `Paid circulation fine of $${loan.fine_amount.toFixed(2)} on loan #${loanId}`);

    const postStatus = checkUserPenaltyStatus(loan.user_id);

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
router.post('/pay-fines', authenticateToken, (req, res) => {
  try {
    const { loan_id, payment_method = 'Campus Scholar Card' } = req.body;
    const userId = req.user.id;

    refreshLoanStatuses();

    let query = `
      SELECT id, fine_amount, book_id, copy_id
      FROM loans
      WHERE user_id = ? AND fine_amount > 0 AND (fine_paid = 0 OR fine_paid IS NULL)
    `;
    const params = [userId];

    if (loan_id) {
      query += ` AND id = ?`;
      params.push(loan_id);
    }

    const unpaidLoans = db.prepare(query).all(...params);

    if (unpaidLoans.length === 0) {
      return res.status(400).json({ error: 'No outstanding fines found to settle.' });
    }

    let totalPaid = 0.0;
    const payTx = db.transaction(() => {
      const updateStmt = db.prepare('UPDATE loans SET fine_paid = 1 WHERE id = ?');
      for (const l of unpaidLoans) {
        totalPaid += l.fine_amount;
        updateStmt.run(l.id);
      }

      // Add audit log
      logAudit(userId, 'FINE_PAID', `Paid circulation penalty of $${totalPaid.toFixed(2)} via ${payment_method}`);

      // Add confirmation notification
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, 'Circulation Penalty Settled', ?, 'due', '/dashboard')
      `).run(
        userId,
        `Payment of $${totalPaid.toFixed(2)} received. Your circulation hold has been cleared, and all borrowing, reservation, and study seat privileges are fully restored.`
      );
    });

    payTx();

    const postStatus = checkUserPenaltyStatus(userId);

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
router.get('/', authenticateToken, (req, res) => {
  try {
    refreshLoanStatuses();
    const { status, userId } = req.query;

    let query = `
      SELECT l.*,
        b.title as book_title,
        b.author as book_author,
        b.cover_image,
        b.isbn,
        b.category,
        b.floor,
        b.shelf,
        b.total_copies,
        b.available_copies,
        bc.copy_code,
        bc.condition as copy_condition,
        u.name as student_name,
        u.email as student_email,
        u.membership_id,
        u.penalty_status,
        u.penalty_amount,
        u.penalty_qr_code,
        u.return_warning_active,
        u.return_warning_message,
        l.warning_sent,
        l.warning_sent_at
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN book_copies bc ON l.copy_id = bc.id
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Students only see their own loans
    if (req.user.role === 'student') {
      query += ` AND l.user_id = ?`;
      params.push(req.user.id);
    } else if (userId) {
      query += ` AND l.user_id = ?`;
      params.push(userId);
    }

    if (status && status !== 'all') {
      if (status === 'borrowed' || status === 'active') {
        query += ` AND l.status IN ('active', 'borrowed', 'overdue')`;
      } else {
        query += ` AND l.status = ?`;
        params.push(status);
      }
    }

    query += ` ORDER BY l.borrow_date DESC`;

    const rawLoans = db.prepare(query).all(...params);
    const loans = rawLoans.map(l => ({
      ...l,
      // Provide robust status values matching both 'active' and 'borrowed' conventions
      status: l.status,
      borrow_status: l.status === 'active' ? 'borrowed' : l.status,
      db_status: l.status,
      is_active: l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue'
    }));
    res.json(loans);
  } catch (err) {
    console.error('Fetch loans error:', err);
    res.status(500).json({ error: 'Failed to retrieve loans' });
  }
});

// Issue book to member (Librarian / Admin)
router.post('/issue', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const membership_id = req.body.membership_id || req.body.membershipId;
    const book_id = req.body.book_id || req.body.bookId;
    const copy_code = req.body.copy_code || req.body.copyCode;
    const loan_days = req.body.loan_days || req.body.loanDays || LOAN_DURATION_DAYS;

    if (!membership_id || (!book_id && !copy_code)) {
      return res.status(400).json({ error: 'Membership ID and Book/Copy details are required' });
    }

    // 1. Find user
    const member = db.prepare('SELECT id, name, email, role FROM users WHERE membership_id = ? OR email = ?').get(membership_id.trim(), membership_id.trim());
    if (!member) {
      return res.status(404).json({ error: 'Member not found with provided ID' });
    }

    // Check circulation penalty & account hold
    const penaltyStatus = checkUserPenaltyStatus(member.id);
    const userPenalty = db.prepare('SELECT penalty_status, penalty_amount FROM users WHERE id = ?').get(member.id);
    const hasUnpaidPenalty = penaltyStatus.isBlocked || (userPenalty && (userPenalty.penalty_status === 'pending' || userPenalty.penalty_amount > 0));

    if (hasUnpaidPenalty) {
      const fineToPay = (userPenalty && userPenalty.penalty_amount > 0) ? userPenalty.penalty_amount : penaltyStatus.unpaidFines;
      return res.status(403).json({
        error: `Cannot issue book: Member ${member.name} has an active circulation hold due to unpaid penalties ($${fineToPay.toFixed(2)}) or overdue loans. Penalties must be settled before borrowing.`,
        penaltyBlocked: true,
        unpaidFines: fineToPay,
        overdueCount: penaltyStatus.overdueCount
      });
    }

    // Check active loan limit
    const activeCount = db.prepare("SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status IN ('active', 'overdue')").get(member.id);
    if (activeCount.count >= MAX_LOANS_PER_STUDENT) {
      return res.status(400).json({ error: `Member reached maximum borrowing limit of ${MAX_LOANS_PER_STUDENT} books.` });
    }

    const now = new Date();
    const dueDate = new Date(now.getTime() + parseInt(loan_days) * 24 * 60 * 60 * 1000);

    const issueTx = db.transaction(() => {
      // Find copy atomically inside transaction
      let copy;
      if (copy_code) {
        copy = db.prepare('SELECT * FROM book_copies WHERE UPPER(copy_code) = UPPER(?)').get(copy_code.trim());
        if (!copy && !isNaN(Number(copy_code.trim()))) {
          copy = db.prepare("SELECT * FROM book_copies WHERE book_id = ? AND status = 'available' LIMIT 1").get(Number(copy_code.trim()));
        }
      }
      if (!copy && book_id) {
        copy = db.prepare("SELECT * FROM book_copies WHERE book_id = ? AND status = 'available' LIMIT 1").get(book_id);
      }

      if (!copy) {
        throw new Error('No physical copy found for this book');
      }

      if (copy.status !== 'available') {
        throw new Error(`Physical copy ${copy.copy_code} is currently ${copy.status}. Cannot issue.`);
      }

      const book = db.prepare('SELECT * FROM books WHERE id = ?').get(copy.book_id);

      // Create loan record
      const loanRes = db.prepare(`
        INSERT INTO loans (book_id, copy_id, user_id, borrow_date, due_date, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `).run(book.id, copy.id, member.id, now.toISOString(), dueDate.toISOString());

      // Update copy status
      db.prepare("UPDATE book_copies SET status = 'borrowed' WHERE id = ?").run(copy.id);

      // Decrement available copies
      db.prepare('UPDATE books SET available_copies = MAX(0, available_copies - 1) WHERE id = ?').run(book.id);

      // Create notification for student
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, 'borrow', '/dashboard')
      `).run(
        member.id,
        'Book Borrowed',
        `You have checked out "${book.title}" (Copy: ${copy.copy_code}). Due date: ${dueDate.toLocaleDateString()}.`
      );

      // Audit log
      logAudit(req.user.id, 'LOAN_ISSUED', `Issued "${book.title}" [${copy.copy_code}] to ${member.name} (${member.email})`);

      return {
        loanId: loanRes.lastInsertRowid,
        bookTitle: book.title,
        copyCode: copy.copy_code,
        memberName: member.name
      };
    });

    const result = issueTx();

    res.status(201).json({
      message: 'Book issued successfully',
      loanId: result.loanId,
      bookTitle: result.bookTitle,
      copyCode: result.copyCode,
      memberName: result.memberName,
      dueDate: dueDate.toISOString()
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to issue book' });
  }
});

// Student Self-Checkout (direct checkout of available copy or pickup of ready reservation)
router.post('/checkout', authenticateToken, (req, res) => {
  try {
    const book_id = req.body.book_id || req.body.bookId;
    const copy_code = req.body.copy_code || req.body.copyCode;
    const loan_days = req.body.loan_days || req.body.loanDays || LOAN_DURATION_DAYS;

    if (!book_id && !copy_code) {
      return res.status(400).json({ error: 'Book ID or copy code is required' });
    }

    const member = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.user.id);
    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check circulation penalty & account hold
    const penaltyStatus = checkUserPenaltyStatus(member.id);
    const userPenalty = db.prepare('SELECT penalty_status, penalty_amount FROM users WHERE id = ?').get(member.id);
    const hasUnpaidPenalty = penaltyStatus.isBlocked || (userPenalty && (userPenalty.penalty_status === 'pending' || userPenalty.penalty_amount > 0));

    if (hasUnpaidPenalty) {
      const fineToPay = (userPenalty && userPenalty.penalty_amount > 0) ? userPenalty.penalty_amount : penaltyStatus.unpaidFines;
      return res.status(403).json({
        error: `Cannot borrow books: Your account has an outstanding circulation penalty fine of $${fineToPay.toFixed(2)}. Please scan and pay the fine using your penalty QR code to restore borrowing privileges.`,
        penaltyBlocked: true,
        unpaidFines: fineToPay,
        overdueCount: penaltyStatus.overdueCount
      });
    }

    // Check limit
    const activeCount = db.prepare("SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status IN ('active', 'overdue')").get(member.id);
    if (activeCount.count >= MAX_LOANS_PER_STUDENT) {
      return res.status(400).json({ error: `You have reached the maximum borrowing limit of ${MAX_LOANS_PER_STUDENT} books.` });
    }

    const now = new Date();
    const dueDate = new Date(now.getTime() + parseInt(loan_days) * 24 * 60 * 60 * 1000);

    const checkoutTx = db.transaction(() => {
      let copy;
      if (copy_code) {
        copy = db.prepare('SELECT * FROM book_copies WHERE UPPER(copy_code) = UPPER(?)').get(copy_code.trim());
      }
      if (!copy && book_id) {
        // First check if user had a ready reservation for this book
        const userHold = db.prepare("SELECT id FROM reservations WHERE book_id = ? AND user_id = ? AND status = 'ready_for_pickup'").get(book_id, member.id);
        if (userHold) {
          copy = db.prepare("SELECT * FROM book_copies WHERE book_id = ? AND status = 'reserved' LIMIT 1").get(book_id);
          // Mark hold fulfilled
          db.prepare("UPDATE reservations SET status = 'fulfilled' WHERE id = ?").run(userHold.id);
        } else {
          copy = db.prepare("SELECT * FROM book_copies WHERE book_id = ? AND status = 'available' LIMIT 1").get(book_id);
        }
      }

      if (!copy) {
        throw new Error('No physical copies currently available for checkout.');
      }

      if (copy.status !== 'available' && copy.status !== 'reserved') {
        throw new Error(`Copy ${copy.copy_code} is not available for checkout (Status: ${copy.status}).`);
      }

      // Member can borrow only ONE copy of a book at a time (cannot take a second copy simultaneously)
      const currentActiveLoan = db.prepare(`
        SELECT id, copy_id FROM loans
        WHERE book_id = ? AND user_id = ? AND status IN ('active', 'overdue')
      `).get(copy.book_id, member.id);

      if (currentActiveLoan) {
        throw new Error('You already have an active loan for this book (only 1 copy allowed at a time). Please return your current copy before borrowing again.');
      }

      const book = db.prepare('SELECT * FROM books WHERE id = ?').get(copy.book_id);

      const loanRes = db.prepare(`
        INSERT INTO loans (book_id, copy_id, user_id, borrow_date, due_date, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `).run(book.id, copy.id, member.id, now.toISOString(), dueDate.toISOString());

      db.prepare("UPDATE book_copies SET status = 'borrowed' WHERE id = ?").run(copy.id);
      db.prepare('UPDATE books SET available_copies = MAX(0, available_copies - 1) WHERE id = ?').run(book.id);

      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, 'Checkout Confirmed', ?, 'borrow', '/dashboard')
      `).run(
        member.id,
        `Successfully checked out "${book.title}" (Copy: ${copy.copy_code}). Due date: ${dueDate.toLocaleDateString()}.`
      );

      logAudit(member.id, 'BOOK_CHECKOUT', `Student checked out "${book.title}" [${copy.copy_code}]`);

      return {
        loanId: loanRes.lastInsertRowid,
        bookTitle: book.title,
        copyCode: copy.copy_code
      };
    });

    const result = checkoutTx();

    res.status(201).json({
      message: 'Checkout successful',
      loanId: result.loanId,
      bookTitle: result.bookTitle,
      copyCode: result.copyCode,
      dueDate: dueDate.toISOString()
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Checkout failed' });
  }
});

// Return book handler (supports both POST and PUT)
function handleBookReturn(req, res) {
  try {
    const loanId = req.params.id;
    const loan = db.prepare(`
      SELECT l.*, b.title as book_title, bc.copy_code, u.name as member_name, u.email as member_email
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN book_copies bc ON l.copy_id = bc.id
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `).get(loanId);

    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    if (loan.status === 'returned') {
      return res.status(400).json({ error: 'This book has already been returned' });
    }

    const now = new Date();
    const dueDate = new Date(loan.due_date);
    let fine = 0.0;
    if (now > dueDate) {
      const diffMs = now - dueDate;
      const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      fine = daysOverdue * DAILY_FINE_RATE;
    }

    const returnTx = db.transaction(() => {
      // Mark loan as returned
      db.prepare(`
        UPDATE loans SET
          status = 'returned',
          return_date = ?,
          fine_amount = ?
        WHERE id = ?
      `).run(now.toISOString(), fine, loanId);

      // Check if there is an active reservation waiting for this book
      const nextReservation = db.prepare(`
        SELECT * FROM reservations
        WHERE book_id = ? AND status = 'waiting'
        ORDER BY queue_position ASC, reservation_date ASC
        LIMIT 1
      `).get(loan.book_id);

      if (nextReservation) {
        // Mark physical copy as reserved
        db.prepare("UPDATE book_copies SET status = 'reserved' WHERE id = ?").run(loan.copy_id);

        // Update reservation to ready_for_pickup with 48h deadline
        const pickupDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
        db.prepare(`
          UPDATE reservations SET
            status = 'ready_for_pickup',
            pickup_deadline = ?
          WHERE id = ?
        `).run(pickupDeadline, nextReservation.id);

        // Notify reserved student
        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type, link)
          VALUES (?, ?, ?, 'pickup', '/dashboard')
        `).run(
          nextReservation.user_id,
          'Book Ready for Pickup!',
          `Your reserved book "${loan.book_title}" is ready at the desk! Please pick it up by ${new Date(pickupDeadline).toLocaleString()}.`
        );
      } else {
        // No reservations, make available
        db.prepare("UPDATE book_copies SET status = 'available' WHERE id = ?").run(loan.copy_id);
        db.prepare('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?').run(loan.book_id);
      }

      // Notify borrower of return confirmation
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, 'return', '/dashboard')
      `).run(
        loan.user_id,
        'Book Return Confirmed',
        `"${loan.book_title}" has been returned. ${fine > 0 ? `Outstanding fine: $${fine.toFixed(2)}` : 'Thank you!'}`
      );

      logAudit(req.user.id, 'BOOK_RETURNED', `Returned "${loan.book_title}" from ${loan.member_name}. Fine: $${fine}`);
    });

    returnTx();

    res.json({
      message: 'Book returned successfully',
      fineAmount: fine,
      status: 'returned'
    });
  } catch (err) {
    console.error('Return book error:', err);
    res.status(500).json({ error: 'Failed to process book return' });
  }
}

// Allow students to self-return; admins/librarians can return on behalf of any member
function handleBookReturnWithOwnerCheck(req, res) {
  // Students may only return their own loans; staff may return any loan
  if (req.user.role === 'student') {
    const loan = db.prepare('SELECT user_id FROM loans WHERE id = ?').get(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }
    if (loan.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only return your own borrowed books.' });
    }
  }
  return handleBookReturn(req, res);
}

router.post('/:id/return', authenticateToken, handleBookReturnWithOwnerCheck);
router.put('/:id/return', authenticateToken, handleBookReturnWithOwnerCheck);

// Renew loan
router.post('/:id/renew', authenticateToken, (req, res) => {
  try {
    const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (req.user.role === 'student' && loan.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to renew this loan' });
    }

    if (loan.status === 'returned') {
      return res.status(400).json({ error: 'Cannot renew a returned loan' });
    }

    // Check penalty block
    const penaltyStatus = checkUserPenaltyStatus(loan.user_id);
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

    // Check if book has pending reservations from others
    const waitingRes = db.prepare("SELECT COUNT(*) as count FROM reservations WHERE book_id = ? AND status = 'waiting'").get(loan.book_id);
    if (waitingRes.count > 0) {
      return res.status(400).json({ error: 'Cannot renew: Other students are currently waiting for this book.' });
    }

    const currentDue = new Date(loan.due_date);
    const newDue = new Date(currentDue.getTime() + LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);

    db.prepare(`
      UPDATE loans SET
        due_date = ?,
        renewal_count = renewal_count + 1,
        status = 'active'
      WHERE id = ?
    `).run(newDue.toISOString(), loan.id);

    // Notify user
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'borrow', '/dashboard')
    `).run(
      loan.user_id,
      'Loan Renewed',
      `Your loan has been renewed by ${LOAN_DURATION_DAYS} days. New due date: ${newDue.toLocaleDateString()}.`
    );

    res.json({
      message: 'Loan renewed successfully',
      newDueDate: newDue.toISOString(),
      renewalsRemaining: MAX_RENEWALS - (loan.renewal_count + 1)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to renew loan' });
  }
});

// Pay fine
router.post('/:id/pay-fine', authenticateToken, (req, res) => {
  try {
    const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    db.prepare('UPDATE loans SET fine_paid = 1 WHERE id = ?').run(loan.id);
    logAudit(req.user.id, 'FINE_PAID', `Fine of $${loan.fine_amount} paid for loan ID ${loan.id}`);

    res.json({ message: 'Fine cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to pay fine' });
  }
});

module.exports = router;
