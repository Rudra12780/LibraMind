const db = require('./database.js');

function increaseAllBookCopies() {
  console.log('Beginning book copy expansion for all catalog books...');
  const books = db.prepare('SELECT id, title, category, total_copies, available_copies FROM books').all();
  
  const insertCopy = db.prepare(`
    INSERT INTO book_copies (book_id, copy_code, status, condition)
    VALUES (?, ?, 'available', 'New')
  `);
  
  const updateBook = db.prepare(`
    UPDATE books SET total_copies = ?, available_copies = ? WHERE id = ?
  `);

  let totalAdded = 0;
  const updateTx = db.transaction(() => {
    for (const b of books) {
      // Ensure each book has at least 6 total copies and at least 4 available copies
      const targetTotal = Math.max(b.total_copies + 3, 6);
      const addedCount = targetTotal - b.total_copies;
      
      if (addedCount > 0) {
        // Find existing copy numbers to avoid code collisions
        const existingCodes = db.prepare('SELECT copy_code FROM book_copies WHERE book_id = ?').all(b.id).map(c => c.copy_code);
        let nextIndex = existingCodes.length + 1;
        
        for (let i = 0; i < addedCount; i++) {
          const catPrefix = (b.category || 'BK').substring(0, 2).toUpperCase();
          let copyCode = `LM-${catPrefix}-${b.id}-C${nextIndex}`;
          while (existingCodes.includes(copyCode)) {
            nextIndex++;
            copyCode = `LM-${catPrefix}-${b.id}-C${nextIndex}`;
          }
          existingCodes.push(copyCode);
          insertCopy.run(b.id, copyCode);
          totalAdded++;
        }

        const newAvailable = b.available_copies + addedCount;
        updateBook.run(targetTotal, newAvailable, b.id);
      }
    }
  });

  updateTx();
  console.log(`Successfully expanded book catalog: added ${totalAdded} physical copies across ${books.length} titles.`);

  const stats = db.prepare('SELECT count(*) as totalBooks, sum(total_copies) as totalCopies, sum(available_copies) as totalAvail, min(total_copies) as minTotal, min(available_copies) as minAvail FROM books').get();
  console.log('Updated Book Stats:', stats);
  const copyCount = db.prepare('SELECT count(*) as totalCopyRecords FROM book_copies').get();
  console.log('Total Physical Copy Records:', copyCount);
}

increaseAllBookCopies();
