const express = require('express');
const mongoose = require('mongoose');

const Notification = require('../models/Notification');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');

const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');
const { buildIdFilter, serializeDoc, serializeDocs } = require('../utils/idHelper');

const router = express.Router();

// Get notifications for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    // Automatic Expiry Warning Check: Alert member if any active loan is approaching due date (within 3 days or today)
    const activeLoans = await Loan.find({
      ...userFilter,
      status: { $in: ['active', 'borrowed'] }
    }).populate('book_id');

    const now = new Date();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const loan of activeLoans) {
      if (!loan.due_date || !loan.book_id) continue;
      const due = new Date(loan.due_date);
      const diffMs = due - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 3 && diffDays >= 0) {
        const bookTitle = loan.book_id.title;
        const existingWarning = await Notification.findOne({
          ...userFilter,
          type: 'due',
          message: new RegExp(bookTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
          created_at: { $gte: oneDayAgo }
        });

        if (!existingWarning) {
          const daysText = diffDays === 0 ? 'today' : (diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`);
          await Notification.create({
            user_id: req.user.id,
            title: '⚠️ Loan Expiry Approaching: Return Date Near',
            message: `Your borrowing period for "${bookTitle}" will expire ${daysText} (${due.toLocaleDateString()}). Please return or renew this volume on time to avoid overdue circulation penalties.`,
            type: 'due',
            link: '/dashboard',
            created_at: new Date()
          });
        }
      }
    }

    const notifications = await Notification.find(userFilter)
      .sort({ created_at: -1 })
      .limit(50);

    res.json(serializeDocs(notifications));
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

// Mark single notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notifFilter = buildIdFilter(req.params.id);
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    await Notification.updateOne(
      { ...notifFilter, ...userFilter },
      { $set: { is_read: 1 } }
    );

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Update notification error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    await Notification.updateMany(userFilter, { $set: { is_read: 1 } });

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Clear all notifications for user
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    await Notification.deleteMany(userFilter);

    try {
      const sqliteDb = require('../db/database');
      if (sqliteDb && typeof sqliteDb.prepare === 'function') {
        const numUid = parseInt(req.user.id, 10);
        if (!isNaN(numUid)) {
          sqliteDb.prepare('DELETE FROM notifications WHERE user_id = ?').run(numUid);
        }
      }
    } catch (e) {
      // ignore
    }

    res.json({ message: 'All notifications cleared successfully' });
  } catch (err) {
    console.error('Clear all notifications error:', err);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

// Delete single notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notifFilter = buildIdFilter(req.params.id);
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    await Notification.deleteOne({ ...notifFilter, ...userFilter });

    try {
      const sqliteDb = require('../db/database');
      if (sqliteDb && typeof sqliteDb.prepare === 'function') {
        const numId = parseInt(req.params.id, 10);
        const numUid = parseInt(req.user.id, 10);
        if (!isNaN(numId)) {
          if (!isNaN(numUid)) {
            sqliteDb.prepare('DELETE FROM notifications WHERE id = ? AND user_id = ?').run(numId, numUid);
          } else {
            sqliteDb.prepare('DELETE FROM notifications WHERE id = ?').run(numId);
          }
        }
      }
    } catch (e) {
      // ignore
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Delete notification error:', err);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Librarian / Admin: Send broadcast announcement to all library members
router.post('/announcement', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const { title, message, link = '/catalog' } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const students = await User.find({ role: 'student' }).select('_id');

    if (students.length > 0) {
      const docs = students.map(s => ({
        user_id: s._id,
        title: title.trim(),
        message: message.trim(),
        type: 'announcement',
        link,
        created_at: new Date()
      }));
      await Notification.insertMany(docs);
    }

    logAudit(req.user.id, 'ANNOUNCEMENT_SENT', `Broadcast: "${title}" to ${students.length} students`);

    res.json({ message: `Announcement sent to ${students.length} students` });
  } catch (err) {
    console.error('Send announcement error:', err);
    res.status(500).json({ error: 'Failed to send announcement' });
  }
});

module.exports = router;
