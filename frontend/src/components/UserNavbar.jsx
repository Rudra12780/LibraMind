import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import {
  BookOpen,
  Sparkles,
  Armchair,
  GitCompare,
  Compass,
  Bell,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  Bookmark,
  Heart,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

export default function UserNavbar({
  activeTab = 'all',
  onSelectTab,
  onNavigate,
  loanCount = 0,
  holdCount = 0,
  seatCount = 0,
  wishlistCount = 0,
  compareCount = 0
}) {
  const { user, logout, adminVerified } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('home');
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tabId) => {
    setMobileMenuOpen(false);
    if (onSelectTab) onSelectTab(tabId);
  };

  // Main Public Navigation Items
  const siteNavItems = [
    { id: 'home', label: 'Home', action: () => { setMobileMenuOpen(false); onNavigate('home'); } },
    { id: 'catalog', label: 'Books', action: () => { setMobileMenuOpen(false); onNavigate('catalog'); } },
    { id: 'ai-finder', label: 'AI Oracle', action: () => { setMobileMenuOpen(false); onNavigate('ai-finder'); } },
    { id: 'seats', label: 'Study Pods', action: () => { setMobileMenuOpen(false); onNavigate('seats'); } },
    { id: 'compare', label: `Compare${compareCount > 0 ? ` (${compareCount})` : ''}`, action: () => { setMobileMenuOpen(false); onNavigate('compare'); } },
    { id: 'visit-planner', label: 'Plan Visit', action: () => { setMobileMenuOpen(false); onNavigate('visit-planner'); } },
    { id: 'reservations', label: 'Hold Queues', action: () => { setMobileMenuOpen(false); onNavigate('reservations'); } }
  ];

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header
      style={{
        backgroundColor: 'var(--editorial-bg)',
        borderBottom: '1px solid var(--editorial-border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 4px rgba(37, 40, 32, 0.04)',
        width: '100%',
        maxWidth: '100vw'
      }}
    >
      {/* Top Banner if Admin is browsing in User Mode */}
      {user && user.role === 'admin' && !adminVerified && (
        <div
          style={{
            background: 'var(--editorial-green)',
            color: '#FFFFFF',
            padding: '6px 20px',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--editorial-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={14} color="#D9D3C7" />
            <span style={{ letterSpacing: '0.04em' }}>ADMINISTRATOR PREVIEW MODE — VIEWING PATRON SANCTUARY</span>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            style={{
              background: '#FFFFFF',
              border: 'none',
              color: 'var(--editorial-green)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.72rem',
              borderRadius: 'var(--radius-sm)',
              padding: '3px 10px'
            }}
          >
            Return to Admin Console →
          </button>
        </div>
      )}

      {/* Main Top Navigation Row */}
      <div
        className="container"
        style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand Logo with Editorial Monogram */}
        <div
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--editorial-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <BookOpen size={19} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.40rem',
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1
                }}
              >
                LibraMind
              </span>
              <span
                className="badge"
                style={{
                  fontSize: '0.62rem',
                  padding: '2px 6px',
                  backgroundColor: 'var(--editorial-bg-subtle)',
                  color: 'var(--editorial-accent)',
                  border: '1px solid var(--editorial-border)',
                  fontWeight: 700,
                  borderRadius: '2px'
                }}
              >
                READING ROOM
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.70rem', color: 'var(--editorial-text-muted)', fontWeight: 500, marginTop: '2px' }}>
              Personal Folio &amp; Circulation Desk
            </p>
          </div>
        </div>

        {/* Primary Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 1.3vw, 18px)'
          }}
          className="desktop-nav"
        >
          {siteNavItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className="nav-link-editorial"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                fontSize: '0.86rem'
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                color: 'var(--editorial-text)',
                transition: 'all 0.15s ease'
              }}
            >
              <Bell size={16} strokeWidth={2} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--editorial-accent)',
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

          {/* User Profile Chip - Active Reading Room Folio */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 6px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--editorial-green)',
                backgroundColor: 'var(--editorial-bg-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--editorial-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {userInitial}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--editorial-accent)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {user.role === 'admin' ? 'Admin' : 'Scholar'} · {user.membership_id || 'STU'}
                </span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign Out"
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
              color: 'var(--editorial-text-muted)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#8C2222';
              e.currentTarget.style.borderColor = '#8C2222';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--editorial-text-muted)';
              e.currentTarget.style.borderColor = 'var(--editorial-border)';
            }}
          >
            <LogOut size={15} strokeWidth={2} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
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
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer Menu ── */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--editorial-bg)',
            borderTop: '1px solid var(--editorial-border)',
            padding: '20px',
            boxShadow: '0 12px 32px rgba(37, 40, 32, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Public Navigation Links */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
              EXPLORE LIBRARY CHAMBERS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
              {siteNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={item.action}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    fontSize: '0.86rem',
                    fontWeight: 500,
                    color: 'var(--editorial-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight size={13} color="var(--editorial-border)" />
                </button>
              ))}
            </div>
          </div>

          {/* User Details & Sign Out */}
          <div style={{ borderTop: '1px solid var(--editorial-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--editorial-green)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.76rem'
                }}
              >
                {userInitial}
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
