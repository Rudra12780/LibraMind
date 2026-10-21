const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

// Public: Get catalog with search, filter, sort
router.get('/', (req, res) => {
  try {
    const {
      q = '',
      category = 'All',
      availability = 'all',
      sort = 'title_asc',
      limit = 50,
      offset = 0
    } = req.query;

    let query = `
      SELECT b.*,
        (SELECT COUNT(*) FROM loans l WHERE l.book_id = b.id) as total_borrowed_count
      FROM books b
      WHERE 1=1
    `;
    const params = [];

    // Search filter: title, author, isbn, description, category
    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      query += ` AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ? OR b.description LIKE ? OR b.category LIKE ?)`;
      params.push(term, term, term, term, term);
    }

    // Category filter
    if (category && category !== 'All') {
      query += ` AND b.category = ?`;
      params.push(category);
    }

    // Availability filter
    if (availability === 'available') {
      query += ` AND b.available_copies > 0`;
    } else if (availability === 'unavailable') {
      query += ` AND b.available_copies = 0`;
    }

    // Sorting
    switch (sort) {
      case 'title_desc':
        query += ` ORDER BY b.title DESC`;
        break;
      case 'year_desc':
        query += ` ORDER BY b.publication_year DESC`;
        break;
      case 'year_asc':
        query += ` ORDER BY b.publication_year ASC`;
        break;
      case 'popularity':
        query += ` ORDER BY total_borrowed_count DESC`;
        break;
      case 'title_asc':
      default:
        query += ` ORDER BY b.title ASC`;
        break;
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit) || 50, parseInt(offset) || 0);

    const books = db.prepare(query).all(...params).map(b => ({
      ...b,
      location_floor: b.floor,
      location_shelf: b.shelf,
      location_rack: b.rack,
      location_section: b.section
    }));

    // Get list of distinct categories for filter dropdown
    const categories = db.prepare('SELECT DISTINCT category FROM books ORDER BY category ASC').all().map(c => c.category);

    res.json({
      books,
      categories,
      count: books.length
    });
  } catch (err) {
    console.error('Fetch books error:', err);
    res.status(500).json({ error: 'Failed to retrieve book catalog' });
  }
});

