import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Bookmark,
  Heart,
  Search,
  CheckCircle,
  Bell,
  Clock,
  Settings,
  X,
  CreditCard
} from 'lucide-react';

export default function StudentDashboard({ onNavigate, onViewBookDetails }) {
  const { user, reloadProfile } = useAuth();
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit interests modal
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [interestsText, setInterestsText] = useState(user?.interests || '');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [loansData, resData, recData, wishData] = await Promise.all([
        api.getLoans(),
        api.getReservations(),
        api.getRecommendations(),
        api.getWishlist()
      ]);
      setLoans(loansData || []);
      setReservations(resData || []);
      setRecommendations(recData.recommendations || []);
      setWishlist(wishData || []);
    } catch (err) {
      console.error('Failed to load student dashboard', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRenewLoan = async (loanId) => {
    try {
      const res = await api.renewLoan(loanId);
      showToast(res.message || 'Loan renewed successfully!');
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleCancelReservation = async (resId) => {
    try {
      await api.cancelReservation(resId);
      showToast('Reservation cancelled.');
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleSaveInterests = async (e) => {
    e.preventDefault();
    try {
      await api.updateInterests(interestsText);
      await reloadProfile();
      setShowInterestsModal(false);
      showToast('Reading interests updated! Recommendations refreshed.');
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'overdue');
  const pastLoans = loans.filter(l => l.status === 'returned');
  const activeReservations = reservations.filter(r => r.status === 'waiting' || r.status === 'ready_for_pickup');

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
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
            fontSize: '0.9rem'
          }}
        >
          {toastMessage.isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Student Welcome Header */}
      <div
        className="bio-card"
        style={{
          padding: '30px',
          backgroundColor: 'var(--forest)',
          color: '#FFFFFF',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--soft-sage)', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>Verified Student Account</span> • <span>ID: {user?.membership_id || 'STU-1001'}</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginBottom: '8px' }}>
            Welcome back, {user?.name || 'Student'}
          </h1>
          <p style={{ color: 'var(--soft-sage)', fontSize: '0.94rem', margin: 0, maxWidth: '540px' }}>
            Track your borrowed physical copies, check due date countdowns, manage reservation holds, and view personalized AI recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('catalog')}
            className="btn btn-secondary"
            style={{ fontSize: '0.88rem' }}
          >
            <Search size={16} /> Search Books
          </button>
          <button
            onClick={() => {
              setInterestsText(user?.interests || '');
              setShowInterestsModal(true);
            }}
            className="btn btn-outline"
            style={{ borderColor: 'var(--soft-sage)', color: '#FFFFFF', fontSize: '0.88rem' }}
          >
            <Settings size={16} /> Edit AI Interests
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '48px'
        }}
      >
        {/* Section 1: Active Loans */}
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} color="var(--botanical)" />
              Currently Borrowed ({activeLoans.length} of 5)
            </h3>
          </div>

          {activeLoans.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--muted-text)', fontSize: '0.9rem' }}>
              <p>You have no books currently on loan.</p>
              <button
                onClick={() => onNavigate('catalog')}
                className="btn btn-outline btn-sm"
                style={{ marginTop: '12px' }}
              >
                Browse Books to Borrow
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeLoans.map(loan => {
                const dueDate = new Date(loan.due_date);
                const isOverdue = loan.status === 'overdue' || new Date() > dueDate;
                const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={loan.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isOverdue ? 'var(--status-danger-bg)' : 'var(--cream)',
                      border: `1px solid ${isOverdue ? 'rgba(197,34,31,0.2)' : 'var(--subtle-border)'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4
                        style={{
                          fontSize: '1rem',
                          color: 'var(--forest-dark)',
                          margin: 0,
                          cursor: 'pointer'
                        }}
                        onClick={() => onViewBookDetails(loan.book_id)}
                      >
                        {loan.book_title}
                      </h4>
                      {isOverdue ? (
                        <span className="badge badge-danger">
                          ● OVERDUE (${loan.fine_amount ? loan.fine_amount.toFixed(2) : '1.00'})
                        </span>
                      ) : (
                        <span className="badge badge-available">
                          Due in {daysLeft} days
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)', marginBottom: '10px' }}>
                      Copy Barcode: <strong style={{ color: 'var(--dark-text)', fontFamily: 'monospace' }}>{loan.copy_code}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--muted-text)' }}>
                        Due: {dueDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>

                      <button
                        onClick={() => handleRenewLoan(loan.id)}
                        disabled={loan.renewal_count >= 2}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                      >
                        <RotateCw size={13} /> Renew Loan ({2 - loan.renewal_count} left)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Active Holds & Queue Positions */}
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bookmark size={20} color="var(--forest)" />
              Reservation Holds & Queues ({activeReservations.length})
            </h3>
          </div>

          {activeReservations.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--muted-text)', fontSize: '0.9rem' }}>
              <p>You have no active book holds or waiting list entries.</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--sage)' }}>
                When a desired book has 0 copies, click "Reserve Hold" to join the line.
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeReservations.map(res => (
                <div
                  key={res.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: res.status === 'ready_for_pickup' ? 'var(--status-available-bg)' : 'var(--warm-beige-light)',
                    border: '1px solid var(--subtle-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4
                      style={{ fontSize: '1rem', color: 'var(--forest-dark)', margin: 0, cursor: 'pointer' }}
                      onClick={() => onViewBookDetails(res.book_id)}
                    >
                      {res.book_title}
                    </h4>
                    {res.status === 'ready_for_pickup' ? (
                      <span className="badge badge-available">
                        ● Ready for Pickup!
                      </span>
                    ) : (
                      <span className="badge badge-reserved">
                        Position #{res.queue_position}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--muted-text)', marginBottom: '10px', lineHeight: 1.4 }}>
                    {res.status === 'ready_for_pickup'
                      ? `Your book is held at the front circulation desk. Please pick it up before ${new Date(res.pickup_deadline).toLocaleDateString()}.`
                      : `You are in line position #${res.queue_position}. You will receive a notification the moment a student returns a copy.`}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.78rem', padding: '4px 8px', color: '#C5221F', borderColor: 'rgba(197,34,31,0.3)' }}
                    >
                      Cancel Hold
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Personalized AI Recommendations (Phase 3 #15) */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--botanical)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Sparkles size={16} /> Content-Based Recommendation Engine
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--forest-dark)', marginTop: '4px' }}>
              Recommended for Aarav
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
              Synthesized from your interests: <em>"{user?.interests || 'AI & Computer Science'}"</em> and your reading history.
            </p>
          </div>

          <button
            onClick={() => {
              setInterestsText(user?.interests || '');
              setShowInterestsModal(true);
            }}
            className="btn btn-outline btn-sm"
          >
            Refine Topics
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          {recommendations.map(book => (
            <div key={book.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  padding: '6px 10px',
                  backgroundColor: 'var(--soft-sage)',
                  color: 'var(--forest-dark)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  border: '1px solid var(--subtle-border)',
                  borderBottom: 'none'
                }}
              >
                ★ {book.recommendationReason}
              </div>
              <div style={{ flex: 1 }}>
                <BookCard
                  book={book}
                  onViewDetails={onViewBookDetails}
                  onReserve={() => onNavigate('catalog')}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Reading History & Saved Wishlist */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}
      >
        {/* Wishlist */}
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Heart size={20} color="#C5221F" />
            Your Wishlist ({wishlist.length})
          </h3>

          {wishlist.length === 0 ? (
            <p style={{ color: 'var(--muted-text)', fontSize: '0.88rem' }}>
              No books saved yet. Click the heart icon on any book card to add it to your wishlist.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wishlist.map(book => (
                <div
                  key={book.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--cream)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onViewBookDetails(book.id)}
                >
                  <img
                    src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                    alt={book.title}
                    style={{ width: '40px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--forest-dark)' }}>
                      {book.title}
                    </h5>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                      {book.author} • {book.shelf}
                    </span>
                  </div>
                  {book.available_copies > 0 ? (
                    <span className="badge badge-available">Available</span>
                  ) : (
                    <span className="badge badge-borrowed">On loan</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Borrowing History */}
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={20} color="var(--sage)" />
            Past Borrowing Records ({pastLoans.length})
          </h3>

          {pastLoans.length === 0 ? (
            <p style={{ color: 'var(--muted-text)', fontSize: '0.88rem' }}>
              Your past returned books will be cataloged here to track your scholarly reading progress.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pastLoans.map(p => (
                <div
                  key={p.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--cream)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--forest-dark)' }}>
                      {p.book_title}
                    </strong>
                    <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)' }}>
                      Returned on {new Date(p.return_date).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="badge badge-available">Returned</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Reading Interests Modal */}
      {showInterestsModal && (
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
          onClick={() => setShowInterestsModal(false)}
        >
          <div
            className="bio-card"
            style={{
              width: '480px',
              backgroundColor: '#FFFFFF',
              padding: '28px',
              borderRadius: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--forest-dark)' }}>
                Personalize AI Recommendations
              </h3>
              <button
                onClick={() => setShowInterestsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '18px' }}>
              Enter topics, technologies, or disciplines you are studying (e.g. "Artificial Intelligence, Python, Distributed Systems, Biophilic Architecture").
            </p>

            <form onSubmit={handleSaveInterests}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows={4}
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  placeholder="e.g. Machine Learning, Python, Web Development, History..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowInterestsModal(false)}
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
                  Save & Update AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
