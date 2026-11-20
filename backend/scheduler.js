const Loan = require('./models/Loan');
const Book = require('./models/Book');
const BookCopy = require('./models/BookCopy');
const User = require('./models/User');
const Reservation = require('./models/Reservation');
const Notification = require('./models/Notification');
const { buildIdFilter } = require('./utils/idHelper');

const DAILY_FINE_RATE = 1.0;

/**
 * 1. Process Due Date Reminders and Overdue Fines
 */
async function checkDueDates() {
  const now = new Date();
  let remindersSent = 0;
  let overdueUpdated = 0;

  try {
    const activeLoans = await Loan.find({
      status: { $in: ['active', 'overdue'] },
      return_date: null
    }).populate('book_id').populate('user_id');

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const loan of activeLoans) {
      if (!loan.due_date || !loan.user_id || !loan.book_id) continue;
      const dueDate = new Date(loan.due_date);
      const diffMs = dueDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const uFilter = buildIdFilter(loan.user_id._id, 'user_id', 'sqlite_user_id');

      if (diffMs < 0) {
        // OVERDUE
        const daysOverdue = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
        const fine = daysOverdue * DAILY_FINE_RATE;

        if (loan.status !== 'overdue' || loan.fine_amount !== fine) {
          loan.status = 'overdue';
          loan.fine_amount = fine;
          await loan.save();
          overdueUpdated++;
        }

        const alreadyNotified = await Notification.findOne({
          ...uFilter,
          type: 'overdue',
          title: 'Book Overdue Alert',
          created_at: { $gte: oneDayAgo }
        });

        if (!alreadyNotified) {
          await Notification.create({
            user_id: loan.user_id._id,
            title: 'Book Overdue Alert',
            message: `Your loan for "${loan.book_id.title}" is overdue (${daysOverdue} day${daysOverdue > 1 ? 's' : ''}). Outstanding fine: $${fine.toFixed(2)}. Please return or contact the desk.`,
            type: 'overdue',
            link: '/dashboard',
            created_at: new Date()
          });
          remindersSent++;
        }
      } else if (diffHours <= 24 && diffHours > 0) {
        // DUE TOMORROW (< 24 HOURS)
        const alreadyNotified = await Notification.findOne({
          ...uFilter,
          type: 'due',
          title: 'Due Tomorrow Reminder',
          created_at: { $gte: oneDayAgo }
        });

        if (!alreadyNotified) {
          await Notification.create({
            user_id: loan.user_id._id,
            title: 'Due Tomorrow Reminder',
            message: `"${loan.book_id.title}" is due tomorrow (${dueDate.toLocaleDateString()}). You can renew it from your dashboard if no hold is pending.`,
            type: 'due',
            link: '/dashboard',
            created_at: new Date()
          });
          remindersSent++;
        }
      } else if (diffHours <= 48 && diffHours > 24) {
        // DUE IN 48 HOURS
        const alreadyNotified = await Notification.findOne({
          ...uFilter,
          type: 'due',
          title: 'Upcoming Due Date (48h)',
          created_at: { $gte: oneDayAgo }
        });

        if (!alreadyNotified) {
          await Notification.create({
            user_id: loan.user_id._id,
            title: 'Upcoming Due Date (48h)',
            message: `Friendly reminder: "${loan.book_id.title}" is due in 2 days on ${dueDate.toLocaleDateString()}.`,
            type: 'due',
            link: '/dashboard',
            created_at: new Date()
          });
          remindersSent++;
        }
      }
    }
  } catch (err) {
    console.error('Scheduler checkDueDates error:', err.message);
  }

  return { remindersSent, overdueUpdated };
}

/**
 * 2. Process Expired Pickup Deadlines for Reservations
 */
async function checkExpiredReservations() {
  const now = new Date();
  let expiredCount = 0;
  let reassignedCount = 0;

  try {
    const expiredReservations = await Reservation.find({
      status: 'ready_for_pickup',
      pickup_deadline: { $lt: now }
    }).populate('book_id');

    for (const resv of expiredReservations) {
      resv.status = 'expired';
      await resv.save();
      expiredCount++;

      const bFilter = buildIdFilter(resv.book_id?._id, 'book_id', 'sqlite_book_id');

      // Check next student in waiting list
      const nextStudent = await Reservation.findOne({
        ...bFilter,
        status: 'waiting'
      }).sort({ queue_position: 1, reservation_date: 1 });

      if (nextStudent) {
        const newDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
        nextStudent.status = 'ready_for_pickup';
        nextStudent.pickup_deadline = newDeadline;
        await nextStudent.save();

        await Notification.create({
          user_id: nextStudent.user_id,
          title: 'Hold Ready for Pickup!',
          message: `Your reserved volume "${resv.book_id?.title}" has become available and is ready for pickup at the front desk! Please collect by ${newDeadline.toLocaleString()}.`,
          type: 'pickup',
          link: '/dashboard',
          created_at: new Date()
        });
        reassignedCount++;
      } else {
        // Release physical copy back to available inventory
        const copy = await BookCopy.findOne({ ...bFilter, status: 'reserved' });
        if (copy) {
          copy.status = 'available';
          await copy.save();
        }
        await Book.updateOne({ _id: resv.book_id?._id }, { $inc: { available_copies: 1 } });
      }

      await Notification.create({
        user_id: resv.user_id,
        title: 'Reservation Pickup Window Expired',
        message: `The 48-hour pickup window for "${resv.book_id?.title}" has expired. The volume has been released to the next reader or library shelf.`,
        type: 'reservation',
        link: '/catalog',
        created_at: new Date()
      });
    }
  } catch (err) {
    console.error('Scheduler checkExpiredReservations error:', err.message);
  }

  return { expiredCount, reassignedCount };
}

async function runSchedulerCycle() {
  const dueResult = await checkDueDates();
  const resvResult = await checkExpiredReservations();
  return {
    timestamp: new Date().toISOString(),
    dueDates: dueResult,
    reservations: resvResult
  };
}

let schedulerTimer = null;
function startScheduler(intervalMs = 3 * 60 * 1000) {
  if (schedulerTimer) clearInterval(schedulerTimer);
  // Initial run after 5 seconds to let server start up
  setTimeout(() => {
    runSchedulerCycle().catch(e => console.error('Initial scheduler error:', e));
  }, 5000);
  schedulerTimer = setInterval(() => {
    runSchedulerCycle().catch(e => console.error('Interval scheduler error:', e));
  }, intervalMs);
}

module.exports = {
  startScheduler,
  runSchedulerCycle,
  checkDueDates,
  checkExpiredReservations
};
