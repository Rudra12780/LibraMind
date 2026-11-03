import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
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
  ArrowRight
} from 'lucide-react';

export default function Navbar({ activePage, onNavigate, compareCount = 0 }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
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
    return false;
  };

  const navItems = [
    { id: 'home', label: 'Home', action: () => { setMobileOpen(false); onNavigate('home'); } },
    { id: 'catalog', label: 'Books', action: () => { setMobileOpen(false); onNavigate('catalog'); } },
    { id: 'ai-finder', label: 'AI Oracle', action: () => { setMobileOpen(false); onNavigate('ai-finder'); } },
    { id: 'seats', label: 'Study Pods', action: () => { setMobileOpen(false); onNavigate('seats'); } },
    { id: 'compare', label: `Compare${compareCount > 0 ? ` (${compareCount})` : ''}`, action: () => { setMobileOpen(false); onNavigate('compare'); } },
    { id: 'visit-planner', label: 'Plan Visit', action: () => { setMobileOpen(false); onNavigate('visit-planner'); } },
    { id: 'reservations', label: 'Hold Queues', action: () => { setMobileOpen(false); onNavigate('reservations'); } }
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
        boxShadow: '0 1px 4px rgba(37, 40, 32, 0.04)'
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
        {/* Editorial Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }}
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
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1
                }}
              >
                LibraMind
              </span>
              <span
                style={{
                  fontSize: '0.64rem',
                  padding: '2px 6px',
                  backgroundColor: 'var(--editorial-bg-subtle)',
                  color: 'var(--editorial-accent)',
                  border: '1px solid var(--editorial-border)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '2px'
                }}
              >
                Vol. XXIV
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--editorial-text-muted)', fontWeight: 500, letterSpacing: '0.02em', marginTop: '1px' }}>
              The Literary Review &amp; Smart Library
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.3vw, 18px)' }}
          className="desktop-nav"
        >
          {navItems.map(item => {
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

        {/* Right Action Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Notifications Dropdown */}
          {user && (
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
          )}

          {/* User Logged In vs Visitor */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Single Unified Patron Folio Chip & Dashboard Trigger */}
              <button
                onClick={() => onNavigate(getDashboardTarget())}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '4px 10px 4px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--editorial-border)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                title={`Open ${getDashboardLabel()}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--editorial-green)';
                  e.currentTarget.style.backgroundColor = 'var(--editorial-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--editorial-border)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
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
                    fontSize: '0.76rem',
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
              </button>

              {/* Sign Out Button */}
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
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onNavigate('login')}
                className="btn btn-outline btn-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="btn btn-primary btn-sm"
              >
                Join Library
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              backgroundColor: mobileOpen ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
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
            boxShadow: '0 12px 32px rgba(37, 40, 32, 0.12)'
          }}
        >
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      background: active ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
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

            {/* Quick Access to User Library / Auth in Drawer */}
            <div style={{ borderTop: '1px solid var(--editorial-border)', paddingTop: '16px' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => { setMobileOpen(false); onNavigate(getDashboardTarget()); }}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <BookOpen size={15} />
                    <span>Enter {getDashboardLabel()}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out ({user.name.split(' ')[0]})</span>
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
