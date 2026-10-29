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
    { id: 'overview', label: 'Control Center', icon: Shield },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'inventory', label: 'Inventory & Velocity', icon: Database },
    { id: 'messages', label: 'Broadcasts', icon: MessageSquare },
    { id: 'analytics', label: 'Circulation Analytics', icon: BarChart3, action: () => onNavigate && onNavigate('analytics') },
    { id: 'audit', label: 'Audit Trail', icon: Lock }
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
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '2px solid rgba(197, 34, 31, 0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(197, 34, 31, 0.08)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="container"
        style={{
          minHeight: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '8px 16px'
        }}
      >
        {/* Brand Header */}
        <div
          onClick={() => {
            setMobileMenuOpen(false);
            if (onSelectTab) onSelectTab('overview');
            if (onNavigate) onNavigate('admin', { tab: 'overview' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title="Admin Control Center"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#A51D24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(197, 34, 31, 0.3)',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={22} color="#FAF8F1" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--forest-dark)',
                  letterSpacing: '-0.02em'
                }}
              >
                LibraMind
              </span>
              <span
                style={{
                  backgroundColor: '#FCE8E6',
                  color: '#C5221F',
                  border: '1px solid rgba(197, 34, 31, 0.3)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ShieldCheck size={11} color="#C5221F" />
                Admin Portal
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.70rem', color: '#8C1D18', letterSpacing: '0.02em' }}>
              Master Security Zone • System Governance
            </p>
          </div>
        </div>

        {/* Dedicated Admin Tabs (Desktop Navigation) */}
        {user && user.role === 'admin' && (
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              flex: 1,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '0 8px'
            }}
            className="desktop-nav"
          >
            {navTabs.map(tab => {
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    background: active ? '#FCE8E6' : 'transparent',
                    border: active ? '1px solid rgba(197, 34, 31, 0.35)' : '1px solid transparent',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.80rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#A51D24' : 'var(--muted-text)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
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
                >
                  <tab.icon size={14} color={active ? '#C5221F' : 'currentColor'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Section: Quick Links & Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Quick Cross-Portal Switchers (Desktop) */}
          {user && user.role === 'admin' && (
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
              <button
                onClick={() => onNavigate && onNavigate('librarian')}
                className="btn btn-outline btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  padding: '5px 9px',
                  borderColor: 'rgba(82, 115, 77, 0.35)',
                  backgroundColor: 'var(--soft-sage-light)',
                  color: 'var(--forest-dark)',
                  borderRadius: '7px'
                }}
                title="Open Librarian Circulation Desk"
              >
                <Layers size={13} color="var(--botanical)" />
                <span>Librarian Desk</span>
              </button>

              <button
                onClick={handleExitToUserMode}
                className="btn btn-outline btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  padding: '5px 9px',
                  borderColor: 'rgba(52, 78, 65, 0.35)',
                  backgroundColor: 'var(--cream)',
                  color: 'var(--forest-dark)',
                  borderRadius: '7px'
                }}
                title="Exit Admin Portal and use website as a regular student/member"
              >
                <BookOpen size={13} color="var(--forest)" />
                <span>Switch to User Mode</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate('catalog')}
                className="btn btn-outline btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  padding: '5px 9px',
                  borderColor: 'var(--subtle-border)',
                  borderRadius: '7px'
                }}
                title="Browse Public Library & Catalog"
              >
                <span>Browse Catalog</span>
              </button>
            </div>
          )}

          {user && user.role === 'admin' && (
            <>
              {/* Notification Center */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  aria-label="Admin notifications"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid var(--subtle-border)',
                    backgroundColor: showNotifs ? '#FCE8E6' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <Bell size={16} color="#A51D24" />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#C5221F',
                        border: '2px solid #FFFFFF'
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  lineHeight: 1.2
                }}
                className="desktop-nav"
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: '#C5221F',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}
                >
                  Admin • {user.membership_id}
                </span>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                title="Sign Out of Admin Portal"
                aria-label="Sign Out"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid var(--subtle-border)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--muted-text)',
                  transition: 'all 0.15s ease'
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          )}

          {/* Mobile Menu Hamburger Button */}
          {user && user.role === 'admin' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-outline btn-sm mobile-menu-btn"
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                borderColor: 'var(--subtle-border)'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
            padding: '12px 16px 16px',
            boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C5221F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
            Admin Portal Navigation
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
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
                    fontSize: '0.82rem',
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

          <div style={{ height: '1px', backgroundColor: 'var(--subtle-border)', margin: '6px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                fontSize: '0.80rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <BookOpen size={14} color="var(--forest)" />
              Switch to User Mode
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
                fontSize: '0.80rem',
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
          </div>
        </div>
      )}
    </header>
  );
}