// Public: Get single book details with physical copies and queue position
router.get('/:id', (req, res) => {
  try {
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const copies = db.prepare('SELECT * FROM book_copies WHERE book_id = ? ORDER BY copy_code ASC').all(req.params.id);
    const waitingCount = db.prepare("SELECT COUNT(*) as count FROM reservations WHERE book_id = ? AND status = 'waiting'").get(req.params.id);

    res.json({
      ...book,
      location_floor: book.floor,
      location_shelf: book.shelf,
      location_rack: book.rack,
      location_section: book.section,
      copies,
      waitingQueueCount: waitingCount ? waitingCount.count : 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve book details' });
  }
});

// Librarian / Admin: Add a new book
router.post('/', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const {
      title, author, isbn, publisher, publication_year,
      category, language = 'English', edition = '1st Edition',
      description = '', cover_image = '',
      floor = 'Floor 1', section = 'Main Hall', shelf = 'Shelf A-1', rack = 'Rack 01',
      total_copies = 1
    } = req.body;

    if (!title || !author || !isbn || !category) {
      return res.status(400).json({ error: 'Title, author, ISBN, and category are required' });
    }

    const copiesCount = Math.max(1, parseInt(total_copies) || 1);

    const transaction = db.transaction(() => {
      const stmt = db.prepare(`
        INSERT INTO books (
          title, author, isbn, publisher, publication_year,
          category, language, edition, description, cover_image,
          floor, section, shelf, rack, total_copies, available_copies
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        title.trim(), author.trim(), isbn.trim(), publisher ? publisher.trim() : '',
        parseInt(publication_year) || new Date().getFullYear(),
        category.trim(), language, edition, description, cover_image,
        floor, section, shelf, rack, copiesCount, copiesCount
      );

      const bookId = result.lastInsertRowid;

      // Create physical copy records
      const copyStmt = db.prepare(`
        INSERT INTO book_copies (book_id, copy_code, status, condition)
        VALUES (?, ?, 'available', 'New')
      `);

      for (let i = 1; i <= copiesCount; i++) {
        const copyCode = `LM-${category.substring(0, 2).toUpperCase()}-${bookId}-C${i}`;
        copyStmt.run(bookId, copyCode);
      }

      logAudit(req.user.id, 'BOOK_CREATED', `Created book: "${title}" (ISBN: ${isbn}) with ${copiesCount} copies.`);
      return bookId;
    });

    const newBookId = transaction();
    const createdBook = db.prepare('SELECT * FROM books WHERE id = ?').get(newBookId);

    res.status(201).json({
      message: 'Book created successfully',
      book: createdBook
    });
  } catch (err) {
    console.error('Create book error:', err);
    if (err.message && err.message.includes('UNIQUE constraint failed: books.isbn')) {
      return res.status(400).json({ error: 'A book with this ISBN already exists' });
    }
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Librarian / Admin: Update book details
router.put('/:id', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const {
      title, author, isbn, publisher, publication_year,
      category, language, edition, description, cover_image,
      floor, section, shelf, rack
    } = req.body;

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    db.prepare(`
      UPDATE books SET
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        isbn = COALESCE(?, isbn),
        publisher = COALESCE(?, publisher),
        publication_year = COALESCE(?, publication_year),
        category = COALESCE(?, category),
        language = COALESCE(?, language),
        edition = COALESCE(?, edition),
        description = COALESCE(?, description),
        cover_image = COALESCE(?, cover_image),
        floor = COALESCE(?, floor),
        section = COALESCE(?, section),
        shelf = COALESCE(?, shelf),
        rack = COALESCE(?, rack)
      WHERE id = ?
    `).run(
      title, author, isbn, publisher, publication_year,
      category, language, edition, description, cover_image,
      floor, section, shelf, rack, req.params.id
    );

    logAudit(req.user.id, 'BOOK_UPDATED', `Updated book ID ${req.params.id}: ${title || book.title}`);

    const updated = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    res.json({ message: 'Book updated successfully', book: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Librarian / Admin: Delete book (only if no active loans)
router.delete('/:id', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const activeLoans = db.prepare("SELECT COUNT(*) as count FROM loans WHERE book_id = ? AND status = 'active'").get(req.params.id);
    if (activeLoans.count > 0) {
      return res.status(400).json({ error: 'Cannot delete book with active loans. Please return all borrowed copies first.' });
    }

    const book = db.prepare('SELECT title FROM books WHERE id = ?').get(req.params.id);
    db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);

    logAudit(req.user.id, 'BOOK_DELETED', `Deleted book ID ${req.params.id} (${book ? book.title : ''})`);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Add physical copy to existing book
router.post('/:id/copies', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const bookId = req.params.id;
    const { condition = 'New' } = req.body;

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const existingCopies = db.prepare('SELECT COUNT(*) as count FROM book_copies WHERE book_id = ?').get(bookId);
    const nextNum = existingCopies.count + 1;
    const copyCode = `LM-${book.category.substring(0, 2).toUpperCase()}-${bookId}-C${nextNum}`;

    const transaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO book_copies (book_id, copy_code, status, condition)
        VALUES (?, ?, 'available', ?)
      `).run(bookId, copyCode, condition);

      db.prepare(`
        UPDATE books SET
          total_copies = total_copies + 1,
          available_copies = available_copies + 1
        WHERE id = ?
      `).run(bookId);
    });

    transaction();
    logAudit(req.user.id, 'COPY_ADDED', `Added copy ${copyCode} for book: ${book.title}`);

    res.status(201).json({ message: 'Physical copy added successfully', copyCode });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add physical copy' });
  }
});

// Update physical copy status/condition
router.put('/copies/:copyId', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const { copyId } = req.params;
    const { status, condition } = req.body;

    const copy = db.prepare('SELECT * FROM book_copies WHERE id = ?').get(copyId);
    if (!copy) {
      return res.status(404).json({ error: 'Copy not found' });
    }

    // Check if status changed
    const transaction = db.transaction(() => {
      if (status && status !== copy.status) {
        if (copy.status === 'available' && status !== 'available') {
          db.prepare('UPDATE books SET available_copies = MAX(0, available_copies - 1) WHERE id = ?').run(copy.book_id);
        } else if (copy.status !== 'available' && status === 'available') {
          db.prepare('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?').run(copy.book_id);
        }
      }

      db.prepare(`
        UPDATE book_copies SET
          status = COALESCE(?, status),
          condition = COALESCE(?, condition)
        WHERE id = ?
      `).run(status, condition, copyId);
    });

    transaction();
    res.json({ message: 'Physical copy updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update copy' });
  }
});

module.exports = router;
