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

// Fast, bias-free Fisher-Yates array shuffling to ensure dynamic books on every page load
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Responsive window viewport listener for dynamic card arch recalculation
function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}

// 10-Card Desktop Overhead Dome Arch Configurations (Matching Reference Image)
const DESKTOP_CARDS_10 = [
  { x: -570, y: 95, rot: -44 },
  { x: -475, y: 5,  rot: -35 },
  { x: -365, y: -90, rot: -25 },
  { x: -225, y: -165, rot: -14 },
  { x: -78,  y: -208, rot: -5 },
  { x: 78,   y: -208, rot: 5 },
  { x: 225,  y: -165, rot: 14 },
  { x: 365,  y: -90, rot: 25 },
  { x: 475,  y: 5,  rot: 35 },
  { x: 570,  y: 95, rot: 44 }
];

// 8-Card Tablet Overhead Arch Configurations
const TABLET_CARDS_8 = [
  { x: -335, y: 65,  rot: -38 },
  { x: -250, y: -20, rot: -28 },
  { x: -155, y: -95, rot: -16 },
  { x: -55,  y: -140, rot: -5 },
  { x: 55,   y: -140, rot: 5 },
  { x: 155,  y: -95, rot: 16 },
  { x: 250,  y: -20, rot: 28 },
  { x: 335,  y: 65,  rot: 38 }
];

// 5-Card Mobile Compact Overhead Fan (Guaranteed 0 overflow on 320px-480px)
const MOBILE_CARDS_5 = [
  { x: -108, y: 16, rot: -16 },
  { x: -54,  y: 4,  rot: -8 },
  { x: 0,    y: 0,  rot: 0 },
  { x: 54,   y: 4,  rot: 8 },
  { x: 108,  y: 16, rot: 16 }
];

