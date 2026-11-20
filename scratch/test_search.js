const sqliteDb = require('../backend/db/database');

['Woolf', 'Borges', 'Turing', 'Dostoevsky', 'Austen', 'Orwell'].forEach(author => {
  let sql = 'SELECT * FROM books WHERE 1=1';
  const params = [];
  sql += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ? OR description LIKE ? OR category LIKE ?)';
  const term = `%${author.trim()}%`;
  params.push(term, term, term, term, term);
  const books = sqliteDb.prepare(sql).all(...params);
  console.log(`Query "${author}": ${books.length} books found:`, books.map(b => `${b.id}: ${b.title}`));
});
