const express = require('express');
const mongoose = require('mongoose');

const Seat = require('../models/Seat');
const SeatReservation = require('../models/SeatReservation');
const Notification = require('../models/Notification');
const User = require('../models/User');

const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');
const { buildIdFilter, serializeDoc, serializeDocs } = require('../utils/idHelper');

const router = express.Router();

// Get seat map, stats, and sections with optional date and time_slot filtering
router.get('/', async (req, res) => {
  try {
    const { floor, section, date, time_slot } = req.query;

    const query = {};
    if (floor && floor !== 'All') query.floor = floor;
    if (section && section !== 'All') query.section = section;

    const seats = await Seat.find(query)
      .populate('current_user_id', 'name')
      .sort({ floor: 1, section: 1, seat_number: 1 });

    let activeBookingsMap = {};
    if (date && time_slot) {
      const activeReservations = await SeatReservation.find({
        date,
        time_slot,
        status: 'active'
      });
      activeReservations.forEach(r => {
        activeBookingsMap[r.seat_id.toString()] = r;
      });
    }

    const formattedSeats = seats.map(s => {
      const seatIdStr = s._id.toString();
      const activeBooking = activeBookingsMap[seatIdStr];
      const sObj = serializeDoc(s);

      let effective_status = s.status;
      if (s.status === 'maintenance') {
        effective_status = 'maintenance';
      } else if (activeBooking) {
        effective_status = 'reserved';
      } else if (s.status === 'occupied') {
        effective_status = 'occupied';
      } else {
        effective_status = 'available';
      }

      return {
        ...sObj,
        current_user_name: s.current_user_id?.name || null,
        active_booking_id: activeBooking ? activeBooking._id.toString() : null,
        booked_by_user_id: activeBooking ? activeBooking.user_id.toString() : null,
        effective_status
      };
    });

    res.json(formattedSeats);
  } catch (err) {
    console.error('Fetch seats error:', err);
    res.status(500).json({ error: 'Failed to retrieve study seats' });
  }
});

