const path = require('path');
const db = require(path.join(process.cwd(), 'backend', 'node_modules', 'better-sqlite3'))(path.join(process.cwd(), 'backend', 'libramind.db'));

// Test queryBooksFromSqlite
const sql = 'SELECT * FROM books WHERE 1=1 ORDER BY title ASC LIMIT 200';
const books = db.prepare(sql).all();
console.log('Total books returned by SQL:', books.length);

// Verify Book 6
const b6 = books.find(b => b.id === 6);
console.log('Book 6 title:', b6?.title, 'cover:', b6?.cover_image);

// Check if any books have undefined or empty cover_image
const bad = books.filter(b => !b.cover_image);
console.log('Books missing cover_image:', bad.length);
