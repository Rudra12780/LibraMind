import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import {
  Layers,
  RotateCcw,
  ArrowRightLeft,
  Bookmark,
  Plus,
  Armchair,
  Send,
  Bell,
  LogOut,
  Megaphone,
  BookOpen,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function LibrarianNavbar({ activeTab = 'issue', onSelectTab, onNavigate }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('librarian');
  };

  const navTabs = [
    { id: 'issue', label: 'Check Out', icon: ArrowRightLeft, title: 'Book Circulation & Check Out Desk' },
    { id: 'return', label: 'Returns', icon: RotateCcw, title: 'Book Returns & Overdue Tracker' },
    { id: 'reservations', label: 'Hold Queues', icon: Bookmark, title: 'Student Book Reservations & Hold Queues' },
    { id: 'inventory', label: 'Inventory', icon: Plus, title: 'Catalog Titles & Physical Copies' },
    { id: 'seats', label: 'Study Pods', icon: Armchair, title: 'Study Seat & Pod Real-Time Status' },
    { id: 'adminmsg', label: 'Msg Admin', icon: Send, title: 'Direct Staff Dispatch to System Admin' },
    { id: 'announcement', label: 'Notices', icon: Megaphone, title: 'Broadcast Notices to Library Patrons' }
  ];

  const handleTabClick = (tab) => {
    setMobileMenuOpen(false);
    if (onSelectTab) onSelectTab(tab.id);
    if (onNavigate) onNavigate('librarian', { tab: tab.id });
  };

  return (
    <header
      className="portal-nav-header"
      style={{
        borderBottom: '2px solid rgba(82, 115, 77, 0.25)',
        boxShadow: '0 2px 10px rgba(52, 78, 65, 0.08)'
      }}
    >
      <div className="portal-nav-container">
        {/* Brand Header */}
        <div
          className="portal-brand"
          onClick={() => {
            setMobileMenuOpen(false);
            if (onSelectTab) onSelectTab('issue');
            if (onNavigate) onNavigate('librarian', { tab: 'issue' });
          }}
          title="Librarian Circulation Desk"
        >
          <div
            className="portal-brand-logo"
            style={{
              backgroundColor: 'var(--botanical, #52734D)',
              boxShadow: '0 4px 12px rgba(82, 115, 77, 0.28)'
            }}
          >
            <Layers size={20} color="#FAF8F1" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="portal-brand-title">LibraMind</span>
              <span
                style={{
                  backgroundColor: 'var(--soft-sage-light, #E8EDE6)',
                  color: 'var(--forest-dark)',
                  border: '1px solid rgba(82, 115, 77, 0.3)',
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
                <Layers size={10} color="var(--botanical)" />
                Librarian Portal
              </span>
            </div>
            <p className="portal-subtitle" style={{ margin: 0, fontSize: '0.66rem', color: 'var(--sage)', letterSpacing: '0.02em', marginTop: '1px' }}>
              Circulation Desk • Staff Management Suite
            </p>
          </div>
        </div>

        {/* Dedicated Librarian Tabs — Single Clean Line (Desktop & Laptop) */}
        {user && (user.role === 'librarian' || user.role === 'admin') && (
          <nav className="portal-desktop-nav portal-nav-tabs">
            {navTabs.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`portal-tab-btn ${active ? 'active' : ''}`}
                  style={{
                    background: active ? 'var(--soft-sage-light, #E8EDE6)' : 'transparent',
                    borderColor: active ? 'rgba(82, 115, 77, 0.35)' : 'transparent',
                    color: active ? 'var(--forest-dark)' : 'var(--muted-text)'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'rgba(82, 115, 77, 0.08)';
                      e.currentTarget.style.color = 'var(--forest-dark)';
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
                    color={active ? 'var(--botanical)' : 'currentColor'}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Section: Quick Links & Staff Profile */}
        <div className="portal-right-actions">
          {user && (user.role === 'librarian' || user.role === 'admin') ? (
            <>
              {/* Quick Cross-Portal Switchers (Desktop) */}
              <div className="portal-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {user.role === 'admin' && (
                  <button
                    onClick={() => onNavigate && onNavigate('admin')}
                    className="portal-action-pill"
                    style={{
                      borderColor: 'rgba(197, 34, 31, 0.35)',
                      backgroundColor: '#FCE8E6',
                      color: '#A51D24'
                    }}
                    title="Return to Admin Master Portal"
                  >
                    <ShieldCheck size={12} color="#C5221F" />
                    <span>Admin Portal</span>
                  </button>
                )}

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
                  <BookOpen size={12} color="var(--forest)" />
                  <span>Library</span>
                </button>
              </div>

              {/* Notification Center */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  aria-label="Staff notifications"
                  className="portal-icon-btn"
                  style={{
                    backgroundColor: showNotifs ? 'var(--soft-sage-light)' : '#FFFFFF'
                  }}
                  title="Notifications"
                >
                  <Bell size={15} color="var(--forest)" />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--botanical)',
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

              {/* Staff Member Tag */}
              <div className="portal-desktop-nav portal-user-tag">
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: user.role === 'admin' ? '#C5221F' : 'var(--botanical)',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  {user.role === 'admin' ? 'Admin' : 'Staff'} • {user.membership_id || 'LIB-5001'}
                </span>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                title="Sign Out of Librarian Portal"
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
      {mobileMenuOpen && user && (user.role === 'librarian' || user.role === 'admin') && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid rgba(82, 115, 77, 0.2)',
            padding: '14px 16px 18px',
            boxShadow: '0 14px 28px rgba(0,0,0,0.09)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--botanical)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Librarian Desk Operations
            </span>
            <span style={{ fontSize: '0.70rem', color: 'var(--sage)', fontWeight: 600 }}>
              {user.name} ({user.membership_id || 'LIB-5001'})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '6px' }}>
            {navTabs.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    background: active ? 'var(--soft-sage-light)' : '#FAFAFA',
                    border: active ? '1px solid rgba(82, 115, 77, 0.35)' : '1px solid var(--subtle-border)',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '0.80rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--forest-dark)' : 'var(--forest-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <tab.icon size={15} color={active ? 'var(--botanical)' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--subtle-border)', margin: '4px 0' }} />

          <div style={{ display: 'flex', gap: '8px' }}>
            {user.role === 'admin' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('admin');
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(197, 34, 31, 0.35)',
                  backgroundColor: '#FCE8E6',
                  color: '#A51D24',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck size={14} color="#C5221F" />
                Admin Portal
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('catalog');
              }}
              style={{
                flex: 1,
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
              <BookOpen size={14} color="var(--forest)" />
              View Library
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
