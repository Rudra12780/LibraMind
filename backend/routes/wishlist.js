const express = require('express');
const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { buildIdFilter, serializeDoc, isValidObjectId } = require('../utils/idHelper');

const router = express.Router();

// Get user wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const items = await Wishlist.find(userFilter)
      .populate('book_id')
      .sort({ created_at: -1 });

    const formatted = [];
    for (const item of items) {
      let bookDoc = item.book_id;
      if (!bookDoc && item.sqlite_book_id) {
        bookDoc = await Book.findOne({ sqlite_id: item.sqlite_book_id });
      }
      if (bookDoc) {
        const bookObj = serializeDoc(bookDoc);
        formatted.push({
          wishlist_id: item._id.toString(),
          added_at: item.created_at,
          ...bookObj
        });
      }
    }

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

    const user = await User.findOne(buildIdFilter(req.user.id));
    const targetUserId = user?._id || (isValidObjectId(req.user.id) ? req.user.id : null);
    if (!targetUserId) {
      return res.status(400).json({ error: 'Invalid user account' });
    }

    const userFilter = buildIdFilter(targetUserId, 'user_id', 'sqlite_user_id');
    const existing = await Wishlist.findOne({
      ...userFilter,
      book_id: targetBook._id
    });

    if (existing) {
      return res.json({ message: 'Book is in your wishlist', isWishlisted: true });
    }

    await Wishlist.create({
      user_id: targetUserId,
      sqlite_user_id: user?.sqlite_id || (!isNaN(Number(req.user.id)) ? Number(req.user.id) : null),
      book_id: targetBook._id,
      sqlite_book_id: targetBook.sqlite_id || null,
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
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const targetBook = await Book.findOne(buildIdFilter(req.params.bookId));

    if (targetBook) {
      await Wishlist.deleteOne({
        ...userFilter,
        book_id: targetBook._id
      });
    } else {
      // Also attempt deletion by wishlist doc ID
      await Wishlist.deleteOne({
        ...userFilter,
        ...buildIdFilter(req.params.bookId)
      });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
