const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Book = require('../models/Book');
const BookCopy = require('../models/BookCopy');
const Loan = require('../models/Loan');
const Reservation = require('../models/Reservation');
const Wishlist = require('../models/Wishlist');
const VisitPlanner = require('../models/VisitPlanner');
const User = require('../models/User');
const Notification = require('../models/Notification');

const { JWT_SECRET, authenticateToken, requireRole, logAudit } = require('../middleware/auth');
const { buildIdFilter, serializeDoc, serializeDocs } = require('../utils/idHelper');

let sqliteDb = null;
try {
  sqliteDb = require('../db/database');
} catch (e) {
  console.warn('SQLite fallback unavailable in books route:', e.message);
}

let bookCoversMap = {};
try {
  bookCoversMap = require('../book_covers_map.json');
} catch (_) {}

function getVerifiedCover(b) {
  if (!b) return '';
  if (b.cover_image && typeof b.cover_image === 'string' && b.cover_image.startsWith('/uploads/')) return b.cover_image;
  const bId = b.id !== undefined ? b.id : b.sqlite_id;
  const mapped = bId ? bookCoversMap[String(bId)] : null;
  if (mapped) return mapped;
  return b.cover_image || '';
}

const router = express.Router();

function queryBooksFromSqlite({ q = '', category = 'All', availability = 'all', sort = 'title_asc', limit = 200, offset = 0 } = {}) {
  if (!sqliteDb) return null;
  try {
    let sql = 'SELECT * FROM books WHERE 1=1';
    const params = [];
    if (q && q.trim()) {
      sql += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ? OR description LIKE ? OR category LIKE ?)';
      const term = `%${q.trim()}%`;
      params.push(term, term, term, term, term);
    }
    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (availability === 'available') {
      sql += ' AND available_copies > 0';
    } else if (availability === 'unavailable') {
      sql += ' AND available_copies = 0';
    }
    if (sort === 'title_desc') sql += ' ORDER BY title DESC';
    else if (sort === 'year_desc') sql += ' ORDER BY publication_year DESC';
    else if (sort === 'year_asc') sql += ' ORDER BY publication_year ASC';
    else sql += ' ORDER BY title ASC';

    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit) || 250, parseInt(offset) || 0);

    const books = sqliteDb.prepare(sql).all(...params);
    const categories = sqliteDb.prepare('SELECT DISTINCT category FROM books ORDER BY category ASC').all().map(c => c.category);
    return {
      books: books.map(b => ({
        ...b,
        _id: b.id,
        cover_image: getVerifiedCover(b),
        location_floor: b.floor || 'Floor 1',
        location_shelf: b.shelf || 'Shelf A-1',
        location_rack: b.rack || 'Rack 01',
        location_section: b.section || 'Main Hall'
      })),
      categories,
      count: books.length
    };
  } catch (err) {
    console.error('Error executing queryBooksFromSqlite:', err);
    return null;
  }
}

// Helper to save uploaded device images locally for 100% offline access
function saveBase64ImageLocally(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return dataUrl;
  if (!dataUrl.startsWith('data:image/')) return dataUrl;

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return dataUrl;

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    const filename = `book_${Date.now()}_${randomSuffix}.${ext}`;
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    // Also mirror to frontend/public/uploads for instant client dev availability
    const frontendUploadsDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads');
    if (fs.existsSync(frontendUploadsDir)) {
      try {
        fs.writeFileSync(path.join(frontendUploadsDir, filename), buffer);
      } catch (_) {}
    }
    return `/uploads/${filename}`;
  } catch (e) {
    console.error('Failed to save base64 image locally, preserving dataUrl:', e);
    return dataUrl;
  }
}

// High-performance Category In-Memory Cache
let cachedCategories = null;
let cachedCategoriesTime = 0;
const catalogResponseCache = new Map();
const CACHE_TTL_MS = 25 * 1000; // 25-second server cache for snappy response times

