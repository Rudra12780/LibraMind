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

export default function ReservationsPage({ onNavigate, onSelectBook }) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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

  const handleCancel = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel your hold on "${title}"?`)) {
      return;
    }
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
    // Tab filter
    if (activeTab === 'ready' && r.status !== 'ready_for_pickup') return false;
    if (activeTab === 'waiting' && r.status !== 'waiting') return false;
    if (activeTab === 'fulfilled' && r.status !== 'fulfilled') return false;
    if (activeTab === 'archived' && !['cancelled', 'expired'].includes(r.status)) return false;

    // Search query filter
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
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh' }}>
        <div
          className="bio-card"
          style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 24px', backgroundColor: '#FFFFFF' }}
        >
          <Bookmark size={48} color="var(--forest)" style={{ marginBottom: '16px' }} />
          <h2 style={{ color: 'var(--forest-dark)', marginBottom: '8px' }}>Sign In to View Reservations</h2>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.92rem', marginBottom: '24px' }}>
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
    <div className="container" style={{ padding: '36px 20px 80px', minHeight: '80vh' }}>
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
          {toastMessage.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
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
              backgroundColor: 'var(--soft-sage-light)',
              color: 'var(--forest-dark)',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '3px 10px',
              borderRadius: '12px',
              marginBottom: '6px'
            }}
          >
            <Bookmark size={13} />
            Circulation Hold Services
          </div>
          <h1 style={{ fontSize: '2.1rem', color: 'var(--forest-dark)', margin: '0 0 6px', fontWeight: 800 }}>
            Book Reservations & Waiting Lists
          </h1>
          <p style={{ color: 'var(--muted-text)', margin: 0, fontSize: '0.92rem' }}>
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
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Refresh Queue
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BookOpen size={14} />
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
          className="bio-card"
          style={{
            padding: '18px 20px',
            backgroundColor: '#FFFFFF',
            borderLeft: '4px solid var(--forest)'
          }}
        >
          <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--muted-text)', fontWeight: 700 }}>
            Total Holds Tracked
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
            {reservations.length}
          </div>
        </div>

        <div
          className="bio-card"
          style={{
            padding: '18px 20px',
            backgroundColor: readyCount > 0 ? 'rgba(82, 115, 77, 0.08)' : '#FFFFFF',
            borderLeft: '4px solid var(--botanical)'
          }}
        >
          <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--botanical)', fontWeight: 700 }}>
            Ready for Pickup
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--botanical)', marginTop: '4px' }}>
            {readyCount}
          </div>
        </div>

        <div
          className="bio-card"
          style={{
            padding: '18px 20px',
            backgroundColor: '#FFFFFF',
            borderLeft: '4px solid #D97706'
          }}
        >
          <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: '#D97706', fontWeight: 700 }}>
            In Waiting Queues
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
            {waitingCount}
          </div>
        </div>

        <div
          className="bio-card"
          style={{
            padding: '18px 20px',
            backgroundColor: '#FFFFFF',
            borderLeft: '4px solid var(--sage)'
          }}
        >
          <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--muted-text)', fontWeight: 700 }}>
            Fulfilled / Claimed
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
            {fulfilledCount}
          </div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div
        className="bio-card"
        style={{
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
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
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            All Holds ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`btn btn-sm ${activeTab === 'ready' ? 'btn-botanical' : 'btn-outline'}`}
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            ● Ready for Pickup ({readyCount})
          </button>
          <button
            onClick={() => setActiveTab('waiting')}
            className={`btn btn-sm ${activeTab === 'waiting' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            Waiting Queue ({waitingCount})
          </button>
          <button
            onClick={() => setActiveTab('fulfilled')}
            className={`btn btn-sm ${activeTab === 'fulfilled' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            Fulfilled ({fulfilledCount})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`btn btn-sm ${activeTab === 'archived' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            Cancelled / Expired ({archivedCount})
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
              color: 'var(--muted-text)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, author, or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.86rem', height: '38px' }}
          />
        </div>
      </div>

      {/* Reservation List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-text)' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid var(--soft-sage-light)',
              borderTopColor: 'var(--botanical)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}
          />
          Syncing reservation queue records...
        </div>
      ) : filteredReservations.length === 0 ? (
        <div
          className="bio-card"
          style={{
            padding: '50px 24px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--soft-sage-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--forest)'
            }}
          >
            <Bookmark size={26} />
          </div>
          <h3 style={{ color: 'var(--forest-dark)', marginBottom: '8px' }}>
            No Reservations Found
          </h3>
          <p style={{ color: 'var(--muted-text)', maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
            {searchQuery
              ? `No holds matching "${searchQuery}". Try a different keyword.`
              : activeTab === 'ready'
              ? 'You have no books currently waiting for front-desk pickup.'
              : activeTab === 'waiting'
              ? 'You are not in any waiting queues at the moment.'
              : 'You have not reserved or joined a waiting list for any library books yet.'}
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.88rem' }}
          >
            Browse Library Catalog →
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
                className="bio-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: isReady ? '1.5px solid var(--botanical)' : '1px solid var(--subtle-border)',
                  boxShadow: isReady ? '0 6px 20px rgba(82, 115, 77, 0.12)' : 'var(--shadow-sm)',
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
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--warm-beige)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  onClick={() => onSelectBook && onSelectBook(res.book_id)}
                >
                  <img
                    src={res.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'}
                    alt={res.book_title}
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
                          backgroundColor: 'rgba(82, 115, 77, 0.14)',
                          color: 'var(--botanical)',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <CheckCircle2 size={13} />
                        READY FOR PICKUP
                      </span>
                    )}

                    {isWaiting && (
                      <span
                        style={{
                          backgroundColor: 'rgba(217, 119, 6, 0.12)',
                          color: '#B45309',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Clock size={13} />
                        IN QUEUE (POSITION #{res.queue_position})
                      </span>
                    )}

                    {isFulfilled && (
                      <span
                        style={{
                          backgroundColor: 'rgba(52, 78, 65, 0.1)',
                          color: 'var(--forest)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <CheckCircle2 size={13} />
                        COMPLETED / CHECKED OUT
                      </span>
                    )}

                    {isCancelled && (
                      <span
                        style={{
                          backgroundColor: 'rgba(100, 116, 139, 0.12)',
                          color: '#475569',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '12px'
                        }}
                      >
                        CANCELLED
                      </span>
                    )}

                    {isExpired && (
                      <span
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          color: '#DC2626',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '12px'
                        }}
                      >
                        EXPIRED
                      </span>
                    )}

                    {/* Shelf Location if available */}
                    {res.shelf_location && (
                      <span
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--muted-text)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <MapPin size={12} />
                        Shelf: {res.shelf_location}
                      </span>
                    )}
                  </div>

                  {/* Title & Author */}
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--forest-dark)',
                      margin: '0 0 4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectBook && onSelectBook(res.book_id)}
                  >
                    {res.book_title}
                  </h3>
                  <p style={{ margin: '0 0 8px', fontSize: '0.88rem', color: 'var(--muted-text)' }}>
                    by <strong style={{ color: 'var(--charcoal)' }}>{res.book_author}</strong>
                  </p>

                  {/* Extra metadata */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem', color: 'var(--sage)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      Reserved: {new Date(res.reservation_date).toLocaleDateString()}
                    </span>

                    {/* Pickup Deadline Notice */}
                    {isReady && res.pickup_deadline && (
                      <span style={{ color: 'var(--botanical)', fontWeight: 700 }}>
                        ⏳ Claim Deadline: {new Date(res.pickup_deadline).toLocaleString()} (Front Desk)
                      </span>
                    )}

                    {/* Librarian viewing info */}
                    {user.role !== 'student' && res.student_name && (
                      <span style={{ color: 'var(--forest-dark)', fontWeight: 600 }}>
                        Member: {res.student_name} ({res.membership_id || res.student_email})
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
                      className="btn btn-botanical btn-sm"
                      style={{
                        width: '100%',
                        padding: '9px 14px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={15} />
                      {isLoading ? 'Processing...' : 'Claim & Check Out'}
                    </button>
                  )}

                  {/* Librarian: Mark ready for pickup if waiting and available */}
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
                        color: '#C5221F',
                        borderColor: 'rgba(197, 34, 31, 0.3)'
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
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

