const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

// Get seat map, stats, and sections with optional date and time_slot filtering
router.get('/', (req, res) => {
  try {
    const { floor, section, date, time_slot } = req.query;

    let query = '';
    const params = [];

    if (date && time_slot) {
      // Check seat availability specific to this date and time slot
      query = `
        SELECT s.*,
          u.name as current_user_name,
          sr.id as active_booking_id,
          sr.user_id as booked_by_user_id,
          CASE
            WHEN s.status = 'maintenance' THEN 'maintenance'
            WHEN sr.id IS NOT NULL THEN 'reserved'
            WHEN s.status = 'occupied' THEN 'occupied'
            ELSE 'available'
          END as effective_status
        FROM seats s
        LEFT JOIN users u ON s.current_user_id = u.id
        LEFT JOIN seat_reservations sr ON s.id = sr.seat_id
          AND sr.date = ?
          AND sr.time_slot = ?
          AND sr.status = 'active'
        WHERE 1=1
      `;
      params.push(date, time_slot);
    } else {
      query = `
        SELECT s.*,
          u.name as current_user_name,
          s.status as effective_status
        FROM seats s
        LEFT JOIN users u ON s.current_user_id = u.id
        WHERE 1=1
      `;
    }

    if (floor && floor !== 'All') {
      query += ` AND s.floor = ?`;
      params.push(floor);
    }

    if (section && section !== 'All') {
      query += ` AND s.section = ?`;
      params.push(section);
    }

    query += ` ORDER BY s.floor ASC, s.section ASC, s.seat_number ASC`;

    const seats = db.prepare(query).all(...params);

    const stats = {
      total: seats.length,
      available: seats.filter(s => s.effective_status === 'available').length,
      occupied: seats.filter(s => s.effective_status === 'occupied').length,
      reserved: seats.filter(s => s.effective_status === 'reserved').length,
      maintenance: seats.filter(s => s.effective_status === 'maintenance').length
    };

    // Floors and sections for filters
    const floors = ['Floor 1', 'Floor 2'];
    const sections = [
      'Quiet Study Zone',
      'Collaborative Hub',
      'Garden Window Pods',
      'Research Nook'
    ];

    res.json(seats);
  } catch (err) {
    console.error('Fetch seats error:', err);
    res.status(500).json({ error: 'Failed to retrieve study seats' });
  }
});

// Get slot-by-slot availability for a specific seat on a date
router.get('/:id/slots', (req, res) => {
  try {
    const seatId = parseInt(req.params.id);
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const seat = db.prepare('SELECT * FROM seats WHERE id = ?').get(seatId);
    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    const timeSlots = [
      '08:00 - 11:00 (Morning Focus)',
      '11:00 - 14:00 (Mid-day Reading)',
      '14:00 - 17:00 (Afternoon Study)',
      '17:00 - 20:00 (Evening Pod)',
      '20:00 - 22:00 (Night Owl)'
    ];

    const activeReservations = db.prepare(`
      SELECT time_slot, user_id FROM seat_reservations
      WHERE seat_id = ? AND date = ? AND status = 'active'
    `).all(seatId, date);

    const bookedSlotsMap = {};
    activeReservations.forEach(r => {
      bookedSlotsMap[r.time_slot] = r.user_id;
    });

    const slots = timeSlots.map(slot => ({
      slot,
      isAvailable: seat.status !== 'maintenance' && !bookedSlotsMap[slot],
      isMaintenance: seat.status === 'maintenance',
      isBooked: !!bookedSlotsMap[slot],
      bookedByUserId: bookedSlotsMap[slot] || null
    }));

    res.json({
      seatId,
      seatNumber: seat.seat_number,
      date,
      seatStatus: seat.status,
      slots
    });
  } catch (err) {
    console.error('Fetch seat slots error:', err);
    res.status(500).json({ error: 'Failed to retrieve slot availability' });
  }
});