async function getCachedCategories() {
  const now = Date.now();
  if (cachedCategories && (now - cachedCategoriesTime < 5 * 60 * 1000)) {
    return cachedCategories;
  }
  let cats = [];
  try {
    if (mongoose.connection.readyState === 1) {
      cats = await Book.distinct('category');
    }
  } catch (e) {}
  if ((!cats || cats.length === 0) && sqliteDb) {
    try {
      cats = sqliteDb.prepare('SELECT DISTINCT category FROM books ORDER BY category ASC').all().map(c => c.category);
    } catch (_) {}
  }
  cats.sort((a, b) => a.localeCompare(b));
  cachedCategories = cats;
  cachedCategoriesTime = now;
  return cats;
}
function invalidateCategoriesCache() {
  cachedCategories = null;
  cachedCategoriesTime = 0;
  catalogResponseCache.clear();
}

// Public: Get catalog with search, filter, sort, pagination
router.get('/', async (req, res) => {
  try {
    const {
      q = '',
      category = 'All',
      availability = 'all',
      sort = 'title_asc',
      limit = 200,
      offset = 0
    } = req.query;

    const cacheKey = `${q}_${category}_${availability}_${sort}_${limit}_${offset}`;
    if (availability !== 'my_loans') {
      const cached = catalogResponseCache.get(cacheKey);
      if (cached && (Date.now() - cached.time < CACHE_TTL_MS)) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached.data);
      }
    }

    if (mongoose.connection.readyState !== 1) {
      const sqliteResult = queryBooksFromSqlite(req.query);
      if (sqliteResult) return res.json(sqliteResult);
    }

    const query = {};

    // Search filter: title, author, isbn, description, category
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: regex },
        { author: regex },
        { isbn: regex },
        { description: regex },
        { category: regex }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Optional user token extraction for availability filter
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let tokenUserId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) tokenUserId = decoded.id;
      } catch (e) {}
    }

    if (availability === 'available') {
      query.available_copies = { $gt: 0 };
    } else if (availability === 'unavailable') {
      query.available_copies = 0;
    } else if (availability === 'borrowed' || availability === 'on_loan') {
      query.$expr = { $lt: ['$available_copies', '$total_copies'] };
    } else if (availability === 'my_loans') {
      const targetUserId = tokenUserId || req.query.userId;
      if (targetUserId) {
        const uFilter = buildIdFilter(targetUserId, 'user_id', 'sqlite_user_id');
        const activeLoans = await Loan.find({
          ...uFilter,
          status: { $in: ['active', 'borrowed', 'overdue'] }
        }).distinct('book_id');
        query._id = { $in: activeLoans };
      }
    }

    // Sorting
    let sortObj = { title: 1 };
    switch (sort) {
      case 'title_desc':
        sortObj = { title: -1 };
        break;
      case 'year_desc':
        sortObj = { publication_year: -1 };
        break;
      case 'year_asc':
        sortObj = { publication_year: 1 };
        break;
      case 'title_asc':
      default:
        sortObj = { title: 1 };
        break;
    }

    // High-performance lean query
    const books = await Book.find(query)
      .sort(sortObj)
      .skip(parseInt(offset) || 0)
      .limit(parseInt(limit) || 200)
      .lean();

    // High-performance single batch query for available copy codes (1 query instead of 50 individual queries)
    const bookIds = books.map(b => b._id);
    const sqliteIds = books.map(b => b.sqlite_id).filter(id => id !== undefined && id !== null);

    const copyFilterOr = [{ book_id: { $in: bookIds } }];
    if (sqliteIds.length) {
      copyFilterOr.push({ sqlite_book_id: { $in: sqliteIds } });
    }

    const availableCopies = bookIds.length > 0 ? await BookCopy.find({
      $or: copyFilterOr,
      status: 'available'
    }).select('book_id sqlite_book_id copy_code').lean() : [];

    const copyMap = new Map();
    for (const c of availableCopies) {
      if (c.book_id && !copyMap.has(String(c.book_id))) {
        copyMap.set(String(c.book_id), c.copy_code);
      }
      if (c.sqlite_book_id && !copyMap.has(String(c.sqlite_book_id))) {
        copyMap.set(String(c.sqlite_book_id), c.copy_code);
      }
    }

    const enrichedBooks = books.map(b => {
      const bObj = serializeDoc(b);
      const sampleCopy = copyMap.get(String(b._id)) || (b.sqlite_id ? copyMap.get(String(b.sqlite_id)) : null);
      return {
        ...bObj,
        cover_image: getVerifiedCover(b),
        location_floor: b.floor || 'Floor 1',
        location_shelf: b.shelf || 'Shelf A-1',
        location_rack: b.rack || 'Rack 01',
        location_section: b.section || 'Main Hall',
        sample_copy_code: sampleCopy || null
      };
    });

    const categories = await getCachedCategories();

    if (availability !== 'my_loans') {
      res.setHeader('Cache-Control', 'public, max-age=10, stale-while-revalidate=60');
    }

    const responseData = {
      books: enrichedBooks,
      categories,
      count: enrichedBooks.length
    };

    if (availability !== 'my_loans') {
      catalogResponseCache.set(cacheKey, { time: Date.now(), data: responseData });
    }

    res.json(responseData);
  } catch (err) {
    console.error('Fetch books error:', err);
    const sqliteFallback = queryBooksFromSqlite(req.query);
    if (sqliteFallback) {
      return res.json(sqliteFallback);
    }
    res.status(500).json({ error: 'Failed to retrieve book catalog' });
  }
});

