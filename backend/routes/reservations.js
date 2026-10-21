const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

// Get reservations (Student gets own; Librarian/Admin gets all)
router.get('/', authenticateToken, (req, res) => {
  try {
    let query = `
      SELECT r.*,
        b.title as book_title,
        b.author as book_author,
        b.cover_image,
        b.available_copies,
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

    query += ` ORDER BY r.status ASC, r.queue_position ASC, r.reservation_date DESC`;

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
        SELECT id FROM reservations
        WHERE book_id = ? AND user_id = ? AND status IN ('waiting', 'ready_for_pickup')
      `).get(book_id, req.user.id);

      if (existing) {
        throw new Error('You already have an active reservation for this book.');
      }

      // Check if user currently has this book borrowed
      const currentLoan = db.prepare(`
        SELECT id FROM loans
        WHERE book_id = ? AND user_id = ? AND status IN ('active', 'overdue')
      `).get(book_id, req.user.id);

      if (currentLoan) {
        throw new Error('You currently have this book borrowed.');
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
          db.prepare('UPDATE book_copies SET status = "reserved" WHERE id = ?').run(copy.id);
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
        const copy = db.prepare('SELECT id FROM book_copies WHERE book_id = ? AND status = "reserved" LIMIT 1').get(reservation.book_id);
        if (copy) {
          // Check if there is next student in line
          const nextStudent = db.prepare(`
            SELECT * FROM reservations
            WHERE book_id = ? AND status = 'waiting'
            ORDER BY queue_position ASC LIMIT 1
          `).get(reservation.book_id);

          if (nextStudent) {
            const newDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
            db.prepare('UPDATE reservations SET status = "ready_for_pickup", pickup_deadline = ? WHERE id = ?').run(newDeadline, nextStudent.id);
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

      db.prepare('UPDATE reservations SET status = "cancelled" WHERE id = ?').run(reservation.id);

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

module.exports = router;
