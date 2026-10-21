const express = require('express');
const db = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get current user's visit planner list with location & seat availability summary
router.get('/', authenticateToken, (req, res) => {
  try {
    const items = db.prepare(`
      SELECT vp.id as planner_id, vp.visited, vp.notes, vp.created_at as added_at,
             b.id as book_id, b.title, b.author, b.isbn, b.category, b.cover_image,
             b.floor, b.section, b.shelf, b.rack,
             b.total_copies, b.available_copies,
             (SELECT COUNT(*) FROM reservations r WHERE r.book_id = b.id AND r.status = 'waiting') as waitlist_count
      FROM visit_planner vp
      JOIN books b ON vp.book_id = b.id
      WHERE vp.user_id = ?
      ORDER BY b.floor ASC, b.section ASC, b.shelf ASC
    `).all(req.user.id);

    // Compute whether reservation is required for each book
    const enrichedItems = items.map(item => ({
      ...item,
      visited: Boolean(item.visited),
      requiresReservation: item.available_copies === 0,
      statusLabel: item.available_copies > 0
        ? `${item.available_copies} of ${item.total_copies} available on shelf`
        : `All copies on loan (${item.waitlist_count} waiting - reservation required)`
    }));

    // Group items by floor and section for practical navigation
    const groupedByFloorMap = {};
    for (const item of enrichedItems) {
      if (!groupedByFloorMap[item.floor]) {
        groupedByFloorMap[item.floor] = {};
      }
      if (!groupedByFloorMap[item.floor][item.section]) {
        groupedByFloorMap[item.floor][item.section] = [];
      }
      groupedByFloorMap[item.floor][item.section].push(item);
    }

    const groupedByFloorArray = Object.entries(groupedByFloorMap).map(([floor, sections]) => ({
      floor,
      sections: Object.entries(sections).map(([section, books]) => ({
        section,
        books
      }))
    }));

    // Check study-seat availability summary for the library
    const seatSummary = db.prepare(`
      SELECT floor,
             COUNT(*) as total_seats,
             SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_seats
      FROM seats
      GROUP BY floor
      ORDER BY floor ASC
    `).all();

    res.json({
      items: enrichedItems,
      totalCount: enrichedItems.length,
      visitedCount: enrichedItems.filter(i => i.visited).length,
      pendingCount: enrichedItems.filter(i => !i.visited).length,
      groupedByFloor: groupedByFloorArray,
      groupedByFloorMap,
      floorSeatsGlance: seatSummary,
      seatSummary
    });
  } catch (err) {
    console.error('Fetch visit planner error:', err);
    res.status(500).json({ error: 'Failed to retrieve visit planner items' });
  }
});

// Add book to visit planner
router.post('/:bookId', authenticateToken, (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const book = db.prepare('SELECT id, title, floor, shelf FROM books WHERE id = ?').get(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { notes = '' } = req.body;

    db.prepare(`
      INSERT INTO visit_planner (user_id, book_id, visited, notes)
      VALUES (?, ?, 0, ?)
      ON CONFLICT(user_id, book_id) DO UPDATE SET notes = excluded.notes
    `).run(req.user.id, bookId, notes);

    res.status(201).json({
      message: `"${book.title}" added to your Visit Planner (${book.floor}, ${book.shelf})`,
      bookId
    });
  } catch (err) {
    console.error('Add visit planner error:', err);
    res.status(500).json({ error: 'Failed to add item to visit planner' });
  }
});

// Toggle visited / found state
router.put('/:bookId/toggle', authenticateToken, (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const current = db.prepare('SELECT visited FROM visit_planner WHERE user_id = ? AND book_id = ?').get(req.user.id, bookId);

    if (!current) {
      return res.status(404).json({ error: 'Book is not in your visit planner' });
    }

    const newStatus = current.visited ? 0 : 1;
    db.prepare('UPDATE visit_planner SET visited = ? WHERE user_id = ? AND book_id = ?').run(newStatus, req.user.id, bookId);

    res.json({
      message: newStatus ? 'Marked as found / visited' : 'Marked as unvisited',
      visited: Boolean(newStatus)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle visit status' });
  }
});

// Remove single book from visit planner
router.delete('/:bookId', authenticateToken, (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    db.prepare('DELETE FROM visit_planner WHERE user_id = ? AND book_id = ?').run(req.user.id, bookId);
    res.json({ message: 'Removed from visit planner' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from visit planner' });
  }
});

// Clear entire visit planner
router.delete('/', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM visit_planner WHERE user_id = ?').run(req.user.id);
    res.json({ message: 'Visit planner cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear visit planner' });
  }
});

module.exports = router;
