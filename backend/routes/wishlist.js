const express = require('express');
const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');
const { authenticateToken } = require('../middleware/auth');
const { buildIdFilter, serializeDoc } = require('../utils/idHelper');

const router = express.Router();

// Get user wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const items = await Wishlist.find(userFilter)
      .populate('book_id')
      .sort({ created_at: -1 });

    const formatted = items
      .filter(item => Boolean(item.book_id))
      .map(item => {
        const bookObj = serializeDoc(item.book_id);
        return {
          wishlist_id: item._id.toString(),
          added_at: item.created_at,
          ...bookObj
        };
      });

    res.json(formatted);
  } catch (err) {
    console.error('Fetch wishlist error:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add book to wishlist
router.post('/:bookId', authenticateToken, async (req, res) => {
  try {
    const targetBook = await Book.findOne(buildIdFilter(req.params.bookId));
    if (!targetBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const existing = await Wishlist.findOne({
      ...userFilter,
      book_id: targetBook._id
    });

    if (existing) {
      return res.json({ message: 'Book is in your wishlist', isWishlisted: true });
    }

    await Wishlist.create({
      user_id: req.user.id,
      book_id: targetBook._id,
      created_at: new Date()
    });

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:bookId', authenticateToken, async (req, res) => {
  try {
    const targetBook = await Book.findOne(buildIdFilter(req.params.bookId));
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    if (targetBook) {
      await Wishlist.deleteOne({
        ...userFilter,
        book_id: targetBook._id
      });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
