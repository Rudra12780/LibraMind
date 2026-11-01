const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET, authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

// Get waiting queue stats and active reservation info for a book
router.get('/book/:bookId', (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId, 10);
    if (!bookId) {
      return res.status(400).json({ error: 'Valid Book ID is required' });
    }

    const book = db.prepare('SELECT id, title, available_copies, total_copies FROM books WHERE id = ?').get(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Active holds count (waiting + ready_for_pickup)
    const stats = db.prepare(`
      SELECT 
        COUNT(CASE WHEN status = 'waiting' THEN 1 END) as waiting_count,
        COUNT(CASE WHEN status = 'ready_for_pickup' THEN 1 END) as ready_count,
        COUNT(*) as total_active_holds
      FROM reservations
      WHERE book_id = ? AND status IN ('waiting', 'ready_for_pickup')
    `).get(bookId);

    // Optional user check from Authorization header if present
    let userReservation = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) {
          userReservation = db.prepare(`
            SELECT id, book_id, user_id, status, queue_position, pickup_deadline, reservation_date
            FROM reservations
            WHERE book_id = ? AND user_id = ? AND status IN ('waiting', 'ready_for_pickup')
          `).get(bookId, decoded.id);
        }
      } catch (e) {
        // Token invalid or expired, continue without user reservation
      }
    }

    res.json({
      bookId,
      availableCopies: book.available_copies,
      totalCopies: book.total_copies,
      isAvailable: book.available_copies > 0,
      waitingCount: stats.waiting_count || 0,
      readyCount: stats.ready_count || 0,
      totalActiveHolds: stats.total_active_holds || 0,
      userReservation: userReservation || null
    });
  } catch (err) {
    console.error('Fetch book reservation info error:', err);
    res.status(500).json({ error: 'Failed to retrieve book reservation information' });
  }
});

// Get reservations (Student gets own; Librarian/Admin gets all, supports status filter)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT r.*,
        b.title as book_title,
        b.author as book_author,
        b.cover_image,
        b.available_copies,
        b.floor,
        b.section,
        b.shelf,
        b.rack,
        (b.floor || ' · ' || b.section || ' · ' || b.shelf) as shelf_location,
        u.name as student_name,
        u.email as student_email,
        u.membership_id
      FROM reservations r
      JOIN books b ON r.book_id = b.id
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'student') {
      query += ` AND r.user_id = ?`;
      params.push(req.user.id);
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        query += ` AND r.status IN ('waiting', 'ready_for_pickup')`;
      } else {
        query += ` AND r.status = ?`;
        params.push(status);
      }
    }

    query += ` ORDER BY 
      CASE r.status 
        WHEN 'ready_for_pickup' THEN 1 
        WHEN 'waiting' THEN 2 
        WHEN 'fulfilled' THEN 3 
        WHEN 'cancelled' THEN 4 
        WHEN 'expired' THEN 5 
        ELSE 6 
      END ASC, 
      r.queue_position ASC, 
      r.reservation_date DESC`;

    const reservations = db.prepare(query).all(...params);
    res.json(reservations);
  } catch (err) {
    console.error('Fetch reservations error:', err);
    res.status(500).json({ error: 'Failed to retrieve reservations' });
  }
});

