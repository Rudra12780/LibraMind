import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  CheckCircle,
  Clock,
  BookOpen,
  Calendar,
  AlertCircle,
  Check,
  Trash2,
  Filter,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function NotificationsPage({ onNavigate }) {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  const [filterType, setFilterType] = useState('all');
  const [showClearModal, setShowClearModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filtered = (notifications || []).filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.is_read;
    if (filterType === 'due') return n.type === 'due' || n.type === 'due_reminder' || n.type === 'overdue';
    if (filterType === 'pickup') return n.type === 'pickup' || n.type === 'reservation_ready';
    if (filterType === 'announcement') return n.type === 'announcement';
    return n.type === filterType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'due_reminder':
      case 'due':
      case 'overdue':
        return <Clock size={18} color="var(--editorial-accent, #B95D3B)" strokeWidth={2.4} />;
      case 'reservation_ready':
      case 'pickup':
        return <BookOpen size={18} color="var(--editorial-green, #435340)" strokeWidth={2.4} />;
      case 'seat_confirmation':
      case 'seat':
        return <Calendar size={18} color="var(--editorial-text, #242120)" strokeWidth={2.4} />;
      case 'warning':
        return <AlertCircle size={18} color="var(--editorial-accent, #B95D3B)" strokeWidth={2.4} />;
      default:
        return <Bell size={18} color="var(--editorial-text, #242120)" strokeWidth={2.4} />;
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.is_read) {
      markAsRead(item.id);
    }
    if (item.link) {
      const cleanLink = item.link.replace(/^\/+/, '');
      onNavigate(cleanLink);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteNotification(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAllConfirm = async () => {
    try {
      await clearAllNotifications();
      setShowClearModal(false);
    } catch (err) {
      console.error('Failed to clear all:', err);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--editorial-bg, #FAF7F2)', minHeight: '85vh', padding: '24px 0 80px' }}>
      <style>{`
        .notif-container {
          max-width: 880px;
          margin: 0 auto;
          padding: 0 20px;
        }
        @media (max-width: 640px) {
          .notif-container {
            padding: 0 14px;
          }
          .notif-header-title {
            font-size: 1.7rem !important;
          }
          .notif-header-actions {
            width: 100%;
            justify-content: flex-start;
          }
          .notif-filter-scroll {
            padding-bottom: 6px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .notif-filter-scroll::-webkit-scrollbar {
            display: none;
          }
          .notif-card-inner {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .notif-card-actions {
            width: 100%;
            justify-content: flex-end;
            border-top: 1px dashed var(--editorial-border, #DFD6C9);
            padding-top: 10px;
            margin-top: 6px;
          }
        }
      `}</style>

      <div className="notif-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                backgroundColor: 'var(--editorial-bg-subtle, #F3ECE2)',
                color: 'var(--editorial-accent, #B95D3B)',
                border: '1px solid var(--editorial-border, #DFD6C9)',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px'
              }}
            >
              <Bell size={14} strokeWidth={2.4} /> Notification Center
            </div>
            <h1
              className="notif-header-title"
              style={{
                fontSize: '2.2rem',
                color: 'var(--editorial-text, #242120)',
                fontFamily: 'var(--font-serif, "Newsreader", Georgia, serif)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: '2px 0 6px'
              }}
            >
              Your Activity & Notices
            </h1>
            <p style={{ color: 'var(--editorial-text-muted, #6D645D)', margin: 0, fontSize: '0.92rem', fontWeight: 400, maxWidth: '580px', lineHeight: 1.45 }}>
              Review hold pickups, borrowing due dates, pod reservations, and library broadcast notices.
            </p>
          </div>

          <div className="notif-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--editorial-text, #242120)',
                  border: '1px solid var(--editorial-border, #DFD6C9)',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <Check size={14} strokeWidth={2.4} />
                Mark all read ({unreadCount})
              </button>
            )}

            {notifications && notifications.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  color: 'var(--editorial-accent, #B95D3B)',
                  border: '1px solid rgba(185, 93, 59, 0.3)',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Clear all notifications"
              >
                <Trash2 size={14} strokeWidth={2.4} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filters Scrollable on Mobile */}
        <div className="notif-filter-scroll" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'due', label: 'Due Reminders' },
            { id: 'pickup', label: 'Pickup Ready' },
            { id: 'announcement', label: 'Notices' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              style={{
                backgroundColor: filterType === f.id ? 'var(--editorial-green, #435340)' : '#FFFFFF',
                color: filterType === f.id ? '#FFFFFF' : 'var(--editorial-text, #242120)',
                border: filterType === f.id ? '1px solid var(--editorial-green, #435340)' : '1px solid var(--editorial-border, #DFD6C9)',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List of notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '48px 20px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border, #DFD6C9)',
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--editorial-bg-subtle, #F3ECE2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px'
                }}
              >
                <Inbox size={28} color="var(--editorial-text-muted, #6D645D)" strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text, #242120)', fontWeight: 700, margin: '0 0 6px', fontFamily: 'var(--font-serif, "Newsreader", serif)' }}>
                No Notifications Here
              </h3>
              <p style={{ color: 'var(--editorial-text-muted, #6D645D)', fontSize: '0.88rem', margin: 0, fontWeight: 400 }}>
                You are completely up to date. New loan return alerts, seat reservations, and desk notes will appear here.
              </p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                style={{
                  padding: '16px 18px',
                  backgroundColor: item.is_read ? '#FFFFFF' : 'var(--editorial-bg-subtle, #FAF7F2)',
                  border: '1px solid var(--editorial-border, #DFD6C9)',
                  borderLeft: item.is_read ? '3px solid var(--editorial-border, #DFD6C9)' : '4px solid var(--editorial-accent, #B95D3B)',
                  borderRadius: '10px',
                  boxShadow: item.is_read ? '0 1px 3px rgba(0,0,0,0.03)' : '0 2px 8px rgba(185, 93, 59, 0.08)',
                  cursor: item.link ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  opacity: deletingId === item.id ? 0.4 : 1
                }}
              >
                <div className="notif-card-inner" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--editorial-border, #DFD6C9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                      }}
                    >
                      {getIcon(item.type)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <strong
                          style={{
                            fontSize: '0.94rem',
                            color: 'var(--editorial-text, #242120)',
                            fontWeight: 700,
                            wordBreak: 'break-word'
                          }}
                        >
                          {item.title}
                        </strong>
                        {!item.is_read && (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '1px 6px',
                              backgroundColor: 'var(--editorial-accent, #B95D3B)',
                              color: '#FFFFFF',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase'
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>

                      <p
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--editorial-text, #242120)',
                          margin: '0 0 8px',
                          lineHeight: 1.5,
                          fontWeight: 400,
                          wordBreak: 'break-word'
                        }}
                      >
                        {item.message}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.76rem', color: 'var(--editorial-text-muted, #6D645D)' }}>
                        <span>
                          {item.created_at ? new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                        </span>
                        {item.link && (
                          <span
                            style={{
                              color: 'var(--editorial-green, #435340)',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            Open Details <ArrowRight size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column / Tray */}
                  <div
                    className="notif-card-actions"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexShrink: 0
                    }}
                  >
                    {!item.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--editorial-border, #DFD6C9)',
                          color: 'var(--editorial-green, #435340)',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          minHeight: '36px',
                          minWidth: '36px',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        title="Mark as read"
                        aria-label="Mark notification as read"
                      >
                        <Check size={15} strokeWidth={2.4} />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(185, 93, 59, 0.25)',
                        color: 'var(--editorial-accent, #B95D3B)',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '36px',
                        minWidth: '36px',
                        transition: 'all 0.15s ease'
                      }}
                      title="Delete notification"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={15} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clear All */}
      {showClearModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(36, 33, 32, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowClearModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid var(--editorial-border, #DFD6C9)',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--editorial-accent, #B95D3B)' }}>
              <Trash2 size={22} strokeWidth={2.4} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--editorial-text, #242120)' }}>
                Clear All Notifications?
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--editorial-text-muted, #6D645D)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to remove all {notifications.length} notifications from your activity ledger? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowClearModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border, #DFD6C9)',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  color: 'var(--editorial-text, #242120)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllConfirm}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--editorial-accent, #B95D3B)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
