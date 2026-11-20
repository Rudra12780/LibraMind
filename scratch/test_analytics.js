const db = require('../backend/db/database');

console.log('=== TESTING HIGHLIGHT QUERIES ===');
const mb = db.prepare('SELECT b.id, b.title, b.author, b.cover_image, COUNT(l.id) as total_borrows FROM books b JOIN loans l ON b.id = l.book_id GROUP BY b.id ORDER BY total_borrows DESC LIMIT 1').get();
console.log('Most borrowed:', mb);

const tb = db.prepare("SELECT b.id, b.title, b.author, b.cover_image, COUNT(l.id) as monthly_borrows FROM books b JOIN loans l ON b.id = l.book_id WHERE strftime('%Y-%m', l.borrow_date) = strftime('%Y-%m', 'now') GROUP BY b.id ORDER BY monthly_borrows DESC LIMIT 1").get();
console.log('Trending this month:', tb);

const wl = db.prepare("SELECT b.id, b.title, b.author, b.cover_image, COUNT(r.id) as waitlist_count FROM books b JOIN reservations r ON b.id = r.book_id WHERE r.status IN ('waiting', 'ready_for_pickup') GROUP BY b.id ORDER BY waitlist_count DESC LIMIT 1").get();
console.log('Waitlist top:', wl);

const usersYear = db.prepare(`
  SELECT 
    SUM(CASE WHEN strftime('%Y', created_at) = strftime('%Y', 'now') THEN 1 ELSE 0 END) as current_year_users,
    SUM(CASE WHEN strftime('%Y', created_at) = strftime('%Y', 'now', '-1 year') AND strftime('%m-%d', created_at) <= strftime('%m-%d', 'now') THEN 1 ELSE 0 END) as prev_year_equivalent_users,
    SUM(CASE WHEN strftime('%Y', created_at) = strftime('%Y', 'now', '-1 year') THEN 1 ELSE 0 END) as prev_year_total_users
  FROM users
`).get();
console.log('Users Year comparison:', usersYear);

