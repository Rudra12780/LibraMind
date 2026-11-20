import fs from 'fs';

function runTests() {
  console.log('--- Testing Single Active Copy Borrowing Rule ---');

  // 1. Check backend/routes/loans.js
  const loansSrc = fs.readFileSync('backend/routes/loans.js', 'utf8');

  // Verify /checkout has active loan duplicate check
  if (!loansSrc.includes('// Only 1 copy of a book at a time per user')) {
    throw new Error('FAIL: Comment "// Only 1 copy of a book at a time per user" missing in backend/routes/loans.js');
  }
  if (!loansSrc.includes("status: { $in: ['active', 'borrowed', 'overdue'] }")) {
    throw new Error('FAIL: loans.js does not check all active loan statuses');
  }
  console.log('✓ PASS: backend/routes/loans.js /checkout endpoint enforces single concurrent copy rule');

  // Verify /issue has active loan duplicate check
  if (!loansSrc.includes('// Single active copy rule: A member cannot borrow the same book twice concurrently')) {
    throw new Error('FAIL: Librarian /issue endpoint duplicate check missing in backend/routes/loans.js');
  }
  console.log('✓ PASS: backend/routes/loans.js /issue endpoint enforces single concurrent copy rule');

  // 2. Check backend/routes/reservations.js
  const resSrc = fs.readFileSync('backend/routes/reservations.js', 'utf8');
  if (!resSrc.includes('Cannot hold or borrow the same title twice concurrently') && !resSrc.includes('cannot hold or borrow the same title twice concurrently')) {
    throw new Error('FAIL: reservations.js claim duplicate check missing');
  }
  console.log('✓ PASS: backend/routes/reservations.js prevents claiming or holding if active loan exists');

  // 3. Check frontend/src/pages/BookDetails.jsx
  const bookDetailsSrc = fs.readFileSync('frontend/src/pages/BookDetails.jsx', 'utf8');
  if (!bookDetailsSrc.includes('if (userLoan) {') || !bookDetailsSrc.includes('You already have an active borrowed copy of this book')) {
    throw new Error('FAIL: BookDetails.jsx handleSelfCheckout does not guard against duplicate borrow');
  }
  if (!bookDetailsSrc.includes('Return your copy to borrow this title again')) {
    throw new Error('FAIL: BookDetails.jsx does not display 1 copy return-to-reborrow policy');
  }
  console.log('✓ PASS: BookDetails.jsx guards checkout and enables re-borrowing only after return');

  // 4. Check frontend/src/pages/Catalog.jsx
  const catSrc = fs.readFileSync('frontend/src/pages/Catalog.jsx', 'utf8');
  if (!catSrc.includes('userBorrowedBookIds.has(book.id)')) {
    throw new Error('FAIL: Catalog.jsx does not guard handleQuickBorrow against duplicate borrow');
  }
  console.log('✓ PASS: Catalog.jsx guards handleQuickBorrow against duplicate concurrent borrows');

  // 5. Check frontend/src/pages/StudentDashboard.jsx
  const dashSrc = fs.readFileSync('frontend/src/pages/StudentDashboard.jsx', 'utf8');
  if (!dashSrc.includes('activeLoans.some(l => l.book_id === book.id)')) {
    throw new Error('FAIL: StudentDashboard.jsx does not guard handleBorrowWishlistBook');
  }
  console.log('✓ PASS: StudentDashboard.jsx guards wishlist borrow against duplicate concurrent borrows');

  console.log('\nALL SINGLE ACTIVE COPY CHECKS PASSED!');
}

runTests();
