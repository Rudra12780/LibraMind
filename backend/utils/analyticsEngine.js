const Book = require('../models/Book');
const BookCopy = require('../models/BookCopy');
const Loan = require('../models/Loan');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Seat = require('../models/Seat');

/**
 * Computes all 30 live Admin Analytics metrics directly from MongoDB Atlas.
 * Zero fabricated or hard-coded dummy data.
 * Pure aggregation pipelines with edge case & division-by-zero safeguards.
 */
async function computeAdminReports() {
  const now = new Date();
  
  // Date boundaries
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
  const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

  const priorEquivalentYtdEnd = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  );

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // ==========================================
  // SECTION A: Main Dashboard Statistics (1-7)
  // ==========================================
  // 1. Total Registered Users
  const totalUsers = await User.countDocuments();

  // 2. Total Books (Titles)
  const totalBooks = await Book.countDocuments();

  // 3. Total Book Copies
  const totalCopies = await BookCopy.countDocuments();

  // 4. Total Books Borrowed Today
  const borrowedTodayAgg = await Loan.aggregate([
    {
      $project: {
        bDate: { $toDate: '$borrow_date' }
      }
    },
    {
      $match: {
        bDate: { $gte: startOfToday, $lte: endOfToday }
      }
    },
    { $count: 'count' }
  ]);
  const borrowedToday = borrowedTodayAgg[0]?.count || 0;

  // 5. Total Books Returned Today
  const returnedTodayAgg = await Loan.aggregate([
    {
      $project: {
        status: '$status',
        rDate: {
          $cond: [{ $ifNull: ['$return_date', false] }, { $toDate: '$return_date' }, null]
        }
      }
    },
    {
      $match: {
        status: 'returned',
        rDate: { $gte: startOfToday, $lte: endOfToday }
      }
    },
    { $count: 'count' }
  ]);
  const returnedToday = returnedTodayAgg[0]?.count || 0;

  // 6. Currently Borrowed Books (Active / Overdue)
  const currentlyBorrowed = await Loan.countDocuments({ status: { $in: ['active', 'borrowed', 'overdue'] } });

  // 7. Currently Available Books
  const currentlyAvailable = await BookCopy.countDocuments({ status: 'available' });

  // ========================================================
  // SECTION B: Member Registration & Growth Analytics (8-23)
  // ========================================================
  // 8. Total Registered Members (Students)
  const totalMembers = await User.countDocuments({ role: 'student' });

  // 9. Monthly New Member Registrations
  const monthlyNewMembersAgg = await User.aggregate([
    {
      $project: {
        role: '$role',
        cDate: { $toDate: '$created_at' }
      }
    },
    {
      $match: {
        role: 'student',
        cDate: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    { $count: 'count' }
  ]);
  const monthlyNewMembers = monthlyNewMembersAgg[0]?.count || 0;

  // 10. Yearly New Member Registrations
  const yearlyNewMembersAgg = await User.aggregate([
    {
      $project: {
        role: '$role',
        cDate: { $toDate: '$created_at' }
      }
    },
    {
      $match: {
        role: 'student',
        cDate: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    { $count: 'count' }
  ]);
  const yearlyNewMembers = yearlyNewMembersAgg[0]?.count || 0;

  // 11. Last Year's Total New Members
  const lastYearNewMembersAgg = await User.aggregate([
    {
      $project: {
        role: '$role',
        cDate: { $toDate: '$created_at' }
      }
    },
    {
      $match: {
        role: 'student',
        cDate: { $gte: startOfLastYear, $lte: endOfLastYear }
      }
    },
    { $count: 'count' }
  ]);
  const lastYearNewMembers = lastYearNewMembersAgg[0]?.count || 0;

  // 12. Current Year's Total New Members
  const currentYearNewMembers = yearlyNewMembers;

  // 13. Monthly Member Growth Chart data
  const monthlyMemberGrowthAgg = await User.aggregate([
    {
      $project: {
        role: '$role',
        month: { $dateToString: { format: '%Y-%m', date: { $toDate: '$created_at' } } }
      }
    },
    {
      $match: { role: 'student' }
    },
    {
      $group: {
        _id: '$month',
        members: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        month: '$_id',
        members: 1
      }
    }
  ]);
  const monthlyMemberGrowthChart = monthlyMemberGrowthAgg;

  // 14. Daily Borrowing & Returning Chart data (14-day rolling window)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const dailyBorrowReturns = await Loan.aggregate([
    {
      $facet: {
        borrowed: [
          {
            $project: {
              bDate: { $toDate: '$borrow_date' }
            }
          },
          {
            $match: { bDate: { $gte: fourteenDaysAgo } }
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$bDate' } },
              count: { $sum: 1 }
            }
          }
        ],
        returned: [
          {
            $project: {
              status: '$status',
              rDate: {
                $cond: [{ $ifNull: ['$return_date', false] }, { $toDate: '$return_date' }, null]
              }
            }
          },
          {
            $match: { status: 'returned', rDate: { $ne: null, $gte: fourteenDaysAgo } }
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$rDate' } },
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);

  const dailyBorrowingReturningChart = [];
  const bMap = new Map((dailyBorrowReturns[0]?.borrowed || []).map(b => [b._id, b.count]));
  const rMap = new Map((dailyBorrowReturns[0]?.returned || []).map(r => [r._id, r.count]));

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    dailyBorrowingReturningChart.push({
      date: dateStr,
      borrowed: bMap.get(dateStr) || 0,
      returned: rMap.get(dateStr) || 0
    });
  }

  // 15. Monthly Borrowing Trends (12-month series)
  const monthlyBorrowingTrends = await Loan.aggregate([
    {
      $project: {
        status: '$status',
        bMonth: { $dateToString: { format: '%Y-%m', date: { $toDate: '$borrow_date' } } }
      }
    },
    {
      $group: {
        _id: '$bMonth',
        borrowed: { $sum: 1 },
        returned: {
          $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        month: '$_id',
        borrowed: 1,
        returned: 1
      }
    }
  ]);

  // 16. Yearly Borrowing Trends
  const yearlyBorrowingTrends = await Loan.aggregate([
    {
      $project: {
        status: '$status',
        bYear: { $dateToString: { format: '%Y', date: { $toDate: '$borrow_date' } } }
      }
    },
    {
      $group: {
        _id: '$bYear',
        borrowed: { $sum: 1 },
        returned: {
          $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        year: '$_id',
        borrowed: 1,
        returned: 1
      }
    }
  ]);

  // 17. Monthly Member Registration Bar Chart data
  const monthlyMemberRegistrationBarChart = monthlyMemberGrowthChart.map(item => {
    const parts = (item.month || '').split('-');
    const mIdx = parseInt(parts[1], 10) - 1;
    const label = `${monthNames[mIdx] || 'Month'} ${parts[0] || ''}`;
    return {
      monthKey: item.month,
      label,
      members: item.members
    };
  });

  // 18. Yearly Member Growth Line Chart data
  const yearlyMembersAgg = await User.aggregate([
    {
      $project: {
        role: '$role',
        year: { $dateToString: { format: '%Y', date: { $toDate: '$created_at' } } }
      }
    },
    {
      $match: { role: 'student' }
    },
    {
      $group: {
        _id: '$year',
        newMembers: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        year: '$_id',
        newMembers: 1
      }
    }
  ]);

  let runningMembers = 0;
  const yearlyMemberGrowthLineChart = yearlyMembersAgg.map(item => {
    runningMembers += item.newMembers;
    return {
      year: item.year,
      newMembers: item.newMembers,
      cumulativeMembers: runningMembers
    };
  });

  // 19. Book-wise Borrowing Bar Chart (Top 10 borrowed titles)
  const bookWiseBorrowingBarChart = await Loan.aggregate([
    {
      $group: {
        _id: '$book_id',
        borrowCount: { $sum: 1 }
      }
    },
    { $sort: { borrowCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'books',
        let: { bId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$_id', '$$bId'] },
                  { $eq: ['$id', '$$bId'] },
                  { $eq: ['$sqlite_id', '$$bId'] }
                ]
              }
            }
          }
        ],
        as: 'book'
      }
    },
    { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        bookId: '$_id',
        title: { $ifNull: ['$book.title', 'Unknown Title'] },
        author: { $ifNull: ['$book.author', 'Unknown Author'] },
        category: { $ifNull: ['$book.category', 'Uncategorized'] },
        borrowCount: 1
      }
    }
  ]);

  // 20. Category-wise Borrowing Pie Chart
  const totalLoansCount = await Loan.countDocuments();
  const categoryWiseBorrowingPieChart = await Loan.aggregate([
    {
      $lookup: {
        from: 'books',
        let: { bId: '$book_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$_id', '$$bId'] },
                  { $eq: ['$id', '$$bId'] },
                  { $eq: ['$sqlite_id', '$$bId'] }
                ]
              }
            }
          }
        ],
        as: 'book'
      }
    },
    { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$book.category', 'General'] },
        borrowCount: { $sum: 1 }
      }
    },
    { $sort: { borrowCount: -1 } },
    {
      $project: {
        _id: 0,
        category: '$_id',
        borrowCount: 1,
        percentage: {
          $cond: [
            { $gt: [totalLoansCount, 0] },
            { $round: [{ $multiply: [{ $divide: ['$borrowCount', totalLoansCount] }, 100] }, 1] },
            0
          ]
        }
      }
    }
  ]);

  // 21. Overall Library Performance Dashboard
  const totalReturnedLoans = await Loan.countDocuments({ status: 'returned' });
  const onTimeReturnsAgg = await Loan.aggregate([
    {
      $match: { status: 'returned' }
    },
    {
      $project: {
        isOntime: {
          $cond: [
            {
              $or: [
                { $lte: ['$fine_amount', 0] },
                {
                  $lte: [
                    { $cond: [{ $ifNull: ['$return_date', false] }, { $toDate: '$return_date' }, null] },
                    { $cond: [{ $ifNull: ['$due_date', false] }, { $toDate: '$due_date' }, null] }
                  ]
                }
              ]
            },
            1,
            0
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        onTimeCount: { $sum: '$isOntime' }
      }
    }
  ]);
  const onTimeReturns = onTimeReturnsAgg[0]?.onTimeCount || 0;

  const returnEfficiency = totalReturnedLoans > 0
    ? Math.round((onTimeReturns / totalReturnedLoans) * 100 * 10) / 10
    : 100.0;

  const copyUtilization = totalCopies > 0
    ? Math.round((currentlyBorrowed / totalCopies) * 100 * 10) / 10
    : 0.0;

  const activePlusAvailable = currentlyAvailable + currentlyBorrowed;
  const circulationVelocity = activePlusAvailable > 0
    ? Math.round((currentlyBorrowed / activePlusAvailable) * 100 * 10) / 10
    : 0.0;

  const overallLibraryPerformance = {
    circulationVelocity: {
      value: circulationVelocity,
      unit: '%',
      description: 'Active borrowed items relative to active collection inventory'
    },
    returnEfficiency: {
      value: returnEfficiency,
      unit: '%',
      description: 'Loans returned on or before due date without overdue penalties'
    },
    copyUtilization: {
      value: copyUtilization,
      unit: '%',
      description: 'Percentage of total catalog copies actively checked out'
    }
  };

  // 22. Year-over-Year (YoY) Growth Percentage (Equivalent date period)
  const priorPeriodStudentsAgg = await User.aggregate([
    {
      $project: {
        role: '$role',
        cDate: { $toDate: '$created_at' }
      }
    },
    {
      $match: {
        role: 'student',
        cDate: { $gte: startOfLastYear, $lte: priorEquivalentYtdEnd }
      }
    },
    { $count: 'count' }
  ]);
  const priorPeriodStudents = priorPeriodStudentsAgg[0]?.count || 0;

  let yoyGrowthPercentageVal = 0;
  if (priorPeriodStudents > 0) {
    yoyGrowthPercentageVal = Math.round(((yearlyNewMembers - priorPeriodStudents) / priorPeriodStudents) * 100 * 10) / 10;
  } else if (yearlyNewMembers > 0) {
    yoyGrowthPercentageVal = 100.0;
  }

  const yoyGrowthPercentage = {
    currentYtdMembers: yearlyNewMembers,
    priorEquivalentYtdMembers: priorPeriodStudents,
    yoyGrowthPercentage: yoyGrowthPercentageVal,
    periodComparison: `Jan 1 - ${monthNames[now.getMonth()]} ${now.getDate()} (${now.getFullYear()} vs ${now.getFullYear() - 1})`
  };

  // 23. Yearly Member Growth Chart data
  const yearlyMemberGrowthChart = yearlyMembersAgg.map(item => ({
    year: item.year,
    members: item.newMembers
  }));

  // ==========================================
  // SECTION C: Book Popularity Analytics (24-27)
  // ==========================================
  // 24. Month-wise Most Borrowed Books
  const monthWiseMostBorrowed = await Loan.aggregate([
    {
      $project: {
        book_id: '$book_id',
        bDate: { $toDate: '$borrow_date' }
      }
    },
    {
      $match: {
        bDate: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $group: {
        _id: '$book_id',
        borrowCount: { $sum: 1 }
      }
    },
    { $sort: { borrowCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'books',
        let: { bId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$_id', '$$bId'] },
                  { $eq: ['$id', '$$bId'] },
                  { $eq: ['$sqlite_id', '$$bId'] }
                ]
              }
            }
          }
        ],
        as: 'book'
      }
    },
    { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        bookId: '$_id',
        title: { $ifNull: ['$book.title', 'Unknown Title'] },
        author: { $ifNull: ['$book.author', 'Unknown Author'] },
        category: { $ifNull: ['$book.category', 'Uncategorized'] },
        borrowCount: 1
      }
    }
  ]);

  // 25. Month-wise Least Borrowed Books
  const monthWiseLeastBorrowed = await Loan.aggregate([
    {
      $project: {
        book_id: '$book_id',
        bDate: { $toDate: '$borrow_date' }
      }
    },
    {
      $match: {
        bDate: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $group: {
        _id: '$book_id',
        borrowCount: { $sum: 1 }
      }
    },
    { $sort: { borrowCount: 1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'books',
        let: { bId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$_id', '$$bId'] },
                  { $eq: ['$id', '$$bId'] },
                  { $eq: ['$sqlite_id', '$$bId'] }
                ]
              }
            }
          }
        ],
        as: 'book'
      }
    },
    { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        bookId: '$_id',
        title: { $ifNull: ['$book.title', 'Unknown Title'] },
        author: { $ifNull: ['$book.author', 'Unknown Author'] },
        category: { $ifNull: ['$book.category', 'Uncategorized'] },
        borrowCount: 1
      }
    }
  ]);

  // 26. Most Borrowed Book (Overall)
  const mostBorrowedOverallAgg = await Loan.aggregate([
    {
      $group: {
        _id: '$book_id',
        totalBorrows: { $sum: 1 }
      }
    },
    { $sort: { totalBorrows: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: 'books',
        let: { bId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$_id', '$$bId'] },
                  { $eq: ['$id', '$$bId'] },
                  { $eq: ['$sqlite_id', '$$bId'] }
                ]
              }
            }
          }
        ],
        as: 'book'
      }
    },
    { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        bookId: '$_id',
        title: { $ifNull: ['$book.title', 'Unknown Title'] },
        author: { $ifNull: ['$book.author', 'Unknown Author'] },
        category: { $ifNull: ['$book.category', 'Uncategorized'] },
        totalBorrows: 1
      }
    }
  ]);
  const mostBorrowedOverall = mostBorrowedOverallAgg[0] || null;

  // 27. Least Borrowed Book (Overall)
  const leastBorrowedOverallAgg = await Book.aggregate([
    {
      $lookup: {
        from: 'loans',
        let: { bId: '$_id', bSqlId: '$id', bSqliteId: '$sqlite_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$book_id', '$$bId'] },
                  { $eq: ['$book_id', '$$bSqlId'] },
                  { $eq: ['$book_id', '$$bSqliteId'] }
                ]
              }
            }
          }
        ],
        as: 'loans'
      }
    },
    {
      $project: {
        _id: 0,
        bookId: { $ifNull: ['$id', '$_id'] },
        title: '$title',
        author: '$author',
        category: '$category',
        totalBorrows: { $size: '$loans' }
      }
    },
    { $sort: { totalBorrows: 1, title: 1 } },
    { $limit: 1 }
  ]);
  const leastBorrowedOverall = leastBorrowedOverallAgg[0] || null;

  // ==========================================
  // SECTION D: Waiting List Analytics (28-30)
  // ==========================================
  // Active holds strictly filter status IN ['waiting', 'ready_for_pickup']
  const activeReservationsAgg = await Reservation.aggregate([
    {
      $match: {
        status: { $in: ['waiting', 'ready_for_pickup'] }
      }
    },
    {
      $group: {
        _id: '$book_id',
        waitingCount: { $sum: 1 }
      }
    },
    { $sort: { waitingCount: -1 } },
    {
      $lookup: {
        from: 'books',
        let: { bId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$_id', '$$bId'] },
                  { $eq: ['$id', '$$bId'] },
                  { $eq: ['$sqlite_id', '$$bId'] }
                ]
              }
            }
          }
        ],
        as: 'book'
      }
    },
    { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        bookId: '$_id',
        title: { $ifNull: ['$book.title', 'Unknown Title'] },
        author: { $ifNull: ['$book.author', 'Unknown Author'] },
        category: { $ifNull: ['$book.category', 'Uncategorized'] },
        availableCopies: { $ifNull: ['$book.available_copies', 0] },
        totalCopies: { $ifNull: ['$book.total_copies', 0] },
        waitingCount: 1
      }
    }
  ]);

  // 28. Most Requested Books (Active holds)
  const mostRequestedBooks = activeReservationsAgg;

  // 29. Book-wise Waiting List Count (Table of all queued titles)
  const bookWiseWaitingList = activeReservationsAgg;

  // 30. Top 5 Books with Highest Waiting Lists
  const top5HighestWaitingList = activeReservationsAgg.slice(0, 5);

  return {
    sectionA: {
      totalUsers,
      totalBooks,
      totalCopies,
      borrowedToday,
      returnedToday,
      currentlyBorrowed,
      currentlyAvailable
    },
    sectionB: {
      totalMembers,
      monthlyNewMembers,
      yearlyNewMembers,
      lastYearNewMembers,
      currentYearNewMembers,
      monthlyMemberGrowthChart,
      dailyBorrowingReturningChart,
      monthlyBorrowingTrends,
      yearlyBorrowingTrends,
      monthlyMemberRegistrationBarChart,
      yearlyMemberGrowthLineChart,
      bookWiseBorrowingBarChart,
      categoryWiseBorrowingPieChart,
      overallLibraryPerformance,
      yoyGrowthPercentage,
      yearlyMemberGrowthChart
    },
    sectionC: {
      monthWiseMostBorrowed,
      monthWiseLeastBorrowed,
      mostBorrowedOverall,
      leastBorrowedOverall
    },
    sectionD: {
      mostRequestedBooks,
      bookWiseWaitingList,
      top5HighestWaitingList
    }
  };
}

module.exports = {
  computeAdminReports
};