// Public / Contextual: Get single book details
router.get('/:id', async (req, res) => {
  try {
    let book = null;
    if (mongoose.connection.readyState === 1) {
      book = await Book.findOne(buildIdFilter(req.params.id)).lean();
    }
    if (!book && sqliteDb) {
      const sqliteBook = sqliteDb.prepare('SELECT * FROM books WHERE id = ? OR isbn = ?').get(req.params.id, req.params.id);
      if (sqliteBook) {
        const copies = sqliteDb.prepare('SELECT * FROM book_copies WHERE book_id = ? ORDER BY copy_code ASC').all(sqliteBook.id);
        const waitingQueueCount = sqliteDb.prepare("SELECT count(*) as c FROM reservations WHERE book_id = ? AND status = 'waiting'").get(sqliteBook.id)?.c || 0;
        return res.json({
          ...sqliteBook,
          _id: sqliteBook.id,
          location_floor: sqliteBook.floor || 'Floor 1',
          location_shelf: sqliteBook.shelf || 'Shelf A-1',
          location_rack: sqliteBook.rack || 'Rack 01',
          location_section: sqliteBook.section || 'Main Hall',
          book: {
            ...sqliteBook,
            _id: sqliteBook.id,
            location_floor: sqliteBook.floor || 'Floor 1',
            location_shelf: sqliteBook.shelf || 'Shelf A-1',
            location_rack: sqliteBook.rack || 'Rack 01',
            location_section: sqliteBook.section || 'Main Hall',
            copies
          },
          copies,
          waitingQueueCount,
          isWishlisted: false,
          activeLoan: null,
          userActiveReservation: null
        });
      }
    }
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bFilter = buildIdFilter(book._id, 'book_id', 'sqlite_book_id');
    const [copies, waitingQueueCount] = await Promise.all([
      BookCopy.find(bFilter).sort({ copy_code: 1 }).lean(),
      Reservation.countDocuments({ ...bFilter, status: 'waiting' })
    ]);

    let userLoan = null;
    let userReservation = null;
    let inVisitPlanner = false;
    let inWishlist = false;

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) {
          const uFilter = buildIdFilter(decoded.id, 'user_id', 'sqlite_user_id');
          const [uLoan, uRes, vp, wl] = await Promise.all([
            Loan.findOne({ ...bFilter, ...uFilter, status: { $in: ['active', 'borrowed', 'overdue'] } }).lean(),
            Reservation.findOne({ ...bFilter, ...uFilter, status: { $in: ['waiting', 'ready_for_pickup'] } }).lean(),
            VisitPlanner.findOne({ ...bFilter, ...uFilter }).lean(),
            Wishlist.findOne({ ...bFilter, ...uFilter }).lean()
          ]);
          userLoan = uLoan;
          userReservation = uRes;
          inVisitPlanner = Boolean(vp);
          inWishlist = Boolean(wl);
        }
      } catch (e) {}
    }

    const bObj = serializeDoc(book);
    res.json({
      ...bObj,
      location_floor: book.floor || 'Floor 1',
      location_shelf: book.shelf || 'Shelf A-1',
      location_rack: book.rack || 'Rack 01',
      location_section: book.section || 'Main Hall',
      copies: serializeDocs(copies),
      waitingQueueCount,
      userLoan: serializeDoc(userLoan),
      userReservation: serializeDoc(userReservation),
      inVisitPlanner,
      inWishlist
    });
  } catch (err) {
    console.error('Fetch single book error:', err);
    res.status(500).json({ error: 'Failed to retrieve book details' });
  }
});

