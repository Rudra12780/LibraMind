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
  AlertTriangle,
  GitCompare,
  Compass,
  CheckCircle2,
  Upload,
  Camera,
  RotateCcw
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

export default function BookDetails({
  bookId,
  onBack,
  onNavigate,
  onAddToCompare,
  compareBookIds = []
}) {
  const { user, login } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingActionName, setPendingActionName] = useState('');
  const [issueStudentId, setIssueStudentId] = useState('');
  const [selectedCopyCode, setSelectedCopyCode] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInPlanner, setIsInPlanner] = useState(false);
  const [userLoan, setUserLoan] = useState(null);
  const [userReservation, setUserReservation] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [returning, setReturning] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [penaltyStatus, setPenaltyStatus] = useState(null);

  const fetchBookDetails = useCallback(async () => {
    if (!bookId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getBook(bookId);
      setBook(data);
      if (data.inWishlist !== undefined) setIsWishlisted(Boolean(data.inWishlist));
      if (data.inVisitPlanner !== undefined) setIsInPlanner(Boolean(data.inVisitPlanner));
      if (data.userLoan !== undefined) setUserLoan(data.userLoan);
      if (data.userReservation !== undefined) setUserReservation(data.userReservation);

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
    if (user) {
      api.getPenaltyStatus().then(setPenaltyStatus).catch(() => {});
    } else {
      setPenaltyStatus(null);
    }
  }, [fetchBookDetails, checkWishlist, user]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReserve = async () => {
    if (!user) {
      setPendingActionName('place a hold for front desk pickup');
      setShowAuthModal(true);
      return;
    }
    setReserving(true);
    try {
      const res = await api.placeReservation(book.id);
      showToast(res.message || `Hold confirmed! Queue position #${res.queuePosition}`);
      setUserReservation({
        id: res.reservationId,
        status: res.status || 'waiting',
        queue_position: res.queuePosition || 1,
        pickup_deadline: res.status === 'ready_for_pickup' ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() : null
      });
      if (res.status === 'ready_for_pickup') {
        setBook(prev => prev ? ({ ...prev, available_copies: Math.max(0, prev.available_copies - 1) }) : prev);
      }
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setReserving(false);
    }
  };

  const handleCancelReserve = async () => {
    if (!userReservation || !userReservation.id) {
      showToast('Reservation identifier not found', true);
      return;
    }
    try {
      await api.cancelReservation(userReservation.id);
      showToast('Reservation hold cancelled');
      setUserReservation(null);
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleSelfCheckout = async (specificCopyCode = null) => {
    if (!user) {
      setPendingActionName('borrow this book');
      setShowAuthModal(true);
      return;
    }
    setBorrowing(true);
    try {
      const payload = specificCopyCode && typeof specificCopyCode === 'string' ? { copy_code: specificCopyCode } : { book_id: book.id };
      const res = await api.checkoutBook(payload);
      showToast(`Success! Checked out copy ${res.copyCode}. Due: ${new Date(res.dueDate).toLocaleDateString()}`);
      setUserLoan({
        id: res.loanId,
        due_date: res.dueDate,
        copy_code: res.copyCode,
        status: 'active'
      });
      setUserReservation(null);
      setBook(prev => prev ? ({ ...prev, available_copies: Math.max(0, prev.available_copies - 1) }) : prev);
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setBorrowing(false);
    }
  };

  const handleReturnBook = async () => {
    if (!userLoan || !userLoan.id) {
      showToast('Active loan ID not found to process return', true);
      return;
    }
    setReturning(true);
    try {
      await api.returnBook(userLoan.id);
      showToast(`Book successfully returned! You can now borrow it again directly.`);
      setUserLoan(null);
      setBook(prev => prev ? ({ ...prev, available_copies: prev.available_copies + 1 }) : prev);
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setReturning(false);
    }
  };

  const handleReturnAndReborrow = async () => {
    if (!userLoan || !userLoan.id) return;
    setReturning(true);
    try {
      const oldLoanId = userLoan.id;
      await api.returnBook(oldLoanId);
      const res = await api.checkoutBook({ book_id: book.id });
      showToast(`Success! Returned previous copy and directly checked out copy ${res.copyCode} for a fresh 14 days.`);
      setUserLoan({
        id: res.loanId,
        due_date: res.dueDate,
        copy_code: res.copyCode,
        status: 'active'
      });
      fetchBookDetails();
    } catch (err) {
      showToast(err.message || 'Direct re-borrow failed', true);
      fetchBookDetails();
    } finally {
      setReturning(false);
    }
  };

  const handleRenewLoan = async () => {
    if (!userLoan || !userLoan.id) return;
    try {
      const res = await api.renewLoan(userLoan.id);
      showToast(res.message || 'Loan renewed successfully for +14 days!');
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleTogglePlanner = async () => {
    if (!user) {
      setPendingActionName('add books to your Visit Planner');
      setShowAuthModal(true);
      return;
    }
    try {
      if (isInPlanner) {
        await api.removeFromVisitPlanner(book.id);
        setIsInPlanner(false);
        showToast(`Removed "${book.title}" from your Visit Planner`);
      } else {
        await api.addToVisitPlanner(book.id);
        setIsInPlanner(true);
        showToast(`Added "${book.title}" to your Visit Planner!`);
      }
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
      setPendingActionName('save books to your Wishlist');
      setShowAuthModal(true);
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

  const handleUploadOriginalPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image file exceeds 8MB limit. Please choose a smaller photo.', true);
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        setUploadingPhoto(true);
        try {
          await api.updateBook(book.id, { cover_image: reader.result });
          showToast(`Success: Uploaded original photo for "${book.title}"!`);
          fetchBookDetails();
        } catch (err) {
          showToast(err.message, true);
        } finally {
          setUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
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
      {/* Responsive style overrides */}
      <style>{`
        @media (max-width: 860px) {
          .book-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .book-detail-grid {
            gap: 24px !important;
          }
          .book-cover-img {
            height: 280px !important;
          }
          .book-action-row {
            flex-direction: column !important;
          }
          .book-action-row button {
            flex: none !important;
            width: 100% !important;
          }
          .book-meta-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .shelf-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      {/* Toast alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '16px',
            left: '16px',
            maxWidth: '420px',
            marginLeft: 'auto',
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
        className="book-detail-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 340px) 1fr',
          gap: '40px',
          marginBottom: '48px',
          alignItems: 'start'
        }}
      >        {/* Left Column: Cover & Quick Actions */}
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
                src={book.cover_image || getOfflineBookCover(book.title, book.author, book.category)}
                alt={book.title}
                onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Librarian / Admin: Upload Original Photo Action */}
            {(user?.role === 'librarian' || user?.role === 'admin') && (
              <div style={{ marginTop: '14px', borderTop: '1px solid var(--subtle-border)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: book.cover_image?.startsWith('/uploads') ? 'rgba(82, 115, 77, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                    color: book.cover_image?.startsWith('/uploads') ? 'var(--botanical)' : '#B45309'
                  }}>
                    {book.cover_image?.startsWith('/uploads') ? '● Original Photo Uploaded' : '● Standard Stock Photo'}
                  </span>
                </div>
                <label
                  className="btn btn-outline btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    cursor: uploadingPhoto ? 'wait' : 'pointer',
                    fontSize: '0.82rem',
                    padding: '8px 12px',
                    borderColor: 'var(--botanical)',
                    color: 'var(--forest-dark)',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <Upload size={14} color="var(--botanical)" />
                  {uploadingPhoto ? 'Uploading & Saving Locally...' : 'Upload Original Photo from Device'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={uploadingPhoto}
                    onChange={handleUploadOriginalPhoto}
                  />
                </label>
                <span style={{ fontSize: '0.7rem', color: 'var(--sage)', display: 'block', textAlign: 'center', marginTop: '5px' }}>
                  Saved directly to library archive for 100% offline access
                </span>
              </div>
            )}
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
            {/* User Active Loan Status Banner */}
            {userLoan ? (
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--soft-sage-light)',
                  border: '1.5px solid var(--botanical)',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-dark)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} color="var(--botanical)" />
                  Currently Borrowed by You
                </div>
                <p style={{ margin: '4px 0 10px', fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  Due date: <strong>{new Date(userLoan.due_date).toLocaleDateString()}</strong>
                  {userLoan.status === 'overdue' && <span style={{ color: '#C5221F', fontWeight: 700, marginLeft: '6px' }}>(OVERDUE)</span>}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={handleReturnBook}
                      disabled={returning}
                      className="btn btn-secondary btn-sm"
                      style={{
                        backgroundColor: 'var(--warm-beige)',
                        color: 'var(--forest-dark)',
                        fontWeight: 700,
                        padding: '8px 10px'
                      }}
                    >
                      {returning ? 'Returning...' : '✓ Return Book'}
                    </button>
                    <button
                      onClick={handleRenewLoan}
                      className="btn btn-outline btn-sm"
                      style={{ fontWeight: 600, padding: '8px 10px' }}
                    >
                      Renew (+14d)
                    </button>
                  </div>

                  <button
                    onClick={() => onNavigate('dashboard', { tab: 'loans' })}
                    className="btn btn-primary btn-sm"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      fontSize: '0.82rem'
                    }}
                  >
                    <BookOpen size={14} /> Open My Loans Hub →
                  </button>

                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--editorial-text-muted)',
                      backgroundColor: 'rgba(38, 61, 50, 0.05)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px dashed var(--editorial-border)',
                      lineHeight: 1.4,
                      textAlign: 'center'
                    }}
                  >
                    🔒 <strong>1 Copy Rule:</strong> Only 1 copy allowed at a time. Return your copy to borrow this title again.
                  </div>
                </div>
              </div>
            ) : userReservation ? (
              /* User Active Hold Status Banner */
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--soft-sage-light)',
                  border: '1.5px solid var(--forest)',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-dark)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <Bookmark size={18} color="var(--forest)" />
                  {userReservation.status === 'ready_for_pickup' ? 'Ready for Pickup at Desk!' : `In Waiting Queue (#${userReservation.queue_position})`}
                </div>
                <p style={{ margin: '4px 0 10px', fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  {userReservation.status === 'ready_for_pickup'
                    ? `Held at desk until ${userReservation.pickup_deadline ? new Date(userReservation.pickup_deadline).toLocaleDateString() : 'within 48h'}.`
                    : `Position #${userReservation.queue_position}. You will receive a notification when a copy becomes available.`}
                </p>
                <div style={{ display: 'flex', gap: '8px' }} className="book-action-row">
                  {userReservation.status === 'ready_for_pickup' && (
                    <button onClick={handleSelfCheckout} disabled={borrowing} className="btn btn-botanical btn-sm" style={{ flex: 1 }}>
                      {borrowing ? 'Checking out...' : 'Claim & Check Out'}
                    </button>
                  )}
                  <button onClick={handleCancelReserve} className="btn btn-outline btn-sm" style={{ flex: 1, color: '#C5221F', borderColor: '#C5221F' }}>
                    Cancel Hold
                  </button>
                </div>
                <button
                  onClick={() => onNavigate('reservations')}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', marginTop: '8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Bookmark size={12} /> View in My Reservations Hub →
                </button>
              </div>
            ) : (
              <div>
                {penaltyStatus?.isBlocked && (
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#FFF7F5',
                      border: '1.5px solid #FCA5A5',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C5221F', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <AlertTriangle size={15} /> Account Hold Active
                    </div>
                    <p style={{ margin: '4px 0 8px', fontSize: '0.78rem', color: 'var(--editorial-text-muted)', lineHeight: 1.45 }}>
                      Unpaid circulation penalty of ${penaltyStatus.unpaidFines.toFixed(2)}. Borrowing and hold queues are restricted until settled.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('dashboard')}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', fontSize: '0.76rem', padding: '6px' }}
                    >
                      Pay Penalty in Reading Room →
                    </button>
                  </div>
                )}

                {isAvailable ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={handleSelfCheckout}
                      disabled={borrowing || Boolean(penaltyStatus?.isBlocked)}
                      className="btn btn-primary"
                      style={{ width: '100%', opacity: penaltyStatus?.isBlocked ? 0.6 : 1 }}
                      title={penaltyStatus?.isBlocked ? 'Account hold active due to unpaid penalty' : 'Check out volume'}
                    >
                      <BookOpen size={16} /> {borrowing ? 'Checking out...' : penaltyStatus?.isBlocked ? 'Check Out Blocked (Penalty Due)' : 'Check Out / Borrow Now'}
                    </button>
                    <button
                      onClick={handleReserve}
                      disabled={reserving || Boolean(penaltyStatus?.isBlocked)}
                      className="btn btn-outline"
                      style={{ width: '100%', opacity: penaltyStatus?.isBlocked ? 0.6 : 1 }}
                      title={penaltyStatus?.isBlocked ? 'Account hold active due to unpaid penalty' : 'Place hold'}
                    >
                      <Bookmark size={15} /> {reserving ? 'Placing Hold...' : penaltyStatus?.isBlocked ? 'Hold Blocked (Penalty Due)' : 'Place Hold for Front Desk Pickup'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '8px', padding: '6px 10px', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        All Copies On Loan
                      </span>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--editorial-text-muted)' }}>
                        All physical copies are currently in member hands. Join the hold queue to claim the next returned copy.
                      </p>
                    </div>
                    <button
                      onClick={handleReserve}
                      disabled={reserving || Boolean(penaltyStatus?.isBlocked)}
                      className="btn btn-primary"
                      style={{ width: '100%', opacity: penaltyStatus?.isBlocked ? 0.6 : 1 }}
                    >
                      <Bookmark size={16} /> {reserving ? 'Joining Waiting List...' : penaltyStatus?.isBlocked ? 'Queue Blocked (Penalty Due)' : `Join Waiting List (#${(book.waitingQueueCount || 0) + 1})`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* My Shelf & Literary Research Options */}
            <div
              style={{
                marginTop: '16px',
                padding: '14px 16px',
                backgroundColor: 'var(--editorial-bg-subtle)',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span
                  style={{
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    color: 'var(--editorial-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}
                >
                  📚 My Shelf &amp; Tools
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)' }}>
                  Patron Desk
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`btn btn-sm ${isWishlisted ? 'btn-primary' : 'btn-outline'}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.80rem' }}
                >
                  <Heart size={14} fill={isWishlisted ? '#FFFFFF' : 'none'} color={isWishlisted ? '#FFFFFF' : 'currentColor'} />
                  {isWishlisted ? 'In Wishlist' : 'Wishlist'}
                </button>

                <button
                  type="button"
                  onClick={handleToggleCompare}
                  className={`btn btn-sm ${compareBookIds.includes(parseInt(book.id, 10)) || compareBookIds.includes(book.id) ? 'btn-primary' : 'btn-outline'}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.80rem' }}
                >
                  <GitCompare size={14} />
                  {compareBookIds.includes(parseInt(book.id, 10)) || compareBookIds.includes(book.id) ? 'In Compare' : 'Compare'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleTogglePlanner}
                className={`btn btn-sm ${isInPlanner ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.80rem' }}
              >
                <Compass size={14} />
                {isInPlanner ? '✓ Saved in Visit Itinerary' : 'Add to Visit Itinerary'}
              </button>
            </div>

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

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.2vw, 2.7rem)', fontWeight: 800, color: 'var(--editorial-text)', marginBottom: '8px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {book.title}
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--editorial-text-muted)', marginBottom: '24px' }}>
            by <strong style={{ color: 'var(--editorial-text)' }}>{book.author}</strong>
          </p>

          {/* EXACT SHELF & RACK LOCATION CARD */}
          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--editorial-bg-subtle)',
              border: '1px solid var(--editorial-border)',
              borderLeft: '4px solid var(--editorial-green)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '32px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <MapPin size={20} color="var(--editorial-accent)" strokeWidth={2.2} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 700 }}>
                Exact Physical Shelf Location
              </h3>
            </div>
            <p style={{ fontSize: '0.90rem', color: 'var(--editorial-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Find this volume in the physical library stacks using these accession coordinates:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px'
              }}
            >
              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                  Floor Level
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  {book.floor}
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                  Section
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  {book.section}
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                  Shelf Code
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--editorial-green)' }}>
                  {book.shelf}
                </span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                  Rack Unit
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  {book.rack}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '12px', color: 'var(--editorial-text)', fontWeight: 700 }}>
              Synopsis & Description
            </h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--editorial-text)', lineHeight: 1.75 }}>
              {book.description || 'No description provided for this volume.'}
            </p>
          </div>

          {/* Metadata Specifications */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '16px',
              padding: '20px 24px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              marginBottom: '36px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--editorial-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>ISBN-13</span>
              <strong style={{ fontSize: '0.90rem', color: 'var(--editorial-text)', fontFamily: 'monospace' }}>{book.isbn}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--editorial-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>Publisher</span>
              <strong style={{ fontSize: '0.90rem', color: 'var(--editorial-text)' }}>{book.publisher || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--editorial-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>Publication Year</span>
              <strong style={{ fontSize: '0.90rem', color: 'var(--editorial-text)' }}>{book.publication_year}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--editorial-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>Edition</span>
              <strong style={{ fontSize: '0.90rem', color: 'var(--editorial-text)' }}>{book.edition}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--editorial-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>Language</span>
              <strong style={{ fontSize: '0.90rem', color: 'var(--editorial-text)' }}>{book.language}</strong>
            </div>
          </div>

          {/* PHYSICAL COPIES TRACKING TABLE */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '14px', color: 'var(--editorial-text)', fontWeight: 700 }}>
              Physical Copy Inventory ({book.copies?.length || 0})
            </h3>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--editorial-border)',
                overflowX: 'auto',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)', fontSize: '0.76rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Copy Identifier
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)', fontSize: '0.76rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Condition
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)', fontSize: '0.76rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Status
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--editorial-text)', fontSize: '0.76rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Circulation Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {book.copies && book.copies.map(copy => {
                    const isMyCopy = userLoan && (userLoan.copy_code === copy.copy_code || userLoan.copy_id === copy.id);

                    return (
                      <tr key={copy.id} style={{ borderBottom: '1px solid var(--editorial-border)', backgroundColor: isMyCopy ? 'var(--editorial-bg-subtle)' : 'transparent' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--editorial-text)' }}>
                          {copy.copy_code}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--editorial-text-muted)' }}>
                          {copy.condition}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {isMyCopy ? (
                            <span className="badge" style={{ backgroundColor: 'var(--editorial-green)', color: '#FFFFFF', fontWeight: 700 }}>
                              ✓ In Your Possession
                            </span>
                          ) : copy.status === 'available' ? (
                            <span className="badge badge-available">Available on Shelf</span>
                          ) : copy.status === 'borrowed' ? (
                            <span className="badge badge-borrowed">Currently Borrowed</span>
                          ) : (
                            <span className="badge badge-reserved">Reserved for Member</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          {isMyCopy ? (
                            <button
                              type="button"
                              onClick={handleReturnBook}
                              disabled={returning}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                            >
                              {returning ? 'Returning...' : '✓ Return This Copy'}
                            </button>
                          ) : copy.status === 'available' ? (
                            userLoan ? (
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: 'var(--editorial-bg-subtle)',
                                  color: 'var(--editorial-text-muted)',
                                  border: '1px solid var(--editorial-border)',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  cursor: 'not-allowed'
                                }}
                                title="You already have an active loan for this book (only 1 copy allowed at a time). Return your copy to borrow this title again."
                              >
                                1 Copy Held (Max 1)
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelfCheckout(copy.copy_code)}
                                disabled={borrowing || Boolean(penaltyStatus?.isBlocked)}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                                title={penaltyStatus?.isBlocked ? 'Account hold active due to unpaid penalty' : 'Check out this physical copy'}
                              >
                                {borrowing ? 'Checking out...' : 'Borrow Copy'}
                              </button>
                            )
                          ) : copy.status === 'reserved' && userReservation && userReservation.status === 'ready_for_pickup' ? (
                            <button
                              type="button"
                              onClick={() => handleSelfCheckout(copy.copy_code)}
                              disabled={borrowing}
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                            >
                              Claim &amp; Check Out
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                              In Circulation
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
            backgroundColor: 'rgba(37, 40, 32, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowIssueModal(false)}
        >
          <div
            style={{
              width: '460px',
              backgroundColor: '#FFFFFF',
              padding: '32px',
              border: '1px solid var(--editorial-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
              STAFF CIRCULATION
            </span>
            <h3 style={{ fontSize: '1.35rem', margin: '4px 0 8px', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 800 }}>
              Issue Physical Volume
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Check out "{book.title}" to a verified student or faculty folio.
            </p>

            <form onSubmit={handleIssueCopy}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--editorial-accent)', fontWeight: 700 }}>
                  Member ID or Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. STU-1001 or student@libramind.edu"
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--editorial-accent)', fontWeight: 700 }}>
                  Select Available Physical Copy
                </label>
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.2 }}
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Sign-In Modal (when unauthenticated visitor clicks book action) */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(37, 40, 32, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 3500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{
              width: '420px',
              backgroundColor: '#FFFFFF',
              padding: '34px 28px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                backgroundColor: 'var(--editorial-green)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#FFFFFF'
              }}
            >
              <BookOpen size={24} strokeWidth={2.2} />
            </div>

            <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
              PATRON SANCTUARY
            </span>
            <h3 style={{ fontSize: '1.45rem', margin: '4px 0 8px', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 800 }}>
              Sign In to Continue
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
              Please sign in to {pendingActionName || 'borrow or reserve library volumes'}.
            </p>

            <button
              onClick={async () => {
                try {
                  await login('student@libramind.edu', 'Student@123');
                  setShowAuthModal(false);
                  showToast('Signed in as Student (Aarav Sharma)!');
                  fetchBookDetails();
                } catch (e) {
                  showToast(e.message, true);
                }
              }}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '10px', padding: '12px', justifyContent: 'center' }}
            >
              ⚡ 1-Click Sign In as Student (Aarav)
            </button>

            <button
              onClick={() => {
                setShowAuthModal(false);
                onNavigate('login');
              }}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Sign In with Another Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
