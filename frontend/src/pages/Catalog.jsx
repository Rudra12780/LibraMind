import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { api } from '../api';
import BookCard from '../components/BookCard';
import CircularBookCarousel from '../components/CircularBookCarousel';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, SlidersHorizontal, BookOpen, AlertCircle, Check, BookPlus, X, PlusCircle, RotateCcw, LayoutGrid, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function Catalog({
  initialQuery = '',
  initialCategory = 'All',
  onCategoryChange,
  onViewBookDetails,
  onNavigate,
  onAddToCompare,
  compareBookIds = []
}) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState(() => (user ? 'circular' : 'grid'));

  useEffect(() => {
    if (user) {
      setViewMode('circular');
    }
  }, [user]);

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([
    'AI & Data Science',
    'Classic Novels',
    'Emotional Fiction',
    'Fiction & Mystery',
    'Indian Literature',
    'Modern Novels',
    'Personal Growth',
    'Programming & Technology',
    'Spiritual & Wisdom'
  ]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);
  const categoryScrollRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [availability, setAvailability] = useState('all'); // 'all', 'available', 'unavailable'
  const [sortBy, setSortBy] = useState('title_asc');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [userBorrowedBookIds, setUserBorrowedBookIds] = useState(new Set());
  const [userReservedBookIds, setUserReservedBookIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
    }
  };

  // Add Book state for Admin / Librarian
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingBook, setAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({
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

  // In-memory instant client cache for zero-latency filter & category switching
  const booksCache = React.useRef(new Map());

  // Debounce search input by 220ms to eliminate server lag & request floods
  useEffect(() => {
    if (searchTerm !== search) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setSearch(searchTerm);
        setIsSearching(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, search]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchTerm(initialQuery);
      setSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  const handleViewBook = (bookId) => {
    if (onViewBookDetails) {
      onViewBookDetails(bookId, { fromPage: 'catalog', fromCategory: selectedCategory });
    }
  };

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

  const fetchBooks = useCallback(async (bypassCache = false) => {
    const cacheKey = `${search}_${selectedCategory}_${availability}_${sortBy}_${user?.id || 'guest'}`;
    if (!bypassCache && booksCache.current.has(cacheKey)) {
      const cached = booksCache.current.get(cacheKey);
      setBooks(cached.books || []);
      if (cached.categories && cached.categories.length) {
        setCategories(cached.categories);
      }
      if (cached.categoryCounts) {
        setCategoryCounts(cached.categoryCounts);
      }
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const targetUserId = user?.id || user?._id;
      const data = await api.getBooks({
        q: search,
        category: selectedCategory,
        availability,
        sort: sortBy,
        limit: 200,
        ...(availability === 'my_loans' && targetUserId ? { userId: targetUserId } : {})
      });
      booksCache.current.set(cacheKey, data);
      let fetchedBooks = data.books || [];
      if (availability === 'my_loans') {
        fetchedBooks = fetchedBooks.filter(b => {
          const bId = b.id !== undefined ? b.id : b._id;
          return userBorrowedBookIds.has(bId) || userBorrowedBookIds.has(String(bId));
        });
      } else if (availability === 'borrowed') {
        fetchedBooks = fetchedBooks.filter(b => (b.available_copies !== undefined && b.available_copies < b.total_copies) || b.available_copies === 0 || b.is_borrowed);
      }
      setBooks(fetchedBooks);
      if (data.categories && data.categories.length) {
        setCategories(data.categories);
      }
      if (data.categoryCounts) {
        setCategoryCounts(data.categoryCounts);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, availability, sortBy, user]);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const items = await api.getWishlist();
      const ids = new Set();
      (items || []).forEach(i => {
        if (i.id !== undefined) ids.add(i.id);
        if (i.id !== undefined) ids.add(String(i.id));
        if (i.sqlite_id !== undefined) ids.add(i.sqlite_id);
      });
      setWishlistIds(ids);
    } catch (err) {
      console.error('Wishlist fetch error', err);
    }
  }, [user]);

  const fetchUserLoans = useCallback(async () => {
    if (!user) {
      setUserBorrowedBookIds(new Set());
      return;
    }
    try {
      const loansData = await api.getLoans();
      const active = (loansData || []).filter(l => l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue' || l.is_active);
      const ids = new Set();
      active.forEach(l => {
        const rawId = l.book_id && typeof l.book_id === 'object' ? (l.book_id._id || l.book_id.id) : l.book_id;
        if (rawId !== undefined && rawId !== null) {
          ids.add(rawId);
          ids.add(String(rawId));
        }
        if (l.sqlite_book_id !== undefined && l.sqlite_book_id !== null) {
          ids.add(l.sqlite_book_id);
          ids.add(String(l.sqlite_book_id));
        }
      });
      setUserBorrowedBookIds(ids);
    } catch (err) {
      console.error('User loans fetch error', err);
    }
  }, [user]);

  const fetchUserReservations = useCallback(async () => {
    if (!user) {
      setUserReservedBookIds(new Set());
      return;
    }
    try {
      const resData = await api.getReservations();
      const activeHolds = (resData || []).filter(r => r.status === 'waiting' || r.status === 'ready_for_pickup' || r.status === 'ready');
      const ids = new Set();
      activeHolds.forEach(r => {
        const rawId = r.book_id && typeof r.book_id === 'object' ? (r.book_id._id || r.book_id.id) : r.book_id;
        if (rawId !== undefined && rawId !== null) {
          ids.add(rawId);
          ids.add(String(rawId));
        }
        if (r.sqlite_book_id !== undefined && r.sqlite_book_id !== null) {
          ids.add(r.sqlite_book_id);
          ids.add(String(r.sqlite_book_id));
        }
      });
      setUserReservedBookIds(ids);
    } catch (err) {
      console.error('User reservations fetch error', err);
    }
  }, [user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchWishlist();
    fetchUserLoans();
    fetchUserReservations();

    const handleDataUpdate = () => {
      fetchBooks();
      fetchUserLoans();
      fetchUserReservations();
      fetchWishlist();
    };
    window.addEventListener('libramind:data-updated', handleDataUpdate);
    let bc;
    try {
      bc = new BroadcastChannel('libramind_sync');
      bc.onmessage = () => {
        fetchBooks();
        fetchUserLoans();
        fetchUserReservations();
        fetchWishlist();
      };
    } catch (e) {}

    return () => {
      window.removeEventListener('libramind:data-updated', handleDataUpdate);
      if (bc) bc.close();
    };
  }, [fetchBooks, fetchWishlist, fetchUserLoans, fetchUserReservations]);

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

  const handleQuickBorrow = async (book) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      const res = await api.checkoutBook({ book_id: book.id });
      showToast(`Success! Checked out "${book.title}" (Copy: ${res.copyCode}). Due in 14 days.`);
      fetchBooks();
      fetchUserLoans();
      window.dispatchEvent(new CustomEvent('libramind:data-updated', { detail: { bookId: book.id } }));
      try { const bc = new BroadcastChannel('libramind_sync'); bc.postMessage({ type: 'UPDATE', bookId: book.id }); bc.close(); } catch(e){}
    } catch (err) {
      showToast(err.message || 'Checkout failed', true);
    }
  };

  const handleQuickReturn = async (book) => {
    if (!user) return;
    try {
      const loansData = await api.getLoans();
      const active = (loansData || []).find(l => l.book_id === book.id && (l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue'));
      if (!active) {
        showToast('Active loan not found for this volume', true);
        return;
      }
      await api.returnBook(active.id);
      showToast(`Returned "${book.title}". You can now directly borrow this book a second time!`);
      fetchBooks();
      fetchUserLoans();
      window.dispatchEvent(new CustomEvent('libramind:data-updated', { detail: { bookId: book.id } }));
      try { const bc = new BroadcastChannel('libramind_sync'); bc.postMessage({ type: 'UPDATE', bookId: book.id }); bc.close(); } catch(e){}
    } catch (err) {
      showToast(err.message || 'Return failed', true);
    }
  };

  const handleQuickReserve = async (bookId) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    if (userReservedBookIds.has(bookId) || userReservedBookIds.has(String(bookId))) {
      showToast('You are already on the waiting list for this volume.', true);
      return;
    }

    try {
      const res = await api.placeReservation(bookId);
      showToast(res.message || `Hold confirmed! Queue position: #${res.queuePosition}`);
      setUserReservedBookIds(prev => new Set([...prev, bookId, String(bookId)]));
      fetchBooks();
      fetchUserReservations();
      window.dispatchEvent(new CustomEvent('libramind:data-updated', { detail: { bookId } }));
      try { const bc = new BroadcastChannel('libramind_sync'); bc.postMessage({ type: 'UPDATE', bookId }); bc.close(); } catch(e){}
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
          <h1
            className="catalog-title"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--forest-dark)',
              marginBottom: '8px',
              fontFamily: "var(--font-oswald), 'BBH Bogle', 'Space Grotesk', sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              lineHeight: 1.10
            }}
          >
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

      {/* Search & Filter Toolbar (Maximalist Control Deck) */}
      <div
        className="bio-card"
        style={{
          padding: '20px',
          marginBottom: '32px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-card)',
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
              color="var(--editorial-text)"
              strokeWidth={2.4}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, author, ISBN, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '42px', fontWeight: 600 }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSearch('');
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--editorial-text-muted)'
                }}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter & Responsive Mobile Swiper */}
        <div
          className="catalog-category-bar-wrapper"
          style={{
            paddingTop: '12px',
            borderTop: '1px solid var(--editorial-border)',
            position: 'relative',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            {/* Scroll Left Button for desktop/tablets */}
            <button
              onClick={() => scrollCategories('left')}
              className="hide-on-mobile"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid var(--editorial-border)',
                backgroundColor: '#FFFFFF',
                color: 'var(--editorial-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(37, 40, 32, 0.05)'
              }}
              title="Scroll categories left"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Horizontally Scrollable Category Pill Container */}
            <div
              ref={categoryScrollRef}
              className="catalog-category-scroll-strip"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                flexWrap: 'nowrap',
                padding: '4px 2px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                flex: 1
              }}
            >
              {/* "All" Category Pill */}
              <button
                onClick={() => handleSelectCategory('All')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  backgroundColor: selectedCategory === 'All' ? 'var(--editorial-green)' : '#FFFFFF',
                  color: selectedCategory === 'All' ? '#FFFFFF' : 'var(--editorial-text)',
                  border: `1.5px solid ${selectedCategory === 'All' ? 'var(--editorial-green)' : 'var(--editorial-border)'}`,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: selectedCategory === 'All' ? '0 3px 10px rgba(38, 61, 50, 0.22)' : '0 1px 3px rgba(37, 40, 32, 0.04)',
                  transition: 'all 0.2s ease',
                  touchAction: 'manipulation'
                }}
              >
                <span>All Books</span>
              </button>

              {/* Dynamic Category Pills */}
              {categories
                .filter(cat => cat && cat.toLowerCase() !== 'all')
                .map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleSelectCategory(cat)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 18px',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? 'var(--editorial-green)' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : 'var(--editorial-text)',
                        border: `1.5px solid ${isSelected ? 'var(--editorial-green)' : 'var(--editorial-border)'}`,
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: isSelected ? '0 3px 10px rgba(38, 61, 50, 0.22)' : '0 1px 3px rgba(37, 40, 32, 0.04)',
                        transition: 'all 0.2s ease',
                        touchAction: 'manipulation'
                      }}
                    >
                      <span>{cat}</span>
                    </button>
                  );
                })}
            </div>

            {/* Scroll Right Button for desktop/tablets */}
            <button
              onClick={() => scrollCategories('right')}
              className="hide-on-mobile"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid var(--editorial-border)',
                backgroundColor: '#FFFFFF',
                color: 'var(--editorial-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(37, 40, 32, 0.05)'
              }}
              title="Scroll categories right"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Full Category Grid Modal / Sheet */}
      {showCategoryDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(28, 15, 10, 0.65)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowCategoryDrawer(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg, 12px)',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 48px rgba(37, 40, 32, 0.22)',
              border: '1.5px solid var(--editorial-border)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--editorial-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--editorial-bg)'
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.20rem', fontWeight: 800, color: 'var(--editorial-text)' }}>
                  Library Chambers &amp; Categories
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>
                  Select any category to filter the library stacks
                </p>
              </div>
              <button
                onClick={() => setShowCategoryDrawer(false)}
                className="btn btn-outline"
                style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Categories Grid */}
            <div
              style={{
                padding: '16px 20px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '10px'
              }}
            >
              {/* All Books Option */}
              <div
                onClick={() => {
                  handleSelectCategory('All');
                  setShowCategoryDrawer(false);
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: `1.5px solid ${selectedCategory === 'All' ? 'var(--editorial-green)' : 'var(--editorial-border)'}`,
                  backgroundColor: selectedCategory === 'All' ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={16} color={selectedCategory === 'All' ? 'var(--editorial-green)' : 'var(--editorial-text-muted)'} />
                  <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--editorial-text)' }}>
                    All Books Collection
                  </span>
                </div>
              </div>

              {/* Dynamic categories */}
              {categories
                .filter(cat => cat && cat.toLowerCase() !== 'all')
                .map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <div
                      key={cat}
                      onClick={() => {
                        handleSelectCategory(cat);
                        setShowCategoryDrawer(false);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm, 6px)',
                        border: `1.5px solid ${isSelected ? 'var(--editorial-green)' : 'var(--editorial-border)'}`,
                        backgroundColor: isSelected ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.84rem', color: isSelected ? 'var(--editorial-green)' : 'var(--editorial-text)' }}>
                        {cat}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* View Mode Switcher */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* View Mode Toggle Switcher */}
        <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)', padding: '2px', boxShadow: 'var(--shadow-sm)' }}>
          <button
            onClick={() => setViewMode('circular')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: viewMode === 'circular' ? 700 : 500,
              backgroundColor: viewMode === 'circular' ? 'var(--editorial-green)' : 'transparent',
              color: viewMode === 'circular' ? '#FFFFFF' : 'var(--editorial-text)',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            title="360° Bookshelf Carousel view"
          >
            <RotateCcw size={13} />
            <span>360° Bookshelf</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: viewMode === 'grid' ? 700 : 500,
              backgroundColor: viewMode === 'grid' ? 'var(--editorial-green)' : 'transparent',
              color: viewMode === 'grid' ? '#FFFFFF' : 'var(--editorial-text)',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            title="Standard Stacks Grid view"
          >
            <LayoutGrid size={13} />
            <span>Standard Grid</span>
          </button>
        </div>
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
              setSearchTerm('');
              setSearch('');
              setSelectedCategory('All');
              setAvailability('all');
            }}
            className="btn btn-primary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'circular' ? (
        <div style={{ marginTop: '16px', paddingTop: '8px', overflow: 'visible', width: '100%' }}>
          <CircularBookCarousel
            books={books}
            category={selectedCategory}
            onViewDetails={handleViewBook}
            onBorrow={handleQuickBorrow}
            onReturn={handleQuickReturn}
            onReserve={handleQuickReserve}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onToggleCompare={handleToggleCompare}
            compareBookIds={compareBookIds}
            onAddToPlanner={handleAddToPlanner}
            userBorrowedBookIds={userBorrowedBookIds}
            userReservedBookIds={userReservedBookIds}
          />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 100%, 300px), 1fr))',
            gap: '24px'
          }}
        >
          {books.map(book => {
            const bId = book.id !== undefined ? book.id : book._id;
            return (
              <BookCard
                key={bId}
                book={book}
                onViewDetails={handleViewBook}
                onBorrow={handleQuickBorrow}
                onReturn={handleQuickReturn}
                onReserve={handleQuickReserve}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistIds.has(bId) || wishlistIds.has(String(bId))}
                onToggleCompare={handleToggleCompare}
                isCompared={compareBookIds.some(id => String(id) === String(bId))}
                onAddToPlanner={handleAddToPlanner}
                isBorrowedByUser={userBorrowedBookIds.has(bId) || userBorrowedBookIds.has(String(bId))}
                isReservedByUser={userReservedBookIds.has(bId) || userReservedBookIds.has(String(bId))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
