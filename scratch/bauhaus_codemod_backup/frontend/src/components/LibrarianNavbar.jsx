import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
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
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function LibrarianNavbar({ activeTab = 'issue', onSelectTab, onNavigate }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('librarian');
  };

  const navTabs = [
    { id: 'issue', label: 'Check Out', icon: ArrowRightLeft, title: 'Book Circulation & Check Out Desk' },
    { id: 'return', label: 'Returns & History', icon: RotateCcw, title: 'Book Returns & Date-Filtered History' },
    { id: 'reservations', label: 'Waiting List', icon: Bookmark, title: 'Patron Waiting List & Order-Wise Queue' },
    { id: 'recent', label: 'Recently Checked Out', icon: Clock, title: 'Books Checked Out in Last 24 Hours' },
    { id: 'penalties', label: 'Penalties', icon: AlertTriangle, title: 'Penalty Review, Approve & Decline' },
    { id: 'inventory', label: 'Inventory', icon: Plus, title: 'Catalog Titles & Physical Copies' },
    { id: 'seats', label: 'Study Pods', icon: Armchair, title: 'Study Seat & Pod Real-Time Status' },
    { id: 'announcement', label: 'Notices', icon: Megaphone, title: 'Broadcast Notices to Library Patrons' },
    { id: 'adminmsg', label: 'Msg Admin', icon: Send, title: 'Direct Staff Dispatch to System Scholar Admin' }
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
            if (onSelectTab) onSelectTab('issue');
            if (onNavigate) onNavigate('librarian', { tab: 'issue' });
          }}
          title="Librarian Circulation Desk"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div
            className="portal-brand-logo"
            style={{
              backgroundColor: 'var(--bauhaus-blue)',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid #202020',
              boxShadow: '2px 2px 0px #202020',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Layers size={18} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="portal-brand-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.40rem', color: 'var(--editorial-text)' }}>LibraMind</span>
              <span
                className="badge"
                style={{
                  backgroundColor: 'var(--bauhaus-yellow)',
                  color: '#202020',
                  border: '1.5px solid #202020',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  borderRadius: '2px'
                }}
              >
                LIBRARIAN DESK
              </span>
            </div>
            <p className="portal-subtitle" style={{ margin: 0, fontSize: '0.70rem', color: 'var(--editorial-text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '1px' }}>
              Circulation Management &amp; FIFO Control
            </p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="portal-nav-links portal-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id || (tab.id === 'reservations' && (activeTab === 'waiting-list' || activeTab === 'waiting'));
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

        {/* Right Section: Notifications + User Badge + Logout */}
        <div className="portal-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Public Website Shortcut */}
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="portal-desktop-only btn btn-outline btn-sm"
            title="Browse Public Archives"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <BookOpen size={13} />
            <span>Public Site</span>
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

          {/* Librarian Profile Chip & Dropdown Trigger */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifs(false); }}
                className="profile-chip-btn"
                aria-expanded={showProfileMenu}
                aria-label="Librarian profile menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: showProfileMenu ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                  backgroundColor: showProfileMenu ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer'
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
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  {user?.name?.charAt(0) || 'L'}
                </div>
                <div className="profile-chip-details" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, textAlign: 'left' }}>
                  <span style={{ color: 'var(--editorial-text)', fontWeight: 700, fontSize: '0.80rem' }}>{user?.name || 'Staff Librarian'}</span>
                  <span style={{ color: 'var(--editorial-accent)', fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Circulation Staff</span>
                </div>
                <ChevronDown size={13} color="var(--editorial-text-muted)" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <ProfileDropdown
                  user={user}
                  onClose={() => setShowProfileMenu(false)}
                  onNavigate={onNavigate}
                  onLogout={handleLogout}
                />
              )}
            </div>
          )}

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            title="Sign out of circulation desk"
            aria-label="Sign out"
            className="desktop-only-btn"
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
            LIBRARIAN CIRCULATION DESK
          </div>
          {navTabs.map(tab => {
            const isTabActive = activeTab === tab.id || (tab.id === 'reservations' && (activeTab === 'waiting-list' || activeTab === 'waiting'));
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                style={{
                  backgroundColor: isTabActive ? 'var(--editorial-green)' : '#FFFFFF',
                  color: isTabActive ? '#FFFFFF' : 'var(--editorial-text)',
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
                  <tab.icon size={15} color={isTabActive ? '#FFFFFF' : 'var(--editorial-accent)'} />
                  <span>{tab.label}</span>
                </div>
                <ArrowRight size={14} color="var(--editorial-border)" />
              </button>
            );
          })}
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate && onNavigate('home'); }}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
          >
            <BookOpen size={14} /> Browse Public Archives
          </button>
        </div>
      )}
    </header>
  );
}
