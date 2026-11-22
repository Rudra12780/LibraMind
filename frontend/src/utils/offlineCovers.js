// LibraMind Dedicated Athenaeum Editorial Book Cover Generator
// Pure In-Memory SVG Vector Data URI — 100% Reliable Offline Fallback
// Provides iconic Classical Athenaeum book cloth art direction: Gold Foil Borders, Deep Archival Palettes, Serif Typography & Archival Monogram.

const coverCache = new Map();

export function getOfflineBookCover(title = 'Library Volume', author = 'Scholar', category = 'Archival Stacks') {
  const cacheKey = `${title}_${author}_${category}`;
  if (coverCache.has(cacheKey)) {
    return coverCache.get(cacheKey);
  }

  const safeTitle = (title || 'Library Volume')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  const safeAuthor = (author || 'Scholar')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  const safeCat = (category || 'Archival Stacks')
    .toUpperCase()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Deterministic hash based on book title
  let hash = 0;
  for (let i = 0; i < (title || '').length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const folioNum = String((absHash % 89) + 11).padStart(2, '0');

  // Rich Athenaeum Color Harmonies
  const palettes = [
    { bg1: '#1F3328', bg2: '#122019', gold: '#D4AF37', accent: '#E8D5A3', lightText: '#FAF8F2' }, // Oxford Forest
    { bg1: '#3D201A', bg2: '#24120E', gold: '#DFB15B', accent: '#EAD7AF', lightText: '#FAF8F2' }, // Terracotta Crimson
    { bg1: '#1A2938', bg2: '#0D1722', gold: '#CBB279', accent: '#DFD1AB', lightText: '#FAF8F2' }, // Archival Sapphire
    { bg1: '#382517', bg2: '#20140B', gold: '#D4AF37', accent: '#E8D5A3', lightText: '#FAF8F2' }, // Polished Mahogany
    { bg1: '#2C1B30', bg2: '#190E1C', gold: '#E5C07B', accent: '#F0DAB2', lightText: '#FAF8F2' }, // Plum Velvet
    { bg1: '#212624', bg2: '#131615', gold: '#C5A059', accent: '#DFCA99', lightText: '#FAF8F2' }  // Archival Charcoal
  ];
  const p = palettes[absHash % palettes.length];

  // Graceful word wrapping for book title
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
    `<text x="200" y="${startY + idx * 32}" text-anchor="middle" fill="${p.lightText}" font-family="'Noto Sans Devanagari', 'Lohit Devanagari', 'Mangal', 'Nirmala UI', Georgia, 'Times New Roman', serif" font-size="20" font-weight="700" letter-spacing="-0.2">${line}</text>`
  ).join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="athenaeumGrad_${absHash}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#athenaeumGrad_${absHash})"/>
  
  <!-- Outer Bookcloth Gold Border -->
  <rect x="16" y="16" width="368" height="568" rx="4" fill="none" stroke="${p.gold}" stroke-opacity="0.45" stroke-width="1.5"/>
  <rect x="24" y="24" width="352" height="552" rx="2" fill="none" stroke="${p.gold}" stroke-opacity="0.22" stroke-width="0.8"/>
  
  <!-- Corner Studs -->
  <circle cx="24" cy="24" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="376" cy="24" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="24" cy="576" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  <circle cx="376" cy="576" r="3" fill="${p.gold}" fill-opacity="0.7"/>
  
  <!-- Header Ribbon -->
  <text x="200" y="58" text-anchor="middle" fill="${p.gold}" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="3.5">LIBRAMIND ATHENAEUM</text>
  <text x="200" y="78" text-anchor="middle" fill="${p.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600" letter-spacing="2">№ ${folioNum} • ${safeCat}</text>
  <line x1="130" y1="94" x2="270" y2="94" stroke="${p.gold}" stroke-opacity="0.5" stroke-width="1"/>
  
  <!-- Title Block -->
  ${titleSvg}
  
  <!-- Divider -->
  <line x1="160" y1="${startY + displayLines.length * 32 + 10}" x2="240" y2="${startY + displayLines.length * 32 + 10}" stroke="${p.gold}" stroke-opacity="0.6" stroke-width="1.2"/>
  
  <!-- Author -->
  <text x="200" y="${startY + displayLines.length * 32 + 38}" text-anchor="middle" fill="${p.accent}" font-family="'Noto Sans Devanagari', 'Lohit Devanagari', 'Mangal', Georgia, serif" font-size="13" font-style="italic">by ${safeAuthor}</text>
  
  <!-- Archival Monogram Seal -->
  <circle cx="200" cy="495" r="24" fill="none" stroke="${p.gold}" stroke-opacity="0.5" stroke-width="1.2"/>
  <text x="200" y="501" text-anchor="middle" fill="${p.gold}" font-family="Georgia, serif" font-size="14" font-weight="bold">LM</text>
  <text x="200" y="545" text-anchor="middle" fill="${p.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="8" letter-spacing="2.5" opacity="0.75">ARCHIVAL SANCTUARY EDITION</text>
</svg>`;

  let dataUri = '';
  try {
    if (typeof btoa !== 'undefined') {
      dataUri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }
  } catch (_) {}

  if (!dataUri) {
    try {
      const base64Svg = typeof Buffer !== 'undefined' ? Buffer.from(svg).toString('base64') : null;
      if (base64Svg) {
        dataUri = `data:image/svg+xml;base64,${base64Svg}`;
      }
    } catch (_) {}
  }

  if (!dataUri) {
    dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  coverCache.set(cacheKey, dataUri);
  return dataUri;
}

export function handleBookCoverError(e, title, author, category) {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null; // Prevent infinite event loops
    const offlineSrc = getOfflineBookCover(title, author, category);
    if (e.currentTarget.src !== offlineSrc) {
      e.currentTarget.src = offlineSrc;
    }
  }
}
