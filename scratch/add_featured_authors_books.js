const Database = require('../backend/node_modules/better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('backend/libramind.db');
const uploadsDir = path.resolve('backend/uploads');
const publicUploadsDir = path.resolve('frontend/public/uploads');

const newBooks = [
  {
    title: 'To the Lighthouse',
    author: 'Virginia Woolf',
    isbn: '9780156907392',
    publisher: 'Hogarth Press',
    publication_year: 1927,
    category: 'Novels & Fiction',
    edition: 'Definitive Archival Edition',
    description: 'A landmark modernist masterpiece exploring the Ramsay family visits to the Isle of Skye, human perception, and the passage of time through revolutionary stream of consciousness.',
    floor: 'Floor 2',
    section: 'Modernist Archive',
    shelf: 'Shelf W-01',
    rack: 'Rack 04',
    total_copies: 3,
    available_copies: 2
  },
  {
    title: 'Mrs Dalloway',
    author: 'Virginia Woolf',
    isbn: '9780156628709',
    publisher: 'Hogarth Press',
    publication_year: 1925,
    category: 'Classic Literature',
    edition: 'Centennial Edition',
    description: 'A vivid, luminous day in the life of Clarissa Dalloway in post-World War I London, interweaving memory, regret, and interior monologue.',
    floor: 'Floor 2',
    section: 'Modernist Archive',
    shelf: 'Shelf W-02',
    rack: 'Rack 04',
    total_copies: 2,
    available_copies: 2
  },
  {
    title: 'Ficciones',
    author: 'Jorge Luis Borges',
    isbn: '9780802130303',
    publisher: 'Editorial Sur',
    publication_year: 1944,
    category: 'Philosophy & Ethics',
    edition: 'Annotated Library Edition',
    description: 'A profound collection of labyrinthine parables, infinite libraries, philosophical puzzles, and fictional universes questioning the nature of reality and writing.',
    floor: 'Floor 3',
    section: 'Philosophical Vault',
    shelf: 'Shelf B-07',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'Labyrinths: Selected Stories & Other Writings',
    author: 'Jorge Luis Borges',
    isbn: '9780811216999',
    publisher: 'New Directions',
    publication_year: 1962,
    category: 'Philosophy & Ethics',
    edition: 'Expanded Edition',
    description: 'Essential bibliographic myths including The Library of Babel, The Garden of Forking Paths, and Tlön, Uqbar, Orbis Tertius.',
    floor: 'Floor 3',
    section: 'Philosophical Vault',
    shelf: 'Shelf B-08',
    rack: 'Rack 02',
    total_copies: 2,
    available_copies: 1
  },
  {
    title: 'Computing Machinery and Intelligence',
    author: 'Alan M. Turing',
    isbn: '9780198662938',
    publisher: 'Mind / Oxford University Press',
    publication_year: 1950,
    category: 'Artificial Intelligence',
    edition: 'Original Monograph Folio',
    description: 'The historic foundational treatise introducing the Imitation Game (Turing Test), machine cognition, and the theoretical underpinnings of artificial intelligence.',
    floor: 'Floor 1',
    section: 'Computation Stacks',
    shelf: 'Shelf T-01',
    rack: 'Rack 09',
    total_copies: 4,
    available_copies: 3
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    isbn: '9780451526342',
    publisher: 'Secker and Warburg',
    publication_year: 1945,
    category: 'Classic Novels',
    edition: 'Standard Collector Edition',
    description: 'An enduring allegorical novella depicting the corruption of revolutionary ideals into totalitarian hierarchy.',
    floor: 'Floor 1',
    section: 'Classic Fiction',
    shelf: 'Shelf O-02',
    rack: 'Rack 03',
    total_copies: 3,
    available_copies: 2
  },
  {
    title: 'Sense and Sensibility',
    author: 'Jane Austen',
    isbn: '9780141439662',
    publisher: 'Thomas Egerton',
    publication_year: 1811,
    category: 'Classic Literature',
    edition: 'Penguin Classics Edition',
    description: 'The brilliant portrayal of the Dashwood sisters Elinor and Marianne as they navigate love, societal expectations, and personal conviction.',
    floor: 'Floor 1',
    section: 'British Classics',
    shelf: 'Shelf A-03',
    rack: 'Rack 01',
    total_copies: 2,
    available_copies: 2
  }
];

function getAthenaeumSVG(book, id) {
  const p = { bg1: '#1F3328', bg2: '#122019', gold: '#D4AF37', accent: '#E8D5A3', lightText: '#FAF8F2' };
  const safeTitle = (book.title || 'Volume').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeAuthor = (book.author || 'Scholar').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeCat = (book.category || 'CANON').toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="g_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#g_${id})"/>
  <rect x="16" y="16" width="368" height="568" rx="4" fill="none" stroke="${p.gold}" stroke-opacity="0.45" stroke-width="1.5"/>
  <rect x="24" y="24" width="352" height="552" rx="2" fill="none" stroke="${p.gold}" stroke-opacity="0.22" stroke-width="0.8"/>
  <circle cx="24" cy="24" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="376" cy="24" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="24" cy="576" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="376" cy="576" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <text x="200" y="60" text-anchor="middle" fill="${p.gold}" font-family="system-ui, sans-serif" font-size="9" font-weight="700" letter-spacing="3.5">LIBRAMIND ATHENAEUM</text>
  <text x="200" y="80" text-anchor="middle" fill="${p.accent}" font-family="system-ui, sans-serif" font-size="8" font-weight="600" letter-spacing="2">№ ${id} • ${safeCat}</text>
  <line x1="130" y1="96" x2="270" y2="96" stroke="${p.gold}" stroke-opacity="0.5" stroke-width="1"/>
  <text x="200" y="250" text-anchor="middle" fill="${p.lightText}" font-family="Georgia, serif" font-size="24" font-weight="bold">${safeTitle}</text>
  <line x1="160" y1="285" x2="240" y2="285" stroke="${p.gold}" stroke-opacity="0.6" stroke-width="1.2"/>
  <text x="200" y="325" text-anchor="middle" fill="${p.accent}" font-family="Georgia, serif" font-size="14" font-style="italic">by ${safeAuthor}</text>
  <circle cx="200" cy="495" r="24" fill="none" stroke="${p.gold}" stroke-opacity="0.5" stroke-width="1.2"/>
  <text x="200" y="501" text-anchor="middle" fill="${p.gold}" font-family="Georgia, serif" font-size="14" font-weight="bold">LM</text>
  <text x="200" y="545" text-anchor="middle" fill="${p.accent}" font-family="system-ui, sans-serif" font-size="8" letter-spacing="2.5" opacity="0.75">ARCHIVAL SANCTUARY EDITION</text>
</svg>`;
}

const checkStmt = db.prepare('SELECT id FROM books WHERE isbn = ?');
const insertBookStmt = db.prepare(`
  INSERT INTO books (
    title, author, isbn, publisher, publication_year, category,
    language, edition, description, cover_image, floor, section,
    shelf, rack, total_copies, available_copies
  ) VALUES (
    @title, @author, @isbn, @publisher, @publication_year, @category,
    @language, @edition, @description, @cover_image, @floor, @section,
    @shelf, @rack, @total_copies, @available_copies
  )
`);
const insertCopyStmt = db.prepare(`
  INSERT INTO book_copies (book_id, copy_code, status, condition)
  VALUES (?, ?, 'available', 'Good')
`);

let added = 0;
for (const b of newBooks) {
  const existing = checkStmt.get(b.isbn);
  if (!existing) {
    const result = insertBookStmt.run({
      ...b,
      language: 'English',
      cover_image: '' // Will set below
    });
    const newId = result.lastInsertRowid;
    const coverPath = `/uploads/book_${newId}_cover.svg`;
    
    // Write SVG cover
    const svg = getAthenaeumSVG(b, newId);
    fs.writeFileSync(path.join(uploadsDir, `book_${newId}_cover.svg`), svg, 'utf8');
    fs.writeFileSync(path.join(publicUploadsDir, `book_${newId}_cover.svg`), svg, 'utf8');

    db.prepare('UPDATE books SET cover_image = ? WHERE id = ?').run(coverPath, newId);

    // Create copies
    for (let c = 1; c <= b.total_copies; c++) {
      const copyCode = `LM-VOL-${newId}-C${c}`;
      insertCopyStmt.run(newId, copyCode);
    }
    added++;
    console.log(`Added Book ${newId}: "${b.title}" by ${b.author}`);
  } else {
    console.log(`Book with ISBN ${b.isbn} already exists.`);
  }
}

console.log(`Successfully added ${added} new books for featured authors! Total books now: ${db.prepare('SELECT count(*) as c FROM books').get().c}`);
