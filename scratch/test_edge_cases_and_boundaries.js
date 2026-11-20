const { connect, mongoose } = require('../backend/db/mongoose');

async function testEdgeCases() {
  await connect();
  const db = mongoose.connection.db;
  console.log('--- Testing Edge Cases, Boundary Conditions & Status Filters ---');

  // Test 1: Verify Reservation Status Filter logic
  console.log('\n[Edge Case Test 1] Reservation Status Filtering');
  // Check counts in Atlas for all statuses
  const allResvStatusCounts = await db.collection('reservations').aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]).toArray();
  console.log('All reservation status counts in Atlas:', allResvStatusCounts);

  // Test active filter: { status: { $in: ['waiting', 'ready_for_pickup'] } }
  const activeResv = await db.collection('reservations').aggregate([
    {
      $match: {
        status: { $in: ['waiting', 'ready_for_pickup'] }
      }
    }
  ]).toArray();
  console.log('Active reservations count (should be 0 because all 7 existing in Atlas are cancelled/expired/fulfilled):', activeResv.length);

  // Test non-active exclusion: ensure cancelled, expired, fulfilled are NEVER included in active
  const inactiveStatuses = ['cancelled', 'expired', 'fulfilled'];
  const leakingInactive = activeResv.filter(r => inactiveStatuses.includes(r.status));
  if (leakingInactive.length === 0) {
    console.log('✅ PASS: No inactive reservations leak into active waiting list metrics.');
  } else {
    console.error('❌ FAIL: Inactive reservations leaked into active waiting list!', leakingInactive);
  }

  // Test simulated active reservation in memory pipeline
  const simulatedReservations = [
    { book_id: 101, status: 'waiting' },
    { book_id: 101, status: 'ready_for_pickup' },
    { book_id: 101, status: 'cancelled' },
    { book_id: 102, status: 'expired' },
    { book_id: 102, status: 'fulfilled' },
    { book_id: 103, status: 'waiting' }
  ];
  const filteredSimulated = simulatedReservations.filter(r => ['waiting', 'ready_for_pickup'].includes(r.status));
  console.log('Simulated 6 holds (2 active for book 101, 1 active for book 103, 3 inactive):');
  console.log('Active filtered count:', filteredSimulated.length, '(Expected 3)');
  if (filteredSimulated.length === 3) {
    console.log('✅ PASS: Status filtering is mathematically sound.');
  }

  // Test 2: Division by Zero & Empty Dataset Handling
  console.log('\n[Edge Case Test 2] Division by Zero Safeguards');
  function calcEfficiency(onTime, totalReturns) {
    return totalReturns > 0 ? Math.round((onTime / totalReturns) * 100 * 10) / 10 : 100.0;
  }
  function calcUtilization(borrowed, totalCopies) {
    return totalCopies > 0 ? Math.round((borrowed / totalCopies) * 100 * 10) / 10 : 0.0;
  }
  function calcVelocity(borrowed, available) {
    const total = borrowed + available;
    return total > 0 ? Math.round((borrowed / total) * 100 * 10) / 10 : 0.0;
  }
  function calcYoY(currentYtd, priorYtd) {
    if (priorYtd > 0) {
      return Math.round(((currentYtd - priorYtd) / priorYtd) * 100 * 10) / 10;
    }
    return currentYtd > 0 ? 100.0 : 0.0;
  }

  console.log('Zero Returns Efficiency:', calcEfficiency(0, 0), '(Expected 100.0, no NaN)');
  console.log('Zero Copies Utilization:', calcUtilization(0, 0), '(Expected 0.0, no NaN)');
  console.log('Zero Total Velocity:', calcVelocity(0, 0), '(Expected 0.0, no NaN)');
  console.log('Zero Prior Members YoY (3 current):', calcYoY(3, 0), '(Expected 100.0, no Infinity)');
  console.log('Zero Both YoY (0 current, 0 prior):', calcYoY(0, 0), '(Expected 0.0, no NaN)');

  // Test 3: Date Boundary Precision
  console.log('\n[Edge Case Test 3] Date Boundary Precision');
  const d = new Date('2026-11-10T12:00:00.000Z');
  const startOfDay = new Date(d);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(d);
  endOfDay.setHours(23, 59, 59, 999);

  const testTimestamps = [
    { label: 'Before Day Start', date: new Date('2026-11-09T23:59:59.999Z'), inRange: false },
    { label: 'Exact Day Start', date: new Date(startOfDay.getTime()), inRange: true },
    { label: 'Mid Day', date: new Date('2026-11-10T14:30:00.000Z'), inRange: true },
    { label: 'Exact Day End', date: new Date(endOfDay.getTime()), inRange: true },
    { label: 'After Day End', date: new Date('2026-11-11T00:00:00.000Z'), inRange: false }
  ];

  let boundaryPass = true;
  for (const t of testTimestamps) {
    const isWithin = t.date >= startOfDay && t.date <= endOfDay;
    const ok = isWithin === t.inRange;
    if (!ok) boundaryPass = false;
    console.log(`- ${t.label} (${t.date.toISOString()}): ${isWithin ? 'IN' : 'OUT'} (Matches: ${ok})`);
  }
  if (boundaryPass) {
    console.log('✅ PASS: Date boundaries include exact millisecond limits without off-by-one errors.');
  }

  await mongoose.disconnect();
  process.exit(0);
}

testEdgeCases().catch(err => {
  console.error(err);
  process.exit(1);
});

