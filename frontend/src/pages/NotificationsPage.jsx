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
  Filter
} from 'lucide-react';

export default function NotificationsPage({ onNavigate }) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState('all');

  const filtered = (notifications || []).filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.is_read;
    return n.type === filterType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'due_reminder':
      case 'overdue':
        return <Clock size={18} color="#C5221F" />;
      case 'reservation_ready':
        return <BookOpen size={18} color="var(--forest)" />;
      case 'seat_confirmation':
        return <Calendar size={18} color="var(--botanical)" />;
      case 'warning':
        return <AlertCircle size={18} color="#D97706" />;
      default:
        return <Bell size={18} color="var(--forest)" />;
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

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Bell size={16} /> Notification Center
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--forest-dark)', margin: '4px 0 6px' }}>
              Your Activity & Notices
            </h1>
            <p style={{ color: 'var(--muted-text)', margin: 0, fontSize: '0.94rem' }}>
              Review borrowing receipts, hold pickup alerts, due date countdowns, and desk notices.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={14} />
                Mark all as read ({unreadCount})
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'due_reminder', label: 'Due Reminders' },
            { id: 'reservation_ready', label: 'Pickup Ready' },
            { id: 'announcement', label: 'Announcements' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className="btn btn-sm"
              style={{
                backgroundColor: filterType === f.id ? 'var(--forest)' : '#FFFFFF',
                color: filterType === f.id ? '#FFFFFF' : 'var(--dark-text)',
                border: '1px solid var(--subtle-border)',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List of notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div
              className="bio-card"
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px'
              }}
            >
              <Bell size={40} color="var(--sage)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', marginBottom: '6px' }}>
                No notifications in this view
              </h3>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', margin: 0 }}>
                You are completely up to date with library announcements and due dates.
              </p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className="bio-card"
                style={{
                  padding: '20px',
                  backgroundColor: item.is_read ? '#FFFFFF' : 'rgba(235, 243, 235, 0.65)',
                  borderRadius: '14px',
                  border: item.is_read ? '1px solid var(--subtle-border)' : '1px solid var(--soft-sage)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: item.link ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--subtle-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--forest-dark)' }}>
                        {item.title}
                      </strong>
                      {!item.is_read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--forest)', display: 'inline-block' }} />
                      )}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--dark-text)', margin: '0 0 6px', lineHeight: 1.5 }}>
                      {item.message}
                    </p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                      {new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      {item.link && (
                        <span style={{ marginLeft: '12px', color: 'var(--botanical)', fontWeight: 600 }}>
                          Click to open related page →
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {!item.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(item.id);
                    }}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--forest)',
                      cursor: 'pointer',
                      padding: '4px',
                      flexShrink: 0
                    }}
                    title="Mark as read"
                  >
                    <Check size={18} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
