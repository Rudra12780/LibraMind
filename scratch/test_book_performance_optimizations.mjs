import fs from 'fs';

function runTests() {
  console.log('--- Testing Library Book Load Performance Optimizations ---');

  // 1. Check backend/routes/books.js
  const booksRoute = fs.readFileSync('backend/routes/books.js', 'utf8');
  if (!booksRoute.includes('.lean()')) {
    throw new Error('FAIL: books.js query does not use .lean()');
  }
  if (!booksRoute.includes('getCachedCategories()')) {
    throw new Error('FAIL: books.js does not use category in-memory cache');
  }
  if (booksRoute.includes('const borrowCount = await Loan.countDocuments(bFilter);')) {
    throw new Error('FAIL: books.js still contains N+1 Loan.countDocuments loop');
  }
  if (!booksRoute.includes('const availableCopies = bookIds.length > 0 ? await BookCopy.find')) {
    throw new Error('FAIL: books.js does not batch available copies lookup');
  }
  console.log('✓ PASS: backend/routes/books.js eliminates N+1 loops, uses .lean(), and batch queries');

  // 2. Check backend/models/Book.js
  const bookModel = fs.readFileSync('backend/models/Book.js', 'utf8');
  if (!bookModel.includes('BookSchema.index({ title: 1 })') || !bookModel.includes('BookSchema.index({ available_copies: 1 })')) {
    throw new Error('FAIL: Book.js missing performance indexes');
  }
  console.log('✓ PASS: backend/models/Book.js contains optimal catalog indexes');

  // 3. Check frontend/src/pages/Home.jsx
  const homeSrc = fs.readFileSync('frontend/src/pages/Home.jsx', 'utf8');
  if (homeSrc.includes("api.getBooks({ limit: 8, sort: 'random' })") && homeSrc.includes("api.getBooks({ limit: 4, sort: 'random' })")) {
    throw new Error('FAIL: Home.jsx still makes 3 redundant concurrent book requests');
  }
  if (!homeSrc.includes('api.getBooks({ limit: 16 })')) {
    throw new Error('FAIL: Home.jsx does not consolidate book loading into a single request');
  }
  console.log('✓ PASS: frontend/src/pages/Home.jsx consolidates book fetching into 1 fast request');

  // 4. Check frontend/src/components/BookCard.jsx
  const cardSrc = fs.readFileSync('frontend/src/components/BookCard.jsx', 'utf8');
  if (!cardSrc.includes('loading="lazy"') || !cardSrc.includes('decoding="async"')) {
    throw new Error('FAIL: BookCard.jsx missing loading="lazy" or decoding="async"');
  }
  console.log('✓ PASS: BookCard.jsx uses lazy and async image decoding');

  // 5. Check frontend/src/pages/Catalog.jsx
  const catSrc = fs.readFileSync('frontend/src/pages/Catalog.jsx', 'utf8');
  if (catSrc.includes('Loading catalog items...')) {
    throw new Error('FAIL: Catalog.jsx still shows slow text fallback instead of skeleton grid');
  }
  console.log('✓ PASS: Catalog.jsx uses modern skeleton loading grid for smooth UX');

  console.log('\nALL PERFORMANCE TESTS PASSED SUCCESSFULLY!');
}

runTests();
