import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  BookOpen,
  Calendar,
  Layers,
  Globe,
  Tag,
  ShieldCheck,
  Heart,
  Plus,
  Bookmark,
  Check,
  AlertCircle,
  GitCompare,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function BookDetails({
  bookId,
  onBack,
  onNavigate,
  onAddToCompare,
  compareBookIds = []
}) {
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueStudentId, setIssueStudentId] = useState('');
  const [selectedCopyCode, setSelectedCopyCode] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  const fetchBookDetails = useCallback(async () => {
    if (!bookId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getBook(bookId);
      setBook(data);
      if (data.copies && data.copies.length > 0) {
        const firstAvail = data.copies.find(c => c.status === 'available');
        if (firstAvail) setSelectedCopyCode(firstAvail.copy_code);
      }
    } catch (err) {
      console.error('Failed to load book', err);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  const checkWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const list = await api.getWishlist();
      setIsWishlisted(list.some(item => item.id === parseInt(bookId)));
    } catch (err) {
      console.error('Wishlist check error', err);
    }
  }, [user, bookId]);

  useEffect(() => {
    fetchBookDetails();
    checkWishlist();
  }, [fetchBookDetails, checkWishlist]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReserve = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      const res = await api.placeReservation(book.id);
      showToast(res.message || `Hold confirmed! Queue position #${res.queuePosition}`);
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleSelfCheckout = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    setBorrowing(true);
    try {
      const res = await api.checkoutBook({ book_id: book.id });
      showToast(`Success! Checked out copy ${res.copyCode}. Due: ${new Date(res.dueDate).toLocaleDateString()}`);
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setBorrowing(false);
    }
  };

  const handleAddToPlanner = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      await api.addToVisitPlanner(book.id);
      showToast(`Added "${book.title}" to your Visit Planner!`);
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleToggleCompare = () => {
    if (onAddToCompare) {
      onAddToCompare(book.id);
      showToast(
        compareBookIds.includes(book.id)
          ? 'Removed from compare list'
          : `Added to compare list (${compareBookIds.length + 1}/3)`
      );
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      if (isWishlisted) {
        await api.removeFromWishlist(book.id);
        setIsWishlisted(false);
        showToast('Removed from wishlist');
      } else {
        await api.addToWishlist(book.id);
        setIsWishlisted(true);
        showToast('Saved to your wishlist');
      }
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleIssueCopy = async (e) => {
    e.preventDefault();
    if (!issueStudentId.trim() || !selectedCopyCode) {
      showToast('Please enter a student ID and select a copy', true);
      return;
    }

    try {
      await api.issueBook({
        membership_id: issueStudentId.trim(),
        copy_code: selectedCopyCode
      });
      showToast(`Copy ${selectedCopyCode} successfully issued to ${issueStudentId}!`);
      setShowIssueModal(false);
      setIssueStudentId('');
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleAddCopy = async () => {
    try {
      await api.addBookCopy(book.id, { condition: 'New' });
      showToast('New physical copy added to catalog inventory!');
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted-text)' }}>
        Retrieving catalog record and shelf coordinates...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h3>Book not found</h3>
        <button onClick={onBack} className="btn btn-secondary" style={{ marginTop: '16px' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const isAvailable = book.available_copies > 0;
  const isLibrarianOrAdmin = user && (user.role === 'librarian' || user.role === 'admin');

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Toast alert */}
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

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--muted-text)',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          marginBottom: '24px',
          padding: 0
        }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      {/* Main Book Detail Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 340px) 1fr',
          gap: '40px',
          marginBottom: '48px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Cover & Quick Actions */}
        <div>
          <div
            className="bio-card"
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              marginBottom: '20px'
            }}
          >
            <div
              style={{
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                height: '420px',
                backgroundColor: 'var(--warm-beige)',
                boxShadow: '0 8px 20px rgba(52, 78, 65, 0.1)'
              }}
            >
              <img
                src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Action Panel */}
          <div
            className="bio-card"
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {isAvailable ? (
              <>
                <button
                  onClick={handleSelfCheckout}
                  disabled={borrowing}
                  className="btn btn-botanical"
                  style={{ width: '100%' }}
                >
                  <BookOpen size={18} /> {borrowing ? 'Checking out...' : 'Check Out / Borrow Now'}
                </button>
                <button
                  onClick={handleReserve}
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  <Bookmark size={16} /> Place Hold for Front Desk Pickup
                </button>
              </>
            ) : (
              <button
                onClick={handleReserve}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Bookmark size={18} /> Join Waiting Queue (#{book.waitingQueueCount + 1})
              </button>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={handleAddToPlanner}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Compass size={14} /> Add to Visit
              </button>

              <button
                onClick={handleToggleCompare}
                className={`btn btn-sm ${compareBookIds.includes(book.id) ? 'btn-primary' : 'btn-outline'}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <GitCompare size={14} /> {compareBookIds.includes(book.id) ? 'In Compare' : 'Compare'}
              </button>
            </div>

            <button
              onClick={handleToggleWishlist}
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
            >
              <Heart size={15} fill={isWishlisted ? '#C5221F' : 'none'} color={isWishlisted ? '#C5221F' : 'var(--forest)'} />
              {isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
            </button>

            {/* Librarian Desk Actions */}
            {isLibrarianOrAdmin && (
              <div
                style={{
                  marginTop: '10px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--subtle-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--forest-dark)', textTransform: 'uppercase' }}>
                  Librarian Desk Controls
                </span>
                <button
                  onClick={() => setShowIssueModal(true)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <BookOpen size={15} /> Quick Issue to Student
                </button>
                <button
                  onClick={handleAddCopy}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  <Plus size={15} /> Add Physical Copy (+1)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Title, Metadata & Shelf Location */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-category">{book.category}</span>
            {isAvailable ? (
              <span className="badge badge-available">
                ● {book.available_copies} of {book.total_copies} Copies Available
              </span>
            ) : (
              <span className="badge badge-borrowed">
                ● All Copies On Loan ({book.waitingQueueCount} Waiting)
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2.5rem', color: 'var(--forest-dark)', marginBottom: '8px', lineHeight: 1.25 }}>
            {book.title}
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--muted-text)', marginBottom: '24px' }}>
            by <strong style={{ color: 'var(--dark-text)' }}>{book.author}</strong>
          </p>

          {/* EXACT SHELF & RACK LOCATION CARD (Core Problem Solution) */}
          <div
            className="bio-card"
            style={{
              padding: '24px',
              backgroundColor: 'var(--warm-beige)',
              borderLeft: '5px solid var(--botanical)',
              marginBottom: '32px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <MapPin size={22} color="var(--forest-dark)" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--forest-dark)' }}>
                Exact Physical Shelf Location
              </h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--dark-text)', lineHeight: 1.5, marginBottom: '16px' }}>
              Find this book on physical library stacks using the following coordinates:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px'
              }}
            >
              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block' }}>
                  Floor Level
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {book.floor}
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block' }}>
                  Section
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {book.section}
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block' }}>
                  Shelf Code
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--botanical)' }}>
                  {book.shelf}
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block' }}>
                  Rack Unit
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {book.rack}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--forest-dark)' }}>
              Synopsis & Description
            </h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--dark-text)', lineHeight: 1.7 }}>
              {book.description || 'No description provided for this volume.'}
            </p>
          </div>

          {/* Metadata Specifications */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--subtle-border)',
              marginBottom: '36px'
            }}
          >
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted-text)', display: 'block' }}>ISBN-13</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--forest-dark)' }}>{book.isbn}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted-text)', display: 'block' }}>Publisher</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--forest-dark)' }}>{book.publisher || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted-text)', display: 'block' }}>Publication Year</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--forest-dark)' }}>{book.publication_year}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted-text)', display: 'block' }}>Edition</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--forest-dark)' }}>{book.edition}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted-text)', display: 'block' }}>Language</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--forest-dark)' }}>{book.language}</strong>
            </div>
          </div>

          {/* PHYSICAL COPIES TRACKING TABLE */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '14px', color: 'var(--forest-dark)' }}>
              Physical Copy Inventory ({book.copies?.length || 0})
            </h3>
            <div
              className="bio-card"
              style={{
                backgroundColor: '#FFFFFF',
                overflowX: 'auto'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--forest-dark)' }}>
                      Copy Barcode / Identifier
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--forest-dark)' }}>
                      Condition
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--forest-dark)' }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {book.copies && book.copies.map(copy => (
                    <tr key={copy.id} style={{ borderBottom: '1px solid rgba(52, 78, 65, 0.06)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--forest-dark)' }}>
                        {copy.copy_code}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted-text)' }}>
                        {copy.condition}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {copy.status === 'available' ? (
                          <span className="badge badge-available">Available on Shelf</span>
                        ) : copy.status === 'borrowed' ? (
                          <span className="badge badge-borrowed">Currently Borrowed</span>
                        ) : (
                          <span className="badge badge-reserved">Reserved for Member</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Issue Modal (Librarian/Admin only) */}
      {showIssueModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(35, 52, 43, 0.45)',
            backdropFilter: 'blur(5px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowIssueModal(false)}
        >
          <div
            className="bio-card"
            style={{
              width: '460px',
              backgroundColor: '#FFFFFF',
              padding: '28px',
              borderRadius: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--forest-dark)' }}>
              Check Out Book Copy
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
              Issue "{book.title}" to a verified student or faculty member.
            </p>

            <form onSubmit={handleIssueCopy}>
              <div className="form-group">
                <label className="form-label">Member ID or Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. STU-1001 or student@libramind.edu"
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Available Physical Copy</label>
                <select
                  className="form-control"
                  value={selectedCopyCode}
                  onChange={(e) => setSelectedCopyCode(e.target.value)}
                  required
                >
                  {book.copies && book.copies.filter(c => c.status === 'available').map(c => (
                    <option key={c.id} value={c.copy_code}>
                      {c.copy_code} (Condition: {c.condition})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
