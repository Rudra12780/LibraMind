const express = require('express');
const db = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user wishlist
router.get('/', authenticateToken, (req, res) => {
  try {
    const items = db.prepare(`
      SELECT w.id as wishlist_id, w.created_at as added_at,
        b.*
      FROM wishlist w
      JOIN books b ON w.book_id = b.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(req.user.id);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add book to wishlist
router.post('/:bookId', authenticateToken, (req, res) => {
  try {
    const bookId = req.params.bookId;
    const existing = db.prepare('SELECT id FROM wishlist WHERE user_id = ? AND book_id = ?').get(req.user.id, bookId);

    if (existing) {
      return res.status(400).json({ error: 'Book already in your wishlist' });
    }

    db.prepare('INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)').run(req.user.id, bookId);
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:bookId', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM wishlist WHERE user_id = ? AND book_id = ?').run(req.user.id, req.params.bookId);
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
