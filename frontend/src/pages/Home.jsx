import React, { useState, useEffect } from 'react';
import { api } from '../api';
import BookCard from '../components/BookCard';
import {
  Search,
  MapPin,
  Sparkles,
  Armchair,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  Leaf
} from 'lucide-react';

export default function Home({ onNavigate, onViewBookDetails }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [emotionalNovels, setEmotionalNovels] = useState([]);
  const [seatStats, setSeatStats] = useState({ total: 16, available: 12, occupied: 3 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBooks({ limit: 6, sort: 'popularity' }),
      api.getBooks({ category: 'Emotional Fiction', limit: 4 }),
      api.getSeats()
    ])
      .then(([booksData, novelData, seatsData]) => {
        setFeaturedBooks(booksData.books || []);
        setEmotionalNovels(novelData.books || []);
        if (seatsData.stats) {
          setSeatStats(seatsData.stats);
        }
      })
      .catch(err => {
        console.error('Home data load error', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog', { q: searchQuery.trim() });
    } else {
      onNavigate('catalog');
    }
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FAF8F1 0%, #F3EBDD 100%)',
          padding: '60px 0 80px',
          borderBottom: '1px solid var(--subtle-border)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative leaf watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            opacity: 0.05,
            pointerEvents: 'none',
            transform: 'rotate(-20deg)'
          }}
        >
          <Leaf size={420} color="var(--forest)" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--soft-sage)',
                color: 'var(--forest-dark)',
                fontSize: '0.84rem',
                fontWeight: 600,
                marginBottom: '20px'
              }}
            >
              <Leaf size={15} color="var(--botanical)" />
              Biophilic Architecture • Intelligent Book Discovery • Live Quiet Pods
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                color: 'var(--forest-dark)',
                marginBottom: '18px',
                fontWeight: 700,
                letterSpacing: '-0.025em'
              }}
            >
              A Sanctuary of Calm & Intelligent Inquiry
            </h1>

            <p
              style={{
                fontSize: '1.12rem',
                color: 'var(--muted-text)',
                lineHeight: 1.6,
                marginBottom: '36px',
                maxWidth: '680px',
                margin: '0 auto 36px'
              }}
            >
              Find any book instantly, view its exact shelf coordinates, check live study pod availability, and receive AI-guided reading suggestions.
            </p>

            {/* Central Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                boxShadow: '0 8px 30px rgba(52, 78, 65, 0.12)',
                border: '1px solid rgba(52, 78, 65, 0.18)',
                maxWidth: '680px',
                margin: '0 auto 20px'
              }}
            >
              <Search size={20} color="var(--sage)" style={{ marginLeft: '8px', marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search novels, emotional stories, positivity, author, or ISBN (e.g. 'The Midnight Library', 'Alchemist', 'Ove')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--dark-text)'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)' }}
              >
                Find Books
              </button>
            </form>

            {/* Quick Suggestions */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--muted-text)', alignSelf: 'center' }}>Popular inquiries:</span>
              {['The Midnight Library', 'Emotional Fiction', 'The Alchemist', 'A Man Called Ove', 'Atomic Habits', 'Pride and Prejudice'].map((term, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate('catalog', { q: term })}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(52, 78, 65, 0.15)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 12px',
                    color: 'var(--forest-dark)',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Problem Solvers / Solution Pillars */}
      <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Pillar 1: Exact Shelf & Rack Navigator */}
            <div
              className="bio-card"
              style={{
                padding: '28px',
                borderLeft: '4px solid var(--botanical)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--soft-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <MapPin size={22} color="var(--forest-dark)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--forest-dark)' }}>
                Exact Shelf & Rack Locator
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.5, marginBottom: '14px' }}>
                Never waste time wandering library stacks. Every physical copy is mapped with its floor, section, shelf code, and rack number.
              </p>
              <button
                onClick={() => onNavigate('catalog')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--botanical)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Search Shelf Map <ArrowRight size={14} />
              </button>
            </div>

            {/* Pillar 2: Live Seat & Quiet Pod Availability */}
            <div
              className="bio-card"
              style={{
                padding: '28px',
                borderLeft: '4px solid var(--forest)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--warm-beige)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <Armchair size={22} color="var(--forest-dark)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--forest-dark)' }}>
                Live Study Pod Availability
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.5, marginBottom: '14px' }}>
                Check seat vacancy before visiting. Book individual silent pods or collaborative tables across Floor 1 and Floor 2.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span className="badge badge-available">
                  ● {seatStats.available} Seats Open
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                  ({seatStats.occupied} currently occupied)
                </span>
              </div>
              <button
                onClick={() => onNavigate('seats')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--forest)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                View Live Seat Map <ArrowRight size={14} />
              </button>
            </div>

            {/* Pillar 3: Curated Catalog & Holds */}
            <div
              className="bio-card"
              style={{
                padding: '28px',
                borderLeft: '4px solid var(--sage)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--soft-sage-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <BookOpen size={22} color="var(--botanical)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--forest-dark)' }}>
                Curated Catalog & Holds
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.5, marginBottom: '14px' }}>
                Search books by title, author, or ISBN. Reserve high-demand volumes online and collect them directly from the circulation desk.
              </p>
              <button
                onClick={() => onNavigate('catalog')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--botanical)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Browse Catalog <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Heartwarming Novels & Emotional Stories Section */}
      {emotionalNovels.length > 0 && (
        <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--subtle-border)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--botanical)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} color="var(--botanical)" /> Uplifting Literature & Novels
                </span>
                <h2 style={{ fontSize: '2rem', color: 'var(--forest-dark)', marginTop: '4px' }}>
                  Heartwarming Novels & Inspiring Reads
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--muted-text)', marginTop: '6px', maxWidth: '640px' }}>
                  Step away from textbooks and immerse yourself in deeply moving stories of hope, connection, emotional healing, and everyday courage.
                </p>
              </div>

              <button
                onClick={() => onNavigate('catalog', { category: 'Emotional Fiction' })}
                className="btn btn-outline"
              >
                Explore All Novels <ArrowRight size={16} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px'
              }}
            >
              {emotionalNovels.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onViewDetails={onViewBookDetails}
                  onReserve={() => onNavigate('catalog')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Featured / New Arrivals Section */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--cream)', borderTop: '1px solid var(--subtle-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--botanical)'
                }}
              >
                Curated Collection
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--forest-dark)', marginTop: '4px' }}>
                Featured Stacks & New Additions
              </h2>
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-outline"
            >
              Browse Full Catalog <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {featuredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={onViewBookDetails}
                onReserve={() => onNavigate('catalog')}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
