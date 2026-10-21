const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

// Get notifications for current user
router.get('/', authenticateToken, (req, res) => {
  try {
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
