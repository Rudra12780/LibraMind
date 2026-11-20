const { connect, mongoose } = require('../backend/db/mongoose');
const Book = require('../backend/models/Book');
const BookCopy = require('../backend/models/BookCopy');
const Loan = require('../backend/models/Loan');
const Reservation = require('../backend/models/Reservation');
const User = require('../backend/models/User');
const Seat = require('../backend/models/Seat');

async function testAllAnalytics() {
  await connect();
  const db = mongoose.connection.db;
  console.log('--- Testing 30 Analytics Aggregation Pipelines against Live Atlas ---');

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
  const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

  // Equivalent date last year
  const priorEquivalentYtdEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

  console.log('Date Boundaries:');
  console.log('Today:', startOfToday.toISOString(), 'to', endOfToday.toISOString());
  console.log('This Month:', startOfMonth.toISOString(), 'to', endOfMonth.toISOString());
  console.log('This Year:', startOfYear.toISOString(), 'to', endOfYear.toISOString());
  console.log('Last Year:', startOfLastYear.toISOString(), 'to', endOfLastYear.toISOString());
  console.log('Prior Equivalent YTD End:', priorEquivalentYtdEnd.toISOString());

  // ==========================================
  // SECTION A: Main Dashboard Statistics (1-7)
  // ==========================================
  console.log('\n--- Section A: Main Dashboard Statistics ---');
  // 1. Total Registered Users
  const totalUsers = await User.countDocuments();
  console.log('1. Total Registered Users:', totalUsers);

  // 2. Total Books (Titles)
  const totalBooks = await Book.countDocuments();
  console.log('2. Total Books (Titles):', totalBooks);

  // 3. Total Book Copies
  const totalCopies = await BookCopy.countDocuments();
  console.log('3. Total Book Copies:', totalCopies);

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
  console.log('4. Total Books Borrowed Today:', borrowedToday);

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
  console.log('5. Total Books Returned Today:', returnedToday);

  // 6. Currently Borrowed Books (Active / Overdue)
  const currentlyBorrowed = await Loan.countDocuments({ status: { $in: ['active', 'borrowed', 'overdue'] } });
  console.log('6. Currently Borrowed Books:', currentlyBorrowed);

  // 7. Currently Available Books
  const currentlyAvailable = await BookCopy.countDocuments({ status: 'available' });
  console.log('7. Currently Available Books:', currentlyAvailable);

  // ========================================================
  // SECTION B: Member Registration & Growth Analytics (8-23)
  // ========================================================
  console.log('\n--- Section B: Member Registration & Growth Analytics ---');
  // 8. Total Registered Members (Students)
  const totalMembers = await User.countDocuments({ role: 'student' });
  console.log('8. Total Registered Members (Students):', totalMembers);

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
  console.log('9. Monthly New Member Registrations:', monthlyNewMembers);

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
  console.log('10. Yearly New Member Registrations:', yearlyNewMembers);

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
  console.log("11. Last Year's Total New Members:", lastYearNewMembers);

  // 12. Current Year's Total New Members (Year-to-Date)
  const currentYearNewMembers = yearlyNewMembers;
  console.log("12. Current Year's Total New Members:", currentYearNewMembers);

  // 13. Monthly Member Growth Chart data (Grouped by %Y-%m)
  const monthlyMemberGrowth = await User.aggregate([
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
  console.log('13. Monthly Member Growth Chart data:', monthlyMemberGrowth);

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

  // Build continuous 14-day date list
  const dailyChartData = [];
  const bMap = new Map((dailyBorrowReturns[0]?.borrowed || []).map(b => [b._id, b.count]));
  const rMap = new Map((dailyBorrowReturns[0]?.returned || []).map(r => [r._id, r.count]));

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    dailyChartData.push({
      date: dateStr,
      borrowed: bMap.get(dateStr) || 0,
      returned: rMap.get(dateStr) || 0
    });
  }
  console.log('14. Daily Borrowing & Returning Chart data (14 days, sample 3):', dailyChartData.slice(-3));

  // 15. Monthly Borrowing Trends (12-month series)
  const monthlyBorrowingTrends = await Loan.aggregate([
    {
      $project: {
        status: '$status',
        bMonth: { $dateToString: { format: '%Y-%m', date: { $toDate: '$borrow_date' } } },
        rMonth: {
          $cond: [
            { $and: [{ $eq: ['$status', 'returned'] }, { $ifNull: ['$return_date', false] }] },
            { $dateToString: { format: '%Y-%m', date: { $toDate: '$return_date' } } },
            null
          ]
        }
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
  console.log('15. Monthly Borrowing Trends:', monthlyBorrowingTrends);

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
  console.log('16. Yearly Borrowing Trends:', yearlyBorrowingTrends);

  // 17. Monthly Member Registration Bar Chart data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyMemberBarChart = monthlyMemberGrowth.map(item => {
    const parts = item.month.split('-');
    const label = `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    return {
      monthKey: item.month,
      label,
      members: item.members
    };
  });
  console.log('17. Monthly Member Registration Bar Chart data:', monthlyMemberBarChart);

  // 18. Yearly Member Growth Line Chart data (Cumulative)
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

  let runningTotal = 0;
  const yearlyMemberGrowthLineChart = yearlyMembersAgg.map(item => {
    runningTotal += item.newMembers;
    return {
      year: item.year,
      newMembers: item.newMembers,
      cumulativeMembers: runningTotal
    };
  });
  console.log('18. Yearly Member Growth Line Chart data:', yearlyMemberGrowthLineChart);

  // 19. Book-wise Borrowing Bar Chart (Top 10 borrowed titles)
  const bookWiseBorrowing = await Loan.aggregate([
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
  console.log('19. Book-wise Borrowing Bar Chart (Top 10, sample 2):', bookWiseBorrowing.slice(0, 2));

  // 20. Category-wise Borrowing Pie Chart
  const totalLoansCount = await Loan.countDocuments();
  const categoryBorrowingAgg = await Loan.aggregate([
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
  console.log('20. Category-wise Borrowing Pie Chart:', categoryBorrowingAgg);

  // 21. Overall Library Performance Dashboard
  // - Circulation Velocity: Active Loans / Total Available Inventory (%)
  // - Return Efficiency: (On-time returns / Total Returns) * 100 (%)
  // - Copy Utilization: (Currently Borrowed / Total Physical Copies) * 100 (%)
  const totalReturnedLoans = await Loan.countDocuments({ status: 'returned' });
  
  // On-time returns: return_date <= due_date or fine_amount == 0
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
    : 100;

  const copyUtilization = totalCopies > 0 
    ? Math.round((currentlyBorrowed / totalCopies) * 100 * 10) / 10 
    : 0;

  const circulationVelocity = (currentlyAvailable + currentlyBorrowed) > 0
    ? Math.round((currentlyBorrowed / (currentlyAvailable + currentlyBorrowed)) * 100 * 10) / 10
    : 0;

  const overallPerformance = {
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
  console.log('21. Overall Library Performance Dashboard:', overallPerformance);

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

  let yoyGrowthPercentage = 0;
  if (priorPeriodStudents > 0) {
    yoyGrowthPercentage = Math.round(((yearlyNewMembers - priorPeriodStudents) / priorPeriodStudents) * 100 * 10) / 10;
  } else if (yearlyNewMembers > 0) {
    yoyGrowthPercentage = 100.0;
  }
  const yoyGrowthMetric = {
    currentYtdMembers: yearlyNewMembers,
    priorEquivalentYtdMembers: priorPeriodStudents,
    yoyGrowthPercentage,
    periodComparison: `Jan 1 - ${monthNames[now.getMonth()]} ${now.getDate()} (${now.getFullYear()} vs ${now.getFullYear() - 1})`
  };
  console.log('22. Year-over-Year Growth Percentage:', yoyGrowthMetric);

  // 23. Yearly Member Growth Chart data (Multi-year distribution)
  const yearlyMemberGrowthChart = yearlyMembersAgg.map(item => ({
    year: item.year,
    members: item.newMembers
  }));
  console.log('23. Yearly Member Growth Chart data:', yearlyMemberGrowthChart);

  // ==========================================
  // SECTION C: Book Popularity Analytics (24-27)
  // ==========================================
  console.log('\n--- Section C: Book Popularity Analytics ---');
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
    { $limit: 5 },
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
  console.log('24. Month-wise Most Borrowed Books:', monthWiseMostBorrowed);

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
    { $limit: 5 },
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
  console.log('25. Month-wise Least Borrowed Books:', monthWiseLeastBorrowed);

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
  console.log('26. Most Borrowed Book (Overall):', mostBorrowedOverall);

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
  console.log('27. Least Borrowed Book (Overall):', leastBorrowedOverall);

  // ==========================================
  // SECTION D: Waiting List Analytics (28-30)
  // ==========================================
  console.log('\n--- Section D: Waiting List Analytics ---');
  // 28. Most Requested Books (Active holds: waiting, ready_for_pickup)
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
  const mostRequestedBooks = activeReservationsAgg;
  console.log('28. Most Requested Books (Active holds count):', mostRequestedBooks.length);

  // 29. Book-wise Waiting List Count (Table of all queued titles)
  const bookWiseWaitingList = activeReservationsAgg;
  console.log('29. Book-wise Waiting List Count records:', bookWiseWaitingList.length);

  // 30. Top 5 Books with Highest Waiting Lists
  const top5HighestWaitingList = activeReservationsAgg.slice(0, 5);
  console.log('30. Top 5 Books with Highest Waiting Lists count:', top5HighestWaitingList.length);

  console.log('\n--- ALL 30 ANALYTICS COMPILED SUCCESSFULLY ---');
  await mongoose.disconnect();
  process.exit(0);
}

testAllAnalytics().catch(err => {
  console.error('Error testing analytics:', err);
  process.exit(1);
});
