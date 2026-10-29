const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

const DAILY_FINE_RATE = 1.0; // $1.00 per day overdue
const MAX_LOANS_PER_STUDENT = 5;
const MAX_RENEWALS = 2;
const LOAN_DURATION_DAYS = 14;

// Helper: recalculate overdue statuses and fines
function refreshLoanStatuses() {
  const now = new Date();
  const activeLoans = db.prepare("SELECT id, due_date, status FROM loans WHERE status = 'active'").all();

  const updateStmt = db.prepare('UPDATE loans SET status = ?, fine_amount = ? WHERE id = ?');

  for (const loan of activeLoans) {
    const dueDate = new Date(loan.due_date);
    if (now > dueDate) {
      const diffMs = now - dueDate;
      const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const fine = daysOverdue * DAILY_FINE_RATE;
      updateStmt.run('overdue', fine, loan.id);
    }
  }
}

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
        bc.copy_code,
        u.name as student_name,
        u.email as student_email,
        u.membership_id
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
      query += ` AND l.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY l.borrow_date DESC`;

    const rawLoans = db.prepare(query).all(...params);
    const loans = rawLoans.map(l => ({
      ...l,
      status: l.status === 'active' ? 'borrowed' : l.status,
      db_status: l.status,
      is_active: l.status === 'active'
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
        copy = db.prepare('SELECT * FROM book_copies WHERE copy_code = ?').get(copy_code.trim());
      } else if (book_id) {
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
        copy = db.prepare('SELECT * FROM book_copies WHERE copy_code = ?').get(copy_code.trim());
      } else if (book_id) {
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

      // Check if user already has an active loan of this book
      const alreadyBorrowed = db.prepare("SELECT id FROM loans WHERE book_id = ? AND user_id = ? AND status IN ('active', 'overdue')").get(copy.book_id, member.id);
      if (alreadyBorrowed) {
        throw new Error('You already have an active loan for this book.');
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
