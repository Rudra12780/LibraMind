import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import {
  ShieldCheck,
  Users,
  Database,
  BarChart3,
  Lock,
  Bell,
  LogOut,
  Shield,
  MessageSquare,
  BookOpen,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

export default function AdminNavbar({ activeTab = 'overview', onSelectTab, onNavigate, activePage = 'admin' }) {
  const { user, logout, logoutAdminPortal } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('admin');
  };

  const handleExitToUserMode = () => {
    if (logoutAdminPortal) logoutAdminPortal();
    if (onNavigate) onNavigate('dashboard');
  };

  const navTabs = [
    { id: 'overview', label: 'Control', icon: Shield, title: 'Master Control Center & System Status' },
    { id: 'users', label: 'Users', icon: Users, title: 'User Management & Role Elevation' },
    { id: 'inventory', label: 'Inventory', icon: Database, title: 'Physical Inventory & Book Velocity' },
    { id: 'messages', label: 'Broadcasts', icon: MessageSquare, title: 'Direct Messages & System Broadcasts' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, title: 'Circulation Velocity & Analytics', action: () => onNavigate && onNavigate('analytics') },
    { id: 'audit', label: 'Audit Trail', icon: Lock, title: 'Security Event Logs & Administrative Audit' }
  ];

  const currentTab = activePage === 'analytics' ? 'analytics' : activeTab;

  const handleTabClick = (tab) => {
    setMobileMenuOpen(false);
    if (tab.action) {
      tab.action();
    } else {
      if (onSelectTab) onSelectTab(tab.id);
      if (onNavigate) onNavigate('admin', { tab: tab.id });
    }
  };

  return (
    <header
      className="portal-nav-header"
      style={{
        borderBottom: '1px solid var(--editorial-border)',
        boxShadow: '0 1px 4px rgba(37, 40, 32, 0.04)',
        backgroundColor: 'var(--editorial-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div className="portal-nav-container" style={{ padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Header */}
        <div
          className="portal-brand"
          onClick={() => {
            setMobileMenuOpen(false);
            if (onSelectTab) onSelectTab('overview');
            if (onNavigate) onNavigate('admin', { tab: 'overview' });
          }}
          title="Admin Control Center"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div
            className="portal-brand-logo"
            style={{
              backgroundColor: 'var(--editorial-green)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={19} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="portal-brand-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.40rem', color: 'var(--editorial-text)' }}>LibraMind</span>
              <span
                className="badge"
                style={{
                  backgroundColor: 'var(--editorial-bg-subtle)',
                  color: 'var(--editorial-accent)',
                  border: '1px solid var(--editorial-border)',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  borderRadius: '2px'
                }}
              >
                ADMIN CONSOLE
              </span>
            </div>
            <p className="portal-subtitle" style={{ margin: 0, fontSize: '0.70rem', color: 'var(--editorial-text-muted)', fontWeight: 500, marginTop: '1px' }}>
              Governance • System Analytics &amp; Security
            </p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="portal-nav-links portal-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navTabs.map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                style={{
                  backgroundColor: isActive ? 'var(--editorial-green)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--editorial-text)',
                  border: isActive ? '1px solid var(--editorial-green)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: '0.80rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={tab.title}
              >
                <tab.icon size={14} color={isActive ? '#FFFFFF' : 'var(--editorial-accent)'} strokeWidth={2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Auxiliary Actions + Notifications + Profile */}
        <div className="portal-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Member View Switcher */}
          <button
            onClick={handleExitToUserMode}
            className="portal-desktop-only btn btn-outline btn-sm"
            title="Browse Member Hub in Patron View"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <BookOpen size={13} />
            <span>Member View</span>
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              aria-label="View notifications"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--editorial-border)',
                backgroundColor: showNotifs ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                color: 'var(--editorial-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Bell size={16} />
              {unreadCount > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--editorial-accent)' }} />}
            </button>
            {showNotifs && (
              <NotificationDropdown
                onClose={() => setShowNotifs(false)}
                onNavigate={onNavigate}
              />
            )}
          </div>

          {/* Admin Profile Chip */}
          <div
            className="portal-desktop-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 5px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--editorial-green)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{ color: 'var(--editorial-text)', fontWeight: 700, fontSize: '0.80rem' }}>{user?.name || 'Administrator'}</span>
              <span style={{ color: 'var(--editorial-accent)', fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Administrator</span>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            title="Sign out of admin console"
            aria-label="Sign out"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--editorial-text-muted)'
            }}
          >
            <LogOut size={15} />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="portal-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              backgroundColor: mobileMenuOpen ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--editorial-text)'
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--editorial-bg)',
            borderTop: '1px solid var(--editorial-border)',
            padding: '16px 20px',
            boxShadow: '0 12px 32px rgba(37, 40, 32, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>
            ADMINISTRATIVE CONSOLE
          </div>
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              style={{
                backgroundColor: currentTab === tab.id ? 'var(--editorial-green)' : '#FFFFFF',
                color: currentTab === tab.id ? '#FFFFFF' : 'var(--editorial-text)',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <tab.icon size={15} color={currentTab === tab.id ? '#FFFFFF' : 'var(--editorial-accent)'} />
                <span>{tab.label}</span>
              </div>
              <ArrowRight size={14} color="var(--editorial-border)" />
            </button>
          ))}
          <button
            onClick={handleExitToUserMode}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
          >
            <BookOpen size={14} /> Switch to Member View
          </button>
        </div>
      )}
    </header>
  );
}
