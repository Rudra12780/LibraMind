import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
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
  ArrowRight,
  ChevronDown,
  User
} from 'lucide-react';

export default function UserNavbar({
  activePage = 'dashboard',
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    if (onSelectTab) onSelectTab('all');
    if (onNavigate) onNavigate('dashboard');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('libramind:data-updated', { detail: { action: 'navigate-home' } }));
    }
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate('dashboard');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('libramind:data-updated', { detail: { action: 'navigate-home' } }));
    }
  };

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('home');
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tabId) => {
    setMobileMenuOpen(false);
    if (onSelectTab) onSelectTab(tabId);
  };

  // Main Navigation Items (all folio chambers & reading modules)
  // Clean editorial naming: pure text labels without embedded number counts
  const siteNavItems = [
    {
      id: 'home',
      label: 'Home',
      action: handleHomeClick
    },
    { id: 'catalog', label: 'Explore Books', action: () => { setMobileMenuOpen(false); onNavigate('catalog'); } },
    { id: 'ai-finder', label: 'AI Book Finder', action: () => { setMobileMenuOpen(false); onNavigate('ai-finder'); } },
    { id: 'seats', label: 'Study Seats', action: () => { setMobileMenuOpen(false); onNavigate('seats'); } },
    { id: 'reservations', label: 'Waiting Lists', action: () => { setMobileMenuOpen(false); onNavigate('reservations'); } },
    { id: 'wishlist', label: 'Wishlist', action: () => { setMobileMenuOpen(false); onNavigate('dashboard', { tab: 'wishlist', section: 'wishlist' }); } },
    { id: 'compare', label: 'Compare', action: () => { setMobileMenuOpen(false); onNavigate('compare'); } },
    { id: 'visit-planner', label: 'Visit Planner', action: () => { setMobileMenuOpen(false); onNavigate('visit-planner'); } }
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
        {/* Brand Logo with Bauhaus Monogram */}
        <div
          onClick={handleLogoClick}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0, minWidth: 0 }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bauhaus-blue)',
              border: '2px solid #202020',
              boxShadow: '2px 2px 0px #202020',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <BookOpen size={18} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.38rem',
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap'
                }}
              >
                LibraMind
              </span>
              <span
                className="brand-vol-badge"
                style={{
                  fontSize: '0.62rem',
                  padding: '2px 6px',
                  backgroundColor: 'var(--bauhaus-yellow)',
                  color: '#202020',
                  border: '1.5px solid #202020',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  borderRadius: '2px',
                  whiteSpace: 'nowrap'
                }}
              >
                MEMBER HUB
              </span>
            </div>
            <p
              className="brand-subtitle"
              style={{
                margin: 0,
                fontSize: '0.70rem',
                color: 'var(--editorial-text-muted)',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                marginTop: '1px',
                whiteSpace: 'nowrap'
              }}
            >
              Personal Folio &amp; Stacks Access
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
          {siteNavItems.map(item => {
            const isHomeActive = item.id === 'home' && (activePage === 'dashboard' || activePage === 'home');
            const isActive = isHomeActive || item.id === activePage;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`nav-link-editorial ${isActive ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  fontSize: '0.86rem'
                }}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowProfileMenu(false); }}
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

          {/* User Profile Chip (Toggles Complete Profile Dropdown Menu on Both Desktop & Mobile) */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifs(false); }}
                className="profile-chip-btn"
                aria-expanded={showProfileMenu}
                aria-label="User account and profile menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '4px 10px 4px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: showProfileMenu ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-green)',
                  backgroundColor: showProfileMenu ? '#FFFFFF' : 'var(--editorial-bg-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                title="Account Folio & Profile Menu"
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
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
                <div className="profile-chip-details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--editorial-text)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--editorial-accent)', fontWeight: 600, letterSpacing: '0.04em' }}>
                    {user.role === 'admin' ? 'Admin' : 'Scholar'} · {user.membership_id || 'STU'}
                  </span>
                </div>
                <ChevronDown size={13} color="var(--editorial-text-muted)" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>

              {/* Profile Dropdown Component */}
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

          {/* Desktop Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign Out"
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
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setShowProfileMenu(false); setShowNotifs(false); }}
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
              {siteNavItems.map(item => {
                const isHomeActive = item.id === 'home' && (activePage === 'dashboard' || activePage === 'home');
                const isActive = isHomeActive || item.id === activePage;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    style={{
                      background: isActive ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                      border: isActive ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--editorial-accent)' : 'var(--editorial-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight size={13} color={isActive ? 'var(--editorial-accent)' : 'var(--editorial-border)'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Details & Profile Actions */}
          <div style={{ borderTop: '1px solid var(--editorial-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--editorial-green)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  flexShrink: 0
                }}
              >
                {userInitial}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {user?.role} · {user?.membership_id || 'STU'}
                </div>
              </div>
            </div>

            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('complete-profile'); }}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <User size={15} />
              <span>View &amp; Edit Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', color: '#8C2222', borderColor: 'rgba(140, 34, 34, 0.3)' }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
