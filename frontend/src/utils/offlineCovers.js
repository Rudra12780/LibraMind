// LibraMind Dedicated Offline Book Cover Generator
// Pure In-Memory SVG Vector Data URI — 100% Reliable Offline Fallback
// Provides authentic Editorial Magazine & Book Publishing clothbound aesthetic.

export function getOfflineBookCover(title = 'Literary Work', author = 'Author', category = 'Literature') {
  const safeTitle = (title || 'Literary Work')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 36);
  const safeAuthor = (author || 'Writer')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 26);
  const safeCat = (category || 'Essays')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 22);

  // Deterministic hash based on book title to cycle through editorial bookcloth colors
  let hash = 0;
  for (let i = 0; i < (title || '').length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }

  const palettes = [
    { cloth: '#263D32', trim: '#9B6548', highlight: '#C48A6C', accent: '#F7F4ED' }, // Oxford Editorial Green
    { cloth: '#9B6548', trim: '#263D32', highlight: '#B87B5B', accent: '#F7F4ED' }, // Literary Terracotta
    { cloth: '#252820', trim: '#9B6548', highlight: '#C48A6C', accent: '#EFE9DD' }, // Charcoal Typewriter Ink
    { cloth: '#3E5046', trim: '#9B6548', highlight: '#D9D3C7', accent: '#F7F4ED' }, // Soft Forest Sage
    { cloth: '#593D2E', trim: '#D9D3C7', highlight: '#C48A6C', accent: '#F7F4ED' }  // Warm Leather Sienna
  ];
  const p = palettes[Math.abs(hash) % palettes.length];
  const accessionRef = `FOLIO-${Math.abs(hash % 900 + 100)}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <defs>
      <linearGradient id="clothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.cloth}"/>
        <stop offset="60%" stop-color="${p.cloth}"/>
        <stop offset="100%" stop-color="#141812"/>
      </linearGradient>
    </defs>

    <!-- Editorial Book Canvas -->
    <rect width="400" height="600" fill="url(#clothGrad)"/>

    <!-- Spine Ribbing Simulation on Left -->
    <rect x="0" y="0" width="22" height="600" fill="#000000" fill-opacity="0.3"/>
    <line x1="22" y1="0" x2="22" y2="600" stroke="${p.trim}" stroke-width="1.2" stroke-opacity="0.5"/>

    <!-- Minimal Hairline Outer Frame -->
    <rect x="36" y="24" width="340" height="552" rx="2" fill="none" stroke="${p.trim}" stroke-width="1.5" stroke-opacity="0.8"/>
    <rect x="42" y="30" width="328" height="540" rx="1" fill="none" stroke="#D9D3C7" stroke-width="0.6" stroke-opacity="0.6"/>

    <!-- Top Editorial Header & Folio -->
    <g transform="translate(206, 68)">
      <text x="0" y="0" text-anchor="middle" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="8" font-weight="700" letter-spacing="3.5">LIBRAMIND EDITORIAL REVIEW</text>
      <line x1="-70" y1="12" x2="70" y2="12" stroke="${p.trim}" stroke-width="0.8"/>
    </g>

    <!-- Editorial Bookplate Inset (Cream Parchment Sheet) -->
    <g transform="translate(56, 125)">
      <rect x="0" y="0" width="300" height="330" rx="2" fill="#F7F4ED" stroke="#D9D3C7" stroke-width="1.2"/>
      <rect x="6" y="6" width="288" height="318" rx="1" fill="none" stroke="${p.trim}" stroke-width="0.5" stroke-opacity="0.5"/>

      <!-- Category Label -->
      <text x="150" y="44" text-anchor="middle" fill="#9B6548" font-family="'Inter', sans-serif" font-size="9.5" font-weight="700" letter-spacing="2">
        — ${safeCat.toUpperCase()} —
      </text>

      <line x1="60" y1="60" x2="240" y2="60" stroke="#D9D3C7" stroke-width="0.8"/>

      <!-- Stamped Book Title in Serif -->
      <text x="150" y="125" text-anchor="middle" fill="#252820" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="700" letter-spacing="-0.2">
        ${safeTitle}
      </text>

      <!-- Second Decorative Divider -->
      <line x1="85" y1="180" x2="215" y2="180" stroke="#D9D3C7" stroke-width="0.8"/>

      <!-- Stamped Author -->
      <text x="150" y="215" text-anchor="middle" fill="#77766E" font-family="'Inter', sans-serif" font-size="10.5" font-weight="500" letter-spacing="1">
        WRITTEN BY
      </text>
      <text x="150" y="242" text-anchor="middle" fill="#252820" font-family="'Playfair Display', Georgia, serif" font-size="15" font-weight="700" letter-spacing="0.5">
        ${safeAuthor}
      </text>

      <!-- Colophon Mark -->
      <text x="150" y="295" text-anchor="middle" fill="#77766E" font-family="'Inter', sans-serif" font-size="8" font-weight="600" letter-spacing="1.5">
        ESTD. 1892 • ATHENAEUM EDITION
      </text>
    </g>

    <!-- Bottom Accession Slip -->
    <g transform="translate(68, 490)">
      <rect x="0" y="0" width="276" height="54" rx="2" fill="#EFE9DD" stroke="#D9D3C7" stroke-width="1"/>
      <text x="138" y="24" text-anchor="middle" fill="#252820" font-family="'Space Mono', monospace" font-size="9.5" font-weight="700" letter-spacing="1">${accessionRef}</text>
      <text x="138" y="42" text-anchor="middle" fill="#77766E" font-family="'Inter', sans-serif" font-size="8" font-weight="600" letter-spacing="1.5">SANCTUARY COLLECTION</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function handleBookCoverError(e, title, author, category) {
  if (e && e.currentTarget) {
    const offlineSrc = getOfflineBookCover(title, author, category);
    if (e.currentTarget.src !== offlineSrc) {
      e.currentTarget.src = offlineSrc;
    }
  }
}

