const express = require('express');
const mongoose = require('mongoose');

const Book = require('../models/Book');
const User = require('../models/User');
const Loan = require('../models/Loan');
const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');
const Wishlist = require('../models/Wishlist');

const { authenticateToken } = require('../middleware/auth');
const { buildIdFilter, serializeDoc, serializeDocs } = require('../utils/idHelper');

let sqliteDb = null;
try {
  sqliteDb = require('../db/database');
} catch (e) {
  console.warn('SQLite database connection failed in ai router:', e.message);
}

const router = express.Router();

// Common stopwords for NLP
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here',
  'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours',
  'book', 'books', 'want', 'need', 'find', 'learn', 'learning', 'read', 'suggest', 'looking', 'please'
]);

// Helper: Tokenize and clean text
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word));
}

// Helper: TF-IDF & Cosine Similarity Engine
function buildTfIdfIndex(books) {
  const docTermFreqs = [];
  const docFrequencies = {};
  const N = books.length;

  books.forEach((b) => {
    const titleTokens = tokenize(b.title);
    const catTokens = tokenize(b.category);
    const authorTokens = tokenize(b.author);
    const descTokens = tokenize(b.description);

    const weightedTokens = [
      ...titleTokens, ...titleTokens, ...titleTokens,
      ...catTokens, ...catTokens,
      ...authorTokens, ...authorTokens,
      ...descTokens
    ];

    const tf = {};
    for (const token of weightedTokens) {
      tf[token] = (tf[token] || 0) + 1;
    }
    docTermFreqs.push(tf);

    const uniqueTokens = new Set(weightedTokens);
    for (const token of uniqueTokens) {
      docFrequencies[token] = (docFrequencies[token] || 0) + 1;
    }
  });

  const idf = {};
  for (const token in docFrequencies) {
    idf[token] = Math.log((N + 1) / (docFrequencies[token] + 1)) + 1;
  }

  const docVectors = docTermFreqs.map(tf => {
    const vector = {};
    let magnitudeSq = 0;
    for (const token in tf) {
      const weight = tf[token] * (idf[token] || 1);
      vector[token] = weight;
      magnitudeSq += weight * weight;
    }
    return {
      vector,
      magnitude: Math.sqrt(magnitudeSq) || 1
    };
  });

  return { idf, docVectors };
}

