import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import {
  BookOpen,
  BookMarked,
  Clock,
  Bookmark,
  Armchair,
  Heart,
  Sparkles,
  Bell,
  LogOut,
  Search,
  Compass,
  Menu,
  X,
  Layers,
  ShieldCheck,
  LayoutDashboard,
  Home
} from 'lucide-react';

export default function UserNavbar({
  activeTab = 'all',
  onSelectTab,
  onNavigate,
  loanCount = 0,
  holdCount = 0,
  seatCount = 0,
  wishlistCount = 0
}) {
  const { user, logout, adminVerified } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('home');
  };

  const navTabs = [
    { id: 'all', label: 'My Hub', icon: LayoutDashboard },
    { id: 'loans', label: `My Loans${loanCount > 0 ? ` (${loanCount})` : ''}`, icon: Clock, count: loanCount },
    { id: 'holds', label: `Holds${holdCount > 0 ? ` (${holdCount})` : ''}`, icon: Bookmark, count: holdCount },
    { id: 'seats', label: `Study Pods${seatCount > 0 ? ` (${seatCount})` : ''}`, icon: Armchair, count: seatCount },
    { id: 'wishlist', label: `Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}`, icon: Heart, count: wishlistCount },
    { id: 'recommendations', label: 'AI For You', icon: Sparkles }
  ];

  const handleTabClick = (tab) => {
    setMobileMenuOpen(false);
    if (onSelectTab) onSelectTab(tab.id);
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '2px solid rgba(52, 78, 65, 0.22)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(52, 78, 65, 0.08)',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Top Bar for User Mode Notification or Staff/Admin Reminder */}
      {user && user.role === 'admin' && !adminVerified && (
        <div
          style={{
            backgroundColor: '#FCE8E6',
            color: '#A51D24',
            padding: '4px 20px',
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
            <span>Administrator User Mode Active: You are experiencing the library hub as a regular reader.</span>
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
        {/* Brand Header — Member Portal Specific */}
        <div
          onClick={() => {
            setMobileMenuOpen(false);
            if (onSelectTab) onSelectTab('all');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title="Return to Member Hub Overview"
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(52, 78, 65, 0.25)',
              flexShrink: 0
            }}
          >
            <BookOpen size={22} color="#FAF8F1" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.40rem',
                  fontWeight: 800,
                  color: 'var(--forest-dark)',
                  letterSpacing: '-0.02em'
                }}
              >
                LibraMind
              </span>
              <span
                style={{
                  backgroundColor: 'var(--soft-sage-light)',
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
                <Sparkles size={11} color="var(--forest)" />
                Member Hub
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.70rem', color: 'var(--sage)', letterSpacing: '0.02em' }}>
              Personal Sanctuary • Active Loans & Reservations
            </p>
          </div>
        </div>

        {/* Dedicated Member Hub Tabs (Desktop Navigation) */}
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
                  padding: '7px 11px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--forest-dark)' : 'var(--muted-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'var(--cream)';
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
                <tab.icon
                  size={15}
                  color={tab.id === 'wishlist' && tab.count > 0 ? '#C5221F' : active ? 'var(--forest)' : 'currentColor'}
                  fill={tab.id === 'wishlist' && tab.count > 0 ? '#C5221F' : 'none'}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Library Catalog Switcher & Member Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Public Library & Catalog Switcher Buttons */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                padding: '6px 11px',
                borderColor: 'var(--subtle-border)',
                borderRadius: '8px'
              }}
              title="Search and borrow more books from catalog"
            >
              <Search size={13} color="var(--forest)" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                padding: '6px 11px',
                borderColor: 'var(--subtle-border)',
                borderRadius: '8px'
              }}
              title="View Public Library Sanctuary Landing Page"
            >
              <Home size={13} color="var(--sage)" />
              <span>Public Page</span>
            </button>
          </div>

          {/* Member Notification Center */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              aria-label="Member notifications"
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

          {/* Member Profile Tag */}
          {user && (
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
                  color: 'var(--forest)',
                  fontWeight: 700
                }}
              >
                {user.role === 'admin' ? 'Admin (User Mode)' : 'Student'} • {user.membership_id}
              </span>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            title="Sign Out of Library Account"
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

          {/* Mobile Menu Hamburger Button */}
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
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid rgba(52, 78, 65, 0.15)',
            padding: '12px 16px 16px',
            boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--forest-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
            Member Hub Sections
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
                    color: active ? 'var(--forest-dark)' : 'var(--muted-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <tab.icon size={15} color={active ? 'var(--forest)' : 'currentColor'} />
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
                onNavigate('catalog');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--subtle-border)',
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
              <Search size={14} color="var(--forest)" />
              Browse Catalog
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('home');
              }}
              style={{
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
              <Home size={14} color="var(--sage)" />
              Public Sanctuary
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
