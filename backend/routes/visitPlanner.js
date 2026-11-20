const express = require('express');
const VisitPlanner = require('../models/VisitPlanner');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');
const { authenticateToken } = require('../middleware/auth');
const { buildIdFilter, serializeDoc } = require('../utils/idHelper');

const router = express.Router();

// Get current user's visit planner list with location & seat availability summary
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const items = await VisitPlanner.find(userFilter)
      .populate('book_id')
      .sort({ created_at: -1 });

    const enrichedItems = await Promise.all(
      items
        .filter(item => Boolean(item.book_id))
        .map(async (item) => {
          const b = item.book_id;
          const bFilter = buildIdFilter(b._id, 'book_id', 'sqlite_book_id');
          const waitlistCount = await Reservation.countDocuments({
            ...bFilter,
            status: 'waiting'
          });

          return {
            planner_id: item._id.toString(),
            visited: Boolean(item.visited),
            notes: item.notes || '',
            added_at: item.created_at,
            book_id: b._id.toString(),
            title: b.title,
            author: b.author,
            isbn: b.isbn,
            category: b.category,
            cover_image: b.cover_image,
            floor: b.floor || 'Floor 1',
            section: b.section || 'Main Hall',
            shelf: b.shelf || 'Shelf A-1',
            rack: b.rack || 'Rack 01',
            total_copies: b.total_copies,
            available_copies: b.available_copies,
            waitlist_count: waitlistCount,
            requiresReservation: b.available_copies === 0,
            statusLabel: b.available_copies > 0
              ? `${b.available_copies} of ${b.total_copies} available on shelf`
              : `All copies on loan (${waitlistCount} waiting - reservation required)`
          };
        })
    );

    // Sort by floor, section, shelf
    enrichedItems.sort((a, b) => {
      if (a.floor !== b.floor) return a.floor.localeCompare(b.floor);
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      return a.shelf.localeCompare(b.shelf);
    });

    // Group items by floor and section
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

    // Study seats summary by floor
    const seatSummary = await Seat.aggregate([
      {
        $group: {
          _id: '$floor',
          total_seats: { $sum: 1 },
          available_seats: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          floor: '$_id',
          total_seats: 1,
          available_seats: 1
        }
      },
      { $sort: { floor: 1 } }
    ]);

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
router.post('/:bookId', authenticateToken, async (req, res) => {
  try {
    const targetBook = await Book.findOne(buildIdFilter(req.params.bookId));
    if (!targetBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { notes = '' } = req.body;
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    let plannerItem = await VisitPlanner.findOne({
      ...userFilter,
      book_id: targetBook._id
    });

    if (plannerItem) {
      plannerItem.notes = notes;
      await plannerItem.save();
    } else {
      await VisitPlanner.create({
        user_id: req.user.id,
        book_id: targetBook._id,
        visited: 0,
        notes,
        created_at: new Date()
      });
    }

    res.status(201).json({
      message: `"${targetBook.title}" added to your Visit Planner (${targetBook.floor}, ${targetBook.shelf})`,
      bookId: targetBook._id.toString()
    });
  } catch (err) {
    console.error('Add visit planner error:', err);
    res.status(500).json({ error: 'Failed to add item to visit planner' });
  }
});

// Toggle visited state
router.put('/:bookId/toggle', authenticateToken, async (req, res) => {
  try {
    const targetBook = await Book.findOne(buildIdFilter(req.params.bookId));
    if (!targetBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const plannerItem = await VisitPlanner.findOne({
      ...userFilter,
      book_id: targetBook._id
    });

    if (!plannerItem) {
      return res.status(404).json({ error: 'Book is not in your visit planner' });
    }

    plannerItem.visited = plannerItem.visited ? 0 : 1;
    await plannerItem.save();

    res.json({
      message: plannerItem.visited ? 'Marked as found / visited' : 'Marked as unvisited',
      visited: Boolean(plannerItem.visited)
    });
  } catch (err) {
    console.error('Toggle visit planner error:', err);
    res.status(500).json({ error: 'Failed to toggle visit status' });
  }
});

// Remove single book from visit planner
router.delete('/:bookId', authenticateToken, async (req, res) => {
  try {
    const targetBook = await Book.findOne(buildIdFilter(req.params.bookId));
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    if (targetBook) {
      await VisitPlanner.deleteOne({
        ...userFilter,
        book_id: targetBook._id
      });
    }

    res.json({ message: 'Removed from visit planner' });
  } catch (err) {
    console.error('Remove visit planner error:', err);
    res.status(500).json({ error: 'Failed to remove from visit planner' });
  }
});

// Clear entire visit planner
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    await VisitPlanner.deleteMany(userFilter);
    res.json({ message: 'Visit planner cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear visit planner' });
  }
});

module.exports = router;
