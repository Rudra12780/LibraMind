const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const BookCopy = require('../models/BookCopy');
const Loan = require('../models/Loan');
const User = require('../models/User');
const Notification = require('../models/Notification');

const { JWT_SECRET, authenticateToken, requireRole, logAudit } = require('../middleware/auth');
const { checkUserPenaltyStatus } = require('../utils/penalties');
const { buildIdFilter, serializeDoc, serializeDocs } = require('../utils/idHelper');

const router = express.Router();

// Get waiting queue stats and active reservation info for a book
router.get('/book/:bookId', async (req, res) => {
  try {
    const book = await Book.findOne(buildIdFilter(req.params.bookId));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bFilter = buildIdFilter(book._id, 'book_id', 'sqlite_book_id');
    const waitingCount = await Reservation.countDocuments({
      ...bFilter,
      status: 'waiting'
    });
    const readyCount = await Reservation.countDocuments({
      ...bFilter,
      status: 'ready_for_pickup'
    });
    const totalActiveHolds = waitingCount + readyCount;

    let userReservation = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) {
          const uFilter = buildIdFilter(decoded.id, 'user_id', 'sqlite_user_id');
          userReservation = await Reservation.findOne({
            ...bFilter,
            ...uFilter,
            status: { $in: ['waiting', 'ready_for_pickup'] }
          });
        }
      } catch (e) {}
    }

    res.json({
      bookId: book._id.toString(),
      availableCopies: book.available_copies,
      totalCopies: book.total_copies,
      isAvailable: book.available_copies > 0,
      waitingCount,
      readyCount,
      totalActiveHolds,
      userReservation: serializeDoc(userReservation)
    });
  } catch (err) {
    console.error('Fetch book reservation info error:', err);
    res.status(500).json({ error: 'Failed to retrieve book reservation information' });
  }
});

// Get reservations (Student gets own; Librarian/Admin gets all)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (req.user.role === 'student') {
      const uFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
      Object.assign(query, uFilter);
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        query.status = { $in: ['waiting', 'ready_for_pickup'] };
      } else {
        query.status = status;
      }
    }

    const reservations = await Reservation.find(query)
      .populate('book_id')
      .populate('user_id', 'name email membership_id')
      .sort({ queue_position: 1, reservation_date: 1 });

    const statusPriority = {
      ready_for_pickup: 1,
      waiting: 2,
      fulfilled: 3,
      cancelled: 4,
      expired: 5
    };

    const formatted = reservations.map(r => {
      const rObj = serializeDoc(r);
      const b = r.book_id;
      const u = r.user_id;
      return {
        ...rObj,
        book_id: b?._id ? b._id.toString() : (r.book_id ? r.book_id.toString() : ''),
        book_title: b?.title || 'Unknown Title',
        book_author: b?.author || '',
        cover_image: b?.cover_image || '',
        category: b?.category || 'General',
        available_copies: b?.available_copies ?? 0,
        total_copies: b?.total_copies ?? 0,
        floor: b?.floor || 'Floor 1',
        section: b?.section || 'Main Hall',
        shelf: b?.shelf || 'Shelf A-1',
        rack: b?.rack || 'Rack 01',
        shelf_location: b ? `${b.floor} · ${b.section} · ${b.shelf}` : '',
        student_name: u?.name || 'Reader',
        student_email: u?.email || '',
        membership_id: u?.membership_id || '',
        reservation_date: r.reservation_date || r.created_at || rObj.created_at,
        created_at: r.created_at || r.reservation_date || rObj.created_at
      };
    });

    formatted.sort((a, b) => {
      const prioA = statusPriority[a.status] || 6;
      const prioB = statusPriority[b.status] || 6;
      if (prioA !== prioB) return prioA - prioB;
      const posA = a.queue_position || 1;
      const posB = b.queue_position || 1;
      if (posA !== posB) return posA - posB;
      const timeA = new Date(a.reservation_date || a.created_at || 0).getTime();
      const timeB = new Date(b.reservation_date || b.created_at || 0).getTime();
      return timeA - timeB;
    });

    res.json(formatted);
  } catch (err) {
    console.error('Fetch reservations error:', err);
    res.status(500).json({ error: 'Failed to retrieve reservations' });
  }
});

