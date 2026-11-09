// LibraMind Design Thinking UI Wireframe Blueprint Portfolio
// Clean low-fidelity black-and-white Balsamiq-style UI wireframes for all 21 pages of the system.

function wrapPageSVG({
  pageNumber,
  pageTotal = 21,
  pageTitle,
  pageRoute,
  activeNavIndex = 0,
  content
}) {
  const safeTitle = (pageTitle || '').toUpperCase().replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
  const rawSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 1520" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: auto; display: block; background-color: #FFFFFF; font-family: 'Comic Sans MS', 'Chalkboard SE', 'Plus Jakarta Sans', -apple-system, sans-serif;">
  <defs>
    <!-- Faint Dot-Grid Background (Balsamiq Hand-Drawn Canvas Style) -->
    <pattern id="dot-grid-${pageNumber}" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.15" fill="#D2D2D2" />
    </pattern>
    <filter id="wireframe-shadow-${pageNumber}" x="-2%" y="-1%" width="104%" height="102%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.06" />
    </filter>
  </defs>

  <!-- Dot Grid Canvas -->
  <rect width="920" height="1520" fill="url(#dot-grid-${pageNumber})" />

  <!-- Wireframe Blueprint Top Header Card -->
  <g transform="translate(30, 20)">
    <rect width="860" height="42" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" rx="6" />
    <text x="16" y="26" font-size="12" font-weight="bold" fill="#000000" letter-spacing="1">LIBRAMIND LMS // DESIGN THINKING UI WIREFRAME BLUEPRINT</text>
    <text x="490" y="26" font-size="10.5" fill="#555555">PAGE ${pageNumber} OF ${pageTotal}: ${safeTitle} · PORTRAIT</text>
  </g>

  <!-- Main Website Wireframe Container -->
  <g transform="translate(30, 75)" filter="url(#wireframe-shadow-${pageNumber})">
    <!-- Browser Window Outline (Portrait 860px x 1415px) -->
    <rect width="860" height="1415" fill="#FFFFFF" stroke="#000000" stroke-width="2" rx="8" />

    <!-- Browser Window Titlebar -->
    <rect width="860" height="32" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" rx="8 8 0 0" />
    <circle cx="18" cy="16" r="4.5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <circle cx="32" cy="16" r="4.5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <circle cx="46" cy="16" r="4.5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
    <!-- Address URL Bar -->
    <rect x="70" y="6" width="460" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" rx="4" />
    <text x="82" y="20" font-size="9.5" fill="#333333">http://libramind.edu${pageRoute}</text>

    <!-- 1. NAVIGATION BAR -->
    <g transform="translate(0, 32)">
      <rect x="670" y="8" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="680" y="21" font-size="9.5" font-weight="bold" fill="#000000">1. NAVIGATION BAR</text>

      <rect width="860" height="58" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />

      <!-- Left: Logo (Simple Book Icon + "LibraMind") -->
      <g transform="translate(24, 12)">
        <rect width="32" height="32" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" rx="4" />
        <path d="M 6 10 L 16 7 L 26 10 L 26 25 L 16 22 L 6 25 Z" fill="none" stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
        <line x1="16" y1="7" x2="16" y2="22" stroke="#000000" stroke-width="1.5" />
        <text x="40" y="22" font-size="15" font-weight="bold" fill="#000000">LibraMind</text>
      </g>

      <!-- Center: Navigation Links -->
      <g transform="translate(240, 24)">
        <rect x="0" y="0" width="40" height="8" rx="3" fill="${activeNavIndex === 0 ? '#000000' : '#888888'}" />
        <rect x="50" y="0" width="40" height="8" rx="3" fill="${activeNavIndex === 1 ? '#000000' : '#888888'}" />
        <rect x="100" y="0" width="50" height="8" rx="3" fill="${activeNavIndex === 2 ? '#000000' : '#888888'}" />
        <rect x="160" y="0" width="54" height="8" rx="3" fill="${activeNavIndex === 3 ? '#000000' : '#888888'}" />
        <rect x="224" y="0" width="46" height="8" rx="3" fill="${activeNavIndex === 4 ? '#000000' : '#888888'}" />
        <rect x="280" y="0" width="50" height="8" rx="3" fill="${activeNavIndex === 5 ? '#000000' : '#888888'}" />
        <rect x="340" y="0" width="46" height="8" rx="3" fill="${activeNavIndex === 6 ? '#000000' : '#888888'}" />
      </g>

      <!-- Right: Login, Register, Profile Outlined Boxes -->
      <g transform="translate(680, 14)">
        <rect x="0" y="0" width="48" height="28" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="10" y="18" font-size="9" font-weight="bold" fill="#000000">Login</text>

        <rect x="54" y="0" width="56" height="28" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="6" y="18" font-size="9" font-weight="bold" fill="#000000">Register</text>

        <rect x="116" y="0" width="28" height="28" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <circle cx="130" cy="11" r="5" fill="none" stroke="#000000" stroke-width="1.2" />
        <path d="M 122 23 C 122 18, 138 18, 138 23" fill="none" stroke="#000000" stroke-width="1.2" />
      </g>
    </g>

    <!-- Page Specific Body Content -->
    ${content}

    <!-- Standard Low-Fi Footer (At Y: 1285) -->
    <g transform="translate(0, 1285)">
      <rect width="860" height="130" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <line x1="0" y1="0" x2="860" y2="0" stroke="#000000" stroke-width="1.8" />
      
      <rect x="710" y="10" width="130" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="720" y="23" font-size="9.5" font-weight="bold" fill="#000000">FOOTER SECTION</text>

      <!-- 3 Placeholder Groups: About Us, Quick Links, Contact -->
      <g transform="translate(40, 24)">
        <text x="0" y="14" font-size="11" font-weight="bold" fill="#000000">ABOUT LIBRAMIND</text>
        <rect x="0" y="24" width="140" height="7" rx="3" fill="#666666" />
        <rect x="0" y="37" width="120" height="7" rx="3" fill="#888888" />
        <rect x="0" y="50" width="100" height="7" rx="3" fill="#888888" />
      </g>

      <g transform="translate(320, 24)">
        <text x="0" y="14" font-size="11" font-weight="bold" fill="#000000">QUICK LINKS</text>
        <rect x="0" y="24" width="90" height="7" rx="3" fill="#666666" />
        <rect x="0" y="37" width="110" height="7" rx="3" fill="#888888" />
        <rect x="0" y="50" width="80" height="7" rx="3" fill="#888888" />
      </g>

      <g transform="translate(580, 24)">
        <text x="0" y="14" font-size="11" font-weight="bold" fill="#000000">CONTACT &amp; HOURS</text>
        <rect x="0" y="24" width="130" height="7" rx="3" fill="#666666" />
        <rect x="0" y="37" width="110" height="7" rx="3" fill="#888888" />
        <rect x="0" y="50" width="125" height="7" rx="3" fill="#888888" />
      </g>

      <!-- Copyright Placeholder Line -->
      <line x1="40" y1="95" x2="820" y2="95" stroke="#CCCCCC" stroke-width="1" />
      <rect x="330" y="105" width="200" height="7" rx="3" fill="#999999" />
    </g>
  </g>
</svg>`;
  return rawSvg.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
}

// --------------------------------------------------------------------------------
// PAGE 1: HOME / LANDING SANCTUARY (/home)
// --------------------------------------------------------------------------------
const HOME_CONTENT = `
    <!-- 2. HERO BANNER -->
    <g transform="translate(0, 90)">
      <rect width="860" height="225" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="10" width="140" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="23" font-size="9.5" font-weight="bold" fill="#000000">2. HERO BANNER</text>

      <g transform="translate(40, 42)">
        <text x="0" y="26" font-size="22" font-weight="bold" fill="#000000">Welcome to LibraMind</text>
        <rect x="0" y="44" width="380" height="8" rx="3" fill="#666666" />
        <rect x="0" y="58" width="280" height="8" rx="3" fill="#888888" />
        <rect x="0" y="88" width="150" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <text x="24" y="112" font-size="11.5" font-weight="bold" fill="#000000">Explore Library</text>
      </g>

      <g transform="translate(540, 32)">
        <rect width="280" height="160" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" rx="6" />
        <line x1="0" y1="0" x2="280" y2="160" stroke="#777777" stroke-width="1.4" />
        <line x1="0" y1="160" x2="280" y2="0" stroke="#777777" stroke-width="1.4" />
        <rect x="75" y="68" width="130" height="24" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" rx="4" />
        <text x="86" y="84" font-size="10" font-weight="bold" fill="#000000">ILLUSTRATION [X]</text>
      </g>
    </g>

    <!-- 3. SEARCH BAR -->
    <g transform="translate(0, 315)">
      <rect width="860" height="96" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="130" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. SEARCH BAR</text>

      <g transform="translate(40, 30)">
        <rect width="780" height="42" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <circle cx="24" cy="21" r="7" fill="none" stroke="#000000" stroke-width="1.8" />
        <line x1="29" y1="26" x2="36" y2="33" stroke="#000000" stroke-width="2" stroke-linecap="round" />
        <rect x="50" y="16" width="380" height="9" rx="3" fill="#888888" />
        <rect x="670" y="5" width="102" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <text x="702" y="25" font-size="11" font-weight="bold" fill="#000000">Search</text>
      </g>
      <text x="44" y="86" font-size="9" fill="#555555">Search books by title, author, subject, or shelf location</text>
    </g>

    <!-- 4. STATUS BAR -->
    <g transform="translate(0, 411)">
      <rect width="860" height="142" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="130" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. STATUS BAR</text>

      <g transform="translate(40, 32)">
        <!-- Card 1: Total Books -->
        <g transform="translate(0, 0)">
          <rect width="180" height="92" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="14" y="26" font-size="11" font-weight="bold" fill="#000000">Total Books</text>
          <rect x="14" y="38" width="90" height="18" rx="3" fill="#222222" />
          <rect x="14" y="66" width="120" height="7" rx="3" fill="#888888" />
        </g>
        <!-- Card 2: Available Books -->
        <g transform="translate(200, 0)">
          <rect width="180" height="92" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="14" y="26" font-size="11" font-weight="bold" fill="#000000">Available Books</text>
          <rect x="14" y="38" width="70" height="18" rx="3" fill="#222222" />
          <rect x="14" y="66" width="120" height="7" rx="3" fill="#888888" />
        </g>
        <!-- Card 3: Available Study Seats -->
        <g transform="translate(400, 0)">
          <rect width="180" height="92" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="14" y="26" font-size="11" font-weight="bold" fill="#000000">Available Seats</text>
          <rect x="14" y="38" width="60" height="18" rx="3" fill="#222222" />
          <rect x="14" y="66" width="120" height="7" rx="3" fill="#888888" />
        </g>
        <!-- Card 4: Book Reservations -->
        <g transform="translate(600, 0)">
          <rect width="180" height="92" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="14" y="26" font-size="11" font-weight="bold" fill="#000000">Reservations</text>
          <rect x="14" y="38" width="50" height="18" rx="3" fill="#222222" />
          <rect x="14" y="66" width="120" height="7" rx="3" fill="#888888" />
        </g>
      </g>
    </g>

    <!-- 5. FOUR-COLUMN CARD GRID -->
    <g transform="translate(0, 553)">
      <rect width="860" height="430" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">5. FOUR-COLUMN CARD GRID</text>

      <g transform="translate(40, 34)">
        <!-- Card 1 -->
        <g transform="translate(0, 0)">
          <rect width="180" height="375" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(15, 15)">
            <rect width="150" height="150" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" rx="4" />
            <line x1="0" y1="0" x2="150" y2="150" stroke="#777777" stroke-width="1.2" />
            <line x1="0" y1="150" x2="150" y2="0" stroke="#777777" stroke-width="1.2" />
            <rect x="55" y="65" width="40" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
            <text x="70" y="79" font-size="11" font-weight="bold" fill="#000000">[X]</text>
          </g>
          <text x="15" y="190" font-size="11.5" font-weight="bold" fill="#000000">Smart Book Search</text>
          <rect x="15" y="202" width="140" height="6" rx="2" fill="#333333" />
          <rect x="15" y="218" width="150" height="7" rx="2" fill="#777777" />
          <rect x="15" y="232" width="135" height="7" rx="2" fill="#888888" />
          <rect x="15" y="246" width="110" height="7" rx="2" fill="#888888" />
          <rect x="15" y="325" width="150" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="62" y="345" font-size="10.5" font-weight="bold" fill="#000000">Search</text>
        </g>
        <!-- Card 2 -->
        <g transform="translate(200, 0)">
          <rect width="180" height="375" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(15, 15)">
            <rect width="150" height="150" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" rx="4" />
            <line x1="0" y1="0" x2="150" y2="150" stroke="#777777" stroke-width="1.2" />
            <line x1="0" y1="150" x2="150" y2="0" stroke="#777777" stroke-width="1.2" />
            <rect x="55" y="65" width="40" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
            <text x="70" y="79" font-size="11" font-weight="bold" fill="#000000">[X]</text>
          </g>
          <text x="15" y="190" font-size="11.5" font-weight="bold" fill="#000000">Book Availability</text>
          <rect x="15" y="202" width="130" height="6" rx="2" fill="#333333" />
          <rect x="15" y="218" width="150" height="7" rx="2" fill="#777777" />
          <rect x="15" y="232" width="135" height="7" rx="2" fill="#888888" />
          <rect x="15" y="246" width="110" height="7" rx="2" fill="#888888" />
          <rect x="15" y="325" width="150" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="48" y="345" font-size="10.5" font-weight="bold" fill="#000000">Check Stock</text>
        </g>
        <!-- Card 3 -->
        <g transform="translate(400, 0)">
          <rect width="180" height="375" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(15, 15)">
            <rect width="150" height="150" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" rx="4" />
            <line x1="0" y1="0" x2="150" y2="150" stroke="#777777" stroke-width="1.2" />
            <line x1="0" y1="150" x2="150" y2="0" stroke="#777777" stroke-width="1.2" />
            <rect x="55" y="65" width="40" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
            <text x="70" y="79" font-size="11" font-weight="bold" fill="#000000">[X]</text>
          </g>
          <text x="15" y="190" font-size="11.5" font-weight="bold" fill="#000000">Seat Availability</text>
          <rect x="15" y="202" width="125" height="6" rx="2" fill="#333333" />
          <rect x="15" y="218" width="150" height="7" rx="2" fill="#777777" />
          <rect x="15" y="232" width="135" height="7" rx="2" fill="#888888" />
          <rect x="15" y="246" width="110" height="7" rx="2" fill="#888888" />
          <rect x="15" y="325" width="150" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="50" y="345" font-size="10.5" font-weight="bold" fill="#000000">Reserve Pod</text>
        </g>
        <!-- Card 4 -->
        <g transform="translate(600, 0)">
          <rect width="180" height="375" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(15, 15)">
            <rect width="150" height="150" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" rx="4" />
            <line x1="0" y1="0" x2="150" y2="150" stroke="#777777" stroke-width="1.2" />
            <line x1="0" y1="150" x2="150" y2="0" stroke="#777777" stroke-width="1.2" />
            <rect x="55" y="65" width="40" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
            <text x="70" y="79" font-size="11" font-weight="bold" fill="#000000">[X]</text>
          </g>
          <text x="15" y="190" font-size="11.5" font-weight="bold" fill="#000000">AI Recommender</text>
          <rect x="15" y="202" width="145" height="6" rx="2" fill="#333333" />
          <rect x="15" y="218" width="150" height="7" rx="2" fill="#777777" />
          <rect x="15" y="232" width="135" height="7" rx="2" fill="#888888" />
          <rect x="15" y="246" width="110" height="7" rx="2" fill="#888888" />
          <rect x="15" y="325" width="150" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="50" y="345" font-size="10.5" font-weight="bold" fill="#000000">Find Matches</text>
        </g>
      </g>
    </g>

    <!-- 6. ADDITIONAL LIBRARY FEATURES -->
    <g transform="translate(0, 983)">
      <rect width="860" height="302" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="240" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">6. ADDITIONAL LIBRARY FEATURES</text>

      <g transform="translate(40, 36)">
        <!-- Feature 1 -->
        <g transform="translate(0, 0)">
          <rect width="246" height="245" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(18, 16)">
            <rect width="210" height="85" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" rx="4" />
            <line x1="0" y1="0" x2="210" y2="85" stroke="#777777" stroke-width="1.2" />
            <line x1="0" y1="85" x2="210" y2="0" stroke="#777777" stroke-width="1.2" />
            <rect x="85" y="32" width="40" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
            <text x="100" y="46" font-size="11" font-weight="bold" fill="#000000">[X]</text>
          </g>
          <text x="18" y="125" font-size="11.5" font-weight="bold" fill="#000000">Find Books by Shelf</text>
          <rect x="18" y="138" width="210" height="7" rx="2" fill="#777777" />
          <rect x="18" y="152" width="180" height="7" rx="2" fill="#888888" />
          <rect x="18" y="196" width="210" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="75" y="216" font-size="10.5" font-weight="bold" fill="#000000">View Shelf Map</text>
        </g>
        <!-- Feature 2 -->
        <g transform="translate(266, 0)">
          <rect width="246" height="245" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(18, 16)">
            <rect width="210" height="85" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" rx="4" />
            <line x1="0" y1="0" x2="210" y2="85" stroke="#777777" stroke-width="1.2" />
            <line x1="0" y1="85" x2="210" y2="0" stroke="#777777" stroke-width="1.2" />
            <rect x="85" y="32" width="40" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
            <text x="100" y="46" font-size="11" font-weight="bold" fill="#000000">[X]</text>
          </g>
          <text x="18" y="125" font-size="11.5" font-weight="bold" fill="#000000">Reserve a Study Seat</text>
          <rect x="18" y="138" width="210" height="7" rx="2" fill="#777777" />
          <rect x="18" y="152" width="180" height="7" rx="2" fill="#888888" />
          <rect x="18" y="196" width="210" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="75" y="216" font-size="10.5" font-weight="bold" fill="#000000">Book Seat Now</text>
        </g>
        <!-- Feature 3 -->
        <g transform="translate(532, 0)">
          <rect width="246" height="245" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(18, 16)">
            <rect width="210" height="85" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" rx="4" />
            <line x1="0" y1="0" x2="210" y2="85" stroke="#777777" stroke-width="1.2" />
            <line x1="0" y1="85" x2="210" y2="0" stroke="#777777" stroke-width="1.2" />
            <rect x="85" y="32" width="40" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
            <text x="100" y="46" font-size="11" font-weight="bold" fill="#000000">[X]</text>
          </g>
          <text x="18" y="125" font-size="11.5" font-weight="bold" fill="#000000">Discover New Books</text>
          <rect x="18" y="138" width="210" height="7" rx="2" fill="#777777" />
          <rect x="18" y="152" width="180" height="7" rx="2" fill="#888888" />
          <rect x="18" y="196" width="210" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="80" y="216" font-size="10.5" font-weight="bold" fill="#000000">Open Catalog</text>
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 2: BOOK CATALOG & MULTI-FILTER SEARCH (/catalog)
// --------------------------------------------------------------------------------
const CATALOG_CONTENT = `
    <!-- 2. CATALOG HEADER & SEARCH CONTROL BAR -->
    <g transform="translate(0, 90)">
      <rect width="860" height="135" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. SEARCH &amp; CONTROLS</text>

      <g transform="translate(40, 32)">
        <text x="0" y="20" font-size="18" font-weight="bold" fill="#000000">LibraMind Book Collection &amp; Catalog</text>
        <rect x="360" y="6" width="90" height="18" rx="9" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
        <text x="370" y="19" font-size="9.5" font-weight="bold" fill="#000000">[ 48 Titles ]</text>

        <!-- Search Bar and Dropdowns Row -->
        <g transform="translate(0, 38)">
          <rect width="420" height="36" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <circle cx="18" cy="18" r="6" fill="none" stroke="#000000" stroke-width="1.5" />
          <line x1="22" y1="22" x2="28" y2="28" stroke="#000000" stroke-width="1.8" />
          <text x="38" y="22" font-size="10" fill="#666666">Search by title, author, keyword, or ISBN...</text>

          <rect x="435" y="0" width="160" height="36" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <text x="450" y="22" font-size="10" font-weight="bold" fill="#000000">All Categories v</text>

          <rect x="610" y="0" width="110" height="36" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <text x="622" y="22" font-size="10" font-weight="bold" fill="#000000">Sort: Popular v</text>

          <rect x="735" y="0" width="45" height="36" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <text x="746" y="22" font-size="10" font-weight="bold" fill="#000000">Reset</text>
        </g>
      </g>
    </g>

    <!-- 3. TWO-COLUMN LAYOUT: SIDEBAR FILTERS & RESULTS GRID -->
    <g transform="translate(0, 225)">
      <rect width="860" height="1060" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. SIDEBAR &amp; RESULTS GRID</text>

      <g transform="translate(30, 36)">
        <!-- Left Sidebar: Multi-Filter Column (200px) -->
        <g transform="translate(0, 0)">
          <rect width="200" height="990" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="16" y="28" font-size="11.5" font-weight="bold" fill="#000000">FILTER BY CATEGORY</text>
          
          <!-- Category Checkboxes -->
          ${['All Genres', 'Fiction & Novels', 'Computer Science', 'Philosophy & Mind', 'Science & Nature', 'Architecture'].map((cat, i) => `
            <g transform="translate(16, ${42 + i * 28})">
              <rect width="14" height="14" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
              ${i === 0 ? '<text x="3" y="11" font-size="10" font-weight="bold">✓</text>' : ''}
              <text x="24" y="12" font-size="9.5" fill="#222222">${cat}</text>
            </g>
          `).join('')}

          <line x1="16" y1="225" x2="184" y2="225" stroke="#CCCCCC" stroke-width="1" />
          <text x="16" y="248" font-size="11.5" font-weight="bold" fill="#000000">AVAILABILITY</text>
          <g transform="translate(16, 262)">
            <rect width="14" height="14" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="24" y="12" font-size="9.5" fill="#222222">Available Now (34)</text>
          </g>
          <g transform="translate(16, 290)">
            <rect width="14" height="14" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="24" y="12" font-size="9.5" fill="#222222">On Loan / In Queue (14)</text>
          </g>

          <line x1="16" y1="330" x2="184" y2="330" stroke="#CCCCCC" stroke-width="1" />
          <text x="16" y="352" font-size="11.5" font-weight="bold" fill="#000000">FLOOR &amp; STACKS</text>
          <g transform="translate(16, 368)">
            <circle cx="7" cy="7" r="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <circle cx="7" cy="7" r="3" fill="#000000" />
            <text x="24" y="11" font-size="9.5" fill="#222222">Level 1: Quiet Sanctuary</text>
          </g>
          <g transform="translate(16, 396)">
            <circle cx="7" cy="7" r="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="24" y="11" font-size="9.5" fill="#222222">Level 2: Research Stacks</text>
          </g>

          <!-- Quick Action in Sidebar -->
          <rect x="16" y="440" width="168" height="34" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="45" y="461" font-size="10" font-weight="bold" fill="#000000">Clear All Filters</text>
        </g>

        <!-- Right: 3x2 Book Grid (580px wide) -->
        <g transform="translate(220, 0)">
          <text x="0" y="16" font-size="10" fill="#555555">Showing 6 of 48 specimens · Multi-filter active</text>

          <!-- 6 Book Cards (3 col x 2 rows) -->
          ${[0, 1, 2, 3, 4, 5].map(idx => {
            const col = idx % 3;
            const row = Math.floor(idx / 3);
            const x = col * 192;
            const y = 30 + row * 455;
            return `
            <g transform="translate(${x}, ${y})">
              <rect width="180" height="435" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
              <!-- Cover Placeholder [X] -->
              <g transform="translate(15, 15)">
                <rect width="150" height="205" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" rx="4" />
                <line x1="0" y1="0" x2="150" y2="205" stroke="#777777" stroke-width="1.2" />
                <line x1="0" y1="205" x2="150" y2="0" stroke="#777777" stroke-width="1.2" />
                <rect x="55" y="90" width="40" height="22" fill="#FFFFFF" stroke="#000000" stroke-width="1" rx="3" />
                <text x="68" y="105" font-size="10" font-weight="bold">[X]</text>
              </g>

              <g transform="translate(15, 230)">
                <!-- Shelf Tag -->
                <rect width="78" height="16" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
                <text x="8" y="12" font-size="8.5" font-weight="bold">Stack B-0${idx + 1}</text>
                
                <!-- Title & Author Dummy Lines -->
                <rect x="0" y="24" width="140" height="9" rx="2" fill="#222222" />
                <rect x="0" y="38" width="100" height="7" rx="2" fill="#666666" />
                <rect x="0" y="52" width="120" height="7" rx="2" fill="#888888" />
                
                <!-- Status Badge -->
                <rect x="0" y="70" width="80" height="18" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
                <text x="10" y="83" font-size="8.5" font-weight="bold">Available</text>

                <!-- Button -->
                <rect x="0" y="100" width="150" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
                <text x="38" y="120" font-size="10" font-weight="bold">View Specimen</text>
              </g>
            </g>`;
          }).join('')}

          <!-- Pagination Bar -->
          <g transform="translate(150, 955)">
            <rect width="70" height="28" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="14" y="18" font-size="9.5" font-weight="bold">&lt; Prev</text>

            <rect x="80" y="0" width="28" height="28" rx="5" fill="#000000" />
            <text x="91" y="18" font-size="9.5" font-weight="bold" fill="#FFFFFF">1</text>

            <rect x="116" y="0" width="28" height="28" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="127" y="18" font-size="9.5" font-weight="bold">2</text>

            <rect x="152" y="0" width="28" height="28" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="163" y="18" font-size="9.5" font-weight="bold">3</text>

            <rect x="190" y="0" width="70" height="28" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="14" y="18" font-size="9.5" font-weight="bold">Next &gt;</text>
          </g>
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 3: BOOK DETAILS & 4-TIER SHELF NAVIGATOR (/book-details)
// --------------------------------------------------------------------------------
const BOOK_DETAILS_CONTENT = `
    <!-- 2. BREADCRUMB & HERO DETAILS -->
    <g transform="translate(0, 90)">
      <rect width="860" height="490" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="180" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. BOOK SPECIMEN VIEW</text>

      <!-- Breadcrumbs -->
      <g transform="translate(40, 24)">
        <text x="0" y="12" font-size="9.5" fill="#555555">Home &gt; Catalog &gt; Literature &gt; The Midnight Library</text>
      </g>

      <g transform="translate(40, 50)">
        <!-- Left: Large Cover Box [X] -->
        <g transform="translate(0, 0)">
          <rect width="250" height="350" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
          <line x1="0" y1="0" x2="250" y2="350" stroke="#777777" stroke-width="1.4" />
          <line x1="0" y1="350" x2="250" y2="0" stroke="#777777" stroke-width="1.4" />
          <rect x="75" y="155" width="100" height="30" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" rx="4" />
          <text x="88" y="174" font-size="11" font-weight="bold">[ COVER: X ]</text>

          <!-- Barcode Box below Cover -->
          <g transform="translate(0, 365)">
            <rect width="250" height="50" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="12" y="18" font-size="8.5" font-weight="bold">ITEM BARCODE: LIBRA-8472-F</text>
            <rect x="12" y="26" width="226" height="16" fill="#EEEEEE" stroke="#000000" stroke-width="0.8" />
            <text x="40" y="38" font-size="8" font-family="monospace">|||| | ||||| || |||||| | ||||</text>
          </g>
        </g>

        <!-- Right: Book Specifications -->
        <g transform="translate(285, 0)">
          <rect width="110" height="22" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="1.2" />
          <text x="14" y="15" font-size="9.5" font-weight="bold">Fiction &amp; Mind</text>

          <text x="0" y="52" font-size="22" font-weight="bold" fill="#000000">The Midnight Library</text>
          <text x="0" y="74" font-size="13" font-weight="bold" fill="#555555">by Matt Haig · Published 2020</text>

          <!-- 5 Stars Outlines -->
          <g transform="translate(0, 86)">
            ${[0, 1, 2, 3, 4].map(s => `
              <polygon points="8,1 10,6 15,6 11,9 13,14 8,11 3,14 5,9 1,6 6,6" transform="translate(${s * 18}, 0)" fill="#000000" stroke="#000000" stroke-width="0.8" />
            `).join('')}
            <text x="100" y="11" font-size="9.5" font-weight="bold">4.8 / 5.0 (2,410 Reviews)</text>
          </g>

          <!-- Book Synopsis Placeholder Lines -->
          <g transform="translate(0, 115)">
            <rect x="0" y="0" width="480" height="8" rx="2" fill="#333333" />
            <rect x="0" y="14" width="460" height="8" rx="2" fill="#666666" />
            <rect x="0" y="28" width="470" height="8" rx="2" fill="#777777" />
            <rect x="0" y="42" width="410" height="8" rx="2" fill="#888888" />
            <rect x="0" y="56" width="360" height="8" rx="2" fill="#888888" />
          </g>

          <!-- Metadata Grid Box -->
          <g transform="translate(0, 195)">
            <rect width="490" height="80" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
            <g transform="translate(20, 18)">
              <text x="0" y="12" font-size="9" fill="#666666">PAGES</text>
              <text x="0" y="28" font-size="11" font-weight="bold">304 pgs</text>
            </g>
            <g transform="translate(140, 18)">
              <text x="0" y="12" font-size="9" fill="#666666">LANGUAGE</text>
              <text x="0" y="28" font-size="11" font-weight="bold">English</text>
            </g>
            <g transform="translate(260, 18)">
              <text x="0" y="12" font-size="9" fill="#666666">COPIES</text>
              <text x="0" y="28" font-size="11" font-weight="bold">3 Total (2 Avail)</text>
            </g>
            <g transform="translate(380, 18)">
              <text x="0" y="12" font-size="9" fill="#666666">LOAN PERIOD</text>
              <text x="0" y="28" font-size="11" font-weight="bold">14 Days</text>
            </g>
          </g>

          <!-- Primary Actions -->
          <g transform="translate(0, 305)">
            <rect width="210" height="42" rx="6" fill="#000000" />
            <text x="44" y="26" font-size="11" font-weight="bold" fill="#FFFFFF">Borrow / Hold Copy</text>

            <rect x="225" y="0" width="130" height="42" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
            <text x="250" y="26" font-size="11" font-weight="bold">+ Wishlist</text>

            <rect x="370" y="0" width="120" height="42" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
            <text x="395" y="26" font-size="11" font-weight="bold">Compare</text>
          </g>
        </g>
      </g>
    </g>

    <!-- 3. 4-TIER INTERACTIVE SHELF LOCATION MAP -->
    <g transform="translate(0, 580)">
      <rect width="860" height="340" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. 4-TIER SHELF WAYPOINT</text>

      <g transform="translate(40, 34)">
        <text x="0" y="16" font-size="13" font-weight="bold" fill="#000000">Physical Shelf Waypoint &amp; Stack Navigator</text>
        <text x="0" y="32" font-size="9.5" fill="#666666">Exact step-by-step route to locate this physical volume in the biophilic library.</text>

        <!-- 4 Connected Waypoint Boxes -->
        <g transform="translate(0, 50)">
          <!-- Tier 1: Floor -->
          <g transform="translate(0, 0)">
            <rect width="180" height="110" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <text x="14" y="24" font-size="9" fill="#666666">STEP 1: FLOOR LEVEL</text>
            <text x="14" y="48" font-size="13" font-weight="bold">Level 2</text>
            <text x="14" y="66" font-size="9.5" fill="#333333">Quiet Fiction Wing</text>
            <rect x="14" y="80" width="100" height="16" rx="4" fill="#EEEEEE" />
            <text x="24" y="92" font-size="8.5" font-weight="bold">East Stairs Entry</text>
          </g>

          <line x1="180" y1="55" x2="200" y2="55" stroke="#000000" stroke-width="2" marker-end="url(#arrow)" />
          <polygon points="200,55 194,51 194,59" fill="#000000" />

          <!-- Tier 2: Aisle -->
          <g transform="translate(200, 0)">
            <rect width="180" height="110" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <text x="14" y="24" font-size="9" fill="#666666">STEP 2: AISLE / ZONE</text>
            <text x="14" y="48" font-size="13" font-weight="bold">Aisle 04</text>
            <text x="14" y="66" font-size="9.5" fill="#333333">Novels &amp; Modern Prose</text>
            <rect x="14" y="80" width="110" height="16" rx="4" fill="#EEEEEE" />
            <text x="24" y="92" font-size="8.5" font-weight="bold">Row 4 - Left Side</text>
          </g>

          <polygon points="400,55 394,51 394,59" fill="#000000" />

          <!-- Tier 3: Stack -->
          <g transform="translate(400, 0)">
            <rect width="180" height="110" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <text x="14" y="24" font-size="9" fill="#666666">STEP 3: SHELF STACK</text>
            <text x="14" y="48" font-size="13" font-weight="bold">Stack F-07</text>
            <text x="14" y="66" font-size="9.5" fill="#333333">Dewey Call: 823.92 HAI</text>
            <rect x="14" y="80" width="110" height="16" rx="4" fill="#EEEEEE" />
            <text x="24" y="92" font-size="8.5" font-weight="bold">Oakwood Shelf Stacks</text>
          </g>

          <polygon points="600,55 594,51 594,59" fill="#000000" />

          <!-- Tier 4: Bay / Bin -->
          <g transform="translate(600, 0)">
            <rect width="180" height="110" rx="6" fill="#000000" stroke="#000000" stroke-width="1.6" />
            <text x="14" y="24" font-size="9" fill="#CCCCCC">STEP 4: EXACT BIN</text>
            <text x="14" y="48" font-size="13" font-weight="bold" fill="#FFFFFF">Bay 3, Shelf B</text>
            <text x="14" y="66" font-size="9.5" fill="#EEEEEE">Eye-level shelf rack</text>
            <rect x="14" y="80" width="120" height="16" rx="4" fill="#FFFFFF" />
            <text x="20" y="92" font-size="8.5" font-weight="bold" fill="#000000">Target Location</text>
          </g>
        </g>

        <!-- Floor Plan Route Diagram Miniature -->
        <g transform="translate(0, 180)">
          <rect width="780" height="65" rx="6" fill="#F8F8F8" stroke="#000000" stroke-width="1.2" />
          <text x="16" y="20" font-size="9" font-weight="bold">MAP COORDINATES: [X: 42.8, Y: 11.4] · PROXIMITY SENSOR ID: SANCTUARY-L2-F07</text>
          <line x1="16" y1="38" x2="760" y2="38" stroke="#777777" stroke-width="1.5" stroke-dasharray="6,4" />
          <circle cx="40" cy="38" r="6" fill="#000000" />
          <text x="32" y="55" font-size="8">Entrance</text>
          <circle cx="280" cy="38" r="6" fill="#666666" />
          <text x="260" y="55" font-size="8">Aisle 04</text>
          <circle cx="580" cy="38" r="8" fill="#000000" />
          <text x="560" y="55" font-size="8" font-weight="bold">Stack F-07 (HERE)</text>
          <circle cx="740" cy="38" r="6" fill="#CCCCCC" />
          <text x="710" y="55" font-size="8">Checkout</text>
        </g>
      </g>
    </g>

    <!-- 4. PHYSICAL COPIES & SIMILAR BOOKS -->
    <g transform="translate(0, 920)">
      <rect width="860" height="365" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. COPIES &amp; RELATED</text>

      <g transform="translate(40, 32)">
        <text x="0" y="16" font-size="12" font-weight="bold">PHYSICAL COPY AVAILABILITY LEDGER</text>
        <!-- Table -->
        <g transform="translate(0, 26)">
          <rect width="780" height="26" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
          <text x="14" y="17" font-size="9" font-weight="bold">COPY CODE</text>
          <text x="180" y="17" font-size="9" font-weight="bold">SHELF LOCATION</text>
          <text x="380" y="17" font-size="9" font-weight="bold">STATUS</text>
          <text x="540" y="17" font-size="9" font-weight="bold">RETURN DUE</text>
          <text x="680" y="17" font-size="9" font-weight="bold">ACTION</text>

          ${[
            { code: 'LIBRA-8472-C1', loc: 'Stack F-07, Bay 3', status: 'Available', due: '—', act: 'Borrow' },
            { code: 'LIBRA-8472-C2', loc: 'Stack F-07, Bay 3', status: 'Available', due: '—', act: 'Borrow' },
            { code: 'LIBRA-8472-C3', loc: 'Circulation Loan', status: 'Borrowed', due: 'Nov 12, 2026', act: 'Hold Queue' },
          ].map((row, r) => `
            <g transform="translate(0, ${26 + r * 30})">
              <rect width="780" height="30" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="1" />
              <text x="14" y="20" font-size="9" font-family="monospace">${row.code}</text>
              <text x="180" y="20" font-size="9">${row.loc}</text>
              <rect x="380" y="6" width="70" height="18" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
              <text x="390" y="19" font-size="8.5" font-weight="bold">${row.status}</text>
              <text x="540" y="20" font-size="9">${row.due}</text>
              <rect x="680" y="5" width="80" height="20" rx="4" fill="#000000" />
              <text x="696" y="19" font-size="8.5" font-weight="bold" fill="#FFFFFF">${row.act}</text>
            </g>
          `).join('')}
        </g>

        <!-- Similar Books Strip -->
        <g transform="translate(0, 155)">
          <text x="0" y="16" font-size="12" font-weight="bold">READERS ALSO EXPLORED</text>
          <g transform="translate(0, 26)">
            ${[0, 1, 2, 3].map(c => `
              <g transform="translate(${c * 198}, 0)">
                <rect width="186" height="100" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
                <g transform="translate(10, 10)">
                  <rect width="55" height="80" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
                  <line x1="0" y1="0" x2="55" y2="80" stroke="#777777" stroke-width="1" />
                  <line x1="0" y1="80" x2="55" y2="0" stroke="#777777" stroke-width="1" />
                  <text x="20" y="44" font-size="9" font-weight="bold">[X]</text>
                </g>
                <g transform="translate(75, 14)">
                  <rect width="95" height="8" rx="2" fill="#222222" />
                  <rect width="70" height="6" rx="2" fill="#666666" y="14" />
                  <rect width="80" height="6" rx="2" fill="#888888" y="24" />
                  <rect width="90" height="22" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1" y="46" />
                  <text x="14" y="61" font-size="8" font-weight="bold">View Specimen</text>
                </g>
              </g>
            `).join('')}
          </g>
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 4: AI SEMANTIC BOOK FINDER (/ai-finder)
// --------------------------------------------------------------------------------
const AI_FINDER_CONTENT = `
    <!-- 2. AI HERO HEADER -->
    <g transform="translate(0, 90)">
      <rect width="860" height="150" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="160" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. AI ENGINE HEADER</text>

      <g transform="translate(40, 32)">
        <text x="0" y="24" font-size="20" font-weight="bold" fill="#000000">AI Semantic Book Matcher &amp; Recommendation Engine</text>
        <rect x="0" y="38" width="480" height="8" rx="2" fill="#666666" />
        <rect x="0" y="52" width="360" height="8" rx="2" fill="#888888" />
        
        <!-- Engine Status Badge -->
        <g transform="translate(620, 8)">
          <rect width="160" height="50" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
          <text x="14" y="20" font-size="8.5" fill="#666666">NEURAL MATCH MODEL</text>
          <text x="14" y="38" font-size="11" font-weight="bold">LibraMind v2.4 Active</text>
        </g>
      </g>
    </g>

    <!-- 3. NATURAL LANGUAGE PROMPT INPUT & MOOD CHIPS -->
    <g transform="translate(0, 240)">
      <rect width="860" height="230" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="210" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. NATURAL PROMPT INPUT</text>

      <g transform="translate(40, 32)">
        <!-- Multi-line Prompt Box -->
        <rect width="780" height="85" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <text x="20" y="28" font-size="11" fill="#444444">"I want a contemplative novel about solitude, memory, and parallel lives in a cozy atmospheric setting..."</text>
        <rect x="20" y="44" width="450" height="7" rx="2" fill="#CCCCCC" />

        <g transform="translate(580, 42)">
          <rect width="180" height="34" rx="6" fill="#000000" />
          <text x="36" y="22" font-size="10.5" font-weight="bold" fill="#FFFFFF">Find AI Matches</text>
        </g>

        <!-- Curated Mood Chips -->
        <g transform="translate(0, 105)">
          <text x="0" y="16" font-size="9.5" font-weight="bold">EXPLORE CURATED INSPIRATIONS:</text>
          <g transform="translate(0, 26)">
            ${['Deep Philosophy', 'AI & Digital Consciousness', 'Cozy Biophilic Fiction', 'Climate Futures', 'Architecture & Space', 'Surprise Me'].map((chip, c) => `
              <g transform="translate(${c * 130}, 0)">
                <rect width="122" height="26" rx="13" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
                <text x="14" y="17" font-size="8.5" font-weight="bold">${chip}</text>
              </g>
            `).join('')}
          </g>
        </g>
      </g>
    </g>

    <!-- 4. AI REASONING & 3-COLUMN MATCH RESULTS -->
    <g transform="translate(0, 470)">
      <rect width="860" height="815" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. SEMANTIC RECOMMENDATIONS</text>

      <g transform="translate(40, 32)">
        <!-- Reasoning Gauge Card -->
        <rect width="780" height="60" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
        <text x="20" y="24" font-size="10.5" font-weight="bold">AI CONFIDENCE SCORE: 98% MATCH FOR YOUR INQUIRY</text>
        <rect x="20" y="34" width="740" height="10" rx="5" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
        <rect x="20" y="34" width="715" height="10" rx="5" fill="#000000" />

        <!-- 3 Match Cards -->
        <g transform="translate(0, 80)">
          ${[
            { title: 'The Midnight Library', author: 'Matt Haig', pct: '98%', reason: 'Explores infinite parallel lives, regret, and choices in a mystical sanctuary.' },
            { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', pct: '94%', reason: 'Deeply contemplative exploration of artificial empathy, memory, and love.' },
            { title: 'The Overstory', author: 'Richard Powers', pct: '91%', reason: 'Biophilic monument intertwining human lives with the majestic wisdom of trees.' },
          ].map((book, b) => `
            <g transform="translate(${b * 268}, 0)">
              <rect width="248" height="640" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
              <!-- Cover Placeholder [X] -->
              <g transform="translate(18, 18)">
                <rect width="212" height="260" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" rx="6" />
                <line x1="0" y1="0" x2="212" y2="260" stroke="#777777" stroke-width="1.2" />
                <line x1="0" y1="260" x2="212" y2="0" stroke="#777777" stroke-width="1.2" />
                <rect x="80" y="115" width="52" height="24" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" rx="3" />
                <text x="96" y="132" font-size="11" font-weight="bold">[X]</text>
              </g>

              <!-- Match Pill -->
              <g transform="translate(18, 292)">
                <rect width="100" height="22" rx="11" fill="#000000" />
                <text x="14" y="15" font-size="9" font-weight="bold" fill="#FFFFFF">${book.pct} AI Match</text>
              </g>

              <!-- Title & Author -->
              <g transform="translate(18, 326)">
                <text x="0" y="16" font-size="14" font-weight="bold">${book.title}</text>
                <text x="0" y="32" font-size="10.5" fill="#555555">by ${book.author}</text>

                <!-- AI Rationale Box -->
                <g transform="translate(0, 48)">
                  <rect width="212" height="110" rx="6" fill="#F8F8F8" stroke="#000000" stroke-width="1" />
                  <text x="10" y="18" font-size="8.5" font-weight="bold">WHY AI SELECTED THIS:</text>
                  <text x="10" y="36" font-size="8.5" fill="#444444" width="190">${book.reason}</text>
                  <rect x="10" y="70" width="190" height="6" rx="2" fill="#CCCCCC" />
                  <rect x="10" y="82" width="150" height="6" rx="2" fill="#CCCCCC" />
                </g>

                <!-- Action Button -->
                <rect x="0" y="180" width="212" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
                <text x="64" y="204" font-size="10.5" font-weight="bold">Borrow Volume</text>
              </g>
            </g>
          `).join('')}
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 5: STUDY SEAT & FOCUS POD MAP (/seats)
// --------------------------------------------------------------------------------
const SEATS_CONTENT = `
    <!-- 2. STUDY SANCTUARY HEADER & SLOT CONTROLS -->
    <g transform="translate(0, 90)">
      <rect width="860" height="160" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. SEAT BOOKING CONTROLS</text>

      <g transform="translate(40, 32)">
        <text x="0" y="20" font-size="18" font-weight="bold" fill="#000000">Interactive Study Seat &amp; Focus Pod Reservation</text>
        <text x="0" y="38" font-size="9.5" fill="#666666">Reserve silent carrels, collaborative tables, or biophilic garden pods for 2-hour and 3-hour focus sessions.</text>

        <!-- Slot Control Bar -->
        <g transform="translate(0, 52)">
          <rect width="160" height="36" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <text x="18" y="22" font-size="10" font-weight="bold">Date: Today, Nov 1 v</text>

          ${['09:00 - 11:00', '11:00 - 13:00', '14:00 - 17:00 (Selected)', '18:00 - 21:00'].map((slot, s) => `
            <g transform="translate(${175 + s * 148}, 0)">
              <rect width="140" height="36" rx="6" fill="${s === 2 ? '#000000' : '#FFFFFF'}" stroke="#000000" stroke-width="1.5" />
              <text x="12" y="22" font-size="9.5" font-weight="bold" fill="${s === 2 ? '#FFFFFF' : '#000000'}">${slot}</text>
            </g>
          `).join('')}
        </g>
      </g>
    </g>

    <!-- 3. INTERACTIVE SEAT MAP GRID (4 ZONES) -->
    <g transform="translate(0, 250)">
      <rect width="860" height="720" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. SANCTUARY FLOOR PLAN</text>

      <g transform="translate(40, 34)">
        <!-- Legend Strip -->
        <g transform="translate(0, 0)">
          <rect width="780" height="36" rx="6" fill="#F8F8F8" stroke="#000000" stroke-width="1.2" />
          <g transform="translate(20, 10)">
            <rect width="16" height="16" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="24" y="12" font-size="9">Available (White)</text>
          </g>
          <g transform="translate(180, 10)">
            <rect width="16" height="16" rx="3" fill="#777777" />
            <text x="24" y="12" font-size="9">Occupied (Dark)</text>
          </g>
          <g transform="translate(340, 10)">
            <rect width="16" height="16" rx="3" fill="#EEEEEE" stroke="#000000" stroke-width="1.4" stroke-dasharray="2,2" />
            <text x="24" y="12" font-size="9">Reserved in Queue</text>
          </g>
          <g transform="translate(520, 10)">
            <rect width="16" height="16" rx="3" fill="#000000" />
            <text x="24" y="12" font-size="9" font-weight="bold">Your Selection (Black)</text>
          </g>
        </g>

        <!-- Floor Plan Graphic Box -->
        <g transform="translate(0, 50)">
          <rect width="780" height="580" rx="10" fill="#FAFAFA" stroke="#000000" stroke-width="1.8" />

          <!-- Zone 1: Quiet Focus Pods (Top Left) -->
          <g transform="translate(30, 30)">
            <rect width="330" height="230" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" stroke-dasharray="4,4" />
            <text x="16" y="24" font-size="11" font-weight="bold">ZONE A: QUIET FOCUS PODS</text>
            ${[1, 2, 3, 4].map((pod, p) => {
              const x = 20 + (p % 2) * 150;
              const y = 45 + Math.floor(p / 2) * 85;
              const isSelected = pod === 3;
              return `
              <g transform="translate(${x}, ${y})">
                <rect width="130" height="70" rx="6" fill="${isSelected ? '#000000' : '#FFFFFF'}" stroke="#000000" stroke-width="1.6" />
                <text x="14" y="26" font-size="11" font-weight="bold" fill="${isSelected ? '#FFFFFF' : '#000000'}">Pod #0${pod}</text>
                <text x="14" y="44" font-size="8.5" fill="${isSelected ? '#DDDDDD' : '#666666'}">Silent · Outlet</text>
                <text x="14" y="58" font-size="8.5" font-weight="bold" fill="${isSelected ? '#FFFFFF' : '#000000'}">${isSelected ? '[ SELECTED ]' : 'Available'}</text>
              </g>`;
            }).join('')}
          </g>

          <!-- Zone 2: Collaborative Hub (Top Right) -->
          <g transform="translate(410, 30)">
            <rect width="340" height="230" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" stroke-dasharray="4,4" />
            <text x="16" y="24" font-size="11" font-weight="bold">ZONE B: COLLABORATIVE HUB</text>
            <!-- Large Table with Chairs -->
            <rect x="70" y="60" width="200" height="110" rx="12" fill="#EEEEEE" stroke="#000000" stroke-width="1.6" />
            <text x="115" y="120" font-size="11" font-weight="bold">Study Table #1</text>
            <!-- 6 Chair Nodes -->
            ${[0, 1, 2].map(c => `
              <circle cx="${95 + c * 75}" cy="42" r="12" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
              <circle cx="${95 + c * 75}" cy="188" r="12" fill="#777777" />
            `).join('')}
          </g>

          <!-- Zone 3: Garden Window Desks (Bottom Left) -->
          <g transform="translate(30, 280)">
            <rect width="330" height="260" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" stroke-dasharray="4,4" />
            <text x="16" y="24" font-size="11" font-weight="bold">ZONE C: GARDEN WINDOW PODS</text>
            <line x1="20" y1="40" x2="310" y2="40" stroke="#000000" stroke-width="3" />
            <text x="90" y="52" font-size="8.5" font-weight="bold">GLASS WINDOW ARBORETUM VIEW</text>
            ${[5, 6, 7, 8].map((pod, p) => `
              <g transform="translate(${20 + p * 72}, 68)">
                <rect width="64" height="160" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
                <text x="8" y="24" font-size="9" font-weight="bold">Desk #${pod}</text>
                <rect x="8" y="38" width="48" height="60" rx="4" fill="#EEEEEE" />
                <circle cx="32" cy="120" r="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
                <text x="10" y="150" font-size="8" font-weight="bold">Available</text>
              </g>
            `).join('')}
          </g>

          <!-- Zone 4: Individual Focus Carrels (Bottom Right) -->
          <g transform="translate(410, 280)">
            <rect width="340" height="260" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" stroke-dasharray="4,4" />
            <text x="16" y="24" font-size="11" font-weight="bold">ZONE D: INDIVIDUAL FOCUS CARRELS</text>
            ${[9, 10, 11, 12].map((pod, p) => {
              const x = 20 + (p % 2) * 155;
              const y = 50 + Math.floor(p / 2) * 95;
              return `
              <g transform="translate(${x}, ${y})">
                <rect width="140" height="80" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
                <text x="12" y="24" font-size="10" font-weight="bold">Carrel #${pod}</text>
                <text x="12" y="42" font-size="8.5" fill="#666666">Dual Screen / Power</text>
                <rect x="12" y="52" width="70" height="18" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
                <text x="20" y="64" font-size="8">Open Slot</text>
              </g>`;
            }).join('')}
          </g>
        </g>
      </g>
    </g>

    <!-- 4. SELECTED SEAT RESERVATION DRAWER -->
    <g transform="translate(0, 970)">
      <rect width="860" height="315" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. RESERVATION CONFIRMATION</text>

      <g transform="translate(40, 34)">
        <rect width="780" height="235" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.6" />

        <g transform="translate(24, 20)">
          <rect width="120" height="22" rx="4" fill="#000000" />
          <text x="14" y="15" font-size="9" font-weight="bold" fill="#FFFFFF">ACTIVE SELECTION</text>

          <text x="0" y="52" font-size="18" font-weight="bold">Pod #03 — Quiet Study Sanctuary (Window Garden)</text>
          <text x="0" y="74" font-size="11" fill="#444444">Session Time: Today, 14:00 – 17:00 (3-Hour Block) · Max 1 Concurrent Booking Policy</text>

          <!-- Amenity Badges -->
          <g transform="translate(0, 90)">
            ${['High-Speed USB-C & AC Power', 'Silent Focus Acoustic Baffles', 'Ergonomic Mesh Chair', 'Direct Garden Daylight'].map((amen, a) => `
              <g transform="translate(${a * 180}, 0)">
                <rect width="170" height="28" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
                <text x="10" y="18" font-size="8.5" font-weight="bold">✓ ${amen}</text>
              </g>
            `).join('')}
          </g>

          <!-- Action Buttons -->
          <g transform="translate(0, 140)">
            <rect width="240" height="42" rx="6" fill="#000000" />
            <text x="38" y="26" font-size="11.5" font-weight="bold" fill="#FFFFFF">Confirm 3-Hour Reservation</text>

            <rect x="260" y="0" width="160" height="42" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
            <text x="290" y="26" font-size="11" font-weight="bold">Change Slot</text>
          </g>
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 6: MULTI-BOOK COMPARISON MATRIX (/compare)
// --------------------------------------------------------------------------------
const COMPARE_CONTENT = `
    <!-- 2. COMPARISON HEADER -->
    <g transform="translate(0, 90)">
      <rect width="860" height="110" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. COMPARISON HEADER</text>

      <g transform="translate(40, 32)">
        <text x="0" y="20" font-size="18" font-weight="bold">Multi-Book Specimen Comparison Matrix</text>
        <text x="0" y="38" font-size="9.5" fill="#666666">Evaluate literature side-by-side: thematic depth, shelf stacks, length, and circulation availability.</text>

        <g transform="translate(600, 8)">
          <rect width="90" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <text x="18" y="20" font-size="9.5" font-weight="bold">+ Add Book</text>

          <rect x="100" y="0" width="80" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <text x="20" y="20" font-size="9.5" font-weight="bold">Clear All</text>
        </g>
      </g>
    </g>

    <!-- 3. SIDE-BY-SIDE MATRIX COLUMNS -->
    <g transform="translate(0, 200)">
      <rect width="860" height="1085" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="210" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. SIDE-BY-SIDE MATRIX</text>

      <g transform="translate(40, 34)">
        <!-- Criteria Legend Column (160px) -->
        <g transform="translate(0, 0)">
          <rect width="150" height="1000" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
          <text x="16" y="110" font-size="9.5" font-weight="bold">SPECIMEN COVER</text>
          <text x="16" y="240" font-size="9.5" font-weight="bold">TITLE &amp; AUTHOR</text>
          <text x="16" y="320" font-size="9.5" font-weight="bold">GENRE / DOMAIN</text>
          <text x="16" y="390" font-size="9.5" font-weight="bold">PAGE VOLUME</text>
          <text x="16" y="460" font-size="9.5" font-weight="bold">SHELF LOCATION</text>
          <text x="16" y="530" font-size="9.5" font-weight="bold">LOAN DURATION</text>
          <text x="16" y="600" font-size="9.5" font-weight="bold">CIRCULATION STATUS</text>
          <text x="16" y="700" font-size="9.5" font-weight="bold">COMMUNITY RATING</text>
          <text x="16" y="820" font-size="9.5" font-weight="bold">DISPATCH ACTION</text>
        </g>

        <!-- 3 Books Side by Side -->
        ${[
          { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Contemporary Fiction', pages: '304 pgs (2020)', shelf: 'Level 2, Stack F-07', status: 'Available (2)', act: 'Borrow Now' },
          { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Dystopian Sci-Fi', pages: '320 pgs (2021)', shelf: 'Level 1, Stack B-04', status: 'In Queue (#1)', act: 'Join Queue' },
          { title: 'The Overstory', author: 'Richard Powers', genre: 'Biophilic Fiction', pages: '512 pgs (2018)', shelf: 'Level 2, Stack F-12', status: 'Available (1)', act: 'Borrow Now' },
        ].map((item, idx) => `
          <g transform="translate(${170 + idx * 205}, 0)">
            <rect width="195" height="1000" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            
            <!-- Remove Button -->
            <rect x="160" y="8" width="24" height="24" rx="12" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
            <text x="168" y="24" font-size="11" font-weight="bold">×</text>

            <!-- 1. Cover Box [X] -->
            <g transform="translate(25, 30)">
              <rect width="145" height="170" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" rx="4" />
              <line x1="0" y1="0" x2="145" y2="170" stroke="#777777" stroke-width="1.2" />
              <line x1="0" y1="170" x2="145" y2="0" stroke="#777777" stroke-width="1.2" />
              <rect x="52" y="75" width="40" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
              <text x="66" y="89" font-size="10" font-weight="bold">[X]</text>
            </g>

            <!-- 2. Title & Author -->
            <g transform="translate(18, 225)">
              <text x="0" y="16" font-size="12" font-weight="bold">${item.title}</text>
              <text x="0" y="32" font-size="10" fill="#555555">${item.author}</text>
            </g>

            <line x1="10" y1="290" x2="185" y2="290" stroke="#CCCCCC" stroke-width="1" />

            <!-- 3. Genre -->
            <g transform="translate(18, 310)">
              <rect width="140" height="22" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
              <text x="10" y="15" font-size="8.5" font-weight="bold">${item.genre}</text>
            </g>

            <line x1="10" y1="360" x2="185" y2="360" stroke="#CCCCCC" stroke-width="1" />

            <!-- 4. Pages -->
            <g transform="translate(18, 385)">
              <text x="0" y="14" font-size="11" font-weight="bold">${item.pages}</text>
            </g>

            <line x1="10" y1="430" x2="185" y2="430" stroke="#CCCCCC" stroke-width="1" />

            <!-- 5. Shelf -->
            <g transform="translate(18, 455)">
              <text x="0" y="14" font-size="10.5" font-weight="bold">${item.shelf}</text>
            </g>

            <line x1="10" y1="500" x2="185" y2="500" stroke="#CCCCCC" stroke-width="1" />

            <!-- 6. Loan Period -->
            <g transform="translate(18, 525)">
              <text x="0" y="14" font-size="11" font-weight="bold">14 Days Standard</text>
            </g>

            <line x1="10" y1="570" x2="185" y2="570" stroke="#CCCCCC" stroke-width="1" />

            <!-- 7. Status -->
            <g transform="translate(18, 595)">
              <rect width="110" height="24" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
              <text x="12" y="16" font-size="9" font-weight="bold">${item.status}</text>
            </g>

            <line x1="10" y1="650" x2="185" y2="650" stroke="#CCCCCC" stroke-width="1" />

            <!-- 8. Rating -->
            <g transform="translate(18, 690)">
              <text x="0" y="16" font-size="13" font-weight="bold">★ 4.8 / 5.0</text>
              <rect x="0" y="28" width="150" height="6" rx="2" fill="#888888" />
            </g>

            <line x1="10" y1="770" x2="185" y2="770" stroke="#CCCCCC" stroke-width="1" />

            <!-- 9. Dispatch Action -->
            <g transform="translate(18, 810)">
              <rect width="160" height="38" rx="6" fill="#000000" />
              <text x="44" y="24" font-size="10.5" font-weight="bold" fill="#FFFFFF">${item.act}</text>
            </g>
          </g>
        `).join('')}
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 7: VISIT PLANNER (/visit-planner)
// --------------------------------------------------------------------------------
const VISIT_PLANNER_CONTENT = `
    <!-- 2. PLANNER HEADER -->
    <g transform="translate(0, 90)">
      <rect width="860" height="120" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. VISIT PLANNER HEADER</text>

      <g transform="translate(40, 32)">
        <text x="0" y="20" font-size="18" font-weight="bold">Intelligent Library Visit Planner &amp; Stack Route Guide</text>
        <text x="0" y="38" font-size="9.5" fill="#666666">Organize your physical library visit: select books to pick up, choose study blocks, and generate an optimal floor waypoint itinerary.</text>
      </g>
    </g>

    <!-- 3. STEP 1: VISIT INTENT SELECTOR -->
    <g transform="translate(0, 210)">
      <rect width="860" height="210" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="180" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. STEP 1: VISIT INTENT</text>

      <g transform="translate(40, 34)">
        <text x="0" y="16" font-size="12" font-weight="bold">WHAT IS THE PRIMARY PURPOSE OF YOUR VISIT TODAY?</text>
        <g transform="translate(0, 26)">
          ${[
            { title: 'Quick Book Pickup', desc: 'Pre-held items ready at desk, rapid checkout under 10 min.', sel: true },
            { title: 'Deep Focus Study Session', desc: 'Reserved quiet pod, ambient reading, power & wifi access.', sel: false },
            { title: 'Browse Stacks & Discover', desc: 'Leisurely shelf traversal, AI recommendations guide.', sel: false },
          ].map((intent, i) => `
            <g transform="translate(${i * 268}, 0)">
              <rect width="250" height="115" rx="8" fill="${intent.sel ? '#000000' : '#FFFFFF'}" stroke="#000000" stroke-width="1.6" />
              <text x="18" y="28" font-size="12" font-weight="bold" fill="${intent.sel ? '#FFFFFF' : '#000000'}">${intent.title}</text>
              <text x="18" y="52" font-size="9" fill="${intent.sel ? '#DDDDDD' : '#666666'}" width="210">${intent.desc}</text>
              <rect x="18" y="78" width="90" height="20" rx="4" fill="${intent.sel ? '#FFFFFF' : '#EEEEEE'}" />
              <text x="28" y="92" font-size="8.5" font-weight="bold" fill="#000000">${intent.sel ? '✓ Selected' : 'Select Intent'}</text>
            </g>
          `).join('')}
        </g>
      </g>
    </g>

    <!-- 4. STEP 2 & 3: BOOK CHECKLIST & OPTIMAL ROUTE MAP -->
    <g transform="translate(0, 420)">
      <rect width="860" height="480" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. WAYPOINT ROUTE GENERATOR</text>

      <g transform="translate(40, 34)">
        <!-- Left: Selected Volumes Checklist (300px) -->
        <g transform="translate(0, 0)">
          <rect width="280" height="410" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
          <text x="16" y="24" font-size="10.5" font-weight="bold">YOUR PICKUP &amp; SHELF LIST</text>

          ${[
            { title: 'The Midnight Library', loc: 'Stack F-07 (Level 2)', status: 'Ready at Desk' },
            { title: 'Klara and the Sun', loc: 'Stack B-04 (Level 1)', status: 'On Open Shelf' },
            { title: 'Designing Data Apps', loc: 'Stack D-12 (Level 2)', status: 'On Open Shelf' },
          ].map((item, it) => `
            <g transform="translate(16, ${40 + it * 90})">
              <rect width="248" height="80" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
              <text x="12" y="22" font-size="10" font-weight="bold">[${it + 1}] ${item.title}</text>
              <text x="12" y="40" font-size="9" fill="#555555">${item.loc}</text>
              <rect x="12" y="52" width="110" height="18" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="0.8" />
              <text x="20" y="64" font-size="8" font-weight="bold">${item.status}</text>
            </g>
          `).join('')}

          <rect x="16" y="340" width="248" height="36" rx="6" fill="#000000" />
          <text x="64" y="362" font-size="10.5" font-weight="bold" fill="#FFFFFF">Optimize Floor Path</text>
        </g>

        <!-- Right: Optimal Floor Route Map Schematic (480px) -->
        <g transform="translate(300, 0)">
          <rect width="480" height="410" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="20" y="24" font-size="11" font-weight="bold">OPTIMAL WAYPOINT NAVIGATION PATH</text>
          <text x="20" y="40" font-size="8.5" fill="#666666">Estimated Total Distance: 84 meters · Est. Duration: 14 mins</text>

          <!-- Floor Plan Layout with Numbered Waypoint Path -->
          <g transform="translate(20, 55)">
            <rect width="440" height="330" rx="6" fill="#FAFAFA" stroke="#000000" stroke-width="1.4" />

            <!-- Path Line -->
            <path d="M 40 280 L 100 240 L 220 180 L 340 120 L 400 60" fill="none" stroke="#000000" stroke-width="2.5" stroke-dasharray="6,4" />

            <!-- Waypoint 1 -->
            <g transform="translate(40, 280)">
              <circle r="14" fill="#000000" />
              <text x="-4" y="4" font-size="11" font-weight="bold" fill="#FFFFFF">1</text>
              <text x="20" y="5" font-size="9" font-weight="bold">Library Entrance</text>
            </g>

            <!-- Waypoint 2 -->
            <g transform="translate(100, 240)">
              <circle r="14" fill="#000000" />
              <text x="-4" y="4" font-size="11" font-weight="bold" fill="#FFFFFF">2</text>
              <text x="20" y="5" font-size="9" font-weight="bold">Hold Pickup Desk</text>
            </g>

            <!-- Waypoint 3 -->
            <g transform="translate(220, 180)">
              <circle r="14" fill="#000000" />
              <text x="-4" y="4" font-size="11" font-weight="bold" fill="#FFFFFF">3</text>
              <text x="20" y="5" font-size="9" font-weight="bold">Stack B-04 (Level 1)</text>
            </g>

            <!-- Waypoint 4 -->
            <g transform="translate(340, 120)">
              <circle r="14" fill="#000000" />
              <text x="-4" y="4" font-size="11" font-weight="bold" fill="#FFFFFF">4</text>
              <text x="-120" y="5" font-size="9" font-weight="bold">Stack F-07 (Level 2)</text>
            </g>

            <!-- Waypoint 5 -->
            <g transform="translate(400, 60)">
              <circle r="14" fill="#000000" />
              <text x="-4" y="4" font-size="11" font-weight="bold" fill="#FFFFFF">5</text>
              <text x="-90" y="5" font-size="9" font-weight="bold">Self-Checkout</text>
            </g>
          </g>
        </g>
      </g>
    </g>

    <!-- 5. STEP 4: PRINTABLE VISIT ITINERARY CARD -->
    <g transform="translate(0, 900)">
      <rect width="860" height="385" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">5. PRINTABLE ITINERARY</text>

      <g transform="translate(40, 34)">
        <rect width="780" height="315" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.6" />

        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="bold">TODAY'S PHYSICAL VISIT SLIP &amp; WAYPOINT ITINERARY</text>
          <text x="0" y="34" font-size="9" fill="#555555">Valid for entry &amp; barcode scans: Sunday, Nov 1, 2026 · Member ID: #STU-8841</text>

          <g transform="translate(0, 50)">
            <rect width="730" height="160" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
            <g transform="translate(20, 20)">
              <text x="0" y="14" font-size="9.5" font-weight="bold">WAYPOINT 1 (14:00):</text>
              <text x="140" y="14" font-size="9.5">Proceed to Circulation Desk Shelf #3 for pre-held "The Midnight Library".</text>

              <text x="0" y="44" font-size="9.5" font-weight="bold">WAYPOINT 2 (14:08):</text>
              <text x="140" y="44" font-size="9.5">Take East Stairway to Level 1, Aisle 04 to locate "Klara and the Sun".</text>

              <text x="0" y="74" font-size="9.5" font-weight="bold">WAYPOINT 3 (14:15):</text>
              <text x="140" y="74" font-size="9.5">Check-in at Study Pod #03 in Window Garden for 3-hour focus session.</text>

              <text x="0" y="104" font-size="9.5" font-weight="bold">WAYPOINT 4 (17:00):</text>
              <text x="140" y="104" font-size="9.5">Self-checkout scans at East Exit Scanner Station.</text>
            </g>
          </g>

          <g transform="translate(0, 225)">
            <rect width="210" height="40" rx="6" fill="#000000" />
            <text x="36" y="25" font-size="11" font-weight="bold" fill="#FFFFFF">Print Itinerary (PDF)</text>

            <rect x="230" y="0" width="180" height="40" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
            <text x="256" y="25" font-size="11" font-weight="bold">Save to Mobile Hub</text>
          </g>
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 8: STUDENT & MEMBER SANCTUARY HUB (/dashboard)
// --------------------------------------------------------------------------------
const DASHBOARD_CONTENT = `
    <!-- 2. MEMBER PROFILE HEADER -->
    <g transform="translate(0, 90)">
      <rect width="860" height="150" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="180" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. MEMBER PROFILE</text>

      <g transform="translate(40, 32)">
        <circle cx="36" cy="36" r="36" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <circle cx="36" cy="28" r="14" fill="none" stroke="#000000" stroke-width="1.6" />
        <path d="M 16 56 C 16 44, 56 44, 56 56" fill="none" stroke="#000000" stroke-width="1.6" />

        <g transform="translate(90, 10)">
          <text x="0" y="20" font-size="18" font-weight="bold">Rudra Patel · Student Member Sanctuary</text>
          <text x="0" y="38" font-size="10" fill="#555555">Student ID: #STU-2026-8841 · Department of Computer Engineering</text>
          
          <rect x="0" y="48" width="110" height="20" rx="4" fill="#000000" />
          <text x="12" y="62" font-size="8.5" font-weight="bold" fill="#FFFFFF">ACTIVE PRIVILEGES</text>

          <rect x="120" y="48" width="130" height="20" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
          <text x="130" y="62" font-size="8.5" font-weight="bold">0 Overdue Fines ($0.00)</text>
        </g>
      </g>
    </g>

    <!-- 3. HUB TAB BAR & METRICS STRIP -->
    <g transform="translate(0, 240)">
      <rect width="860" height="160" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="180" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. HUB VIEWS &amp; STATS</text>

      <g transform="translate(40, 28)">
        <!-- Tab navigation -->
        <g transform="translate(0, 0)">
          ${['All Activity (Active)', 'My Loans (2)', 'Hold Queues (1)', 'Study Pods (1)', 'Wishlist (4)', 'AI For You'].map((tab, t) => `
            <g transform="translate(${t * 130}, 0)">
              <rect width="122" height="32" rx="6" fill="${t === 0 ? '#000000' : '#FFFFFF'}" stroke="#000000" stroke-width="1.4" />
              <text x="12" y="20" font-size="9" font-weight="bold" fill="${t === 0 ? '#FFFFFF' : '#000000'}">${tab}</text>
            </g>
          `).join('')}
        </g>

        <!-- 4 KPI Cards -->
        <g transform="translate(0, 48)">
          ${[
            { title: 'Currently Borrowed', val: '2 of 10 Books', sub: 'Next Due: Nov 14, 2026' },
            { title: 'Hold Queue Rank', val: '1 Book (Rank #1)', sub: 'Ready for Desk Pickup' },
            { title: 'Active Seat Booking', val: 'Pod #03 Reserved', sub: 'Today, 14:00 - 17:00' },
            { title: 'Personal Wishlist', val: '4 Saved Titles', sub: 'Curated by AI Recommender' },
          ].map((stat, s) => `
            <g transform="translate(${s * 198}, 0)">
              <rect width="186" height="70" rx="6" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
              <text x="12" y="20" font-size="8.5" fill="#666666">${stat.title.toUpperCase()}</text>
              <text x="12" y="38" font-size="12" font-weight="bold">${stat.val}</text>
              <text x="12" y="54" font-size="8" fill="#555555">${stat.sub}</text>
            </g>
          `).join('')}
        </g>
      </g>
    </g>

    <!-- 4. ACTIVE LOANS SECTION -->
    <g transform="translate(0, 400)">
      <rect width="860" height="360" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. CURRENT ACTIVE LOANS</text>

      <g transform="translate(40, 34)">
        <text x="0" y="16" font-size="12" font-weight="bold">VOLUMES CURRENTLY IN YOUR POSSESSION</text>
        <g transform="translate(0, 26)">
          ${[
            { title: 'Designing Data-Intensive Applications', barcode: 'LIBRA-4912-C1', due: 'Nov 14, 2026 (13 days left)', renews: '1 of 2 Renewals used' },
            { title: 'Structure and Interpretation of Computer Programs', barcode: 'LIBRA-2041-C2', due: 'Nov 10, 2026 (9 days left)', renews: '0 of 2 Renewals used' },
          ].map((loan, l) => `
            <g transform="translate(0, ${l * 140})">
              <rect width="780" height="125" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
              <!-- Cover Placeholder [X] -->
              <g transform="translate(18, 16)">
                <rect width="65" height="92" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" rx="4" />
                <line x1="0" y1="0" x2="65" y2="92" stroke="#777777" stroke-width="1" />
                <line x1="0" y1="92" x2="65" y2="0" stroke="#777777" stroke-width="1" />
                <text x="24" y="50" font-size="9" font-weight="bold">[X]</text>
              </g>

              <g transform="translate(95, 20)">
                <text x="0" y="16" font-size="13" font-weight="bold">${loan.title}</text>
                <text x="0" y="34" font-size="9.5" font-family="monospace">Barcode Copy ID: ${loan.barcode}</text>
                
                <rect x="0" y="44" width="180" height="20" rx="4" fill="#EEEEEE" />
                <text x="10" y="58" font-size="9" font-weight="bold">Due: ${loan.due}</text>

                <text x="0" y="80" font-size="8.5" fill="#666666">${loan.renews}</text>
              </g>

              <!-- Return / Renew Buttons -->
              <g transform="translate(560, 42)">
                <rect width="100" height="36" rx="6" fill="#000000" />
                <text x="18" y="22" font-size="9.5" font-weight="bold" fill="#FFFFFF">Return Book</text>

                <rect x="110" y="0" width="90" height="36" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
                <text x="16" y="22" font-size="9.5" font-weight="bold">Renew (+14d)</text>
              </g>
            </g>
          `).join('')}
        </g>
      </g>
    </g>

    <!-- 5. ACTIVE HOLDS & POD BOOKINGS -->
    <g transform="translate(0, 760)">
      <rect width="860" height="525" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">5. HOLDS &amp; STUDY POD BOOKINGS</text>

      <g transform="translate(40, 34)">
        <!-- Hold Queue Card -->
        <text x="0" y="16" font-size="12" font-weight="bold">ACTIVE RESERVATION QUEUES</text>
        <g transform="translate(0, 26)">
          <rect width="780" height="110" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
          <g transform="translate(18, 16)">
            <rect width="50" height="75" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
            <text x="18" y="42" font-size="9" font-weight="bold">[X]</text>
          </g>
          <g transform="translate(80, 24)">
            <text x="0" y="16" font-size="13" font-weight="bold">The Midnight Library — Matt Haig</text>
            <rect x="0" y="28" width="160" height="22" rx="4" fill="#000000" />
            <text x="12" y="43" font-size="9" font-weight="bold" fill="#FFFFFF">Queue Position: #1 (READY!)</text>
            <text x="0" y="68" font-size="9" fill="#555555">Held at Circulation Desk Shelf #3 until Nov 3, 2026 (48-hour hold window).</text>
          </g>
          <g transform="translate(640, 36)">
            <rect width="115" height="34" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
            <text x="16" y="21" font-size="9" font-weight="bold">Cancel Hold</text>
          </g>
        </g>

        <!-- Seat Booking Card -->
        <g transform="translate(0, 165)">
          <text x="0" y="16" font-size="12" font-weight="bold">STUDY SEAT &amp; POD RESERVATION</text>
          <g transform="translate(0, 26)">
            <rect width="780" height="100" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
            <g transform="translate(20, 20)">
              <text x="0" y="16" font-size="13" font-weight="bold">Pod #03 — Quiet Study Sanctuary (Window Garden)</text>
              <text x="0" y="34" font-size="9.5" fill="#555555">Scheduled Block: Today, Nov 1 · 14:00 – 17:00 (3-Hour Focus Block)</text>
              <rect x="0" y="44" width="130" height="18" rx="4" fill="#EEEEEE" />
              <text x="10" y="57" font-size="8.5" font-weight="bold">Check-in at desk sensor</text>
            </g>
            <g transform="translate(640, 32)">
              <rect width="115" height="34" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
              <text x="18" y="21" font-size="9" font-weight="bold">Cancel Pod</text>
            </g>
          </g>
        </g>

        <!-- Saved Wishlist Strip -->
        <g transform="translate(0, 320)">
          <text x="0" y="16" font-size="12" font-weight="bold">SAVED WISHLIST VOLUMES (4)</text>
          <g transform="translate(0, 26)">
            ${[0, 1, 2, 3].map(w => `
              <g transform="translate(${w * 198}, 0)">
                <rect width="186" height="85" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
                <g transform="translate(10, 10)">
                  <rect width="45" height="65" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
                  <text x="15" y="36" font-size="8" font-weight="bold">[X]</text>
                </g>
                <g transform="translate(65, 14)">
                  <rect width="105" height="8" rx="2" fill="#222222" />
                  <rect width="75" height="6" rx="2" fill="#666666" y="14" />
                  <rect width="105" height="22" rx="4" fill="#000000" y="32" />
                  <text x="24" y="46" font-size="8" font-weight="bold" fill="#FFFFFF">Borrow</text>
                </g>
              </g>
            `).join('')}
          </g>
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 9: LIBRARIAN CIRCULATION & BARCODE DESK (/librarian)
// --------------------------------------------------------------------------------
const LIBRARIAN_CONTENT = `
    <!-- 2. DESK OPERATION TAB BAR -->
    <g transform="translate(0, 90)">
      <rect width="860" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="180" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. STAFF DESK TABS</text>

      <g transform="translate(40, 32)">
        ${['Issue / Checkout (Active)', 'Returns & Check-in', 'Hold Queue Shelving', 'Inventory & Barcodes', 'Announcements'].map((tab, t) => `
          <g transform="translate(${t * 155}, 0)">
            <rect width="145" height="36" rx="6" fill="${t === 0 ? '#000000' : '#FFFFFF'}" stroke="#000000" stroke-width="1.5" />
            <text x="12" y="22" font-size="9" font-weight="bold" fill="${t === 0 ? '#FFFFFF' : '#000000'}">${tab}</text>
          </g>
        `).join('')}
      </g>
    </g>

    <!-- 3. BARCODE SCANNER STATION & READER VERIFICATION -->
    <g transform="translate(0, 180)">
      <rect width="860" height="470" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. RAPID CHECKOUT DESK</text>

      <g transform="translate(40, 34)">
        <!-- Left: Barcode Scanner Input (380px) -->
        <g transform="translate(0, 0)">
          <rect width="375" height="410" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.5" />
          <text x="20" y="26" font-size="12" font-weight="bold">SCANNER STATION: BOOK CODE</text>
          <text x="20" y="42" font-size="9" fill="#555555">Laser scan or type physical specimen copy barcode</text>

          <g transform="translate(20, 56)">
            <rect width="250" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <text x="14" y="24" font-size="11" font-family="monospace">LIBRA-8472-C1</text>

            <rect x="260" y="0" width="75" height="38" rx="6" fill="#000000" />
            <text x="282" y="24" font-size="10.5" font-weight="bold" fill="#FFFFFF">Scan</text>
          </g>

          <!-- Camera Scanner Viewfinder [X] -->
          <g transform="translate(20, 110)">
            <rect width="335" height="180" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <line x1="0" y1="0" x2="335" y2="180" stroke="#777777" stroke-width="1.2" />
            <line x1="0" y1="180" x2="335" y2="0" stroke="#777777" stroke-width="1.2" />
            <rect x="110" y="75" width="115" height="26" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" rx="4" />
            <text x="120" y="92" font-size="9.5" font-weight="bold">CAMERA VIEWER [X]</text>
            <line x1="30" y1="90" x2="305" y2="90" stroke="#000000" stroke-width="2" stroke-dasharray="4,2" />
          </g>

          <!-- Book Scanned Preview Pill -->
          <g transform="translate(20, 305)">
            <rect width="335" height="85" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="14" y="20" font-size="10" font-weight="bold">SCANNED: The Midnight Library (Copy #1)</text>
            <text x="14" y="38" font-size="9" fill="#555555">Dewey Call: 823.92 HAI · Shelf Stack: Level 2, F-07</text>
            <rect x="14" y="48" width="80" height="18" rx="4" fill="#000000" />
            <text x="24" y="61" font-size="8" font-weight="bold" fill="#FFFFFF">Verified Valid</text>
          </g>
        </g>

        <!-- Right: Student Verification & Issue Card (385px) -->
        <g transform="translate(395, 0)">
          <rect width="385" height="410" rx="8" fill="#F8F8F8" stroke="#000000" stroke-width="1.5" />
          <text x="20" y="26" font-size="12" font-weight="bold">BORROWER IDENTIFICATION</text>
          <text x="20" y="42" font-size="9" fill="#555555">Swipe student RFID card or enter student email</text>

          <g transform="translate(20, 56)">
            <rect width="250" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <text x="14" y="24" font-size="11" font-family="monospace">STU-2026-8841</text>

            <rect x="260" y="0" width="85" height="38" rx="6" fill="#000000" />
            <text x="282" y="24" font-size="10.5" font-weight="bold" fill="#FFFFFF">Verify</text>
          </g>

          <!-- Verified Member Box -->
          <g transform="translate(20, 110)">
            <rect width="345" height="170" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="16" y="24" font-size="13" font-weight="bold">Rudra Patel (Student Member)</text>
            <text x="16" y="42" font-size="9" fill="#555555">Email: rudra.student@smartlib.edu · Dept: CS</text>
            
            <g transform="translate(16, 55)">
              <rect width="140" height="20" rx="4" fill="#EEEEEE" />
              <text x="10" y="14" font-size="8.5" font-weight="bold">Active Loans: 2 of 10</text>
              <rect x="150" y="0" width="140" height="20" rx="4" fill="#EEEEEE" />
              <text x="160" y="14" font-size="8.5" font-weight="bold">Fines Due: $0.00 (Clear)</text>
            </g>

            <!-- Loan Period Dropdown -->
            <g transform="translate(16, 90)">
              <text x="0" y="12" font-size="8.5" font-weight="bold">LOAN DURATION</text>
              <rect x="0" y="18" width="310" height="32" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
              <text x="12" y="38" font-size="10" font-weight="bold">14 Days Standard (Due: Nov 15, 2026) v</text>
            </g>
          </g>

          <!-- Complete Checkout Action -->
          <g transform="translate(20, 305)">
            <rect width="345" height="85" rx="6" fill="#000000" />
            <text x="75" y="40" font-size="13" font-weight="bold" fill="#FFFFFF">Complete Checkout &amp; Print Slip</text>
            <text x="95" y="60" font-size="8.5" fill="#CCCCCC">Generates paper slip + SMS notice</text>
          </g>
        </g>
      </g>
    </g>

    <!-- 4. TODAY'S CIRCULATION DESK ACTIVITY LEDGER -->
    <g transform="translate(0, 650)">
      <rect width="860" height="635" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. DAILY CIRCULATION LEDGER</text>

      <g transform="translate(40, 34)">
        <text x="0" y="16" font-size="13" font-weight="bold">DESK TRANSACTIONS AUDIT STREAM (TODAY: NOV 1, 2026)</text>

        <!-- Ledger Table -->
        <g transform="translate(0, 28)">
          <rect width="780" height="30" fill="#EEEEEE" stroke="#000000" stroke-width="1.2" />
          <text x="14" y="19" font-size="9" font-weight="bold">TIME</text>
          <text x="100" y="19" font-size="9" font-weight="bold">TRANSACTION</text>
          <text x="240" y="19" font-size="9" font-weight="bold">COPY CODE</text>
          <text x="400" y="19" font-size="9" font-weight="bold">BOOK TITLE</text>
          <text x="610" y="19" font-size="9" font-weight="bold">BORROWER</text>
          <text x="710" y="19" font-size="9" font-weight="bold">STATUS</text>

          ${[
            { time: '14:22', tx: 'ISSUE (14d)', code: 'LIBRA-8472-C1', title: 'The Midnight Library', who: 'STU-8841', stat: 'Success' },
            { time: '13:58', tx: 'RETURN (Desk)', code: 'LIBRA-4912-C3', title: 'Designing Data-Intensive Apps', who: 'STU-1092', stat: 'Restocked' },
            { time: '13:45', tx: 'RENEW (+14d)', code: 'LIBRA-2041-C2', title: 'Structure & Interpretation...', who: 'STU-8841', stat: 'Renewed' },
            { time: '13:12', tx: 'HOLD QUEUE', code: 'LIBRA-7719-C1', title: 'Klara and the Sun', who: 'STU-4412', stat: 'Rank #1' },
            { time: '12:30', tx: 'ISSUE (14d)', code: 'LIBRA-6014-C2', title: 'The Overstory', who: 'STU-9921', stat: 'Success' },
            { time: '11:40', tx: 'RETURN (Box)', code: 'LIBRA-3301-C1', title: 'Clean Code', who: 'STU-5510', stat: 'Restocked' },
            { time: '10:15', tx: 'ISSUE (14d)', code: 'LIBRA-1102-C1', title: 'Thinking in Systems', who: 'STU-3321', stat: 'Success' },
          ].map((row, r) => `
            <g transform="translate(0, ${30 + r * 44})">
              <rect width="780" height="44" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="1" />
              <text x="14" y="27" font-size="9" font-family="monospace">${row.time}</text>
              <rect x="95" y="12" width="105" height="20" rx="4" fill="#EEEEEE" />
              <text x="105" y="26" font-size="8" font-weight="bold">${row.tx}</text>
              <text x="240" y="27" font-size="9" font-family="monospace">${row.code}</text>
              <text x="400" y="27" font-size="9">${row.title}</text>
              <text x="610" y="27" font-size="9" font-family="monospace">${row.who}</text>
              <rect x="705" y="12" width="60" height="20" rx="4" fill="#000000" />
              <text x="715" y="26" font-size="8" font-weight="bold" fill="#FFFFFF">${row.stat}</text>
            </g>
          `).join('')}
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 10: ADMINISTRATOR CENTRAL CONTROL CONSOLE (/admin)
// --------------------------------------------------------------------------------
const ADMIN_CONTENT = `
    <!-- 2. ADMIN OPERATION TABS & SYSTEM VITALS -->
    <g transform="translate(0, 90)">
      <rect width="860" height="175" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="180" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. ADMIN CONSOLE TABS</text>

      <g transform="translate(40, 28)">
        <!-- Tabs -->
        <g transform="translate(0, 0)">
          ${['System Overview (Active)', 'User & Roles Control', 'Book Catalog Management', 'Security Audit Logs', 'Configuration'].map((tab, t) => `
            <g transform="translate(${t * 155}, 0)">
              <rect width="145" height="34" rx="6" fill="${t === 0 ? '#000000' : '#FFFFFF'}" stroke="#000000" stroke-width="1.5" />
              <text x="12" y="21" font-size="8.5" font-weight="bold" fill="${t === 0 ? '#FFFFFF' : '#000000'}">${tab}</text>
            </g>
          `).join('')}
        </g>

        <!-- 4 Vital Health Metrics Cards -->
        <g transform="translate(0, 48)">
          ${[
            { title: 'Total Registered Users', val: '1,248 Readers', sub: '920 Students · 8 Staff · 2 Admins' },
            { title: 'Catalog Collection', val: '14,820 Volumes', sub: '48 Unique Masterwork Titles' },
            { title: 'Active Sanctuary Sessions', val: '38 Concurrency', sub: 'Peak Load 24% Normal' },
            { title: 'Security & Integrity', val: '100% Operational', sub: 'SQLite WAL mode secure' },
          ].map((metric, m) => `
            <g transform="translate(${m * 198}, 0)">
              <rect width="186" height="85" rx="6" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
              <text x="12" y="20" font-size="8.5" fill="#666666">${metric.title.toUpperCase()}</text>
              <text x="12" y="44" font-size="14" font-weight="bold">${metric.val}</text>
              <text x="12" y="66" font-size="8" fill="#555555">${metric.sub}</text>
            </g>
          `).join('')}
        </g>
      </g>
    </g>

    <!-- 3. USER ROLE MANAGEMENT TABLE -->
    <g transform="translate(0, 265)">
      <rect width="860" height="475" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. USER ROLE ELEVATION</text>

      <g transform="translate(40, 34)">
        <text x="0" y="16" font-size="13" font-weight="bold">USER ACCOUNTS &amp; ROLE PRIVILEGES CONTROL</text>
        
        <!-- Search User Box -->
        <g transform="translate(480, 0)">
          <rect width="300" height="30" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="14" y="19" font-size="9" fill="#666666">Search accounts by name or email...</text>
        </g>

        <!-- User Table -->
        <g transform="translate(0, 36)">
          <rect width="780" height="28" fill="#EEEEEE" stroke="#000000" stroke-width="1.2" />
          <text x="14" y="18" font-size="9" font-weight="bold">USER NAME</text>
          <text x="200" y="18" font-size="9" font-weight="bold">EMAIL ADDRESS</text>
          <text x="420" y="18" font-size="9" font-weight="bold">SYSTEM ROLE</text>
          <text x="560" y="18" font-size="9" font-weight="bold">STATUS</text>
          <text x="680" y="18" font-size="9" font-weight="bold">ACTIONS</text>

          ${[
            { name: 'Rudra Patel', email: 'rudra.student@smartlib.edu', role: 'Student v', stat: 'Active', act: 'Elevate' },
            { name: 'Sarah Jenkins', email: 's.jenkins@smartlib.edu', role: 'Librarian v', stat: 'Active', act: 'Modify' },
            { name: 'Admin Root', email: 'admin@smartlib.edu', role: 'Admin v', stat: 'SuperUser', act: 'Locked' },
            { name: 'David Miller', email: 'david.m@smartlib.edu', role: 'Student v', stat: 'Active', act: 'Elevate' },
            { name: 'Emma Watson', email: 'emma.w@smartlib.edu', role: 'Student v', stat: 'Suspended', act: 'Reactivate' },
          ].map((user, u) => `
            <g transform="translate(0, ${28 + u * 48})">
              <rect width="780" height="48" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="1" />
              <text x="14" y="28" font-size="10" font-weight="bold">${user.name}</text>
              <text x="200" y="28" font-size="9.5">${user.email}</text>
              <rect x="415" y="12" width="115" height="24" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
              <text x="425" y="28" font-size="9" font-weight="bold">${user.role}</text>
              <rect x="555" y="12" width="80" height="24" rx="4" fill="#EEEEEE" />
              <text x="568" y="28" font-size="8.5" font-weight="bold">${user.stat}</text>
              <rect x="675" y="12" width="90" height="24" rx="4" fill="#000000" />
              <text x="698" y="28" font-size="8.5" font-weight="bold" fill="#FFFFFF">${user.act}</text>
            </g>
          `).join('')}
        </g>
      </g>
    </g>

    <!-- 4. CATALOG INVENTORY DISPATCH & AUDIT TRAIL -->
    <g transform="translate(0, 740)">
      <rect width="860" height="545" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. INVENTORY &amp; AUDIT TRAIL</text>

      <g transform="translate(40, 34)">
        <!-- Rapid Cataloging Actions -->
        <g transform="translate(0, 0)">
          <text x="0" y="16" font-size="12" font-weight="bold">CATALOG MANAGEMENT ACTIONS</text>
          <g transform="translate(0, 26)">
            <rect width="240" height="38" rx="6" fill="#000000" />
            <text x="40" y="24" font-size="10.5" font-weight="bold" fill="#FFFFFF">+ Add New Book Specimen</text>

            <rect x="260" y="0" width="200" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <text x="300" y="24" font-size="10.5" font-weight="bold">Bulk CSV Import</text>

            <rect x="480" y="0" width="180" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <text x="505" y="24" font-size="10.5" font-weight="bold">Shelf Re-indexing</text>
          </g>
        </g>

        <!-- Audit Trail Stream -->
        <g transform="translate(0, 95)">
          <text x="0" y="16" font-size="12" font-weight="bold">SYSTEM SECURITY &amp; ELEVATION AUDIT LOGS</text>
          <g transform="translate(0, 26)">
            ${[
              { ts: '2026-11-01 14:15:22', user: 'admin@smartlib.edu', action: 'ROLE_ELEVATED: User rudra.student@smartlib.edu was granted Librarian Assistant role.' },
              { ts: '2026-11-01 12:40:01', user: 's.jenkins@smartlib.edu', action: 'BOOK_CREATED: New volume "Designing Data-Intensive Applications" added with 3 copies.' },
              { ts: '2026-11-01 09:00:15', user: 'SYSTEM', action: 'DATABASE_BACKUP: Automatic nightly WAL checkpoint executed cleanly. Integrity OK.' },
              { ts: '2026-10-31 18:22:40', user: 'admin@smartlib.edu', action: 'SYSTEM_SETTINGS: Maximum concurrent student loans updated from 5 to 10.' },
            ].map((log, l) => `
              <g transform="translate(0, ${l * 65})">
                <rect width="780" height="55" rx="6" fill="#F8F8F8" stroke="#000000" stroke-width="1.2" />
                <text x="14" y="20" font-size="9" font-family="monospace" fill="#555555">${log.ts} · Actor: ${log.user}</text>
                <text x="14" y="38" font-size="9.5" font-weight="bold">${log.action}</text>
              </g>
            `).join('')}
          </g>
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 11: CIRCULATION ANALYTICS & FORECASTING (/analytics)
// --------------------------------------------------------------------------------
const ANALYTICS_CONTENT = `
    <!-- 2. ANALYTICS HEADER & CONTROLS -->
    <g transform="translate(0, 90)">
      <rect width="860" height="110" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="180" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. ANALYTICS CONTROLS</text>

      <g transform="translate(40, 32)">
        <text x="0" y="20" font-size="18" font-weight="bold">Circulation Velocity &amp; Demand Forecasting</text>
        <text x="0" y="38" font-size="9.5" fill="#666666">Operational analytics on monthly volume checkout rates, seat occupancy heatmaps, and turnaround velocity.</text>

        <g transform="translate(600, 8)">
          <rect width="110" height="32" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <text x="14" y="20" font-size="9.5" font-weight="bold">Last 30 Days v</text>

          <rect x="120" y="0" width="60" height="32" rx="6" fill="#000000" />
          <text x="132" y="20" font-size="9.5" font-weight="bold" fill="#FFFFFF">Export</text>
        </g>
      </g>
    </g>

    <!-- 3. KPI CARDS STRIP -->
    <g transform="translate(0, 200)">
      <rect width="860" height="125" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="160" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">3. KEY KPI METRICS</text>

      <g transform="translate(40, 30)">
        ${[
          { title: 'Monthly Checkouts', val: '842 Volumes', change: '+14% vs last month' },
          { title: 'Peak Seat Occupancy', val: '78% Peak', change: 'Between 14:00 - 18:00' },
          { title: 'Average Loan Duration', val: '9.4 Days', change: 'Under 14-day limit' },
          { title: 'Active Readers', val: '624 Students', change: '89% repeat borrowers' },
        ].map((kpi, k) => `
          <g transform="translate(${k * 198}, 0)">
            <rect width="186" height="75" rx="6" fill="#F8F8F8" stroke="#000000" stroke-width="1.4" />
            <text x="14" y="20" font-size="8.5" fill="#666666">${kpi.title.toUpperCase()}</text>
            <text x="14" y="44" font-size="15" font-weight="bold">${kpi.val}</text>
            <text x="14" y="62" font-size="8" font-weight="bold">${kpi.change}</text>
          </g>
        `).join('')}
      </g>
    </g>

    <!-- 4. CIRCULATION TREND LINE GRAPH [X] -->
    <g transform="translate(0, 325)">
      <rect width="860" height="410" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">4. LOAN VELOCITY TREND CHART</text>

      <g transform="translate(40, 34)">
        <text x="0" y="16" font-size="12" font-weight="bold">MONTHLY CIRCULATION VELOCITY &amp; RETURNS (HISTORICAL 12 MONTHS)</text>

        <!-- Chart Canvas Box [X] -->
        <g transform="translate(0, 28)">
          <rect width="780" height="320" rx="8" fill="#FAFAFA" stroke="#000000" stroke-width="1.6" />
          
          <!-- Axes -->
          <line x1="50" y1="30" x2="50" y2="270" stroke="#000000" stroke-width="1.8" />
          <line x1="50" y1="270" x2="750" y2="270" stroke="#000000" stroke-width="1.8" />

          <!-- Y Axis Marks -->
          <text x="16" y="35" font-size="8.5" font-family="monospace">1000</text>
          <line x1="45" y1="30" x2="750" y2="30" stroke="#E0E0E0" stroke-width="1" />
          <text x="22" y="95" font-size="8.5" font-family="monospace">750</text>
          <line x1="45" y1="90" x2="750" y2="90" stroke="#E0E0E0" stroke-width="1" />
          <text x="22" y="155" font-size="8.5" font-family="monospace">500</text>
          <line x1="45" y1="150" x2="750" y2="150" stroke="#E0E0E0" stroke-width="1" />
          <text x="22" y="215" font-size="8.5" font-family="monospace">250</text>
          <line x1="45" y1="210" x2="750" y2="210" stroke="#E0E0E0" stroke-width="1" />
          <text x="32" y="275" font-size="8.5" font-family="monospace">0</text>

          <!-- Trend Lines (Simulated Wireframe Lines) -->
          <polyline points="50,220 110,200 170,180 230,160 290,190 350,140 410,120 470,110 530,90 590,70 650,60 710,45" fill="none" stroke="#000000" stroke-width="2.5" />
          <polyline points="50,240 110,225 170,210 230,195 290,210 350,170 410,150 470,145 530,120 590,105 650,90 710,75" fill="none" stroke="#666666" stroke-width="1.8" stroke-dasharray="4,3" />

          <!-- Data Points -->
          ${[
            [110, 200], [170, 180], [230, 160], [290, 190], [350, 140],
            [410, 120], [470, 110], [530, 90], [590, 70], [650, 60], [710, 45]
          ].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="4" fill="#000000" />`).join('')}

          <!-- X Axis Labels -->
          ${['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((mo, m) => `
            <text x="${50 + m * 58}" y="290" font-size="8.5">${mo}</text>
          `).join('')}

          <!-- Legend -->
          <g transform="translate(520, 15)">
            <line x1="0" y1="0" x2="30" y2="0" stroke="#000000" stroke-width="2.5" />
            <text x="36" y="4" font-size="8.5" font-weight="bold">Books Borrowed</text>

            <line x1="140" y1="0" x2="170" y2="0" stroke="#666666" stroke-width="1.8" stroke-dasharray="4,3" />
            <text x="176" y="4" font-size="8.5">Books Returned</text>
          </g>
        </g>
      </g>
    </g>

    <!-- 5. CATEGORY DISTRIBUTION & HOURLY OCCUPANCY -->
    <g transform="translate(0, 735)">
      <rect width="860" height="550" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">5. CATEGORY &amp; HOURLY HEATMAP</text>

      <g transform="translate(40, 34)">
        <!-- Left: Category Bars (380px) -->
        <g transform="translate(0, 0)">
          <rect width="375" height="490" rx="8" fill="#FAFAFA" stroke="#000000" stroke-width="1.5" />
          <text x="20" y="26" font-size="11.5" font-weight="bold">MOST BORROWED CATEGORIES</text>

          ${[
            { name: 'Computer Science & AI', pct: 88, count: '320 loans' },
            { name: 'Novels & Fiction', pct: 74, count: '264 loans' },
            { name: 'Philosophy & Mind', pct: 62, count: '210 loans' },
            { name: 'Biophilic Design & Nature', pct: 54, count: '180 loans' },
            { name: 'Architecture & Stacks', pct: 40, count: '135 loans' },
          ].map((bar, b) => `
            <g transform="translate(20, ${48 + b * 75})">
              <text x="0" y="14" font-size="9.5" font-weight="bold">${bar.name}</text>
              <text x="335" y="14" font-size="8.5" text-anchor="end">${bar.count}</text>
              <!-- Bar -->
              <rect x="0" y="22" width="335" height="18" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
              <rect x="0" y="22" width="${(bar.pct / 100) * 335}" height="18" rx="4" fill="#000000" />
            </g>
          `).join('')}
        </g>

        <!-- Right: Hourly Heatmap (385px) -->
        <g transform="translate(395, 0)">
          <rect width="385" height="490" rx="8" fill="#FAFAFA" stroke="#000000" stroke-width="1.5" />
          <text x="20" y="26" font-size="11.5" font-weight="bold">HOURLY SEAT DEMAND &amp; OCCUPANCY</text>

          <g transform="translate(20, 50)">
            ${[
              { hour: '08:00 - 10:00', occ: 30, stat: 'Quiet (30%)' },
              { hour: '10:00 - 12:00', occ: 55, stat: 'Moderate (55%)' },
              { hour: '12:00 - 14:00', occ: 70, stat: 'Busy (70%)' },
              { hour: '14:00 - 16:00', occ: 92, stat: 'Peak Demand (92%)' },
              { hour: '16:00 - 18:00', occ: 85, stat: 'High Occupancy (85%)' },
              { hour: '18:00 - 20:00', occ: 60, stat: 'Evening Study (60%)' },
            ].map((slot, s) => `
              <g transform="translate(0, ${s * 65})">
                <text x="0" y="14" font-size="9.5" font-weight="bold">${slot.hour}</text>
                <text x="345" y="14" font-size="8.5" text-anchor="end">${slot.stat}</text>
                <rect x="0" y="22" width="345" height="18" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
                <rect x="0" y="22" width="${(slot.occ / 100) * 345}" height="18" rx="4" fill="${slot.occ > 80 ? '#000000' : '#666666'}" />
              </g>
            `).join('')}
          </g>
        </g>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 12: AUTHENTICATION & ONBOARDING PORTAL (/login)
// --------------------------------------------------------------------------------
const LOGIN_CONTENT = `
    <!-- 2. AUTHENTICATION SANCTUARY CONTAINER -->
    <g transform="translate(0, 90)">
      <rect width="860" height="1195" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="8" width="220" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="34" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. AUTHENTICATION SANCTUARY</text>

      <g transform="translate(40, 42)">
        <!-- Left Side: Brand Narrative & Visual Illustration Box (360px) -->
        <g transform="translate(0, 40)">
          <text x="0" y="26" font-size="22" font-weight="bold">Welcome to LibraMind</text>
          <text x="0" y="48" font-size="12" fill="#555555">Your biophilic reading sanctuary &amp; smart library</text>

          <!-- Large [X] Illustration Box -->
          <g transform="translate(0, 70)">
            <rect width="340" height="230" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <line x1="0" y1="0" x2="340" y2="230" stroke="#777777" stroke-width="1.4" />
            <line x1="0" y1="230" x2="340" y2="0" stroke="#777777" stroke-width="1.4" />
            <rect x="115" y="100" width="110" height="30" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" rx="4" />
            <text x="128" y="120" font-size="11" font-weight="bold">SANCTUARY [X]</text>
          </g>

          <!-- 4 Features Checklist -->
          <g transform="translate(0, 330)">
            ${[
              'AI Semantic Search & Mood Recommendations',
              'Real-Time Interactive Study Seat Reservation',
              '4-Tier Physical Shelf Waypoint Navigation',
              'Self-Service Loans, Returns & Renewals'
            ].map((feat, f) => `
              <g transform="translate(0, ${f * 36})">
                <circle cx="10" cy="10" r="10" fill="#000000" />
                <text x="6" y="14" font-size="10" font-weight="bold" fill="#FFFFFF">✓</text>
                <text x="30" y="14" font-size="10" font-weight="bold">${feat}</text>
              </g>
            `).join('')}
          </g>
        </g>

        <!-- Right Side: Authentication Form Card (390px) -->
        <g transform="translate(390, 40)">
          <rect width="390" height="800" rx="12" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
          
          <g transform="translate(28, 28)">
            <!-- Sign In / Register Tabs -->
            <g transform="translate(0, 0)">
              <rect width="334" height="42" rx="6" fill="#F0F0F0" />
              <rect width="165" height="38" rx="5" fill="#000000" y="2" x="2" />
              <text x="56" y="25" font-size="11" font-weight="bold" fill="#FFFFFF">Sign In</text>
              <text x="210" y="25" font-size="11" font-weight="bold" fill="#000000">Register</text>
            </g>

            <text x="0" y="75" font-size="18" font-weight="bold">Sign In to Your Account</text>
            <text x="0" y="94" font-size="9.5" fill="#666666">Access loans, reservations, and personal study pods.</text>

            <!-- Email Field -->
            <g transform="translate(0, 115)">
              <text x="0" y="12" font-size="9.5" font-weight="bold">EMAIL ADDRESS</text>
              <rect x="0" y="20" width="334" height="42" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
              <text x="14" y="46" font-size="11" fill="#444444">rudra.student@smartlib.edu</text>
            </g>

            <!-- Password Field -->
            <g transform="translate(0, 195)">
              <text x="0" y="12" font-size="9.5" font-weight="bold">PASSWORD</text>
              <rect x="0" y="20" width="334" height="42" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
              <text x="14" y="46" font-size="14" font-family="monospace">••••••••••••</text>
            </g>

            <!-- Remember me & Forgot -->
            <g transform="translate(0, 275)">
              <rect width="14" height="14" rx="3" fill="#000000" />
              <text x="3" y="11" font-size="9" fill="#FFFFFF">✓</text>
              <text x="22" y="11" font-size="9">Remember me</text>
              <text x="240" y="11" font-size="9" font-weight="bold">Forgot password?</text>
            </g>

            <!-- Primary Sign In Button -->
            <g transform="translate(0, 310)">
              <rect width="334" height="46" rx="6" fill="#000000" />
              <text x="96" y="28" font-size="12" font-weight="bold" fill="#FFFFFF">Sign In to LibraMind</text>
            </g>

            <!-- Demo Quick Login Switcher -->
            <g transform="translate(0, 385)">
              <line x1="0" y1="0" x2="334" y2="0" stroke="#CCCCCC" stroke-width="1" />
              <text x="80" y="22" font-size="9" font-weight="bold" fill="#666666">OR TEST WITH 1-CLICK DEMO ROLES:</text>

              <g transform="translate(0, 36)">
                <!-- Student Demo -->
                <rect width="334" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
                <text x="14" y="23" font-size="10" font-weight="bold">Student Demo (Rudra Patel)</text>
                <text x="270" y="23" font-size="9" font-weight="bold">Sign In →</text>
              </g>

              <g transform="translate(0, 84)">
                <!-- Librarian Demo -->
                <rect width="334" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
                <text x="14" y="23" font-size="10" font-weight="bold">Librarian Staff (Sarah Jenkins)</text>
                <text x="270" y="23" font-size="9" font-weight="bold">Sign In →</text>
              </g>

              <g transform="translate(0, 132)">
                <!-- Admin Demo -->
                <rect width="334" height="38" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
                <text x="14" y="23" font-size="10" font-weight="bold">Administrator Portal (Security Root)</text>
                <text x="270" y="23" font-size="9" font-weight="bold">Sign In →</text>
              </g>
            </g>

            <!-- Security Badge -->
            <g transform="translate(0, 595)">
              <rect width="334" height="40" rx="6" fill="#F8F8F8" stroke="#000000" stroke-width="1" />
              <text x="32" y="24" font-size="8.5" fill="#555555">🔒 256-Bit SSL Encryption · Session Resilience Active</text>
            </g>
          </g>
        </g>
      </g>
    </g>
`;

// PAGE 13: FORGOT / RESET PASSWORD SPECIFICATION
const FORGOT_PASSWORD_CONTENT = `
    <!-- 2. RECOVERY HERO HEADER -->
    <g transform="translate(0, 95)">
      <rect x="670" y="8" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="680" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. RECOVERY HEADER</text>

      <g transform="translate(48, 16)">
        <rect width="60" height="24" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="12" y="16" font-size="9" font-weight="bold">← Back</text>

        <g transform="translate(0, 36)">
          <text x="0" y="28" font-size="24" font-weight="bold" letter-spacing="-0.5">FORGOT YOUR PASSWORD?</text>
          <!-- Placeholder Lines for Subtitle -->
          <rect x="0" y="44" width="480" height="8" rx="3" fill="#000000" />
          <rect x="0" y="58" width="360" height="8" rx="3" fill="#888888" />
        </g>
      </g>
    </g>

    <!-- 3. MAIN RECOVERY FORM CARD & SECURITY VERIFICATION -->
    <g transform="translate(48, 220)">
      <rect x="622" y="-12" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. RECOVERY FORM CARD</text>

      <!-- Center Box / Card Container -->
      <rect width="764" height="420" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

      <!-- Left Sub-Panel: Security Lock Placeholder & Guidelines -->
      <g transform="translate(32, 32)">
        <rect width="280" height="180" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
        <line x1="0" y1="0" x2="280" y2="180" stroke="#000000" stroke-width="1.5" />
        <line x1="280" y1="0" x2="0" y2="180" stroke="#000000" stroke-width="1.5" />
        <rect x="100" y="70" width="80" height="40" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <text x="110" y="94" font-size="10.5" font-weight="bold">[ SECURITY ]</text>

        <!-- Placeholder Guidelines -->
        <g transform="translate(0, 205)">
          <text x="0" y="16" font-size="11" font-weight="bold">ACCOUNT RECOVERY POLICIES</text>
          <rect x="0" y="28" width="280" height="7" rx="2" fill="#000000" />
          <rect x="0" y="42" width="260" height="7" rx="2" fill="#666666" />
          <rect x="0" y="56" width="270" height="7" rx="2" fill="#666666" />
          <rect x="0" y="70" width="220" height="7" rx="2" fill="#999999" />
          <rect x="0" y="90" width="280" height="50" rx="4" fill="#F8F8F8" stroke="#000000" stroke-width="1" />
          <text x="12" y="112" font-size="9" font-weight="bold">RATE LIMIT DEFENSE ACTIVE</text>
          <text x="12" y="128" font-size="8.5" fill="#444444">Max 4 attempts / 15 min per address</text>
        </g>
      </g>

      <!-- Right Sub-Panel: Email Input, Submit Button, Enumeration-Resistant Feedback -->
      <g transform="translate(352, 32)">
        <text x="0" y="18" font-size="14" font-weight="bold">RESET LINK DISPATCH</text>
        <rect x="0" y="28" width="380" height="7" rx="2" fill="#888888" />

        <!-- Email Field -->
        <g transform="translate(0, 52)">
          <text x="0" y="12" font-size="9.5" font-weight="bold">REGISTERED EMAIL ADDRESS</text>
          <rect x="0" y="20" width="380" height="42" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="14" y="46" font-size="11" fill="#444444">member@libramind.edu</text>
        </g>

        <!-- Submit Button -->
        <g transform="translate(0, 134)">
          <rect width="380" height="44" rx="6" fill="#000000" />
          <text x="124" y="27" font-size="12" font-weight="bold" fill="#FFFFFF">Send Reset Link →</text>
        </g>

        <!-- Generic Feedback Notification (Account Enumeration Defense) -->
        <g transform="translate(0, 200)">
          <rect width="380" height="72" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" stroke-dasharray="4,3" />
          <circle cx="24" cy="24" r="10" fill="#000000" />
          <text x="20" y="28" font-size="11" fill="#FFFFFF" font-weight="bold">✓</text>
          <text x="44" y="24" font-size="10" font-weight="bold">GENERIC ENUMERATION-PROOF RESPONSE</text>
          <rect x="44" y="34" width="316" height="6" rx="2" fill="#000000" />
          <rect x="44" y="46" width="290" height="6" rx="2" fill="#666666" />
          <rect x="44" y="58" width="240" height="6" rx="2" fill="#999999" />
        </g>

        <!-- Back to Login Link -->
        <g transform="translate(0, 300)">
          <line x1="0" y1="0" x2="380" y2="0" stroke="#CCCCCC" stroke-width="1" />
          <text x="110" y="28" font-size="10" font-weight="bold">Remembered password? Back to Login</text>
        </g>
      </g>
    </g>

    <!-- 4. THREE-STEP CRYPTOGRAPHIC RESET LIFECYCLE -->
    <g transform="translate(48, 670)">
      <rect x="622" y="-12" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">4. RESET LIFECYCLE</text>

      <text x="0" y="14" font-size="12" font-weight="bold" letter-spacing="0.5">CRYPTOGRAPHIC RESET WORKFLOW &amp; TOKEN SECURITY</text>

      <g transform="translate(0, 26)">
        <!-- Step 1 Card -->
        <g transform="translate(0, 0)">
          <rect width="240" height="175" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <rect x="12" y="12" width="28" height="28" rx="4" fill="#000000" />
          <text x="21" y="31" font-size="13" font-weight="bold" fill="#FFFFFF">1</text>
          <text x="48" y="26" font-size="10.5" font-weight="bold">TOKEN GENERATION</text>
          <text x="48" y="38" font-size="8.5" fill="#666666">32-Byte Crypto Random</text>
          <rect x="12" y="54" width="216" height="70" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <line x1="12" y1="54" x2="228" y2="124" stroke="#000000" stroke-width="1" />
          <line x1="228" y1="54" x2="12" y2="124" stroke="#000000" stroke-width="1" />
          <rect x="12" y="136" width="216" height="6" rx="2" fill="#000000" />
          <rect x="12" y="148" width="160" height="6" rx="2" fill="#888888" />
        </g>

        <!-- Arrow 1 -> 2 -->
        <path d="M 246 88 L 256 88 M 252 82 L 258 88 L 252 94" stroke="#000000" stroke-width="1.8" fill="none" />

        <!-- Step 2 Card -->
        <g transform="translate(262, 0)">
          <rect width="240" height="175" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <rect x="12" y="12" width="28" height="28" rx="4" fill="#000000" />
          <text x="20" y="31" font-size="13" font-weight="bold" fill="#FFFFFF">2</text>
          <text x="48" y="26" font-size="10.5" font-weight="bold">SHA-256 DB STORAGE</text>
          <text x="48" y="38" font-size="8.5" fill="#666666">Hashed Only · 30m Expiry</text>
          <rect x="12" y="54" width="216" height="70" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <line x1="12" y1="54" x2="228" y2="124" stroke="#000000" stroke-width="1" />
          <line x1="228" y1="54" x2="12" y2="124" stroke="#000000" stroke-width="1" />
          <rect x="12" y="136" width="216" height="6" rx="2" fill="#000000" />
          <rect x="12" y="148" width="180" height="6" rx="2" fill="#888888" />
        </g>

        <!-- Arrow 2 -> 3 -->
        <path d="M 508 88 L 518 88 M 514 82 L 520 88 L 514 94" stroke="#000000" stroke-width="1.8" fill="none" />

        <!-- Step 3 Card -->
        <g transform="translate(524, 0)">
          <rect width="240" height="175" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <rect x="12" y="12" width="28" height="28" rx="4" fill="#000000" />
          <text x="20" y="31" font-size="13" font-weight="bold" fill="#FFFFFF">3</text>
          <text x="48" y="26" font-size="10.5" font-weight="bold">PASSWORD UPDATED</text>
          <text x="48" y="38" font-size="8.5" fill="#666666">Bcrypt Hash · Token Invalidate</text>
          <rect x="12" y="54" width="216" height="70" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <line x1="12" y1="54" x2="228" y2="124" stroke="#000000" stroke-width="1" />
          <line x1="228" y1="54" x2="12" y2="124" stroke="#000000" stroke-width="1" />
          <rect x="12" y="136" width="216" height="6" rx="2" fill="#000000" />
          <rect x="12" y="148" width="150" height="6" rx="2" fill="#888888" />
        </g>
      </g>
    </g>

    <!-- 5. RESET PASSWORD FORM PREVIEW (WHEN LINK CLICKED) -->
    <g transform="translate(48, 885)">
      <rect x="622" y="-12" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">5. RESET FORM PREVIEW</text>

      <rect width="764" height="250" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <g transform="translate(24, 20)">
        <text x="0" y="16" font-size="13" font-weight="bold">RESET PASSWORD VIEW (/reset-password?token=...)</text>
        <text x="0" y="34" font-size="9.5" fill="#666666">Token validated on mount · Strength gauge · Show/hide toggles</text>

        <!-- 2 Columns: Input fields on left, Strength bar on right -->
        <g transform="translate(0, 50)">
          <!-- Left: New & Confirm Password -->
          <g transform="translate(0, 0)">
            <text x="0" y="12" font-size="9" font-weight="bold">NEW PASSWORD</text>
            <rect x="0" y="18" width="340" height="38" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="12" y="42" font-size="14" font-family="monospace">••••••••••••</text>
            <rect x="306" y="24" width="26" height="26" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
            <text x="313" y="41" font-size="11">👁</text>
          </g>

          <g transform="translate(0, 68)">
            <text x="0" y="12" font-size="9" font-weight="bold">CONFIRM NEW PASSWORD</text>
            <rect x="0" y="18" width="340" height="38" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="12" y="42" font-size="14" font-family="monospace">••••••••••••</text>
            <rect x="306" y="24" width="26" height="26" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
            <text x="313" y="41" font-size="11">👁</text>
          </g>

          <!-- Right: Strength Gauge & Update Button -->
          <g transform="translate(376, 0)">
            <text x="0" y="12" font-size="9" font-weight="bold">PASSWORD STRENGTH EVALUATOR</text>
            <rect x="0" y="18" width="340" height="12" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
            <rect x="0" y="18" width="260" height="12" rx="4" fill="#000000" />
            <text x="0" y="44" font-size="8.5" fill="#444444">✓ 8+ Characters   ✓ Uppercase   ✓ Number   ✓ Symbol</text>

            <rect x="0" y="68" width="340" height="42" rx="6" fill="#000000" />
            <text x="100" y="94" font-size="11" font-weight="bold" fill="#FFFFFF">Update Account Password</text>
          </g>
        </g>
      </g>
    </g>

    <!-- 6. FOOTER -->
    <g transform="translate(0, 1160)">
      <rect x="670" y="8" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="680" y="21" font-size="9.5" font-weight="bold" fill="#000000">6. FOOTER</text>

      <line x1="24" y1="0" x2="836" y2="0" stroke="#000000" stroke-width="1.5" />
      <g transform="translate(48, 30)">
        <g transform="translate(0, 0)">
          <text x="0" y="12" font-size="10.5" font-weight="bold">ABOUT SANCTUARY</text>
          <rect x="0" y="22" width="160" height="6" rx="2" fill="#000000" />
          <rect x="0" y="32" width="140" height="6" rx="2" fill="#666666" />
          <rect x="0" y="42" width="150" height="6" rx="2" fill="#666666" />
        </g>
        <g transform="translate(260, 0)">
          <text x="0" y="12" font-size="10.5" font-weight="bold">RECOVERY SERVICES</text>
          <rect x="0" y="22" width="140" height="6" rx="2" fill="#000000" />
          <rect x="0" y="32" width="150" height="6" rx="2" fill="#666666" />
          <rect x="0" y="42" width="130" height="6" rx="2" fill="#666666" />
        </g>
        <g transform="translate(520, 0)">
          <text x="0" y="12" font-size="10.5" font-weight="bold">DESK ASSISTANCE</text>
          <rect x="0" y="22" width="150" height="6" rx="2" fill="#000000" />
          <rect x="0" y="32" width="130" height="6" rx="2" fill="#666666" />
          <rect x="0" y="42" width="160" height="6" rx="2" fill="#666666" />
        </g>
      </g>
      <line x1="24" y1="130" x2="836" y2="130" stroke="#000000" stroke-width="1" />
      <g transform="translate(48, 150)">
        <text x="0" y="0" font-size="8.5" fill="#555555">© 2026 LIBRAMIND AI SMART LIBRARY MANAGEMENT SYSTEM · SECURE PASSWORD RESET SPECIFICATION</text>
      </g>
    </g>
`;

// PAGE 14: BOOK RESERVATIONS & WAITING LIST SPECIFICATION
const RESERVATIONS_CONTENT = `
    <!-- 2. RESERVATIONS HEADER & ACTIONS -->
    <g transform="translate(0, 95)">
      <rect x="670" y="8" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="680" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. QUEUE HEADER</text>

      <g transform="translate(48, 16)">
        <text x="0" y="28" font-size="24" font-weight="bold" letter-spacing="-0.5">BOOK RESERVATIONS &amp; WAITING LISTS</text>
        <rect x="0" y="44" width="460" height="8" rx="3" fill="#000000" />
        <rect x="0" y="58" width="340" height="8" rx="3" fill="#888888" />

        <!-- Header Action Outlined Buttons -->
        <g transform="translate(560, 24)">
          <rect x="0" y="0" width="94" height="32" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="12" y="20" font-size="9.5" font-weight="bold">↻ Refresh</text>

          <rect x="104" y="0" width="100" height="32" rx="5" fill="#000000" />
          <text x="114" y="20" font-size="9.5" font-weight="bold" fill="#FFFFFF">+ Book Catalog</text>
        </g>
      </g>
    </g>

    <!-- 3. STATUS BAR: 4 HORIZONTALLY ALIGNED STATUS CARDS -->
    <g transform="translate(48, 195)">
      <rect x="670" y="-12" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="680" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. QUEUE KPIS</text>

      <g transform="translate(0, 10)">
        <!-- Card 1: Total Holds -->
        <g transform="translate(0, 0)">
          <rect width="182" height="74" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="14" y="24" font-size="9.5" font-weight="bold">TOTAL HOLDS</text>
          <rect x="14" y="34" width="70" height="14" rx="3" fill="#000000" />
          <rect x="14" y="54" width="120" height="6" rx="2" fill="#888888" />
        </g>

        <!-- Card 2: Ready for Pickup -->
        <g transform="translate(194, 0)">
          <rect width="182" height="74" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
          <text x="14" y="24" font-size="9.5" font-weight="bold">READY FOR PICKUP</text>
          <rect x="14" y="34" width="50" height="14" rx="3" fill="#000000" />
          <rect x="14" y="54" width="130" height="6" rx="2" fill="#888888" />
          <circle cx="160" cy="22" r="5" fill="#000000" />
        </g>

        <!-- Card 3: In Waiting Queue -->
        <g transform="translate(388, 0)">
          <rect width="182" height="74" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="14" y="24" font-size="9.5" font-weight="bold">IN WAITING QUEUES</text>
          <rect x="14" y="34" width="60" height="14" rx="3" fill="#000000" />
          <rect x="14" y="54" width="110" height="6" rx="2" fill="#888888" />
        </g>

        <!-- Card 4: Fulfilled / History -->
        <g transform="translate(582, 0)">
          <rect width="182" height="74" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <text x="14" y="24" font-size="9.5" font-weight="bold">FULFILLED / CLAIMED</text>
          <rect x="14" y="34" width="65" height="14" rx="3" fill="#000000" />
          <rect x="14" y="54" width="125" height="6" rx="2" fill="#888888" />
        </g>
      </g>
    </g>

    <!-- 4. FILTER TABS & SEARCH BAR -->
    <g transform="translate(48, 305)">
      <rect x="670" y="-12" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="680" y="1" font-size="9.5" font-weight="bold" fill="#000000">4. FILTER CONTROLS</text>

      <rect width="764" height="48" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
      <!-- Left Tabs -->
      <g transform="translate(12, 10)">
        <rect x="0" y="0" width="68" height="28" rx="4" fill="#000000" />
        <text x="12" y="18" font-size="9" font-weight="bold" fill="#FFFFFF">All (4)</text>

        <rect x="76" y="0" width="108" height="28" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="86" y="18" font-size="9" font-weight="bold">● Ready for Pickup</text>

        <rect x="192" y="0" width="98" height="28" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="202" y="18" font-size="9" font-weight="bold">Waiting Queue</text>

        <rect x="298" y="0" width="82" height="28" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="308" y="18" font-size="9" font-weight="bold">Fulfilled</text>
      </g>

      <!-- Right Search Bar -->
      <g transform="translate(520, 9)">
        <rect width="232" height="30" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <circle cx="16" cy="15" r="5" fill="none" stroke="#000000" stroke-width="1.4" />
        <line x1="20" y1="19" x2="25" y2="24" stroke="#000000" stroke-width="1.4" />
        <rect x="34" y="12" width="140" height="6" rx="2" fill="#888888" />
      </g>
    </g>

    <!-- 5. THREE DETAILED RESERVATION SPECIMEN CARDS -->
    <g transform="translate(48, 380)">
      <rect x="622" y="-12" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">5. HOLD SPECIMEN CARDS</text>

      <!-- SPECIMEN CARD 1: READY FOR PICKUP -->
      <g transform="translate(0, 0)">
        <rect width="764" height="160" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <!-- Book Cover [X] -->
        <g transform="translate(20, 20)">
          <rect width="90" height="120" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <line x1="0" y1="0" x2="90" y2="120" stroke="#000000" stroke-width="1.4" />
          <line x1="90" y1="0" x2="0" y2="120" stroke="#000000" stroke-width="1.4" />
        </g>
        <!-- Center Details -->
        <g transform="translate(130, 24)">
          <!-- Status Badge -->
          <rect width="138" height="22" rx="4" fill="#000000" />
          <text x="10" y="15" font-size="9" font-weight="bold" fill="#FFFFFF">● READY FOR PICKUP</text>
          <!-- Shelf Waypoint -->
          <text x="150" y="15" font-size="9" fill="#555555">Stack Waypoint: Floor 2 · Sec A · R-04</text>

          <!-- Book Title -->
          <text x="0" y="44" font-size="15" font-weight="bold">DESIGN PATTERNS: ELEMENTS OF REUSABLE SOFTWARE</text>
          <text x="0" y="60" font-size="10" fill="#444444">by Gang of Four · Reserved on Oct 28</text>

          <!-- 48-Hour Pickup Window Notice -->
          <g transform="translate(0, 74)">
            <rect width="450" height="34" rx="4" fill="#F8F8F8" stroke="#000000" stroke-width="1.2" />
            <text x="10" y="21" font-size="9" font-weight="bold">⏳ FRONT DESK HOLD: Pick up within 48 hours (Deadline: Nov 03, 17:00)</text>
          </g>
        </g>
        <!-- Right Actions -->
        <g transform="translate(608, 30)">
          <rect width="136" height="38" rx="6" fill="#000000" />
          <text x="18" y="23" font-size="10" font-weight="bold" fill="#FFFFFF">Claim &amp; Check Out</text>
          <rect y="46" width="136" height="32" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="36" y="66" font-size="9" font-weight="bold">Cancel Hold</text>
        </g>
      </g>

      <!-- SPECIMEN CARD 2: IN WAITING QUEUE (POSITION #1) -->
      <g transform="translate(0, 180)">
        <rect width="764" height="160" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
        <!-- Book Cover [X] -->
        <g transform="translate(20, 20)">
          <rect width="90" height="120" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <line x1="0" y1="0" x2="90" y2="120" stroke="#000000" stroke-width="1.4" />
          <line x1="90" y1="0" x2="0" y2="120" stroke="#000000" stroke-width="1.4" />
        </g>
        <!-- Center Details -->
        <g transform="translate(130, 24)">
          <!-- Status Badge -->
          <rect width="170" height="22" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <text x="10" y="15" font-size="9" font-weight="bold">⏱ IN QUEUE: POSITION #1 IN LINE</text>
          <text x="184" y="15" font-size="9" fill="#555555">Stack Waypoint: Floor 1 · Sec B · R-02</text>

          <!-- Book Title -->
          <text x="0" y="44" font-size="15" font-weight="bold">ARTIFICIAL INTELLIGENCE: A MODERN APPROACH</text>
          <text x="0" y="60" font-size="10" fill="#444444">by Stuart Russell &amp; Peter Norvig · Reserved on Oct 30</text>

          <!-- Queue Reassignment Notice -->
          <g transform="translate(0, 74)">
            <rect width="450" height="34" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" />
            <text x="10" y="21" font-size="9" fill="#333333">Next copy return triggers immediate 48h desk hold &amp; email notification.</text>
          </g>
        </g>
        <!-- Right Actions -->
        <g transform="translate(608, 44)">
          <rect width="136" height="34" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="36" y="21" font-size="9" font-weight="bold">Cancel Hold</text>
          <rect y="42" width="136" height="30" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <text x="38" y="61" font-size="8.5" fill="#444444">View Book Details</text>
        </g>
      </g>

      <!-- SPECIMEN CARD 3: FULFILLED / COMPLETED RECORD -->
      <g transform="translate(0, 360)">
        <rect width="764" height="145" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <!-- Book Cover [X] -->
        <g transform="translate(20, 16)">
          <rect width="80" height="110" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <line x1="0" y1="0" x2="80" y2="110" stroke="#000000" stroke-width="1.2" />
          <line x1="80" y1="0" x2="0" y2="110" stroke="#000000" stroke-width="1.2" />
        </g>
        <!-- Center Details -->
        <g transform="translate(120, 22)">
          <!-- Status Badge -->
          <rect width="144" height="20" rx="4" fill="#EEEEEE" stroke="#000000" stroke-width="1.2" />
          <text x="10" y="14" font-size="8.5" font-weight="bold">✓ FULFILLED &amp; CLAIMED</text>
          <text x="160" y="14" font-size="8.5" fill="#555555">Checked out to student membership STU-1001</text>

          <!-- Book Title -->
          <text x="0" y="42" font-size="14" font-weight="bold">CLEAN CODE: A HANDBOOK OF AGILE CRAFTSMANSHIP</text>
          <text x="0" y="58" font-size="9.5" fill="#555555">by Robert C. Martin · Picked up on Oct 25 · Due in 14 days</text>

          <rect x="0" y="70" width="460" height="6" rx="2" fill="#000000" />
          <rect x="0" y="82" width="380" height="6" rx="2" fill="#888888" />
        </g>
        <!-- Right Actions -->
        <g transform="translate(608, 48)">
          <rect width="136" height="34" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="32" y="21" font-size="9" font-weight="bold">View Loan Status</text>
        </g>
      </g>
    </g>

    <!-- 6. FOOTER -->
    <g transform="translate(0, 1160)">
      <rect x="670" y="8" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="680" y="21" font-size="9.5" font-weight="bold" fill="#000000">6. FOOTER</text>

      <line x1="24" y1="0" x2="836" y2="0" stroke="#000000" stroke-width="1.5" />
      <g transform="translate(48, 30)">
        <g transform="translate(0, 0)">
          <text x="0" y="12" font-size="10.5" font-weight="bold">ABOUT SANCTUARY</text>
          <rect x="0" y="22" width="160" height="6" rx="2" fill="#000000" />
          <rect x="0" y="32" width="140" height="6" rx="2" fill="#666666" />
          <rect x="0" y="42" width="150" height="6" rx="2" fill="#666666" />
        </g>
        <g transform="translate(260, 0)">
          <text x="0" y="12" font-size="10.5" font-weight="bold">HOLD POLICIES</text>
          <rect x="0" y="22" width="140" height="6" rx="2" fill="#000000" />
          <rect x="0" y="32" width="150" height="6" rx="2" fill="#666666" />
          <rect x="0" y="42" width="130" height="6" rx="2" fill="#666666" />
        </g>
        <g transform="translate(520, 0)">
          <text x="0" y="12" font-size="10.5" font-weight="bold">DESK ASSISTANCE</text>
          <rect x="0" y="22" width="150" height="6" rx="2" fill="#000000" />
          <rect x="0" y="32" width="130" height="6" rx="2" fill="#666666" />
          <rect x="0" y="42" width="160" height="6" rx="2" fill="#666666" />
        </g>
      </g>
      <line x1="24" y1="130" x2="836" y2="130" stroke="#000000" stroke-width="1" />
      <g transform="translate(48, 150)">
        <text x="0" y="0" font-size="8.5" fill="#555555">© 2026 LIBRAMIND AI SMART LIBRARY MANAGEMENT SYSTEM · BOOK RESERVATION &amp; WAITING LIST SPECIFICATION</text>
      </g>
    </g>
`;

// --------------------------------------------------------------------------------
// 12-PAGE BLUEPRINT ARRAY EXPORT
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// PAGE 15: SCHOLAR & STUDENT REGISTRATION PORTAL (/register)
// --------------------------------------------------------------------------------
const REGISTER_CONTENT = `
    <!-- 2. REGISTRATION HEADER -->
    <g transform="translate(0, 95)">
      <rect x="650" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="660" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. REGISTRATION HEADER</text>

      <g transform="translate(48, 16)">
        <text x="0" y="18" font-size="16" font-weight="bold" letter-spacing="0.5">SCHOLAR FOLIO ENROLLMENT</text>
        <text x="0" y="36" font-size="10.5" fill="#555555">Create your academic borrowing profile to reserve books, study pods, and view AI recommendations.</text>
      </g>
    </g>

    <!-- 3. REGISTRATION FORM CARD (CENTERED BALSAMIQ FORM CONTAINER) -->
    <g transform="translate(48, 175)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. ENROLLMENT FORM</text>

      <rect width="764" height="1060" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

      <!-- Left Column: Primary Credential Inputs -->
      <g transform="translate(36, 28)">
        <text x="0" y="16" font-size="13" font-weight="bold">PATRON CREDENTIALS &amp; ACADEMIC FOLIO</text>
        <text x="0" y="32" font-size="9.5" fill="#666666">Fields marked with (*) are recorded in SQLite archive</text>

        <!-- Full Name -->
        <g transform="translate(0, 48)">
          <text x="0" y="12" font-size="9.5" font-weight="bold">FULL NAME *</text>
          <rect x="0" y="18" width="330" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="12" y="40" font-size="10" fill="#777777">[ e.g. Aarav Sharma ]</text>
        </g>

        <!-- Email -->
        <g transform="translate(0, 118)">
          <text x="0" y="12" font-size="9.5" font-weight="bold">INSTITUTIONAL / STUDENT EMAIL *</text>
          <rect x="0" y="18" width="330" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="12" y="40" font-size="10" fill="#777777">[ scholar@libramind.edu ]</text>
        </g>

        <!-- Password -->
        <g transform="translate(0, 188)">
          <text x="0" y="12" font-size="9.5" font-weight="bold">CHOOSE PASSWORD *</text>
          <rect x="0" y="18" width="330" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="12" y="41" font-size="13" font-family="monospace">••••••••••••</text>
          <rect x="296" y="24" width="24" height="24" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <text x="302" y="40" font-size="11">👁</text>
        </g>

        <!-- Student / Folio ID -->
        <g transform="translate(0, 258)">
          <text x="0" y="12" font-size="9.5" font-weight="bold">STUDENT ROLL / FOLIO ID *</text>
          <rect x="0" y="18" width="330" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="12" y="40" font-size="10" fill="#777777">[ STU-1002 ]</text>
        </g>

        <!-- Academic Department -->
        <g transform="translate(0, 328)">
          <text x="0" y="12" font-size="9.5" font-weight="bold">DEPARTMENT / FACULTY *</text>
          <rect x="0" y="18" width="330" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="12" y="40" font-size="10" fill="#222222">Computer Science &amp; Engineering</text>
          <text x="306" y="40" font-size="10">▼</text>
        </g>
      </g>

      <!-- Right Column: Reading Interest Pills & SSO -->
      <g transform="translate(396, 28)">
        <text x="0" y="16" font-size="13" font-weight="bold">RESEARCH &amp; READING INTERESTS</text>
        <text x="0" y="32" font-size="9.5" fill="#666666">Powers initial TF-IDF recommendation seeds</text>

        <!-- Interest Tags Multi-Select Pills -->
        <g transform="translate(0, 48)">
          <!-- Row 1 -->
          <rect x="0" y="0" width="160" height="28" rx="14" fill="#000000" />
          <text x="14" y="18" font-size="9" font-weight="bold" fill="#FFFFFF">✓ Fiction &amp; Novels</text>

          <rect x="170" y="0" width="160" height="28" rx="14" fill="#000000" />
          <text x="180" y="18" font-size="9" font-weight="bold" fill="#FFFFFF">✓ Artificial Intelligence</text>

          <!-- Row 2 -->
          <rect x="0" y="36" width="145" height="28" rx="14" fill="#000000" />
          <text x="12" y="54" font-size="9" font-weight="bold" fill="#FFFFFF">✓ Computer Science</text>

          <rect x="155" y="36" width="145" height="28" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="168" y="54" font-size="9" font-weight="bold">+ Philosophy &amp; Ethics</text>

          <!-- Row 3 -->
          <rect x="0" y="72" width="150" height="28" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="12" y="90" font-size="9" font-weight="bold">+ Classic Literature</text>

          <rect x="160" y="72" width="155" height="28" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="172" y="90" font-size="9" font-weight="bold">+ Science &amp; Technology</text>

          <!-- Row 4 -->
          <rect x="0" y="108" width="140" height="28" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="12" y="126" font-size="9" font-weight="bold">+ History &amp; Heritage</text>

          <rect x="150" y="108" width="145" height="28" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="162" y="126" font-size="9" font-weight="bold">+ Business &amp; Startups</text>
        </g>

        <!-- Terms Agreement Checkbox -->
        <g transform="translate(0, 215)">
          <rect x="0" y="0" width="18" height="18" rx="3" fill="#000000" />
          <text x="4" y="14" font-size="12" fill="#FFFFFF">✓</text>
          <text x="28" y="14" font-size="9.5" font-weight="bold">I accept the Library Circulation Code and Policies</text>
          <text x="28" y="28" font-size="8.5" fill="#666666">Standard 14-day student borrowing terms with automated hold cues</text>
        </g>

        <!-- GitHub SSO Button Option -->
        <g transform="translate(0, 265)">
          <rect width="330" height="42" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
          <!-- Octocat / GitHub Icon Placeholder -->
          <circle cx="28" cy="21" r="10" fill="#000000" />
          <text x="24" y="25" font-size="11" fill="#FFFFFF">🐙</text>
          <text x="52" y="25" font-size="11" font-weight="bold">Continue with GitHub SSO Account</text>
        </g>

        <!-- Submit Button -->
        <g transform="translate(0, 325)">
          <rect width="330" height="44" rx="6" fill="#000000" />
          <text x="64" y="27" font-size="11.5" font-weight="bold" fill="#FFFFFF">Complete Registration &amp; Enter</text>
        </g>

        <!-- Existing Member Login Link -->
        <g transform="translate(0, 390)">
          <text x="0" y="14" font-size="9.5" fill="#555555">Already possess an accession folio? <tspan font-weight="bold" fill="#000000" text-decoration="underline">Sign in to Member Hub</tspan></text>
        </g>
      </g>

      <!-- Bottom Form Diagram: 4-Step Registration to Access Flow -->
      <g transform="translate(36, 520)">
        <text x="0" y="14" font-size="11.5" font-weight="bold">NEW SCHOLAR ONBOARDING WORKFLOW</text>
        <line x1="0" y1="24" x2="692" y2="24" stroke="#000000" stroke-width="1" />

        <g transform="translate(0, 40)">
          <!-- Step 1 -->
          <rect x="0" y="0" width="155" height="140" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <circle cx="24" cy="24" r="12" fill="#000000" />
          <text x="20" y="28" font-size="11" font-weight="bold" fill="#FFFFFF">1</text>
          <text x="44" y="28" font-size="10" font-weight="bold">Folio Entry</text>
          <line x1="12" y1="52" x2="143" y2="52" stroke="#CCCCCC" stroke-width="3" />
          <line x1="12" y1="64" x2="110" y2="64" stroke="#CCCCCC" stroke-width="3" />
          <line x1="12" y1="76" x2="130" y2="76" stroke="#CCCCCC" stroke-width="3" />
          <rect x="12" y="98" width="131" height="24" rx="3" fill="#EEEEEE" />
          <text x="28" y="114" font-size="8.5">Enter Credentials</text>

          <text x="162" y="70" font-size="18">→</text>

          <!-- Step 2 -->
          <rect x="178" y="0" width="155" height="140" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <circle cx="202" cy="24" r="12" fill="#000000" />
          <text x="198" y="28" font-size="11" font-weight="bold" fill="#FFFFFF">2</text>
          <text x="222" y="28" font-size="10" font-weight="bold">Password Hash</text>
          <rect x="190" y="52" width="131" height="40" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
          <text x="196" y="74" font-size="8" font-family="monospace">bcrypt.hash(10)</text>
          <rect x="190" y="98" width="131" height="24" rx="3" fill="#EEEEEE" />
          <text x="200" y="114" font-size="8.5">Salted Encryption</text>

          <text x="340" y="70" font-size="18">→</text>

          <!-- Step 3 -->
          <rect x="356" y="0" width="155" height="140" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <circle cx="380" cy="24" r="12" fill="#000000" />
          <text x="376" y="28" font-size="11" font-weight="bold" fill="#FFFFFF">3</text>
          <text x="400" y="28" font-size="10" font-weight="bold">DB Insertion</text>
          <rect x="368" y="52" width="131" height="40" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1" />
          <text x="376" y="74" font-size="8" font-family="monospace">INSERT INTO users</text>
          <rect x="368" y="98" width="131" height="24" rx="3" fill="#EEEEEE" />
          <text x="382" y="114" font-size="8.5">SQLite Persistence</text>

          <text x="518" y="70" font-size="18">→</text>

          <!-- Step 4 -->
          <rect x="534" y="0" width="158" height="140" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <circle cx="558" cy="24" r="12" fill="#000000" />
          <text x="554" y="28" font-size="11" font-weight="bold" fill="#FFFFFF">4</text>
          <text x="578" y="28" font-size="10" font-weight="bold">JWT Issued</text>
          <rect x="546" y="52" width="134" height="40" rx="3" fill="#000000" />
          <text x="556" y="74" font-size="8.5" font-weight="bold" fill="#FFFFFF">ACCESS SANCTUARY</text>
          <rect x="546" y="98" width="134" height="24" rx="3" fill="#EEEEEE" />
          <text x="554" y="114" font-size="8.5">Auto-Redirect to Hub</text>
        </g>
      </g>
    </g>

    <!-- 4. FOOTER -->
    <g transform="translate(0, 1315)">
      <rect width="860" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <text x="48" y="48" font-size="11" font-weight="bold">LIBRAMIND SANCTUARY // SCHOLAR REGISTRATION BLUEPRINT</text>
      <text x="590" y="48" font-size="9.5" fill="#666666">Page 15 of 21 · Balsamiq Low-Fidelity</text>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 16: ABOUT LIBRAMIND SANCTUARY & VISION (/about)
// --------------------------------------------------------------------------------
const ABOUT_CONTENT = `
    <!-- 2. ABOUT HERO & MISSION -->
    <g transform="translate(0, 95)">
      <rect x="650" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="660" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. ABOUT HERO</text>

      <g transform="translate(48, 16)">
        <text x="0" y="18" font-size="16" font-weight="bold" letter-spacing="0.5">ABOUT LIBRAMIND ARCHIVES &amp; SANCTUARY</text>
        <text x="0" y="36" font-size="10.5" fill="#555555">Bridging nineteenth-century classical library scholarship with twentieth-first-century AI discovery.</text>
      </g>
    </g>

    <!-- 3. MISSION STATEMENT & VISION CONTAINER -->
    <g transform="translate(48, 175)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. SANCTUARY MISSION</text>

      <rect width="764" height="280" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

      <!-- Left Side: Architectural Illustration Placeholder [X] -->
      <g transform="translate(24, 24)">
        <rect width="250" height="232" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <line x1="0" y1="0" x2="250" y2="232" stroke="#000000" stroke-width="1.2" />
        <line x1="250" y1="0" x2="0" y2="232" stroke="#000000" stroke-width="1.2" />
        <rect x="50" y="98" width="150" height="36" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="60" y="120" font-size="9" font-weight="bold">SANCTUARY ATRIUM [X]</text>
      </g>

      <!-- Right Side: Narrative Copy & Values -->
      <g transform="translate(298, 24)">
        <text x="0" y="16" font-size="14" font-weight="bold">THE FOUNDING CHARTER OF LIBRAMIND</text>
        <line x1="0" y1="26" x2="440" y2="26" stroke="#000000" stroke-width="1.2" />

        <text x="0" y="52" font-size="10" fill="#333333">Established to cultivate deep focus, serendipitous intellectual discovery,</text>
        <text x="0" y="70" font-size="10" fill="#333333">and open academic equity. LibraMind pairs classical physical stacks</text>
        <text x="0" y="88" font-size="10" fill="#333333">with neural TF-IDF retrieval algorithms and live circulation intelligence.</text>

        <!-- 3 Feature Bullets -->
        <g transform="translate(0, 110)">
          <circle cx="8" cy="8" r="4" fill="#000000" />
          <text x="22" y="12" font-size="9.5" font-weight="bold">Biophilic Calm &amp; Silent Architecture</text>
          <text x="22" y="26" font-size="8.5" fill="#666666">Designed for uninterrupted scholarly reading with natural lighting.</text>

          <circle cx="8" cy="46" r="4" fill="#000000" />
          <text x="22" y="50" font-size="9.5" font-weight="bold">Algorithmic TF-IDF Book Oracle</text>
          <text x="22" y="64" font-size="8.5" fill="#666666">Mathematical keyword vectorization across volume abstracts &amp; call numbers.</text>

          <circle cx="8" cy="84" r="4" fill="#000000" />
          <text x="22" y="88" font-size="9.5" font-weight="bold">Cryptographic Role-Based Security</text>
          <text x="22" y="102" font-size="8.5" fill="#666666">Zero-trust patron privacy, salted password hashes, and instant audit trails.</text>
        </g>
      </g>
    </g>

    <!-- 4. COLLECTION BENCHMARK METRICS STRIP -->
    <g transform="translate(48, 480)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">4. ARCHIVE BENCHMARKS</text>

      <rect width="764" height="130" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

      <!-- 4 Metric Cards -->
      <g transform="translate(20, 20)">
        <!-- Metric 1 -->
        <g transform="translate(0, 0)">
          <rect width="168" height="90" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="20" y="38" font-size="22" font-weight="bold">120,000+</text>
          <text x="20" y="58" font-size="9.5" font-weight="bold">PHYSICAL VOLUMES</text>
          <text x="20" y="72" font-size="8" fill="#666666">Dewey &amp; LoC Indexed</text>
        </g>

        <!-- Metric 2 -->
        <g transform="translate(186, 0)">
          <rect width="168" height="90" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="20" y="38" font-size="22" font-weight="bold">450+</text>
          <text x="20" y="58" font-size="9.5" font-weight="bold">STUDY PODS &amp; DESKS</text>
          <text x="20" y="72" font-size="8" fill="#666666">Silent &amp; Collaborative</text>
        </g>

        <!-- Metric 3 -->
        <g transform="translate(372, 0)">
          <rect width="168" height="90" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="20" y="38" font-size="22" font-weight="bold">14,200+</text>
          <text x="20" y="58" font-size="9.5" font-weight="bold">SCHOLAR PATRONS</text>
          <text x="20" y="72" font-size="8" fill="#666666">Students, Faculty &amp; Fellows</text>
        </g>

        <!-- Metric 4 -->
        <g transform="translate(558, 0)">
          <rect width="168" height="90" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="20" y="38" font-size="22" font-weight="bold">99.98%</text>
          <text x="20" y="58" font-size="9.5" font-weight="bold">DIGITAL AVAILABILITY</text>
          <text x="20" y="72" font-size="8" fill="#666666">Always-On Local Offline Fallback</text>
        </g>
      </g>
    </g>

    <!-- 5. BOARD OF CURATORS & LEADERSHIP -->
    <g transform="translate(48, 635)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">5. BOARD OF CURATORS</text>

      <text x="0" y="14" font-size="13" font-weight="bold">CURATORIAL BOARD &amp; LIBRARY FACULTY</text>

      <g transform="translate(0, 26)">
        <!-- Curator 1 -->
        <g transform="translate(0, 0)">
          <rect width="240" height="240" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <rect x="60" y="18" width="120" height="110" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <line x1="60" y1="18" x2="180" y2="128" stroke="#000000" stroke-width="1" />
          <line x1="180" y1="18" x2="60" y2="128" stroke="#000000" stroke-width="1" />
          <text x="120" y="152" font-size="11" font-weight="bold" text-anchor="middle">DR. ELEANOR VANE</text>
          <text x="120" y="168" font-size="9" fill="#555555" text-anchor="middle">Chief Archival Curator</text>
          <line x1="30" y1="182" x2="210" y2="182" stroke="#DDDDDD" stroke-width="1" />
          <text x="120" y="202" font-size="8" fill="#777777" text-anchor="middle">Specialist in Classical Manuscripts &amp;</text>
          <text x="120" y="216" font-size="8" fill="#777777" text-anchor="middle">Bibliographic Preservation Systems</text>
        </g>

        <!-- Curator 2 -->
        <g transform="translate(262, 0)">
          <rect width="240" height="240" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <rect x="60" y="18" width="120" height="110" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <line x1="60" y1="18" x2="180" y2="128" stroke="#000000" stroke-width="1" />
          <line x1="180" y1="18" x2="60" y2="128" stroke="#000000" stroke-width="1" />
          <text x="120" y="152" font-size="11" font-weight="bold" text-anchor="middle">MARCUS HOLLOWAY</text>
          <text x="120" y="168" font-size="9" fill="#555555" text-anchor="middle">Head of Information Architecture</text>
          <line x1="30" y1="182" x2="210" y2="182" stroke="#DDDDDD" stroke-width="1" />
          <text x="120" y="202" font-size="8" fill="#777777" text-anchor="middle">Pioneer in Algorithmic Cataloguing &amp;</text>
          <text x="120" y="216" font-size="8" fill="#777777" text-anchor="middle">Semantic Knowledge Graphs</text>
        </g>

        <!-- Curator 3 -->
        <g transform="translate(524, 0)">
          <rect width="240" height="240" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <rect x="60" y="18" width="120" height="110" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <line x1="60" y1="18" x2="180" y2="128" stroke="#000000" stroke-width="1" />
          <line x1="180" y1="18" x2="60" y2="128" stroke="#000000" stroke-width="1" />
          <text x="120" y="152" font-size="11" font-weight="bold" text-anchor="middle">SOPHIA STERLING</text>
          <text x="120" y="168" font-size="9" fill="#555555" text-anchor="middle">Director of Patron Experience</text>
          <line x1="30" y1="182" x2="210" y2="182" stroke="#DDDDDD" stroke-width="1" />
          <text x="120" y="202" font-size="8" fill="#777777" text-anchor="middle">Lead Architect of Study Sanctuaries &amp;</text>
          <text x="120" y="216" font-size="8" fill="#777777" text-anchor="middle">Ergonomic Silent Reading Pods</text>
        </g>
      </g>
    </g>

    <!-- 4. FOOTER -->
    <g transform="translate(0, 1315)">
      <rect width="860" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <text x="48" y="48" font-size="11" font-weight="bold">LIBRAMIND SANCTUARY // ABOUT &amp; MISSION BLUEPRINT</text>
      <text x="590" y="48" font-size="9.5" fill="#666666">Page 16 of 21 · Balsamiq Low-Fidelity</text>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 17: HELP CENTER & CIRCULATION DESK (/contact)
// --------------------------------------------------------------------------------
const CONTACT_CONTENT = `
    <!-- 2. CONTACT HEADER -->
    <g transform="translate(0, 95)">
      <rect x="650" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="660" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. HELP DESK HEADER</text>

      <g transform="translate(48, 16)">
        <text x="0" y="18" font-size="16" font-weight="bold" letter-spacing="0.5">CIRCULATION HELP DESK &amp; INQUIRIES</text>
        <text x="0" y="36" font-size="10.5" fill="#555555">Get assistance from reference archivists, submit circulation questions, or locate stacks.</text>
      </g>
    </g>

    <!-- 3. CONTACT CHANNELS (3 COLUMNS) -->
    <g transform="translate(48, 175)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. CONTACT CHANNELS</text>

      <!-- Channel 1 -->
      <g transform="translate(0, 0)">
        <rect width="240" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <rect x="16" y="16" width="32" height="32" rx="4" fill="#000000" />
        <text x="24" y="38" font-size="16" fill="#FFFFFF">📖</text>
        <text x="56" y="32" font-size="11" font-weight="bold">Circulation Front Desk</text>
        <text x="56" y="46" font-size="8.5" fill="#666666">Level 1 Main Atrium</text>
        <line x1="16" y1="64" x2="224" y2="64" stroke="#DDDDDD" stroke-width="1" />
        <text x="16" y="86" font-size="9">Hours: Mon-Sun 8:00 AM - 10:00 PM</text>
        <text x="16" y="104" font-size="9">Desk Phone: Ext. 4012 / (02) 8800</text>
        <text x="16" y="122" font-size="8.5" font-weight="bold" fill="#000000">Status: ● Active Desk Duty</text>
      </g>

      <!-- Channel 2 -->
      <g transform="translate(262, 0)">
        <rect width="240" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <rect x="16" y="16" width="32" height="32" rx="4" fill="#000000" />
        <text x="24" y="38" font-size="16" fill="#FFFFFF">🔍</text>
        <text x="56" y="32" font-size="11" font-weight="bold">Research Reference</text>
        <text x="56" y="46" font-size="8.5" fill="#666666">Level 3 North Gallery</text>
        <line x1="16" y1="64" x2="224" y2="64" stroke="#DDDDDD" stroke-width="1" />
        <text x="16" y="86" font-size="9">Hours: Mon-Fri 9:00 AM - 6:00 PM</text>
        <text x="16" y="104" font-size="9">Email: reference@libramind.edu</text>
        <text x="16" y="122" font-size="8.5" font-weight="bold" fill="#000000">Status: ● Consultation Open</text>
      </g>

      <!-- Channel 3 -->
      <g transform="translate(524, 0)">
        <rect width="240" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <rect x="16" y="16" width="32" height="32" rx="4" fill="#000000" />
        <text x="24" y="38" font-size="16" fill="#FFFFFF">💻</text>
        <text x="56" y="32" font-size="11" font-weight="bold">Digital IT &amp; Pod Access</text>
        <text x="56" y="46" font-size="8.5" fill="#666666">Online Ticket System</text>
        <line x1="16" y1="64" x2="224" y2="64" stroke="#DDDDDD" stroke-width="1" />
        <text x="16" y="86" font-size="9">Hours: 24/7 Digital Intake</text>
        <text x="16" y="104" font-size="9">Support: support@libramind.edu</text>
        <text x="16" y="122" font-size="8.5" font-weight="bold" fill="#000000">Status: ● Response &lt; 2 Hours</text>
      </g>
    </g>

    <!-- 4. INTERACTIVE PATRON DISPATCH FORM -->
    <g transform="translate(48, 350)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">4. DISPATCH INTAKE FORM</text>

      <rect width="764" height="420" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

      <g transform="translate(24, 24)">
        <text x="0" y="16" font-size="13" font-weight="bold">SUBMIT PATRON INQUIRY OR CIRCULATION REQUEST</text>
        <text x="0" y="32" font-size="9.5" fill="#666666">Routed automatically to the appropriate circulation department queue</text>

        <!-- Form Grid -->
        <g transform="translate(0, 50)">
          <!-- Left: Name & Folio -->
          <g transform="translate(0, 0)">
            <text x="0" y="12" font-size="9.5" font-weight="bold">SCHOLAR NAME *</text>
            <rect x="0" y="18" width="340" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="12" y="40" font-size="10" fill="#777777">[ Aarav Sharma ]</text>

            <g transform="translate(0, 70)">
              <text x="0" y="12" font-size="9.5" font-weight="bold">MEMBERSHIP / FOLIO ID *</text>
              <rect x="0" y="18" width="340" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
              <text x="12" y="40" font-size="10" fill="#777777">[ STU-1001 ]</text>
            </g>

            <g transform="translate(0, 140)">
              <text x="0" y="12" font-size="9.5" font-weight="bold">INQUIRY SUBJECT / CATEGORY *</text>
              <rect x="0" y="18" width="340" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
              <text x="12" y="40" font-size="10">Loan Renewal &amp; Due Date Extension ▾</text>
            </g>
          </g>

          <!-- Right: Message Area & Submit -->
          <g transform="translate(376, 0)">
            <text x="0" y="12" font-size="9.5" font-weight="bold">DISPATCH MESSAGE *</text>
            <rect x="0" y="18" width="340" height="150" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <text x="12" y="40" font-size="10" fill="#777777">Please enter details regarding your book copy,</text>
            <text x="12" y="56" font-size="10" fill="#777777">study pod reservation, or research request...</text>

            <g transform="translate(0, 185)">
              <rect width="340" height="42" rx="6" fill="#000000" />
              <text x="80" y="26" font-size="11" font-weight="bold" fill="#FFFFFF">Transmit Dispatch to Archivist</text>
            </g>
          </g>
        </g>
      </g>
    </g>

    <!-- 5. FREQUENTLY ASKED QUESTIONS ACCORDION -->
    <g transform="translate(48, 795)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">5. FAQ ACCORDION</text>

      <text x="0" y="14" font-size="13" font-weight="bold">FREQUENTLY ASKED CIRCULATION QUESTIONS</text>

      <g transform="translate(0, 26)">
        <!-- Q1 -->
        <rect width="764" height="46" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="16" y="28" font-size="10.5" font-weight="bold">Q: How do I renew my borrowed book copies online?</text>
        <text x="736" y="28" font-size="14" font-weight="bold">▾</text>

        <!-- Q2 (Expanded) -->
        <g transform="translate(0, 56)">
          <rect width="764" height="85" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="16" y="24" font-size="10.5" font-weight="bold">Q: What happens when an active reservation hold is placed on my book?</text>
          <text x="736" y="24" font-size="14" font-weight="bold">▴</text>
          <line x1="16" y1="36" x2="748" y2="36" stroke="#EEEEEE" stroke-width="1" />
          <text x="16" y="54" font-size="9" fill="#444444">When another patron joins the waiting queue for your borrowed title, automated renewal is locked.</text>
          <text x="16" y="70" font-size="9" fill="#444444">You must return the physical copy by the stipulated due date to ensure equitable campus circulation.</text>
        </g>

        <!-- Q3 -->
        <g transform="translate(0, 150)">
          <rect width="764" height="46" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="16" y="28" font-size="10.5" font-weight="bold">Q: Can I book study pods for group research projects?</text>
          <text x="736" y="28" font-size="14" font-weight="bold">▾</text>
        </g>
      </g>
    </g>

    <!-- 4. FOOTER -->
    <g transform="translate(0, 1315)">
      <rect width="860" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <text x="48" y="48" font-size="11" font-weight="bold">LIBRAMIND SANCTUARY // CONTACT &amp; CIRCULATION HELP DESK</text>
      <text x="590" y="48" font-size="9.5" fill="#666666">Page 17 of 21 · Balsamiq Low-Fidelity</text>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 18: LIBRARY POLICIES & BORROWING CODE (/terms)
// --------------------------------------------------------------------------------
const TERMS_CONTENT = `
    <!-- 2. TERMS & POLICIES HEADER -->
    <g transform="translate(0, 95)">
      <rect x="650" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="660" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. CHARTER HEADER</text>

      <g transform="translate(48, 16)">
        <text x="0" y="18" font-size="16" font-weight="bold" letter-spacing="0.5">LIBRARY CODE OF CONDUCT &amp; BORROWING POLICIES</text>
        <text x="0" y="36" font-size="10.5" fill="#555555">Official regulations governing book circulation, reservation queues, study pod bookings, and patron privacy.</text>
      </g>
    </g>

    <!-- 3. BORROWING LIMITS & PRIVILEGES TABLE -->
    <g transform="translate(48, 175)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. CIRCULATION MATRIX</text>

      <rect width="764" height="260" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

      <g transform="translate(24, 20)">
        <text x="0" y="16" font-size="13" font-weight="bold">PATRON TIER BORROWING ALLOWANCES</text>

        <!-- Table Header -->
        <g transform="translate(0, 36)">
          <rect width="716" height="32" rx="4" fill="#000000" />
          <text x="16" y="20" font-size="9.5" font-weight="bold" fill="#FFFFFF">PATRON TIER</text>
          <text x="160" y="20" font-size="9.5" font-weight="bold" fill="#FFFFFF">MAX COPIES</text>
          <text x="270" y="20" font-size="9.5" font-weight="bold" fill="#FFFFFF">LOAN PERIOD</text>
          <text x="390" y="20" font-size="9.5" font-weight="bold" fill="#FFFFFF">RENEWAL LIMITS</text>
          <text x="530" y="20" font-size="9.5" font-weight="bold" fill="#FFFFFF">GRACE PERIOD</text>
          <text x="640" y="20" font-size="9.5" font-weight="bold" fill="#FFFFFF">OVERDUE FEE</text>

          <!-- Row 1: Undergraduate -->
          <g transform="translate(0, 34)">
            <rect width="716" height="34" fill="#FFFFFF" stroke="#DDDDDD" stroke-width="1" />
            <text x="16" y="22" font-size="9.5" font-weight="bold">Undergraduate Student</text>
            <text x="160" y="22" font-size="9.5">5 Books</text>
            <text x="270" y="22" font-size="9.5">14 Calendar Days</text>
            <text x="390" y="22" font-size="9.5">Up to 2 Times</text>
            <text x="530" y="22" font-size="9.5">24 Hours</text>
            <text x="640" y="22" font-size="9.5" font-weight="bold">$0.50 / Day</text>
          </g>

          <!-- Row 2: Postgraduate / Researcher -->
          <g transform="translate(0, 68)">
            <rect width="716" height="34" fill="#F9F9F9" stroke="#DDDDDD" stroke-width="1" />
            <text x="16" y="22" font-size="9.5" font-weight="bold">Postgraduate / Fellow</text>
            <text x="160" y="22" font-size="9.5">8 Books</text>
            <text x="270" y="22" font-size="9.5">28 Calendar Days</text>
            <text x="390" y="22" font-size="9.5">Up to 3 Times</text>
            <text x="530" y="22" font-size="9.5">48 Hours</text>
            <text x="640" y="22" font-size="9.5" font-weight="bold">$0.50 / Day</text>
          </g>

          <!-- Row 3: Faculty & Staff -->
          <g transform="translate(0, 102)">
            <rect width="716" height="34" fill="#FFFFFF" stroke="#DDDDDD" stroke-width="1" />
            <text x="16" y="22" font-size="9.5" font-weight="bold">Faculty / University Staff</text>
            <text x="160" y="22" font-size="9.5">15 Books</text>
            <text x="270" y="22" font-size="9.5">90 Calendar Days</text>
            <text x="390" y="22" font-size="9.5">Up to 5 Times</text>
            <text x="530" y="22" font-size="9.5">7 Days</text>
            <text x="640" y="22" font-size="9.5" font-weight="bold">Exempt</text>
          </g>

          <!-- Row 4: Visiting Scholar -->
          <g transform="translate(0, 136)">
            <rect width="716" height="34" fill="#F9F9F9" stroke="#DDDDDD" stroke-width="1" />
            <text x="16" y="22" font-size="9.5" font-weight="bold">Visiting Scholar</text>
            <text x="160" y="22" font-size="9.5">3 Books</text>
            <text x="270" y="22" font-size="9.5">14 Calendar Days</text>
            <text x="390" y="22" font-size="9.5">1 Time Only</text>
            <text x="530" y="22" font-size="9.5">24 Hours</text>
            <text x="640" y="22" font-size="9.5" font-weight="bold">$1.00 / Day</text>
          </g>
        </g>
      </g>
    </g>

    <!-- 4. POLICIES GRID: QUEUE PROTOCOLS & SILENT STUDY CODE -->
    <g transform="translate(48, 455)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">4. DETAILED CLAUSES</text>

      <g transform="translate(0, 0)">
        <!-- Clause 1 Card: Hold & Queue Protocol -->
        <g transform="translate(0, 0)">
          <rect width="370" height="320" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(20, 20)">
            <rect width="28" height="28" rx="4" fill="#000000" />
            <text x="9" y="19" font-size="12" fill="#FFFFFF">§1</text>
            <text x="36" y="18" font-size="12" font-weight="bold">RESERVATION HOLDS &amp; QUEUES</text>
            <text x="36" y="32" font-size="8.5" fill="#666666">Automated Circulation Lifecycle</text>
            <line x1="0" y1="46" x2="330" y2="46" stroke="#DDDDDD" stroke-width="1" />

            <text x="0" y="68" font-size="9.5" font-weight="bold">1.1 Priority Queue Ordering</text>
            <text x="0" y="84" font-size="8.5" fill="#444444">Holds are assigned strict FIFO (First-In-First-Out) ranking.</text>

            <text x="0" y="112" font-size="9.5" font-weight="bold">1.2 48-Hour Claim Window</text>
            <text x="0" y="128" font-size="8.5" fill="#444444">When a copy is returned, the next patron in queue has</text>
            <text x="0" y="142" font-size="8.5" fill="#444444">48 hours to collect it before queue forfeiture.</text>

            <text x="0" y="170" font-size="9.5" font-weight="bold">1.3 Cancellation Without Penalty</text>
            <text x="0" y="186" font-size="8.5" fill="#444444">Patrons may cancel a hold request at any time prior to</text>
            <text x="0" y="200" font-size="8.5" fill="#444444">physical book issuance without demerits.</text>
          </g>
        </g>

        <!-- Clause 2 Card: Sanctuary Etiquette & Data Privacy -->
        <g transform="translate(394, 0)">
          <rect width="370" height="320" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <g transform="translate(20, 20)">
            <rect width="28" height="28" rx="4" fill="#000000" />
            <text x="9" y="19" font-size="12" fill="#FFFFFF">§2</text>
            <text x="36" y="18" font-size="12" font-weight="bold">SANCTUARY CODE &amp; ETHICS</text>
            <text x="36" y="32" font-size="8.5" fill="#666666">Preserving Intellectual Focus</text>
            <line x1="0" y1="46" x2="330" y2="46" stroke="#DDDDDD" stroke-width="1" />

            <text x="0" y="68" font-size="9.5" font-weight="bold">2.1 Zoned Noise Architecture</text>
            <text x="0" y="84" font-size="8.5" fill="#444444">Level 3: Absolute Silence. Level 2: Whisper Pods.</text>

            <text x="0" y="112" font-size="9.5" font-weight="bold">2.2 Pod Reservation Courtesy</text>
            <text x="0" y="128" font-size="8.5" fill="#444444">Study pods held vacant for &gt; 20 minutes are released</text>
            <text x="0" y="142" font-size="8.5" fill="#444444">automatically to waiting scholars on the floor map.</text>

            <text x="0" y="170" font-size="9.5" font-weight="bold">2.3 Cryptographic Patron Privacy</text>
            <text x="0" y="186" font-size="8.5" fill="#444444">Reading histories and recommendation vectors are stored</text>
            <text x="0" y="200" font-size="8.5" fill="#444444">securely and never sold or shared with outside parties.</text>
          </g>
        </g>
      </g>
    </g>

    <!-- 4. FOOTER -->
    <g transform="translate(0, 1315)">
      <rect width="860" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <text x="48" y="48" font-size="11" font-weight="bold">LIBRAMIND SANCTUARY // CHARTER &amp; POLICIES BLUEPRINT</text>
      <text x="590" y="48" font-size="9.5" fill="#666666">Page 18 of 21 · Balsamiq Low-Fidelity</text>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 19: PATRON NOTICE CENTER & DISPATCHES (/notifications)
// --------------------------------------------------------------------------------
const NOTIFICATIONS_CONTENT = `
    <!-- 2. NOTICE CENTER HEADER -->
    <g transform="translate(0, 95)">
      <rect x="650" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="660" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. NOTICE HEADER</text>

      <g transform="translate(48, 16)">
        <text x="0" y="18" font-size="16" font-weight="bold" letter-spacing="0.5">PATRON NOTICE CENTER &amp; DISPATCHES</text>
        <text x="0" y="36" font-size="10.5" fill="#555555">Real-time alerts regarding circulation due dates, reservation hold arrivals, and academic broadcasts.</text>
      </g>
    </g>

    <!-- 3. NOTICE FILTER PILLS & ACTIONS BAR -->
    <g transform="translate(48, 175)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. FILTER CONTROLS</text>

      <rect width="764" height="52" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />

      <!-- Filter Pills -->
      <g transform="translate(16, 12)">
        <rect x="0" y="0" width="130" height="28" rx="14" fill="#000000" />
        <text x="18" y="18" font-size="9.5" font-weight="bold" fill="#FFFFFF">All Dispatches (8)</text>

        <rect x="140" y="0" width="155" height="28" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        <text x="154" y="18" font-size="9.5">Due Date Alerts (2)</text>

        <rect x="305" y="0" width="145" height="28" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        <text x="319" y="18" font-size="9.5">Hold Ready (1)</text>

        <rect x="460" y="0" width="130" height="28" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        <text x="474" y="18" font-size="9.5">Broadcasts (5)</text>

        <!-- Right Side: Mark All Read Action -->
        <rect x="618" y="0" width="114" height="28" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="628" y="18" font-size="8.5" font-weight="bold">✓ Mark All Read</text>
      </g>
    </g>

    <!-- 4. NOTIFICATION CARDS LIST -->
    <g transform="translate(48, 245)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">4. DISPATCH FEED</text>

      <!-- Card 1: Urgent Due Date Warning -->
      <g transform="translate(0, 0)">
        <rect width="764" height="95" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <rect x="16" y="16" width="36" height="36" rx="6" fill="#000000" />
        <text x="26" y="39" font-size="16" fill="#FFFFFF">⚠️</text>

        <text x="64" y="30" font-size="11.5" font-weight="bold">DUE DATE COUNTDOWN: "CLEAN CODE" EXPIRES TOMORROW</text>
        <text x="64" y="46" font-size="9.5" fill="#444444">Your physical copy (Barcode: LM-BOK-001) is due on Oct 31, 2026. Renew or return to avoid overdue fines.</text>
        <text x="64" y="66" font-size="8" fill="#888888">DISPATCHED: TODAY 08:30 AM · PRIORITY: HIGH</text>

        <!-- Action Button -->
        <rect x="630" y="28" width="115" height="36" rx="5" fill="#000000" />
        <text x="642" y="50" font-size="9" font-weight="bold" fill="#FFFFFF">Quick Renew 7d</text>
      </g>

      <!-- Card 2: Reservation Ready for Collection -->
      <g transform="translate(0, 110)">
        <rect width="764" height="95" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <rect x="16" y="16" width="36" height="36" rx="6" fill="#000000" />
        <text x="26" y="39" font-size="16" fill="#FFFFFF">📗</text>

        <text x="64" y="30" font-size="11.5" font-weight="bold">HOLD COPY READY: "INTRODUCTION TO ALGORITHMS"</text>
        <text x="64" y="46" font-size="9.5" fill="#444444">Returned by previous borrower. Reserved copy placed on Level 1 Hold Shelf A-4. 48-Hour hold active.</text>
        <text x="64" y="66" font-size="8" fill="#888888">DISPATCHED: YESTERDAY 03:15 PM · PICKUP DEADLINE: OCT 31 03:15 PM</text>

        <!-- Action Button -->
        <rect x="630" y="28" width="115" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="642" y="50" font-size="9" font-weight="bold">View Hold Pass</text>
      </g>

      <!-- Card 3: Study Pod Confirmed -->
      <g transform="translate(0, 220)">
        <rect width="764" height="95" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <rect x="16" y="16" width="36" height="36" rx="6" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
        <text x="26" y="39" font-size="16">🪑</text>

        <text x="64" y="30" font-size="11.5" font-weight="bold">STUDY POD CONFIRMATION: POD #04 (LEVEL 2 COLLABORATIVE)</text>
        <text x="64" y="46" font-size="9.5" fill="#444444">Your reservation for Focus Pod #04 is active for 2 hours. Power sockets and high-speed Wi-Fi confirmed.</text>
        <text x="64" y="66" font-size="8" fill="#888888">DISPATCHED: 2 DAYS AGO · POD ACTIVE</text>

        <!-- Action Button -->
        <rect x="630" y="28" width="115" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="648" y="50" font-size="9" font-weight="bold">Floor Map</text>
      </g>

      <!-- Card 4: General Library Broadcast -->
      <g transform="translate(0, 330)">
        <rect width="764" height="95" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <rect x="16" y="16" width="36" height="36" rx="6" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
        <text x="26" y="39" font-size="16">📢</text>

        <text x="64" y="30" font-size="11.5" font-weight="bold">ANNUAL ATHENAEUM BOOK SALON ANNOUNCEMENT</text>
        <text x="64" y="46" font-size="9.5" fill="#444444">Special curator lecture on rare Victorian bindings and modern cryptographic cataloguing this Friday at 4 PM.</text>
        <text x="64" y="66" font-size="8" fill="#888888">DISPATCHED: 3 DAYS AGO · ALL MEMBERS INVITED</text>

        <!-- Action Button -->
        <rect x="630" y="28" width="115" height="36" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="645" y="50" font-size="9" font-weight="bold">Event Details</text>
      </g>
    </g>

    <!-- 5. DELIVERY PREFERENCES STRIP -->
    <g transform="translate(48, 700)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">5. PREFERENCE TOGGLES</text>

      <rect width="764" height="110" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />

      <g transform="translate(24, 20)">
        <text x="0" y="16" font-size="12" font-weight="bold">NOTIFICATION DISPATCH CHANNELS &amp; FREQUENCY</text>

        <g transform="translate(0, 36)">
          <!-- Toggle 1: Email Notifications -->
          <rect x="0" y="0" width="220" height="34" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <text x="12" y="22" font-size="9" font-weight="bold">Email Alerts: [✓ ENABLED]</text>

          <!-- Toggle 2: In-App Sound Alerts -->
          <rect x="236" y="0" width="220" height="34" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <text x="248" y="22" font-size="9" font-weight="bold">In-Hub Banners: [✓ ACTIVE]</text>

          <!-- Toggle 3: Due Date Timing -->
          <rect x="472" y="0" width="230" height="34" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <text x="484" y="22" font-size="9" font-weight="bold">Alert Window: [ 48h Advance ▾ ]</text>
        </g>
      </g>
    </g>

    <!-- 4. FOOTER -->
    <g transform="translate(0, 1315)">
      <rect width="860" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <text x="48" y="48" font-size="11" font-weight="bold">LIBRAMIND SANCTUARY // PATRON NOTICE CENTER BLUEPRINT</text>
      <text x="590" y="48" font-size="9.5" fill="#666666">Page 19 of 21 · Balsamiq Low-Fidelity</text>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 20: SECURITY PASSWORD RESET PORTAL (/reset-password)
// --------------------------------------------------------------------------------
const RESET_PASSWORD_PAGE_CONTENT = `
    <!-- 2. RESET SECURITY HEADER -->
    <g transform="translate(0, 95)">
      <rect x="650" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="660" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. SECURITY RESET</text>

      <g transform="translate(48, 16)">
        <text x="0" y="18" font-size="16" font-weight="bold" letter-spacing="0.5">ESTABLISH NEW SECURITY CREDENTIALS</text>
        <text x="0" y="36" font-size="10.5" fill="#555555">Cryptographic reset verification. Create an updated master password for your folio account.</text>
      </g>
    </g>

    <!-- 3. RESET FORM CONTAINER (CENTERED 540PX) -->
    <g transform="translate(160, 180)">
      <rect x="360" y="-12" width="170" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="370" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. RESET FORM CARD</text>

      <rect width="540" height="580" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

      <g transform="translate(36, 32)">
        <!-- Verified Token Status Badge -->
        <rect width="468" height="36" rx="4" fill="#000000" />
        <text x="20" y="22" font-size="9.5" font-weight="bold" fill="#FFFFFF">✓ CRYPTOGRAPHIC RESET TOKEN VALIDATED</text>
        <text x="350" y="22" font-size="8.5" fill="#AAAAAA">30-min window</text>

        <!-- Input 1: New Password -->
        <g transform="translate(0, 56)">
          <text x="0" y="14" font-size="9.5" font-weight="bold">NEW MASTER PASSWORD *</text>
          <rect x="0" y="20" width="468" height="42" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="16" y="47" font-size="15" font-family="monospace">••••••••••••••••</text>
          <rect x="424" y="27" width="28" height="28" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <text x="432" y="46" font-size="12">👁</text>
        </g>

        <!-- Input 2: Confirm Password -->
        <g transform="translate(0, 136)">
          <text x="0" y="14" font-size="9.5" font-weight="bold">CONFIRM NEW MASTER PASSWORD *</text>
          <rect x="0" y="20" width="468" height="42" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="16" y="47" font-size="15" font-family="monospace">••••••••••••••••</text>
          <rect x="424" y="27" width="28" height="28" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
          <text x="432" y="46" font-size="12">👁</text>
        </g>

        <!-- Password Strength Meter -->
        <g transform="translate(0, 218)">
          <text x="0" y="12" font-size="9" font-weight="bold">PASSWORD COMPLEXITY RATING</text>
          <rect x="0" y="18" width="468" height="10" rx="3" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
          <rect x="0" y="18" width="468" height="10" rx="3" fill="#000000" />
          <text x="0" y="44" font-size="8.5" font-weight="bold">✓ 100% STRONG · All security requirements satisfied</text>

          <!-- Checklist -->
          <g transform="translate(0, 60)">
            <text x="0" y="12" font-size="8.5" fill="#444444">✓ Minimum 8 alphanumeric characters</text>
            <text x="0" y="26" font-size="8.5" fill="#444444">✓ Contains both uppercase &amp; lowercase glyphs</text>
            <text x="0" y="40" font-size="8.5" fill="#444444">✓ Contains numerical digits (0-9)</text>
            <text x="0" y="54" font-size="8.5" fill="#444444">✓ Contains special symbol (@, #, $, etc.)</text>
          </g>
        </g>

        <!-- Submit Button -->
        <g transform="translate(0, 375)">
          <rect width="468" height="44" rx="6" fill="#000000" />
          <text x="120" y="27" font-size="11.5" font-weight="bold" fill="#FFFFFF">Update Password &amp; Enter Hub</text>
        </g>

        <!-- Back Link -->
        <g transform="translate(0, 440)">
          <text x="140" y="16" font-size="9" fill="#555555">Cancel and return to <tspan font-weight="bold" fill="#000000" text-decoration="underline">Patron Login</tspan></text>
        </g>
      </g>
    </g>

    <!-- 4. SECURITY AUDIT CALLOUT -->
    <g transform="translate(160, 785)">
      <rect width="540" height="90" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" stroke-dasharray="4,3" />
      <text x="24" y="32" font-size="10" font-weight="bold">AUTOMATED AUDIT TRAIL LOGGING</text>
      <text x="24" y="50" font-size="8.5" fill="#555555">Password updates trigger immediate revocation of active JWT tokens across all</text>
      <text x="24" y="66" font-size="8.5" fill="#555555">devices, record an audit event in SQLite, and dispatch an email confirmation.</text>
    </g>

    <!-- 5. FOOTER -->
    <g transform="translate(0, 1315)">
      <rect width="860" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <text x="48" y="48" font-size="11" font-weight="bold">LIBRAMIND SANCTUARY // PASSWORD RESET BLUEPRINT</text>
      <text x="590" y="48" font-size="9.5" fill="#666666">Page 20 of 21 · Balsamiq Low-Fidelity</text>
    </g>
`;

// --------------------------------------------------------------------------------
// PAGE 21: HISTORICAL ARCHIVE NOT FOUND 404 (/not-found)
// --------------------------------------------------------------------------------
const NOT_FOUND_CONTENT = `
    <!-- 2. 404 FOLIO MISSING HEADER -->
    <g transform="translate(0, 95)">
      <rect x="650" y="8" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="660" y="21" font-size="9.5" font-weight="bold" fill="#000000">2. 404 STATUS</text>

      <g transform="translate(48, 16)">
        <text x="0" y="18" font-size="16" font-weight="bold" letter-spacing="0.5">HISTORICAL ARCHIVE NOT FOUND // ERROR 404</text>
        <text x="0" y="36" font-size="10.5" fill="#555555">The requested manuscript, catalogue shelf index, or chamber does not exist in the collection.</text>
      </g>
    </g>

    <!-- 3. BROKEN BOOKPLATE & 404 EMBLEM CONTAINER -->
    <g transform="translate(48, 180)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">3. LOST MANUSCRIPT [X]</text>

      <rect width="764" height="420" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

      <!-- Centered Broken Book Illustration Box [X] -->
      <g transform="translate(257, 36)">
        <rect width="250" height="210" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <line x1="0" y1="0" x2="250" y2="210" stroke="#000000" stroke-width="1.2" />
        <line x1="250" y1="0" x2="0" y2="210" stroke="#000000" stroke-width="1.2" />
        <rect x="40" y="85" width="170" height="38" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="48" y="108" font-size="10" font-weight="bold">MISSING FOLIO [X]</text>
      </g>

      <!-- 404 Typography -->
      <g transform="translate(0, 270)">
        <text x="382" y="32" font-size="34" font-weight="bold" text-anchor="middle">FOLIO UNRESOLVED: 404</text>
        <text x="382" y="58" font-size="11" fill="#444444" text-anchor="middle">The page or volume you are seeking has either been de-accessioned, relocated to closed reserves,</text>
        <text x="382" y="76" font-size="11" fill="#444444" text-anchor="middle">or the accession address contains an orthographical discrepancy.</text>

        <!-- Search Bar within 404 -->
        <g transform="translate(182, 96)">
          <rect width="400" height="40" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
          <text x="16" y="25" font-size="10" fill="#777777">Search archive by title, author, or Dewey call number...</text>
          <rect x="306" y="5" width="88" height="30" rx="3" fill="#000000" />
          <text x="320" y="24" font-size="9" font-weight="bold" fill="#FFFFFF">Search</text>
        </g>
      </g>
    </g>

    <!-- 4. QUICK RECOVERY RESCUE TILES -->
    <g transform="translate(48, 630)">
      <rect x="622" y="-12" width="190" height="18" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-dasharray="3,3" rx="3" />
      <text x="632" y="1" font-size="9.5" font-weight="bold" fill="#000000">4. RESCUE HUBS</text>

      <text x="0" y="14" font-size="13" font-weight="bold">RETURN TO ACTIVE SANCTUARY CHAMBERS</text>

      <g transform="translate(0, 26)">
        <!-- Tile 1: Home Sanctuary -->
        <g transform="translate(0, 0)">
          <rect width="176" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <rect x="16" y="16" width="32" height="32" rx="4" fill="#000000" />
          <text x="24" y="38" font-size="16" fill="#FFFFFF">🏛️</text>
          <text x="16" y="74" font-size="11" font-weight="bold">Home Sanctuary</text>
          <text x="16" y="92" font-size="8.5" fill="#666666">Main entrance, showcase, and statistics</text>
          <rect x="16" y="110" width="144" height="26" rx="3" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
          <text x="44" y="127" font-size="8.5" font-weight="bold">Visit Home →</text>
        </g>

        <!-- Tile 2: Book Catalog -->
        <g transform="translate(196, 0)">
          <rect width="176" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <rect x="16" y="16" width="32" height="32" rx="4" fill="#000000" />
          <text x="24" y="38" font-size="16" fill="#FFFFFF">📚</text>
          <text x="16" y="74" font-size="11" font-weight="bold">Book Catalog</text>
          <text x="16" y="92" font-size="8.5" fill="#666666">Browse all 120,000+ indexed books</text>
          <rect x="16" y="110" width="144" height="26" rx="3" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
          <text x="40" y="127" font-size="8.5" font-weight="bold">Open Catalog →</text>
        </g>

        <!-- Tile 3: AI Book Oracle -->
        <g transform="translate(392, 0)">
          <rect width="176" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <rect x="16" y="16" width="32" height="32" rx="4" fill="#000000" />
          <text x="24" y="38" font-size="16" fill="#FFFFFF">🤖</text>
          <text x="16" y="74" font-size="11" font-weight="bold">AI Book Oracle</text>
          <text x="16" y="92" font-size="8.5" fill="#666666">Semantic search across full abstracts</text>
          <rect x="16" y="110" width="144" height="26" rx="3" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
          <text x="42" y="127" font-size="8.5" font-weight="bold">Consult Oracle →</text>
        </g>

        <!-- Tile 4: Study Seat Map -->
        <g transform="translate(588, 0)">
          <rect width="176" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
          <rect x="16" y="16" width="32" height="32" rx="4" fill="#000000" />
          <text x="24" y="38" font-size="16" fill="#FFFFFF">🪑</text>
          <text x="16" y="74" font-size="11" font-weight="bold">Study Seat Map</text>
          <text x="16" y="92" font-size="8.5" fill="#666666">Live floor availability &amp; focus pods</text>
          <rect x="16" y="110" width="144" height="26" rx="3" fill="#EEEEEE" stroke="#000000" stroke-width="1" />
          <text x="42" y="127" font-size="8.5" font-weight="bold">Find a Seat →</text>
        </g>
      </g>
    </g>

    <!-- 5. FOOTER -->
    <g transform="translate(0, 1315)">
      <rect width="860" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <text x="48" y="48" font-size="11" font-weight="bold">LIBRAMIND SANCTUARY // 404 ARCHIVAL NOT FOUND BLUEPRINT</text>
      <text x="590" y="48" font-size="9.5" fill="#666666">Page 21 of 21 · Balsamiq Low-Fidelity</text>
    </g>
`;

export const BLUEPRINT_PAGES = [
  {
    id: 'home',
    pageNumber: 1,
    name: '1. Landing Sanctuary (Home)',
    shortTitle: 'Landing Sanctuary',
    route: '/home',
    category: 'Public Tier',
    desc: 'Balsamiq low-fidelity wireframe featuring Navigation Bar, Hero Banner, Search Bar, Status Bar, 4-Column Card Grid, Additional Features, and Footer.',
    sections: ['1. Navigation Bar', '2. Hero Banner', '3. Search Bar', '4. Status Bar', '5. 4-Column Card Grid', '6. Additional Features', '7. Footer'],
    svg: wrapPageSVG({
      pageNumber: 1,
      pageTotal: 21,
      pageTitle: 'Landing Sanctuary (Home)',
      pageRoute: '/home',
      activeNavIndex: 0,
      content: HOME_CONTENT
    })
  },
  {
    id: 'catalog',
    pageNumber: 2,
    name: '2. Book Catalog & Multi-Filter Search',
    shortTitle: 'Book Catalog',
    route: '/catalog',
    category: 'Public Tier',
    desc: 'Comprehensive multi-filter search catalog wireframe with category checklists, availability toggles, floor stack filters, 3x2 book card specimen grid, and pagination.',
    sections: ['1. Navigation Bar', '2. Search & Controls Bar', '3. Category Sidebar Filters', '4. Book Results Grid (3x2)', '5. Pagination Bar', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 2,
      pageTotal: 21,
      pageTitle: 'Book Catalog & Filters',
      pageRoute: '/catalog',
      activeNavIndex: 1,
      content: CATALOG_CONTENT
    })
  },
  {
    id: 'book-details',
    pageNumber: 3,
    name: '3. Book Specimen & 4-Tier Shelf Stacks',
    shortTitle: 'Book Details & Stacks',
    route: '/book-details',
    category: 'Public Tier',
    desc: 'Individual book specimen wireframe featuring two-column cover & metadata layout, action buttons, 4-tier physical shelf waypoint navigator, copies ledger, and similar books carousel.',
    sections: ['1. Navigation Bar', '2. Specimen View (Cover [X] & Info)', '3. 4-Tier Shelf Waypoint', '4. Copies Ledger Table', '5. Related Books Carousel', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 3,
      pageTotal: 21,
      pageTitle: 'Book Details & 4-Tier Shelf Map',
      pageRoute: '/book-details',
      activeNavIndex: 1,
      content: BOOK_DETAILS_CONTENT
    })
  },
  {
    id: 'ai-finder',
    pageNumber: 4,
    name: '4. AI Semantic Book Finder',
    shortTitle: 'AI Semantic Finder',
    route: '/ai-finder',
    category: 'Public Tier',
    desc: 'Natural language semantic search wireframe with prompt textarea, curated theme chips, confidence percentage gauge, and 3-column AI match rationale cards.',
    sections: ['1. Navigation Bar', '2. AI Engine Header', '3. Natural Language Prompt Input', '4. Curated Mood Chips', '5. Semantic Confidence Gauge', '6. 3-Column Match Cards', '7. Footer'],
    svg: wrapPageSVG({
      pageNumber: 4,
      pageTotal: 21,
      pageTitle: 'AI Semantic Book Finder',
      pageRoute: '/ai-finder',
      activeNavIndex: 2,
      content: AI_FINDER_CONTENT
    })
  },
  {
    id: 'seats',
    pageNumber: 5,
    name: '5. Study Seat & Focus Pod Map',
    shortTitle: 'Study Pod Map',
    route: '/seats',
    category: 'Public Tier',
    desc: 'Interactive study seat reservation wireframe with date & slot pickers, 4-state seat legend, 4-zone floor layout (Quiet Pods, Collaborative Hub, Window Pods, Carrels), and confirmation drawer.',
    sections: ['1. Navigation Bar', '2. Seat Booking Controls & Slots', '3. Seat Status Legend', '4. 4-Zone Sanctuary Floor Plan', '5. Reservation Confirmation Drawer', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 5,
      pageTotal: 21,
      pageTitle: 'Study Seat & Focus Pod Map',
      pageRoute: '/seats',
      activeNavIndex: 3,
      content: SEATS_CONTENT
    })
  },
  {
    id: 'compare',
    pageNumber: 6,
    name: '6. Multi-Book Comparison Matrix',
    shortTitle: 'Book Comparison Matrix',
    route: '/compare',
    category: 'Public Tier',
    desc: 'Side-by-side comparison matrix wireframe comparing up to 3 book specimens across 9 parameters: cover, title, genre, page volume, shelf waypoint, loan duration, status, and community ratings.',
    sections: ['1. Navigation Bar', '2. Comparison Controls', '3. 9-Row Side-by-Side Matrix', '4. Direct Dispatch Actions', '5. Footer'],
    svg: wrapPageSVG({
      pageNumber: 6,
      pageTotal: 21,
      pageTitle: 'Multi-Book Comparison Matrix',
      pageRoute: '/compare',
      activeNavIndex: 4,
      content: COMPARE_CONTENT
    })
  },
  {
    id: 'visit-planner',
    pageNumber: 7,
    name: '7. Intelligent Library Visit Planner',
    shortTitle: 'Visit Planner',
    route: '/visit-planner',
    category: 'Public Tier',
    desc: 'Step-by-step physical visit planner wireframe with visit intent selector, book pickup checklist, 5-point optimal floor route map, and printable visit itinerary slip.',
    sections: ['1. Navigation Bar', '2. Visit Intent Selector (3 Cards)', '3. Pickup Volumes Checklist', '4. Optimal Floor Waypoint Path', '5. Printable Itinerary Slip', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 7,
      pageTotal: 21,
      pageTitle: 'Library Visit Planner & Route',
      pageRoute: '/visit-planner',
      activeNavIndex: 5,
      content: VISIT_PLANNER_CONTENT
    })
  },
  {
    id: 'dashboard',
    pageNumber: 8,
    name: '8. Student & Member Sanctuary Hub',
    shortTitle: 'Member Hub',
    route: '/dashboard',
    category: 'Member Tier',
    desc: 'Personal reading sanctuary hub wireframe featuring student profile header, hub view tabs, 4 KPI activity cards, currently borrowed books with return/renew controls, hold queue rank, and pod booking.',
    sections: ['1. Navigation Bar (Member Hub Active)', '2. Member Profile Header', '3. Hub Views & 4 KPI Cards', '4. Currently Borrowed Books', '5. Active Hold Queues & Pod Booking', '6. Wishlist Strip', '7. Footer'],
    svg: wrapPageSVG({
      pageNumber: 8,
      pageTotal: 21,
      pageTitle: 'Student Sanctuary Hub',
      pageRoute: '/dashboard',
      activeNavIndex: 6,
      content: DASHBOARD_CONTENT
    })
  },
  {
    id: 'librarian',
    pageNumber: 9,
    name: '9. Librarian Circulation & Barcode Desk',
    shortTitle: 'Librarian Desk',
    route: '/librarian',
    category: 'Staff Tier',
    desc: 'Staff circulation desk wireframe with operation tabs, barcode input & camera scanner viewfinder [X], student ID lookup & fine check, 14-day checkout dispatcher, and daily audit ledger.',
    sections: ['1. Navigation Bar (Staff Active)', '2. Desk Operations Tab Bar', '3. Barcode Scanner Station [X]', '4. Student Verification Card', '5. Checkout Dispatcher', '6. Today\'s Circulation Ledger', '7. Footer'],
    svg: wrapPageSVG({
      pageNumber: 9,
      pageTotal: 21,
      pageTitle: 'Librarian Circulation Desk',
      pageRoute: '/librarian',
      activeNavIndex: 6,
      content: LIBRARIAN_CONTENT
    })
  },
  {
    id: 'admin',
    pageNumber: 10,
    name: '10. Administrator Central Control Console',
    shortTitle: 'Admin Console',
    route: '/admin',
    category: 'Admin Tier',
    desc: 'Central administrator control wireframe with admin operation tabs, 4 vital system health metrics, user role management & elevation table, rapid cataloging actions, and security audit log stream.',
    sections: ['1. Navigation Bar (Admin Shield)', '2. Admin Console Tabs', '3. System Vital Health Cards', '4. User Role Management Table', '5. Cataloging Action Triggers', '6. Security Audit Log Stream', '7. Footer'],
    svg: wrapPageSVG({
      pageNumber: 10,
      pageTotal: 21,
      pageTitle: 'Administrator Central Control',
      pageRoute: '/admin',
      activeNavIndex: 6,
      content: ADMIN_CONTENT
    })
  },
  {
    id: 'analytics',
    pageNumber: 11,
    name: '11. Circulation Analytics & Demand Forecasting',
    shortTitle: 'Circulation Analytics',
    route: '/analytics',
    category: 'Admin Tier',
    desc: 'Operational circulation analytics wireframe with KPI cards, 12-month loan velocity line-graph [X], popular categories horizontal bar chart, and hourly seat demand heatmap.',
    sections: ['1. Navigation Bar', '2. Analytics Date Controls', '3. Key KPI Metric Cards', '4. 12-Month Circulation Line Graph [X]', '5. Most Borrowed Categories Bar Chart', '6. Hourly Seat Occupancy Heatmap', '7. Footer'],
    svg: wrapPageSVG({
      pageNumber: 11,
      pageTotal: 21,
      pageTitle: 'Circulation Analytics',
      pageRoute: '/analytics',
      activeNavIndex: 6,
      content: ANALYTICS_CONTENT
    })
  },
  {
    id: 'login',
    pageNumber: 12,
    name: '12. Reader & Staff Authentication Portal',
    shortTitle: 'Authentication Portal',
    route: '/login',
    category: 'Public Tier',
    desc: 'Authentication and onboarding wireframe with two-column layout: left branding illustration box [X] & 4 feature checklist items; right card with sign-in/register tabs, form inputs, and 1-click role demo switchers.',
    sections: ['1. Navigation Bar', '2. Branding Illustration Box [X]', '3. Feature Checklist', '4. Sign In / Register Tabbed Card', '5. Form Fields (Email, Password, Remember)', '6. 1-Click Demo Role Switcher', '7. Footer'],
    svg: wrapPageSVG({
      pageNumber: 12,
      pageTotal: 21,
      pageTitle: 'Authentication Portal',
      pageRoute: '/login',
      activeNavIndex: 0,
      content: LOGIN_CONTENT
    })
  },
  {
    id: 'forgot-password',
    pageNumber: 13,
    name: '13. Password Recovery & Security Reset Portal',
    shortTitle: 'Password Recovery',
    route: '/forgot-password',
    category: 'Public Tier',
    desc: 'Cryptographic account recovery wireframe featuring single-use SHA-256 token verification, rate-limit protection, account enumeration defense, and secure new password form.',
    sections: ['1. Navigation Bar', '2. Recovery Header & Notice', '3. Email Dispatch Card', '4. Rate Limiting & Verification Feedback', '5. 3-Step Security Token Lifecycle Flow', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 13,
      pageTotal: 21,
      pageTitle: 'Password Recovery Portal',
      pageRoute: '/forgot-password',
      activeNavIndex: 0,
      content: FORGOT_PASSWORD_CONTENT
    })
  },
  {
    id: 'reservations',
    pageNumber: 14,
    name: '14. Book Reservations & Waiting List Queue Hub',
    shortTitle: 'Book Reservations Hub',
    route: '/reservations',
    category: 'Member Tier',
    desc: 'Dedicated circulation hold & waiting list queue hub wireframe with 4 status KPI cards, status filter tabs, active queue rank indicators, 48-hour front-desk pickup countdown, and cancel/claim triggers.',
    sections: ['1. Navigation Bar', '2. Reservations Header & Actions', '3. 4-Column Queue KPI Cards', '4. Status Filter Tabs & Search Bar', '5. Active Hold & Queue Cards (Ready, Waiting, Completed)', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 14,
      pageTotal: 21,
      pageTitle: 'Book Reservations & Queue Hub',
      pageRoute: '/reservations',
      activeNavIndex: 6,
      content: RESERVATIONS_CONTENT
    })
  },
  {
    id: 'register',
    pageNumber: 15,
    name: '15. Scholar & Student Registration Portal',
    shortTitle: 'Scholar Registration',
    route: '/register',
    category: 'Public Tier',
    desc: 'New patron folio enrollment wireframe with full credentials input, department selector, reading interest tag pills, Continue with GitHub SSO, and 4-step onboarding lifecycle diagram.',
    sections: ['1. Navigation Bar', '2. Registration Header', '3. Enrollment Form & Reading Interest Pills', '4. GitHub SSO & Policy Agreement', '5. 4-Step Registration to Access Flow', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 15,
      pageTotal: 21,
      pageTitle: 'Scholar Registration Portal',
      pageRoute: '/register',
      activeNavIndex: 0,
      content: REGISTER_CONTENT
    })
  },
  {
    id: 'about',
    pageNumber: 16,
    name: '16. About LibraMind Sanctuary & Philosophy',
    shortTitle: 'About & Sanctuary Vision',
    route: '/about',
    category: 'Public Tier',
    desc: 'Institutional vision & philosophy wireframe featuring architectural atrium illustration [X], three core pillars, four benchmark metrics counters, and Board of Curators faculty grid.',
    sections: ['1. Navigation Bar', '2. About Hero & Mission', '3. Sanctuary Mission & Pillars', '4. Archive Benchmarks (120k+ Volumes)', '5. Board of Curators & Faculty', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 16,
      pageTotal: 21,
      pageTitle: 'About LibraMind Sanctuary',
      pageRoute: '/about',
      activeNavIndex: 0,
      content: ABOUT_CONTENT
    })
  },
  {
    id: 'contact',
    pageNumber: 17,
    name: '17. Help Center & Circulation Desk',
    shortTitle: 'Circulation Help Desk',
    route: '/contact',
    category: 'Public Tier',
    desc: 'Patron assistance and circulation help desk wireframe with three contact modality cards, interactive inquiry dispatch ticket form, and FAQ accordion.',
    sections: ['1. Navigation Bar', '2. Help Desk Header', '3. Contact Channels (Circulation, Reference, IT)', '4. Dispatch Intake Form', '5. FAQ Accordion', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 17,
      pageTotal: 21,
      pageTitle: 'Circulation Help Desk',
      pageRoute: '/contact',
      activeNavIndex: 0,
      content: CONTACT_CONTENT
    })
  },
  {
    id: 'terms',
    pageNumber: 18,
    name: '18. Library Code of Conduct & Policies',
    shortTitle: 'Borrowing Code & Policies',
    route: '/terms',
    category: 'Public Tier',
    desc: 'Official library borrowing rules and circulation charter wireframe with patron tier allowances table, reservation queue protocols, and silent study etiquette.',
    sections: ['1. Navigation Bar', '2. Charter Header', '3. Circulation Matrix Table', '4. Reservation Hold & Queue Protocols (§1)', '5. Sanctuary Code & Study Ethics (§2)', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 18,
      pageTotal: 21,
      pageTitle: 'Borrowing Code & Policies',
      pageRoute: '/terms',
      activeNavIndex: 0,
      content: TERMS_CONTENT
    })
  },
  {
    id: 'notifications',
    pageNumber: 19,
    name: '19. Patron Notice Center & Dispatches',
    shortTitle: 'Patron Notice Center',
    route: '/notifications',
    category: 'Member Tier',
    desc: 'Central patron notice & dispatch wireframe with status filter pills, urgent due date countdown cards, reservation hold ready pick-up passes, and delivery preference toggles.',
    sections: ['1. Navigation Bar', '2. Notice Header', '3. Filter Controls (Due Dates, Holds, Broadcasts)', '4. Dispatch Feed Cards', '5. Preference Toggles', '6. Footer'],
    svg: wrapPageSVG({
      pageNumber: 19,
      pageTotal: 21,
      pageTitle: 'Patron Notice Center',
      pageRoute: '/notifications',
      activeNavIndex: 0,
      content: NOTIFICATIONS_CONTENT
    })
  },
  {
    id: 'reset-password',
    pageNumber: 20,
    name: '20. Security Password Reset Portal',
    shortTitle: 'Password Reset Portal',
    route: '/reset-password',
    category: 'Security Tier',
    desc: 'Cryptographic reset authentication wireframe featuring token validation status badge, new password inputs with eye toggles, 100% password complexity gauge, and automated audit trail card.',
    sections: ['1. Navigation Bar', '2. Security Reset Header', '3. Reset Form Card & Strength Meter', '4. Security Audit Trail Callout', '5. Footer'],
    svg: wrapPageSVG({
      pageNumber: 20,
      pageTotal: 21,
      pageTitle: 'Security Password Reset Portal',
      pageRoute: '/reset-password',
      activeNavIndex: 0,
      content: RESET_PASSWORD_PAGE_CONTENT
    })
  },
  {
    id: 'not-found',
    pageNumber: 21,
    name: '21. Historical Archive Not Found 404',
    shortTitle: '404 Folio Not Found',
    route: '/not-found',
    category: 'Utility Tier',
    desc: 'Classical 404 Folio Unresolved error wireframe with missing manuscript [X] bookplate illustration, rescue search input, and four recovery hub shortcut tiles.',
    sections: ['1. Navigation Bar', '2. 404 Status Header', '3. Missing Folio Illustration & Search Bar', '4. Rescue Hub Tiles (Home, Catalog, Oracle, Seats)', '5. Footer'],
    svg: wrapPageSVG({
      pageNumber: 21,
      pageTotal: 21,
      pageTitle: '404 Folio Not Found',
      pageRoute: '/not-found',
      activeNavIndex: 0,
      content: NOT_FOUND_CONTENT
    })
  }
];