// 1. Natural Language AI Book Finder / Topic Search Handler
async function handleAiSearch(req, res) {
  try {
    const {
      query,
      category = 'All',
      language = 'All',
      yearMin = null,
      yearMax = null,
      availability = 'all'
    } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const books = await Book.find({});
    if (books.length === 0) {
      return res.json({ results: [], suggestions: [], query });
    }

    let candidateBooks = books.map(b => serializeDoc(b));

    if (category && category !== 'All') {
      candidateBooks = candidateBooks.filter(b => b.category?.toLowerCase() === category.toLowerCase());
    }
    if (language && language !== 'All') {
      candidateBooks = candidateBooks.filter(b => b.language?.toLowerCase() === language.toLowerCase());
    }
    if (yearMin) {
      candidateBooks = candidateBooks.filter(b => b.publication_year >= parseInt(yearMin));
    }
    if (yearMax) {
      candidateBooks = candidateBooks.filter(b => b.publication_year <= parseInt(yearMax));
    }
    if (availability === 'available') {
      candidateBooks = candidateBooks.filter(b => b.available_copies > 0);
    } else if (availability === 'unavailable') {
      candidateBooks = candidateBooks.filter(b => b.available_copies === 0);
    }

    const { idf, docVectors } = buildTfIdfIndex(candidateBooks);
    const queryTokens = tokenize(query);
    const rawCleanQuery = query.toLowerCase().trim();

    if (queryTokens.length === 0 && !rawCleanQuery.match(/^[0-9-]+$/)) {
      const topBooks = await Book.find({}).sort({ available_copies: -1 }).limit(4);
      const suggestions = topBooks.map(b => ({
        ...serializeDoc(b),
        location_floor: b.floor || 'Floor 1',
        location_shelf: b.shelf || 'Shelf A-1',
        location_rack: b.rack || 'Rack 01',
        location_section: b.section || 'Main Hall'
      }));
      return res.json({
        results: [],
        suggestions,
        extractedKeywords: [],
        message: 'No searchable keywords found. Try terms like "Python programming", "deep learning", or "biophilic design".'
      });
    }

    const queryTf = {};
    for (const t of queryTokens) {
      queryTf[t] = (queryTf[t] || 0) + 1;
    }

    const queryVector = {};
    let queryMagSq = 0;
    for (const t in queryTf) {
      const weight = queryTf[t] * (idf[t] || 1);
      queryVector[t] = weight;
      queryMagSq += weight * weight;
    }
    const queryMagnitude = Math.sqrt(queryMagSq) || 1;

    const scored = candidateBooks.map((book, idx) => {
      const doc = docVectors[idx];
      let dotProduct = 0;
      for (const t in queryVector) {
        if (doc.vector[t]) {
          dotProduct += queryVector[t] * doc.vector[t];
        }
      }

      let similarity = dotProduct / (queryMagnitude * doc.magnitude);

      const titleLower = book.title?.toLowerCase() || '';
      const isbnClean = (book.isbn || '').replace(/[^0-9]/g, '');
      const rawNumQuery = rawCleanQuery.replace(/[^0-9]/g, '');

      if (rawNumQuery.length >= 4 && isbnClean.includes(rawNumQuery)) {
        similarity += 0.85;
      }
      if (titleLower === rawCleanQuery) {
        similarity += 0.95;
      } else if (titleLower.includes(rawCleanQuery)) {
        similarity += 0.45;
      }

      return {
        ...book,
        similarityScore: parseFloat(similarity.toFixed(4)),
        location_floor: book.floor || 'Floor 1',
        location_shelf: book.shelf || 'Shelf A-1',
        location_rack: book.rack || 'Rack 01',
        location_section: book.section || 'Main Hall'
      };
    });

    const results = scored
      .filter(b => b.similarityScore > 0.02)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 15);

    res.json({
      query,
      extractedKeywords: queryTokens,
      count: results.length,
      results
    });
  } catch (err) {
    console.error('AI Search error:', err);
    res.status(500).json({ error: 'Failed to process AI search' });
  }
}

router.post('/finder', handleAiSearch);
router.post('/search', handleAiSearch);

