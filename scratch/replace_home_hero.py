from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'pages' / 'Home.jsx'
text = path.read_text(encoding='utf-8')

start_marker = '      {/* ═══════════════════════════════════════════════════════════════ */}\n      {/* 1. EDITORIAL HERO SECTION (ASYMMETRIC TWO-COLUMN SPREAD)         */}'
end_marker = '      {/* ═══════════════════════════════════════════════════════════════ */}\n      {/* 2. STATISTICAL BENCHMARKS STRIP'

start = text.index(start_marker)
end = text.index(end_marker, start)

new_block = '''      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. BAUHAUS HERO — GEOMETRIC EDITORIAL COMPOSITION               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bh-hero" aria-labelledby="bh-hero-title">
        <div className="container">
          <div className="bh-hero__grid">
            <div className="bh-rise">
              <span className="bh-kicker">Staatliches Archiv · Vol. 01 / 2026</span>
              <h1 id="bh-hero-title" className="bh-hero__title">
                Knowledge, <span>constructed.</span>
              </h1>
              <p className="bh-hero__lead">
                LibraMind is a modern digital library built on clarity: 120,000+ indexed volumes,
                intelligent semantic discovery, and a physical shelf location for every idea.
              </p>

              <form className="bh-hero__search" onSubmit={handleHeroSearch} role="search">
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 14px', color: 'var(--bh-ink)' }}>
                  <Search size={20} strokeWidth={2.2} />
                </span>
                <input
                  type="text"
                  aria-label="Search the library catalog"
                  placeholder="Search title, author, subject…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Explore Books <ArrowRight size={15} /></button>
              </form>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => onNavigate(user ? 'catalog' : 'register')}
                  className="btn btn-secondary btn-lg"
                >
                  {user ? 'Open Catalog' : 'Join the Library'} <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const targetId = user ? 'featured-week' : 'library-rules';
                    const el = document.getElementById(targetId);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-outline btn-lg"
                >
                  {user ? 'Discover More' : 'How It Works'}
                </button>
              </div>

              <div className="bh-hero__topics" style={{ marginTop: '28px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--bh-ink)' }}>
                  Curated fields /
                </span>
                {['Classics', 'Philosophy', 'Artificial Intelligence', 'Poetry'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (user) {
                        onNavigate('catalog', { category: tag });
                      } else {
                        const el = document.getElementById('categories-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bh-hero__art bh-rise bh-rise--2">
              <span className="bh-hero__art-square" />
              <span className="bh-hero__art-circle" />
              <span className="bh-hero__art-line" />
              <div className="bh-cover-stack">
                {heroCovers.slice(0, 3).map((book, idx) => (
                  <div
                    key={`${book.id || 'cover'}-${idx}`}
                    className={`bh-cover bh-cover--${['back', 'mid', 'front'][idx]}`}
                    onClick={user && idx === 0 ? () => onViewBookDetails(book.id) : undefined}
                    style={user && idx === 0 ? { cursor: 'pointer' } : undefined}
                  >
                    <img
                      src={heroCoverSrc(book)}
                      alt={book.title || 'Featured library volume'}
                      onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                    />
                  </div>
                ))}
              </div>
              <span className="bh-hero__badge">Form follows knowledge · 120K+ volumes</span>
            </div>
          </div>
        </div>
      </section>

'''

text = text[:start] + new_block + text[end:]
path.write_text(text, encoding='utf-8')
print('Home hero replaced')
