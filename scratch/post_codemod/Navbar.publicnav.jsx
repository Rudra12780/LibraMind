import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import {
  BookOpen,
  Sparkles,
  Bookmark,
  Armchair,
  GitCompare,
  Compass,
  Bell,
  LogOut,
  Menu,
  X,
  Layers,
  ArrowRight,
  ChevronDown,
  User
} from 'lucide-react';

export default function Navbar({ activePage, onNavigate, compareCount = 0 }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    setShowProfileMenu(false);
    await logout();
    onNavigate('home');
  };

  const isItemActive = (id) => {
    if (id === 'home' && activePage === 'home') return true;
    if (id === 'catalog' && (activePage === 'catalog' || activePage === 'book-details')) return true;
    if (id === 'ai-finder' && activePage === 'ai-finder') return true;
    if (id === 'seats' && activePage === 'seats') return true;
    if (id === 'compare' && activePage === 'compare') return true;
    if (id === 'visit-planner' && activePage === 'visit-planner') return true;
    if (id === 'reservations' && activePage === 'reservations') return true;
    if (id === 'about' && activePage === 'about') return true;
    if (id === 'contact' && activePage === 'contact') return true;
    if (id === 'terms' && activePage === 'terms') return true;
    if (id === 'explore' && (activePage === 'catalog' || activePage === 'book-details')) return true;
    return false;
  };

  const navItems = [
    { id: 'home', label: 'Home', action: () => { setMobileOpen(false); onNavigate('home'); } },
    { id: 'catalog', label: 'Explore Books', action: () => { setMobileOpen(false); onNavigate('catalog'); } },
    { id: 'ai-finder', label: 'AI Book Finder', action: () => { setMobileOpen(false); onNavigate('ai-finder'); } },
    { id: 'seats', label: 'Study Seats', action: () => { setMobileOpen(false); onNavigate('seats'); } },
    { id: 'compare', label: `Compare${compareCount > 0 ? ` (${compareCount})` : ''}`, action: () => { setMobileOpen(false); onNavigate('compare'); } },
    { id: 'visit-planner', label: 'Visit Planner', action: () => { setMobileOpen(false); onNavigate('visit-planner'); } },
    { id: 'reservations', label: 'Waiting Lists', action: () => { setMobileOpen(false); onNavigate('reservations'); } }
  ];

  // Guests get a clear horizontal public navigation instead of an empty bar.
  const scrollToExplore = () => {
    setMobileOpen(false);
    if (activePage !== 'home') {
      onNavigate('home');
      window.setTimeout(() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }), 180);
    } else {
      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const publicNavItems = [
    { id: 'home', label: 'Home', action: () => { setMobileOpen(false); onNavigate('home'); } },
    { id: 'explore', label: 'Explore Books', action: scrollToExplore },
    { id: 'about', label: 'About', action: () => { setMobileOpen(false); onNavigate('about'); } },
    { id: 'contact', label: 'Help', action: () => { setMobileOpen(false); onNavigate('contact'); } },
    { id: 'terms', label: 'Policies', action: () => { setMobileOpen(false); onNavigate('terms'); } }
  ];

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const getDashboardTarget = () => {
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin';
    if (user.role === 'librarian') return 'librarian';
    return 'dashboard';
  };

  const getDashboardLabel = () => {
    if (!user) return 'My Library';
    if (user.role === 'admin') return 'Admin Console';
    if (user.role === 'librarian') return 'Librarian Desk';
    return 'My Library';
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--editorial-bg)',
        borderBottom: '1px solid var(--editorial-border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        maxWidth: '100vw',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
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
        {/* Bauhaus Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0, minWidth: 0 }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bauhaus-blue)',
              border: '2px solid var(--bauhaus-charcoal)',
              boxShadow: '2px 2px 0px var(--bauhaus-charcoal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <BookOpen size={18} color="var(--bauhaus-offwhite)" strokeWidth={2.4} />
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
                  color: 'var(--bauhaus-charcoal)',
                  border: '1.5px solid var(--bauhaus-charcoal)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '2px',
                  whiteSpace: 'nowrap'
                }}
              >
                BAUHAUS ARCHIVES
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
                letterSpacing: '0.04em',
                marginTop: '1px',
                whiteSpace: 'nowrap'
              }}
            >
              Bauhaus Digital Library &amp; Research System
            </p>
          </div>
        </div>

        {/* Desktop navigation — member workspace links or public site links */}
        {(
          <nav
            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.3vw, 18px)' }}
            className="desktop-nav"
          >
            {(user ? navItems : publicNavItems).map(item => {
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`nav-link-editorial ${active ? 'active' : ''}`}
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
        )}

        {/* Right Action Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Notifications Dropdown */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotifs(!showNotifs); setShowProfileMenu(false); }}
                aria-label="View notifications"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--editorial-border)',
                  backgroundColor: showNotifs ? 'var(--editorial-bg-subtle)' : 'var(--bauhaus-offwhite)',
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
                      border: '1.5px solid var(--bauhaus-offwhite)'
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
          )}

          {/* User Logged In vs Visitor */}
          {user ? (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Profile Chip Button (Toggles Complete Profile Menu on Both Desktop & Mobile) */}
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
                  border: showProfileMenu ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                  backgroundColor: showProfileMenu ? 'var(--editorial-bg-subtle)' : 'var(--bauhaus-offwhite)',
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
                    color: 'var(--bauhaus-offwhite)',
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
                  <span
                    style={{
                      fontSize: '0.62rem',
                      color: 'var(--editorial-accent)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {user.role} · Folio
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

              {/* Desktop Sign Out Button */}
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
                  backgroundColor: 'var(--bauhaus-offwhite)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--editorial-text-muted)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--bauhaus-red)';
                  e.currentTarget.style.borderColor = 'var(--bauhaus-red)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--editorial-text-muted)';
                  e.currentTarget.style.borderColor = 'var(--editorial-border)';
                }}
              >
                <LogOut size={15} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Login Button - Always visible, touch-friendly, never cut off on mobile */}
              <button
                onClick={() => onNavigate('login')}
                className="btn btn-primary btn-sm login-nav-btn"
                style={{
                  padding: '7px 15px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Sign In
              </button>
              {/* Join Library Button - Shown on desktop; accessible via hamburger drawer on mobile */}
              <button
                onClick={() => onNavigate('register')}
                className="btn btn-outline btn-sm desktop-only-btn"
                style={{
                  padding: '7px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Join Library
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => { setMobileOpen(!mobileOpen); setShowProfileMenu(false); setShowNotifs(false); }}
            aria-label="Toggle navigation menu"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              backgroundColor: mobileOpen ? 'var(--editorial-bg-subtle)' : 'var(--bauhaus-offwhite)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--editorial-text)'
            }}
          >
            {mobileOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Editorial Table of Contents) */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: 'var(--editorial-bg)',
            borderTop: '1px solid var(--editorial-border)',
            padding: '20px 0 24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {user ? (
              <>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--editorial-accent)' }}>
                  EDITORIAL CATALOGUE &amp; CHAMBERS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                  {navItems.map(item => {
                    const active = isItemActive(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        style={{
                          background: active ? 'var(--editorial-bg-subtle)' : 'var(--bauhaus-offwhite)',
                          border: '1px solid var(--editorial-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px 16px',
                          fontSize: '0.90rem',
                          fontWeight: active ? 700 : 500,
                          color: 'var(--editorial-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.icon && <item.icon size={15} color="var(--editorial-accent)" />}
                          <span>{item.label}</span>
                        </div>
                        <ArrowRight size={14} color="var(--editorial-border)" />
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {publicNavItems.map(item => {
                  const active = isItemActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      style={{
                        background: active ? 'var(--bauhaus-yellow-light)' : 'var(--bauhaus-offwhite)',
                        border: '2px solid var(--bauhaus-charcoal)',
                        borderRadius: '2px',
                        padding: '12px 16px',
                        fontSize: '0.9rem',
                        fontWeight: active ? 800 : 600,
                        color: 'var(--bauhaus-charcoal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={14} />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Access to User Library / Auth in Drawer */}
            <div style={{ borderTop: '1px solid var(--editorial-border)', paddingTop: '16px' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px', marginBottom: '4px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--editorial-green)',
                        color: 'var(--bauhaus-offwhite)',
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
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {user.role} · {user.membership_id || 'STU'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMobileOpen(false); onNavigate(getDashboardTarget()); }}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <BookOpen size={15} />
                    <span>Enter {getDashboardLabel()}</span>
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onNavigate('complete-profile'); }}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <User size={15} />
                    <span>View &amp; Edit Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', color: 'var(--bauhaus-red)', borderColor: 'rgba(140, 34, 34, 0.3)' }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => { setMobileOpen(false); onNavigate('login'); }}
                    className="btn btn-outline"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onNavigate('register'); }}
                    className="btn btn-primary"
                  >
                    Join Library
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