// Reserve a book (Student)
router.post('/', authenticateToken, (req, res) => {
  try {
    const book_id = req.body.book_id || req.body.bookId;
    if (!book_id) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    const reserveTx = db.transaction(() => {
      const book = db.prepare('SELECT * FROM books WHERE id = ?').get(book_id);
      if (!book) {
        throw new Error('Book not found');
      }

      // Check if user already has an active reservation for this book
      const existing = db.prepare(`
        SELECT id, queue_position FROM reservations
        WHERE book_id = ? AND user_id = ? AND status IN ('waiting', 'ready_for_pickup')
      `).get(book_id, req.user.id);

      if (existing) {
        throw new Error(`You already have an active hold on this book (Queue Position #${existing.queue_position}).`);
      }

      // Check if user currently has this book borrowed
      const currentLoan = db.prepare(`
        SELECT id, due_date FROM loans
        WHERE book_id = ? AND user_id = ? AND status IN ('active', 'overdue')
      `).get(book_id, req.user.id);

      if (currentLoan) {
        throw new Error('You already have this book borrowed on active loan! You can return or renew it in My Hub.');
      }

      // Calculate queue position atomically across all active holds
      const activeHolds = db.prepare(`
        SELECT COALESCE(MAX(queue_position), 0) as max_pos, COUNT(*) as count
        FROM reservations
        WHERE book_id = ? AND status IN ('waiting', 'ready_for_pickup')
      `).get(book_id);

      const queuePos = (activeHolds ? activeHolds.max_pos : 0) + 1;

      // If available copies > 0 and no waiting queue, can immediately mark ready for pickup
      let initialStatus = 'waiting';
      let pickupDeadline = null;

      if (book.available_copies > 0 && (!activeHolds || activeHolds.count === 0)) {
        initialStatus = 'ready_for_pickup';
        pickupDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
        // Reserve one physical copy
        const copy = db.prepare("SELECT id FROM book_copies WHERE book_id = ? AND status = 'available' LIMIT 1").get(book_id);
        if (copy) {
          db.prepare("UPDATE book_copies SET status = 'reserved' WHERE id = ?").run(copy.id);
          db.prepare('UPDATE books SET available_copies = MAX(0, available_copies - 1) WHERE id = ?').run(book_id);
        }
      }

      const result = db.prepare(`
        INSERT INTO reservations (book_id, user_id, status, queue_position, pickup_deadline)
        VALUES (?, ?, ?, ?, ?)
      `).run(book_id, req.user.id, initialStatus, queuePos, pickupDeadline);

      // Notify student
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, 'reservation', '/dashboard')
      `).run(
        req.user.id,
        'Reservation Confirmed',
        initialStatus === 'ready_for_pickup'
          ? `Your hold on "${book.title}" is ready for pickup at the front desk!`
          : `You are in waiting position #${queuePos} for "${book.title}".`
      );

      logAudit(req.user.id, 'BOOK_RESERVED', `User reserved "${book.title}" (Queue: ${queuePos})`);

      return {
        reservationId: result.lastInsertRowid,
        queuePosition: queuePos,
        status: initialStatus
      };
    });

    const out = reserveTx();

    res.status(201).json({
      message: 'Reservation placed successfully',
      reservationId: out.reservationId,
      queuePosition: out.queuePosition,
      status: out.status
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to place reservation' });
  }
});