export default function Home({ onNavigate, onViewBookDetails, onOpenBlueprints }) {
  const { user } = useAuth();
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const isDesktop = viewportWidth >= 1024;

  const [searchQuery, setSearchQuery] = useState('');
  const [heroBooks, setHeroBooks] = useState([]);
  const [catalogBooks, setCatalogBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [seatStats, setSeatStats] = useState({ total: 16, available: 12, occupied: 3 });
  const [memberStats, setMemberStats] = useState({ loans: 0, holds: 0, wishlist: 0 });
  const [loading, setLoading] = useState(true);
  const [hoveredArcIndex, setHoveredArcIndex] = useState(null);
  const [showVisualBlueprintModal, setShowVisualBlueprintModal] = useState(false);
  const [selectedBlueprintPage, setSelectedBlueprintPage] = useState('home');
  const [blueprintCategory, setBlueprintCategory] = useState('all');

  const fallbackArcBooks = [
    { id: 1, title: 'The Bhagavad Gita: Walk the Path of Inner Peace', author: 'Eknath Easwaran', category: 'Spiritual & Wisdom', cover_image: '/uploads/book_1_cover.jpg' },
    { id: 10, title: "Man's Search for Meaning", author: 'Viktor E. Frankl', category: 'Classic Literature', cover_image: '/uploads/book_10_cover.jpg' },
    { id: 17, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic Novels', cover_image: '/uploads/book_17_cover.jpg' },
    { id: 18, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classic Novels', cover_image: '/uploads/book_18_cover.jpg' },
    { id: 19, title: '1984', author: 'George Orwell', category: 'Fiction & Mystery', cover_image: '/uploads/book_1984_original.jpg' },
    { id: 20, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic Literature', cover_image: '/uploads/book_20_cover.jpg' },
    { id: 25, title: 'Wuthering Heights', author: 'Emily Brontë', category: 'Classic Novels', cover_image: '/uploads/book_wuthering_heights_original.jpg' },
    { id: 52, title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', category: 'AI & Data Science', cover_image: '/uploads/book_52_cover.svg' },
    { id: 57, title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', category: 'Programming & Technology', cover_image: '/uploads/book_57_cover.svg' },
    { id: 61, title: 'Atomic Habits: Tiny Changes, Remarkable Results', author: 'James Clear', category: 'Personal Growth', cover_image: '/uploads/book_61_cover.svg' }
  ];

  // Single fast unified query to eliminate database wait time & lag, randomized dynamically
  useEffect(() => {
    Promise.all([
      api.getBooks({ limit: 80 }),
      api.getSeats().catch(() => ({ stats: { total: 16, available: 12, occupied: 3 } }))
    ])
      .then(([booksData, seatsData]) => {
        const allBooks = booksData.books || [];
        setCatalogBooks(allBooks);
        const seen = new Set();
        const uniqueBooks = [];
        for (const b of allBooks) {
          const key = (b.title || '').trim().toLowerCase() || String(b.id || b._id);
          if (!seen.has(key)) {
            seen.add(key);
            uniqueBooks.push(b);
          }
        }
        const shuffled = shuffleArray(uniqueBooks);
        const top10 = shuffled.slice(0, 10);
        if (top10.length < 10) {
          for (const fb of fallbackArcBooks) {
            if (top10.length >= 10) break;
            if (!top10.some(b => b.title === fb.title)) {
              top10.push(fb);
            }
          }
        }
        setHeroBooks(top10);
        setFeaturedBooks(shuffled.slice(0, 10));
        setRecentBooks(shuffled.slice(10, 15));
        setTrendingBooks(shuffled.slice(15, 21));
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
        setHeroBooks(shuffleArray(fallbackArcBooks));
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
    { title: 'Classical Literature', slug: 'Classic Literature', desc: 'Homer, Austen, Tolstoy & the enduring Western & Eastern canon', count: '14 Volumes' },
    { title: 'Philosophy & Wisdom', slug: 'Spiritual & Wisdom', desc: 'Epistemology, ancient logic, Bhagavad Gita & Stoic inquiries', count: '12 Volumes' },
    { title: 'Artificial Intelligence', slug: 'AI & Data Science', desc: 'Machine cognition, neural architectures & algorithm foundations', count: '8 Volumes' },
    { title: 'Programming & Tech', slug: 'Programming & Technology', desc: 'Clean architecture, modern software systems & engineering', count: '10 Volumes' },
    { title: 'Novels & Modern Fiction', slug: 'Classic Novels', desc: 'Orwell, Lee, Fitzgerald, Brontë & literary narratives', count: '18 Volumes' },
    { title: 'Personal Growth & Mind', slug: 'Personal Growth', desc: 'Atomic habits, psychological resilience & deep focus treatises', count: '9 Volumes' }
  ];

  const literaryAuthors = [
    {
      name: 'Virginia Woolf',
      era: '1882 – 1941',
      focus: 'Modernist Stream of Consciousness',
      works: 'To the Lighthouse, Mrs Dalloway',
      query: 'Woolf',
      staticBooks: [
        { id: 70, title: 'To the Lighthouse', author: 'Virginia Woolf', category: 'Novels & Fiction', available_copies: 2, cover_image: '/uploads/book_70_cover.svg' },
        { id: 71, title: 'Mrs Dalloway', author: 'Virginia Woolf', category: 'Classic Literature', available_copies: 2, cover_image: '/uploads/book_71_cover.svg' }
      ]
    },
    {
      name: 'Jorge Luis Borges',
      era: '1899 – 1986',
      focus: 'Infinite Labyrinths & Bibliographic Myth',
      works: 'Ficciones, Labyrinths',
      query: 'Borges',
      staticBooks: [
        { id: 72, title: 'Ficciones', author: 'Jorge Luis Borges', category: 'Philosophy & Ethics', available_copies: 3, cover_image: '/uploads/book_72_cover.svg' },
        { id: 73, title: 'Labyrinths: Selected Stories & Other Writings', author: 'Jorge Luis Borges', category: 'Philosophy & Ethics', available_copies: 1, cover_image: '/uploads/book_73_cover.svg' }
      ]
    },
    {
      name: 'Alan M. Turing',
      era: '1912 – 1954',
      focus: 'Theoretical Computation & AI Foundations',
      works: 'Computing Machinery and Intelligence',
      query: 'Turing',
      staticBooks: [
        { id: 74, title: 'Computing Machinery and Intelligence', author: 'Alan M. Turing', category: 'Artificial Intelligence', available_copies: 3, cover_image: '/uploads/book_74_cover.svg' }
      ]
    },
    {
      name: 'Fyodor Dostoevsky',
      era: '1821 – 1881',
      focus: 'Philosophical Realism & Moral Inquiry',
      works: 'Crime and Punishment, The Brothers Karamazov',
      query: 'Dostoevsky',
      staticBooks: [
        { id: 20, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', category: 'Classic Novels', available_copies: 2, cover_image: '/uploads/book_20_cover.jpg' },
        { id: 21, title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', category: 'Classic Novels', available_copies: 1, cover_image: '/uploads/book_21_cover.svg' }
      ]
    },
    {
      name: 'Jane Austen',
      era: '1775 – 1817',
      focus: 'British Classical Prose & Social Realism',
      works: 'Pride and Prejudice, Sense and Sensibility',
      query: 'Austen',
      staticBooks: [
        { id: 23, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic Literature', available_copies: 2, cover_image: '/uploads/book_20_cover.jpg' },
        { id: 76, title: 'Sense and Sensibility', author: 'Jane Austen', category: 'Classic Literature', available_copies: 2, cover_image: '/uploads/book_76_cover.svg' }
      ]
    },
    {
      name: 'George Orwell',
      era: '1903 – 1950',
      focus: 'Dystopian Fiction & Political Allegory',
      works: '1984, Animal Farm',
      query: 'Orwell',
      staticBooks: [
        { id: 19, title: '1984', author: 'George Orwell', category: 'Fiction & Mystery', available_copies: 2, cover_image: '/uploads/book_1984_original.jpg' },
        { id: 75, title: 'Animal Farm', author: 'George Orwell', category: 'Classic Novels', available_copies: 2, cover_image: '/uploads/book_75_cover.svg' }
      ]
    }
  ];

  const getAuthorBooks = (query, staticFallback = []) => {
    if (!catalogBooks || catalogBooks.length === 0) return staticFallback;
    const q = (query || '').toLowerCase().trim();
    if (!q) return staticFallback;
    const matched = catalogBooks.filter(b => 
      (b.author && b.author.toLowerCase().includes(q)) || 
      (b.title && b.title.toLowerCase().includes(q))
    );
    return matched.length > 0 ? matched.slice(0, 2) : staticFallback;
  };

  const bookOfTheWeek = (heroBooks && heroBooks[0]) || fallbackArcBooks[4];

  // Responsive Card Selection and Geometry
  const cardConfigs = isMobile ? MOBILE_CARDS_5 : (isTablet ? TABLET_CARDS_8 : DESKTOP_CARDS_10);
  const activeBooks = (heroBooks && heroBooks.length > 0 ? heroBooks : fallbackArcBooks).slice(0, cardConfigs.length);

  // Responsive scale calculations
  const desktopScale = isDesktop ? Math.min(1.0, Math.max(0.76, (viewportWidth * 0.94) / 1380)) : 1.0;
  const tabletScale = isTablet ? Math.min(1.0, Math.max(0.72, (viewportWidth * 0.94) / 860)) : 1.0;

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '100vh', color: 'var(--editorial-text)' }}>
      
      {/* Dynamic Keyframes for Subtle Ambient Floating Animations */}
      <style>{`
        @keyframes heroFloatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes heroFloatFast {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .hero-card-motion {
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-card-motion,
          .hero-cta-btn {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. EDITORIAL ATHENAEUM HERO WITH FLOATING ARCH BOOK GALLERY    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        id="hero-section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--editorial-bg)',
          padding: isMobile ? '24px 0 36px' : (isTablet ? '36px 0 48px' : '48px 0 64px'),
          borderBottom: '1px solid var(--editorial-border)',
          width: '100%'
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            width: isMobile ? '100%' : '95%',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}
        >
          {/* STAGE CONTAINER FOR OVERHEAD ARCH + HERO CONTENT */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: isMobile ? 'auto' : (isTablet ? '520px' : '600px'),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: isMobile ? 'flex-start' : 'center',
              padding: isMobile ? '0 16px' : '0'
            }}
          >
            {/* DESKTOP & TABLET: OVERHEAD FLOATING DOME ARCH OF REAL BOOKS */}
            {!isMobile && (
              <div
                className="hero-arch-canvas"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  maxWidth: '1440px',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 4
                }}
              >
                {cardConfigs.map((cfg, i) => {
                  const book = activeBooks[i % activeBooks.length];
                  if (!book) return null;
                  const isHovered = hoveredArcIndex === i;
                  const coverUrl = book.cover_image || getOfflineBookCover(book.title, book.author, book.category);

                  const scale = isTablet ? tabletScale : desktopScale;
                  const cardW = Math.round((isTablet ? 92 : 120) * scale);
                  const cardH = Math.round((isTablet ? 126 : 164) * scale);
                  const cardRadius = Math.round((isTablet ? 12 : 16) * scale);
                  const curX = Math.round(cfg.x * scale);
                  const curY = Math.round(cfg.y * scale);
                  const curRot = cfg.rot;

                  return (
                    <div
                      key={book.id || book._id || i}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${curX}px), calc(-50% + ${curY}px)) rotate(${curRot}deg)`,
                        zIndex: isHovered ? 40 : 10 + (5 - Math.abs(i - (cardConfigs.length - 1) / 2)),
                        pointerEvents: 'auto',
                        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), z-index 0.2s ease',
                        willChange: 'transform'
                      }}
                    >
                      <div
                        className="hero-card-motion"
                        onMouseEnter={() => setHoveredArcIndex(i)}
                        onMouseLeave={() => setHoveredArcIndex(null)}
                        onClick={() => onViewBookDetails(book.id || book._id)}
                        title={`${book.title} by ${book.author}`}
                        style={{
                          width: `${cardW}px`,
                          height: `${cardH}px`,
                          borderRadius: `${cardRadius}px`,
                          backgroundColor: '#FFFFFF',
                          border: isHovered ? '2px solid var(--editorial-accent)' : '2px solid #FFFFFF',
                          boxShadow: isHovered
                            ? '0 26px 52px -10px rgba(37, 40, 32, 0.26), 0 12px 24px -6px rgba(37, 40, 32, 0.14)'
                            : '0 16px 36px -8px rgba(37, 40, 32, 0.16), 0 6px 14px -3px rgba(37, 40, 32, 0.08)',
                          transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.25s ease',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          animation: `${i % 2 === 0 ? 'heroFloatSlow' : 'heroFloatFast'} ${4.6 + (i % 3) * 0.7}s ease-in-out infinite`,
                          animationDelay: `${(i * 0.28).toFixed(2)}s`
                        }}
                      >
                        <img
                          src={coverUrl}
                          alt={book.title}
                          onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          loading="eager"
                        />
                        {/* Subtle hover gradient banner */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(18, 18, 22, 0.92) 0%, rgba(18, 18, 22, 0.3) 65%, transparent 100%)',
                            padding: '16px 8px 6px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.25s ease',
                            pointerEvents: 'none'
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              color: '#FFFFFF',
                              lineHeight: 1.2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {book.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MOBILE: ADAPTED 5-CARD FLOATING FAN LOCATED DIRECTLY ABOVE HEADLINE */}
            {isMobile && (
              <div
                style={{
                  position: 'relative',
                  height: '105px',
                  maxWidth: '320px',
                  width: '100%',
                  margin: '0 auto 16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}
              >
                {cardConfigs.map((cfg, i) => {
                  const book = activeBooks[i % activeBooks.length];
                  if (!book) return null;
                  const coverUrl = book.cover_image || getOfflineBookCover(book.title, book.author, book.category);

                  return (
                    <div
                      key={book.id || book._id || i}
                      onClick={() => onViewBookDetails(book.id || book._id)}
                      className="hero-card-motion"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        transform: `translate(calc(-50% + ${cfg.x}px), ${cfg.y}px) rotate(${cfg.rot}deg)`,
                        width: '62px',
                        height: '86px',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 8px 18px -3px rgba(37, 40, 32, 0.16), 0 3px 6px -2px rgba(37, 40, 32, 0.08)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        zIndex: 10 + (3 - Math.abs(i - 2)),
                        animation: `${i % 2 === 0 ? 'heroFloatSlow' : 'heroFloatFast'} ${4.2 + (i % 3) * 0.6}s ease-in-out infinite`,
                        animationDelay: `${(i * 0.25).toFixed(2)}s`,
                        touchAction: 'manipulation'
                      }}
                      title={`${book.title} by ${book.author}`}
                    >
                      <img
                        src={coverUrl}
                        alt={book.title}
                        onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        loading="eager"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* CENTRAL HERO CONTENT (Exact wording from requirement 4) */}
            <div
              className="hero-center-content"
              style={{
                position: 'relative',
                zIndex: 15,
                textAlign: 'center',
                maxWidth: isMobile ? '100%' : (isTablet ? '480px' : '620px'),
                margin: '0 auto',
                padding: '0 16px',
                boxSizing: 'border-box'
              }}
            >
              {/* Main Heading */}
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 4.3vw, 3.6rem)',
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  margin: '0 0 16px 0',
                  textAlign: 'center'
                }}
              >
                Discover Your Next Favourite Book
              </h1>

              {/* Subtitle / Description */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.94rem, 1.2vw, 1.08rem)',
                  lineHeight: 1.62,
                  color: 'var(--editorial-text-muted)',
                  maxWidth: '560px',
                  margin: '0 auto 28px',
                  textAlign: 'center'
                }}
              >
                Explore a world of knowledge, discover books you'll love, and experience a smarter way to read with LibraMind.
              </p>

              {/* Primary CTA Button */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hero-cta-btn"
                  style={{
                    backgroundColor: 'var(--editorial-green)',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '14px 34px',
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 18px rgba(38, 61, 50, 0.24)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    minHeight: '48px',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1D3027';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 26px rgba(38, 61, 50, 0.38)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--editorial-green)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(38, 61, 50, 0.24)';
                  }}
                >
                  <span>Explore Books</span>
                  <ArrowRight size={16} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>

          {/* THREE FEATURE SECTIONS (Exact wording from requirement 5) */}
          <div
            className="hero-features-container"
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'center',
              gap: isMobile ? '18px' : '32px',
              maxWidth: '960px',
              width: isMobile ? '92%' : '95%',
              margin: isMobile ? '32px auto 0' : '56px auto 0',
              position: 'relative',
              zIndex: 15,
              borderTop: isMobile ? '1px solid var(--editorial-border)' : 'none',
              paddingTop: isMobile ? '20px' : '0'
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 12px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--editorial-green-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--editorial-green)',
                  marginBottom: '10px'
                }}
              >
                <BookOpen size={20} strokeWidth={2.2} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.20rem',
                  fontWeight: 700,
                  color: 'var(--editorial-text)',
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.01em'
                }}
              >
                Discover Books
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                  color: 'var(--editorial-text-muted)',
                  margin: 0,
                  maxWidth: '260px'
                }}
              >
                Explore a diverse collection of books across multiple subjects and categories.
              </p>
            </div>

            {/* Divider 1 */}
            <div
              style={{
                width: isMobile ? '100%' : '1px',
                height: isMobile ? '1px' : '58px',
                backgroundColor: 'var(--editorial-border)',
                alignSelf: isMobile ? 'stretch' : 'center',
                margin: isMobile ? '2px 0' : '0'
              }}
            />

            {/* Feature 2 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 12px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--editorial-green-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--editorial-green)',
                  marginBottom: '10px'
                }}
              >
                <Sparkles size={20} strokeWidth={2.2} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.20rem',
                  fontWeight: 700,
                  color: 'var(--editorial-text)',
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.01em'
                }}
              >
                Smart Recommendations
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                  color: 'var(--editorial-text-muted)',
                  margin: 0,
                  maxWidth: '260px'
                }}
              >
                Discover books based on your interests and reading preferences.
              </p>
            </div>

            {/* Divider 2 */}
            <div
              style={{
                width: isMobile ? '100%' : '1px',
                height: isMobile ? '1px' : '58px',
                backgroundColor: 'var(--editorial-border)',
                alignSelf: isMobile ? 'stretch' : 'center',
                margin: isMobile ? '2px 0' : '0'
              }}
            />

            {/* Feature 3 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 12px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--editorial-green-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--editorial-green)',
                  marginBottom: '10px'
                }}
              >
                <Compass size={20} strokeWidth={2.2} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.20rem',
                  fontWeight: 700,
                  color: 'var(--editorial-text)',
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.01em'
                }}
              >
                Smart Library Experience
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                  color: 'var(--editorial-text-muted)',
                  margin: 0,
                  maxWidth: '260px'
                }}
              >
                Explore book availability and enjoy a more convenient library experience.
              </p>
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
      {/* 5. EXPLORE BY LITERARY GENRE                                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="genres-section" style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span className="editorial-kicker">TAXONOMY &amp; CURATION</span>
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
      {/* 6. LITERARY HERITAGE                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="heritage-section" style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: 'var(--editorial-bg-subtle)' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span className="editorial-kicker">ARCHIVAL TRADITION &amp; FOUNDATIONS</span>
            <h2 style={{ margin: 0 }}>Literary Heritage</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--editorial-text-muted)' }}>
              Rooted in the timeless Athenaeum tradition, preserving intellectual history for future generations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}
          >
            {[
              {
                title: 'Classical Athenaeum Canon',
                num: '01',
                desc: 'Curated preservation of foundational texts across philosophy, mathematics, classical drama, and world literature.',
                icon: BookOpen
              },
              {
                title: 'Physical Accession Mapping',
                num: '02',
                desc: 'Precision 3D shelving coordinates (floor, wing, rack, shelf) ensuring physical specimens are rapidly locatable.',
                icon: MapPin
              },
              {
                title: 'Quiet Sanctuary of Study',
                num: '03',
                desc: '16 dedicated acoustic carrels and study pods with ambient natural lighting and distraction-free academic focus.',
                icon: Armchair
              },
              {
                title: 'Equitable Patron Stewardship',
                num: '04',
                desc: 'Automated transparent 48-hour hold circulation and fair-use access preventing neglected stack inventory.',
                icon: ShieldCheck
              }
            ].map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '28px 24px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--editorial-green-light)',
                      color: 'var(--editorial-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <pillar.icon size={20} strokeWidth={2.2} />
                  </div>
                  <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--editorial-accent)' }}>
                    PILLAR {pillar.num}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.20rem', color: 'var(--editorial-text)', margin: '0 0 10px 0' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', lineHeight: 1.55, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Archival Pullquote Banner */}
          <div
            style={{
              padding: '36px 32px',
              backgroundColor: 'var(--editorial-green)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <Quote size={28} color="#D9D3C7" style={{ margin: '0 auto 12px', opacity: 0.7 }} />
            <blockquote
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.3rem, 2.6vw, 1.85rem)',
                lineHeight: 1.38,
                color: '#FFFFFF',
                margin: '0 auto 12px',
                maxWidth: '720px'
              }}
            >
              "I have always imagined that Paradise will be a kind of a library."
            </blockquote>
            <cite
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.84rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#D9D3C7',
                fontStyle: 'normal'
              }}
            >
              — Jorge Luis Borges, <span style={{ opacity: 0.85 }}>Poema de los Dones (1958)</span>
            </cite>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 7. FEATURED AUTHORS & SCHOLARS                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="authors-section" style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span className="editorial-kicker">SCHOLARLY MONOGRAPHS</span>
            <h2 style={{ margin: 0 }}>Featured Authors &amp; Scholars</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--editorial-text-muted)' }}>
              Explore comprehensive monographs and treatises by influential thinkers, with direct stack availability.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {literaryAuthors.map((author, i) => {
              const authorBooks = getAuthorBooks(author.query, author.staticBooks);

              return (
                <div
                  key={i}
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--editorial-bg)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--editorial-accent)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--editorial-border)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  }}
                >
                  <div>
                    {/* Author Profile Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--editorial-green)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.22rem', color: 'var(--editorial-text)' }}>
                          {author.name}
                        </h4>
                        <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {author.era}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--editorial-accent)', fontWeight: 600, marginBottom: '14px' }}>
                      {author.focus}
                    </div>

                    {/* Real Books Displayed Under Author */}
                    <div style={{ borderTop: '1px solid var(--editorial-border)', paddingTop: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.70rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--editorial-text-muted)', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                        Accessioned Volumes in Stacks:
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                        {authorBooks.map((book) => {
                          const coverUrl = book.cover_image || getOfflineBookCover(book.title, book.author, book.category);
                          const isAvailable = book.available_copies !== undefined ? book.available_copies > 0 : true;

                          return (
                            <div
                              key={book.id || book._id}
                              onClick={() => onViewBookDetails(book.id || book._id)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid var(--editorial-border)',
                                borderRadius: '4px',
                                padding: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--editorial-green)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--editorial-border)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                              title={`View specimen: ${book.title}`}
                            >
                              <div style={{ width: '100%', height: '110px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#F0EFEA', marginBottom: '8px' }}>
                                <img
                                  src={coverUrl}
                                  alt={book.title}
                                  onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                              </div>
                              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--editorial-text)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {book.title}
                              </span>
                              <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.66rem' }}>
                                <span style={{ color: isAvailable ? '#255E38' : '#8B3A1C', fontWeight: 700 }}>
                                  {isAvailable ? '• In Stacks' : '• Checked Out'}
                                </span>
                                <span style={{ color: 'var(--editorial-text-muted)' }}>
                                  {book.category?.split(' ')[0]}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Catalog Navigation Action */}
                  <div
                    onClick={() => onNavigate('catalog', { q: author.query })}
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--editorial-accent)',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Explore all {author.name} works in catalog</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 8. DIRECT RULES & BORROWING POLICIES                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="rules-section" style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: 'var(--editorial-bg)' }}>
        <div className="container">
          <div style={{ marginBottom: '36px' }}>
            <span className="editorial-kicker">PATRON CODE &amp; POLICIES</span>
            <h2 style={{ margin: 0 }}>Direct Rules &amp; Borrowing Policies</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--editorial-text-muted)' }}>
              Clear, equitable guidelines governing stack borrowing, study carrels, and patron circulation.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '36px'
            }}
          >
            {[
              {
                num: 'RULE 01',
                title: 'Borrowing Limits & Loan Period',
                desc: 'Registered patrons may hold up to 3 active volumes concurrently for a 14-day checkout window. Single 14-day renewal is permitted if no waiting hold is active.',
                badge: '14 Days · 3 Volumes'
              },
              {
                num: 'RULE 02',
                title: 'Study Pod Protocols',
                desc: '16 silent study pods open daily. Check-in is required within 15 minutes of reservation time. Silence is strictly observed; personal devices require headphones.',
                badge: '15m Check-in Window'
              },
              {
                num: 'RULE 03',
                title: 'Queue & Hold Reservations',
                desc: 'Automated queue management triggers notification upon return. Reserved volumes remain on hold shelf for 48 hours before releasing to the next scholar.',
                badge: '48h Hold Pick-up'
              },
              {
                num: 'RULE 04',
                title: 'Care of Stacks & Fair Penalties',
                desc: 'No writing, folding, or water damage permitted in archival volumes. Overdue fines accrue at $1/day, capped at replacement cost. Waiver assistance available.',
                badge: '$1/Day · Capped'
              }
            ].map((rule, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '28px 24px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--editorial-accent)' }}>
                      {rule.num}
                    </span>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '2px', backgroundColor: 'var(--editorial-bg-subtle)', color: 'var(--editorial-text)', border: '1px solid var(--editorial-border)', fontWeight: 600 }}>
                      {rule.badge}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.20rem', color: 'var(--editorial-text)', margin: '0 0 10px 0' }}>
                    {rule.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', lineHeight: 1.55, margin: 0 }}>
                    {rule.desc}
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px dashed var(--editorial-border)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--editorial-green)', fontWeight: 600 }}>
                  <CheckCircle2 size={14} />
                  <span>Verified Archival Standard</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('terms')}
              className="btn btn-primary"
            >
              <span>View Full Terms &amp; Policies</span>
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="btn btn-outline"
            >
              Consult Librarian / Help Desk →
            </button>
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
                    backgroundColor: isActive ? 'var(--editorial-green)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'var(--editorial-text)',
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
                      backgroundColor: '#FFFFFF',
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
                    <div style={{ height: '220px', backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', overflow: 'hidden' }}>
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
                        <span style={{ fontSize: '0.64rem', fontFamily: 'monospace', color: 'var(--editorial-text-muted)' }}>
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
            <button
              onClick={printAllBlueprints}
              className="btn btn-secondary"
            >
              Print 21 Blueprint Sheets (Word Ready)
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 10. ABOUT LIBRAMIND                                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="about-section" style={{ padding: '72px 0', borderBottom: '1px solid var(--editorial-border)', backgroundColor: '#FFFFFF' }}>
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
  