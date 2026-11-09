import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import BookCard from '../components/BookCard';
import BookCompare from './BookCompare';
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  AlertCircle,
  RotateCw,
  Sparkles,
  Bookmark,
  Heart,
  GitCompare,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  Bell,
  Clock,
  Settings,
  X,
  CreditCard,
  BookMarked,
  Armchair,
  Zap,
  Monitor,
  ArrowRight,
  CheckCircle2,
  Check,
  Compass,
  FileText
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

const SUGGESTED_INTEREST_TAGS = [
  'Fiction & Novels',
  'Literary Classics',
  'Computer Science',
  'Artificial Intelligence',
  'Philosophy & Ethics',
  'History & Heritage',
  'Psychology',
  'Modern Poetry',
  'Science & Technology',
  'Economics & Society'
];

export default function StudentDashboard({
  onNavigate,
  onViewBookDetails,
  initialTab = 'all',
  onTabChange,
  onUpdateStats,
  compareBookIds = [],
  onAddToCompare,
  onRemoveCompareBook,
  onClearCompare
}) {
  const { user, reloadProfile } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [currentTab, setCurrentTab] = useState(initialTab || 'all');
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [seatBookings, setSeatBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [notifTab, setNotifTab] = useState('official');

  const normalizeTab = (tab) => {
    if (!tab || tab === 'all' || tab === 'overview') return 'all';
    if (tab === 'loans' || tab === 'my-loans' || tab === 'borrowed') return 'loans';
    if (tab === 'holds' || tab === 'reservations' || tab === 'my-reservations') return 'holds';
    if (tab === 'seats' || tab === 'study-pods') return 'seats';
    if (tab === 'wishlist' || tab === 'saved') return 'wishlist';
    if (tab === 'compare' || tab === 'comparison') return 'compare';
    if (tab === 'recommendations' || tab === 'ai') return 'recommendations';
    return tab;
  };

  useEffect(() => {
    if (initialTab) {
      setCurrentTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  const handleTabChange = (tabId) => {
    const norm = normalizeTab(tabId);
    setCurrentTab(norm);
    if (onTabChange) onTabChange(norm);
  };

  // Edit interests modal
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [interestsText, setInterestsText] = useState(user?.interests || '');
  const [savingInterests, setSavingInterests] = useState(false);

  // Return Book Confirmation Modal
  const [returnModalLoan, setReturnModalLoan] = useState(null);
  const [returningLoan, setReturningLoan] = useState(false);
  const [returnError, setReturnError] = useState(null);

  // Penalty & Account Hold States
  const [penaltyStatus, setPenaltyStatus] = useState({ isBlocked: false, unpaidFines: 0, overdueCount: 0, penaltyLoans: [], reason: null });
  const [showPayModal, setShowPayModal] = useState(false);
  const [payingFine, setPayingFine] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Campus Scholar Card');
  const [payError, setPayError] = useState(null);

  // Lock background scroll and handle Escape key when modals are active
  useEffect(() => {
    const isAnyModalOpen = Boolean(showInterestsModal || returnModalLoan || showPayModal);
    if (!isAnyModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (returnModalLoan && !returningLoan) {
          setReturnModalLoan(null);
          setReturnError(null);
        } else if (showInterestsModal && !savingInterests) {
          setShowInterestsModal(false);
        } else if (showPayModal && !payingFine) {
          setShowPayModal(false);
          setPayError(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showInterestsModal, returnModalLoan, returningLoan, savingInterests, showPayModal, payingFine]);

  const handleToggleTag = (tag) => {
    const trimmed = (interestsText || '').trim();
    if (!trimmed) {
      setInterestsText(tag);
      return;
    }
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|,\\s*)${escapedTag}(\\s*,|$)`, 'i');
    if (regex.test(trimmed)) {
      const updated = trimmed
        .replace(regex, '$1')
        .replace(/^,\s*|,\s*$/g, '')
        .replace(/,\s*,/g, ', ')
        .trim();
      setInterestsText(updated);
    } else {
      setInterestsText(`${trimmed}, ${tag}`);
    }
  };

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [loansData, resData, recData, wishData, seatData, penaltyData] = await Promise.all([
        api.getLoans(),
        api.getReservations(),
        api.getRecommendations(),
        api.getWishlist(),
        api.getUserSeatReservations(),
        api.getPenaltyStatus().catch(() => ({ isBlocked: false, unpaidFines: 0, overdueCount: 0, penaltyLoans: [], reason: null }))
      ]);

      const safeLoans = Array.isArray(loansData) ? loansData : [];
      const safeReservations = Array.isArray(resData) ? resData : [];
      const safeRecs = Array.isArray(recData) ? recData : [];
      const safeWishlist = Array.isArray(wishData) ? wishData : [];
      const safeSeats = Array.isArray(seatData) ? seatData : [];

      setLoans(safeLoans);
      setReservations(safeReservations);
      setRecommendations(safeRecs);
      setWishlist(safeWishlist);
      setSeatBookings(safeSeats);
      if (penaltyData) {
        setPenaltyStatus(penaltyData);
      }

      if (onUpdateStats) {
        const activeL = safeLoans.filter(l => l.status === 'borrowed' || l.status === 'active' || l.status === 'overdue').length;
        const activeR = safeReservations.filter(r => r.status === 'waiting' || r.status === 'ready_for_pickup').length;
        const activeS = safeSeats.filter(s => s.status === 'active').length;
        onUpdateStats({
          loanCount: activeL,
          holdCount: activeR,
          seatCount: activeS,
          wishlistCount: safeWishlist.length
        });
      }
    } catch (err) {
      console.error('Failed to fetch patron folio data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, onUpdateStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (content, isError = false) => {
    if (typeof content === 'string') {
      setToastMessage({ title: null, msg: content, isError });
    } else if (content && typeof content === 'object') {
      setToastMessage({
        title: content.title || null,
        msg: content.msg || content.message || '',
        isError: Boolean(content.isError || isError)
      });
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleRenewLoan = async (loanId) => {
    try {
      await api.renewLoan(loanId);
      showToast({
        title: 'Loan Extended',
        msg: 'Due date successfully extended by 14 days.',
        isError: false
      });
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleOpenReturnModal = (loan) => {
    setReturnModalLoan(loan);
    setReturnError(null);
  };

  const handleReturnLoan = (loanOrId, bookTitle) => {
    if (typeof loanOrId === 'object' && loanOrId !== null) {
      handleOpenReturnModal(loanOrId);
    } else {
      const found = loans.find(l => l.id === loanOrId);
      if (found) {
        handleOpenReturnModal(found);
      } else {
        handleOpenReturnModal({ id: loanOrId, book_title: bookTitle || 'Book Copy' });
      }
    }
  };

  const handleConfirmReturn = async () => {
    if (!returnModalLoan || returningLoan) return;
    setReturningLoan(true);
    setReturnError(null);
    try {
      await api.returnBook(returnModalLoan.id);
      setReturnModalLoan(null);
      showToast({
        title: 'Volume Returned Successfully',
        msg: 'Thank you for returning the physical copy to circulation.',
        isError: false
      });
      fetchData();
    } catch (err) {
      console.error('Return book error:', err);
      setReturnError(err.message || 'Failed to process return. Please visit the front desk.');
    } finally {
      setReturningLoan(false);
    }
  };

  const handleCancelReservation = async (resId) => {
    try {
      await api.cancelReservation(resId);
      showToast('Reservation hold cancelled.');
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleCancelSeatBooking = async (bookingId) => {
    try {
      await api.cancelSeatReservation(bookingId);
      showToast('Study seat reservation released.');
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handlePayFines = async (loanId = null) => {
    setPayingFine(true);
    setPayError(null);
    try {
      const res = await api.payFines({ loan_id: loanId, payment_method: paymentMethod });
      showToast({
        title: 'Penalty Settled Successfully',
        msg: res.message || 'Payment received. Account hold lifted and privileges fully restored!',
        isError: false
      });
      setShowPayModal(false);
      fetchData();
    } catch (err) {
      setPayError(err.message || 'Payment failed');
      showToast(err.message || 'Payment failed', true);
    } finally {
      setPayingFine(false);
    }
  };

  const handleRemoveWishlist = async (bookId, e) => {
    if (e) e.stopPropagation();
    try {
      await api.removeFromWishlist(bookId);
      showToast('Removed from saved wishlist.');
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleDismissReturnWarning = async () => {
    try {
      await api.dismissReturnWarning();
      setPenaltyStatus(prev => ({
        ...prev,
        returnWarning: { active: false, message: null, loanId: null, bookTitle: null }
      }));
      showToast('Return notice acknowledged. Please return the physical volume promptly.');
      fetchData();
    } catch (err) {
      console.error('Failed to dismiss warning:', err);
    }
  };

  const handleBorrowWishlistBook = async (book, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.checkoutBook({ book_id: book.id });
      showToast(`Success! Checked out copy ${res.copyCode} of "${book.title}". Due in 14 days.`);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Checkout failed', true);
    }
  };

  const handleReserveWishlistBook = async (bookId, title, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.placeReservation(bookId);
      showToast(res.message || `Hold queue confirmed for "${title}"!`);
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleSaveInterests = async (e) => {
    if (e) e.preventDefault();
    setSavingInterests(true);
    try {
      await api.updateInterests(interestsText);
      await reloadProfile();
      setShowInterestsModal(false);
      showToast('Reading interests updated. Recommendations refreshed.');
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSavingInterests(false);
    }
  };

  const activeLoans = loans.filter(l => l.status === 'borrowed' || l.status === 'active' || l.status === 'overdue');
  const pastLoans = loans.filter(l => l.status === 'returned');
  const activeReservations = reservations.filter(r => r.status === 'waiting' || r.status === 'ready_for_pickup');
  const activeSeats = seatBookings.filter(b => b.status === 'active');

  // Foremost currently reading volume for magazine feature
  const primaryLoan = activeLoans.length > 0 ? activeLoans[0] : null;

  if (!user) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--editorial-bg)'
        }}
      >
        <div
          style={{
            width: '480px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            padding: '42px 36px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--editorial-green)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}
          >
            <BookOpen size={26} strokeWidth={2.2} />
          </div>
          <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
            PATRON AUTHENTICATION
          </span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--editorial-text)', margin: '8px 0 12px', fontFamily: 'var(--font-serif)' }}>
            Sign In to Your Reading Room
          </h2>
          <p style={{ fontSize: '0.90rem', color: 'var(--editorial-text-muted)', lineHeight: 1.6, marginBottom: '26px' }}>
            Please sign in with your patron credentials to view active book loans, reservation queues, saved wishlist, and reserved study carrels.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            Sign In to Personal Folio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px clamp(16px, 3vw, 32px) 80px', maxWidth: '1360px' }}>
      {/* Toast Notification */}
      {toastMessage && typeof document !== 'undefined' && createPortal(
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            backgroundColor: 'var(--editorial-text)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--editorial-border)',
            padding: '14px 20px',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '420px',
            animation: 'slideUpFade 0.28s ease'
          }}
        >
          {toastMessage.isError ? (
            <AlertTriangle size={20} color="#E07A5F" />
          ) : (
            <CheckCircle2 size={20} color="#74C69D" />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {toastMessage.title && (
              <strong style={{ fontSize: '0.88rem', color: '#FFFFFF', marginBottom: '2px' }}>
                {toastMessage.title}
              </strong>
            )}
            <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.4 }}>
              {toastMessage.msg}
            </span>
          </div>
        </div>,
        document.body
      )}

      {/* ── 1. Editorial Reading Room Masthead & Folio Header ── */}
      <section
        style={{
          borderBottom: '1px solid var(--editorial-border)',
          paddingBottom: '28px',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="editorial-kicker">
                PATRON FOLIO • SCHOLAR SANCTUARY
              </span>
              <span style={{ color: 'var(--editorial-border)' }}>•</span>
              <span
                style={{
                  fontSize: '0.70rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  color: 'var(--editorial-accent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                ID: {user?.membership_id || 'STU-1001'}
              </span>
              <span style={{ color: 'var(--editorial-border)' }}>•</span>
              {penaltyStatus.isBlocked || penaltyStatus.unpaidFines > 0 ? (
                <span
                  style={{
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    color: '#C5221F',
                    backgroundColor: '#FDECE7',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    border: '1px solid #FCA5A5'
                  }}
                >
                  ● Account Hold Active (Penalty: ${penaltyStatus.unpaidFines.toFixed(2)})
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.70rem',
                    fontWeight: 600,
                    color: 'var(--editorial-green)',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    border: '1px solid var(--editorial-border)'
                  }}
                >
                  ● Active Scholar in Good Standing
                </span>
              )}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                fontWeight: 800,
                color: 'var(--editorial-text)',
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                margin: '0 0 12px'
              }}
            >
              The Reading Room of {user?.name || 'Reader'}
            </h1>

            <p
              style={{
                fontSize: '1.02rem',
                color: 'var(--editorial-text-muted)',
                lineHeight: 1.6,
                margin: 0
              }}
            >
              Your personal circulation ledger — monitor currently borrowed volumes, track renewal eligibility, manage hold queues, and explore literary selections curated for your interests.
            </p>
          </div>

          {/* Masthead Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Search size={14} strokeWidth={2.2} />
              <span>Explore Catalog</span>
            </button>
            <button
              onClick={() => {
                setInterestsText(user?.interests || '');
                setShowInterestsModal(true);
              }}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Settings size={14} strokeWidth={2.2} />
              <span>Curate Interests</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Official Book Return Warning Notice from Librarian ── */}
      {penaltyStatus?.returnWarning?.active && (
        <section
          style={{
            backgroundColor: '#FFFBEB',
            border: '2px solid #F59E0B',
            borderRadius: 'var(--radius-sm)',
            padding: '22px 26px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', maxWidth: '780px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertCircle size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#B45309'
                  }}
                >
                  CIRCULATION DESK NOTICE • RETURN DATE PASSED
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  color: '#78350F',
                  margin: '0 0 6px',
                  fontWeight: 700
                }}
              >
                Physical Volume Return Required
              </h3>
              <p
                style={{
                  fontSize: '0.86rem',
                  color: '#92400E',
                  margin: 0,
                  lineHeight: 1.5
                }}
              >
                {penaltyStatus.returnWarning.message || `The return date for "${penaltyStatus.returnWarning.bookTitle || 'your borrowed volume'}" has passed. Please return the book to the circulation desk immediately to prevent late penalty fine issuance.`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDismissReturnWarning}
              className="btn btn-sm"
              style={{
                backgroundColor: '#B45309',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                padding: '8px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Check size={14} strokeWidth={2.2} />
              <span>I Understand, I Will Return It</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('loans')}
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#B45309', color: '#78350F', padding: '8px 14px' }}
            >
              <span>View Borrowed Copy</span>
            </button>
          </div>
        </section>
      )}

      {/* ── Editorial Account Hold & Penalty Alert Banner ── */}
      {(penaltyStatus.isBlocked || penaltyStatus.unpaidFines > 0) && (
        <section
          style={{
            backgroundColor: '#FFF7F5',
            border: '1.5px solid #E07A5F',
            borderRadius: 'var(--radius-sm)',
            padding: '22px 26px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', maxWidth: '780px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FDECE7',
                color: '#C5221F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#C5221F'
                  }}
                >
                  CIRCULATION POLICY NOTICE • ACCOUNT PRIVILEGES SUSPENDED
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    backgroundColor: '#C5221F',
                    color: '#FFFFFF',
                    padding: '1px 7px',
                    borderRadius: '2px'
                  }}
                >
                  HOLD ACTIVE
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  margin: '0 0 6px'
                }}
              >
                Outstanding Penalty: ${penaltyStatus.unpaidFines.toFixed(2)}
                {penaltyStatus.overdueCount > 0 && ` (${penaltyStatus.overdueCount} overdue volume${penaltyStatus.overdueCount > 1 ? 's' : ''})`}
              </h3>
              <p
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--editorial-text-muted)',
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                Under circulation policy, members with unpaid penalties cannot borrow or check out books. You may still browse the catalog and book study seats freely. Settle your penalty using your QR code to restore borrowing privileges.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPayError(null);
              setShowPayModal(true);
            }}
            className="btn btn-primary"
            style={{
              padding: '11px 22px',
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#9B6548',
              borderColor: '#9B6548'
            }}
          >
            <CreditCard size={16} strokeWidth={2} />
            <span>Pay Penalty (${penaltyStatus.unpaidFines.toFixed(2)}) & Restore Privileges</span>
          </button>
        </section>
      )}

      {/* ── 2. Editorial Reading Statistics (Large Serif Highlight Numbers) ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '36px'
        }}
      >
        {[
          ...(penaltyStatus.unpaidFines > 0 ? [{
            label: 'CIRCULATION PENALTY',
            value: `$${penaltyStatus.unpaidFines.toFixed(2)}`,
            meta: 'Account hold active • Click to remit',
            isPenalty: true,
            color: '#C5221F'
          }] : []),
          {
            label: 'VOLUMES ON LOAN',
            value: String(activeLoans.length).padStart(2, '0'),
            meta: `Max allowance: 05 copies`,
            tab: 'loans',
            color: 'var(--editorial-text)'
          },
          {
            label: 'ACTIVE HOLD QUEUES',
            value: String(activeReservations.length).padStart(2, '0'),
            meta: activeReservations.some(r => r.status === 'ready_for_pickup') ? '● 1 Ready for Pickup' : 'Waitlist notifications on',
            tab: 'holds',
            color: activeReservations.length > 0 ? 'var(--editorial-accent)' : 'var(--editorial-text)'
          },
          {
            label: 'RESERVED STUDY PODS',
            value: String(activeSeats.length).padStart(2, '0'),
            meta: activeSeats.length > 0 ? `${activeSeats[0].time_slot}` : 'Silent carrels available',
            tab: 'seats',
            color: 'var(--editorial-text)'
          },
          {
            label: 'CURATED WISHLIST',
            value: String(wishlist.length).padStart(2, '0'),
            meta: 'Saved for future study',
            tab: 'wishlist',
            color: 'var(--editorial-text)'
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (stat.isPenalty) {
                setPayError(null);
                setShowPayModal(true);
              } else {
                handleTabChange(stat.tab);
              }
            }}
            style={{
              backgroundColor: stat.isPenalty ? '#FFF7F5' : currentTab === stat.tab ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
              border: stat.isPenalty ? '1.5px solid #FCA5A5' : currentTab === stat.tab ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '22px 24px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: currentTab === stat.tab ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--editorial-accent)',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.5rem',
                fontWeight: 800,
                lineHeight: 1,
                color: stat.color,
                letterSpacing: '-0.03em',
                marginBottom: '6px'
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)', fontWeight: 500 }}>
              {stat.meta}
            </div>
          </div>
        ))}
      </section>

      {/* ── 3. Single Unified Magazine Section Switcher ── */}
      <section
        style={{
          borderBottom: '1px solid var(--editorial-border)',
          paddingBottom: '16px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Records', count: null },
            { id: 'loans', label: 'Borrowed Copies', count: activeLoans.length },
            { id: 'holds', label: 'Hold Queues', count: activeReservations.length },
            { id: 'seats', label: 'Study Pods', count: activeSeats.length },
            { id: 'wishlist', label: 'Saved Wishlist', count: wishlist.length },
            { id: 'compare', label: 'Compare Matrix', count: compareBookIds.length },
            { id: 'recommendations', label: 'Curated For You', count: recommendations.length }
          ].map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  backgroundColor: isActive ? 'var(--editorial-green)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--editorial-text)',
                  border: isActive ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.22)' : 'var(--editorial-bg-subtle)',
                      color: isActive ? '#FFFFFF' : 'var(--editorial-accent)',
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)', fontWeight: 500 }}>
          Viewing: <strong style={{ color: 'var(--editorial-text)' }}>{currentTab.toUpperCase()}</strong>
        </div>
      </section>

      {/* ── 4. Active Borrowed Volumes (Circulation Ledger) ── */}
      {(currentTab === 'all' || currentTab === 'loans') && (
        <section style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px', borderBottom: '1px solid var(--editorial-border)', paddingBottom: '10px' }}>
            <div>
              <span className="editorial-kicker">CIRCULATION LEDGER</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '2px 0 0', color: 'var(--editorial-text)' }}>
                Active Borrowed Books ({activeLoans.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-outline btn-sm"
            >
              Borrow Another Book →
            </button>
          </div>

          {activeLoans.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '40px 24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <BookOpen size={36} color="var(--editorial-text-muted)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', margin: '0 0 6px' }}>
                No Physical Volumes Currently on Loan
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', margin: '0 0 18px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
                Your circulation ledger is clear. Explore the library chambers to borrow your next scholarly read.
              </p>
              <button
                onClick={() => onNavigate('catalog')}
                className="btn btn-primary btn-sm"
              >
                Browse Available Volumes
              </button>
            </div>
          ) : currentTab === 'all' ? (
            /* In All tab: Show Featured Spread for primary loan + Grid for any additional loans */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {primaryLoan && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '30px clamp(18px, 3vw, 36px)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '32px',
                      alignItems: 'center'
                    }}
                  >
                    {/* Left: Specimen Book Cover */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        padding: '20px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--editorial-border)'
                      }}
                    >
                      <div
                        style={{
                          width: '170px',
                          height: '240px',
                          borderRadius: '2px',
                          overflow: 'hidden',
                          boxShadow: '0 10px 24px rgba(37, 40, 32, 0.16)',
                          border: '1px solid var(--editorial-border)',
                          cursor: 'pointer'
                        }}
                        onClick={() => onViewBookDetails(primaryLoan.book_id)}
                      >
                        <img
                          src={primaryLoan.cover_image || getOfflineBookCover(primaryLoan.book_title, primaryLoan.book_author || 'Scholar', 'Circulation')}
                          alt={primaryLoan.book_title}
                          onError={(e) => handleBookCoverError(e, primaryLoan.book_title, primaryLoan.book_author || 'Scholar', 'Circulation')}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>

                    {/* Right: Editorial Loan Details & Circulation Controls */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                          PRIMARY VOLUME IN CIRCULATION
                        </span>
                        <span style={{ color: 'var(--editorial-border)' }}>•</span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'var(--editorial-text-muted)',
                            backgroundColor: 'var(--editorial-bg-subtle)',
                            padding: '2px 8px',
                            borderRadius: '2px',
                            border: '1px solid var(--editorial-border)'
                          }}
                        >
                          {primaryLoan.copy_code}
                        </span>
                      </div>

                      <h2
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)',
                          fontWeight: 800,
                          color: 'var(--editorial-text)',
                          lineHeight: 1.2,
                          letterSpacing: '-0.02em',
                          margin: '0 0 8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => onViewBookDetails(primaryLoan.book_id)}
                      >
                        {primaryLoan.book_title}
                      </h2>

                      <div style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', marginBottom: '14px' }}>
                        by <strong style={{ color: 'var(--editorial-text)' }}>{primaryLoan.book_author || 'Scholar'}</strong>
                      </div>

                      {(() => {
                        const dueDate = new Date(primaryLoan.due_date);
                        const isOverdue = primaryLoan.status === 'overdue' || new Date() > dueDate;
                        const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            {isOverdue ? (
                              <span className="badge badge-danger">
                                ● OVERDUE (${primaryLoan.fine_amount ? primaryLoan.fine_amount.toFixed(2) : '1.00'} Fine)
                              </span>
                            ) : (
                              <span className="badge badge-available">
                                ● Due in {daysLeft} days
                              </span>
                            )}
                            <span style={{ fontSize: '0.84rem', color: 'var(--editorial-text-muted)' }}>
                              Return deadline: <strong>{dueDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                            </span>
                          </div>
                        );
                      })()}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleReturnLoan(primaryLoan)}
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Check size={14} strokeWidth={2.4} />
                          <span>Return This Volume</span>
                        </button>

                        <button
                          onClick={() => handleRenewLoan(primaryLoan.id)}
                          disabled={primaryLoan.renewal_count >= 2}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          title={primaryLoan.renewal_count >= 2 ? 'Maximum renewals (2) reached' : 'Extend due date by 14 days'}
                        >
                          <RotateCw size={13} />
                          <span>Renew Loan ({2 - (primaryLoan.renewal_count || 0)} left)</span>
                        </button>

                        <button
                          onClick={() => onViewBookDetails(primaryLoan.book_id)}
                          className="btn btn-outline btn-sm"
                        >
                          <span>Volume Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Active Loans in All Tab */}
              {activeLoans.length > 1 && (
                <div>
                  <div style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    ADDITIONAL VOLUMES IN CIRCULATION ({activeLoans.length - 1})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
                    {activeLoans.slice(1).map(loan => {
                      const dueDate = new Date(loan.due_date);
                      const isOverdue = loan.status === 'overdue' || new Date() > dueDate;
                      const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

                      return (
                        <div
                          key={loan.id}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--editorial-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '18px',
                            display: 'flex',
                            gap: '16px',
                            boxShadow: 'var(--shadow-sm)',
                            alignItems: 'stretch'
                          }}
                        >
                          <div
                            style={{
                              width: '76px',
                              minWidth: '76px',
                              height: '110px',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(37, 40, 32, 0.12)',
                              border: '1px solid var(--editorial-border)',
                              backgroundColor: 'var(--editorial-bg-subtle)',
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                            onClick={() => onViewBookDetails(loan.book_id)}
                          >
                            <img
                              src={loan.cover_image || getOfflineBookCover(loan.book_title, loan.book_author || 'Scholar', 'Circulation')}
                              alt={loan.book_title}
                              onError={(e) => handleBookCoverError(e, loan.book_title, loan.book_author || 'Scholar', 'Circulation')}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '3px' }}>
                                <h4
                                  style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.02rem',
                                    fontWeight: 700,
                                    color: 'var(--editorial-text)',
                                    margin: 0,
                                    lineHeight: 1.3,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => onViewBookDetails(loan.book_id)}
                                >
                                  {loan.book_title}
                                </h4>
                                {isOverdue ? (
                                  <span className="badge badge-danger" style={{ flexShrink: 0 }}>Overdue</span>
                                ) : (
                                  <span className="badge badge-available" style={{ flexShrink: 0 }}>{daysLeft}d left</span>
                                )}
                              </div>

                              <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)', marginBottom: '6px' }}>
                                by <strong style={{ color: 'var(--editorial-text)' }}>{loan.book_author || 'Scholar'}</strong>
                              </div>

                              <div style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', marginBottom: '4px' }}>
                                Barcode: <code style={{ color: 'var(--editorial-text)', fontFamily: 'monospace', fontWeight: 600, backgroundColor: 'var(--editorial-bg)', padding: '1px 5px', borderRadius: '2px', border: '1px solid var(--editorial-border)' }}>{loan.copy_code}</code>
                              </div>

                              <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                                Due on: <strong style={{ color: 'var(--editorial-text)' }}>{dueDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--editorial-border)', marginTop: '8px', flexWrap: 'wrap', gap: '6px' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)' }}>
                                Renewals: {loan.renewal_count || 0}/2
                              </span>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleReturnLoan(loan)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                                >
                                  ✓ Return
                                </button>
                                <button
                                  onClick={() => handleRenewLoan(loan.id)}
                                  disabled={loan.renewal_count >= 2}
                                  className="btn btn-outline btn-sm"
                                  style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                                >
                                  Renew
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* In Loans tab: Complete Physical Copies Circulation Table + Specimen Grid */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
              {/* Accession Copies Summary Table */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--editorial-border)', backgroundColor: 'var(--editorial-bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--editorial-accent)' }}>
                    PHYSICAL BORROWED COPIES ({activeLoans.length})
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--editorial-text-muted)' }}>
                    Max Allowance: 5 Copies Concurrent
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--editorial-bg)', borderBottom: '1px solid var(--editorial-border)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700 }}>Barcode / Copy Code</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700 }}>Book Title</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700 }}>Category &amp; Location</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700 }}>Due Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700 }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--editorial-text)', fontWeight: 700 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeLoans.map(loan => {
                        const dueDate = new Date(loan.due_date);
                        const isOverdue = loan.status === 'overdue' || new Date() > dueDate;
                        const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                        return (
                          <tr key={loan.id} style={{ borderBottom: '1px solid var(--editorial-border)' }}>
                            <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--editorial-text)' }}>
                              <span style={{ backgroundColor: 'var(--editorial-bg)', padding: '3px 8px', borderRadius: '2px', border: '1px solid var(--editorial-border)' }}>
                                {loan.copy_code}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <strong style={{ color: 'var(--editorial-text)', cursor: 'pointer', display: 'block' }} onClick={() => onViewBookDetails(loan.book_id)}>
                                {loan.book_title}
                              </strong>
                              <span style={{ fontSize: '0.76rem', color: 'var(--editorial-text-muted)' }}>by {loan.book_author || 'Scholar'}</span>
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: '0.80rem', color: 'var(--editorial-text-muted)' }}>
                              <div>{loan.category || 'General Collection'}</div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>{loan.floor || 'Floor 1'} • {loan.shelf || 'Main Stacks'}</div>
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: isOverdue ? '#C5221F' : 'var(--editorial-text)' }}>
                              {dueDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              {isOverdue ? (
                                <span className="badge badge-danger">● Overdue ({loan.fine_amount ? `$${loan.fine_amount.toFixed(2)}` : '$1.00'})</span>
                              ) : (
                                <span className="badge badge-available">● {daysLeft} days left</span>
                              )}
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleReturnLoan(loan)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                                >
                                  ✓ Return
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRenewLoan(loan.id)}
                                  disabled={loan.renewal_count >= 2}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                                >
                                  Renew
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onViewBookDetails(loan.book_id)}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                                >
                                  Details →
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Specimen Cards View */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {activeLoans.map(loan => {
                const dueDate = new Date(loan.due_date);
                const isOverdue = loan.status === 'overdue' || new Date() > dueDate;
                const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={loan.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--editorial-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '20px',
                      display: 'flex',
                      gap: '18px',
                      boxShadow: 'var(--shadow-sm)',
                      alignItems: 'stretch'
                    }}
                  >
                    {/* Book Cover Specimen */}
                    <div
                      style={{
                        width: '88px',
                        minWidth: '88px',
                        height: '130px',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(37, 40, 32, 0.12)',
                        border: '1px solid var(--editorial-border)',
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      onClick={() => onViewBookDetails(loan.book_id)}
                      title={`View details for ${loan.book_title}`}
                    >
                      <img
                        src={loan.cover_image || getOfflineBookCover(loan.book_title, loan.book_author || 'Scholar', 'Circulation')}
                        alt={loan.book_title}
                        onError={(e) => handleBookCoverError(e, loan.book_title, loan.book_author || 'Scholar', 'Circulation')}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Book Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                          <h4
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1.08rem',
                              fontWeight: 700,
                              color: 'var(--editorial-text)',
                              margin: 0,
                              lineHeight: 1.3,
                              cursor: 'pointer'
                            }}
                            onClick={() => onViewBookDetails(loan.book_id)}
                          >
                            {loan.book_title}
                          </h4>
                          {isOverdue ? (
                            <span className="badge badge-danger" style={{ flexShrink: 0 }}>Overdue</span>
                          ) : (
                            <span className="badge badge-available" style={{ flexShrink: 0 }}>{daysLeft}d left</span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.80rem', color: 'var(--editorial-text-muted)', marginBottom: '8px' }}>
                          by <strong style={{ color: 'var(--editorial-text)' }}>{loan.book_author || 'Scholar'}</strong>
                        </div>

                        <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', marginBottom: '6px' }}>
                          Barcode: <code style={{ color: 'var(--editorial-text)', fontFamily: 'monospace', fontWeight: 600, backgroundColor: 'var(--editorial-bg)', padding: '2px 6px', borderRadius: '2px', border: '1px solid var(--editorial-border)' }}>{loan.copy_code}</code>
                        </div>

                        <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>
                          Due on: <strong style={{ color: 'var(--editorial-text)' }}>{dueDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--editorial-border)', marginTop: '10px', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '0.70rem', color: 'var(--editorial-text-muted)' }}>
                          Renewals: {loan.renewal_count || 0}/2
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleReturnLoan(loan)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                          >
                            ✓ Return
                          </button>
                          <button
                            onClick={() => handleRenewLoan(loan.id)}
                            disabled={loan.renewal_count >= 2}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                          >
                            Renew
                          </button>
                          <button
                            onClick={() => onViewBookDetails(loan.book_id)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

          {/* If In Loans Tab: Also Display Past Returned Circulation History */}
          {currentTab === 'loans' && pastLoans.length > 0 && (
            <div style={{ marginTop: '48px', borderTop: '1px solid var(--editorial-border)', paddingTop: '28px' }}>
              <div style={{ marginBottom: '16px' }}>
                <span className="editorial-kicker">ARCHIVAL READING RECORD</span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '2px 0 0', color: 'var(--editorial-text)' }}>
                  Returned Volumes History ({pastLoans.length})
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                {pastLoans.map(pLoan => (
                  <div
                    key={pLoan.id}
                    style={{
                      backgroundColor: 'var(--editorial-bg-subtle)',
                      border: '1px solid var(--editorial-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div
                        style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.94rem', color: 'var(--editorial-text)', cursor: 'pointer', lineHeight: 1.25, marginBottom: '3px' }}
                        onClick={() => onViewBookDetails(pLoan.book_id)}
                      >
                        {pLoan.book_title}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--editorial-text-muted)' }}>
                        Barcode: <code style={{ fontFamily: 'monospace' }}>{pLoan.copy_code}</code> • Returned to circulation
                      </div>
                    </div>
                    <button
                      onClick={() => onViewBookDetails(pLoan.book_id)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', flexShrink: 0 }}
                    >
                      View Volume →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── 5. Official Notices / Direct Messages from Administration ── */}
      {currentTab === 'all' && notifications && notifications.length > 0 && (
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--editorial-border)',
            borderLeft: '4px solid var(--editorial-accent)',
            borderRadius: 'var(--radius-sm)',
            padding: '22px 26px',
            marginBottom: '40px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={18} color="var(--editorial-accent)" strokeWidth={2.2} />
              <div>
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 700 }}>
                  Official Library Notices &amp; Announcements
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>
                  Administrative dispatches regarding renewals, holiday hours, and collection updates.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  onClick={() => setNotifTab('official')}
                  style={{
                    border: 'none',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: notifTab === 'official' ? 700 : 500,
                    backgroundColor: notifTab === 'official' ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                    color: notifTab === 'official' ? 'var(--editorial-text)' : 'var(--editorial-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Administrative
                </button>
                <button
                  onClick={() => setNotifTab('all')}
                  style={{
                    border: 'none',
                    borderLeft: '1px solid var(--editorial-border)',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: notifTab === 'all' ? 700 : 500,
                    backgroundColor: notifTab === 'all' ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                    color: notifTab === 'all' ? 'var(--editorial-text)' : 'var(--editorial-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  All Activity
                </button>
              </div>

              {notifications.some(n => !n.is_read) && (
                <button
                  onClick={markAllAsRead}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {(() => {
            const officialList = (notifications || []).filter(n => {
              const isWelcome = n.title?.toLowerCase().includes('welcome') || n.message?.toLowerCase().includes('membership');
              const isAdminMsg = n.type === 'announcement' || n.title?.toLowerCase().includes('admin') || n.title?.toLowerCase().includes('notice') || n.title?.toLowerCase().includes('warning');
              return isWelcome || isAdminMsg;
            });
            const displayList = notifTab === 'official' ? officialList : (notifications || []);

            if (displayList.length === 0) {
              return (
                <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--editorial-text-muted)', fontSize: '0.86rem' }}>
                  No unread official administrative notices at this time.
                </div>
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayList.slice(0, 4).map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: n.is_read ? 'var(--editorial-bg)' : 'var(--editorial-bg-subtle)',
                      border: '1px solid var(--editorial-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--editorial-text)' }}>
                          {n.title}
                        </strong>
                        {!n.is_read && (
                          <span
                            style={{
                              backgroundColor: 'var(--editorial-accent)',
                              color: '#FFFFFF',
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '2px',
                              textTransform: 'uppercase'
                            }}
                          >
                            New
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--editorial-text-muted)', lineHeight: 1.45 }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '0.70rem', color: 'var(--editorial-text-muted)', marginTop: '4px', display: 'block' }}>
                        {new Date(n.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '3px 8px', flexShrink: 0 }}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      )}

      {/* ── 7. Hold Queues & Reservations ── */}
      {(currentTab === 'all' || currentTab === 'holds') && (
        <section style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px', borderBottom: '1px solid var(--editorial-border)', paddingBottom: '10px' }}>
            <div>
              <span className="editorial-kicker">WAITLIST LEDGER</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '2px 0 0', color: 'var(--editorial-text)' }}>
                Active Hold Queues ({activeReservations.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('reservations')}
              className="btn btn-outline btn-sm"
            >
              Open Full Reservations Hub →
            </button>
          </div>

          {activeReservations.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '36px 24px',
                textAlign: 'center'
              }}
            >
              <Bookmark size={34} color="var(--editorial-text-muted)" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', margin: '0 0 6px' }}>
                No Active Book Holds
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', margin: 0 }}>
                When high-demand books have zero available copies, reserve a hold to join the automated desk queue.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {activeReservations.map(res => (
                <div
                  key={res.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '18px',
                    display: 'flex',
                    gap: '14px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '84px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid var(--editorial-border)',
                      cursor: 'pointer'
                    }}
                    onClick={() => onViewBookDetails(res.book_id)}
                  >
                    <img
                      src={res.cover_image || getOfflineBookCover(res.book_title, 'Scholar', 'Reservation')}
                      alt={res.book_title}
                      onError={(e) => handleBookCoverError(e, res.book_title, 'Scholar', 'Reservation')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                        <h4
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '0.98rem',
                            color: 'var(--editorial-text)',
                            margin: 0,
                            lineHeight: 1.3,
                            cursor: 'pointer'
                          }}
                          onClick={() => onViewBookDetails(res.book_id)}
                        >
                          {res.book_title}
                        </h4>
                        {res.status === 'ready_for_pickup' ? (
                          <span className="badge badge-available">Ready</span>
                        ) : (
                          <span className="badge badge-reserved">Rank #{res.queue_position}</span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)', margin: '0 0 8px', lineHeight: 1.4 }}>
                        {res.status === 'ready_for_pickup'
                          ? `Held at circulation desk until ${new Date(res.pickup_deadline).toLocaleDateString()}.`
                          : `In line position #${res.queue_position}. You will be notified when returned.`}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => handleCancelReservation(res.id)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#8C2222', borderColor: 'var(--editorial-border)' }}
                      >
                        Cancel Hold
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── 8. Biophilic Study Pods & Carrels ── */}
      {(currentTab === 'all' || currentTab === 'seats') && (
        <section style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px', borderBottom: '1px solid var(--editorial-border)', paddingBottom: '10px' }}>
            <div>
              <span className="editorial-kicker">STUDY SANCTUARY</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '2px 0 0', color: 'var(--editorial-text)' }}>
                Reserved Study Carrels &amp; Pods ({activeSeats.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('seats')}
              className="btn btn-secondary btn-sm"
            >
              Book Study Carrel →
            </button>
          </div>

          {activeSeats.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '36px 24px',
                textAlign: 'center'
              }}
            >
              <Armchair size={34} color="var(--editorial-text-muted)" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', margin: '0 0 6px' }}>
                No Active Study Pod Bookings
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', margin: '0 0 16px' }}>
                Reserve quiet desks with power outlets, monitors, and natural courtyard light.
              </p>
              <button
                onClick={() => onNavigate('seats')}
                className="btn btn-outline btn-sm"
              >
                View Floor Carrel Availability
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {activeSeats.map(booking => (
                <div
                  key={booking.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '0.70rem', fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {booking.floor} • {booking.section}
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--editorial-text)', margin: '2px 0 0' }}>
                          Study Pod {booking.seat_number}
                        </h4>
                      </div>
                      <span className="badge badge-available">Active Slot</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--editorial-text-muted)', margin: '12px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="var(--editorial-accent)" />
                        <span>Date: <strong>{booking.date}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="var(--editorial-accent)" />
                        <span>Time Slot: <strong>{booking.time_slot}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {booking.has_power === 1 && (
                        <span style={{ fontSize: '0.70rem', color: 'var(--editorial-green)', backgroundColor: 'var(--editorial-bg-subtle)', padding: '2px 6px', borderRadius: '2px', border: '1px solid var(--editorial-border)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Zap size={11} /> Power Socket
                        </span>
                      )}
                      {booking.has_monitor === 1 && (
                        <span style={{ fontSize: '0.70rem', color: 'var(--editorial-green)', backgroundColor: 'var(--editorial-bg-subtle)', padding: '2px 6px', borderRadius: '2px', border: '1px solid var(--editorial-border)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Monitor size={11} /> External Screen
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--editorial-border)' }}>
                    <button
                      onClick={() => handleCancelSeatBooking(booking.id)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.74rem', padding: '4px 10px', color: '#8C2222' }}
                    >
                      Release Carrel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── 9. Curated Recommendations ── */}
      {(currentTab === 'all' || currentTab === 'recommendations') && (
        <section style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px', borderBottom: '1px solid var(--editorial-border)', paddingBottom: '10px' }}>
            <div>
              <span className="editorial-kicker">LITERARY SELECTIONS</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '2px 0 0', color: 'var(--editorial-text)' }}>
                Recommended For You ({recommendations.length})
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--editorial-text-muted)', margin: '4px 0 0' }}>
                Curated based on your interests: <em>"{user?.interests || 'Classical Literature & Science'}"</em>
              </p>
            </div>
            <button
              onClick={() => {
                setInterestsText(user?.interests || '');
                setShowInterestsModal(true);
              }}
              className="btn btn-outline btn-sm"
            >
              Adjust Topics
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
            {recommendations.slice(0, 8).map(book => (
              <div key={book.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    padding: '5px 8px',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    color: 'var(--editorial-accent)',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    border: '1px solid var(--editorial-border)',
                    borderBottom: 'none',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0'
                  }}
                >
                  ★ {book.recommendationReason || 'Archival Match'}
                </div>
                <BookCard
                  book={book}
                  onViewDetails={onViewBookDetails}
                  onReserve={() => onNavigate('catalog')}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 10. Dedicated Full-Width Saved Wishlist View ── */}
      {currentTab === 'wishlist' && (
        <section style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px', borderBottom: '1px solid var(--editorial-border)', paddingBottom: '10px' }}>
            <div>
              <span className="editorial-kicker">PERSONAL DESIDERATA</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '2px 0 0', color: 'var(--editorial-text)' }}>
                Saved Wishlist &amp; Reading List ({wishlist.length})
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--editorial-text-muted)', margin: '4px 0 0' }}>
                Your private shelf of saved books. Borrow directly when copies are in stacks or place a hold.
              </p>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-outline btn-sm"
            >
              Browse Stacks to Add More →
            </button>
          </div>

          {wishlist.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '48px 24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Heart size={38} color="var(--editorial-accent)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', margin: '0 0 6px' }}>
                Your Wishlist is Empty
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', margin: '0 0 18px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
                Click "Save to Wishlist" on any book page to save it to your private reading shelf.
              </p>
              <button
                onClick={() => onNavigate('catalog')}
                className="btn btn-primary btn-sm"
              >
                Browse Available Volumes
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '22px' }}>
              {wishlist.map(book => {
                const isAvail = (book.available_copies ?? 1) > 0;
                return (
                  <div
                    key={book.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--editorial-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '210px',
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onClick={() => onViewBookDetails(book.id)}
                    >
                      <img
                        src={book.cover_image || getOfflineBookCover(book.title, book.author, book.category)}
                        alt={book.title}
                        onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        {isAvail ? (
                          <span className="badge badge-available">● In Stacks</span>
                        ) : (
                          <span className="badge badge-borrowed">● On Loan</span>
                        )}
                      </div>
                    </div>

                    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {book.category || 'Archival'}
                      </div>
                      <h4
                        style={{
                          margin: '0 0 4px',
                          fontSize: '1.02rem',
                          fontFamily: 'var(--font-serif)',
                          color: 'var(--editorial-text)',
                          lineHeight: 1.3,
                          cursor: 'pointer'
                        }}
                        onClick={() => onViewBookDetails(book.id)}
                      >
                        {book.title}
                      </h4>
                      <div style={{ fontSize: '0.80rem', color: 'var(--editorial-text-muted)', marginBottom: '10px' }}>
                        by <strong>{book.author}</strong>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', backgroundColor: 'var(--editorial-bg)', padding: '4px 8px', borderRadius: '2px', border: '1px solid var(--editorial-border)', marginBottom: '14px', marginTop: 'auto' }}>
                        📍 {book.floor || 'Floor 1'} • {book.shelf || 'Main Stacks'}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                        {isAvail ? (
                          <button
                            type="button"
                            onClick={(e) => handleBorrowWishlistBook(book, e)}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.76rem', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                          >
                            <BookOpen size={13} />
                            <span>Borrow Copy</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleReserveWishlistBook(book.id, book.title, e)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.76rem', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                          >
                            <Bookmark size={13} />
                            <span>Place Hold</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveWishlist(book.id, e)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 10px', color: '#991B1B', borderColor: '#FCA5A5' }}
                          title="Remove from wishlist"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── 11. Book Compare Matrix Section ── */}
      {currentTab === 'compare' && (
        <section style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px', borderBottom: '1px solid var(--editorial-border)', paddingBottom: '10px' }}>
            <div>
              <span className="editorial-kicker">LITERARY ANALYSIS &amp; COMPARISON</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '2px 0 0', color: 'var(--editorial-text)' }}>
                Patron Book Compare Matrix ({compareBookIds.length}/3)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--editorial-text-muted)', margin: '4px 0 0' }}>
                Compare up to 3 library volumes side by side: examine disciplines, page counts, accession copies, and stack locations.
              </p>
            </div>
            {compareBookIds.length > 0 && onClearCompare && (
              <button onClick={onClearCompare} className="btn btn-outline btn-sm">
                Clear Matrix
              </button>
            )}
          </div>

          <BookCompare
            compareBookIds={compareBookIds}
            onRemoveBook={onRemoveCompareBook}
            onClearCompare={onClearCompare}
            onAddBookById={onAddToCompare}
            onViewBookDetails={onViewBookDetails}
            onNavigate={onNavigate}
          />
        </section>
      )}

      {/* ── 12. Saved Wishlist & Borrowing History Spread (Overview & Loans) ── */}
      {(currentTab === 'all' || currentTab === 'loans') && (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: currentTab === 'all' ? 'repeat(auto-fit, minmax(340px, 1fr))' : '1fr',
            gap: '30px'
          }}
        >
          {/* Wishlist Column for Overview Tab */}
          {currentTab === 'all' && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: 0, color: 'var(--editorial-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="var(--editorial-accent)" strokeWidth={2} />
                  <span>Personal Wishlist ({wishlist.length})</span>
                </h3>
                <button
                  onClick={() => setCurrentTab('wishlist')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.74rem' }}
                >
                  View Full Shelf →
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--editorial-text-muted)', fontSize: '0.86rem' }}>
                  No titles saved to your wishlist yet. Click "Save to Wishlist" on any book page.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {wishlist.map(book => (
                    <div
                      key={book.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--editorial-bg)',
                        border: '1px solid var(--editorial-border)',
                        cursor: 'pointer'
                      }}
                      onClick={() => onViewBookDetails(book.id)}
                    >
                      <img
                        src={book.cover_image || getOfflineBookCover(book.title, book.author, book.category)}
                        alt={book.title}
                        onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                        style={{ width: '38px', height: '52px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--editorial-border)' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ margin: '0 0 2px', fontSize: '0.88rem', color: 'var(--editorial-text)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {book.title}
                        </h5>
                        <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                          {book.author}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleRemoveWishlist(book.id, e)}
                        title="Remove from wishlist"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--editorial-text-muted)',
                          padding: '4px'
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reading History Column */}
          {(currentTab === 'all' || currentTab === 'loans') && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: 0, color: 'var(--editorial-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="var(--editorial-accent)" strokeWidth={2} />
                  <span>Archival Reading History ({pastLoans.length})</span>
                </h3>
              </div>

              {pastLoans.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--editorial-text-muted)', fontSize: '0.86rem' }}>
                  Returned volumes will be archived here as your permanent reading record.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pastLoans.map(p => (
                    <div
                      key={p.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--editorial-bg)',
                        border: '1px solid var(--editorial-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.86rem', color: 'var(--editorial-text)' }}>
                          {p.book_title}
                        </strong>
                        <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', marginTop: '2px' }}>
                          Returned on {new Date(p.return_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <span className="badge badge-available">Archived</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Edit Reading Interests Modal (Editorial Styling) ── */}
      {showInterestsModal && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(37, 40, 32, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box'
          }}
          onClick={() => setShowInterestsModal(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              padding: '32px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="editorial-kicker">PERSONALIZED LITERARY CURATION</span>
                <h3 style={{ margin: '4px 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--editorial-text)' }}>
                  Reading Interests &amp; Subjects
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInterestsModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  padding: '5px',
                  color: 'var(--editorial-text-muted)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', lineHeight: 1.5, marginBottom: '18px' }}>
              Select scholarly topics or specify custom literary subjects. Your reading recommendations are continuously tailored to these topics.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
              {SUGGESTED_INTEREST_TAGS.map(tag => {
                const isSelected = (interestsText || '').toLowerCase().includes(tag.toLowerCase());
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    style={{
                      fontSize: '0.78rem',
                      padding: '5px 12px',
                      border: isSelected ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--editorial-green)' : 'var(--editorial-bg)',
                      color: isSelected ? '#FFFFFF' : 'var(--editorial-text)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{tag}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSaveInterests}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                  Custom Topics (comma-separated):
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  placeholder="e.g. Victorian Novels, Modern Architecture, Astrophysics, Renaissance History..."
                  style={{ fontSize: '0.90rem', lineHeight: 1.5, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowInterestsModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingInterests}
                  style={{ flex: 1.2 }}
                >
                  {savingInterests ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Return Book Confirmation Modal (Editorial Styling) ── */}
      {returnModalLoan && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(37, 40, 32, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box'
          }}
          onClick={() => {
            if (!returningLoan) {
              setReturnModalLoan(null);
              setReturnError(null);
            }
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '32px 28px',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--editorial-bg-subtle)',
                color: 'var(--editorial-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '1px solid var(--editorial-border)'
              }}
            >
              <BookOpen size={26} strokeWidth={2.2} />
            </div>

            <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
              CIRCULATION RETURN
            </span>

            <h3
              style={{
                margin: '6px 0 10px',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--editorial-text)',
                fontWeight: 800
              }}
            >
              Return This Physical Volume?
            </h3>

            <div
              style={{
                backgroundColor: 'var(--editorial-bg)',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                margin: '16px 0 18px',
                textAlign: 'left'
              }}
            >
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--editorial-text)', marginBottom: '4px' }}>
                {returnModalLoan.book_title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>
                Barcode: <code style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--editorial-text)' }}>{returnModalLoan.copy_code || 'N/A'}</code>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', lineHeight: 1.5, margin: '0 0 22px' }}>
              Once confirmed, this volume will be checked back into the library catalog and made available for other scholars.
            </p>

            {returnError && (
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 'var(--radius-sm)',
                  color: '#991B1B',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                  textAlign: 'left'
                }}
              >
                {returnError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  if (!returningLoan) {
                    setReturnModalLoan(null);
                    setReturnError(null);
                  }
                }}
                disabled={returningLoan}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Keep Reading
              </button>

              <button
                type="button"
                onClick={handleConfirmReturn}
                disabled={returningLoan}
                className="btn btn-primary"
                style={{ flex: 1.3 }}
              >
                {returningLoan ? 'Processing Return...' : 'Confirm Return'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Settle Penalty & Clear Hold Modal ── */}
      {showPayModal && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(37, 40, 32, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box'
          }}
          onClick={() => {
            if (!payingFine) {
              setShowPayModal(false);
              setPayError(null);
            }
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '32px 30px',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                  CIRCULATION TREASURY
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--editorial-text)',
                    margin: '4px 0 0'
                  }}
                >
                  Settle Penalty & Clear Hold
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                disabled={payingFine}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--editorial-text-muted)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', lineHeight: 1.55, marginBottom: '20px' }}>
              Select your payment method below to remit circulation penalties. Once received, your library account privileges will be immediately restored.
            </p>

            {/* Penalized Volumes Breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '8px' }}>
                ITEMIZED PENALTIES
              </div>
              <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)' }}>
                {penaltyStatus.penaltyLoans && penaltyStatus.penaltyLoans.length > 0 ? (
                  penaltyStatus.penaltyLoans.map(p => (
                    <div
                      key={p.id}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--editorial-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.84rem'
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--editorial-text)', display: 'block' }}>{p.book_title}</strong>
                        <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                          Barcode: {p.copy_code} • {p.status === 'overdue' ? 'Overdue loan' : 'Returned with late fine'}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, color: '#C5221F', fontSize: '0.98rem' }}>
                        ${p.fine_amount ? p.fine_amount.toFixed(2) : '1.00'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '14px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--editorial-text-muted)' }}>
                    Standard Athenaeum circulation assessment: ${penaltyStatus.unpaidFines.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Total Due Banner */}
            <div
              style={{
                backgroundColor: 'var(--editorial-bg-subtle)',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                Total Remittance Due
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, color: '#C5221F' }}>
                ${penaltyStatus.unpaidFines.toFixed(2)}
              </span>
            </div>

            {/* Official Penalty Payment QR Code */}
            {penaltyStatus.penaltyQrCode && (
              <div
                style={{
                  backgroundColor: 'var(--editorial-bg-subtle)',
                  border: '1.5px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: '8px' }}>
                  📱 LIBRARIAN PENALTY PAYMENT QR CODE
                </div>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    display: 'inline-block',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <img
                    src={penaltyStatus.penaltyQrCode}
                    alt="Circulation Penalty QR Code"
                    style={{ width: '160px', height: '160px', display: 'block' }}
                  />
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>
                  Scan with any payment / banking app to clear overdue penalty (${penaltyStatus.unpaidFines.toFixed(2)})
                </p>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                Select Payment Channel
              </label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                <option value="Campus Scholar Card">Campus Scholar Folio Balance</option>
                <option value="Debit/Credit Card">Visa / Mastercard / Amex</option>
                <option value="UPI / QR Remittance">UPI / Instant QR Payment</option>
                <option value="Sanctuary Desk Voucher">Circulation Desk Cash Receipt</option>
              </select>
            </div>

            {payError && (
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 'var(--radius-sm)',
                  color: '#991B1B',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '16px'
                }}
              >
                {payError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                disabled={payingFine}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePayFines()}
                disabled={payingFine}
                className="btn btn-primary"
                style={{ flex: 1.5, backgroundColor: 'var(--editorial-green)', borderColor: 'var(--editorial-green)' }}
              >
                {payingFine ? 'Authorizing Remittance...' : `Confirm & Remit $${penaltyStatus.unpaidFines.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
