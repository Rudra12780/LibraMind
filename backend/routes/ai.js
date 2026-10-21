const express = require('express');
const db = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

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

  books.forEach((b, index) => {
    // Weight title 3x, category 2x, author 2x, description 1x
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

    // Track unique document occurrence
    const uniqueTokens = new Set(weightedTokens);
    for (const token of uniqueTokens) {
      docFrequencies[token] = (docFrequencies[token] || 0) + 1;
    }
  });

  // Calculate IDF
  const idf = {};
  for (const token in docFrequencies) {
    idf[token] = Math.log((N + 1) / (docFrequencies[token] + 1)) + 1;
  }

  // Calculate TF-IDF vectors
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
function handleAiSearch(req, res) {
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

    let allBooks = db.prepare('SELECT * FROM books').all();
    if (allBooks.length === 0) {
      return res.json({ results: [], suggestions: [], query });
    }

    // Apply explicit metadata filters if requested
    let candidateBooks = allBooks;
    if (category && category !== 'All') {
      candidateBooks = candidateBooks.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    if (language && language !== 'All') {
      candidateBooks = candidateBooks.filter(b => b.language.toLowerCase() === language.toLowerCase());
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

    // Direct ISBN or exact title match boost check
    const rawCleanQuery = query.toLowerCase().trim();

    if (queryTokens.length === 0 && !rawCleanQuery.match(/^[0-9-]+$/)) {
      // Suggest top categories and popular books
      const suggestions = db.prepare('SELECT id, title, author, category, available_copies, floor, shelf, rack, section FROM books ORDER BY available_copies DESC LIMIT 4').all().map(b => ({
        ...b,
        location_floor: b.floor,
        location_shelf: b.shelf,
        location_rack: b.rack,
        location_section: b.section
      }));
      return res.json({
        results: [],
        suggestions,
        extractedKeywords: [],
        message: 'No searchable keywords found. Try terms like "Python programming", "deep learning", or "biophilic design".'
      });
    }

    // Build query vector
    const queryTf = {};
    for (const t of queryTokens) {
      queryTf[t] = (queryTf[t] || 0) + 1;
    }

    const queryVector = {};
    let qMagSq = 0;
    for (const t in queryTf) {
      const weight = queryTf[t] * (idf[t] || 1);
      queryVector[t] = weight;
      qMagSq += weight * weight;
    }
    const qMag = Math.sqrt(qMagSq) || 1;

    // Calculate Cosine Similarity for each candidate book
    const scoredBooks = candidateBooks.map((book, idx) => {
      const doc = docVectors[idx];
      let dotProduct = 0;
      const matchedTokens = [];

      for (const t in queryVector) {
        if (doc && doc.vector[t]) {
          dotProduct += queryVector[t] * doc.vector[t];
          matchedTokens.push(t);
        }
      }

      let similarity = doc ? dotProduct / (qMag * doc.magnitude) : 0;

      // Exact title/ISBN match boost
      if (book.title.toLowerCase().includes(rawCleanQuery)) {
        similarity = Math.max(similarity, 0.85);
        matchedTokens.push('title-match');
      }
      if (book.isbn.replace(/[^0-9]/g, '') === rawCleanQuery.replace(/[^0-9]/g, '')) {
        similarity = 1.0;
        matchedTokens.push('isbn-exact');
      }

      const score = Math.round(similarity * 100);

      // Determine clear, honest explanation reason
      let explanation = '';
      if (score > 0) {
        const uniqueMatched = [...new Set(matchedTokens)];
        explanation = `Matches relevant topic terms: [${uniqueMatched.join(', ')}] in ${book.category}. Located on ${book.floor}, ${book.section}, ${book.shelf}, ${book.rack}. Availability: ${book.available_copies} of ${book.total_copies} copies.`;
      }

      return {
        ...book,
        location_floor: book.floor,
        location_shelf: book.shelf,
        location_rack: book.rack,
        location_section: book.section,
        score,
        matchedKeywords: matchedTokens,
        matchReason: explanation,
        matchExplanation: explanation
      };
    });

    // Filter results with score > 8, unique per book ID, sorted by score descending
    const results = scoredBooks
      .filter(b => b.score > 8)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    // Fallback suggestions if no matching books found
    let suggestions = [];
    if (results.length === 0) {
      // Find top books in the catalog as recommended alternatives
      suggestions = db.prepare(`
        SELECT id, title, author, category, available_copies, total_copies, floor, shelf, rack, section
        FROM books
        ORDER BY available_copies DESC, publication_year DESC
        LIMIT 4
      `).all().map(b => ({
        ...b,
        location_floor: b.floor,
        location_shelf: b.shelf,
        location_rack: b.rack,
        location_section: b.section
      }));
    }

    res.json({
      query,
      results,
      count: results.length,
      extractedKeywords: queryTokens,
      suggestions
    });
  } catch (err) {
    console.error('AI Book Finder error:', err);
    res.status(500).json({ error: 'AI Book Finder encountered an error' });
  }
}

router.post('/finder', handleAiSearch);
router.post('/search', handleAiSearch);

// 2. Personalized Book Recommendations
router.get('/recommendations', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const books = db.prepare('SELECT * FROM books').all();

    // Past borrowed book categories and titles
    const pastLoans = db.prepare(`
      SELECT b.id, b.category, b.author, b.title
      FROM loans l
      JOIN books b ON l.book_id = b.id
      WHERE l.user_id = ?
    `).all(req.user.id);

    const borrowedBookIds = new Set(pastLoans.map(p => p.id));

    // User wishlist
    const wishList = db.prepare('SELECT book_id FROM wishlist WHERE user_id = ?').all(req.user.id);
    const wishlistIds = new Set(wishList.map(w => w.book_id));

    // Combine user profile keywords
    const userInterestTokens = tokenize(user.interests || '');
    const userLoanCategoryTokens = pastLoans.flatMap(p => tokenize(p.category));

    const preferenceTokens = [...userInterestTokens, ...userLoanCategoryTokens];

    // Score books using content similarity
    const scored = books.map(book => {
      let score = 0;
      let reason = 'General Popular Selection';

      const bookTokens = new Set([
        ...tokenize(book.title),
        ...tokenize(book.category),
        ...tokenize(book.description)
      ]);

      let matches = 0;
      for (const pt of preferenceTokens) {
        if (bookTokens.has(pt)) {
          matches++;
        }
      }

      if (matches > 0) {
        score = matches * 15;
        reason = `Matches your stated reading interest in ${book.category}`;
      } else if (wishlistIds.has(book.id)) {
        score += 25;
        reason = 'From your saved wishlist';
      } else {
        score = book.available_copies > 0 ? 10 : 5;
      }

      return {
        ...book,
        recScore: score,
        recommendationReason: reason
      };
    });

    const recommendations = scored
      .filter(b => !borrowedBookIds.has(b.id))
      .sort((a, b) => b.recScore - a.recScore)
      .slice(0, 6);

    res.json({
      recommendations,
      hasBorrowingHistory: pastLoans.length > 0,
      userInterests: user.interests || 'None specified'
    });
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// 3. Library AI Assistant Chatbot (Verified Data Retrieval)
router.post('/assistant', authenticateToken, (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const q = message.toLowerCase().trim();
    let reply = '';
    let suggestedBooks = [];
    let suggestedLink = null;

    // 1. User loan / due date inquiry
    if (q.includes('due') || q.includes('my book') || q.includes('return') || q.includes('borrowed')) {
      const activeLoans = db.prepare(`
        SELECT l.*, b.title, b.floor, b.shelf
        FROM loans l
        JOIN books b ON l.book_id = b.id
        WHERE l.user_id = ? AND l.status IN ('active', 'overdue')
      `).all(req.user.id);

      if (activeLoans.length === 0) {
        reply = "You currently have no active book loans on your account. You can borrow up to 5 books at a time from our collection!";
        suggestedLink = '/catalog';
      } else {
        const details = activeLoans.map(l => {
          const due = new Date(l.due_date).toLocaleDateString();
          return `• "${l.title}" (Due: ${due}${l.status === 'overdue' ? ' - OVERDUE' : ''})`;
        }).join('\n');
        reply = `Here are your verified active loans:\n${details}\n\nYou can renew eligible books from your student dashboard.`;
        suggestedLink = '/dashboard';
      }
    }
    // 2. Reservation / Hold status inquiry
    else if (q.includes('reservation') || q.includes('hold') || q.includes('waitlist') || q.includes('pickup')) {
      const activeReservations = db.prepare(`
        SELECT r.*, b.title
        FROM reservations r
        JOIN books b ON r.book_id = b.id
        WHERE r.user_id = ? AND r.status IN ('waiting', 'ready_for_pickup')
      `).all(req.user.id);

      if (activeReservations.length === 0) {
        reply = "You do not have any active holds or reservations. When all copies of a book are checked out, you can click 'Join Waiting Queue' to reserve it.";
        suggestedLink = '/catalog';
      } else {
        const details = activeReservations.map(r => {
          if (r.status === 'ready_for_pickup') {
            const deadline = r.pickup_deadline ? new Date(r.pickup_deadline).toLocaleString() : 'Within 48h';
            return `• "${r.title}": READY FOR PICKUP at the front desk! Please collect by ${deadline}.`;
          }
          return `• "${r.title}": In Queue at position #${r.queue_position}.`;
        }).join('\n');
        reply = `Here is your current hold status:\n${details}`;
        suggestedLink = '/dashboard';
      }
    }
    // 3. Seat & Study Pod availability inquiry
    else if (q.includes('seat') || q.includes('study') || q.includes('pod') || q.includes('desk') || q.includes('quiet')) {
      const seats = db.prepare('SELECT status, section FROM seats').all();
      const total = seats.length;
      const available = seats.filter(s => s.status === 'available').length;
      reply = `According to our real-time database, ${available} of ${total} study seats are currently available across Quiet Study Zone, Collaborative Hub, and Garden Window Pods. Would you like to reserve a slot?`;
      suggestedLink = '/seats';
    }
    // 4. Visit Planner inquiry
    else if (q.includes('visit') || q.includes('planner') || q.includes('route') || q.includes('prepare')) {
      reply = "Our 'My Library Visit Planner' lets you build a checklist of books before heading to the stacks. It groups your books by Floor & Section, shows exact shelf codes, and checks study seat availability for your visit!";
      suggestedLink = '/visit-planner';
    }
    // 5. Compare inquiry
    else if (q.includes('compare') || q.includes('match') || q.includes('difference')) {
      reply = "You can use the 'Book Match & Compare' feature to compare up to 3 books side-by-side, analyzing descriptions, publication years, shelf locations, and live availability.";
      suggestedLink = '/compare';
    }
    // 6. Library policy / fines
    else if (q.includes('fine') || q.includes('rules') || q.includes('policy') || q.includes('limit')) {
      reply = `Verified LibraMind Library Policies:\n• Standard loan period: 14 days.\n• Renewal limit: Up to 2 renewals (permitted only if no other member has placed a hold).\n• Overdue fee: $1.00 per day after the due date.\n• Simultaneous borrowing limit: 5 books per student.\n• Hold collection window: 48 hours once ready for pickup.`;
    }
    // 7. Book location & shelf coordinates
    else if (q.includes('where') || q.includes('location') || q.includes('shelf') || q.includes('rack') || q.includes('find')) {
      const words = tokenize(q);
      const books = db.prepare('SELECT id, title, floor, section, shelf, rack, total_copies, available_copies FROM books').all();

      const matched = books.filter(b => {
        const tTokens = tokenize(b.title);
        return words.some(w => tTokens.includes(w));
      });

      if (matched.length > 0) {
        const topMatch = matched[0];
        suggestedBooks = matched.slice(0, 3);
        reply = `Verified Catalog Record:\n"${topMatch.title}" is located on ${topMatch.floor}, ${topMatch.section}, at ${topMatch.shelf}, ${topMatch.rack}.\nInventory: ${topMatch.available_copies} of ${topMatch.total_copies} physical copies currently available on shelf.`;
        suggestedLink = '/catalog';
      } else {
        reply = "I searched our library catalog, but could not find a verified shelf match for that title. Please check the spelling or browse the full Catalog.";
        suggestedLink = '/catalog';
      }
    }
    // 8. General search fallback
    else {
      const queryTokens = tokenize(q);
      const books = db.prepare('SELECT id, title, author, category, available_copies, total_copies, floor, shelf FROM books').all();

      const matched = books.filter(b => {
        const text = `${b.title} ${b.category} ${b.author} ${b.description || ''}`.toLowerCase();
        return queryTokens.some(w => text.includes(w));
      }).slice(0, 3);

      if (matched.length > 0) {
        suggestedBooks = matched;
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
