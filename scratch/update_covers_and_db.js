const fs = require('fs');
const path = require('path');
const Database = require('../backend/node_modules/better-sqlite3');

const uploadsDir = path.resolve('backend/uploads');
const publicUploadsDir = path.resolve('frontend/public/uploads');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(publicUploadsDir)) fs.mkdirSync(publicUploadsDir, { recursive: true });

function getAthenaeumCoverSVG(book) {
  const safeTitle = (book.title || 'Library Volume')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safeAuthor = (book.author || 'Scholar')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safeCat = (book.category || 'Archival Stacks')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .toUpperCase();

  const palettes = [
    { bg1: '#1F3328', bg2: '#122019', gold: '#D4AF37', accent: '#E8D5A3', lightText: '#FAF8F2' },
    { bg1: '#3D201A', bg2: '#24120E', gold: '#DFB15B', accent: '#EAD7AF', lightText: '#FAF8F2' },
    { bg1: '#1A2938', bg2: '#0D1722', gold: '#CBB279', accent: '#DFD1AB', lightText: '#FAF8F2' },
    { bg1: '#382517', bg2: '#20140B', gold: '#D4AF37', accent: '#E8D5A3', lightText: '#FAF8F2' },
    { bg1: '#2C1B30', bg2: '#190E1C', gold: '#E5C07B', accent: '#F0DAB2', lightText: '#FAF8F2' },
    { bg1: '#212624', bg2: '#131615', gold: '#C5A059', accent: '#DFCA99', lightText: '#FAF8F2' }
  ];

  let hash = 0;
  for (let i = 0; i < (book.title || '').length; i++) {
    hash = (hash << 5) - hash + book.title.charCodeAt(i);
    hash |= 0;
  }
  const p = palettes[Math.abs(hash) % palettes.length];
  const folio = String((Math.abs(hash) % 89) + 11).padStart(2, '0');

  // Word wrap
  const words = safeTitle.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= 18) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  const displayLines = lines.slice(0, 4);
  const startY = 220 - (displayLines.length - 1) * 16;
  const titleSvg = displayLines.map((line, idx) => 
    `<text x="200" y="${startY + idx * 32}" text-anchor="middle" fill="${p.lightText}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" letter-spacing="-0.2">${line}</text>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bgGrad_${book.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bgGrad_${book.id})"/>
  <rect x="16" y="16" width="368" height="568" rx="4" fill="none" stroke="${p.gold}" stroke-opacity="0.45" stroke-width="1.5"/>
  <rect x="24" y="24" width="352" height="552" rx="2" fill="none" stroke="${p.gold}" stroke-opacity="0.2" stroke-width="0.8"/>
  <circle cx="24" cy="24" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="376" cy="24" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="24" cy="576" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="376" cy="576" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <text x="200" y="58" text-anchor="middle" fill="${p.gold}" font-family="system-ui, sans-serif" font-size="9" font-weight="700" letter-spacing="3.5">LIBRAMIND ATHENAEUM</text>
  <text x="200" y="78" text-anchor="middle" fill="${p.accent}" font-family="system-ui, sans-serif" font-size="8" font-weight="600" letter-spacing="2">№ ${folio} • ${safeCat}</text>
  <line x1="130" y1="94" x2="270" y2="94" stroke="${p.gold}" stroke-opacity="0.5" stroke-width="1"/>
  ${titleSvg}
  <line x1="160" y1="${startY + displayLines.length * 32 + 10}" x2="240" y2="${startY + displayLines.length * 32 + 10}" stroke="${p.gold}" stroke-opacity="0.6" stroke-width="1.2"/>
  <text x="200" y="${startY + displayLines.length * 32 + 38}" text-anchor="middle" fill="${p.accent}" font-family="Georgia, serif" font-size="13" font-style="italic">by ${safeAuthor}</text>
  <circle cx="200" cy="495" r="24" fill="none" stroke="${p.gold}" stroke-opacity="0.5" stroke-width="1.2"/>
  <text x="200" y="501" text-anchor="middle" fill="${p.gold}" font-family="Georgia, serif" font-size="14" font-weight="bold">LM</text>
  <text x="200" y="545" text-anchor="middle" fill="${p.accent}" font-family="system-ui, sans-serif" font-size="8" letter-spacing="2.5" opacity="0.75">ARCHIVAL SANCTUARY EDITION</text>
</svg>`;
}

const db = new Database('backend/libramind.db');
const books = db.prepare('SELECT id, title, author, category, cover_image FROM books').all();
const updateStmt = db.prepare('UPDATE books SET cover_image = ? WHERE id = ?');

let updated = 0;
for (const b of books) {
  let targetCover = '';

  // Check if we already have a specialized photo
  if (b.id === 19 && fs.existsSync(path.join(uploadsDir, 'book_1984_original.jpg'))) {
    targetCover = '/uploads/book_1984_original.jpg';
  } else if (b.id === 25 && fs.existsSync(path.join(uploadsDir, 'book_wuthering_heights_original.jpg'))) {
    targetCover = '/uploads/book_wuthering_heights_original.jpg';
  } else if (fs.existsSync(path.join(uploadsDir, `book_${b.id}_cover.jpg`))) {
    targetCover = `/uploads/book_${b.id}_cover.jpg`;
  } else {
    // Generate or use SVG cover
    const svgPath = path.join(uploadsDir, `book_${b.id}_cover.svg`);
    const svgContent = getAthenaeumCoverSVG(b);
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    targetCover = `/uploads/book_${b.id}_cover.svg`;
  }

  updateStmt.run(targetCover, b.id);
  updated++;
}

// Copy everything from backend/uploads to frontend/public/uploads
const files = fs.readdirSync(uploadsDir);
for (const f of files) {
  if (f.endsWith('.jpg') || f.endsWith('.svg') || f.endsWith('.png')) {
    fs.copyFileSync(path.join(uploadsDir, f), path.join(publicUploadsDir, f));
  }
}

console.log(`Successfully updated ${updated} books in libramind.db with local verified covers!`);
console.log(`Copied ${files.length} upload assets to frontend/public/uploads.`);