// Get slot-by-slot availability for a specific seat on a date
router.get('/:id/slots', async (req, res) => {
  try {
    const seat = await Seat.findOne(buildIdFilter(req.params.id));
    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    const date = req.query.date || new Date().toISOString().split('T')[0];

    const timeSlots = [
      '08:00 - 11:00 (Morning Focus)',
      '11:00 - 14:00 (Mid-day Reading)',
      '14:00 - 17:00 (Afternoon Study)',
      '17:00 - 20:00 (Evening Pod)',
      '20:00 - 22:00 (Night Owl)'
    ];

    const sFilter = buildIdFilter(seat._id, 'seat_id', 'sqlite_seat_id');
    const activeReservations = await SeatReservation.find({
      ...sFilter,
      date,
      status: 'active'
    });

    const bookedSlotsMap = {};
    activeReservations.forEach(r => {
      bookedSlotsMap[r.time_slot] = r.user_id.toString();
    });

    const slots = timeSlots.map(slot => ({
      slot,
      isAvailable: seat.status !== 'maintenance' && !bookedSlotsMap[slot],
      isMaintenance: seat.status === 'maintenance',
      isBooked: Boolean(bookedSlotsMap[slot]),
      bookedByUserId: bookedSlotsMap[slot] || null
    }));

    res.json({
      seatId: seat._id.toString(),
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

// Reserve a study seat for a date and time slot
router.post('/reserve', authenticateToken, async (req, res) => {
  try {
    const rawSeatId = req.body.seat_id || req.body.seatId;
    const date = req.body.date;
    const time_slot = req.body.time_slot || req.body.timeSlot;

    if (!rawSeatId || !date || !time_slot) {
      return res.status(400).json({ error: 'Seat, date, and time slot are required' });
    }

    const seat = await Seat.findOne(buildIdFilter(rawSeatId));
    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    if (seat.status === 'maintenance') {
      return res.status(400).json({ error: 'This seat is currently under maintenance.' });
    }

    const sFilter = buildIdFilter(seat._id, 'seat_id', 'sqlite_seat_id');
    const uFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    // 1. Conflict Check: Is this seat already booked by anyone for this exact date & time slot?
    const seatConflict = await SeatReservation.findOne({
      ...sFilter,
      date,
      time_slot,
      status: 'active'
    });

    if (seatConflict) {
      return res.status(409).json({ error: 'This seat is already reserved for the selected time slot.' });
    }

    // 2. User Conflict Check: Does this student already have an active seat reservation at this exact time slot?
    const userSlotConflict = await SeatReservation.findOne({
      ...uFilter,
      date,
      time_slot,
      status: 'active'
    }).populate('seat_id');

    if (userSlotConflict) {
      const seatNum = userSlotConflict.seat_id?.seat_number || 'another seat';
      return res.status(409).json({
        error: `You already have seat ${seatNum} reserved during ${time_slot}. You can only reserve one seat per time slot.`
      });
    }

    const reservation = await SeatReservation.create({
      seat_id: seat._id,
      user_id: req.user.id,
      date,
      time_slot,
      status: 'active',
      created_at: new Date()
    });

    await Notification.create({
      user_id: req.user.id,
      title: 'Study Seat Booked',
      message: `You booked seat ${seat.seat_number} (${seat.section}) for ${date} during ${time_slot}.`,
      type: 'seat',
      link: '/seats',
      created_at: new Date()
    });

    logAudit(req.user.id, 'SEAT_RESERVED', `User reserved seat ${seat.seat_number} on ${date} (${time_slot})`);

    res.status(201).json({
      message: 'Study seat reserved successfully',
      reservationId: reservation._id.toString(),
      seatNumber: seat.seat_number
    });
  } catch (err) {
    console.error('Reserve seat error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This seat is already reserved for the selected time slot.' });
    }
    res.status(500).json({ error: 'Failed to reserve study seat' });
  }
});

// Cancel / Release a study seat reservation
router.delete('/reserve/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await SeatReservation.findOne(buildIdFilter(req.params.id));
    if (!booking) {
      return res.status(404).json({ error: 'Seat reservation not found' });
    }

    if (req.user.role === 'student' && String(booking.user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    logAudit(req.user.id, 'SEAT_CANCELLED', `Cancelled seat reservation #${booking._id}`);

    res.json({ message: 'Seat booking successfully cancelled. Seat is now free for others.' });
  } catch (err) {
    console.error('Cancel seat booking error:', err);
    res.status(500).json({ error: 'Failed to cancel seat reservation' });
  }
});

// Get user's seat bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const bookings = await SeatReservation.find(userFilter)
      .populate('seat_id')
      .sort({ status: 1, date: -1, created_at: -1 });

    const formatted = bookings.map(b => {
      const bObj = serializeDoc(b);
      const seat = b.seat_id;
      return {
        ...bObj,
        seat_number: seat ? seat.seat_number : '',
        floor: seat ? seat.floor : '',
        section: seat ? seat.section : '',
        has_power: seat ? seat.has_power : 1,
        has_monitor: seat ? seat.has_monitor : 0
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Fetch my bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch seat bookings' });
  }
});

// Librarian/Admin: Update live seat status (occupy / release / maintenance)
router.put('/:id/status', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const { status, user_id = null } = req.body;
    if (!['available', 'occupied', 'maintenance'].includes(status)) {
      return res.status(400).json({ error: 'Invalid seat status' });
    }

    const seat = await Seat.findOne(buildIdFilter(req.params.id));
    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    seat.status = status;
    seat.current_user_id = status === 'occupied' && user_id ? user_id : null;
    await seat.save();

    logAudit(req.user.id, 'SEAT_STATUS_UPDATED', `Seat ${seat.seat_number} marked as ${status}`);

    res.json({ message: 'Seat status updated successfully', status });
  } catch (err) {
    console.error('Update seat status error:', err);
    res.status(500).json({ error: 'Failed to update seat status' });
  }
});

module.exports = router;
