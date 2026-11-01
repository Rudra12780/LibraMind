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
  Layers,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  Bookmark,
  Heart,
  Menu,
  X,
  Search,
  Home
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

  // Main Sanctuary Navigation Items (ensures user NEVER loses navigation to the site!)
  const siteNavItems = [
    { id: 'home', label: 'Home', action: () => { setMobileMenuOpen(false); onNavigate('home'); } },
    { id: 'catalog', label: 'Books', action: () => { setMobileMenuOpen(false); onNavigate('catalog'); } },
    { id: 'ai-finder', label: 'AI Finder', icon: Sparkles, action: () => { setMobileMenuOpen(false); onNavigate('ai-finder'); }, highlight: true },
    { id: 'seats', label: 'Study Seats', icon: Armchair, action: () => { setMobileMenuOpen(false); onNavigate('seats'); } },
    { id: 'compare', label: `Compare${compareCount > 0 ? ` (${compareCount})` : ''}`, icon: GitCompare, action: () => { setMobileMenuOpen(false); onNavigate('compare'); } },
    { id: 'visit-planner', label: 'Plan Visit', icon: Compass, action: () => { setMobileMenuOpen(false); onNavigate('visit-planner'); } },
    { id: 'reservations', label: 'Holds', icon: Bookmark, action: () => { setMobileMenuOpen(false); onNavigate('reservations'); } }
  ];

  // Dedicated Member Hub Sub-tabs
  const memberHubTabs = [
    { id: 'all', label: 'Overview', icon: LayoutDashboard },
    { id: 'loans', label: 'My Loans', icon: Clock, count: loanCount },
    { id: 'holds', label: 'Hold Queues', icon: Bookmark, count: holdCount },
    { id: 'seats', label: 'Study Pods', icon: Armchair, count: seatCount },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount },
    { id: 'recommendations', label: 'AI For You', icon: Sparkles }
  ];

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--subtle-border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(52, 78, 65, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      {/* Top Banner if Admin is browsing in User Mode */}
      {user && user.role === 'admin' && !adminVerified && (
        <div
          style={{
            backgroundColor: '#FCE8E6',
            color: '#A51D24',
            padding: '5px 24px',
            fontSize: '0.76rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(165, 29, 36, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={13} color="#C5221F" />
            <span>Administrator User Mode Active — Experiencing the library hub as a regular reader.</span>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            style={{
              background: 'none',
              border: 'none',
              color: '#A51D24',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.76rem'
            }}
          >
            Switch to Admin Portal →
          </button>
        </div>
      )}

      {/* ── Tier 1: Primary Navigation Bar (Full Site Access) ── */}
      <div
        className="container"
        style={{
          height: '66px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', flexShrink: 0 }}
          title="Return to Library Sanctuary Home"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(52, 78, 65, 0.28)',
              flexShrink: 0
            }}
          >
            <BookOpen size={20} color="#FAF8F1" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.40rem',
                  fontWeight: 800,
                  color: 'var(--forest-dark)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1
                }}
              >
                LibraMind
              </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--soft-sage) 0%, #D4E3CB 100%)',
                  color: 'var(--forest-dark)',
                  border: '1px solid rgba(82, 115, 77, 0.25)',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '6px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Sparkles size={9} color="var(--forest)" />
                Member Hub
              </span>
            </div>
            <p className="portal-subtitle" style={{ margin: 0, fontSize: '0.66rem', color: 'var(--sage)', letterSpacing: '0.02em', marginTop: '1px' }}>
              Personal Reading Sanctuary · Active Loans & Services
            </p>
          </div>
        </div>

        {/* Primary Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: '1 1 auto',
            minWidth: 0,
            overflow: 'hidden',
            justifyContent: 'flex-end'
          }}
          className="usernav-desktop"
        >
          {siteNavItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              style={{
                background: item.highlight ? 'rgba(82, 115, 77, 0.07)' : 'transparent',
                border: item.highlight ? '1px solid rgba(82, 115, 77, 0.18)' : '1px solid transparent',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: item.highlight ? 'var(--botanical)' : 'var(--muted-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--soft-sage-light)';
                e.currentTarget.style.color = 'var(--forest-dark)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = item.highlight ? 'rgba(82, 115, 77, 0.07)' : 'transparent';
                e.currentTarget.style.color = item.highlight ? 'var(--botanical)' : 'var(--muted-text)';
              }}
            >
              {item.icon && <item.icon size={13} color="currentColor" />}
              {item.label}
            </button>
          ))}

          {/* Active "My Hub" Button */}
          <button
            onClick={() => handleTabClick('all')}
            style={{
              background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '22px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 3px 10px rgba(52, 78, 65, 0.25)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title="Current page: My Member Hub"
          >
            <BookOpen size={13} color="#FFFFFF" strokeWidth={2.2} />
            <span style={{ whiteSpace: 'nowrap' }}>My Hub</span>
          </button>
        </nav>

        {/* Right Section: Notifications, Profile & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              aria-label="Member notifications"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid var(--subtle-border)',
                backgroundColor: showNotifs ? 'var(--soft-sage-light)' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease'
              }}
            >
              <Bell size={17} color={showNotifs ? 'var(--botanical)' : 'var(--forest)'} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '7px',
                    right: '7px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#E8453C',
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

          {/* User Profile Chip */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 4px',
                borderRadius: '10px',
                border: '1px solid var(--subtle-border)',
                backgroundColor: '#FFFFFF'
              }}
              className="usernav-desktop"
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--botanical) 0%, var(--sage) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.76rem',
                  fontWeight: 800
                }}
              >
                {userInitial}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--muted-text)', fontWeight: 600 }}>
                  {user.role === 'admin' ? 'Admin' : 'Member'} · {user.membership_id}
                </span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign Out of Library Account"
            aria-label="Sign Out"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              border: '1px solid var(--subtle-border)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--muted-text)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#FEE8E8';
              e.currentTarget.style.borderColor = 'rgba(197, 34, 31, 0.25)';
              e.currentTarget.style.color = '#C5221F';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = 'var(--subtle-border)';
              e.currentTarget.style.color = 'var(--muted-text)';
            }}
          >
            <LogOut size={15} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="usernav-mobile-btn"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid var(--subtle-border)',
              backgroundColor: mobileMenuOpen ? 'var(--soft-sage-light)' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              display: 'none',
              transition: 'all 0.15s ease'
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} color="var(--forest)" /> : <Menu size={18} color="var(--forest)" />}
          </button>
        </div>
      </div>

      {/* ── Tier 2: Dedicated Member Hub Sub-Navigation Bar ── */}
      <div
        style={{
          backgroundColor: '#FAF8F1',
          borderTop: '1px solid rgba(52, 78, 65, 0.08)',
          padding: '6px 0',
          overflow: 'hidden'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '2px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--botanical)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', marginRight: '4px' }}>
            Hub Views:
          </span>

          {memberHubTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  background: isActive
                    ? 'var(--forest)'
                    : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--forest-dark)',
                  border: isActive ? '1px solid var(--forest)' : '1px solid var(--subtle-border)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.80rem',
                  fontWeight: isActive ? 700 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 2px 8px rgba(52, 78, 65, 0.22)' : 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--soft-sage-light)';
                    e.currentTarget.style.borderColor = 'rgba(82, 115, 77, 0.3)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'var(--subtle-border)';
                  }
                }}
              >
                <tab.icon
                  size={13}
                  color={isActive ? '#FFFFFF' : tab.id === 'wishlist' && tab.count > 0 ? '#C5221F' : 'var(--botanical)'}
                  fill={tab.id === 'wishlist' && tab.count > 0 ? (isActive ? '#FFFFFF' : '#C5221F') : 'none'}
                />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--soft-sage)',
                      color: isActive ? '#FFFFFF' : 'var(--forest-dark)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Mobile Drawer Menu ── */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--subtle-border)',
            padding: '14px 16px 20px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Group 1: Member Hub Tabs */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--botanical)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Member Hub Views
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {memberHubTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    style={{
                      background: isActive ? 'var(--forest)' : 'var(--cream)',
                      color: isActive ? '#FFFFFF' : 'var(--forest-dark)',
                      border: isActive ? '1px solid var(--forest)' : '1px solid var(--subtle-border)',
                      padding: '9px 12px',
                      borderRadius: '9px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <tab.icon size={14} color={isActive ? '#FFFFFF' : 'currentColor'} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span style={{ fontSize: '0.70rem', fontWeight: 800 }}>({tab.count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--subtle-border)' }} />

          {/* Group 2: Public Sanctuary Navigation */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Library Sanctuary Tools
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {siteNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={item.action}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 500,
                    color: 'var(--forest-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {item.icon && <item.icon size={15} color="var(--forest)" />}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: Sign Out */}
          <div style={{ borderTop: '1px solid var(--subtle-border)', paddingTop: '10px' }}>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid rgba(197, 34, 31, 0.25)',
                color: '#C5221F',
                padding: '9px 14px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <LogOut size={15} /> Sign Out of Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
