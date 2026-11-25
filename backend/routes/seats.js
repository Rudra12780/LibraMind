const express = require('express');
const mongoose = require('mongoose');

const Seat = require('../models/Seat');
const SeatReservation = require('../models/SeatReservation');
const Notification = require('../models/Notification');
const User = require('../models/User');

const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');
const { buildIdFilter, serializeDoc, serializeDocs } = require('../utils/idHelper');

const router = express.Router();

let sqliteDb = null;
try {
  sqliteDb = require('../db/database');
} catch (e) {
  console.warn('SQLite fallback unavailable in seats route:', e.message);
}

function formatTimeSlot12h(slotStr) {
  if (!slotStr) return '';
  return String(slotStr)
    .replace(/08:00\s*-\s*11:00/gi, '8:00 AM - 11:00 AM')
    .replace(/11:00\s*-\s*14:00/gi, '11:00 AM - 2:00 PM')
    .replace(/14:00\s*-\s*17:00/gi, '2:00 PM - 5:00 PM')
    .replace(/17:00\s*-\s*20:00/gi, '5:00 PM - 8:00 PM')
    .replace(/20:00\s*-\s*22:00/gi, '8:00 PM - 10:00 PM');
}

function normalizeSlotKey(slotStr) {
  if (!slotStr) return '';
  const s = String(slotStr).toLowerCase();
  if (s.includes('08:00') || s.includes('8:00') || s.includes('morning')) return '08:00-11:00';
  if (s.includes('11:00') || s.includes('mid-day') || s.includes('midday')) return '11:00-14:00';
  if (s.includes('14:00') || s.includes('2:00') || s.includes('afternoon')) return '14:00-17:00';
  if (s.includes('17:00') || s.includes('5:00') || s.includes('evening')) return '17:00-20:00';
  if (s.includes('20:00') || s.includes('8:00 pm') || s.includes('night')) return '20:00-22:00';
  return s.split('(')[0].trim();
}

const CANONICAL_TIME_SLOTS_12H = [
  '8:00 AM - 11:00 AM (Morning Focus)',
  '11:00 AM - 2:00 PM (Mid-day Reading)',
  '2:00 PM - 5:00 PM (Afternoon Study)',
  '5:00 PM - 8:00 PM (Evening Pod)',
  '8:00 PM - 10:00 PM (Night Owl)'
];

