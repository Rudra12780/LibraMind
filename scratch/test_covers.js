const path = require('path');
const db = require(path.join(process.cwd(), 'backend', 'node_modules', 'better-sqlite3'))(path.join(process.cwd(), 'backend', 'libramind.db'));
const fs = require('fs');
const books = db.prepare('SELECT id, title, author, category, cover_image FROM books ORDER BY title ASC LIMIT 100').all();

console.log('Total books:', books.length);
books.slice(20, 45).forEach((b, i) => {
  const p = path.join(process.cwd(), 'backend', b.cover_image.replace(/^\//, ''));
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  console.log(i + 20, b.id, b.title, b.cover_image, exists ? `(${size}B)` : 'MISSING');
});
