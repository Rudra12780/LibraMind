import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  GitCompare,
  X,
  Plus,
  BookOpen,
  MapPin,
  Calendar,
  Layers,
  Bookmark,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function BookCompare({
  compareBookIds = [],
  onRemoveBook,
  onClearCompare,
  onAddBookById,
  onViewBookDetails,
  onNavigate
}) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedAddId, setSelectedAddId] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch details of books in compare list
        const fetched = await Promise.all(
          compareBookIds.map(id => api.getBook(id).catch(() => null))
        );
        setBooks(fetched.filter(Boolean));

        // Also fetch catalog books so student can add another book to compare
        const catalogRes = await api.getBooks({ limit: 50 });
        setAvailableBooks(catalogRes.books || []);
      } catch (err) {
        console.error('Failed to load comparison books', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [compareBookIds]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdd = () => {
    if (!selectedAddId) return;
    if (books.some(b => b.id === parseInt(selectedAddId))) {
      showToast('This book is already in the comparison.', true);
      return;
    }
    if (books.length >= 3) {
      showToast('You can compare a maximum of 3 books at once.', true);
      return;
    }
    onAddBookById(parseInt(selectedAddId));
    setSelectedAddId('');
  };

  const handleReserve = async (bookId, title) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      const res = await api.placeReservation(bookId);
      showToast(res.message || `Hold confirmed for "${title}"`);
    } catch (err) {
      showToast(err.message, true);
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
          {toastMessage.isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <GitCompare size={16} /> Discovery & Analysis
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginTop: '4px', marginBottom: '8px' }}>
            Book Match & Compare
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '1rem', margin: 0, maxWidth: '640px' }}>
            Compare up to 3 library books side-by-side using verified catalog records, physical shelf stacks, editions, and real-time copy availability.
          </p>
        </div>

        {books.length > 0 && (
          <button
            onClick={onClearCompare}
            className="btn btn-outline btn-sm"
          >
            Clear All ({books.length})
          </button>
        )}
      </div>

      {/* Book Adder Bar */}
      {books.length < 3 && (
        <div
          className="bio-card"
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--forest-dark)' }}>
            Add book to comparison ({books.length}/3 selected):
          </span>
          <select
            value={selectedAddId}
            onChange={(e) => setSelectedAddId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--subtle-border)',
              backgroundColor: 'var(--cream)',
              flex: 1,
              minWidth: '220px',
              fontSize: '0.9rem'
            }}
          >
            <option value="">Select a title from the catalog...</option>
            {availableBooks
              .filter(ab => !compareBookIds.includes(ab.id))
              .map(ab => (
                <option key={ab.id} value={ab.id}>
                  {ab.title} — {ab.author} ({ab.category})
                </option>
              ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!selectedAddId}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add to Compare
          </button>
        </div>
      )}

      {/* Comparison Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-text)' }}>
          Loading comparison data from library catalog...
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <GitCompare size={32} />
          </div>
          <h3>No books selected for comparison</h3>
          <p style={{ maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.92rem' }}>
            Select 2 or 3 books from the Catalog or AI Book Finder to view an in-depth side-by-side comparison of shelf locations, copies, and editions.
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="btn btn-primary"
          >
            Browse Library Catalog
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `200px repeat(${books.length}, minmax(280px, 1fr))`,
              gap: '16px',
              alignItems: 'stretch'
            }}
          >
            {/* Row 1: Header / Cover */}
            <div style={{ padding: '16px', fontWeight: 700, color: 'var(--forest-dark)', display: 'flex', alignItems: 'center' }}>
              Book Overview
            </div>
            {books.map(b => (
              <div
                key={b.id}
                className="bio-card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => onRemoveBook(b.id)}
                  title="Remove from comparison"
                  aria-label="Remove from comparison"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid var(--subtle-border)',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted-text)'
                  }}
                >
                  <X size={15} />
                </button>

                <div style={{ width: '90px', height: '120px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px', backgroundColor: 'var(--warm-beige)' }}>
                  <img
                    src={b.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                    alt={b.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-dark)', marginBottom: '4px', lineHeight: 1.3 }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '14px' }}>
                  by {b.author}
                </p>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    onClick={() => onViewBookDetails(b.id)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleReserve(b.id, b.title)}
                    className="btn btn-botanical btn-sm"
                    style={{ flex: 1 }}
                  >
                    Reserve
                  </button>
                </div>
              </div>
            ))}

            {/* Row 2: Category & Subject */}
            <div style={{ padding: '16px', fontWeight: 700, color: 'var(--forest-dark)', backgroundColor: 'var(--cream)', borderRadius: '8px' }}>
              Category & Subject
            </div>
            {books.map(b => (
              <div key={b.id} style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--subtle-border)' }}>
                <span className="badge badge-category">{b.category}</span>
              </div>
            ))}

            {/* Row 3: Physical Shelf & Rack Location */}
            <div style={{ padding: '16px', fontWeight: 700, color: 'var(--forest-dark)', backgroundColor: 'var(--cream)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--forest)" /> Shelf Location
              </div>
            </div>
            {books.map(b => (
              <div key={b.id} style={{ padding: '16px', backgroundColor: 'var(--soft-sage-light)', borderRadius: '8px', border: '1px solid var(--soft-sage)' }}>
                <div style={{ fontWeight: 700, color: 'var(--forest-dark)', fontSize: '0.94rem' }}>
                  {b.floor} • {b.section}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--botanical)', fontWeight: 600, marginTop: '2px' }}>
                  {b.shelf} ({b.rack})
                </div>
              </div>
            ))}

            {/* Row 4: Live Availability */}
            <div style={{ padding: '16px', fontWeight: 700, color: 'var(--forest-dark)', backgroundColor: 'var(--cream)', borderRadius: '8px' }}>
              Live Availability
            </div>
            {books.map(b => (
              <div key={b.id} style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--subtle-border)' }}>
                {b.available_copies > 0 ? (
                  <div>
                    <span className="badge badge-available">
                      ● {b.available_copies} of {b.total_copies} Copies Available
                    </span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                      Ready on shelf for instant reading
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="badge badge-borrowed">
                      ● All Copies On Loan
                    </span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                      Join waitlist queue for next return
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Row 5: Publication Year & Edition */}
            <div style={{ padding: '16px', fontWeight: 700, color: 'var(--forest-dark)', backgroundColor: 'var(--cream)', borderRadius: '8px' }}>
              Edition & Year
            </div>
            {books.map(b => (
              <div key={b.id} style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--subtle-border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--forest-dark)', fontSize: '0.9rem' }}>
                  {b.edition || '1st Edition'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  Published: {b.publication_year || 'N/A'} • {b.language || 'English'}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)', fontFamily: 'monospace', marginTop: '4px' }}>
                  ISBN: {b.isbn}
                </div>
              </div>
            ))}

            {/* Row 6: Synopsis & Topics */}
            <div style={{ padding: '16px', fontWeight: 700, color: 'var(--forest-dark)', backgroundColor: 'var(--cream)', borderRadius: '8px' }}>
              Description & Topics
            </div>
            {books.map(b => (
              <div key={b.id} style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--subtle-border)' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--dark-text)', lineHeight: 1.6, margin: 0 }}>
                  {b.description ? (b.description.length > 220 ? `${b.description.substring(0, 220)}...` : b.description) : 'No description available.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
