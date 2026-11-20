import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import VisualBlueprintModal from '../components/VisualBlueprintModal';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';
import {
  BLUEPRINT_PAGES,
  getThumbnailSVG,
  downloadPageSVG,
  downloadPagePNG,
  downloadAllBlueprintsZIP,
  downloadAllBlueprintsSVG,
  downloadAllBlueprintsPNG,
  printSingleBlueprint,
  printAllBlueprints
} from '../data/visualBlueprints';
import {
  Search,
  MapPin,
  Armchair,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  Heart,
  Sparkles,
  Clock,
  TrendingUp,
  Download,
  FileCode,
  CheckCircle2,
  Bookmark,
  Quote,
  Feather,
  Compass as CompassIcon,
  ChevronRight
} from 'lucide-react';

export default function Home({ onNavigate, onViewBookDetails, onOpenBlueprints }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [seatStats, setSeatStats] = useState({ total: 16, available: 12, occupied: 3 });
  const [memberStats, setMemberStats] = useState({ loans: 0, holds: 0, wishlist: 0 });
  const [loading, setLoading] = useState(true);
  const [showVisualBlueprintModal, setShowVisualBlueprintModal] = useState(false);
  const [selectedBlueprintPage, setSelectedBlueprintPage] = useState('home');
  const [blueprintCategory, setBlueprintCategory] = useState('all');

  useEffect(() => {
    Promise.all([
      api.getBooks({ limit: 16 }),
      api.getSeats()
    ])
      .then(([booksData, seatsData]) => {
        const allBooks = booksData.books || [];
        setFeaturedBooks(allBooks.slice(0, 8));
        setRecentBooks(allBooks.slice(8, 12));
        setTrendingBooks(allBooks.slice(12, 16));
        if (seatsData && seatsData.stats) {
          setSeatStats(seatsData.stats);
        } else if (Array.isArray(seatsData)) {
          const avail = seatsData.filter(s => s.status === 'available').length;
          const occ = seatsData.length - avail;
          setSeatStats({ total: seatsData.length, available: avail, occupied: occ });
        }
      })
      .catch(err => {
        console.error('Home data load error', err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      Promise.all([
        api.getLoans().catch(() => []),
        api.getReservations().catch(() => []),
        api.getWishlist().catch(() => [])
      ]).then(([loansData, resData, wishData]) => {
        const activeL = (loansData || []).filter(l => l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue' || l.is_active);
        const activeR = (resData || []).filter(r => r.status === 'waiting' || r.status === 'ready_for_pickup');
        setMemberStats({
          loans: activeL.length,
          holds: activeR.length,
          wishlist: (wishData || []).length
        });
      });
    }
  }, [user]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog', { q: searchQuery.trim() });
    } else {
      onNavigate('catalog');
    }
  };

  const editorialGenres = [
    { title: 'Classical Literature', slug: 'Classic Literature', desc: 'Homer, Austen, Tolstoy & the enduring Western & Eastern canon', count: '14,200 Volumes' },
    { title: 'Philosophy & Ethics', slug: 'Philosophy', desc: 'Epistemology, existentialism, moral theory & ancient logic', count: '8,400 Volumes' },
    { title: 'Artificial Intelligence', slug: 'Artificial Intelligence', desc: 'Machine cognition, neural architectures & algorithm ethics', count: '6,150 Volumes' },
    { title: 'Novels & Modern Prose', slug: 'Novels & Fiction', desc: 'Booker prize narratives, literary memoirs & contemporary fiction', count: '18,900 Volumes' },
    { title: 'History & Archives', slug: 'History', desc: 'Manuscripts, world civilisations & institutional records', count: '11,300 Volumes' },
    { title: 'Science & Physics', slug: 'Computer Science', desc: 'Theoretical physics, computation & biological discovery', count: '9,800 Volumes' }
  ];

  const literaryAuthors = [
    { name: 'Virginia Woolf', era: '1882 – 1941', focus: 'Modernist Stream of Consciousness', works: 'To the Lighthouse, Mrs Dalloway', query: 'Woolf' },
    { name: 'Jorge Luis Borges', era: '1899 – 1986', focus: 'Infinite Labyrinths & Bibliographic Myth', works: 'Ficciones, The Aleph, Labyrinths', query: 'Borges' },
    { name: 'Alan M. Turing', era: '1912 – 1954', focus: 'Theoretical Computation & AI Foundations', works: 'Computing Machinery and Intelligence', query: 'Turing' },
    { name: 'Fyodor Dostoevsky', era: '1821 – 1881', focus: 'Philosophical Realism & Moral Inquiry', works: 'Crime and Punishment, The Brothers Karamazov', query: 'Dostoevsky' }
  ];

  const bookOfTheWeek = featuredBooks[0] || {
    id: 1,
    title: 'The Architecture of Thought',
    author: 'Eleanor Vane',
    category: 'Philosophy',
    floor: 'Floor 3',
    shelf: 'Stack 14-B',
    publication_year: 1924,
    description: 'A landmark inquiry into the spatial cognition of literary memory, classical libraries, and the relationship between physical architecture and sustained mental focus.'
  };

  // Editorial cover composition for the Bauhaus hero. Uses live covers when
  // available and the built-in geometric SVG covers for guests/offline use.
  const heroCovers = user
    ? [bookOfTheWeek, featuredBooks[1], featuredBooks[2]].filter(Boolean)
    : [
        { id: 1, title: 'The Architecture of Thought', author: 'Eleanor Vane', category: 'Philosophy' },
        { id: 2, title: 'Form & Function', author: 'Walter Gropius', category: 'Design' },
        { id: 3, title: 'Geometry of Mind', author: 'Ada Lovelace', category: 'Computing' }
      ];

  const heroCoverSrc = (book) => book?.cover_image || getOfflineBookCover(book?.title, book?.author, book?.category);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '100vh' }}>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. STATISTICAL BENCHMARKS STRIP                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
        <div className="container">
          <div
            className="stats-strip"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0'
            }}
          >
            {[
              { num: '120,000+', label: 'Total Books Indexed', sub: 'Classified & Dewey Stacked' },
              { num: '6 Disciplines', label: 'Book Categories', sub: 'Classics, Philosophy, AI & more' },
              { num: `${seatStats.available} Available`, label: 'Quiet Study Pods', sub: `Out of ${seatStats.total} carrels` },
              { num: '98.4%', label: 'Patron Scholar Score', sub: 'Community reading & circulation rating' }
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '24px 20px',
                  borderRight: i < 3 ? '1px solid var(--editorial-border)' : 'none'
                }}
              >
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--editorial-text)', lineHeight: 1 }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '6px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--editorial-text-muted)', marginTop: '2px' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 3. SANCTUARY RULES & POLICIES (GUEST TIER) OR BOOKS (MEMBERS)   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {!user ? (
        /* Unauthenticated Visitor Landing Page: Rules, Guidelines & Privacy (No private books or credentials shown) */
        <section
          id="library-rules"
          style={{
            padding: '72px 0',
            borderBottom: '1px solid var(--editorial-border)',
            backgroundColor: 'var(--bauhaus-offwhite)'
          }}
        >
          <div className="container">
            <div style={{ marginBottom: '36px', maxWidth: '780px' }}>
              <span className="editorial-kicker">GOVERNANCE &amp; POLICIES</span>
              <h2 style={{ margin: '0 0 10px', fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)' }}>
                Library Rules &amp; Circulation Code
              </h2>
              <p style={{ margin: 0, color: 'var(--editorial-text-muted)', fontSize: '0.96rem', lineHeight: 1.6 }}>
                LibraMind is dedicated to preserving a quiet academic sanctuary and ensuring equitable, transparent circulation of all physical and digital volumes. All patrons and visitors adhere to our sanctuary charter.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {[
                {
                  ruleNum: '01',
                  title: 'One Physical Copy Rule',
                  badge: 'BORROWING LIMIT',
                  desc: 'Patrons may borrow 1 physical copy per title at any given time (up to 3 concurrent active loans total). Under circulation rules, you cannot hold or check out the same title twice concurrently. Return your copy to borrow it again.'
                },
                {
                  ruleNum: '02',
                  title: '14-Day Loan Period & Renewal',
                  badge: 'CIRCULATION TERM',
                  desc: 'Standard borrowing term is 14 calendar days. If no other scholar has placed an active hold in the waiting queue, 1 renewal (+14 days) is permitted through your Member Folio before the due date.'
                },
                {
                  ruleNum: '03',
                  title: 'Waiting List & 48-Hour Desk Hold',
                  badge: 'FIFO QUEUE',
                  desc: 'When all copies of a book are on loan, join the automated waiting queue. The system strictly respects First-Come, First-Served (FIFO) ordering. Once returned, your copy is held at the desk for 48 hours for immediate pickup.'
                },
                {
                  ruleNum: '04',
                  title: 'Quiet Study Carrel Sanctuary',
                  badge: 'STUDY PODS',
                  desc: 'Carrels and study pods are designated quiet zones for solitary research and deep concentration. Bookings are available in up to 4-hour blocks. Please check in within 15 minutes of scheduled reservation start.'
                },
                {
                  ruleNum: '05',
                  title: 'Courtesy Grace Period & Late Returns',
                  badge: 'OVERDUE POLICY',
                  desc: 'A 24-hour courtesy grace period follows the due date. A modest courtesy late fee of $1.00/day applies to overdue items to maintain circulation flow. Accounts with overdue items cannot place new holds until cleared.'
                },
                {
                  ruleNum: '06',
                  title: 'Patron Privacy & Cryptographic Security',
                  badge: 'DATA PROTECTION',
                  desc: 'Patron passwords and contact numbers are cryptographically salted and hashed with Bcrypt. No private personal details, borrowing records, or security credentials are ever exposed publicly.'
                }
              ].map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--editorial-bg)',
                    padding: '24px 26px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--editorial-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.80rem', fontWeight: 800, color: 'var(--editorial-accent)' }}>
                        RULE № {rule.ruleNum}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', backgroundColor: 'var(--bauhaus-offwhite)', border: '1px solid var(--editorial-border)', borderRadius: '2px', color: 'var(--editorial-text)' }}>
                        {rule.badge}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.24rem', color: 'var(--editorial-text)', margin: '0 0 10px' }}>
                      {rule.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', lineHeight: 1.6, margin: 0 }}>
                      {rule.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Member-Only: Featured Book of the Week */}
          <section id="featured-week" style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)' }}>
            <div className="container">
              <div style={{ marginBottom: '32px' }}>
                <span className="editorial-kicker">CURATORIAL MONOGRAPH</span>
                <h2 style={{ margin: 0 }}>Featured Book of the Week</h2>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bauhaus-offwhite)',
                  border: '1px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '36px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '40px',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div
                  style={{
                    height: '420px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <img
                    src={bookOfTheWeek.cover_image || getOfflineBookCover(bookOfTheWeek.title, bookOfTheWeek.author, bookOfTheWeek.category)}
                    alt={bookOfTheWeek.title}
                    onError={(e) => handleBookCoverError(e, bookOfTheWeek.title, bookOfTheWeek.author, bookOfTheWeek.category)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div>
                  <span className="badge badge-category" style={{ marginBottom: '12px' }}>
                    {bookOfTheWeek.category}
                  </span>
                  <h3 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', marginBottom: '8px', lineHeight: 1.15 }}>
                    {bookOfTheWeek.title}
                  </h3>
                  <p style={{ fontSize: '1.05rem', color: 'var(--editorial-accent)', fontWeight: 600, marginBottom: '20px' }}>
                    By {bookOfTheWeek.author} • First Accessioned {bookOfTheWeek.publication_year}
                  </p>

                  <div className="editorial-pullquote">
                    "{bookOfTheWeek.description || 'A timeless exploration of ideas, human experience, and scientific discipline from the heart of the library archives.'}"
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '24px 0', padding: '16px', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--editorial-text-muted)', display: 'block', fontWeight: 600 }}>Stack Level</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--editorial-text)' }}>{bookOfTheWeek.floor}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--editorial-text-muted)', display: 'block', fontWeight: 600 }}>Archival Shelf</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--editorial-accent)' }}>{bookOfTheWeek.shelf}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onViewBookDetails(bookOfTheWeek.id)}
                      className="btn btn-primary"
                    >
                      <BookOpen size={15} /> Examine Volume Specimen
                    </button>
                    <button
                      onClick={() => onNavigate('catalog')}
                      className="btn btn-outline"
                    >
                      Explore More Titles →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Member-Only: Editor's Picks Grid */}
          <section style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: 'var(--bauhaus-offwhite)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span className="editorial-kicker">RECOMMENDED EDITIONS</span>
                  <h2 style={{ margin: 0 }}>Editor's Picks</h2>
                  <p style={{ margin: '6px 0 0', color: 'var(--editorial-text-muted)', fontSize: '0.94rem' }}>
                    Curated by our senior archivists for historical significance and thought-provoking narrative.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="btn btn-outline btn-sm"
                >
                  View Full Collection →
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                  gap: '24px'
                }}
              >
                {featuredBooks.slice(0, 4).map((book, idx) => (
                  <div key={book.id} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '16px', zIndex: 2, backgroundColor: 'var(--editorial-text)', color: 'var(--bauhaus-offwhite)', padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'var(--font-mono)', borderRadius: '2px' }}>
                      № 0{idx + 1}
                    </div>
                    <BookCard
                      book={book}
                      onViewDetails={onViewBookDetails}
                      onToggleWishlist={() => {}}
                      onToggleCompare={() => onNavigate('compare')}
                      onAddToPlanner={() => onNavigate('visit-planner')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 4. EXPLORE BY GENRE / EDITORIAL TAXONOMY                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="categories-section" style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span className="editorial-kicker">TAXONOMY &amp; GENRES</span>
            <h2 style={{ margin: 0 }}>Explore by Literary Genre</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--editorial-text-muted)' }}>
              Navigate the library through carefully arranged disciplines and subject matter.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}
          >
            {editorialGenres.map((genre, i) => (
              <div
                key={i}
                onClick={() => onNavigate(user ? 'catalog' : 'register', { category: genre.slug })}
                style={{
                  backgroundColor: 'var(--bauhaus-offwhite)',
                  padding: '24px 28px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--editorial-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--editorial-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--editorial-border)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--editorial-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      DISCIPLINE 0{i + 1}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)' }}>
                      {genre.count}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.30rem', color: 'var(--editorial-text)', marginBottom: '8px' }}>
                    {genre.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {genre.desc}
                  </p>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-accent)' }}>
                  {user ? 'Browse Genre Stacks' : 'Explore Category & Register'} <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 6. LITERARY QUOTES BANNER                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '72px 0',
          backgroundColor: 'var(--editorial-green)',
          color: 'var(--bauhaus-offwhite)',
          borderTop: '1px solid var(--editorial-border)',
          borderBottom: '1px solid var(--editorial-border)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <Quote size={32} color="var(--bauhaus-grey)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
          <blockquote
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
              lineHeight: 1.35,
              color: 'var(--bauhaus-offwhite)',
              marginBottom: '18px'
            }}
          >
            "I have always imagined that Paradise will be a kind of a library."
          </blockquote>
          <cite
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--bauhaus-grey)',
              fontStyle: 'normal'
            }}
          >
            — Jorge Luis Borges, <span style={{ opacity: 0.8 }}>Poema de los Dones (1958)</span>
          </cite>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 7. FEATURED AUTHORS                                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: 'var(--bauhaus-offwhite)' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span className="editorial-kicker">LITERARY HERITAGE</span>
            <h2 style={{ margin: 0 }}>Featured Authors &amp; Scholars</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--editorial-text-muted)' }}>
              Explore comprehensive monographs and treatises by influential thinkers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {literaryAuthors.map((author, i) => (
              <div
                key={i}
                onClick={() => onNavigate('catalog', { q: author.query })}
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--editorial-bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--editorial-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--editorial-accent)';
                  e.currentTarget.style.backgroundColor = 'var(--bauhaus-offwhite)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--editorial-border)';
                  e.currentTarget.style.backgroundColor = 'var(--editorial-bg)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--editorial-green)',
                      color: 'var(--bauhaus-offwhite)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.1rem',
                      fontWeight: 700
                    }}
                  >
                    {author.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>{author.name}</h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', fontFamily: 'var(--font-mono)' }}>{author.era}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--editorial-accent)', fontWeight: 600, marginBottom: '6px' }}>
                  {author.focus}
                </div>
                <p style={{ fontSize: '0.80rem', color: 'var(--editorial-text-muted)', margin: 0 }}>
                  Works in Catalog: {author.works}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 8. COMPLETE 21-PAGE WIREFRAME BLUEPRINTS PORTFOLIO              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        id="wireframe-blueprint"
        style={{
          padding: '68px 0',
          backgroundColor: 'var(--editorial-bg-subtle)',
          borderBottom: '1px solid var(--editorial-border)',
          position: 'relative'
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div style={{ maxWidth: '720px' }}>
              <div className="editorial-kicker">
                <Layers size={13} /> Complete 21-Page UI Blueprint Portfolio
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.3rem)', margin: 0 }}>
                Website Architectural Wireframes
              </h2>
              <p style={{ color: 'var(--editorial-text-muted)', fontSize: '0.96rem', marginTop: '8px', marginBottom: 0 }}>
                Clean, low-fidelity orthogonal black-and-white wireframe blueprints for all 21 pages of the LibraMind system.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href="/LibraMind_Complete_21_Architectural_Blueprints.pdf"
                download="LibraMind_Complete_21_Architectural_Blueprints.pdf"
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <Download size={14} /> Download PDF All Pages
              </a>
              <a
                href="/LibraMind_All_In_One_Page_Composite_Blueprint.pdf"
                download="LibraMind_All_In_One_Page_Composite_Blueprint.pdf"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <FileCode size={14} /> 1-Page Composite (PDF)
              </a>
            </div>
          </div>

          {/* Category Tabs for All 21 Blueprints */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '24px',
              borderBottom: '1px solid var(--editorial-border)',
              paddingBottom: '14px'
            }}
          >
            {[
              { id: 'all', label: 'All Blueprints (21)' },
              { id: 'public', label: 'Public Tier (13)' },
              { id: 'member', label: 'Member Tier (3)' },
              { id: 'staff_admin', label: 'Staff & Governance (3)' },
              { id: 'security_util', label: 'Security & Utility (2)' }
            ].map(tab => {
              const isActive = blueprintCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setBlueprintCategory(tab.id)}
                  style={{
                    backgroundColor: isActive ? 'var(--editorial-green)' : 'var(--bauhaus-offwhite)',
                    color: isActive ? 'var(--bauhaus-offwhite)' : 'var(--editorial-text)',
                    border: isActive ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 14px',
                    fontSize: '0.80rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Grid of All Matching Blueprints (Never Missing Any Page) */}
          {(() => {
            const filteredPages = BLUEPRINT_PAGES.filter(p => {
              if (blueprintCategory === 'all') return true;
              if (blueprintCategory === 'public') return p.category === 'Public Tier';
              if (blueprintCategory === 'member') return p.category === 'Member Tier';
              if (blueprintCategory === 'staff_admin') return p.category === 'Staff Tier' || p.category === 'Admin Tier';
              if (blueprintCategory === 'security_util') return p.category === 'Security Tier' || p.category === 'Utility Tier';
              return true;
            });

            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  marginBottom: '28px'
                }}
              >
                {filteredPages.map((page) => (
                  <div
                    key={page.id}
                    style={{
                      backgroundColor: 'var(--bauhaus-offwhite)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--editorial-border)',
                      boxShadow: 'var(--shadow-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                    onClick={() => {
                      if (onOpenBlueprints) onOpenBlueprints(page.id);
                      else {
                        setSelectedBlueprintPage(page.id);
                        setShowVisualBlueprintModal(true);
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.borderColor = 'var(--editorial-accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.borderColor = 'var(--editorial-border)';
                    }}
                  >
                    <div style={{ height: '220px', backgroundColor: 'var(--bauhaus-offwhite)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', overflow: 'hidden' }}>
                      <div
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        dangerouslySetInnerHTML={{ __html: getThumbnailSVG(page.svg) }}
                      />
                    </div>
                    <div style={{ padding: '14px 16px', borderTop: '1px solid var(--editorial-border)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--editorial-accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          PAGE {String(page.pageNumber).padStart(2, '0')} · {page.category}
                        </span>
                        <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--editorial-text-muted)' }}>
                          {page.route}
                        </span>
                      </div>
                      <h4 style={{ margin: '2px 0 8px', fontSize: '0.94rem', color: 'var(--editorial-text)' }}>
                        {page.shortTitle}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--editorial-text-muted)', lineHeight: 1.45, marginBottom: '12px' }}>
                        {page.desc.substring(0, 85)}...
                      </p>
                      <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px dashed var(--editorial-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--editorial-accent)', fontWeight: 700 }}>
                          Inspect Blueprint →
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)' }}>
                          {page.sections.length} Wireframe Sections
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (onOpenBlueprints) onOpenBlueprints('home');
                else {
                  setSelectedBlueprintPage('home');
                  setShowVisualBlueprintModal(true);
                }
              }}
              className="btn btn-outline"
            >
              Open Full 21-Page Interactive Blueprint Viewer →
            </button>
            <a
              href="/LibraMind_Complete_21_Architectural_Blueprints.pdf"
              download="LibraMind_Complete_21_Architectural_Blueprints.pdf"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <Download size={16} /> Download PDF All Pages
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 9. ABOUT LIBRAMIND                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: 'var(--bauhaus-offwhite)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center'
            }}
          >
            <div>
              <span className="editorial-kicker">INSTITUTIONAL CHARTER</span>
              <h2 style={{ marginBottom: '18px' }}>About the LibraMind Project</h2>
              <p style={{ lineHeight: 1.7, marginBottom: '16px' }}>
                LibraMind was founded to dismantle the artificial divide between historic library sanctuaries and modern digital technology. We believe deep focus flourishes in tranquil, beautiful environments where natural materials meet rigorous academic indexing.
              </p>
              <p style={{ lineHeight: 1.7, marginBottom: '24px' }}>
                Every book in our collection is indexed physically by floor, rack, and shelf coordinate, and digitally mapped using mathematical TF-IDF semantic relevance.
              </p>
              <button
                onClick={() => onNavigate('about')}
                className="btn btn-outline"
              >
                Read Full Vision &amp; Architecture →
              </button>
            </div>

            <div
              style={{
                backgroundColor: 'var(--editorial-bg)',
                border: '1px solid var(--editorial-border)',
                padding: '32px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '14px' }}>
                Sanctuary Core Commitments
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.90rem' }}>
                  <CheckCircle2 size={16} color="var(--editorial-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>100% Offline Access:</strong> Vector book covers and SQLite records operate locally without remote CDN dependencies.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.90rem' }}>
                  <CheckCircle2 size={16} color="var(--editorial-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Equitable Circulation:</strong> Automated 48-hour hold queue transitions prevent forgotten physical copies.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.90rem' }}>
                  <CheckCircle2 size={16} color="var(--editorial-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Cryptographic Security:</strong> Salted Bcrypt password security, role-based protection, and patron audit trails.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Blueprint Modal */}
      <VisualBlueprintModal
        isOpen={showVisualBlueprintModal}
        onClose={() => setShowVisualBlueprintModal(false)}
        initialPage={selectedBlueprintPage}
      />
    </div>
  );
}
  