// Reserve a book (Student)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const rawBookId = req.body.book_id || req.body.bookId;
    if (!rawBookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    const penaltyStatus = await checkUserPenaltyStatus(req.user.id);
    if (penaltyStatus.isBlocked) {
      return res.status(403).json({
        error: `Cannot place book hold: Your account is blocked due to unpaid circulation penalties ($${penaltyStatus.unpaidFines.toFixed(2)}) or overdue loans. Please settle your fines in your Reading Room to unblock reservations.`,
        penaltyBlocked: true,
        unpaidFines: penaltyStatus.unpaidFines,
        overdueCount: penaltyStatus.overdueCount
      });
    }

    const book = await Book.findOne(buildIdFilter(rawBookId));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bFilter = buildIdFilter(book._id, 'book_id', 'sqlite_book_id');
    const uFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    // Check if user already has an active hold
    const existing = await Reservation.findOne({
      ...bFilter,
      ...uFilter,
      status: { $in: ['waiting', 'ready_for_pickup'] }
    });

    if (existing) {
      return res.status(400).json({
        error: `You already have an active hold on this book (Queue Position #${existing.queue_position}).`
      });
    }

    // Check if user currently has this book borrowed
    const currentLoan = await Loan.findOne({
      ...bFilter,
      ...uFilter,
      status: { $in: ['active', 'borrowed', 'overdue'] }
    });

    if (currentLoan) {
      return res.status(400).json({
        error: 'You already have this book borrowed on active loan! Under circulation rules, you cannot borrow or place a hold on the same title twice at the same time.'
      });
    }

    // Calculate queue position atomically
    const activeHolds = await Reservation.find({
      ...bFilter,
      status: { $in: ['waiting', 'ready_for_pickup'] }
    });
    const maxPos = activeHolds.reduce((max, r) => Math.max(max, r.queue_position || 0), 0);
    const queuePos = maxPos + 1;

    let initialStatus = 'waiting';
    let pickupDeadline = null;

    if (book.available_copies > 0 && activeHolds.length === 0) {
      initialStatus = 'ready_for_pickup';
      pickupDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const copy = await BookCopy.findOne({
        ...bFilter,
        status: 'available'
      });
      if (copy) {
        copy.status = 'reserved';
        await copy.save();
        book.available_copies = Math.max(0, book.available_copies - 1);
        await book.save();
      }
    }

    const reservation = await Reservation.create({
      book_id: book._id,
      user_id: req.user.id,
      status: initialStatus,
      queue_position: queuePos,
      pickup_deadline: pickupDeadline,
      reservation_date: new Date()
    });

    await Notification.create({
      user_id: req.user.id,
      title: 'Reservation Confirmed',
      message: initialStatus === 'ready_for_pickup'
        ? `Your hold on "${book.title}" is ready for pickup at the front desk!`
        : `You are in waiting position #${queuePos} for "${book.title}".`,
      type: 'reservation',
      link: '/dashboard',
      created_at: new Date()
    });

    logAudit(req.user.id, 'BOOK_RESERVED', `User reserved "${book.title}" (Queue: ${queuePos})`);

    res.status(201).json({
      message: 'Reservation placed successfully',
      reservationId: reservation._id.toString(),
      queuePosition: queuePos,
      status: initialStatus
    });
  } catch (err) {
    console.error('Place reservation error:', err);
    res.status(400).json({ error: err.message || 'Failed to place reservation' });
  }
});

