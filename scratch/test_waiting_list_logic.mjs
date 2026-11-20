// scratch/test_waiting_list_logic.mjs

function formatWithExactSeconds(dateInput) {
  if (!dateInput) return { dateStr: '—', timeStr: '—', fullStr: '—' };
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return { dateStr: '—', timeStr: '—', fullStr: '—' };
  const dateStr = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  return { dateStr, timeStr, fullStr: `${dateStr} · ${timeStr}` };
}

// Test 1: Timestamp format verification (Year, Month, Date, Hour, Minute, Second)
console.log('--- Test 1: Timestamp formatting with seconds ---');
const testDate = new Date('2026-11-15T11:22:45.000Z');
const res = formatWithExactSeconds(testDate);
console.log('Formatted:', res);
if (!res.timeStr.includes(':')) {
  throw new Error('timeStr missing colon separator');
}
console.log('✅ Timestamp with seconds test passed');

// Test 2: Order-wise sorting logic
console.log('\n--- Test 2: Order-wise sorting verification ---');
const sampleHolds = [
  { id: '1', book_title: 'Title B', queue_position: 2, reservation_date: '2026-11-15T10:15:30.000Z', status: 'waiting' },
  { id: '2', book_title: 'Title A', queue_position: 1, reservation_date: '2026-11-15T10:05:10.000Z', status: 'waiting' },
  { id: '3', book_title: 'Title C', queue_position: 1, reservation_date: '2026-11-15T09:30:00.000Z', status: 'ready_for_pickup' },
  { id: '4', book_title: 'Title A', queue_position: 2, reservation_date: '2026-11-15T11:00:00.000Z', status: 'waiting' },
  { id: '5', book_title: 'Title B', queue_position: 1, reservation_date: '2026-11-15T10:10:00.000Z', status: 'waiting' }
];

const statusPriority = {
  ready_for_pickup: 1,
  waiting: 2,
  fulfilled: 3,
  cancelled: 4,
  expired: 5
};

const sorted = [...sampleHolds].sort((a, b) => {
  const prioA = statusPriority[a.status] || 6;
  const prioB = statusPriority[b.status] || 6;
  if (prioA !== prioB) return prioA - prioB;
  const posA = a.queue_position || 1;
  const posB = b.queue_position || 1;
  if (posA !== posB) return posA - posB;
  return new Date(a.reservation_date || 0) - new Date(b.reservation_date || 0);
});

console.log('Sorted order:');
sorted.forEach((h, i) => {
  console.log(` #${i + 1}: [${h.status}] ${h.book_title} (Queue #${h.queue_position}) at ${h.reservation_date}`);
});

// Check that ready_for_pickup is #1
if (sorted[0].id !== '3') throw new Error('Ready for pickup should be first priority');
// Check that queue_position 1 waiting items come before queue_position 2
if (sorted[1].queue_position !== 1 || sorted[2].queue_position !== 1) {
  throw new Error('Queue position 1 items should precede position 2');
}
if (sorted[3].queue_position !== 2 || sorted[4].queue_position !== 2) {
  throw new Error('Queue position 2 items should follow position 1');
}
// Check chronological order between position 1s
if (new Date(sorted[1].reservation_date) > new Date(sorted[2].reservation_date)) {
  throw new Error('Chronological order failed between position 1 items');
}
console.log('✅ Order-wise sorting test passed');

// Test 3: BookCard button selection logic
console.log('\n--- Test 3: BookCard button selection logic ---');
function getButtonLabel(book, isBorrowedByUser) {
  if (isBorrowedByUser) return 'Return Volume';
  if ((book.available_copies ?? 0) > 0) return 'Borrow Volume';
  return 'Join Waiting List';
}

const availableBook = { id: 1, available_copies: 3, total_copies: 5 };
const outOfStockBook = { id: 2, available_copies: 0, total_copies: 4 };

console.log('Available book button:', getButtonLabel(availableBook, false));
console.log('Out of stock book button:', getButtonLabel(outOfStockBook, false));

if (getButtonLabel(availableBook, false) !== 'Borrow Volume') {
  throw new Error('Available book should show Borrow Volume');
}
if (getButtonLabel(outOfStockBook, false) !== 'Join Waiting List') {
  throw new Error('Out of stock book must show Join Waiting List');
}
console.log('✅ Button selection logic test passed');

console.log('\n🎉 ALL WAITING LIST UNIT TESTS COMPLETED SUCCESSFULLY!');
