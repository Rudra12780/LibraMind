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
    { id: 'issue', label: 'Check Out', icon: ArrowRightLeft },
    { id: 'return', label: 'Returns & Overdue', icon: RotateCcw },
    { id: 'reservations', label: 'Hold Queues', icon: Bookmark },
    { id: 'inventory', label: 'Title & Copies', icon: Plus },
    { id: 'seats', label: 'Study Pods', icon: Armchair },
    { id: 'adminmsg', label: 'Message Admin', icon: Send },
    { id: 'announcement', label: 'Announcements', icon: Megaphone }
  ];

  const handleTabClick = (tab) => {
    setMobileMenuOpen(false);
    if (onSelectTab) onSelectTab(tab.id);
    if (onNavigate) onNavigate('librarian', { tab: tab.id });
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '2px solid rgba(82, 115, 77, 0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(52, 78, 65, 0.08)',
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
            if (onSelectTab) onSelectTab('issue');
            if (onNavigate) onNavigate('librarian', { tab: 'issue' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title="Librarian Circulation Desk"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--botanical, #52734D)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(82, 115, 77, 0.28)',
              flexShrink: 0
            }}
          >
            <Layers size={22} color="#FAF8F1" />
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
                  backgroundColor: 'var(--soft-sage-light, #E8EDE6)',
                  color: 'var(--forest-dark)',
                  border: '1px solid rgba(82, 115, 77, 0.3)',
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
                <Layers size={11} color="var(--botanical)" />
                Librarian Portal
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.70rem', color: 'var(--sage)', letterSpacing: '0.02em' }}>
              Circulation Desk • Staff Management Suite
            </p>
          </div>
        </div>

        {/* Dedicated Librarian Tabs (Desktop Navigation) */}
        {user && (user.role === 'librarian' || user.role === 'admin') && (
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
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    background: active ? 'var(--soft-sage-light)' : 'transparent',
                    border: active ? '1px solid rgba(82, 115, 77, 0.35)' : '1px solid transparent',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.80rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--forest-dark)' : 'var(--muted-text)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
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
                >
                  <tab.icon size={14} color={active ? 'var(--botanical)' : 'currentColor'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Section: Quick Links & Staff Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Quick Cross-Portal Switchers (Desktop) */}
          {user && (user.role === 'librarian' || user.role === 'admin') && (
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate && onNavigate('admin')}
                  className="btn btn-outline btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.78rem',
                    padding: '5px 9px',
                    borderColor: 'rgba(197, 34, 31, 0.35)',
                    backgroundColor: '#FCE8E6',
                    color: '#A51D24',
                    borderRadius: '7px'
                  }}
                  title="Return to Admin Master Portal"
                >
                  <ShieldCheck size={13} color="#C5221F" />
                  <span>Admin Portal</span>
                </button>
              )}

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
                <BookOpen size={13} color="var(--forest)" />
                <span>View Library</span>
              </button>
            </div>
          )}

          {user && (user.role === 'librarian' || user.role === 'admin') && (
            <>
              {/* Notification Center */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  aria-label="Staff notifications"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid var(--subtle-border)',
                    backgroundColor: showNotifs ? 'var(--soft-sage-light)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <Bell size={16} color="var(--forest)" />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--botanical)',
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

              {/* Staff Member Tag */}
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
                    color: user.role === 'admin' ? '#C5221F' : 'var(--botanical)',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  {user.role === 'admin' ? 'Chief Admin' : 'Staff'} • {user.membership_id}
                </span>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                title="Sign Out of Librarian Portal"
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
          {user && (user.role === 'librarian' || user.role === 'admin') && (
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
      {mobileMenuOpen && user && (user.role === 'librarian' || user.role === 'admin') && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid rgba(82, 115, 77, 0.2)',
            padding: '12px 16px 16px',
            boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--botanical)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
            Librarian Desk Operations
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
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
                    fontSize: '0.82rem',
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

          <div style={{ height: '1px', backgroundColor: 'var(--subtle-border)', margin: '6px 0' }} />

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
                  fontSize: '0.80rem',
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
              View Library
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
