import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import VisualBlueprintModal from '../components/VisualBlueprintModal';
import { getOfflineBookCover } from '../utils/offlineCovers';
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

export default function Home({ onNavigate, onViewBookDetails }) {
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

  useEffect(() => {
    Promise.all([
      api.getBooks({ limit: 8, sort: 'popularity' }),
      api.getBooks({ limit: 4, sort: 'recent' }),
      api.getBooks({ category: 'Novels & Fiction', limit: 4 }),
      api.getSeats()
    ])
      .then(([popData, recentData, trendData, seatsData]) => {
        setFeaturedBooks(popData.books || []);
        setRecentBooks(recentData.books || []);
        setTrendingBooks(trendData.books || []);
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
        const activeL = (loansData || []).filter(l => l.status === 'active' || l.status === 'overdue');
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

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '100vh' }}>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. EDITORIAL HERO SECTION (ASYMMETRIC TWO-COLUMN SPREAD)         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '48px 0 64px',
          borderBottom: '1px solid var(--editorial-border)',
          position: 'relative'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Headline, Narrative & Search */}
            <div>
              <div className="editorial-kicker">
                <Feather size={14} /> Vol. XXIV · The Literary Review &amp; Archives · Autumn Edition
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)',
                  lineHeight: 1.08,
                  marginBottom: '20px',
                  color: 'var(--editorial-text)'
                }}
              >
                Where Stories Find Their Home.
              </h1>

              <p
                style={{
                  fontSize: '1.12rem',
                  lineHeight: 1.68,
                  color: 'var(--editorial-text-muted)',
                  maxWidth: '560px',
                  marginBottom: '32px'
                }}
              >
                An elevated digital library sanctuary combining literary curation, research stacks, quiet study pods, and neural semantic discovery. Explore over 120,000 indexed physical volumes and rare academic works.
              </p>

              {/* Integrated Search Box */}
              <form
                onSubmit={handleHeroSearch}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '6px',
                  maxWidth: '540px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                  <Search size={18} color="var(--editorial-text-muted)" />
                </div>
                <input
                  type="text"
                  placeholder="Search 120,000+ volumes, authors, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.94rem',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--editorial-text)',
                    backgroundColor: 'transparent'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 22px' }}
                >
                  Search
                </button>
              </form>

              {/* Action Buttons & Quick Filter Links */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="btn btn-primary"
                >
                  Explore Library <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('featured-week');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-outline"
                >
                  Discover More
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Curator Topics:
                </span>
                {['Classics', 'Philosophy', 'Artificial Intelligence', 'Poetry'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onNavigate('catalog', { category: tag })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--editorial-accent)',
                      fontSize: '0.80rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Cover Photographic Showcase */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-lg)',
                  maxWidth: '460px',
                  margin: '0 auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="editorial-kicker" style={{ margin: 0 }}>
                    ★ ISSUE ACCREDITATION
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    FOLIO #{bookOfTheWeek.id || '101'}
                  </span>
                </div>

                <div
                  style={{
                    height: '360px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    marginBottom: '18px',
                    boxShadow: 'var(--shadow-md)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onViewBookDetails(bookOfTheWeek.id)}
                >
                  <img
                    src={bookOfTheWeek.cover_image || getOfflineBookCover(bookOfTheWeek.title, bookOfTheWeek.author, bookOfTheWeek.category)}
                    alt={bookOfTheWeek.title}
                    className="editorial-zoom-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.45rem',
                    marginBottom: '6px',
                    color: 'var(--editorial-text)',
                    lineHeight: 1.25,
                    cursor: 'pointer'
                  }}
                  onClick={() => onViewBookDetails(bookOfTheWeek.id)}
                >
                  {bookOfTheWeek.title}
                </h3>
                <p style={{ fontSize: '0.90rem', color: 'var(--editorial-text-muted)', marginBottom: '16px' }}>
                  Authored by <strong style={{ color: 'var(--editorial-text)' }}>{bookOfTheWeek.author}</strong>
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--editorial-border)', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>
                    <MapPin size={13} color="var(--editorial-accent)" />
                    <span>{bookOfTheWeek.floor} • {bookOfTheWeek.shelf}</span>
                  </div>
                  <button
                    onClick={() => onViewBookDetails(bookOfTheWeek.id)}
                    className="btn btn-outline btn-sm"
                  >
                    Read Details →
                  </button>
                </div>
              </div>
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
              { num: '120,000+', label: 'Volumes Indexed', sub: 'Classified & Dewey Stacked' },
              { num: `${seatStats.available} Available`, label: 'Quiet Study Pods', sub: `Out of ${seatStats.total} carrels` },
              { num: '100%', label: 'Offline Fallback', sub: 'Zero remote CDN failure' },
              { num: '99.8%', label: 'On-Time Circulation', sub: 'Automated queue management' }
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
      {/* 3. FEATURED BOOK OF THE WEEK SPREAD                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="featured-week" style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <span className="editorial-kicker">CURATORIAL MONOGRAPH</span>
            <h2 style={{ margin: 0 }}>Featured Book of the Week</h2>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 4. EDITOR'S PICKS GRID                                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: '#FFFFFF' }}>
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
                <div style={{ position: 'absolute', top: '-10px', left: '16px', zIndex: 2, backgroundColor: 'var(--editorial-text)', color: '#FFFFFF', padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'var(--font-mono)', borderRadius: '2px' }}>
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 5. EXPLORE BY GENRE / EDITORIAL TAXONOMY                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)' }}>
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
                onClick={() => onNavigate('catalog', { category: genre.slug })}
                style={{
                  backgroundColor: '#FFFFFF',
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
                  Browse Genre Stacks <ArrowRight size={13} />
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
          color: '#FFFFFF',
          borderTop: '1px solid var(--editorial-border)',
          borderBottom: '1px solid var(--editorial-border)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <Quote size={32} color="#D9D3C7" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
          <blockquote
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
              lineHeight: 1.35,
              color: '#FFFFFF',
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
              color: '#D9D3C7',
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
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: '#FFFFFF' }}>
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
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
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
                      color: '#FFFFFF',
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
              <button
                onClick={downloadAllBlueprintsZIP}
                className="btn btn-primary btn-sm"
              >
                <Download size={14} /> Download All 21 (.ZIP)
              </button>
              <button
                onClick={downloadAllBlueprintsSVG}
                className="btn btn-outline btn-sm"
              >
                <FileCode size={14} /> Download All (.SVG)
              </button>
              <button
                onClick={printAllBlueprints}
                className="btn btn-outline btn-sm"
              >
                Print 21 Pages (Word Ready)
              </button>
            </div>
          </div>

          {/* Grid of First 4 Blueprints Showcase */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              marginBottom: '28px'
            }}
          >
            {BLUEPRINT_PAGES.slice(0, 4).map((page) => (
              <div
                key={page.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedBlueprintPage(page.id);
                  setShowVisualBlueprintModal(true);
                }}
              >
                <div style={{ height: '220px', backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                  <div
                    style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    dangerouslySetInnerHTML={{ __html: getThumbnailSVG(page.svg) }}
                  />
                </div>
                <div style={{ padding: '14px 16px', borderTop: '1px solid var(--editorial-border)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--editorial-accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    PAGE 0{page.pageNumber} · {page.category}
                  </div>
                  <h4 style={{ margin: '4px 0 0', fontSize: '0.94rem' }}>{page.shortTitle}</h4>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                setSelectedBlueprintPage('home');
                setShowVisualBlueprintModal(true);
              }}
              className="btn btn-outline"
            >
              Open Full 21-Page Interactive Blueprint Viewer →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 9. ABOUT LIBRAMIND                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: '#FFFFFF' }}>
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 10. EDITORIAL FOOTER                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          backgroundColor: 'var(--editorial-bg-subtle)',
          borderTop: '1px solid var(--editorial-border)',
          padding: '60px 0 40px'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '36px',
              marginBottom: '48px'
            }}
          >
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '12px' }}>LibraMind</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text-muted)', lineHeight: 1.6 }}>
                The Literary Review &amp; Modern Smart Library Platform. Preserving knowledge and empowering minds since 1892.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Navigation
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <li><a onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Home Sanctuary</a></li>
                <li><a onClick={() => onNavigate('catalog')} style={{ cursor: 'pointer' }}>Explore Books</a></li>
                <li><a onClick={() => onNavigate('ai-finder')} style={{ cursor: 'pointer' }}>AI Book Oracle</a></li>
                <li><a onClick={() => onNavigate('seats')} style={{ cursor: 'pointer' }}>Study Pod Map</a></li>
                <li><a onClick={() => onNavigate('visit-planner')} style={{ cursor: 'pointer' }}>Plan Your Visit</a></li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Policies &amp; Support
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <li><a onClick={() => onNavigate('about')} style={{ cursor: 'pointer' }}>About Our Mission</a></li>
                <li><a onClick={() => onNavigate('contact')} style={{ cursor: 'pointer' }}>Help &amp; Circulation Desk</a></li>
                <li><a onClick={() => onNavigate('terms')} style={{ cursor: 'pointer' }}>Borrowing Code &amp; Terms</a></li>
                <li><a onClick={() => onNavigate('notifications')} style={{ cursor: 'pointer' }}>Announcements</a></li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Sanctuary Hours
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text-muted)', lineHeight: 1.6, margin: 0 }}>
                Main Reading Rooms: Mon – Sun, 08:00 – 22:00<br />
                Silent Stacks (Level 3): 24/7 Access for Fellows<br />
                Reference Desk: Mon – Fri, 09:00 – 18:00
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--editorial-border)',
              paddingTop: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.78rem',
              color: 'var(--editorial-text-muted)'
            }}
          >
            <span>© 1892 – 2026 LibraMind Athenaeum. All rights reserved.</span>
            <span>Designed in Editorial Style for Readers and Scholars worldwide.</span>
          </div>
        </div>
      </footer>

      {/* Visual Blueprint Modal */}
      <VisualBlueprintModal
        isOpen={showVisualBlueprintModal}
        onClose={() => setShowVisualBlueprintModal(false)}
        initialPage={selectedBlueprintPage}
      />
    </div>
  );
}
