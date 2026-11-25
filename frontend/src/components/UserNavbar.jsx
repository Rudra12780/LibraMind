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
  ArrowRight,
  FileText
} from 'lucide-react';

export default function UserNavbar({
  activePage = 'dashboard',
  activeTab = 'all',
  onSelectTab,
  onNavigate,
  onOpenBlueprints,
  onOpenPresentation,
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
    if (onNavigate) onNavigate('login');
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tabId) => {
    setMobileMenuOpen(false);
    if (onSelectTab) onSelectTab(tabId);
  };

  // Main Public Navigation Items (Deduplicated, zero repetitive links)
  const siteNavItems = [
    { id: 'catalog', label: 'All Books Catalog', icon: BookOpen, action: () => { setMobileMenuOpen(false); onNavigate('catalog'); } },
    { id: 'ai-finder', label: 'AI Oracle Finder', icon: Sparkles, action: () => { setMobileMenuOpen(false); onNavigate('ai-finder'); } },
    { id: 'seats', label: 'Study Pods Booking', icon: Armchair, action: () => { setMobileMenuOpen(false); onNavigate('seats'); } },
    { id: 'visit-planner', label: 'Plan Your Visit', icon: Compass, action: () => { setMobileMenuOpen(false); onNavigate('visit-planner'); } },
    { id: 'blueprints', label: 'Architectural Blueprints', icon: ShieldCheck, action: () => { setMobileMenuOpen(false); onNavigate('blueprints'); } },
    { id: 'presentation', label: 'Download PPT', icon: FileText, action: () => { setMobileMenuOpen(false); if (onOpenPresentation) onOpenPresentation(); } }
  ];

  // Patron Folio Ledger Tabs for Mobile Navigation
  const patronFolioTabs = [
    {
      id: 'all',
      label: 'Reading Room Overview',
      icon: LayoutDashboard,
      badge: null,
      action: () => {
        setMobileMenuOpen(false);
        if (onSelectTab) onSelectTab('all');
        if (onNavigate) onNavigate('dashboard', { tab: 'all' });
      }
    },
    {
      id: 'compare',
      label: 'Book Compare Matrix',
      icon: GitCompare,
      badge: compareCount,
      action: () => {
        setMobileMenuOpen(false);
        if (onSelectTab) onSelectTab('compare');
        if (onNavigate) onNavigate('dashboard', { tab: 'compare' });
      }
    }
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
      {/* Main Top Navigation Row */}
      <div
        className="container"
        style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(6px, 1.5vw, 16px)'
        }}
      >
        {/* Brand Logo with Editorial Monogram */}
        <div
          onClick={() => onNavigate('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)', cursor: 'pointer', flexShrink: 0 }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className="libramind-heading"
                style={{
                  fontFamily: 'var(--font-libramind)',
                  fontSize: 'clamp(1.2rem, 3.5vw, 1.40rem)',
                  fontWeight: 700,
                  color: 'var(--editorial-text)',
                  letterSpacing: '0.02em',
                  lineHeight: 1
                }}
              >
                LibraMind
              </span>
              <span
                className="badge navbar-badge-hide"
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
            <p className="navbar-subtitle" style={{ margin: 0, fontSize: '0.70rem', color: 'var(--editorial-text-muted)', fontWeight: 500, marginTop: '2px' }}>
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
          {siteNavItems.map(item => {
            const isActive = activePage === item.id || (item.id === 'catalog' && activePage === 'book-details');
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`nav-link-editorial ${isActive ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--editorial-green)' : 'var(--editorial-text)'
                }}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)', flexShrink: 0 }}>
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
              title={`${user.name} (${user.role === 'admin' ? 'Admin' : 'Scholar'} · ${user.membership_id || 'STU'})`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px 4px 6px',
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
              <div className="patron-chip-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
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
            className="header-logout-btn"
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
            padding: '16px 14px 24px',
            boxShadow: '0 12px 32px rgba(37, 40, 32, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: 'calc(100vh - 70px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* User Profile Card */}
          {user && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--editorial-green)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.90rem',
                    flexShrink: 0
                  }}
                >
                  {userInitial}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--editorial-accent)', fontWeight: 600 }}>
                    {user.role === 'admin' ? 'Administrator' : 'Scholar'} · ID: {user.membership_id || 'STU-1001'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSelectTab) onSelectTab('all');
                  if (onNavigate) onNavigate('dashboard', { tab: 'all' });
                }}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.74rem', padding: '5px 10px', flexShrink: 0 }}
              >
                Folio Hub →
              </button>
            </div>
          )}

          {/* MY CIRCULATION FOLIO & RECORDS */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--editorial-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              MY PATRON FOLIO &amp; LEDGER
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px' }}>
              {patronFolioTabs.map(tab => {
                const isActive = activePage === 'dashboard' && activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={tab.action}
                    style={{
                      backgroundColor: isActive ? 'var(--editorial-green)' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : 'var(--editorial-text)',
                      border: '1px solid var(--editorial-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '9px 12px',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={15} color={isActive ? '#FFFFFF' : 'var(--editorial-accent)'} style={{ flexShrink: 0 }} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== null && tab.badge !== undefined && (
                      <span
                        style={{
                          fontSize: '0.70rem',
                          fontWeight: 700,
                          padding: '1px 7px',
                          borderRadius: '10px',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--editorial-bg-subtle)',
                          color: isActive ? '#FFFFFF' : 'var(--editorial-accent)',
                          border: isActive ? 'none' : '1px solid var(--editorial-border)'
                        }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* EXPLORE ARCHIVE CHAMBERS */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--editorial-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              EXPLORE LIBRARY CHAMBERS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px' }}>
              {siteNavItems.filter(item => !item.desktopOnly).map(item => {
                const isActive = activePage === item.id || (item.id === 'catalog' && activePage === 'book-details');
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    style={{
                      background: isActive ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                      border: '1px solid var(--editorial-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '9px 12px',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      color: 'var(--editorial-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {Icon && <Icon size={15} color="var(--editorial-accent)" style={{ flexShrink: 0 }} />}
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight size={13} color="var(--editorial-border)" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications & Sign Out */}
          <div style={{ borderTop: '1px solid var(--editorial-border)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('notifications');
              }}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 12px',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: 'var(--editorial-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={15} color="var(--editorial-accent)" />
                <span>Sanctuary Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--editorial-accent)',
                    color: '#FFFFFF'
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px' }}
            >
              <LogOut size={14} />
              <span>Sign Out ({user?.name ? user.name.split(' ')[0] : 'Account'})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
