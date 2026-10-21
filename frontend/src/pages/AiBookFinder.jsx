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
    "Biophilic design and sustainable architecture",
    "Writing clean software and distributed systems"
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
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: toastMessage.isError ? '#C5221F' : 'var(--forest)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          {toastMessage.isError ? <AlertCircle size={18} /> : <Check size={18} />}
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
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--soft-sage)',
            color: 'var(--forest-dark)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}
        >
          <Sparkles size={16} color="var(--botanical)" />
          TF-IDF Vector Space & Cosine Similarity Ranking
        </div>

        <h1 style={{ fontSize: '2.6rem', color: 'var(--forest-dark)', marginBottom: '14px' }}>
          AI-Powered Book Finder
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--muted-text)', lineHeight: 1.6 }}>
          Describe what you want to learn or study in plain natural language. Our NLP vector engine analyzes titles, syllabi, subject descriptions, and shelf catalog tags to pinpoint the best books.
        </p>
      </div>

      {/* Natural Language Query Bar */}
      <div style={{ maxWidth: '740px', margin: '0 auto 16px' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="bio-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            boxShadow: '0 8px 30px rgba(52, 78, 65, 0.1)',
            border: '2px solid var(--forest)'
          }}
        >
          <Sparkles size={20} color="var(--botanical)" style={{ marginLeft: '8px', marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Type your study goal (e.g. 'I want to build modern web apps' or 'begin machine learning')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline btn-sm"
            style={{ marginRight: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Filter size={14} /> Filters
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '10px 24px' }}
          >
            {loading ? 'Analyzing...' : 'Search with AI'}
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div
            className="bio-card"
            style={{
              marginTop: '12px',
              padding: '16px 20px',
              backgroundColor: '#FFFFFF',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '14px',
              border: '1px solid var(--subtle-border)'
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--forest-dark)', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--subtle-border)', fontSize: '0.84rem' }}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--forest-dark)', marginBottom: '4px' }}>
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--subtle-border)', fontSize: '0.84rem' }}
              >
                <option value="all">All Statuses</option>
                <option value="available">Available on Shelf Only</option>
                <option value="unavailable">Waitlist / On Loan Only</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--forest-dark)', marginBottom: '4px' }}>
                Min Publication Year
              </label>
              <input
                type="number"
                placeholder="e.g. 2020"
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--subtle-border)', fontSize: '0.84rem' }}
              />
            </div>
          </div>
        )}

        {/* Sample queries pills */}
        <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>Try asking:</span>
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(sample)}
              style={{
                backgroundColor: 'var(--cream)',
                border: '1px solid var(--subtle-border)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                fontSize: '0.78rem',
                color: 'var(--forest-dark)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
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
            maxWidth: '740px',
            margin: '0 auto 32px',
            padding: '10px 16px',
            backgroundColor: 'var(--soft-sage-light)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--soft-sage)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: 'var(--forest-dark)',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontWeight: 700 }}>Extracted TF-IDF Terms:</span>
          {extractedKeywords.map((kw, i) => (
            <span
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--subtle-border)',
                fontFamily: 'monospace'
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Results Section */}
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-text)' }}>
            <Sparkles size={32} color="var(--botanical)" style={{ animation: 'spin 2s linear infinite', marginBottom: '12px' }} />
            <p>Computing cosine similarity vectors across library collection...</p>
          </div>
        ) : searched && results.length === 0 ? (
          <div>
            <div className="empty-state" style={{ marginBottom: '32px' }}>
              <div className="empty-state-icon">
                <HelpCircle size={28} />
              </div>
              <h3 style={{ marginBottom: '6px' }}>No direct catalog match</h3>
              <p style={{ maxWidth: '440px', margin: '0 auto 16px', fontSize: '0.9rem' }}>
                We could not find strong vector similarity for "{query}". Try queries related to Python, machine learning, data engineering, architecture, or web frameworks.
              </p>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--forest-dark)', marginBottom: '12px' }}>
                  Recommended Alternatives Available on Shelf:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  {suggestions.map(s => (
                    <div
                      key={s.id}
                      className="bio-card"
                      style={{ padding: '16px', backgroundColor: '#FFFFFF' }}
                    >
                      <span className="badge badge-category" style={{ marginBottom: '6px' }}>{s.category}</span>
                      <h5 style={{ margin: '4px 0', color: 'var(--forest-dark)', fontSize: '0.96rem' }}>{s.title}</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginBottom: '8px' }}>by {s.author}</p>
                      <div style={{ fontSize: '0.78rem', color: 'var(--botanical)', fontWeight: 600, marginBottom: '10px' }}>
                        {s.floor} • {s.shelf}
                      </div>
                      <button
                        onClick={() => onViewBookDetails(s.id)}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%' }}
                      >
                        View Shelf Coordinates
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
                className="bio-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
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
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: 'var(--warm-beige)',
                    boxShadow: '0 4px 12px rgba(52, 78, 65, 0.12)'
                  }}
                >
                  <img
                    src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                    alt={book.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details & Similarity Explanation */}
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className="badge badge-category">{book.category}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                        Rank #{idx + 1}
                      </span>
                    </div>

                    {/* Similarity Score Pill */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--status-available-bg)',
                        color: 'var(--status-available-text)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <Sparkles size={14} />
                      {book.score}% Vector Relevance Match
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      color: 'var(--forest-dark)',
                      marginBottom: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => onViewBookDetails(book.id)}
                  >
                    {book.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '12px' }}>
                    by <strong style={{ color: 'var(--dark-text)' }}>{book.author}</strong> ({book.publication_year})
                  </p>

                  {/* Why it matches */}
                  <div
                    style={{
                      padding: '10px 14px',
                      backgroundColor: 'var(--warm-beige-light)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--botanical)',
                      fontSize: '0.84rem',
                      color: 'var(--forest-dark)',
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
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(52, 78, 65, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--forest-dark)' }}>
                      <MapPin size={15} color="var(--botanical)" />
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
                        <GitCompare size={14} />
                        {compareBookIds.includes(book.id) ? 'In Compare' : 'Compare'}
                      </button>

                      <button
                        onClick={() => handleAddToPlanner(book.id, book.title)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Compass size={14} /> Add to Visit
                      </button>

                      <button
                        onClick={() => onViewBookDetails(book.id)}
                        className="btn btn-botanical btn-sm"
                      >
                        View Details <ArrowRight size={14} />
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
  );
}
