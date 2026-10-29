import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, SlidersHorizontal, BookOpen, AlertCircle, Check, BookPlus, X, PlusCircle } from 'lucide-react';

export default function Catalog({
  initialQuery = '',
  initialCategory = 'All',
  onViewBookDetails,
  onNavigate,
  onAddToCompare,
  compareBookIds = []
}) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [availability, setAvailability] = useState('all'); // 'all', 'available', 'unavailable'
  const [sortBy, setSortBy] = useState('title_asc');
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  // Add Book state for Admin / Librarian
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingBook, setAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: 2024,
    category: 'Story Books',
    edition: '1st Edition',
    language: 'English',
    floor: 'Floor 1',
    section: 'Main Hall',
    shelf: 'Shelf A-01',
    rack: 'Rack 01',
    total_copies: 2,
    description: '',
    cover_image: ''
  });

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setAddingBook(true);
    try {
      const res = await api.createBook(newBook);
      showToast(`Book "${newBook.title}" added to catalog with ${newBook.total_copies} physical copies!`);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publication_year: 2024,
        category: 'Classic Novels',
        edition: '1st Edition',
        language: 'English',
        floor: 'Floor 1',
        section: 'Main Hall',
        shelf: 'Shelf A-01',
        rack: 'Rack 01',
        total_copies: 2,
        description: '',
        cover_image: ''
      });
      setShowAddModal(false);
      await fetchBooks();
      if (res?.book?.id) {
        onViewBookDetails(res.book.id);
      }
    } catch (err) {
      showToast(err.message || 'Failed to add book', true);
    } finally {
      setAddingBook(false);
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
            Library Book Catalog
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--muted-text)', maxWidth: '640px', margin: 0 }}>
            Explore our collection. View real-time availability, exact physical shelf and rack positions, or place reservations when copies are on loan.
          </p>
        </div>

        {user && (user.role === 'admin' || user.role === 'librarian') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
          >
            <BookPlus size={18} />
            + Add New Book
          </button>
        )}
      </div>

      {/* Add Book Modal for Admin/Librarian */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3500,
            padding: '20px'
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bio-card"
            style={{
              width: '640px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted-text)'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FAF8F1'
                }}
              >
                <BookPlus size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--forest-dark)', margin: 0 }}>
                  Add New Book to Catalog
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  Entry will immediately be visible, searchable, and openable in the catalog.
                </span>
              </div>
            </div>

            <form onSubmit={handleAddBook}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. The Night Circus"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Author *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Erin Morgenstern"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>ISBN-13 *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 978-0385534635"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Category *</label>
                  <select
                    className="form-control"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  >
                    <option value="Classic Novels">Classic Novels</option>
                    <option value="Emotional Fiction">Emotional Fiction</option>
                    <option value="Spiritual & Wisdom">Spiritual & Wisdom</option>
                    <option value="Modern Novels">Modern Novels</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Year</label>
                  <input
                    type="number"
                    min="1800"
                    max="2099"
                    className="form-control"
                    value={newBook.publication_year}
                    onChange={(e) => setNewBook({ ...newBook, publication_year: parseInt(e.target.value) || 2024 })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Copies *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="form-control"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Floor</label>
                  <select
                    className="form-control"
                    value={newBook.floor}
                    onChange={(e) => setNewBook({ ...newBook, floor: e.target.value })}
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Section</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Main Hall"
                    value={newBook.section}
                    onChange={(e) => setNewBook({ ...newBook, section: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Shelf Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Shelf CS-01"
                    value={newBook.shelf}
                    onChange={(e) => setNewBook({ ...newBook, shelf: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Rack</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rack 01"
                    value={newBook.rack}
                    onChange={(e) => setNewBook({ ...newBook, rack: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Upload Cover Photo from Device (Offline Accessible)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setNewBook({ ...newBook, cover_image: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {newBook.cover_image && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--botanical)', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                    ✓ Device image loaded (Saved locally for offline viewing)
                  </span>
                )}
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Book Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Summary of storyline, characters, topics covered..."
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingBook}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <PlusCircle size={15} />
                  {addingBook ? 'Adding Book...' : 'Save Book to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
