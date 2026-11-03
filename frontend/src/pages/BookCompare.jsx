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
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

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
        const fetched = await Promise.all(
          compareBookIds.map(id => api.getBook(id).catch(() => null))
        );
        setBooks(fetched.filter(Boolean));

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
      const updated = await api.getBook(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? updated : b));
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleBorrow = async (bookId, title) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      const res = await api.checkoutBook({ book_id: bookId });
      showToast(`Success! Checked out copy ${res.copyCode} of "${title}". Due: ${new Date(res.dueDate).toLocaleDateString()}`);
      const updated = await api.getBook(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? updated : b));
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleReturn = async (loanId, bookId, title) => {
    try {
      await api.returnBook(loanId);
      showToast(`"${title}" returned successfully. Thank you!`);
      const updated = await api.getBook(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? updated : b));
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleCancelReserve = async (reservationId, bookId) => {
    try {
      await api.cancelReservation(reservationId);
      showToast('Reservation hold cancelled.');
      const updated = await api.getBook(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? updated : b));
    } catch (err) {
      showToast(err.message, true);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '40px 24px 80px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            {toastMessage.isError ? <AlertCircle size={18} strokeWidth={2.4} /> : <CheckCircle size={18} strokeWidth={2.4} />}
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--editorial-border)',
                color: 'var(--editorial-text)',
                border: '1px solid var(--editorial-border)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.78rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '4px 10px',
                marginBottom: '8px'
              }}
            >
              <GitCompare size={15} strokeWidth={2.4} /> Comparative Analysis
            </div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '4px 0 8px' }}>
              Book Match & Compare
            </h1>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '1rem', margin: 0, maxWidth: '640px', fontWeight: 500 }}>
              Compare up to 3 library books side-by-side using verified catalog records, physical shelf stacks, editions, and real-time copy availability.
            </p>
          </div>

          {books.length > 0 && (
            <button
              onClick={onClearCompare}
              className="btn btn-outline btn-sm"
              style={{ alignSelf: 'center' }}
            >
              Clear All ({books.length})
            </button>
          )}
        </div>

        {/* Book Adder Bar */}
        {books.length < 3 && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-lg)',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)' }}>
              Add Book to Comparison ({books.length}/3 selected):
            </span>
            <select
              value={selectedAddId}
              onChange={(e) => setSelectedAddId(e.target.value)}
              className="form-control"
              style={{
                flex: 1,
                minWidth: '220px',
                fontSize: '0.88rem',
                padding: '8px 10px'
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
              <Plus size={16} strokeWidth={2.4} /> Add to Compare
            </button>
          </div>
        )}

        {/* Comparison Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--editorial-text)', fontWeight: 800, textTransform: 'uppercase' }}>
            Loading comparison data from library catalog...
          </div>
        ) : books.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center'
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <GitCompare size={36} color="var(--editorial-accent)" strokeWidth={2.4} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', marginBottom: '8px' }}>
              No Books Selected for Comparison
            </h3>
            <p style={{ maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.92rem', color: 'var(--editorial-text)', opacity: 0.85, fontWeight: 500 }}>
              Select 2 or 3 books from the Catalog to view an in-depth side-by-side comparison of shelf locations, copies, and editions.
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-primary"
            >
              Browse Library Catalog →
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `180px repeat(${books.length}, minmax(280px, 1fr))`,
                gap: '14px',
                alignItems: 'stretch'
              }}
            >
              {/* Row 1: Header / Cover */}
              <div
                style={{
                  padding: '16px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: 'var(--editorial-text)',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--editorial-border)',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.85rem'
                }}
              >
                Book Overview
              </div>
              {books.map(b => (
                <div
                  key={b.id}
                  style={{
                    padding: '20px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: 'var(--shadow-card)',
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
                      border: '1px solid var(--editorial-border)',
                      backgroundColor: '#FFFFFF',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--editorial-text)',
                      zIndex: 2
                    }}
                  >
                    <X size={15} strokeWidth={2.4} />
                  </button>

                  {/* Status Badge */}
                  {b.userLoan ? (
                    <div style={{
                      marginBottom: '8px',
                      backgroundColor: 'var(--editorial-border)',
                      color: 'var(--editorial-text)',
                      fontSize: '0.74rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      border: '1px solid var(--editorial-border)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      alignSelf: 'flex-start'
                    }}>
                      ✓ Borrowed (Due: {new Date(b.userLoan.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' })})
                    </div>
                  ) : b.userReservation ? (
                    <div style={{
                      marginBottom: '8px',
                      backgroundColor: 'var(--editorial-green)',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      border: '1px solid var(--editorial-border)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      alignSelf: 'flex-start'
                    }}>
                      ★ Held in Queue #{b.userReservation.queue_position}
                    </div>
                  ) : null}

                  <div style={{ width: '90px', height: '120px', overflow: 'hidden', marginBottom: '12px', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <img
                      src={b.cover_image || getOfflineBookCover(b.title, b.author, b.category)}
                      alt={b.title}
                      onError={(e) => handleBookCoverError(e, b.title, b.author, b.category)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', lineHeight: 1.3 }}>
                    {b.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text)', opacity: 0.85, marginBottom: '14px', fontWeight: 600 }}>
                    by {b.author}
                  </p>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => onViewBookDetails(b.id)}
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem' }}
                      >
                        Details
                      </button>

                      {b.userLoan ? (
                        <button
                          onClick={() => handleReturn(b.userLoan.id, b.id, b.title)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            flex: 1,
                            padding: '7px 10px',
                            fontSize: '0.8rem'
                          }}
                        >
                          Return Book
                        </button>
                      ) : b.userReservation ? (
                        <button
                          onClick={() => handleCancelReserve(b.userReservation.id, b.id)}
                          className="btn btn-outline btn-sm"
                          style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem', color: 'var(--editorial-accent)', borderColor: 'var(--editorial-accent)' }}
                        >
                          Cancel Hold
                        </button>
                      ) : b.available_copies > 0 ? (
                        <button
                          onClick={() => handleBorrow(b.id, b.title)}
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem' }}
                        >
                          Borrow
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReserve(b.id, b.title)}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem' }}
                        >
                          Waitlist
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Row 2: Category & Subject */}
              <div style={{ padding: '16px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', fontSize: '0.85rem' }}>
                Category
              </div>
              {books.map(b => (
                <div key={b.id} style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <span className="badge badge-category">{b.category}</span>
                </div>
              ))}

              {/* Row 3: Shelf Location */}
              <div style={{ padding: '16px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="var(--editorial-accent)" strokeWidth={2.4} /> Shelf Stack
                </div>
              </div>
              {books.map(b => (
                <div key={b.id} style={{ padding: '16px', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', fontSize: '0.94rem' }}>
                    {b.floor} • {b.section}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--editorial-green)', fontWeight: 800, marginTop: '2px' }}>
                    {b.shelf} ({b.rack})
                  </div>
                </div>
              ))}

              {/* Row 4: Live Availability */}
              <div style={{ padding: '16px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', fontSize: '0.85rem' }}>
                Availability
              </div>
              {books.map(b => (
                <div key={b.id} style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-sm)' }}>
                  {b.available_copies > 0 ? (
                    <div>
                      <span className="badge badge-available">
                        ● {b.available_copies} of {b.total_copies} Copies
                      </span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.8, marginTop: '4px', fontWeight: 600 }}>
                        Ready on shelf for instant check-out
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="badge badge-borrowed">
                        ● All Copies On Loan
                      </span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.8, marginTop: '4px', fontWeight: 600 }}>
                        Join waitlist queue for next return
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Row 5: Publication Year & Edition */}
              <div style={{ padding: '16px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', fontSize: '0.85rem' }}>
                Edition & Year
              </div>
              {books.map(b => (
                <div key={b.id} style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--editorial-text)', fontSize: '0.9rem' }}>
                    {b.edition || '1st Edition'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--editorial-text)', opacity: 0.8, fontWeight: 600 }}>
                    Published: {b.publication_year || 'N/A'} • {b.language || 'English'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--editorial-text)', fontFamily: 'monospace', marginTop: '4px', fontWeight: 700 }}>
                    ISBN: {b.isbn}
                  </div>
                </div>
              ))}

              {/* Row 6: Synopsis & Topics */}
              <div style={{ padding: '16px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', fontSize: '0.85rem' }}>
                Description
              </div>
              {books.map(b => (
                <div key={b.id} style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    {b.description ? (b.description.length > 220 ? `${b.description.substring(0, 220)}...` : b.description) : 'No description available.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
