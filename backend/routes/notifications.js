const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

// Get notifications for current user
router.get('/', authenticateToken, (req, res) => {
  try {
    // Automatic Expiry Warning Check: Alert member if any active loan is approaching due date (within 3 days or today)
    const activeLoans = db.prepare(`
      SELECT l.id, l.due_date, b.title as book_title
      FROM loans l
      JOIN books b ON l.book_id = b.id
      WHERE l.user_id = ? AND l.status IN ('active', 'borrowed')
    `).all(req.user.id);

    const now = new Date();
    for (const loan of activeLoans) {
      const due = new Date(loan.due_date);
      const diffMs = due - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 3 && diffDays >= 0) {
        // Only insert if not already notified for this loan in the last 24 hours
        const existingWarning = db.prepare(`
          SELECT id FROM notifications
          WHERE user_id = ? AND type = 'due' AND message LIKE ? AND created_at >= datetime('now', '-1 day')
        `).get(req.user.id, `%${loan.book_title}%`);

        if (!existingWarning) {
          const daysText = diffDays === 0 ? 'today' : (diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`);
          db.prepare(`
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (?, '⚠️ Loan Expiry Approaching: Return Date Near', ?, 'due', '/dashboard')
          `).run(
            req.user.id,
            `Your borrowing period for "${loan.book_title}" will expire ${daysText} (${due.toLocaleDateString()}). Please return or renew this volume on time to avoid overdue circulation penalties.`
          );
        }
      }
    }

    const notifications = db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(req.user.id);

    const unreadCount = db.prepare(`
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ? AND is_read = 0
    `).get(req.user.id);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

// Mark single notification as read
router.put('/:id/read', authenticateToken, (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications SET is_read = 1
      WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.user.id);

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications SET is_read = 1
      WHERE user_id = ?
    `).run(req.user.id);

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Librarian / Admin: Send broadcast announcement to all library members
router.post('/announcement', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const { title, message, link = '/catalog' } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const students = db.prepare("SELECT id FROM users WHERE role = 'student'").all();

    const stmt = db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'announcement', ?)
    `);

    const broadcastTx = db.transaction(() => {
      for (const s of students) {
        stmt.run(s.id, title.trim(), message.trim(), link);
      }
    });

    broadcastTx();
    logAudit(req.user.id, 'ANNOUNCEMENT_SENT', `Broadcast: "${title}" to ${students.length} students`);

    res.json({ message: `Announcement sent to ${students.length} students` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send announcement' });
  }
});

module.exports = router;