// Alias for Home Wireframe
export const DESIGN_THINKING_SVG = BLUEPRINT_PAGES[0].svg;

// --------------------------------------------------------------------------------
// EXPORT & DOWNLOAD HELPERS
// --------------------------------------------------------------------------------

// Helper: Download single page SVG
export function downloadPageSVG(pageId) {
  const page = BLUEPRINT_PAGES.find(p => p.id === pageId) || BLUEPRINT_PAGES[0];
  const blob = new Blob([page.svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `LibraMind-Blueprint-${page.id}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

// Helper: Download single page PNG
export function downloadPagePNG(pageId) {
  const page = BLUEPRINT_PAGES.find(p => p.id === pageId) || BLUEPRINT_PAGES[0];
  const blob = new Blob([page.svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 920;
    canvas.height = 1520;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob((pngBlob) => {
      const pngUrl = URL.createObjectURL(pngBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `LibraMind-Blueprint-${page.id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');
  };

  img.src = url;
}

// Helper: Convert an SVG string to a perfectly scaling thumbnail
export function getThumbnailSVG(svg) {
  if (!svg) return '';
  return svg.replace(
    /<svg\b([^>]*)>/i,
    (match, attrs) => {
      const cleanAttrs = attrs
        .replace(/\bstyle="[^"]*"/gi, '')
        .replace(/\bwidth="[^"]*"/gi, '')
        .replace(/\bheight="[^"]*"/gi, '')
        .replace(/\bpreserveAspectRatio="[^"]*"/gi, '')
        .trim();
      return `<svg ${cleanAttrs} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="max-width: 100%; max-height: 100%; width: auto; height: 100%; aspect-ratio: 920 / 1520; display: block; margin: 0 auto; pointer-events: none; background-color: #FFFFFF;">`;
    }
  );
}

// In-Memory Pure JS ZIP Builder for Browser Downloads
function createZipBuffer(files) {
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[i] = c;
  }
  function crc32(bytes) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    return (crc ^ (-1)) >>> 0;
  }
  const encoder = new TextEncoder();
  const fileEntries = files.map(f => {
    const nameBytes = encoder.encode(f.name);
    const dataBytes = typeof f.content === 'string' ? encoder.encode(f.content) : f.content;
    const crc = crc32(dataBytes);
    return { nameBytes, dataBytes, crc, size: dataBytes.length };
  });

  const localHeaders = [];
  const cdEntries = [];
  let offset = 0;

  for (const f of fileEntries) {
    const lh = new Uint8Array(30 + f.nameBytes.length + f.dataBytes.length);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0, true);
    dv.setUint16(8, 0, true); // Stored (no compression)
    dv.setUint16(10, 0, true);
    dv.setUint16(12, 0, true);
    dv.setUint32(14, f.crc, true);
    dv.setUint32(18, f.size, true);
    dv.setUint32(22, f.size, true);
    dv.setUint16(26, f.nameBytes.length, true);
    dv.setUint16(28, 0, true);
    lh.set(f.nameBytes, 30);
    lh.set(f.dataBytes, 30 + f.nameBytes.length);
    localHeaders.push(lh);

    const cd = new Uint8Array(46 + f.nameBytes.length);
    const cdv = new DataView(cd.buffer);
    cdv.setUint32(0, 0x02014b50, true);
    cdv.setUint16(4, 20, true);
    cdv.setUint16(6, 20, true);
    cdv.setUint16(8, 0, true);
    cdv.setUint16(10, 0, true);
    cdv.setUint16(12, 0, true);
    cdv.setUint16(14, 0, true);
    cdv.setUint32(16, f.crc, true);
    cdv.setUint32(20, f.size, true);
    cdv.setUint32(24, f.size, true);
    cdv.setUint16(28, f.nameBytes.length, true);
    cdv.setUint16(30, 0, true);
    cdv.setUint16(32, 0, true);
    cdv.setUint16(34, 0, true);
    cdv.setUint16(36, 0, true);
    cdv.setUint32(38, 0, true);
    cdv.setUint32(42, offset, true);
    cd.set(f.nameBytes, 46);
    cdEntries.push(cd);

    offset += lh.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const cd of cdEntries) cdSize += cd.length;

  const eocd = new Uint8Array(22);
  const edv = new DataView(eocd.buffer);
  edv.setUint32(0, 0x06054b50, true);
  edv.setUint16(4, 0, true);
  edv.setUint16(6, 0, true);
  edv.setUint16(8, fileEntries.length, true);
  edv.setUint16(10, fileEntries.length, true);
  edv.setUint32(12, cdSize, true);
  edv.setUint32(16, cdOffset, true);
  edv.setUint16(20, 0, true);

  const totalLength = offset + cdSize + 22;
  const out = new Uint8Array(totalLength);
  let pos = 0;
  for (const lh of localHeaders) { out.set(lh, pos); pos += lh.length; }
  for (const cd of cdEntries) { out.set(cd, pos); pos += cd.length; }
  out.set(eocd, pos);
  return out;
}

