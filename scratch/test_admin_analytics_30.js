const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const jwt = require('../backend/node_modules/jsonwebtoken');
const { connect, mongoose } = require('../backend/db/mongoose');
const { computeAdminReports } = require('../backend/utils/analyticsEngine');
const express = require('../backend/node_modules/express');
const analyticsRouter = require('../backend/routes/analytics');

async function test30AdminAnalytics() {
  console.log('================================================================');
  console.log('  MILESTONE 3: 30 LIVE ADMIN ANALYTICS COMPREHENSIVE TEST SUITE');
  console.log('================================================================\n');

  await connect();

  // Step 1: Direct Execution of computeAdminReports()
  console.log('>> Executing computeAdminReports() against Live MongoDB Atlas...');
  const t0 = Date.now();
  const data = await computeAdminReports();
  const elapsed = Date.now() - t0;
  console.log(`>> Execution finished in ${elapsed}ms\n`);

  // Step 2: Verification Checklist for All 30 Features
  const checklist = [
    // Section A: Main Dashboard Statistics (7)
    { id: 1, section: 'A', name: 'Total Registered Users', val: data.sectionA.totalUsers, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 2, section: 'A', name: 'Total Books (Titles)', val: data.sectionA.totalBooks, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 3, section: 'A', name: 'Total Book Copies', val: data.sectionA.totalCopies, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 4, section: 'A', name: 'Total Books Borrowed Today', val: data.sectionA.borrowedToday, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 5, section: 'A', name: 'Total Books Returned Today', val: data.sectionA.returnedToday, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 6, section: 'A', name: 'Currently Borrowed Books', val: data.sectionA.currentlyBorrowed, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 7, section: 'A', name: 'Currently Available Books', val: data.sectionA.currentlyAvailable, type: 'number', test: d => typeof d === 'number' && d >= 0 },

    // Section B: Member Registration & Growth Analytics (16)
    { id: 8, section: 'B', name: 'Total Registered Members (Students)', val: data.sectionB.totalMembers, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 9, section: 'B', name: 'Monthly New Member Registrations', val: data.sectionB.monthlyNewMembers, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 10, section: 'B', name: 'Yearly New Member Registrations', val: data.sectionB.yearlyNewMembers, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 11, section: 'B', name: "Last Year's Total New Members", val: data.sectionB.lastYearNewMembers, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 12, section: 'B', name: "Current Year's Total New Members", val: data.sectionB.currentYearNewMembers, type: 'number', test: d => typeof d === 'number' && d >= 0 },
    { id: 13, section: 'B', name: 'Monthly Member Growth Chart data', val: data.sectionB.monthlyMemberGrowthChart, type: 'array', test: d => Array.isArray(d) },
    { id: 14, section: 'B', name: 'Daily Borrowing & Returning Chart data', val: data.sectionB.dailyBorrowingReturningChart, type: 'array (14 days)', test: d => Array.isArray(d) && d.length === 14 },
    { id: 15, section: 'B', name: 'Monthly Borrowing Trends', val: data.sectionB.monthlyBorrowingTrends, type: 'array', test: d => Array.isArray(d) },
    { id: 16, section: 'B', name: 'Yearly Borrowing Trends', val: data.sectionB.yearlyBorrowingTrends, type: 'array', test: d => Array.isArray(d) },
    { id: 17, section: 'B', name: 'Monthly Member Registration Bar Chart data', val: data.sectionB.monthlyMemberRegistrationBarChart, type: 'array', test: d => Array.isArray(d) },
    { id: 18, section: 'B', name: 'Yearly Member Growth Line Chart data', val: data.sectionB.yearlyMemberGrowthLineChart, type: 'array', test: d => Array.isArray(d) },
    { id: 19, section: 'B', name: 'Book-wise Borrowing Bar Chart (Top 10)', val: data.sectionB.bookWiseBorrowingBarChart, type: 'array (<= 10)', test: d => Array.isArray(d) && d.length <= 10 },
    { id: 20, section: 'B', name: 'Category-wise Borrowing Pie Chart', val: data.sectionB.categoryWiseBorrowingPieChart, type: 'array', test: d => Array.isArray(d) },
    { id: 21, section: 'B', name: 'Overall Library Performance Dashboard', val: data.sectionB.overallLibraryPerformance, type: 'object', test: d => d && typeof d.circulationVelocity?.value === 'number' && typeof d.returnEfficiency?.value === 'number' && typeof d.copyUtilization?.value === 'number' },
    { id: 22, section: 'B', name: 'Year-over-Year (YoY) Growth Percentage', val: data.sectionB.yoyGrowthPercentage, type: 'object', test: d => d && typeof d.yoyGrowthPercentage === 'number' && !isNaN(d.yoyGrowthPercentage) },
    { id: 23, section: 'B', name: 'Yearly Member Growth Chart data', val: data.sectionB.yearlyMemberGrowthChart, type: 'array', test: d => Array.isArray(d) },

    // Section C: Book Popularity Analytics (4)
    { id: 24, section: 'C', name: 'Month-wise Most Borrowed Books', val: data.sectionC.monthWiseMostBorrowed, type: 'array', test: d => Array.isArray(d) },
    { id: 25, section: 'C', name: 'Month-wise Least Borrowed Books', val: data.sectionC.monthWiseLeastBorrowed, type: 'array', test: d => Array.isArray(d) },
    { id: 26, section: 'C', name: 'Most Borrowed Book (Overall)', val: data.sectionC.mostBorrowedOverall, type: 'object or null', test: d => d === null || (typeof d === 'object' && d.title && typeof d.totalBorrows === 'number') },
    { id: 27, section: 'C', name: 'Least Borrowed Book (Overall)', val: data.sectionC.leastBorrowedOverall, type: 'object or null', test: d => d === null || (typeof d === 'object' && d.title && typeof d.totalBorrows === 'number') },

    // Section D: Waiting List Analytics (3)
    { id: 28, section: 'D', name: 'Most Requested Books (Active holds)', val: data.sectionD.mostRequestedBooks, type: 'array', test: d => Array.isArray(d) },
    { id: 29, section: 'D', name: 'Book-wise Waiting List Count', val: data.sectionD.bookWiseWaitingList, type: 'array', test: d => Array.isArray(d) },
    { id: 30, section: 'D', name: 'Top 5 Books with Highest Waiting Lists', val: data.sectionD.top5HighestWaitingList, type: 'array (<= 5)', test: d => Array.isArray(d) && d.length <= 5 }
  ];

  let passedCount = 0;
  console.log('| ID | Sec | Metric Name | Type | Value / Summary | Status |');
  console.log('|---|---|---|---|---|---|');

  checklist.forEach(item => {
    const passed = item.test(item.val);
    if (passed) passedCount++;
    const status = passed ? '✅ Tested' : '❌ Failed';
    let valStr = '';
    if (typeof item.val === 'number') {
      valStr = String(item.val);
    } else if (Array.isArray(item.val)) {
      valStr = `Array(${item.val.length} items)`;
    } else if (typeof item.val === 'object' && item.val !== null) {
      if (item.val.title) valStr = `"${item.val.title.slice(0, 20)}..." (${item.val.totalBorrows} borrows)`;
      else if (item.val.yoyGrowthPercentage !== undefined) valStr = `${item.val.yoyGrowthPercentage}%`;
      else if (item.val.circulationVelocity) valStr = `V:${item.val.circulationVelocity.value}% E:${item.val.returnEfficiency.value}% U:${item.val.copyUtilization.value}%`;
      else valStr = 'Object';
    } else {
      valStr = String(item.val);
    }
    console.log(`| ${item.id} | ${item.section} | ${item.name} | ${item.type} | ${valStr} | ${status} |`);
  });

  console.log(`\nVerification Score: ${passedCount} / ${checklist.length} Passed`);

  // Step 3: Express HTTP Route Integration Test
  console.log('\n>> Testing Express HTTP Endpoint: GET /api/analytics/admin-reports ...');
  const app = express();
  app.use(express.json());
  app.use('/api/analytics', analyticsRouter);

  const server = app.listen(0);
  const port = server.address().port;

  // Generate Admin JWT
  const JWT_SECRET = process.env.JWT_SECRET || 'secret';
  const adminToken = jwt.sign({ id: 1, role: 'admin', email: 'admin@libramind.edu' }, JWT_SECRET, { expiresIn: '1h' });
  const studentToken = jwt.sign({ id: 3, role: 'student', email: 'student@libramind.edu' }, JWT_SECRET, { expiresIn: '1h' });

  // Test 3a: Unauthorized (No token)
  const resNoAuth = await fetch(`http://127.0.0.1:${port}/api/analytics/admin-reports`);
  console.log(`1. HTTP GET /admin-reports (No Token) -> Status: ${resNoAuth.status} (Expected: 401)`);

  // Test 3b: Forbidden (Student token)
  const resStudent = await fetch(`http://127.0.0.1:${port}/api/analytics/admin-reports`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  console.log(`2. HTTP GET /admin-reports (Student Token) -> Status: ${resStudent.status} (Expected: 403)`);

  // Test 3c: Authorized (Admin token)
  const resAdmin = await fetch(`http://127.0.0.1:${port}/api/analytics/admin-reports`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`3. HTTP GET /admin-reports (Admin Token) -> Status: ${resAdmin.status} (Expected: 200)`);
  const adminBody = await resAdmin.json();

  console.log('   Response Success:', adminBody.success);
  console.log('   Data Source:', adminBody.dataSource);
  console.log('   Has Section A:', Boolean(adminBody.sectionA));
  console.log('   Has Section B:', Boolean(adminBody.sectionB));
  console.log('   Has Section C:', Boolean(adminBody.sectionC));
  console.log('   Has Section D:', Boolean(adminBody.sectionD));

  // Test 3d: Public charts and overview
  const resOverview = await fetch(`http://127.0.0.1:${port}/api/analytics/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`4. HTTP GET /overview -> Status: ${resOverview.status} (Expected: 200)`);

  const resCharts = await fetch(`http://127.0.0.1:${port}/api/analytics/charts`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`5. HTTP GET /charts -> Status: ${resCharts.status} (Expected: 200)`);
  const chartsBody = await resCharts.json();
  console.log('   Charts historical source:', chartsBody.forecastMeta?.historicalSource);

  server.close();
  await mongoose.disconnect();

  if (passedCount === 30 && resAdmin.status === 200 && resNoAuth.status === 401 && resStudent.status === 403) {
    console.log('\n================================================================');
    console.log('  ✅ ALL 30 ADMIN ANALYTICS FEATURES FULLY VERIFIED & TESTED');
    console.log('================================================================\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME CHECKS FAILED');
    process.exit(1);
  }
}

test30AdminAnalytics().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