function getSlotEndMinutes(slotStr) {
  if (!slotStr) return 0;
  const s = String(slotStr).trim();

  // 1. Match 12-hour with AM/PM after hyphen: e.g. "- 4:00 PM", "- 2:00 PM", "- 10:00 PM", "- 4 PM"
  const match12 = s.match(/-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (match12) {
    let hour = parseInt(match12[1], 10);
    const min = match12[2] ? parseInt(match12[2], 10) : 0;
    const ampm = match12[3].toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return hour * 60 + min;
  }

  // 2. Match 24-hour after hyphen: e.g. "- 16:00", "- 14:00", "- 22:00"
  const match24 = s.match(/-\s*(\d{1,2}):(\d{2})/);
  if (match24) {
    const hour = parseInt(match24[1], 10);
    const min = parseInt(match24[2], 10);
    return hour * 60 + min;
  }

  // 3. Known slot key fallbacks:
  if (s.includes('08:00-11:00') || s.includes('morning')) return 11 * 60;
  if (s.includes('11:00-14:00') || s.includes('mid-day') || s.includes('midday')) return 14 * 60;
  if (s.includes('14:00-17:00') || s.includes('afternoon')) return 17 * 60;
  if (s.includes('17:00-20:00') || s.includes('evening')) return 20 * 60;
  if (s.includes('20:00-22:00') || s.includes('night')) return 22 * 60;

  return 24 * 60;
}

function normalizeDateString(d) {
  if (!d) return '';
  if (typeof d === 'string' && d.includes('T')) return d.split('T')[0];
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return String(d);
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}

function isSlotExpired(dateStr, timeSlotStr, now = new Date()) {
  if (!dateStr) return false;
  const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const bookingYMD = normalizeDateString(dateStr);

  if (bookingYMD < todayYMD) return true;
  if (bookingYMD > todayYMD) return false;

  // Same day: check if current time is at or past the slot end time (e.g. at 4:01 for an 11-4 booking)
  const endMinutes = getSlotEndMinutes(timeSlotStr);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= endMinutes;
}

async function autoReleaseExpiredSeats() {
  const now = new Date();

  try {
    if (mongoose.connection.readyState === 1) {
      const activeReservations = await SeatReservation.find({ status: 'active' });
      const expiredIds = [];
      const expiredSeatIds = [];

      for (const r of activeReservations) {
        if (isSlotExpired(r.date, r.time_slot, now)) {
          expiredIds.push(r._id);
          if (r.seat_id) expiredSeatIds.push(r.seat_id);
        }
      }

      if (expiredIds.length > 0) {
        await SeatReservation.updateMany(
          { _id: { $in: expiredIds } },
          { $set: { status: 'completed', updated_at: now } }
        );

        for (const seatId of expiredSeatIds) {
          const stillActive = await SeatReservation.findOne({
            seat_id: seatId,
            status: 'active'
          });
          if (!stillActive) {
            await Seat.updateOne(
              { _id: seatId, status: { $ne: 'maintenance' } },
              { $set: { status: 'available', current_user_id: null } }
            );
          }
        }
      }
    }

    if (sqliteDb) {
      const activeRows = sqliteDb.prepare("SELECT * FROM seat_reservations WHERE status = 'active'").all();
      for (const row of activeRows) {
        if (isSlotExpired(row.date, row.time_slot, now)) {
          sqliteDb.prepare("UPDATE seat_reservations SET status = 'completed' WHERE id = ?").run(row.id);
          sqliteDb.prepare("UPDATE seats SET status = 'available', current_user_id = NULL WHERE id = ? AND status != 'maintenance'").run(row.seat_id);
        }
      }
    }
  } catch (err) {
    console.warn('Auto release expired seats warning:', err.message);
  }
}

// Background auto-release timer running continuously every 60 seconds
setInterval(autoReleaseExpiredSeats, 60000);

// Get seat map, stats, and sections with optional date and time_slot filtering
router.get('/', async (req, res) => {
  await autoReleaseExpiredSeats();
  const { floor, section, date, time_slot } = req.query;

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const effectiveDate = date || todayStr;

  // Fallback function to get seats from SQLite
  const querySeatsFromSqlite = () => {
    if (!sqliteDb) return null;
    try {
      let sql = 'SELECT * FROM seats WHERE 1=1';
      const params = [];
      if (floor && floor !== 'All') {
        sql += ' AND (floor = ? OR floor LIKE ?)';
        params.push(floor, `%${floor}%`);
      }
      if (section && section !== 'All') {
        sql += ' AND section = ?';
        params.push(section);
      }
      sql += ' ORDER BY floor ASC, section ASC, seat_number ASC';
      const rows = sqliteDb.prepare(sql).all(...params);

      // Fetch active reservations for effectiveDate
      const activeResRows = sqliteDb.prepare(`
        SELECT r.*, u.name as user_name, u.email as user_email
        FROM seat_reservations r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.date = ? AND r.status = 'active'
      `).all(effectiveDate).filter(r => !isSlotExpired(r.date, r.time_slot, now));

      const sqliteBookingsMap = {};
      activeResRows.forEach(r => {
        const sKey = String(r.seat_id);
        if (!sqliteBookingsMap[sKey]) sqliteBookingsMap[sKey] = [];
        sqliteBookingsMap[sKey].push({
          reservation_id: String(r.id),
          student_name: r.user_name || 'Library Patron',
          student_email: r.user_email || '',
          date: r.date,
          time_slot: formatTimeSlot12h(r.time_slot),
          slot_key: normalizeSlotKey(r.time_slot)
        });
      });

      return rows.map(s => {
        const sId = String(s.id);
        const allBookings = sqliteBookingsMap[sId] || [];
        let matched = null;
        if (time_slot) {
          const tKey = normalizeSlotKey(time_slot);
          matched = allBookings.find(b => b.slot_key === tKey || b.time_slot === time_slot);
        } else {
          matched = allBookings[0] || null;
        }

        let eff = s.status || 'available';
        if (s.status === 'maintenance') {
          eff = 'maintenance';
        } else if (matched || (allBookings.length > 0 && !time_slot)) {
          eff = 'occupied';
        } else {
          eff = 'available';
        }

        return {
          ...s,
          _id: sId,
          current_user_name: matched ? matched.student_name : null,
          booking_timing: matched ? matched.time_slot : (allBookings[0]?.time_slot || null),
          booking_date: matched ? matched.date : (allBookings[0]?.date || null),
          all_bookings_today: allBookings,
          active_booking_id: matched ? matched.reservation_id : null,
          effective_status: eff
        };
      });
    } catch (err) {
      console.error('SQLite querySeats error:', err);
      return null;
    }
  };

  if (mongoose.connection.readyState !== 1) {
    const sqliteSeats = querySeatsFromSqlite();
    if (sqliteSeats) return res.json(sqliteSeats);
  }

  try {
    const query = {};
    if (floor && floor !== 'All') query.floor = floor;
    if (section && section !== 'All') query.section = section;

    const seats = await Seat.find(query)
      .populate('current_user_id', 'name')
      .sort({ floor: 1, section: 1, seat_number: 1 });

    const rawReservations = await SeatReservation.find({
      date: effectiveDate,
      status: 'active'
    }).populate('user_id', 'name email membership_id');

    const activeReservations = rawReservations.filter(r => !isSlotExpired(r.date, r.time_slot, now));

    const seatBookingsMap = {};
    activeReservations.forEach(r => {
      if (!r.seat_id) return;
      const seatKey = r.seat_id.toString();
      if (!seatBookingsMap[seatKey]) seatBookingsMap[seatKey] = [];
      seatBookingsMap[seatKey].push({
        reservation_id: r._id.toString(),
        student_name: r.user_id?.name || 'Library Patron',
        student_email: r.user_id?.email || '',
        date: r.date,
        time_slot: formatTimeSlot12h(r.time_slot),
        slot_key: normalizeSlotKey(r.time_slot)
      });
    });

    const formattedSeats = seats.map(s => {
      const seatIdStr = s._id.toString();
      const sObj = serializeDoc(s);
      const allSeatBookings = seatBookingsMap[seatIdStr] || [];

      let matchedBooking = null;
      if (time_slot) {
        const targetSlotKey = normalizeSlotKey(time_slot);
        matchedBooking = allSeatBookings.find(b => b.slot_key === targetSlotKey || b.time_slot === time_slot);
      } else {
        matchedBooking = allSeatBookings[0] || null;
      }

      let effective_status = s.status;
      if (s.status === 'maintenance') {
        effective_status = 'maintenance';
      } else if (matchedBooking || (allSeatBookings.length > 0 && !time_slot)) {
        effective_status = 'occupied';
      } else {
        effective_status = 'available';
      }

      const activeStudent = matchedBooking ? matchedBooking.student_name : (s.current_user_id?.name || null);
      const activeTiming = matchedBooking ? matchedBooking.time_slot : (allSeatBookings[0]?.time_slot || null);
      const activeDate = matchedBooking ? matchedBooking.date : (allSeatBookings[0]?.date || null);

      return {
        ...sObj,
        current_user_name: activeStudent,
        booking_timing: activeTiming,
        booking_date: activeDate,
        all_bookings_today: allSeatBookings,
        active_booking_id: matchedBooking ? matchedBooking.reservation_id : null,
        booked_by_user_id: matchedBooking ? matchedBooking.student_email : null,
        effective_status
      };
    });

    res.json(formattedSeats);
  } catch (err) {
    console.error('Fetch seats error from Mongo, attempting SQLite fallback:', err.message);
    const sqliteSeats = querySeatsFromSqlite();
    if (sqliteSeats) return res.json(sqliteSeats);
    res.status(500).json({ error: 'Failed to retrieve study seats' });
  }
});

// Get slot-by-slot availability for a specific seat on a date
router.get('/:id/slots', async (req, res) => {
  try {
    await autoReleaseExpiredSeats();
    const seat = await Seat.findOne(buildIdFilter(req.params.id));
    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    const date = req.query.date || new Date().toISOString().split('T')[0];

    const sFilter = buildIdFilter(seat._id, 'seat_id', 'sqlite_seat_id');
    const activeReservations = await SeatReservation.find({
      ...sFilter,
      date,
      status: 'active'
    });

    const bookedSlotsMap = {};
    activeReservations.forEach(r => {
      const k = normalizeSlotKey(r.time_slot);
      if (k) bookedSlotsMap[k] = r.user_id.toString();
    });

    const slots = CANONICAL_TIME_SLOTS_12H.map(slot => {
      const k = normalizeSlotKey(slot);
      const bookedUser = bookedSlotsMap[k];
      return {
        slot,
        isAvailable: seat.status !== 'maintenance' && !bookedUser,
        isMaintenance: seat.status === 'maintenance',
        isBooked: Boolean(bookedUser),
        bookedByUserId: bookedUser || null
      };
    });

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
    await autoReleaseExpiredSeats();
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

    const canonicalSlot = formatTimeSlot12h(time_slot);
    const targetSlotKey = normalizeSlotKey(time_slot);

    const sFilter = buildIdFilter(seat._id, 'seat_id', 'sqlite_seat_id');
    const uFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    // 1. Conflict Check: Is this seat already booked by anyone for this exact date & time slot?
    const seatActiveBookings = await SeatReservation.find({
      ...sFilter,
      date,
      status: 'active'
    });
    const seatConflict = seatActiveBookings.find(r => normalizeSlotKey(r.time_slot) === targetSlotKey);

    if (seatConflict) {
      return res.status(409).json({ error: 'This study pod is already reserved for the selected time slot.' });
    }

    // 2. User Conflict Check: Does this student already have an active seat reservation at this exact time slot?
    const userActiveBookings = await SeatReservation.find({
      ...uFilter,
      date,
      status: 'active'
    }).populate('seat_id');

    const userSlotConflict = userActiveBookings.find(r => normalizeSlotKey(r.time_slot) === targetSlotKey);

    if (userSlotConflict) {
      const seatNum = userSlotConflict.seat_id?.seat_number || 'another study pod';
      return res.status(409).json({
        error: `You already have Study Pod ${seatNum} reserved for ${formatTimeSlot12h(userSlotConflict.time_slot)} on ${date}. You cannot reserve multiple study pods for the same time slot.`
      });
    }

    const reservation = await SeatReservation.create({
      seat_id: seat._id,
      user_id: req.user.id,
      date,
      time_slot: canonicalSlot,
      status: 'active',
      created_at: new Date()
    });

    await Notification.create({
      user_id: req.user.id,
      title: 'Study Seat Booked',
      message: `You booked study pod ${seat.seat_number} (${seat.section}) for ${date} during ${canonicalSlot}.`,
      type: 'seat',
      link: '/seats',
      created_at: new Date()
    });

    logAudit(req.user.id, 'SEAT_RESERVED', `User reserved seat ${seat.seat_number} on ${date} (${canonicalSlot})`);

    res.status(201).json({
      message: 'Study seat reserved successfully',
      reservationId: reservation._id.toString(),
      seatNumber: seat.seat_number
    });
  } catch (err) {
    console.error('Reserve seat error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This study pod is already reserved for the selected time slot.' });
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
    await autoReleaseExpiredSeats();
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
        time_slot: formatTimeSlot12h(b.time_slot),
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

    let seatFound = false;
    let seatNumber = '';

    if (mongoose.connection.readyState === 1) {
      try {
        const seat = await Seat.findOne(buildIdFilter(req.params.id));
        if (seat) {
          seat.status = status;
          seat.current_user_id = status === 'occupied' && user_id ? user_id : null;
          await seat.save();
          seatFound = true;
          seatNumber = seat.seat_number;
        }
      } catch (mErr) {
        console.warn('Mongo seat status update warning:', mErr.message);
      }
    }

    if (sqliteDb) {
      try {
        const s = sqliteDb.prepare('SELECT * FROM seats WHERE id = ? OR seat_number = ?').get(req.params.id, req.params.id);
        if (s) {
          sqliteDb.prepare('UPDATE seats SET status = ?, current_user_id = ? WHERE id = ?')
            .run(status, status === 'occupied' && user_id ? user_id : null, s.id);
          seatFound = true;
          if (!seatNumber) seatNumber = s.seat_number;
        }
      } catch (sqlErr) {
        console.warn('SQLite seat status update error:', sqlErr.message);
      }
    }

    if (!seatFound) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    logAudit(req.user.id, 'SEAT_STATUS_UPDATED', `Seat ${seatNumber || req.params.id} marked as ${status}`);

    res.json({ message: 'Seat status updated successfully', status });
  } catch (err) {
    console.error('Update seat status error:', err);
    res.status(500).json({ error: 'Failed to update seat status' });
  }
});

module.exports = router;
