const db = require('../backend/db/database');

function getAdminAnalytics() {
  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const prevYear = (now.getFullYear() - 1).toString();

  // A. Main Dashboard Statistics (7 items)
  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  const totalBooks = db.prepare("SELECT COUNT(*) as count FROM books").get().count;
  const totalCopies = db.prepare("SELECT COUNT(*) as count FROM book_copies").get().count;
  const borrowedToday = db.prepare("SELECT COUNT(*) as count FROM loans WHERE date(borrow_date) = date('now')").get().count;
  const returnedToday = db.prepare("SELECT COUNT(*) as count FROM loans WHERE return_date IS NOT NULL AND date(return_date) = date('now')").get().count;
  const currentlyBorrowed = db.prepare("SELECT COUNT(*) as count FROM loans WHERE status IN ('active', 'overdue')").get().count;
  const currentlyAvailable = db.prepare("SELECT COUNT(*) as count FROM book_copies WHERE status = 'available'").get().count;

  // B. Member Registration & Growth Analytics (16 items)
  const totalMembers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;

  const monthlyNewMembers = db.prepare(`
    SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count
    FROM users
    WHERE role = 'student' AND strftime('%Y', created_at) = strftime('%Y', 'now')
    GROUP BY month
    ORDER BY month ASC
  `).all();

  const yearlyNewMembers = db.prepare(`
    SELECT strftime('%Y', created_at) as year, COUNT(*) as count
    FROM users
    WHERE role = 'student'
    GROUP BY year
    ORDER BY year ASC
  `).all();

  const lastYearMembers = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE role = 'student' AND strftime('%Y', created_at) = strftime('%Y', 'now', '-1 year')
  `).get().count;

  const currentYearMembers = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE role = 'student' AND strftime('%Y', created_at) = strftime('%Y', 'now')
  `).get().count;

  // YoY equivalent period calculation:
  const prevYearEquivalentMembers = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE role = 'student' 
      AND strftime('%Y', created_at) = strftime('%Y', 'now', '-1 year')
      AND strftime('%m-%d', created_at) <= strftime('%m-%d', 'now')
  `).get().count;

  const yoyGrowthPercent = prevYearEquivalentMembers > 0
    ? Math.round(((currentYearMembers - prevYearEquivalentMembers) / prevYearEquivalentMembers) * 100)
    : (currentYearMembers > 0 ? 100 : 0);

  // Daily borrowing and returning chart (last 14 days)
  const dailyBorrowingReturning = db.prepare(`
    WITH RECURSIVE dates(d) AS (
      SELECT date('now', '-13 days')
      UNION ALL
      SELECT date(d, '+1 day') FROM dates WHERE d < date('now')
    )
    SELECT 
      d as date,
      (SELECT COUNT(*) FROM loans WHERE date(borrow_date) = d) as borrowed,
      (SELECT COUNT(*) FROM loans WHERE return_date IS NOT NULL AND date(return_date) = d) as returned
    FROM dates
    ORDER BY d ASC
  `).all();

  // Monthly Borrowing Trends (last 12 months)
  const monthlyBorrowingTrends = db.prepare(`
    SELECT strftime('%Y-%m', borrow_date) as month, COUNT(*) as borrow_count
    FROM loans
    WHERE borrow_date >= date('now', '-12 months')
    GROUP BY month
    ORDER BY month ASC
  `).all();

  // Yearly Borrowing Trends
  const yearlyBorrowingTrends = db.prepare(`
    SELECT strftime('%Y', borrow_date) as year, COUNT(*) as borrow_count
    FROM loans
    GROUP BY year
    ORDER BY year ASC
  `).all();

  // Book-wise Borrowing Bar Chart
  const bookWiseBorrowing = db.prepare(`
    SELECT b.id, b.title, b.category, COUNT(l.id) as borrow_count
    FROM books b
    LEFT JOIN loans l ON b.id = l.book_id
    GROUP BY b.id
    ORDER BY borrow_count DESC, b.title ASC
    LIMIT 10
  `).all();

  // Category-wise Borrowing Pie Chart
  const categoryWiseBorrowing = db.prepare(`
    SELECT b.category, COUNT(l.id) as borrow_count
    FROM books b
    JOIN loans l ON b.id = l.book_id
    GROUP BY b.category
    ORDER BY borrow_count DESC
  `).all();

  // C. Book Popularity Analytics (4 items)
  // Month-wise most borrowed books (for current month and recent months)
  const monthWiseMostBorrowed = db.prepare(`
    SELECT strftime('%Y-%m', l.borrow_date) as month, b.id, b.title, b.author, b.cover_image, COUNT(l.id) as borrow_count
    FROM loans l
    JOIN books b ON l.book_id = b.id
    GROUP BY month, b.id
    ORDER BY month DESC, borrow_count DESC
    LIMIT 5
  `).all();

  // Month-wise least borrowed books
  const monthWiseLeastBorrowed = db.prepare(`
    SELECT strftime('%Y-%m', l.borrow_date) as month, b.id, b.title, b.author, b.cover_image, COUNT(l.id) as borrow_count
    FROM loans l
    JOIN books b ON l.book_id = b.id
    GROUP BY month, b.id
    ORDER BY month DESC, borrow_count ASC
    LIMIT 5
  `).all();

  const mostBorrowedBook = db.prepare(`
    SELECT b.id, b.title, b.author, b.cover_image, b.category, COUNT(l.id) as borrow_count
    FROM books b
    JOIN loans l ON b.id = l.book_id
    GROUP BY b.id
    ORDER BY borrow_count DESC
    LIMIT 1
  `).get() || null;

  const leastBorrowedBook = db.prepare(`
    SELECT b.id, b.title, b.author, b.cover_image, b.category, COUNT(l.id) as borrow_count
    FROM books b
    LEFT JOIN loans l ON b.id = l.book_id
    GROUP BY b.id
    ORDER BY borrow_count ASC, b.id ASC
    LIMIT 1
  `).get() || null;

  // D. Waiting List Analytics (3 items - only active/pending, exclude cancelled/expired/fulfilled)
  const mostRequestedBooks = db.prepare(`
    SELECT b.id, b.title, b.author, b.cover_image, b.category, b.available_copies, b.total_copies, COUNT(r.id) as waitlist_count
    FROM books b
    JOIN reservations r ON b.id = r.book_id
    WHERE r.status IN ('waiting', 'ready_for_pickup')
    GROUP BY b.id
    ORDER BY waitlist_count DESC
    LIMIT 10
  `).all();

  const bookWiseWaitingList = db.prepare(`
    SELECT b.id, b.title, b.author, b.category, b.available_copies, b.total_copies, COUNT(r.id) as waitlist_count
    FROM books b
    LEFT JOIN reservations r ON b.id = r.book_id AND r.status IN ('waiting', 'ready_for_pickup')
    GROUP BY b.id
    HAVING waitlist_count > 0
    ORDER BY waitlist_count DESC, b.title ASC
  `).all();

  const top5WaitingList = db.prepare(`
    SELECT b.id, b.title, b.author, b.cover_image, b.category, b.available_copies, b.total_copies, COUNT(r.id) as waitlist_count
    FROM books b
    JOIN reservations r ON b.id = r.book_id
    WHERE r.status IN ('waiting', 'ready_for_pickup')
    GROUP BY b.id
    ORDER BY waitlist_count DESC
    LIMIT 5
  `).all();

  return {
    mainStats: {
      totalUsers,
      totalBooks,
      totalCopies,
      borrowedToday,
      returnedToday,
      currentlyBorrowed,
      currentlyAvailable
    },
    memberGrowth: {
      totalMembers,
      monthlyNewMembers,
      yearlyNewMembers,
      lastYearMembers,
      currentYearMembers,
      prevYearEquivalentMembers,
      yoyGrowthPercent,
      dailyBorrowingReturning,
      monthlyBorrowingTrends,
      yearlyBorrowingTrends,
      bookWiseBorrowing,
      categoryWiseBorrowing
    },
    bookPopularity: {
      monthWiseMostBorrowed,
      monthWiseLeastBorrowed,
      mostBorrowedBook,
      leastBorrowedBook
    },
    waitingList: {
      mostRequestedBooks,
      bookWiseWaitingList,
      top5WaitingList
    }
  };
}

const res = getAdminAnalytics();
console.log('Main Stats:', res.mainStats);
console.log('Book Popularity Most:', res.bookPopularity.mostBorrowedBook?.title);
console.log('Book Popularity Least:', res.bookPopularity.leastBorrowedBook?.title);
console.log('Member Growth YoY:', res.memberGrowth.yoyGrowthPercent + '%');
console.log('Daily records count:', res.memberGrowth.dailyBorrowingReturning.length);

