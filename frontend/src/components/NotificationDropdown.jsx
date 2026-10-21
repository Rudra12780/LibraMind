import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, Clock, Bookmark, BookOpen, AlertTriangle, Info } from 'lucide-react';

export default function NotificationDropdown({ onClose, onNavigate }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'borrow':
      case 'return':
        return <BookOpen size={16} color="#52734D" />;
      case 'pickup':
        return <Bookmark size={16} color="#2D6A35" />;
      case 'overdue':
        return <AlertTriangle size={16} color="#C5221F" />;
      case 'seat':
        return <Clock size={16} color="#344E41" />;
      default:
        return <Info size={16} color="#829779" />;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '64px',
        right: '20px',
        width: '380px',
        maxWidth: '92vw',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 12px 36px rgba(38, 53, 43, 0.16)',
        border: '1px solid rgba(52, 78, 65, 0.15)',
        zIndex: 1000,
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease forwards'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(52, 78, 65, 0.1)',
          backgroundColor: 'var(--cream)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="var(--forest)" />
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
            Notifications
          </h4>
          {unreadCount > 0 && (
            <span
              style={{
                backgroundColor: 'var(--botanical)',
                color: '#fff',
                fontSize: '0.72rem',
                padding: '2px 7px',
                borderRadius: '10px',
                fontWeight: 700
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--botanical)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted-text)', fontSize: '0.9rem' }}>
            No notifications yet
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.is_read) markAsRead(n.id);
                if (n.link) {
                  onNavigate(n.link);
                  onClose();
                }
              }}
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(52, 78, 65, 0.06)',
                backgroundColor: n.is_read ? '#FFFFFF' : 'var(--soft-sage-light)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                display: 'flex',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                {getIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--forest-dark)' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>
                    {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted-text)', lineHeight: 1.4 }}>
                  {n.message}
                </p>
              </div>
              {!n.is_read && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--botanical)',
                    alignSelf: 'center',
                    flexShrink: 0
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
