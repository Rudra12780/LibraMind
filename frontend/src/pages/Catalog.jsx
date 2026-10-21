import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, SlidersHorizontal, BookOpen, AlertCircle, Check } from 'lucide-react';

export default function Catalog({
  initialQuery = '',
  onViewBookDetails,
  onNavigate,
  onAddToCompare,
  compareBookIds = []
}) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availability, setAvailability] = useState('all'); // 'all', 'available', 'unavailable'
  const [sortBy, setSortBy] = useState('title_asc');
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getBooks({
        q: search,
        category: selectedCategory,
        availability,
        sort: sortBy
      });
      setBooks(data.books || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, availability, sortBy]);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const items = await api.getWishlist();
      setWishlistIds(new Set(items.map(i => i.id)));
    } catch (err) {
      console.error('Wishlist fetch error', err);
    }
  }, [user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleToggleWishlist = async (bookId) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      if (wishlistIds.has(bookId)) {
        await api.removeFromWishlist(bookId);
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.delete(bookId);
          return next;
        });
        showToast('Removed from your wishlist');
      } else {
        await api.addToWishlist(bookId);
        setWishlistIds(prev => new Set(prev).add(bookId));
        showToast('Added to your wishlist!');
      }
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleQuickReserve = async (bookId) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      const res = await api.placeReservation(bookId);
      showToast(res.message || `Hold confirmed! Queue position: #${res.queuePosition}`);
      fetchBooks();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleAddToPlanner = async (bookId) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      await api.addToVisitPlanner(bookId);
      showToast('Book added to your Visit Planner!');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleToggleCompare = (bookId) => {
    if (onAddToCompare) {
      onAddToCompare(bookId);
      showToast(
        compareBookIds.includes(bookId)
          ? 'Removed from compare list'
          : `Added to compare list (${compareBookIds.length + 1}/3)`
      );
    }
  };

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 60px' }}>
      {/* Toast Notification */}
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
            fontSize: '0.9rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {toastMessage.isError ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
          Library Book Catalog
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted-text)', maxWidth: '640px' }}>
          Explore our collection. View real-time availability, exact physical shelf and rack positions, or place reservations when copies are on loan.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="bio-card"
        style={{
          padding: '20px',
          marginBottom: '32px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <Search
              size={18}
              color="var(--sage)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, author, ISBN, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* Availability Toggle */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'available', label: 'Available Only' },
              { id: 'unavailable', label: 'In Waiting' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setAvailability(opt.id)}
                style={{
                  padding: '9px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: availability === opt.id ? 'var(--forest)' : 'var(--subtle-border)',
                  backgroundColor: availability === opt.id ? 'var(--soft-sage)' : '#FFFFFF',
                  color: availability === opt.id ? 'var(--forest-dark)' : 'var(--muted-text)',
                  fontSize: '0.86rem',
                  fontWeight: availability === opt.id ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="title_asc">Title: A to Z</option>
              <option value="title_desc">Title: Z to A</option>
              <option value="popularity">Most Borrowed</option>
              <option value="year_desc">Newest Year</option>
              <option value="year_asc">Oldest Year</option>
            </select>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid rgba(52, 78, 65, 0.08)' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Categories:
          </span>
          <button
            onClick={() => setSelectedCategory('All')}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: selectedCategory === 'All' ? 'var(--forest)' : 'var(--warm-beige)',
              color: selectedCategory === 'All' ? '#FFFFFF' : 'var(--forest-dark)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            All ({categories.length})
          </button>

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: selectedCategory === cat ? 'var(--forest)' : 'var(--warm-beige)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--forest-dark)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--muted-text)' }}>
          Showing <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-text)' }}>
          Loading catalog items...
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <BookOpen size={28} />
          </div>
          <h3 style={{ marginBottom: '6px' }}>No books found</h3>
          <p style={{ maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
            We couldn't find any titles matching "{search}". Try searching with different keywords or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setAvailability('all');
            }}
            className="btn btn-primary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '24px'
          }}
        >
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onViewDetails={onViewBookDetails}
              onReserve={handleQuickReserve}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlistIds.has(book.id)}
              onToggleCompare={handleToggleCompare}
              isCompared={compareBookIds.includes(book.id)}
              onAddToPlanner={handleAddToPlanner}
            />
          ))}
        </div>
      )}
    </div>
  );
}
