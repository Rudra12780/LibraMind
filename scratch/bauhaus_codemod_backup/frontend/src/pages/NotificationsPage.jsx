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
        return <Clock size={18} color="var(--editorial-accent)" strokeWidth={2.4} />;
      case 'reservation_ready':
        return <BookOpen size={18} color="var(--editorial-green)" strokeWidth={2.4} />;
      case 'seat_confirmation':
        return <Calendar size={18} color="var(--editorial-text)" strokeWidth={2.4} />;
      case 'warning':
        return <AlertCircle size={18} color="var(--editorial-accent)" strokeWidth={2.4} />;
      default:
        return <Bell size={18} color="var(--editorial-text)" strokeWidth={2.4} />;
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
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                backgroundColor: 'var(--editorial-border)',
                color: 'var(--editorial-text)',
                border: '1px solid var(--editorial-border)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.78rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px'
              }}
            >
              <Bell size={15} strokeWidth={2.4} /> Notification Center
            </div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '4px 0 6px' }}>
              Your Activity & Notices
            </h1>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, margin: 0, fontSize: '0.94rem', fontWeight: 500 }}>
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
                <Check size={14} strokeWidth={2.4} />
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
            { id: 'announcement', label: 'Notices' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              style={{
                backgroundColor: filterType === f.id ? 'var(--editorial-border)' : '#FFFFFF',
                color: 'var(--editorial-text)',
                border: '1px solid var(--editorial-border)',
                boxShadow: filterType === f.id ? '2px 2px 0px var(--editorial-text)' : '1px 1px 0px var(--editorial-text)',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
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
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <Bell size={40} color="var(--editorial-text)" strokeWidth={2.4} style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '6px' }}>
                No Notifications in This View
              </h3>
              <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>
                You are completely up to date with library announcements and due dates.
              </p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                style={{
                  padding: '20px',
                  backgroundColor: item.is_read ? '#FFFFFF' : 'var(--editorial-bg-subtle)',
                  border: '2.5px solid var(--editorial-text)',
                  boxShadow: item.is_read ? '3px 3px 0px var(--editorial-text)' : '4px 4px 0px var(--editorial-text)',
                  borderLeft: item.is_read ? '2.5px solid var(--editorial-text)' : '6px solid var(--editorial-accent)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: item.link ? 'pointer' : 'default',
                  transition: 'transform 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--editorial-border)',
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
                      <strong style={{ fontSize: '1rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase' }}>
                        {item.title}
                      </strong>
                      {!item.is_read && (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: 'var(--editorial-accent)',
                            border: '1px solid var(--editorial-text)',
                            display: 'inline-block'
                          }}
                        />
                      )}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text)', margin: '0 0 6px', lineHeight: 1.5, fontWeight: 500 }}>
                      {item.message}
                    </p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase' }}>
                      {new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      {item.link && (
                        <span style={{ marginLeft: '12px', color: 'var(--editorial-green)', fontWeight: 800 }}>
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
                    style={{
                      backgroundColor: 'var(--editorial-border)',
                      border: '1px solid var(--editorial-border)',
                      color: 'var(--editorial-text)',
                      cursor: 'pointer',
                      padding: '4px',
                      flexShrink: 0,
                      boxShadow: '1px 1px 0px var(--editorial-text)'
                    }}
                    title="Mark as read"
                  >
                    <Check size={16} strokeWidth={2.4} />
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