// Batch Download 1: All 12 Blueprints as a single .ZIP package
export function downloadAllBlueprintsZIP() {
  const link = document.createElement('a');
  link.href = '/LibraMind_Complete_Blueprints_Offline_Bundle.zip';
  link.download = 'LibraMind_Complete_Blueprints_Offline_Bundle.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return;

  const readmeText = `========================================================================
LIBRAMIND LMS - DESIGN THINKING UI WIREFRAME BLUEPRINT SPECIFICATION
========================================================================
Total Pages: 14
Format: Scalable Vector Graphics (.SVG) - Balsamiq Low-Fidelity Hand-Drawn Style
Canvas Dimensions: 920px x 1520px (Portrait - Standard Word Document Ratio)

SPECIFICATIONS INCLUDED IN THIS PACKAGE:
01. Page 1:  Landing Sanctuary (Home) - [Route: /]
02. Page 2:  Book Catalog & Multi-Filter Search - [Route: /catalog]
03. Page 3:  Book Specimen & 4-Tier Shelf Stacks - [Route: /books/:id]
04. Page 4:  AI Semantic Book Matcher & Mood Finder - [Route: /ai-finder]
05. Page 5:  Interactive Study Seat & Focus Pod Map - [Route: /seats]
06. Page 6:  Multi-Book Comparison Matrix - [Route: /compare]
07. Page 7:  Intelligent Library Visit Planner - [Route: /visit-planner]
08. Page 8:  Student Sanctuary Hub - [Route: /dashboard]
09. Page 9:  Librarian Circulation Desk - [Route: /librarian]
10. Page 10: Administrator Central Control Console - [Route: /admin]
11. Page 11: Circulation Velocity & Demand Forecasting - [Route: /analytics]
12. Page 12: Authentication & Onboarding Portal - [Route: /login]
13. Page 13: Password Recovery & Security Reset Portal - [Route: /forgot-password]
14. Page 14: Book Reservations & Waiting List Queue Hub - [Route: /reservations]

DESIGN THINKING WIREFRAME RULES APPLIED:
1. Pure black-and-white low-fidelity wireframe styling with faint dot-grid coordinate canvas.
2. All photography, book covers, user avatars, and map viewports replaced with rectangular placeholder boxes containing [X].
3. All descriptive body text replaced with rhythmic horizontal placeholder lines.
4. Readable section headings and labels preserved for structural evaluation.
5. Standard portrait orientation suitable for direct drag-and-drop insertion into Microsoft Word reports.
========================================================================
`;

  const files = BLUEPRINT_PAGES.map((page, idx) => ({
    name: `${String(idx + 1).padStart(2, '0')}_LibraMind_${page.shortTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Blueprint.svg`,
    content: page.svg
  }));

  files.push({
    name: 'README_Design_Thinking_Specifications.txt',
    content: readmeText
  });

  const zipBytes = createZipBuffer(files);
  const blob = new Blob([zipBytes], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'LibraMind_All_14_UI_Wireframe_Blueprints.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Batch Download 2: Sequentially download all 12 SVG vector files
export function downloadAllBlueprintsSVG() {
  BLUEPRINT_PAGES.forEach((page, idx) => {
    setTimeout(() => {
      downloadPageSVG(page.id);
    }, idx * 180);
  });
}

// Batch Download 3: Sequentially download all 12 PNG image files
export function downloadAllBlueprintsPNG() {
  BLUEPRINT_PAGES.forEach((page, idx) => {
    setTimeout(() => {
      downloadPagePNG(page.id);
    }, idx * 250);
  });
}

// Backward compatibility helpers
export function downloadDesignThinkingSVG() {
  downloadPageSVG('home');
}

export function downloadDesignThinkingPNG() {
  downloadPagePNG('home');
}

export function downloadDesignThinkingJPG() {
  const link = document.createElement('a');
  link.href = '/libramind-design-thinking-wireframe.jpg';
  link.download = 'LibraMind-Design-Thinking-Wireframe.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper: Print / Save single page as PDF (Word Ready)
export function printSingleBlueprint(pageId) {
  const page = BLUEPRINT_PAGES.find(p => p.id === pageId) || BLUEPRINT_PAGES[0];
  const printWindow = window.open('', '_blank', 'width=1000,height=900');
  if (!printWindow) {
    alert('Please allow popups to print/save the wireframe blueprint as PDF.');
    return;
  }
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>LibraMind Blueprint — ${page.name}</title>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { margin: 0; padding: 24px; background: #FFFFFF; font-family: sans-serif; text-align: center; }
          .no-print {
            background: #F4F4F4;
            padding: 14px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
          }
          .svg-container { max-width: 900px; margin: 0 auto; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-radius: 8px; overflow: hidden; }
          .svg-container svg { width: 100%; height: auto; display: block; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
            .svg-container { box-shadow: none; border-radius: 0; }
            @page { size: portrait; margin: 10mm; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <div><strong>Design Thinking UI Blueprint (${page.name}):</strong> Select Destination: <em>Save as PDF</em> (Portrait) to export for Word document.</div>
          <button onclick="window.print()" style="background: #000; color: #FFF; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Print / Save as PDF
          </button>
        </div>
        <div class="svg-container">${page.svg}</div>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

// Legacy alias
export function printDesignThinkingWireframe() {
  printSingleBlueprint('home');
}

// Helper: Print ALL 12 Blueprints as a multi-page PDF document for Word
export function printAllBlueprints() {
  const printWindow = window.open('', '_blank', 'width=1100,height=950');
  if (!printWindow) {
    alert('Please allow popups in your browser to print / save all wireframe blueprints as PDF.');
    return;
  }

  const pagesMarkup = BLUEPRINT_PAGES.map((page, index) => `
    <div class="print-page-sheet">
      <div class="print-meta-header">
        <span class="left">LIBRAMIND LMS · DESIGN THINKING WIREFRAME SPECIFICATION</span>
        <span class="right">PAGE ${index + 1} OF ${BLUEPRINT_PAGES.length}: ${page.name.toUpperCase()} · PORTRAIT</span>
      </div>
      <div class="print-svg-wrapper">${page.svg}</div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>LibraMind Complete 12-Page UI Wireframe Portfolio (Word Ready)</title>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background-color: #E6E6E6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 24px;
            color: #111111;
          }
          .floating-print-bar {
            position: sticky;
            top: 16px;
            z-index: 1000;
            max-width: 960px;
            margin: 0 auto 24px;
            background: #FFFFFF;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.18);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            border: 1px solid #D0D0D0;
          }
          .floating-print-bar strong {
            font-size: 15px;
            color: #111111;
            display: block;
          }
          .floating-print-bar span {
            font-size: 12px;
            color: #555555;
          }
          .btn-print {
            background: #000000;
            color: #FFFFFF;
            border: none;
            padding: 12px 26px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            transition: all 0.15s ease;
          }
          .btn-print:hover {
            background: #333333;
          }
          .print-page-sheet {
            max-width: 920px;
            margin: 0 auto 36px;
            background: #FFFFFF;
            border-radius: 6px;
            box-shadow: 0 4px 18px rgba(0,0,0,0.12);
            overflow: hidden;
            page-break-after: always;
            break-after: page;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .print-meta-header {
            padding: 10px 18px;
            background: #FAFAFA;
            border-bottom: 1px solid #E0E0E0;
            display: flex;
            justify-content: space-between;
            font-size: 10.5px;
            font-weight: 700;
            color: #444444;
            letter-spacing: 0.04em;
          }
          .print-svg-wrapper {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
          }
          .print-svg-wrapper svg {
            width: 100%;
            height: auto;
            max-height: 94vh;
            display: block;
          }
          @media print {
            body {
              background: #FFFFFF;
              padding: 0;
            }
            .floating-print-bar {
              display: none !important;
            }
            .print-page-sheet {
              margin: 0;
              box-shadow: none;
              border-radius: 0;
              page-break-after: always !important;
              break-after: page !important;
              height: 98vh;
              display: flex;
              flex-direction: column;
            }
            .print-svg-wrapper {
              flex: 1;
              padding: 0;
            }
            .print-svg-wrapper svg {
              max-height: 92vh;
            }
            @page {
              size: portrait;
              margin: 8mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="floating-print-bar">
          <div>
            <strong>Complete 21-Page UI Blueprint Specification (Word Ready)</strong>
            <span>Click the button to open print dialog. Choose destination: <em>Save as PDF (Portrait)</em> to export all 21 pages.</span>
          </div>
          <button class="btn-print" onclick="window.print()">
            🖨️ Print / Save All 21 Pages as PDF
          </button>
        </div>
        ${pagesMarkup}
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
