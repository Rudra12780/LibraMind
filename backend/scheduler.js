const db = require('./db/database');

const DAILY_FINE_RATE = 1.0;

/**
 * 1. Process Due Date Reminders and Overdue Fines
 */
function checkDueDates() {
  const now = new Date();
  let remindersSent = 0;
  let overdueUpdated = 0;

  const activeLoans = db.prepare(`
    SELECT l.*, b.title as book_title, u.email as user_email
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN users u ON l.user_id = u.id
    WHERE l.status IN ('active', 'overdue')
  `).all();

  const updateLoanStmt = db.prepare(`
    UPDATE loans SET status = ?, fine_amount = ? WHERE id = ?
  `);

  const notifInsertStmt = db.prepare(`
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (?, ?, ?, ?, '/dashboard')
  `);

  const recentNotifCheckStmt = db.prepare(`
    SELECT id FROM notifications
    WHERE user_id = ? AND type = ? AND title = ? AND created_at >= datetime('now', '-24 hours')
  `);

  for (const loan of activeLoans) {
    const dueDate = new Date(loan.due_date);
    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs < 0) {
      // OVERDUE
      const daysOverdue = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
      const fine = daysOverdue * DAILY_FINE_RATE;

      if (loan.status !== 'overdue' || loan.fine_amount !== fine) {
        updateLoanStmt.run('overdue', fine, loan.id);
        overdueUpdated++;
      }

      // Check duplicate reminder for today
      const alreadyNotified = recentNotifCheckStmt.get(loan.user_id, 'overdue', 'Book Overdue Alert');
      if (!alreadyNotified) {
        notifInsertStmt.run(
          loan.user_id,
          'Book Overdue Alert',
          `Your loan for "${loan.book_title}" is overdue (${daysOverdue} day${daysOverdue > 1 ? 's' : ''}). Outstanding fine: $${fine.toFixed(2)}. Please return or contact the desk.`,
          'overdue'
        );
        remindersSent++;
      }
    } else if (diffHours <= 24 && diffHours > 0) {
      // DUE TOMORROW (< 24 HOURS)
      const alreadyNotified = recentNotifCheckStmt.get(loan.user_id, 'due', 'Due Tomorrow Reminder');
      if (!alreadyNotified) {
        notifInsertStmt.run(
          loan.user_id,
          'Due Tomorrow Reminder',
          `"${loan.book_title}" is due tomorrow (${dueDate.toLocaleDateString()}). You can renew it from your dashboard if no hold is pending.`,
          'due'
        );
        remindersSent++;
      }
    } else if (diffHours <= 48 && diffHours > 24) {
      // DUE IN 48 HOURS
      const alreadyNotified = recentNotifCheckStmt.get(loan.user_id, 'due', 'Upcoming Due Date (48h)');
      if (!alreadyNotified) {
        notifInsertStmt.run(
          loan.user_id,
          'Upcoming Due Date (48h)',
          `Friendly reminder: "${loan.book_title}" is due in 2 days on ${dueDate.toLocaleDateString()}.`,
          'due'
        );
        remindersSent++;
      }
    }
  }

  return { remindersSent, overdueUpdated };
}

/**
 * 2. Process Expired Pickup Deadlines for Reservations
 */
function checkExpiredReservations() {
  const now = new Date();
  let expiredCount = 0;
  let reassignedCount = 0;

  // Find all reservations whose pickup deadline has passed
  const expiredReservations = db.prepare(`
    SELECT r.*, b.title as book_title
    FROM reservations r
    JOIN books b ON r.book_id = b.id
    WHERE r.status = 'ready_for_pickup' AND r.pickup_deadline IS NOT NULL AND datetime(r.pickup_deadline) <= datetime('now')
  `).all();

  for (const res of expiredReservations) {
    const handleExpiryTx = db.transaction(() => {
      // Mark as expired
      db.prepare("UPDATE reservations SET status = 'expired' WHERE id = ?").run(res.id);
      expiredCount++;

      // Notify the student that their pickup window expired
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, 'Pickup Window Expired', ?, 'reservation', '/dashboard')
      `).run(
        res.user_id,
        `Your hold reservation for "${res.book_title}" has expired because it was not collected within the 48-hour pickup window.`
      );

      // Check if next student is waiting in queue
      const nextStudent = db.prepare(`
        SELECT * FROM reservations
        WHERE book_id = ? AND status = 'waiting'
        ORDER BY queue_position ASC, reservation_date ASC
        LIMIT 1
      `).get(res.book_id);

      if (nextStudent) {
        const newDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
        db.prepare(`
          UPDATE reservations SET
            status = 'ready_for_pickup',
            pickup_deadline = ?
          WHERE id = ?
        `).run(newDeadline, nextStudent.id);

        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type, link)
          VALUES (?, 'Book Ready for Pickup!', ?, 'pickup', '/dashboard')
        `).run(
          nextStudent.user_id,
          `Great news! "${res.book_title}" is now held at the library desk for you. Please pick it up by ${new Date(newDeadline).toLocaleString()}.`
        );
        reassignedCount++;
      } else {
        // Return copy to available pool
        const reservedCopy = db.prepare("SELECT id FROM book_copies WHERE book_id = ? AND status = 'reserved' LIMIT 1").get(res.book_id);
        if (reservedCopy) {
          db.prepare("UPDATE book_copies SET status = 'available' WHERE id = ?").run(reservedCopy.id);
          db.prepare("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?").run(res.book_id);
        }
      }
    });

    handleExpiryTx();
  }

  return { expiredCount, reassignedCount };
}

/**
 * 3. Complete Past Seat Reservations
 */
function checkCompletedSeatBookings() {
  const result = db.prepare(`
    UPDATE seat_reservations
    SET status = 'completed'
    WHERE status = 'active' AND date < date('now')
  `).run();

  return { completedSeats: result.changes };
}

/**
 * Master cycle runner
 */
function runSchedulerCycle() {
  try {
    const dueStats = checkDueDates();
    const expiryStats = checkExpiredReservations();
    const seatStats = checkCompletedSeatBookings();

    const notificationsCreated = (dueStats.remindersSent || 0) + (expiryStats.expiredCount || 0) + (expiryStats.reassignedCount || 0);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        notificationsCreated,
        remindersSent: dueStats.remindersSent,
        overdueUpdated: dueStats.overdueUpdated,
        expiredReservations: expiryStats.expiredCount,
        reassignedReservations: expiryStats.reassignedCount,
        completedSeats: seatStats.completedSeats
      },
      dueStats,
      expiryStats,
      seatStats
    };
  } catch (err) {
    console.error('Scheduler cycle error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Start background timer
 */
let timerId = null;
function startScheduler(intervalMs = 3 * 60 * 1000) {
  // Run on startup
  runSchedulerCycle();

  // Schedule recurring checks
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    runSchedulerCycle();
  }, intervalMs);
}

module.exports = {
  checkDueDates,
  checkExpiredReservations,
  checkCompletedSeatBookings,
  runSchedulerCycle,
  startScheduler
};
