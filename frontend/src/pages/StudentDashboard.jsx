import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
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
  CreditCard,
  BookMarked,
  Armchair,
  Zap,
  Monitor
} from 'lucide-react';

export default function StudentDashboard({
  onNavigate,
  onViewBookDetails,
  initialTab = 'all',
  onTabChange,
  onUpdateStats
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

  useEffect(() => {
    if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  // Edit interests modal
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [interestsText, setInterestsText] = useState(user?.interests || '');

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [loansData, resData, recData, wishData, seatData] = await Promise.all([
        api.getLoans(),
        api.getReservations(),
        api.getRecommendations(),
        api.getWishlist(),
        api.getMySeatBookings().catch(() => [])
      ]);
      setLoans(loansData || []);
      setReservations(resData || []);
      setRecommendations(recData.recommendations || []);
      setWishlist(wishData || []);
      setSeatBookings(seatData || []);

      if (onUpdateStats) {
        const activeL = (loansData || []).filter(l => l.status === 'active' || l.status === 'overdue');
        const activeR = (resData || []).filter(r => r.status === 'waiting' || r.status === 'ready_for_pickup');
        const activeS = (seatData || []).filter(b => b.status === 'active');
        onUpdateStats({
          loanCount: activeL.length,
          holdCount: activeR.length,
          seatCount: activeS.length,
          wishlistCount: (wishData || []).length
        });
      }
    } catch (err) {
      console.error('Failed to load student dashboard', err);
    } finally {
      setLoading(false);
    }
  }, [user, onUpdateStats]);

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

  const handleCancelSeatBooking = async (bookingId) => {
    try {
      await api.cancelSeatReservation(bookingId);
      showToast('Study seat reservation cancelled successfully.');
      fetchData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleRemoveWishlist = async (bookId, e) => {
    if (e) e.stopPropagation();
    try {
      await api.removeFromWishlist(bookId);
      showToast('Removed from your wishlist.');
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

  if (!user) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 20px',
          backgroundColor: 'var(--cream)'
        }}
      >
        <div
          className="bio-card"
          style={{
            width: '460px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            padding: '38px',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'var(--soft-sage)',
              color: 'var(--forest-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <BookOpen size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-dark)', margin: '4px 0 10px' }}>
            Student Hub Authentication
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.5, marginBottom: '24px' }}>
            Please sign in with your student library account to view your active book loans, holds, wishlist, and reserved study pods.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }}
          >
            Sign In to Student Hub
          </button>
        </div>
      </div>
    );
  }

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
            <span>{user?.role === 'admin' ? 'Administrator (User Mode)' : user?.role === 'librarian' ? 'Staff Librarian (User Mode)' : 'Verified Member Account'}</span> • <span>ID: {user?.membership_id || 'STU-1001'}</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginBottom: '8px' }}>
            Welcome back, {user?.name || 'Student'}
          </h1>
          <p style={{ color: 'var(--soft-sage)', fontSize: '0.94rem', margin: 0, maxWidth: '540px' }}>
            Track your borrowed physical copies, check due date countdowns, manage reservation holds, and view personalized recommendations.
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
            <Settings size={16} /> Edit Reading Interests
          </button>
        </div>
      </div>

      {/* Member Portal Section Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '28px',
          scrollbarWidth: 'none'
        }}
      >
        {[
          { id: 'all', label: 'All Personal Activity' },
          { id: 'loans', label: `My Borrowed Copies (${activeLoans.length})` },
          { id: 'holds', label: `Hold Queues (${activeReservations.length})` },
          { id: 'seats', label: `Study Pods (${seatBookings.filter(b => b.status === 'active').length})` },
          { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})` },
          { id: 'recommendations', label: `AI Recommended (${recommendations.length})` }
        ].map(pill => {
          const isActive = currentTab === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => handleTabChange(pill.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '24px',
                border: isActive ? '1px solid var(--forest)' : '1px solid var(--subtle-border)',
                backgroundColor: isActive ? 'var(--forest)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--forest-dark)',
                fontSize: '0.84rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 2px 8px rgba(52, 78, 65, 0.22)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Section: Direct Messages & Notices from Administration */}
      {currentTab === 'all' && (
      <div
        className="bio-card"
        style={{
          padding: '24px',
          backgroundColor: '#FFFFFF',
          marginBottom: '32px',
          borderLeft: '4px solid var(--forest)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--soft-sage-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--forest)'
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0 }}>
                Direct Messages & Announcements from Administration
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                Official notices, warnings, and library alerts delivered to your screen.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', backgroundColor: 'var(--cream)', padding: '3px', borderRadius: '8px', border: '1px solid var(--subtle-border)' }}>
              <button
                onClick={() => setNotifTab('official')}
                style={{
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: notifTab === 'official' ? 700 : 500,
                  backgroundColor: notifTab === 'official' ? 'var(--forest)' : 'transparent',
                  color: notifTab === 'official' ? '#FFFFFF' : 'var(--forest-dark)',
                  cursor: 'pointer'
                }}
              >
                Admin & Welcome
              </button>
              <button
                onClick={() => setNotifTab('all')}
                style={{
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: notifTab === 'all' ? 700 : 500,
                  backgroundColor: notifTab === 'all' ? 'var(--forest)' : 'transparent',
                  color: notifTab === 'all' ? '#FFFFFF' : 'var(--forest-dark)',
                  cursor: 'pointer'
                }}
              >
                All Activity
              </button>
            </div>

            {notifications && notifications.filter(n => !n.is_read).length > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.78rem' }}
              >
                Mark all as read
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
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted-text)', fontSize: '0.88rem' }}>
                {notifTab === 'official'
                  ? 'No official administrative notices or welcome messages at this time.'
                  : 'No library activity notifications recorded yet.'}
              </div>
            );
          }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayList.slice(0, 5).map(n => (
              <div
                key={n.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  backgroundColor: n.is_read ? 'var(--cream)' : 'var(--soft-sage-light)',
                  border: n.is_read ? '1px solid var(--subtle-border)' : '1px solid var(--botanical)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>
                    {n.type === 'warning' ? '⚠️' : n.type === 'due_reminder' ? '⏰' : '📢'}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.94rem', color: 'var(--forest-dark)' }}>
                        {n.title}
                      </strong>
                      {!n.is_read && (
                        <span style={{
                          backgroundColor: 'var(--botanical)',
                          color: '#FFFFFF',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '8px',
                          textTransform: 'uppercase'
                        }}>
                          New
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--dark-text)', lineHeight: 1.45 }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginTop: '4px', display: 'block' }}>
                      {new Date(n.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '0.76rem', padding: '4px 8px', backgroundColor: '#FFFFFF', flexShrink: 0 }}
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      })()}
      </div>
      )}

      {/* Dashboard Grid (Loans & Holds) */}
      {(currentTab === 'all' || currentTab === 'loans' || currentTab === 'holds') && (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: currentTab === 'all' ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
          gap: '30px',
          marginBottom: '48px'
        }}
      >
        {/* Section 1: Active Loans */}
        {(currentTab === 'all' || currentTab === 'loans') && (
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
        )}

        {/* Section 2: Active Holds & Queue Positions */}
        {(currentTab === 'all' || currentTab === 'holds') && (
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
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '64px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: 'var(--warm-beige)',
                        border: '1px solid var(--subtle-border)',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                      }}
                      onClick={() => onViewBookDetails(res.book_id)}
                    >
                      <img
                        src={res.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                        alt={res.book_title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
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
                      <span style={{ fontSize: '0.72rem', color: res.cover_image?.startsWith('/uploads') ? 'var(--botanical)' : '#B45309', fontWeight: 600, display: 'inline-block', marginBottom: '6px' }}>
                        {res.cover_image?.startsWith('/uploads') ? '● Original Physical Photo Verified' : '● Standard Photo'}
                      </span>

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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
      )}

      {/* Section 2.5: Study Seat Reservations */}
      {(currentTab === 'all' || currentTab === 'seats') && (
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--botanical)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Armchair size={16} /> Biophilic Study Spaces
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--forest-dark)', marginTop: '4px' }}>
              My Reserved Study Seats & Pods
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
              Your confirmed workspace slots in the Silent Sanctuary, Garden Windows, and Research Nooks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('seats')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Armchair size={16} /> Reserve Another Seat
          </button>
        </div>

        {seatBookings.filter(b => b.status === 'active').length === 0 ? (
          <div className="card" style={{ padding: '32px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
            <Armchair size={40} color="var(--sage)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ color: 'var(--forest-dark)', marginBottom: '8px' }}>No Active Study Seat Reservations</h4>
            <p style={{ color: 'var(--muted-text)', fontSize: '0.90rem', maxWidth: '480px', margin: '0 auto 16px' }}>
              Need a quiet desk with power outlets, monitors, and natural light? Reserve a seat in advance.
            </p>
            <button
              onClick={() => onNavigate('seats')}
              className="btn btn-outline btn-sm"
            >
              Explore Study Seat Map
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {seatBookings.filter(b => b.status === 'active').map(booking => (
              <div
                key={booking.id}
                className="card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--subtle-border)',
                  borderLeft: '4px solid var(--botanical)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--botanical)', textTransform: 'uppercase' }}>
                        {booking.floor} • {booking.section}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: '2px 0 0' }}>
                        Seat {booking.seat_number}
                      </h3>
                    </div>
                    <span className="badge badge-available" style={{ fontSize: '0.75rem' }}>
                      Active Slot
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem', color: 'var(--dark-text)', margin: '10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="var(--sage)" />
                      <strong>Date:</strong> {booking.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={15} color="var(--sage)" />
                      <strong>Time Slot:</strong> {booking.time_slot}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {booking.has_power === 1 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--forest)', backgroundColor: 'var(--soft-sage)', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Zap size={12} /> Power Socket
                      </span>
                    )}
                    {booking.has_monitor === 1 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--forest)', backgroundColor: 'var(--soft-sage)', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Monitor size={12} /> External Monitor
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--subtle-border)' }}>
                  <button
                    onClick={() => handleCancelSeatBooking(booking.id)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.80rem', padding: '5px 12px', color: '#C5221F', borderColor: 'rgba(197,34,31,0.3)' }}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Section 3: Curated Book Recommendations */}
      {(currentTab === 'all' || currentTab === 'recommendations') && (
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--botanical)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <BookMarked size={16} /> Curated Recommendations
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--forest-dark)', marginTop: '4px' }}>
              Recommended for {user?.name || 'You'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
              Curated from your interests: <em>"{user?.interests || 'Fiction & Literature'}"</em> and your reading history.
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
      )}

      {/* Section 4: Reading History & Saved Wishlist */}
      {(currentTab === 'all' || currentTab === 'wishlist' || currentTab === 'loans') && (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: currentTab === 'all' ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
          gap: '30px'
        }}
      >
        {/* Wishlist */}
        {(currentTab === 'all' || currentTab === 'wishlist') && (
        <div id="wishlist-section" className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', scrollMarginTop: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Heart size={20} color="#C5221F" fill="#C5221F" />
              Your Saved Wishlist ({wishlist.length})
            </h3>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem' }}
            >
              Explore Catalog
            </button>
          </div>

          {wishlist.length === 0 ? (
            <div style={{ padding: '24px 12px', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.88rem', margin: 0 }}>
                No books saved yet. Click the heart icon on any book card to add it to your wishlist.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wishlist.map(book => (
                <div
                  key={book.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--cream)',
                    border: '1px solid var(--subtle-border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => onViewBookDetails(book.id)}
                >
                  <img
                    src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                    alt={book.title}
                    style={{ width: '42px', height: '58px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--subtle-border)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--forest-dark)', fontWeight: 600 }}>
                      {book.title}
                    </h5>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                      {book.author} • {book.floor} ({book.shelf})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {book.available_copies > 0 ? (
                      <span className="badge badge-available">● Available</span>
                    ) : (
                      <span className="badge badge-borrowed">● Waitlist</span>
                    )}
                    <button
                      onClick={(e) => handleRemoveWishlist(book.id, e)}
                      title="Remove from wishlist"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--muted-text)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Borrowing History */}
        {(currentTab === 'all' || currentTab === 'loans') && (
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
        )}
      </div>
      )}

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
                Personalize Reading Interests
              </h3>
              <button
                onClick={() => setShowInterestsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '18px' }}>
              Enter genres, authors, or disciplines you enjoy (e.g. "Story Books, Novels & Fiction, Emotional Fiction, Philosophy, Classics").
            </p>

            <form onSubmit={handleSaveInterests}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows={4}
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  placeholder="e.g. Story Books, Classic Literature, History, Novels..."
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
                  Save Interests
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