// Librarian / Admin: Add a new book
router.post('/', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
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

    const cleanIsbn = isbn.trim();
    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();

    const existing = await Book.findOne({
      $or: [
        { isbn: cleanIsbn },
        { title: new RegExp(`^${cleanTitle}$`, 'i'), author: new RegExp(`^${cleanAuthor}$`, 'i') }
      ]
    });

    if (existing) {
      return res.status(409).json({
        error: `This book already exists in catalog: "${existing.title}" by ${existing.author} (ISBN: ${existing.isbn}). Please use "Add Copies" to increase available stock instead of creating a duplicate.`,
        existingBook: serializeDoc(existing)
      });
    }

    const localCoverImage = saveBase64ImageLocally(cover_image);
    const copiesCount = Math.max(1, parseInt(total_copies) || 1);

    const newBook = await Book.create({
      title: cleanTitle,
      author: cleanAuthor,
      isbn: cleanIsbn,
      publisher: publisher ? publisher.trim() : '',
      publication_year: parseInt(publication_year) || new Date().getFullYear(),
      category: category.trim(),
      language,
      edition,
      description,
      cover_image: localCoverImage,
      floor,
      section,
      shelf,
      rack,
      total_copies: copiesCount,
      available_copies: copiesCount,
      created_at: new Date()
    });

    // Create physical copies
    const copyDocs = [];
    for (let i = 1; i <= copiesCount; i++) {
      const copyCode = `LM-${category.substring(0, 2).toUpperCase()}-${newBook._id.toString().slice(-4).toUpperCase()}-C${i}`;
      copyDocs.push({
        book_id: newBook._id,
        copy_code: copyCode,
        status: 'available',
        condition: 'New',
        created_at: new Date()
      });
    }
    await BookCopy.insertMany(copyDocs);

    logAudit(req.user.id, 'BOOK_CREATED', `Created book: "${cleanTitle}" (ISBN: ${cleanIsbn}) with ${copiesCount} copies.`);
    invalidateCategoriesCache();

    res.status(201).json({
      message: 'Book created successfully',
      book: serializeDoc(newBook)
    });
  } catch (err) {
    console.error('Create book error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A book with this ISBN already exists' });
    }
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Librarian / Admin: Update book details
router.put('/:id', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const book = await Book.findOne(buildIdFilter(req.params.id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const {
      title, author, isbn, publisher, publication_year,
      category, language, edition, description, cover_image,
      floor, section, shelf, rack
    } = req.body;

    const localCoverImage = cover_image !== undefined ? saveBase64ImageLocally(cover_image) : undefined;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (isbn !== undefined) book.isbn = isbn;
    if (publisher !== undefined) book.publisher = publisher;
    if (publication_year !== undefined) book.publication_year = publication_year;
    if (category !== undefined) book.category = category;
    if (language !== undefined) book.language = language;
    if (edition !== undefined) book.edition = edition;
    if (description !== undefined) book.description = description;
    if (localCoverImage !== undefined) book.cover_image = localCoverImage;
    if (floor !== undefined) book.floor = floor;
    if (section !== undefined) book.section = section;
    if (shelf !== undefined) book.shelf = shelf;
    if (rack !== undefined) book.rack = rack;

    await book.save();
    logAudit(req.user.id, 'BOOK_UPDATED', `Updated book ID ${book._id}: "${book.title}"`);

    invalidateCategoriesCache();
    res.json({ message: 'Book updated successfully', book: serializeDoc(book) });
  } catch (err) {
    console.error('Failed to update book:', err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Librarian / Admin: Delete book (only if no active loans)
router.delete('/:id', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const book = await Book.findOne(buildIdFilter(req.params.id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bFilter = buildIdFilter(book._id, 'book_id', 'sqlite_book_id');
    const activeLoansCount = await Loan.countDocuments({
      ...bFilter,
      status: 'active'
    });

    if (activeLoansCount > 0) {
      return res.status(400).json({ error: 'Cannot delete book with active loans. Please return all borrowed copies first.' });
    }

    await BookCopy.deleteMany(bFilter);
    await Reservation.deleteMany(bFilter);
    await Wishlist.deleteMany(bFilter);
    await VisitPlanner.deleteMany(bFilter);
    await Book.deleteOne({ _id: book._id });

    logAudit(req.user.id, 'BOOK_DELETED', `Deleted book: "${book.title}" (ID: ${book._id})`);
    invalidateCategoriesCache();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Failed to delete book:', err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Add physical copies to existing book
router.post('/:id/copies', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const book = await Book.findOne(buildIdFilter(req.params.id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { condition = 'New', count = 1 } = req.body;
    const copiesToAdd = Math.max(1, parseInt(count) || 1);

    const bFilter = buildIdFilter(book._id, 'book_id', 'sqlite_book_id');
    const currentCount = await BookCopy.countDocuments(bFilter);

    const copyDocs = [];
    const addedCopyCodes = [];

    for (let i = 1; i <= copiesToAdd; i++) {
      const copyNum = currentCount + i;
      const copyCode = `LM-${book.category.substring(0, 2).toUpperCase()}-${book._id.toString().slice(-4).toUpperCase()}-C${copyNum}`;
      addedCopyCodes.push(copyCode);
      copyDocs.push({
        book_id: book._id,
        copy_code: copyCode,
        status: 'available',
        condition,
        created_at: new Date()
      });
    }

    await BookCopy.insertMany(copyDocs);
    book.total_copies += copiesToAdd;
    book.available_copies += copiesToAdd;
    await book.save();

    // Check waiting list for this book and notify librarians (Requirement 5)
    try {
      const activeWaiting = await Reservation.find({
        ...bFilter,
        status: 'waiting'
      }).populate('user_id').sort({ queue_position: 1, reservation_date: 1 });

      if (activeWaiting.length > 0) {
        const librarians = await User.find({ role: { $in: ['librarian', 'admin'] } });
        const nextPatronName = activeWaiting[0].user_id?.name || 'Patron in Queue #1';
        for (const lib of librarians) {
          await Notification.create({
            user_id: lib._id,
            title: '💡 Inventory Suggestion: Waiting Patrons Eligible for Copies',
            message: `Physical copies for "${book.title}" increased (+${copiesToAdd} newly added, ${book.available_copies} available). There are ${activeWaiting.length} patron(s) in the waiting queue. Next eligible patron: ${nextPatronName}. Review and approve waiting-list allocations in Circulation.`,
            type: 'info',
            link: '/librarian?tab=reservations',
            created_at: new Date()
          });
        }
      }
    } catch (suggErr) {
      console.error('Failed to dispatch librarian copy increase suggestion:', suggErr);
    }

    logAudit(req.user.id, 'COPY_ADDED', `Added ${copiesToAdd} copies for book: "${book.title}" (${addedCopyCodes.join(', ')})`);

    res.status(201).json({
      message: `Successfully added ${copiesToAdd} physical cop${copiesToAdd > 1 ? 'ies' : 'y'} to "${book.title}"!`,
      addedCount: copiesToAdd,
      copyCodes: addedCopyCodes,
      book: serializeDoc(book)
    });
  } catch (err) {
    console.error('Failed to add copies:', err);
    res.status(500).json({ error: 'Failed to add physical copy' });
  }
});

// Update physical copy status/condition
router.put('/copies/:copyId', authenticateToken, requireRole(['admin', 'librarian']), async (req, res) => {
  try {
    const copy = await BookCopy.findOne(buildIdFilter(req.params.copyId));
    if (!copy) {
      return res.status(404).json({ error: 'Copy not found' });
    }

    const { status, condition } = req.body;

    if (status && status !== copy.status) {
      if (copy.status === 'available' && status !== 'available') {
        await Book.updateOne({ _id: copy.book_id }, { $inc: { available_copies: -1 } });
      } else if (copy.status !== 'available' && status === 'available') {
        await Book.updateOne({ _id: copy.book_id }, { $inc: { available_copies: 1 } });
      }
      copy.status = status;
    }

    if (condition) {
      copy.condition = condition;
    }

    await copy.save();
    res.json({ message: 'Physical copy updated successfully' });
  } catch (err) {
    console.error('Failed to update copy:', err);
    res.status(500).json({ error: 'Failed to update copy' });
  }
});

module.exports = router;
