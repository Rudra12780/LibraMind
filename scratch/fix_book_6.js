const fs = require('fs');
const path = require('path');
const db = require(path.join(process.cwd(), 'backend', 'node_modules', 'better-sqlite3'))(path.join(process.cwd(), 'backend', 'libramind.db'));

const b = db.prepare('SELECT * FROM books WHERE id = 6').get();
console.log('Book 6:', b.title, b.author);

// Generate Athenaeum SVG
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bgGrad_6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F3328"/>
      <stop offset="100%" stop-color="#122019"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bgGrad_6)"/>
  <rect x="16" y="16" width="368" height="568" rx="4" fill="none" stroke="#D4AF37" stroke-opacity="0.45" stroke-width="1.5"/>
  <rect x="24" y="24" width="352" height="552" rx="2" fill="none" stroke="#D4AF37" stroke-opacity="0.2" stroke-width="0.8"/>
  <circle cx="24" cy="24" r="3" fill="#D4AF37" fill-opacity="0.7"/>
  <circle cx="376" cy="24" r="3" fill="#D4AF37" fill-opacity="0.7"/>
  <circle cx="24" cy="576" r="3" fill="#D4AF37" fill-opacity="0.7"/>
  <circle cx="376" cy="576" r="3" fill="#D4AF37" fill-opacity="0.7"/>
  <text x="200" y="58" text-anchor="middle" fill="#D4AF37" font-family="system-ui, sans-serif" font-size="9" font-weight="700" letter-spacing="3.5">LIBRAMIND ATHENAEUM</text>
  <text x="200" y="78" text-anchor="middle" fill="#E8D5A3" font-family="system-ui, sans-serif" font-size="8" font-weight="600" letter-spacing="2">№ 06 • SPIRITUAL &amp; WISDOM</text>
  <line x1="130" y1="94" x2="270" y2="94" stroke="#D4AF37" stroke-opacity="0.5" stroke-width="1"/>
  <text x="200" y="220" text-anchor="middle" fill="#FAF8F2" font-family="Georgia, 'Times New Roman', serif" font-size="24" font-weight="700" letter-spacing="-0.2">Tao Te Ching</text>
  <text x="200" y="256" text-anchor="middle" fill="#E8D5A3" font-family="Georgia, 'Times New Roman', serif" font-size="16" font-style="italic">The Book of the Way</text>
  <line x1="160" y1="290" x2="240" y2="290" stroke="#D4AF37" stroke-opacity="0.6" stroke-width="1.2"/>
  <text x="200" y="320" text-anchor="middle" fill="#E8D5A3" font-family="Georgia, serif" font-size="14" font-style="italic">by Lao Tzu</text>
  <circle cx="200" cy="495" r="24" fill="none" stroke="#D4AF37" stroke-opacity="0.5" stroke-width="1.2"/>
  <text x="200" y="501" text-anchor="middle" fill="#D4AF37" font-family="Georgia, serif" font-size="14" font-weight="bold">LM</text>
  <text x="200" y="545" text-anchor="middle" fill="#E8D5A3" font-family="system-ui, sans-serif" font-size="8" letter-spacing="2.5" opacity="0.75">ARCHIVAL SANCTUARY EDITION</text>
</svg>`;

fs.writeFileSync(path.join(process.cwd(), 'backend', 'uploads', 'book_6_cover.svg'), svg);
fs.writeFileSync(path.join(process.cwd(), 'frontend', 'public', 'uploads', 'book_6_cover.svg'), svg);

db.prepare("UPDATE books SET cover_image = '/uploads/book_6_cover.svg' WHERE id = 6").run();
console.log('Successfully updated book 6 cover to /uploads/book_6_cover.svg');
