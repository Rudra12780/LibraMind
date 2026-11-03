import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  Bookmark,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Search,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

export default function ReservationsPage({ onNavigate, onSelectBook }) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const fetchReservations = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reservations:', err);
      showToast(err.message || 'Failed to load reservations', true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancel = (id, title) => {
    setCancelTarget({ id, title });
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    const { id, title } = cancelTarget;
    setCancelTarget(null);
    setActionLoadingId(id);
    try {
      await api.cancelReservation(id);
      showToast(`Hold for "${title}" has been cancelled.`);
      fetchReservations();
    } catch (err) {
      showToast(err.message || 'Failed to cancel reservation', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleClaim = async (id, title) => {
    setActionLoadingId(id);
    try {
      const res = await api.claimReservation(id);
      showToast(res.message || `Successfully claimed "${title}"!`);
      fetchReservations();
    } catch (err) {
      showToast(err.message || 'Failed to claim reservation', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkPickup = async (id, title) => {
    setActionLoadingId(id);
    try {
      await api.markReservationPickup(id);
      showToast(`Marked "${title}" as ready for pickup! Student has been notified.`);
      fetchReservations();
    } catch (err) {
      showToast(err.message || 'Failed to update reservation', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter reservations based on active tab and search query
  const filteredReservations = reservations.filter((r) => {
    if (activeTab === 'ready' && r.status !== 'ready_for_pickup') return false;
    if (activeTab === 'waiting' && r.status !== 'waiting') return false;
    if (activeTab === 'fulfilled' && r.status !== 'fulfilled') return false;
    if (activeTab === 'archived' && !['cancelled', 'expired'].includes(r.status)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = r.book_title && r.book_title.toLowerCase().includes(q);
      const matchAuthor = r.book_author && r.book_author.toLowerCase().includes(q);
      const matchStudent = r.student_name && r.student_name.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchStudent;
    }
    return true;
  });

  const readyCount = reservations.filter((r) => r.status === 'ready_for_pickup').length;
  const waitingCount = reservations.filter((r) => r.status === 'waiting').length;
  const fulfilledCount = reservations.filter((r) => r.status === 'fulfilled').length;
  const archivedCount = reservations.filter((r) => ['cancelled', 'expired'].includes(r.status)).length;

  if (!user) {
    return (
      <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '80vh', padding: '80px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: '500px',
            padding: '40px 24px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--editorial-border)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <Bookmark size={28} color="var(--editorial-text)" strokeWidth={2.4} />
          </div>
          <h2 style={{ color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>
            Sign In to View Reservations
          </h2>
          <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '0.92rem', marginBottom: '24px', fontWeight: 500 }}>
            Book holds, waiting queue positions, and front-desk pickup notifications are linked to your membership profile.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            Sign In with Membership Card →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '36px 20px 80px' }}>
      <div className="container" style={{ maxWidth: '1150px', margin: '0 auto' }}>
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '20px',
              left: '20px',
              maxWidth: '420px',
              marginLeft: 'auto',
              backgroundColor: toastMessage.isError ? 'var(--editorial-accent)' : 'var(--editorial-border)',
              color: toastMessage.isError ? '#FFFFFF' : 'var(--editorial-text)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-card)',
              padding: '12px 20px',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}
          >
            {toastMessage.isError ? <AlertCircle size={18} strokeWidth={2.4} /> : <CheckCircle2 size={18} strokeWidth={2.4} />}
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '28px'
          }}
        >
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
                fontSize: '0.74rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '3px 10px',
                marginBottom: '6px'
              }}
            >
              <Bookmark size={13} strokeWidth={2.4} />
              Circulation Hold Services
            </div>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--editorial-text)', margin: '0 0 6px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
              Book Reservations & Waiting Lists
            </h1>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, margin: 0, fontSize: '0.94rem', fontWeight: 500 }}>
              {user.role === 'student'
                ? 'Track your active book holds, queue positions, and front-desk pickup notifications.'
                : 'Circulation desk queue manager: monitor active member holds and waiting lines.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={fetchReservations}
              disabled={loading}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} strokeWidth={2.4} />
              Refresh Queue
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <BookOpen size={14} strokeWidth={2.4} />
              Explore Catalog
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}
        >
          <div
            style={{
              padding: '18px 20px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-card)',
              borderTop: '6px solid var(--editorial-text)'
            }}
          >
            <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--editorial-text)', fontWeight: 800 }}>
              Total Holds Tracked
            </span>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--editorial-text)', marginTop: '4px' }}>
              {reservations.length}
            </div>
          </div>

          <div
            style={{
              padding: '18px 20px',
              backgroundColor: readyCount > 0 ? 'var(--editorial-border)' : '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-card)',
              borderTop: '6px solid var(--editorial-border)'
            }}
          >
            <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--editorial-text)', fontWeight: 800 }}>
              Ready for Pickup
            </span>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--editorial-text)', marginTop: '4px' }}>
              {readyCount}
            </div>
          </div>

          <div
            style={{
              padding: '18px 20px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-card)',
              borderTop: '6px solid var(--editorial-accent)'
            }}
          >
            <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--editorial-text)', fontWeight: 800 }}>
              In Waiting Queues
            </span>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--editorial-accent)', marginTop: '4px' }}>
              {waitingCount}
            </div>
          </div>

          <div
            style={{
              padding: '18px 20px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-card)',
              borderTop: '6px solid var(--editorial-green)'
            }}
          >
            <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--editorial-text)', fontWeight: 800 }}>
              Fulfilled / Claimed
            </span>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--editorial-green)', marginTop: '4px' }}>
              {fulfilledCount}
            </div>
          </div>
        </div>

        {/* Tabs and Search Bar */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              All Holds ({reservations.length})
            </button>
            <button
              onClick={() => setActiveTab('ready')}
              className={`btn btn-sm ${activeTab === 'ready' ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              ● Pickup Ready ({readyCount})
            </button>
            <button
              onClick={() => setActiveTab('waiting')}
              className={`btn btn-sm ${activeTab === 'waiting' ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Waiting Queue ({waitingCount})
            </button>
            <button
              onClick={() => setActiveTab('fulfilled')}
              className={`btn btn-sm ${activeTab === 'fulfilled' ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Fulfilled ({fulfilledCount})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`btn btn-sm ${activeTab === 'archived' ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Archived ({archivedCount})
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px', maxWidth: '360px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--editorial-text)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search title, author, or student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.86rem', height: '38px' }}
            />
          </div>
        </div>

        {/* Reservation List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--editorial-text)', fontWeight: 800, textTransform: 'uppercase' }}>
            Syncing reservation queue records...
          </div>
        ) : filteredReservations.length === 0 ? (
          <div
            style={{
              padding: '50px 24px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'var(--editorial-border)',
                border: '1px solid var(--editorial-border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--editorial-text)'
              }}
            >
              <Bookmark size={26} strokeWidth={2.4} />
            </div>
            <h3 style={{ color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>
              No Reservations Found
            </h3>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.9rem', fontWeight: 500 }}>
              {searchQuery
                ? `No holds matching "${searchQuery}". Try a different keyword.`
                : activeTab === 'ready'
                ? 'You have no books currently waiting for front-desk pickup.'
                : activeTab === 'waiting'
                ? 'You are not in any waiting queues at the moment.'
                : 'You have not reserved or joined a waiting list for any books yet.'}
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.88rem' }}
            >
              Browse Catalog →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredReservations.map((res) => {
              const isReady = res.status === 'ready_for_pickup';
              const isWaiting = res.status === 'waiting';
              const isFulfilled = res.status === 'fulfilled';
              const isCancelled = res.status === 'cancelled';
              const isExpired = res.status === 'expired';
              const isLoading = actionLoadingId === res.id;

              return (
                <div
                  key={res.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '20px 24px',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: isReady ? '6px 6px 0px var(--editorial-text)' : '4px 4px 0px var(--editorial-text)',
                    borderLeft: isReady ? '8px solid var(--editorial-border)' : isWaiting ? '8px solid var(--editorial-accent)' : '8px solid var(--editorial-text)',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(80px, 96px) 1fr auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}
                >
                  {/* Book Cover Thumbnail */}
                  <div
                    style={{
                      width: '90px',
                      height: '120px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--editorial-bg-subtle)',
                      border: '1px solid var(--editorial-border)',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    onClick={() => onSelectBook && onSelectBook(res.book_id)}
                  >
                    <img
                      src={res.cover_image || getOfflineBookCover(res.book_title, res.book_author || 'Archivist', res.book_category || 'Archival')}
                      alt={res.book_title}
                      onError={(e) => handleBookCoverError(e, res.book_title, res.book_author || 'Archivist', res.book_category || 'Archival')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {/* Status Badge */}
                      {isReady && (
                        <span
                          style={{
                            backgroundColor: 'var(--editorial-border)',
                            color: 'var(--editorial-text)',
                            border: '1px solid var(--editorial-border)',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            padding: '3px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            textTransform: 'uppercase'
                          }}
                        >
                          <CheckCircle2 size={13} strokeWidth={2.4} />
                          READY FOR PICKUP
                        </span>
                      )}

                      {isWaiting && (
                        <span
                          style={{
                            backgroundColor: 'var(--editorial-bg-subtle)',
                            color: 'var(--editorial-text)',
                            border: '1px solid var(--editorial-border)',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            padding: '3px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            textTransform: 'uppercase'
                          }}
                        >
                          <Clock size={13} strokeWidth={2.4} />
                          IN QUEUE (#{res.queue_position})
                        </span>
                      )}

                      {isFulfilled && (
                        <span
                          style={{
                            backgroundColor: 'var(--editorial-green)',
                            color: '#FFFFFF',
                            border: '1px solid var(--editorial-border)',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            padding: '3px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            textTransform: 'uppercase'
                          }}
                        >
                          <CheckCircle2 size={13} strokeWidth={2.4} />
                          COMPLETED
                        </span>
                      )}

                      {isCancelled && (
                        <span
                          style={{
                            backgroundColor: 'var(--editorial-bg-subtle)',
                            color: 'var(--editorial-text)',
                            border: '1px solid var(--editorial-border)',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            padding: '3px 8px',
                            textTransform: 'uppercase'
                          }}
                        >
                          CANCELLED
                        </span>
                      )}

                      {isExpired && (
                        <span
                          style={{
                            backgroundColor: 'var(--editorial-accent)',
                            color: '#FFFFFF',
                            border: '1px solid var(--editorial-border)',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            padding: '3px 8px',
                            textTransform: 'uppercase'
                          }}
                        >
                          EXPIRED
                        </span>
                      )}

                      {/* Shelf Location */}
                      {res.shelf_location && (
                        <span
                          style={{
                            fontSize: '0.74rem',
                            color: 'var(--editorial-text)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <MapPin size={12} strokeWidth={2.4} />
                          Shelf: {res.shelf_location}
                        </span>
                      )}
                    </div>

                    {/* Title & Author */}
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: 'var(--editorial-text)',
                        margin: '0 0 4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => onSelectBook && onSelectBook(res.book_id)}
                    >
                      {res.book_title}
                    </h3>
                    <p style={{ margin: '0 0 8px', fontSize: '0.88rem', color: 'var(--editorial-text)', opacity: 0.85, fontWeight: 600 }}>
                      by <strong>{res.book_author}</strong>
                    </p>

                    {/* Extra metadata */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem', color: 'var(--editorial-text)', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} strokeWidth={2.4} />
                        Reserved: {new Date(res.reservation_date).toLocaleDateString()}
                      </span>

                      {/* Pickup Deadline Notice */}
                      {isReady && res.pickup_deadline && (
                        <span style={{ color: 'var(--editorial-accent)', fontWeight: 900, textTransform: 'uppercase' }}>
                          Claim Deadline: {new Date(res.pickup_deadline).toLocaleString()} (Desk)
                        </span>
                      )}

                      {/* Librarian viewing info */}
                      {user.role !== 'student' && res.student_name && (
                        <span style={{ color: 'var(--editorial-green)', fontWeight: 800 }}>
                          Patron: {res.student_name} ({res.membership_id || res.student_email})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                    {isReady && (
                      <button
                        onClick={() => handleClaim(res.id, res.book_title)}
                        disabled={isLoading}
                        className="btn btn-secondary btn-sm"
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          fontSize: '0.84rem',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 size={15} strokeWidth={2.4} />
                        {isLoading ? 'Processing...' : 'Claim & Check Out'}
                      </button>
                    )}

                    {user.role !== 'student' && isWaiting && (
                      <button
                        onClick={() => handleMarkPickup(res.id, res.book_title)}
                        disabled={isLoading}
                        className="btn btn-secondary btn-sm"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '0.80rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        Mark Ready for Pickup
                      </button>
                    )}

                    {(isReady || isWaiting) && (
                      <button
                        onClick={() => handleCancel(res.id, res.book_title)}
                        disabled={isLoading}
                        className="btn btn-outline btn-sm"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '0.80rem',
                          color: 'var(--editorial-accent)',
                          borderColor: 'var(--editorial-accent)'
                        }}
                      >
                        {isLoading ? 'Cancelling...' : 'Cancel Hold'}
                      </button>
                    )}

                    <button
                      onClick={() => onSelectBook && onSelectBook(res.book_id)}
                      className="btn btn-outline btn-sm"
                      style={{
                        width: '100%',
                        padding: '7px 12px',
                        fontSize: '0.80rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>View Book</span>
                      <ArrowRight size={13} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Vintage Hold Cancellation Modal */}
      {cancelTarget && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(28, 15, 10, 0.70)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setCancelTarget(null)}
        >
          <div
            className="bio-card"
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'var(--vintage-vellum)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 24px',
              border: '1.5px solid var(--vintage-brass)',
              boxShadow: 'var(--shadow-modal)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6E1B24 0%, #8C2A35 100%)',
                border: '1.5px solid #C29B38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                fontSize: '24px',
                boxShadow: '0 2px 8px rgba(110, 27, 36, 0.25)'
              }}
            >
              ⏳
            </div>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: 'var(--vintage-walnut)', margin: '0 0 8px', fontWeight: 800 }}>
              Cancel Hold Queue?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--vintage-sepia)', lineHeight: 1.55, margin: '0 0 16px' }}>
              Are you sure you want to release your reservation hold for:
            </p>
            <div
              style={{
                backgroundColor: 'var(--vintage-parchment)',
                border: '1px solid #D8CABA',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                fontWeight: 700,
                color: 'var(--vintage-walnut)',
                fontFamily: 'var(--font-serif)',
                marginBottom: '20px'
              }}
            >
              {cancelTarget.title}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="btn btn-outline"
                style={{ flex: 1, backgroundColor: 'var(--vintage-cream)', color: 'var(--vintage-walnut)' }}
              >
                Keep Hold
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="btn btn-botanical"
                style={{ flex: 1 }}
              >
                ✓ Yes, Cancel Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