// Cancel reservation (Student or Librarian)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (req.user.role === 'student' && reservation.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this reservation' });
    }

    const cancelTx = db.transaction(() => {
      // If it was ready for pickup, release the held copy
      if (reservation.status === 'ready_for_pickup') {
        const copy = db.prepare("SELECT id FROM book_copies WHERE book_id = ? AND status = 'reserved' LIMIT 1").get(reservation.book_id);
        if (copy) {
          // Check if there is next student in line
          const nextStudent = db.prepare(`
            SELECT * FROM reservations
            WHERE book_id = ? AND status = 'waiting'
            ORDER BY queue_position ASC LIMIT 1
          `).get(reservation.book_id);

          if (nextStudent) {
            const newDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
            db.prepare("UPDATE reservations SET status = 'ready_for_pickup', pickup_deadline = ? WHERE id = ?").run(newDeadline, nextStudent.id);
            db.prepare(`
              INSERT INTO notifications (user_id, title, message, type, link)
              VALUES (?, ?, ?, 'pickup', '/dashboard')
            `).run(
              nextStudent.user_id,
              'Hold Ready for Pickup',
              `Your reservation for book #${reservation.book_id} is now ready for pickup!`
            );
          } else {
            db.prepare("UPDATE book_copies SET status = 'available' WHERE id = ?").run(copy.id);
            db.prepare('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?').run(reservation.book_id);
          }
        }
      }

      db.prepare("UPDATE reservations SET status = 'cancelled' WHERE id = ?").run(reservation.id);

      // Shift queue positions for remaining waiting students
      db.prepare(`
        UPDATE reservations
        SET queue_position = queue_position - 1
        WHERE book_id = ? AND status = 'waiting' AND queue_position > ?
      `).run(reservation.book_id, reservation.queue_position);
    });

    cancelTx();
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (err) {
    console.error('Cancel reservation error:', err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

// Librarian: Mark reservation as ready for pickup
router.post('/:id/pickup', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const reservation = db.prepare(`
      SELECT r.*, b.title as book_title
      FROM reservations r
      JOIN books b ON r.book_id = b.id
      WHERE r.id = ?
    `).get(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      UPDATE reservations SET
        status = 'ready_for_pickup',
        pickup_deadline = ?
      WHERE id = ?
    `).run(deadline, reservation.id);

    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'pickup', '/dashboard')
    `).run(
      reservation.user_id,
      'Book Ready for Pickup!',
      `"${reservation.book_title}" is ready at the desk. Pick it up within 48 hours.`
    );

    res.json({ message: 'Marked ready for pickup', pickupDeadline: deadline });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Claim / Pick up ready reservation directly (Student or Librarian/Admin)
router.post('/:id/claim', authenticateToken, (req, res) => {
  try {
    const reservationId = parseInt(req.params.id, 10);
    const reservation = db.prepare(`
      SELECT r.*, b.title as book_title
      FROM reservations r
      JOIN books b ON r.book_id = b.id
      WHERE r.id = ?
    `).get(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (req.user.role === 'student' && reservation.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to claim this reservation' });
    }

    if (reservation.status !== 'ready_for_pickup') {
      return res.status(400).json({
        error: `Cannot claim book: current status is "${reservation.status}". Only reservations marked "ready_for_pickup" can be claimed.`
      });
    }

    const claimTx = db.transaction(() => {
      // Find the reserved copy for this book
      let copy = db.prepare("SELECT * FROM book_copies WHERE book_id = ? AND status = 'reserved' LIMIT 1").get(reservation.book_id);
      if (!copy) {
        copy = db.prepare("SELECT * FROM book_copies WHERE book_id = ? AND status = 'available' LIMIT 1").get(reservation.book_id);
      }

      if (!copy) {
        throw new Error('No physical copies currently available to allocate for this pickup.');
      }

      const now = new Date();
      const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

      // Create loan record
      const loanRes = db.prepare(`
        INSERT INTO loans (book_id, copy_id, user_id, borrow_date, due_date, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `).run(reservation.book_id, copy.id, reservation.user_id, now.toISOString(), dueDate.toISOString());

      // Update copy status
      db.prepare("UPDATE book_copies SET status = 'borrowed' WHERE id = ?").run(copy.id);

      // Mark reservation fulfilled
      db.prepare("UPDATE reservations SET status = 'fulfilled' WHERE id = ?").run(reservation.id);

      // Notification
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, 'Hold Claimed & Checked Out', ?, 'borrow', '/dashboard')
      `).run(
        reservation.user_id,
        `You have picked up "${reservation.book_title}" (Copy: ${copy.copy_code}). Due date: ${dueDate.toLocaleDateString()}.`
      );

      logAudit(req.user.id, 'RESERVATION_CLAIMED', `Claimed hold #${reservation.id} for "${reservation.book_title}" [${copy.copy_code}]`);

      return {
        loanId: loanRes.lastInsertRowid,
        dueDate: dueDate.toISOString(),
        copyCode: copy.copy_code
      };
    });

    const out = claimTx();
    res.json({
      message: `"${reservation.book_title}" successfully claimed and checked out! Due date: ${new Date(out.dueDate).toLocaleDateString()}.`,
      loanId: out.loanId,
      copyCode: out.copyCode,
      dueDate: out.dueDate
    });
  } catch (err) {
    console.error('Claim reservation error:', err);
    res.status(400).json({ error: err.message || 'Failed to claim reservation' });
  }
});

module.exports = router;
