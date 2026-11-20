const sqliteDb = require('../backend/db/database');

// Simulate what api.getBooks({ limit: 80 }) returns
const catalogBooks = sqliteDb.prepare('SELECT * FROM books LIMIT 80').all();

const literaryAuthors = [
  { name: 'Virginia Woolf', query: 'Woolf' },
  { name: 'Jorge Luis Borges', query: 'Borges' },
  { name: 'Alan M. Turing', query: 'Turing' },
  { name: 'Fyodor Dostoevsky', query: 'Dostoevsky' },
  { name: 'Jane Austen', query: 'Austen' },
  { name: 'George Orwell', query: 'Orwell' }
];

const getAuthorBooks = (query, staticFallback = []) => {
  if (!catalogBooks || catalogBooks.length === 0) return staticFallback;
  const q = (query || '').toLowerCase().trim();
  if (!q) return staticFallback;
  const matched = catalogBooks.filter(b => 
    (b.author && b.author.toLowerCase().includes(q)) || 
    (b.title && b.title.toLowerCase().includes(q))
  );
  return matched.length > 0 ? matched.slice(0, 2) : staticFallback;
};

literaryAuthors.forEach(a => {
  const books = getAuthorBooks(a.query);
  console.log(`${a.name}: ${books.length} books found:`, books.map(b => `${b.id}: "${b.title}" by ${b.author}`));
});