// Reserve a study seat for a date and time slot (Student or Librarian)
router.post('/reserve', authenticateToken, (req, res) => {
  try {
    const seat_id = req.body.seat_id || req.body.seatId;
    const date = req.body.date;
    const time_slot = req.body.time_slot || req.body.timeSlot;

    if (!seat_id || !date || !time_slot) {
      return res.status(400).json({ error: 'Seat, date, and time slot are required' });
    }

    const reserveSeatTx = db.transaction(() => {
      const seat = db.prepare('SELECT * FROM seats WHERE id = ?').get(seat_id);
      if (!seat) {
        throw new Error('Seat not found');
      }

      if (seat.status === 'maintenance') {
        throw new Error('This seat is currently under maintenance.');
      }

      // 1. Conflict Check: Is this seat already booked by anyone for this exact date & time slot?
      const seatConflict = db.prepare(`
        SELECT id FROM seat_reservations
        WHERE seat_id = ? AND date = ? AND time_slot = ? AND status = 'active'
      `).get(seat_id, date, time_slot);

      if (seatConflict) {
        const err = new Error('This seat is already reserved for the selected time slot.');
        err.statusCode = 409;
        throw err;
      }

      // 2. User Conflict Check: Does this student already have an active seat reservation at this exact time slot?
      // (Students can reserve only 1 seat per time slot, but can book different time slots on the same day)
      const userSlotConflict = db.prepare(`
        SELECT sr.id, s.seat_number FROM seat_reservations sr
        JOIN seats s ON sr.seat_id = s.id
        WHERE sr.user_id = ? AND sr.date = ? AND sr.time_slot = ? AND sr.status = 'active'
      `).get(req.user.id, date, time_slot);

      if (userSlotConflict) {
        const err = new Error(`You already have seat ${userSlotConflict.seat_number} reserved during ${time_slot}. You can only reserve one seat per time slot.`);
        err.statusCode = 409;
        throw err;
      }

      // Insert reservation
      const result = db.prepare(`
        INSERT INTO seat_reservations (seat_id, user_id, date, time_slot, status)
        VALUES (?, ?, ?, ?, 'active')
      `).run(seat_id, req.user.id, date, time_slot);

      // Notify student
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, 'seat', '/seats')
      `).run(
        req.user.id,
        'Study Seat Booked',
        `You booked seat ${seat.seat_number} (${seat.section}) for ${date} during ${time_slot}.`
      );

      logAudit(req.user.id, 'SEAT_RESERVED', `User reserved seat ${seat.seat_number} on ${date} (${time_slot})`);

      return {
        reservationId: result.lastInsertRowid,
        seatNumber: seat.seat_number
      };
    });

    const result = reserveSeatTx();

    res.status(201).json({
      message: 'Study seat reserved successfully',
      reservationId: result.reservationId,
      seatNumber: result.seatNumber
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message || 'Failed to reserve study seat' });
  }
});

// Cancel / Release a study seat reservation
router.delete('/reserve/:id', authenticateToken, (req, res) => {
  try {
    const booking = db.prepare('SELECT * FROM seat_reservations WHERE id = ?').get(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Seat reservation not found' });
    }

    if (req.user.role === 'student' && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    db.prepare("UPDATE seat_reservations SET status = 'cancelled' WHERE id = ?").run(booking.id);
    logAudit(req.user.id, 'SEAT_CANCELLED', `Cancelled seat reservation #${booking.id}`);

    res.json({ message: 'Seat booking successfully cancelled. Seat is now free for others.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel seat reservation' });
  }
});

// Get user's seat bookings
router.get('/my-bookings', authenticateToken, (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT sr.*, s.seat_number, s.floor, s.section, s.has_power, s.has_monitor
      FROM seat_reservations sr
      JOIN seats s ON sr.seat_id = s.id
      WHERE sr.user_id = ?
      ORDER BY sr.status ASC, sr.date DESC, sr.created_at DESC
    `).all(req.user.id);

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seat bookings' });
  }
});

// Librarian/Admin: Update live seat status (occupy / release / maintenance)
router.put('/:id/status', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const { status, user_id = null } = req.body;
    if (!['available', 'occupied', 'maintenance'].includes(status)) {
      return res.status(400).json({ error: 'Invalid seat status' });
    }

    db.prepare(`
      UPDATE seats SET
        status = ?,
        current_user_id = ?
      WHERE id = ?
    `).run(status, status === 'occupied' ? user_id : null, req.params.id);

    logAudit(req.user.id, 'SEAT_STATUS_UPDATED', `Seat ${req.params.id} marked as ${status}`);

    res.json({ message: 'Seat status updated successfully', status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update seat status' });
  }
});

module.exports = router;
