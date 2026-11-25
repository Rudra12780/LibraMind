import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Search,
  BookOpen,
  MapPin,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Bookmark,
  Filter,
  GitCompare,
  Compass,
  Check,
  AlertCircle
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

export default function AiBookFinder({
  onViewBookDetails,
  onNavigate,
  onAddToCompare,
  compareBookIds = []
}) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('all');
  const [language, setLanguage] = useState('All');
  const [yearMin, setYearMin] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [extractedKeywords, setExtractedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  useEffect(() => {
    let timer = null;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setWindowWidth(window.innerWidth), 80);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth < 640;

  const sampleQueries = [
    "Find beginner-friendly books about machine learning",
    "Suggest books for learning Python",
    "I need resources for web development",
    "Modern architecture and structural design",
    "Clean code and distributed software systems"
  ];

  const categories = [
    'All',
    'AI & Data Science',
    'Classic Novels',
    'Emotional Fiction',
    'Fiction & Mystery',
    'Indian Literature',
    'Modern Novels',
    'Personal Growth',
    'Programming & Technology',
    'Spiritual & Wisdom'
  ];

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSearch = async (queryText) => {
    const q = queryText || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    setSearched(true);
    setQuery(q);

    try {
      const data = await api.aiFinder({
        query: q.trim(),
        category,
        availability,
        language,
        yearMin: yearMin ? parseInt(yearMin) : null
      });
      setResults(data.results || []);
      setSuggestions(data.suggestions || []);
      setExtractedKeywords(data.extractedKeywords || []);
    } catch (err) {
      console.error('AI Finder error:', err);
      setResults([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlanner = async (bookId, title) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      await api.addToVisitPlanner(bookId);
      showToast(`Added "${title}" to your Visit Planner!`);
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleToggleCompare = (bookId, title) => {
    if (onAddToCompare) {
      onAddToCompare(bookId);
      showToast(
        compareBookIds.includes(bookId)
          ? `Removed "${title}" from compare list`
          : `Added "${title}" to compare list (${compareBookIds.length + 1}/3)`
      );
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: isMobile ? '20px 12px 60px' : '40px 24px 80px' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '30px',
              right: isMobile ? '12px' : '30px',
              left: isMobile ? '12px' : 'auto',
              backgroundColor: toastMessage.isError ? 'var(--editorial-accent)' : 'var(--editorial-border)',
              color: toastMessage.isError ? '#FFFFFF' : 'var(--editorial-text)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-card)',
              padding: '12px 20px',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}
          >
            {toastMessage.isError ? <AlertCircle size={18} strokeWidth={2.4} /> : <Check size={18} strokeWidth={2.4} />}
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {/* Header */}
        <div style={{ maxWidth: '780px', margin: isMobile ? '0 auto 20px' : '0 auto 32px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: 'var(--editorial-border)',
              color: 'var(--editorial-text)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-sm)',
              fontSize: isMobile ? '0.70rem' : '0.78rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px'
            }}
          >
            <Sparkles size={14} strokeWidth={2.4} />
            TF-IDF Vector Space & Cosine Similarity Ranking
          </div>

          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: '10px', lineHeight: 1.2 }}>
            AI-Powered Book Finder
          </h1>

          <p style={{ fontSize: isMobile ? '0.85rem' : '1rem', color: 'var(--editorial-text)', opacity: 0.85, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
            Describe what you want to learn or study in natural language. Our NLP vector engine analyzes titles, syllabi, subject descriptions, and shelf catalog tags.
          </p>
        </div>

        {/* Natural Language Query Bar */}
        <div style={{ maxWidth: '860px', margin: '0 auto 16px' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-lg)',
              padding: isMobile ? '10px 12px' : '8px 12px',
              gap: isMobile ? '10px' : '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, paddingRight: isMobile ? '0' : '8px' }}>
              <Sparkles size={18} color="var(--editorial-accent)" strokeWidth={2.4} style={{ marginLeft: '4px', marginRight: '8px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={isMobile ? "Type study goal or keywords..." : "Type your study goal (e.g. web apps, ML, data science)..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  fontSize: isMobile ? '0.90rem' : '0.96rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  color: 'var(--editorial-text)',
                  padding: '4px 6px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', width: isMobile ? '100%' : 'auto', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline btn-sm"
                style={{ flex: isMobile ? 1 : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: isMobile ? '8px 12px' : undefined, whiteSpace: 'nowrap' }}
              >
                <Filter size={14} strokeWidth={2.2} /> Filters
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: isMobile ? 1 : 'none', padding: isMobile ? '8px 16px' : '10px 22px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}
              >
                {loading ? 'Analyzing...' : 'Search →'}
              </button>
            </div>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div
              style={{
                marginTop: '12px',
                padding: '16px 20px',
                backgroundColor: '#FFFFFF',
                border: '2.5px solid var(--editorial-text)',
                boxShadow: 'var(--shadow-card)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--editorial-text)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  style={{ padding: '6px 8px', fontSize: '0.84rem' }}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--editorial-text)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="form-control"
                  style={{ padding: '6px 8px', fontSize: '0.84rem' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available on Shelf Only</option>
                  <option value="unavailable">Waitlist / On Loan Only</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--editorial-text)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Min Publication Year
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2020"
                  value={yearMin}
                  onChange={(e) => setYearMin(e.target.value)}
                  className="form-control"
                  style={{ padding: '6px 8px', fontSize: '0.84rem' }}
                />
              </div>
            </div>
          )}

          {/* Sample queries pills */}
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--editorial-text)', fontWeight: 800, textTransform: 'uppercase' }}>Try asking:</span>
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(sample)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '4px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: 'var(--editorial-text)',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Extracted NLP Keywords Tagline */}
        {extractedKeywords.length > 0 && (
          <div
            style={{
              maxWidth: '760px',
              margin: '0 auto 28px',
              padding: '10px 16px',
              backgroundColor: 'var(--editorial-border)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              color: 'var(--editorial-text)',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontWeight: 900, textTransform: 'uppercase' }}>Extracted TF-IDF Terms:</span>
            {extractedKeywords.map((kw, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2px 8px',
                  border: '1px solid var(--editorial-text)',
                  fontFamily: 'monospace',
                  fontWeight: 700
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Results Section */}
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--editorial-text)' }}>
              <Sparkles size={36} color="var(--editorial-accent)" strokeWidth={2.4} style={{ animation: 'spin 2s linear infinite', marginBottom: '14px' }} />
              <p style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Computing cosine similarity vectors across collection...
              </p>
            </div>
          ) : searched && results.length === 0 ? (
            <div>
              <div
                style={{
                  padding: '36px 20px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-lg)',
                  textAlign: 'center',
                  marginBottom: '32px'
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <HelpCircle size={36} color="var(--editorial-accent)" strokeWidth={2.4} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', marginBottom: '8px' }}>
                  No Direct Catalog Match
                </h3>
                <p style={{ maxWidth: '440px', margin: '0 auto 16px', fontSize: '0.9rem', color: 'var(--editorial-text)', opacity: 0.85, fontWeight: 500 }}>
                  We could not find strong vector similarity for "{query}". Try queries related to Python, machine learning, data engineering, architecture, or web frameworks.
                </p>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '14px' }}>
                    Recommended Alternatives Available on Shelf:
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    {suggestions.map(s => (
                      <div
                        key={s.id}
                        style={{
                          padding: '18px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--editorial-border)',
                          boxShadow: 'var(--shadow-md)'
                        }}
                      >
                        <span className="badge badge-category" style={{ marginBottom: '6px' }}>{s.category}</span>
                        <h5 style={{ margin: '6px 0 4px', color: 'var(--editorial-text)', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>{s.title}</h5>
                        <p style={{ fontSize: '0.82rem', color: 'var(--editorial-text)', opacity: 0.8, marginBottom: '8px', fontWeight: 600 }}>by {s.author}</p>
                        <div style={{ fontSize: '0.78rem', color: 'var(--editorial-green)', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>
                          {s.floor} • {s.shelf}
                        </div>
                        <button
                          onClick={() => onViewBookDetails(s.id)}
                          className="btn btn-outline btn-sm"
                          style={{ width: '100%' }}
                        >
                          View Shelf Coordinates →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '20px' }}>
              {results.map((book, idx) => (
                <div
                  key={book.id}
                  style={{
                    padding: isMobile ? '14px 12px' : '24px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '12px' : '24px',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Book Thumbnail & Mobile Header */}
                  <div style={{ display: 'flex', gap: '12px', width: isMobile ? '100%' : 'auto', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: isMobile ? '72px' : '120px',
                        height: isMobile ? '98px' : '160px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        border: '1px solid var(--editorial-border)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <img
                        src={book.cover_image || getOfflineBookCover(book.title, book.author, book.category)}
                        alt={book.title}
                        onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {isMobile && (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '4px' }}>
                          <span className="badge badge-category" style={{ fontSize: '0.66rem', padding: '2px 6px' }}>{book.category}</span>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: 'var(--editorial-border)',
                              color: 'var(--editorial-text)',
                              padding: '2px 6px',
                              fontSize: '0.68rem',
                              fontWeight: 800
                            }}
                          >
                            <Sparkles size={11} strokeWidth={2.4} />
                            {book.score}%
                          </div>
                        </div>
                        <h3
                          style={{
                            fontSize: '0.96rem',
                            color: 'var(--editorial-text)',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            margin: '0 0 3px',
                            lineHeight: 1.25,
                            cursor: 'pointer'
                          }}
                          onClick={() => onViewBookDetails(book.id)}
                        >
                          {book.title}
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)', margin: 0 }}>
                          by <strong>{book.author}</strong> ({book.publication_year})
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Details & Similarity Explanation */}
                  <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                    {!isMobile && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span className="badge badge-category">{book.category}</span>
                            <span style={{ fontSize: '0.76rem', color: 'var(--editorial-text)', fontWeight: 800, textTransform: 'uppercase' }}>
                              Rank #{idx + 1}
                            </span>
                          </div>

                          {/* Similarity Score Pill */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: 'var(--editorial-border)',
                              color: 'var(--editorial-text)',
                              border: '1px solid var(--editorial-border)',
                              boxShadow: 'var(--shadow-sm)',
                              padding: '4px 10px',
                              fontSize: '0.78rem',
                              fontWeight: 900,
                              textTransform: 'uppercase'
                            }}
                          >
                            <Sparkles size={13} strokeWidth={2.4} />
                            {book.score}% Vector Match
                          </div>
                        </div>

                        <h3
                          style={{
                            fontSize: '1.3rem',
                            color: 'var(--editorial-text)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            marginBottom: '4px',
                            cursor: 'pointer'
                          }}
                          onClick={() => onViewBookDetails(book.id)}
                        >
                          {book.title}
                        </h3>

                        <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text)', opacity: 0.85, marginBottom: '12px', fontWeight: 600 }}>
                          by <strong>{book.author}</strong> ({book.publication_year})
                        </p>
                      </>
                    )}

                    {/* Why it matches */}
                    <div
                      style={{
                        padding: isMobile ? '8px 10px' : '10px 14px',
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        borderLeft: '4px solid var(--editorial-accent)',
                        borderTop: '1px solid var(--editorial-text)',
                        borderRight: '1px solid var(--editorial-text)',
                        borderBottom: '1px solid var(--editorial-text)',
                        fontSize: isMobile ? '0.78rem' : '0.84rem',
                        color: 'var(--editorial-text)',
                        fontWeight: 600,
                        marginBottom: isMobile ? '10px' : '14px'
                      }}
                    >
                      <strong>Why this matches:</strong> {book.matchReason}
                    </div>

                    {/* Shelf & Rack Location Tag */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: isMobile ? 'stretch' : 'center',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        gap: isMobile ? '8px' : '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--editorial-border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.76rem' : '0.82rem', color: 'var(--editorial-text)', fontWeight: 700, flexWrap: 'wrap' }}>
                        <MapPin size={14} color="var(--editorial-accent)" strokeWidth={2.4} />
                        <span>{book.floor} • {book.section} • <strong>{book.shelf}</strong> ({book.rack})</span>
                        {book.available_copies > 0 ? (
                          <span className="badge badge-available" style={{ marginLeft: '4px', fontSize: '0.68rem', padding: '2px 6px' }}>
                            ● {book.available_copies} on shelf
                          </span>
                        ) : (
                          <span className="badge badge-borrowed" style={{ marginLeft: '4px', fontSize: '0.68rem', padding: '2px 6px' }}>
                            ● On loan
                          </span>
                        )}
                      </div>

                      <div style={{ display: isMobile ? 'grid' : 'flex', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : undefined, gap: isMobile ? '6px' : '8px', width: isMobile ? '100%' : 'auto' }}>
                        <button
                          onClick={() => handleToggleCompare(book.id, book.title)}
                          className={`btn btn-sm ${compareBookIds.includes(book.id) ? 'btn-primary' : 'btn-outline'}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', padding: isMobile ? '6px 4px' : undefined, fontSize: isMobile ? '0.72rem' : undefined, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          <GitCompare size={13} strokeWidth={2.4} />
                          <span>{compareBookIds.includes(book.id) ? 'In Compare' : 'Compare'}</span>
                        </button>

                        <button
                          onClick={() => handleAddToPlanner(book.id, book.title)}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', padding: isMobile ? '6px 4px' : undefined, fontSize: isMobile ? '0.72rem' : undefined, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          <Compass size={13} strokeWidth={2.4} />
                          <span>Add Visit</span>
                        </button>

                        <button
                          onClick={() => onViewBookDetails(book.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', padding: isMobile ? '6px 4px' : undefined, fontSize: isMobile ? '0.72rem' : undefined, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          <span>Details</span> <ArrowRight size={13} strokeWidth={2.4} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
