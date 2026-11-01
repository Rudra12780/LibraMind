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
  Layers,
  Search,
  Menu,
  X
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
    { id: 'overview', label: 'Control Center', icon: Shield, title: 'Master Control Center & System Status' },
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
        borderBottom: '2px solid rgba(197, 34, 31, 0.25)',
        boxShadow: '0 2px 12px rgba(197, 34, 31, 0.08)'
      }}
    >
      <div className="portal-nav-container">
        {/* Brand Header */}
        <div
          className="portal-brand"
          onClick={() => {
            setMobileMenuOpen(false);
            if (onSelectTab) onSelectTab('overview');
            if (onNavigate) onNavigate('admin', { tab: 'overview' });
          }}
          title="Admin Control Center"
        >
          <div
            className="portal-brand-logo"
            style={{
              backgroundColor: '#A51D24',
              boxShadow: '0 4px 12px rgba(197, 34, 31, 0.3)'
            }}
          >
            <ShieldCheck size={20} color="#FAF8F1" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="portal-brand-title">LibraMind</span>
              <span
                style={{
                  backgroundColor: '#FCE8E6',
                  color: '#C5221F',
                  border: '1px solid rgba(197, 34, 31, 0.3)',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '5px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <ShieldCheck size={10} color="#C5221F" />
                Admin Portal
              </span>
            </div>
            <p className="portal-subtitle" style={{ margin: 0, fontSize: '0.66rem', color: '#8C1D18', letterSpacing: '0.02em', marginTop: '1px' }}>
              Master Security Zone • System Governance
            </p>
          </div>
        </div>

        {/* Dedicated Admin Tabs — Single Clean Line (Desktop & Laptop) */}
        {user && user.role === 'admin' && (
          <nav className="portal-desktop-nav portal-nav-tabs">
            {navTabs.map(tab => {
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`portal-tab-btn ${active ? 'active' : ''}`}
                  style={{
                    background: active ? '#FCE8E6' : 'transparent',
                    borderColor: active ? 'rgba(197, 34, 31, 0.35)' : 'transparent',
                    color: active ? '#A51D24' : 'var(--muted-text)'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = '#FAF4F4';
                      e.currentTarget.style.color = '#A51D24';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--muted-text)';
                    }
                  }}
                  title={tab.title || tab.label}
                >
                  <tab.icon
                    size={13}
                    color={active ? '#C5221F' : 'currentColor'}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Section: Quick Links & Admin Profile */}
        <div className="portal-right-actions">
          {user && user.role === 'admin' ? (
            <>
              {/* Quick Cross-Portal Switchers (Desktop) */}
              <div className="portal-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button
                  onClick={() => onNavigate && onNavigate('librarian')}
                  className="portal-action-pill"
                  style={{
                    borderColor: 'rgba(82, 115, 77, 0.35)',
                    backgroundColor: 'var(--soft-sage-light)',
                    color: 'var(--forest-dark)'
                  }}
                  title="Open Librarian Circulation Desk"
                >
                  <Layers size={12} color="var(--botanical)" />
                  <span>Desk</span>
                </button>

                <button
                  onClick={handleExitToUserMode}
                  className="portal-action-pill"
                  style={{
                    borderColor: 'rgba(52, 78, 65, 0.28)',
                    backgroundColor: 'var(--cream)',
                    color: 'var(--forest-dark)'
                  }}
                  title="Exit Admin Portal and use website as a regular member"
                >
                  <BookOpen size={12} color="var(--forest)" />
                  <span>User Mode</span>
                </button>

                <button
                  onClick={() => onNavigate && onNavigate('catalog')}
                  className="portal-action-pill"
                  style={{
                    borderColor: 'var(--subtle-border)',
                    backgroundColor: '#FAFAF9',
                    color: 'var(--forest-dark)'
                  }}
                  title="Browse Public Library & Catalog"
                >
                  <Search size={12} color="var(--forest)" />
                  <span>Catalog</span>
                </button>
              </div>

              {/* Notification Center */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  aria-label="Admin notifications"
                  className="portal-icon-btn"
                  style={{
                    backgroundColor: showNotifs ? '#FCE8E6' : '#FFFFFF'
                  }}
                  title="Notifications"
                >
                  <Bell size={15} color="#A51D24" />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#C5221F',
                        border: '1.5px solid #FFFFFF'
                      }}
                    />
                  )}
                </button>

                {showNotifs && (
                  <NotificationDropdown
                    onClose={() => setShowNotifs(false)}
                    onNavigate={onNavigate}
                  />
                )}
              </div>

              {/* Admin Tag */}
              <div className="portal-desktop-nav portal-user-tag">
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: '#C5221F',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}
                >
                  Admin • {user.membership_id || 'ADM-9001'}
                </span>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                title="Sign Out of Admin Portal"
                aria-label="Sign Out"
                className="portal-icon-btn"
                style={{ color: 'var(--muted-text)' }}
              >
                <LogOut size={15} />
              </button>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="portal-icon-btn portal-mobile-btn"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate && onNavigate('catalog')}
              className="portal-action-pill"
              style={{
                borderColor: 'var(--subtle-border)',
                backgroundColor: '#FAFAF9',
                color: 'var(--forest-dark)'
              }}
            >
              <BookOpen size={12} color="var(--forest)" />
              <span>Public Library</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && user && user.role === 'admin' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid rgba(197, 34, 31, 0.2)',
            padding: '14px 16px 18px',
            boxShadow: '0 14px 28px rgba(0,0,0,0.09)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C5221F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Portal Navigation
            </span>
            <span style={{ fontSize: '0.70rem', color: '#8C1D18', fontWeight: 600 }}>
              {user.name} ({user.membership_id || 'ADM-9001'})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '6px' }}>
            {navTabs.map(tab => {
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    background: active ? '#FCE8E6' : '#FAFAFA',
                    border: active ? '1px solid rgba(197, 34, 31, 0.35)' : '1px solid var(--subtle-border)',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '0.80rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#A51D24' : 'var(--forest-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <tab.icon size={15} color={active ? '#C5221F' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--subtle-border)', margin: '4px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleExitToUserMode();
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(52, 78, 65, 0.35)',
                backgroundColor: 'var(--cream)',
                color: 'var(--forest-dark)',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <BookOpen size={14} color="var(--forest)" />
              User Mode
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('librarian');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(82, 115, 77, 0.35)',
                backgroundColor: 'var(--soft-sage-light)',
                color: 'var(--forest-dark)',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Layers size={14} color="var(--botanical)" />
              Librarian Desk
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('catalog');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--subtle-border)',
                backgroundColor: '#FFFFFF',
                color: 'var(--forest-dark)',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Search size={14} color="var(--forest)" />
              Catalog
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