// 2. Personalized Book Recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 && sqliteDb) {
      let sUser = sqliteDb.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(req.user.id, String(req.user.email || '').toLowerCase());
      const sUserId = sUser?.id || req.user.id;
      const sBooks = sqliteDb.prepare('SELECT * FROM books').all();
      const pastLoans = sqliteDb.prepare('SELECT l.*, b.category FROM loans l LEFT JOIN books b ON l.book_id = b.id WHERE l.user_id = ?').all(sUserId);
      const borrowedBookIds = new Set(pastLoans.map(p => String(p.book_id)));

      let wishlistIds = new Set();
      try {
        const wishRows = sqliteDb.prepare('SELECT book_id FROM wishlists WHERE user_id = ?').all(sUserId);
        wishlistIds = new Set(wishRows.map(w => String(w.book_id)));
      } catch (_) {}

      const rawInterests = (sUser?.interests || '').trim();
      // If user has not selected any topics/interests: show nothing (0 books)
      if (!rawInterests) {
        return res.json({
          recommendations: [],
          hasBorrowingHistory: pastLoans.length > 0,
          userInterests: ''
        });
      }

      // Parse user's selected topics (comma-separated or words)
      const userSelectedTopics = rawInterests
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      const interestTokens = rawInterests
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 2 && !STOPWORDS.has(w));

      const scored = sBooks.map(book => {
        let score = 0;
        let reason = '';
        const bookCat = (book.category || '').trim().toLowerCase();
        const bookTitle = (book.title || '').trim().toLowerCase();

        let matchedTopic = null;
        for (const topic of userSelectedTopics) {
          if (bookCat === topic || bookCat.includes(topic) || topic.includes(bookCat)) {
            matchedTopic = book.category;
            score += 50;
            break;
          }
        }

        const bookTokens = new Set([
          ...tokenize(book.title),
          ...tokenize(book.category),
          ...tokenize(book.description)
        ]);

        let tokenMatches = 0;
        for (const pt of interestTokens) {
          if (bookTokens.has(pt) || bookCat.includes(pt) || bookTitle.includes(pt)) {
            tokenMatches++;
          }
        }

        if (tokenMatches > 0) {
          score += tokenMatches * 15;
          if (!matchedTopic) matchedTopic = book.category;
        }

        if (score > 0 && wishlistIds.has(String(book.id))) {
          score += 20;
        }

        if (score > 0) {
          reason = `Matches your selected topic in ${matchedTopic || book.category}`;
        }

        return {
          ...book,
          id: String(book.id),
          _id: String(book.id),
          recScore: score,
          recommendationReason: reason
        };
      });

      // Strictly return only books matching the selected topics (recScore > 0)
      const recommendations = scored
        .filter(b => !borrowedBookIds.has(String(b.id)) && b.recScore > 0)
        .sort((a, b) => b.recScore - a.recScore)
        .slice(0, 16);

      return res.json({
        recommendations,
        hasBorrowingHistory: pastLoans.length > 0,
        userInterests: rawInterests
      });
    }

    const user = await User.findOne(buildIdFilter(req.user.id));
    const books = await Book.find({});

    const uFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');
    const pastLoans = await Loan.find(uFilter).populate('book_id');
    const borrowedBookIds = new Set(pastLoans.map(p => p.book_id?._id?.toString()).filter(Boolean));

    const wishList = await Wishlist.find(uFilter);
    const wishlistIds = new Set(wishList.map(w => w.book_id?.toString()).filter(Boolean));

    const rawInterests = (user?.interests || '').trim();
    // If user has not selected any topics/interests: show nothing (0 books)
    if (!rawInterests) {
      return res.json({
        recommendations: [],
        hasBorrowingHistory: pastLoans.length > 0,
        userInterests: ''
      });
    }

    const userSelectedTopics = rawInterests
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const interestTokens = rawInterests
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2 && !STOPWORDS.has(w));

    const scored = books.map(book => {
      let score = 0;
      let reason = '';
      const bookCat = (book.category || '').trim().toLowerCase();
      const bookTitle = (book.title || '').trim().toLowerCase();

      let matchedTopic = null;
      for (const topic of userSelectedTopics) {
        if (bookCat === topic || bookCat.includes(topic) || topic.includes(bookCat)) {
          matchedTopic = book.category;
          score += 50;
          break;
        }
      }

      const bookTokens = new Set([
        ...tokenize(book.title),
        ...tokenize(book.category),
        ...tokenize(book.description)
      ]);

      let tokenMatches = 0;
      for (const pt of interestTokens) {
        if (bookTokens.has(pt) || bookCat.includes(pt) || bookTitle.includes(pt)) {
          tokenMatches++;
        }
      }

      if (tokenMatches > 0) {
        score += tokenMatches * 15;
        if (!matchedTopic) matchedTopic = book.category;
      }

      if (score > 0 && wishlistIds.has(book._id.toString())) {
        score += 20;
      }

      if (score > 0) {
        reason = `Matches your selected topic in ${matchedTopic || book.category}`;
      }

      return {
        ...serializeDoc(book),
        recScore: score,
        recommendationReason: reason
      };
    });

    const recommendations = scored
      .filter(b => !borrowedBookIds.has(b.id) && b.recScore > 0)
      .sort((a, b) => b.recScore - a.recScore)
      .slice(0, 16);

    res.json({
      recommendations,
      hasBorrowingHistory: pastLoans.length > 0,
      userInterests: rawInterests
    });
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// 3. Library AI Assistant Chatbot
router.post('/assistant', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const q = message.toLowerCase().trim();
    let reply = '';
    let suggestedBooks = [];
    let suggestedLink = null;

    const uFilter = buildIdFilter(req.user.id, 'user_id', 'sqlite_user_id');

    if (q.includes('due') || q.includes('my book') || q.includes('return') || q.includes('borrowed')) {
      const activeLoans = await Loan.find({
        ...uFilter,
        status: { $in: ['active', 'overdue'] }
      }).populate('book_id');

      if (activeLoans.length === 0) {
        reply = "You currently have no active book loans on your account. You can borrow up to 10 books at a time from our collection!";
        suggestedLink = '/catalog';
      } else {
        const details = activeLoans.map(l => {
          const due = new Date(l.due_date).toLocaleDateString();
          return `• "${l.book_id?.title || 'Book'}" (Due: ${due}${l.status === 'overdue' ? ' - OVERDUE' : ''})`;
        }).join('\n');
        reply = `Here are your verified active loans:\n${details}\n\nYou can renew eligible books from your student dashboard.`;
        suggestedLink = '/dashboard';
      }
    } else if (q.includes('reservation') || q.includes('hold') || q.includes('waitlist') || q.includes('pickup')) {
      const activeReservations = await Reservation.find({
        ...uFilter,
        status: { $in: ['waiting', 'ready_for_pickup'] }
      }).populate('book_id');

      if (activeReservations.length === 0) {
        reply = "You do not have any active holds or reservations. When all copies of a book are checked out, you can click 'Join Waiting Queue' to reserve it.";
        suggestedLink = '/catalog';
      } else {
        const details = activeReservations.map(r => {
          if (r.status === 'ready_for_pickup') {
            const deadline = r.pickup_deadline ? new Date(r.pickup_deadline).toLocaleString() : 'Within 48h';
            return `• "${r.book_id?.title || 'Book'}": READY FOR PICKUP at the front desk! Please collect by ${deadline}.`;
          }
          return `• "${r.book_id?.title || 'Book'}": In Queue at position #${r.queue_position}.`;
        }).join('\n');
        reply = `Here is your current hold status:\n${details}`;
        suggestedLink = '/dashboard';
      }
    } else if (q.includes('seat') || q.includes('study') || q.includes('pod') || q.includes('desk') || q.includes('quiet')) {
      const seats = await Seat.find({});
      const total = seats.length;
      const available = seats.filter(s => s.status === 'available').length;
      reply = `According to our real-time database, ${available} of ${total} study seats are currently available across Quiet Study Zone, Collaborative Hub, and Garden Window Pods. Would you like to reserve a slot?`;
      suggestedLink = '/seats';
    } else if (q.includes('visit') || q.includes('planner') || q.includes('route') || q.includes('prepare')) {
      reply = "Our 'My Library Visit Planner' lets you build a checklist of books before heading to the stacks. It groups your books by Floor & Section, shows exact shelf codes, and checks study seat availability for your visit!";
      suggestedLink = '/visit-planner';
    } else if (q.includes('compare') || q.includes('match') || q.includes('difference')) {
      reply = "You can use the 'Book Match & Compare' feature to compare up to 3 books side-by-side, analyzing descriptions, publication years, shelf locations, and live availability.";
      suggestedLink = '/compare';
    } else if (q.includes('fine') || q.includes('rules') || q.includes('policy') || q.includes('limit')) {
      reply = `Verified LibraMind Library Policies:\n• Standard loan period: 14 days.\n• Renewal limit: Up to 2 renewals (permitted only if no other member has placed a hold).\n• Overdue fee: $1.00 per day after the due date.\n• Simultaneous borrowing limit: 10 books per student.\n• Hold collection window: 48 hours once ready for pickup.`;
    } else {
      const queryTokens = tokenize(q);
      const books = await Book.find({});
      const matched = books.filter(b => {
        const text = `${b.title} ${b.category} ${b.author} ${b.description || ''}`.toLowerCase();
        return queryTokens.some(w => text.includes(w));
      }).slice(0, 3);

      if (matched.length > 0) {
        suggestedBooks = serializeDocs(matched);
        const titles = matched.map(m => `"${m.title}" (${m.category}) - ${m.shelf} (${m.available_copies} available)`).join('\n• ');
        reply = `Here are verified books in our catalog matching your query:\n• ${titles}\n\nWould you like more details or to add them to your Visit Planner?`;
        suggestedLink = '/catalog';
      } else {
        reply = `I can help you locate library books, check your due dates and holds, reserve study pods, plan your visit, or compare titles. Try asking: "Where can I find Clean Code?", "When is my borrowed book due?", or "Check seat availability".`;
      }
    }

    res.json({
      reply,
      suggestedBooks,
      suggestedLink
    });
  } catch (err) {
    console.error('AI Assistant error:', err);
    res.status(500).json({ error: 'AI Assistant error' });
  }
});

module.exports = router;
