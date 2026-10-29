import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getNotifications();
      const notifsList = Array.isArray(data) ? data : (data.notifications || []);
      setNotifications(notifsList);
      setUnreadCount(Array.isArray(data) ? notifsList.filter(n => !n.is_read).length : (data.unreadCount || 0));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 25000); // 25s polling to balance timely delivery with low server/disk I/O
      const handleFocus = () => fetchNotifications(); // Instant refresh when user switches tabs back
      window.addEventListener('focus', handleFocus);
      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
