import React, { useState } from 'react';
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

  const sampleQueries = [
    "Find beginner-friendly books about machine learning",
    "Suggest books for learning Python",
    "I need resources for web development",
    "Modern architecture and structural design",
    "Clean code and distributed software systems"
  ];

  const categories = [
    'All',
    'Computer Science',
    'Artificial Intelligence',
    'Architecture & Design',
    'Data Science',
    'Software Engineering',
    'Mathematics'
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
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '40px 24px 80px' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
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
        <div style={{ maxWidth: '780px', margin: '0 auto 32px', textAlign: 'center' }}>
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
              fontSize: '0.78rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '16px'
            }}
          >
            <Sparkles size={15} strokeWidth={2.4} />
            TF-IDF Vector Space & Cosine Similarity Ranking
          </div>

          <h1 style={{ fontSize: '2.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: '14px' }}>
            AI-Powered Book Finder
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--editorial-text)', opacity: 0.85, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Describe what you want to learn or study in natural language. Our NLP vector engine analyzes titles, syllabi, subject descriptions, and shelf catalog tags.
          </p>
        </div>

        {/* Natural Language Query Bar */}
        <div style={{ maxWidth: '760px', margin: '0 auto 16px' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px 12px'
            }}
          >
            <Sparkles size={20} color="var(--editorial-accent)" strokeWidth={2.4} style={{ marginLeft: '6px', marginRight: '8px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Type your study goal (e.g. 'I want to build web apps' or 'begin machine learning')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.98rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                color: 'var(--editorial-text)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline btn-sm"
              style={{ marginRight: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Filter size={14} strokeWidth={2.2} /> Filters
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
            >
              {loading ? 'Analyzing...' : 'Search →'}
            </button>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {results.map((book, idx) => (
                <div
                  key={book.id}
                  style={{
                    padding: '24px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Book Thumbnail */}
                  <div
                    style={{
                      width: '120px',
                      height: '160px',
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
                    />
                  </div>

                  {/* Details & Similarity Explanation */}
                  <div style={{ flex: 1, minWidth: '260px' }}>
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

                    {/* Why it matches */}
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        borderLeft: '4px solid var(--editorial-accent)',
                        borderTop: '1px solid var(--editorial-text)',
                        borderRight: '1px solid var(--editorial-text)',
                        borderBottom: '1px solid var(--editorial-text)',
                        fontSize: '0.84rem',
                        color: 'var(--editorial-text)',
                        fontWeight: 600,
                        marginBottom: '14px'
                      }}
                    >
                      <strong>Why this matches:</strong> {book.matchReason}
                    </div>

                    {/* Shelf & Rack Location Tag */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--editorial-border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--editorial-text)', fontWeight: 700 }}>
                        <MapPin size={15} color="var(--editorial-accent)" strokeWidth={2.4} />
                        <span>{book.floor} • {book.section} • <strong>{book.shelf}</strong> ({book.rack})</span>
                        {book.available_copies > 0 ? (
                          <span className="badge badge-available" style={{ marginLeft: '6px' }}>
                            ● {book.available_copies} on shelf
                          </span>
                        ) : (
                          <span className="badge badge-borrowed" style={{ marginLeft: '6px' }}>
                            ● On loan
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleToggleCompare(book.id, book.title)}
                          className={`btn btn-sm ${compareBookIds.includes(book.id) ? 'btn-primary' : 'btn-outline'}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <GitCompare size={14} strokeWidth={2.4} />
                          {compareBookIds.includes(book.id) ? 'In Compare' : 'Compare'}
                        </button>

                        <button
                          onClick={() => handleAddToPlanner(book.id, book.title)}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Compass size={14} strokeWidth={2.4} /> Add to Visit
                        </button>

                        <button
                          onClick={() => onViewBookDetails(book.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          Details <ArrowRight size={14} strokeWidth={2.4} />
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