// Cancel reservation (Student or Librarian)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const reservation = await Reservation.findOne(buildIdFilter(req.params.id));
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (req.user.role === 'student' && String(reservation.user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to cancel this reservation' });
    }

    const bFilter = buildIdFilter(reservation.book_id, 'book_id', 'sqlite_book_id');

    // If ready for pickup, reassign or release held copy
    if (reservation.status === 'ready_for_pickup') {
      const copy = await BookCopy.findOne({ ...bFilter, status: 'reserved' });
      if (copy) {
        const nextStudent = await Reservation.findOne({
          ...bFilter,
          status: 'waiting'
        }).sort({ queue_position: 1 });

        if (nextStudent) {
          const newDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
          nextStudent.status = 'ready_for_pickup';
          nextStudent.pickup_deadline = newDeadline;
          await nextStudent.save();

          await Notification.create({
            user_id: nextStudent.user_id,
            title: 'Hold Ready for Pickup',
            message: 'Your reservation for book hold is now ready for pickup!',
            type: 'pickup',
            link: '/dashboard',
            created_at: new Date()
          });
        } else {
          copy.status = 'available';
          await copy.save();
          await Book.updateOne({ _id: reservation.book_id }, { $inc: { available_copies: 1 } });
        }
      }
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // Shift queue positions for remaining waiting patrons
    await Reservation.updateMany(
      {
        ...bFilter,
        status: 'waiting',
        queue_position: { $gt: reservation.queue_position }
      },
      { $inc: { queue_position: -1 } }
    );

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (err) {
    console.error('Cancel reservation error:', err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

// Librarian: Mark reservation as ready for pickup
router.post('/:id/pickup', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const reservation = await Reservation.findOne(buildIdFilter(req.params.id)).populate('book_id');
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
    reservation.status = 'ready_for_pickup';
    reservation.pickup_deadline = deadline;
    await reservation.save();

    const bookTitle = reservation.book_id?.title || 'Book';
    await Notification.create({
      user_id: reservation.user_id,
      title: 'Book Ready for Pickup!',
      message: `"${bookTitle}" is ready at the desk. Pick it up within 48 hours.`,
      type: 'pickup',
      link: '/dashboard',
      created_at: new Date()
    });

    res.json({ message: 'Marked ready for pickup', pickupDeadline: deadline.toISOString() });
  } catch (err) {
    console.error('Mark pickup error:', err);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Librarian: Notify patron regarding their waiting list position
router.post('/:id/notify', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const reservation = await Reservation.findOne(buildIdFilter(req.params.id))
      .populate('book_id')
      .populate('user_id');
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const bookTitle = reservation.book_id?.title || 'Book';
    const recipientId = reservation.user_id?._id || reservation.user_id;
    const isReady = reservation.status === 'ready_for_pickup';
    const message = req.body?.message || (
      isReady
        ? `Reminder from Circulation Desk: Your reserved volume "${bookTitle}" is currently waiting at the circulation desk for collection.`
        : `Circulation Desk Notice: Your request for "${bookTitle}" is at waiting queue position #${reservation.queue_position}. Copies will be issued as soon as returned by patrons.`
    );

    await Notification.create({
      user_id: recipientId,
      title: isReady ? 'Desk Pickup Alert' : 'Waiting Queue Position Update',
      message,
      type: 'reservation',
      link: '/dashboard',
      created_at: new Date()
    });

    logAudit(req.user.id, 'WAITING_LIST_NOTIFIED', `Librarian notified patron for "${bookTitle}" (Queue: ${reservation.queue_position})`);
    res.json({ message: 'Patron notified successfully' });
  } catch (err) {
    console.error('Notify waiting patron error:', err);
    res.status(500).json({ error: 'Failed to dispatch patron notification' });
  }
});

// Claim / Pick up ready reservation directly
router.post('/:id/claim', authenticateToken, async (req, res) => {
  try {
    const reservation = await Reservation.findOne(buildIdFilter(req.params.id)).populate('book_id');
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (req.user.role === 'student' && String(reservation.user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to claim this reservation' });
    }

    if (reservation.status !== 'ready_for_pickup') {
      return res.status(400).json({
        error: `Cannot claim book: current status is "${reservation.status}". Only reservations marked "ready_for_pickup" can be claimed.`
      });
    }

    const bFilter = buildIdFilter(reservation.book_id._id, 'book_id', 'sqlite_book_id');
    let copy = await BookCopy.findOne({ ...bFilter, status: 'reserved' });
    if (!copy) {
      copy = await BookCopy.findOne({ ...bFilter, status: 'available' });
    }

    if (!copy) {
      return res.status(400).json({ error: 'No physical copies currently available to allocate for this pickup.' });
    }

    const uFilter = buildIdFilter(reservation.user_id, 'user_id', 'sqlite_user_id');
    const existingActiveLoan = await Loan.findOne({
      ...bFilter,
      ...uFilter,
      status: { $in: ['active', 'borrowed', 'overdue'] }
    });

    if (existingActiveLoan) {
      return res.status(400).json({
        error: 'You already have an active borrowed copy of this book. Under circulation rules, you cannot hold or borrow the same title twice concurrently. Please return your current copy before claiming another copy.'
      });
    }

    const now = new Date();
    const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

    const loan = await Loan.create({
      book_id: reservation.book_id._id,
      copy_id: copy._id,
      user_id: reservation.user_id,
      borrow_date: now,
      due_date: dueDate,
      status: 'active',
      created_at: now
    });

    copy.status = 'borrowed';
    await copy.save();

    reservation.status = 'fulfilled';
    await reservation.save();

    const bookTitle = reservation.book_id?.title || 'Book';
    await Notification.create({
      user_id: reservation.user_id,
      title: 'Hold Claimed & Checked Out',
      message: `You have picked up "${bookTitle}" (Copy: ${copy.copy_code}). Due date: ${dueDate.toLocaleDateString()}.`,
      type: 'borrow',
      link: '/dashboard',
      created_at: new Date()
    });

    logAudit(req.user.id, 'RESERVATION_CLAIMED', `Claimed hold #${reservation._id} for "${bookTitle}" [${copy.copy_code}]`);

    res.json({
      message: `"${bookTitle}" successfully claimed and checked out! Due date: ${dueDate.toLocaleDateString()}.`,
      loanId: loan._id.toString(),
      copyCode: copy.copy_code,
      dueDate: dueDate.toISOString()
    });
  } catch (err) {
    console.error('Claim reservation error:', err);
    res.status(400).json({ error: err.message || 'Failed to claim reservation' });
  }
});

module.exports = router;
