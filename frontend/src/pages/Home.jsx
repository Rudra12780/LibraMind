import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import {
  Search,
  MapPin,
  Armchair,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  Leaf,
  Heart,
  BookMarked,
  Sparkles,
  Clock,
  UserCheck,
  Star,
  TrendingUp,
  Users,
  Zap,
  ChevronRight
} from 'lucide-react';

export default function Home({ onNavigate, onViewBookDetails }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [storyBooks, setStoryBooks] = useState([]);
  const [novelBooks, setNovelBooks] = useState([]);
  const [emotionalNovels, setEmotionalNovels] = useState([]);
  const [seatStats, setSeatStats] = useState({ total: 16, available: 12, occupied: 3 });
  const [memberStats, setMemberStats] = useState({ loans: 0, holds: 0, wishlist: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBooks({ limit: 8, sort: 'popularity' }),
      api.getBooks({ category: 'Story Books', limit: 4 }),
      api.getBooks({ category: 'Novels & Fiction', limit: 4 }),
      api.getBooks({ category: 'Emotional Fiction', limit: 4 }),
      api.getSeats()
    ])
      .then(([booksData, storyData, novelData, emoData, seatsData]) => {
        setFeaturedBooks(booksData.books || []);
        setStoryBooks(storyData.books || []);
        setNovelBooks(novelData.books || []);
        setEmotionalNovels(emoData.books || []);
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

  const quickSuggestions = [
    'Story Books', 'Novels & Fiction', 'Harry Potter',
    'The Hobbit', 'The Great Gatsby', '1984', 'Pride and Prejudice'
  ];

  const stats = [
    { value: '60+', label: 'Curated Titles', icon: BookOpen, color: 'var(--botanical)' },
    { value: `${seatStats.available}`, label: 'Study Pods Open', icon: Armchair, color: 'var(--forest)' },
    { value: '3', label: 'Reading Floors', icon: Layers, color: 'var(--sage)' },
    { value: '100%', label: 'Shelf Mapped', icon: MapPin, color: 'var(--botanical)' },
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Exact Shelf & Rack Locator',
      desc: 'Every physical copy is mapped with floor, section, shelf code, and rack number. Never wander aimlessly again.',
      action: () => onNavigate('catalog'),
      cta: 'Search Shelf Map',
      accent: 'var(--botanical)',
      bg: 'var(--soft-sage)',
    },
    {
      icon: Armchair,
      title: 'Live Study Pod Availability',
      desc: 'Check seat vacancy before visiting. Book individual silent pods or collaborative tables across Floor 1 & 2.',
      action: () => onNavigate('seats'),
      cta: 'View Live Seat Map',
      accent: 'var(--forest)',
      bg: 'var(--warm-beige)',
      badge: `${seatStats.available} Open`
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Book Finder',
      desc: 'Describe the kind of book you feel like reading and our AI will recommend the perfect match from our collection.',
      action: () => onNavigate('ai-finder'),
      cta: 'Try AI Finder',
      accent: 'var(--botanical)',
      bg: 'var(--soft-sage-light)',
      isNew: true
    },
  ];

  return (
    <div>

      {/* ══════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION */}
      {/* ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(160deg, #F5F2E8 0%, #EDE6D6 40%, #E8F0E3 100%)',
          padding: '72px 0 80px',
          borderBottom: '1px solid var(--subtle-border)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background pattern */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(82,115,77,0.07) 0%, transparent 50%),
                              radial-gradient(circle at 10% 80%, rgba(52,78,65,0.05) 0%, transparent 45%)`
          }}
        />
        <div style={{ position: 'absolute', right: '-60px', bottom: '-60px', opacity: 0.04, pointerEvents: 'none', transform: 'rotate(-15deg)', zIndex: 0 }}>
          <Leaf size={500} color="var(--forest)" />
        </div>
        <div style={{ position: 'absolute', left: '-80px', top: '-80px', opacity: 0.03, pointerEvents: 'none', transform: 'rotate(20deg)', zIndex: 0 }}>
          <BookOpen size={400} color="var(--forest-dark)" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>

            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(82, 115, 77, 0.22)',
                color: 'var(--forest-dark)',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '28px',
                boxShadow: '0 2px 12px rgba(52,78,65,0.08)'
              }}
            >
              <Leaf size={14} color="var(--botanical)" />
              Biophilic Sanctuary · Novels · Story Books · Live Pods
              <span
                style={{
                  backgroundColor: 'var(--botanical)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '1px 7px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.04em'
                }}
              >
                AI-Powered
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                color: 'var(--forest-dark)',
                marginBottom: '20px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1
              }}
            >
              A Sanctuary of Calm,<br />
              <span style={{ color: 'var(--botanical)' }}>Literature</span> & Timeless Stories
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--muted-text)',
                lineHeight: 1.65,
                marginBottom: '36px',
                maxWidth: '640px',
                margin: '0 auto 36px'
              }}
            >
              Discover cherished novels, magical story books, and exact shelf locations.
              Book peaceful study pods — all with real-time checkout and reservations.
            </p>

            {/* Member Quick-Card (Logged In) */}
            {user ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(82, 115, 77, 0.22)',
                  borderRadius: '20px',
                  padding: '22px 26px',
                  marginBottom: '32px',
                  boxShadow: '0 8px 32px rgba(52, 78, 65, 0.10)',
                  textAlign: 'left',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FBF6 100%)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.74rem', fontWeight: 800, color: 'var(--botanical)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>
                      <Sparkles size={13} />
                      Active Member Session · ID: {user.membership_id}
                    </div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--forest-dark)', margin: 0, letterSpacing: '-0.02em' }}>
                      Welcome back, {user.name}! 👋
                    </h2>
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)', marginTop: '3px', display: 'block' }}>
                      {user.role === 'admin' ? 'Administrator (User Mode)' : 'Student Member'} — access your loans, holds, and study pods.
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="btn btn-primary"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '10px 20px', fontSize: '0.88rem', borderRadius: '12px',
                      background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
                      border: 'none', boxShadow: '0 4px 14px rgba(52,78,65,0.22)'
                    }}
                  >
                    <BookOpen size={15} />
                    Open My Hub
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {[
                    { label: 'Active Loans', value: memberStats.loans, unit: 'books', nav: () => onNavigate('dashboard', { tab: 'loans' }), color: 'var(--forest-dark)' },
                    { label: 'Hold Queues', value: memberStats.holds, unit: 'holds', nav: () => onNavigate('dashboard', { tab: 'holds' }), color: 'var(--forest-dark)' },
                    { label: 'Study Pods', value: seatStats.available, unit: 'open', nav: () => onNavigate('seats'), color: 'var(--botanical)' },
                    { label: 'Wishlist', value: memberStats.wishlist, unit: 'titles', nav: () => onNavigate('dashboard', { tab: 'wishlist' }), color: '#C5221F' },
                  ].map((s, i) => (
                    <div
                      key={i}
                      onClick={s.nav}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(250, 248, 241, 0.85)',
                        border: '1px solid rgba(52, 78, 65, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(82,115,77,0.3)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(52,78,65,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(52,78,65,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted-text)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, marginTop: '3px' }}>
                        {s.value} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--muted-text)' }}>{s.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Visitor CTA Buttons */
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('login')}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 26px', fontSize: '0.95rem',
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
                    border: 'none',
                    boxShadow: '0 5px 18px rgba(52,78,65,0.25)'
                  }}
                >
                  <BookOpen size={17} /> Member Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="btn btn-outline"
                  style={{
                    padding: '12px 26px', fontSize: '0.95rem',
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px'
                  }}
                >
                  Register Free Library Card
                </button>
              </div>
            )}

            {/* Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '7px 7px 7px 16px',
                boxShadow: '0 8px 32px rgba(52, 78, 65, 0.13)',
                border: '1px solid rgba(52, 78, 65, 0.16)',
                maxWidth: '700px',
                margin: '0 auto 18px',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Search size={19} color="var(--sage)" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search novels, story books, authors, genres…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.98rem',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--dark-text)',
                  background: 'transparent'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
                  border: 'none',
                  boxShadow: '0 3px 10px rgba(52,78,65,0.22)'
                }}
              >
                Find Books
              </button>
            </form>

            {/* Quick Suggestions */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '7px', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--muted-text)', alignSelf: 'center', fontWeight: 500 }}>Try:</span>
              {quickSuggestions.map((term, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate('catalog', { q: term })}
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(52, 78, 65, 0.15)',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 13px',
                    color: 'var(--forest-dark)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(82,115,77,0.12)'; e.currentTarget.style.borderColor = 'rgba(82,115,77,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(52,78,65,0.15)'; }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* 2. LIVE STATS TICKER STRIP */}
      {/* ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0'
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '22px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '11px',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <stat.icon size={20} color="#FAF8F1" />
                </div>
                <div>
                  <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginTop: '2px' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* 3. KEY FEATURES / SOLUTION PILLARS */}
      {/* ══════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">

          {/* Section Label */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--botanical)',
                backgroundColor: 'var(--soft-sage-light)', padding: '5px 14px',
                borderRadius: 'var(--radius-full)', marginBottom: '12px'
              }}
            >
              <Zap size={12} /> What Makes Us Different
            </span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', color: 'var(--forest-dark)', letterSpacing: '-0.02em' }}>
              Every feature crafted for readers
            </h2>
            <p style={{ color: 'var(--muted-text)', marginTop: '8px', maxWidth: '500px', margin: '8px auto 0', fontSize: '0.98rem' }}>
              A modern, intelligent library system designed around your reading experience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {features.map((feat, i) => (
              <div
                key={i}
                style={{
                  padding: '32px',
                  borderRadius: '20px',
                  border: '1px solid var(--subtle-border)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(52,78,65,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(52,78,65,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(52,78,65,0.05)'; }}
              >
                {/* Decorative corner */}
                <div
                  style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '80px', height: '80px',
                    background: `radial-gradient(circle at top right, ${feat.bg} 0%, transparent 70%)`,
                    borderRadius: '0 20px 0 0'
                  }}
                />

                {/* NEW badge */}
                {feat.isNew && (
                  <span
                    style={{
                      position: 'absolute', top: '18px', right: '18px',
                      background: 'linear-gradient(135deg, var(--botanical) 0%, var(--forest) 100%)',
                      color: '#fff', fontSize: '0.6rem', fontWeight: 800,
                      padding: '3px 9px', borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      boxShadow: '0 2px 8px rgba(52,78,65,0.25)'
                    }}
                  >
                    AI Powered
                  </span>
                )}

                {/* Availability Badge */}
                {feat.badge && (
                  <span
                    className="badge badge-available"
                    style={{
                      position: 'absolute', top: '18px', right: '18px',
                      fontSize: '0.7rem', fontWeight: 700
                    }}
                  >
                    ● {feat.badge}
                  </span>
                )}

                {/* Icon */}
                <div
                  style={{
                    width: '52px', height: '52px',
                    borderRadius: '14px',
                    backgroundColor: feat.bg,
                    border: `1px solid rgba(52,78,65,0.10)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px'
                  }}
                >
                  <feat.icon size={24} color={feat.accent} strokeWidth={2} />
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--forest-dark)', fontWeight: 700 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                  {feat.desc}
                </p>
                <button
                  onClick={feat.action}
                  style={{
                    background: 'none', border: 'none',
                    color: feat.accent, fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    cursor: 'pointer', padding: 0,
                    transition: 'gap 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.gap = '8px'; }}
                  onMouseLeave={e => { e.currentTarget.style.gap = '5px'; }}
                >
                  {feat.cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* 4. STORY BOOKS PAVILION */}
      {/* ══════════════════════════════════════════════════ */}
      {storyBooks.length > 0 && (
        <section style={{ padding: '72px 0', backgroundColor: 'var(--cream)', borderTop: '1px solid var(--subtle-border)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: 'var(--botanical)',
                    backgroundColor: 'var(--soft-sage-light)', padding: '4px 12px',
                    borderRadius: 'var(--radius-full)', marginBottom: '10px'
                  }}
                >
                  <BookMarked size={12} /> Story Books Pavilion
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', color: 'var(--forest-dark)', letterSpacing: '-0.02em', marginTop: '2px' }}>
                  Enchanting Story Books & Adventures
                </h2>
                <p style={{ fontSize: '0.93rem', color: 'var(--muted-text)', marginTop: '6px', maxWidth: '600px' }}>
                  Timeless stories filled with magic, wondrous quests, and unforgettable friendships.
                </p>
              </div>
              <button onClick={() => onNavigate('catalog', { category: 'Story Books' })} className="btn btn-outline" style={{ borderRadius: '12px' }}>
                View All Story Books <ArrowRight size={15} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {storyBooks.map(book => (
                <BookCard key={book.id} book={book} onViewDetails={onViewBookDetails} onReserve={() => onViewBookDetails(book.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* 5. NOVELS & FICTION */}
      {/* ══════════════════════════════════════════════════ */}
      {novelBooks.length > 0 && (
        <section style={{ padding: '72px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--subtle-border)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: 'var(--forest-dark)',
                    backgroundColor: 'var(--warm-beige)', padding: '4px 12px',
                    borderRadius: 'var(--radius-full)', marginBottom: '10px'
                  }}
                >
                  <BookOpen size={12} /> Literary Sanctuary
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', color: 'var(--forest-dark)', letterSpacing: '-0.02em', marginTop: '2px' }}>
                  Classic & Modern Novels
                </h2>
                <p style={{ fontSize: '0.93rem', color: 'var(--muted-text)', marginTop: '6px', maxWidth: '600px' }}>
                  From the Jazz Age of Gatsby to Orwell's prophetic vision — explore rich characters and literary masterworks.
                </p>
              </div>
              <button onClick={() => onNavigate('catalog', { category: 'Novels & Fiction' })} className="btn btn-primary" style={{ borderRadius: '12px' }}>
                Browse All Novels <ArrowRight size={15} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {novelBooks.map(book => (
                <BookCard key={book.id} book={book} onViewDetails={onViewBookDetails} onReserve={() => onViewBookDetails(book.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* 6. HEARTWARMING / EMOTIONAL FICTION */}
      {/* ══════════════════════════════════════════════════ */}
      {emotionalNovels.length > 0 && (
        <section
          style={{
            padding: '72px 0',
            background: 'linear-gradient(135deg, #F5F9F3 0%, #EBF3E6 100%)',
            borderTop: '1px solid var(--subtle-border)'
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: 'var(--botanical)',
                    backgroundColor: 'var(--soft-sage)', padding: '4px 12px',
                    borderRadius: 'var(--radius-full)', marginBottom: '10px'
                  }}
                >
                  <Heart size={12} /> Uplifting Literature
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', color: 'var(--forest-dark)', letterSpacing: '-0.02em', marginTop: '2px' }}>
                  Heartwarming Novels & Healing Reads
                </h2>
                <p style={{ fontSize: '0.93rem', color: 'var(--muted-text)', marginTop: '6px', maxWidth: '600px' }}>
                  Step away from textbooks and immerse in deeply moving stories of hope, everyday courage, and human kindness.
                </p>
              </div>
              <button onClick={() => onNavigate('catalog', { category: 'Emotional Fiction' })} className="btn btn-outline" style={{ borderRadius: '12px', backgroundColor: '#fff' }}>
                Explore Inspiring Reads <ArrowRight size={15} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {emotionalNovels.map(book => (
                <BookCard key={book.id} book={book} onViewDetails={onViewBookDetails} onReserve={() => onViewBookDetails(book.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* 7. FEATURED STACKS / FULL COLLECTION */}
      {/* ══════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 0', backgroundColor: 'var(--warm-beige-light)', borderTop: '1px solid var(--subtle-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.07em', color: 'var(--botanical)',
                  backgroundColor: 'var(--soft-sage-light)', padding: '4px 12px',
                  borderRadius: 'var(--radius-full)', marginBottom: '10px'
                }}
              >
                <TrendingUp size={12} /> Curated Collection
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', color: 'var(--forest-dark)', letterSpacing: '-0.02em', marginTop: '2px' }}>
                Featured Stacks & New Additions
              </h2>
              <p style={{ fontSize: '0.93rem', color: 'var(--muted-text)', marginTop: '6px', maxWidth: '560px' }}>
                Hand-picked popular titles and freshly catalogued books — updated regularly for curious minds.
              </p>
            </div>
            <button onClick={() => onNavigate('catalog')} className="btn btn-outline" style={{ borderRadius: '12px', backgroundColor: '#fff' }}>
              Browse Full Catalog (60+ Books) <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} onViewDetails={onViewBookDetails} onReserve={() => onViewBookDetails(book.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* 8. VISIT CTA BANNER */}
      {/* ══════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '72px 0',
          background: 'linear-gradient(135deg, var(--forest-dark) 0%, #2A4A36 50%, var(--botanical) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', opacity: 0.04, pointerEvents: 'none' }}>
          <Leaf size={400} color="#FAF8F1" />
        </div>
        <div style={{ position: 'absolute', left: '-60px', bottom: '-60px', opacity: 0.03, pointerEvents: 'none', transform: 'rotate(180deg)' }}>
          <BookOpen size={350} color="#FAF8F1" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-full)', padding: '5px 16px',
                fontSize: '0.76rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '22px'
              }}
            >
              <Clock size={12} /> Open Mon–Fri 8am–10pm · Sat–Sun 9am–8pm
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.7rem, 3.5vw, 2.8rem)',
                color: '#FAF8F1',
                marginBottom: '16px',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.15
              }}
            >
              Ready to find your next<br />
              <span style={{ color: '#A8CCA0' }}>great read?</span>
            </h2>

            <p style={{ color: 'rgba(250,248,241,0.72)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '36px', maxWidth: '540px', margin: '0 auto 36px' }}>
              Visit our biophilic reading sanctuary at Central Campus Wing B, Level 1 & 2.
              Book a quiet pod, explore the stacks, or let our AI guide your next literary journey.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('visit-planner')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 26px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '14px',
                  color: '#FAF8F1',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >
                <Compass size={16} /> Plan My Visit
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 26px',
                  backgroundColor: '#FAF8F1',
                  border: 'none',
                  borderRadius: '14px',
                  color: 'var(--forest-dark)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <BookOpen size={16} /> Browse the Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
