import React, { useState, useEffect } from 'react';
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
  User,
  Shield,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activePage, onNavigate, compareCount = 0 }) {
  const { user, logout, adminVerified } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setMobileOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', action: () => onNavigate('home') },
    { id: 'catalog', label: 'Books', action: () => onNavigate('catalog') },
    { id: 'ai-finder', label: 'AI Finder', icon: Sparkles, action: () => onNavigate('ai-finder'), highlight: true },
    { id: 'seats', label: 'Study Seats', icon: Armchair, action: () => onNavigate('seats') },
    { id: 'compare', label: `Compare${compareCount > 0 ? ` (${compareCount})` : ''}`, icon: GitCompare, action: () => onNavigate('compare') },
    { id: 'visit-planner', label: 'Plan Visit', icon: Compass, action: () => onNavigate('visit-planner') },
    ...(user && (user.role === 'student' || !adminVerified) ? [
      { id: 'dashboard', label: 'My Hub', icon: BookOpen, isHub: true, action: () => onNavigate('dashboard') }
    ] : [
      { id: 'about', label: 'About', action: () => onNavigate('about') }
    ])
  ];

  const isItemActive = (item) => {
    if (activePage === item.id) return true;
    if (item.id === 'catalog' && (activePage === 'books' || activePage === 'book-details' || activePage === 'catalog')) return true;
    if (item.id === 'ai-finder' && (activePage === 'ai-finder' || activePage === 'ai-book-finder')) return true;
    if (item.id === 'dashboard' && (activePage === 'dashboard' || activePage === 'student/dashboard')) return true;
    return false;
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.97)' : '#FFFFFF',
        borderBottom: scrolled ? '1px solid rgba(52, 78, 65, 0.10)' : '1px solid var(--subtle-border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(52, 78, 65, 0.09)' : 'none'
      }}
    >
      {/* Staff / Admin Top Alert Banner */}
      {user && (user.role === 'librarian' || (user.role === 'admin' && adminVerified)) && (
        <div
          style={{
            background: user.role === 'admin'
              ? 'linear-gradient(90deg, #FCE8E6 0%, #FDECEA 100%)'
              : 'linear-gradient(90deg, var(--soft-sage-light) 0%, #EFF5EB 100%)',
            color: user.role === 'admin' ? '#C5221F' : 'var(--forest-dark)',
            padding: '6px 24px',
            fontSize: '0.76rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: user.role === 'admin'
              ? '1px solid rgba(197, 34, 31, 0.12)'
              : '1px solid rgba(82, 115, 77, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            {user.role === 'admin' ? <ShieldCheck size={13} /> : <Layers size={13} />}
            <span>
              Authenticated as <strong>{user.name}</strong> ({user.role === 'admin' ? 'Chief Administrator' : 'Staff Librarian'}) — Viewing public library sanctuary.
            </span>
          </div>
          <button
            onClick={() => onNavigate(user.role === 'admin' ? 'admin' : 'librarian')}
            style={{
              background: 'none', border: 'none',
              color: user.role === 'admin' ? '#A51D24' : 'var(--botanical)',
              fontWeight: 800, cursor: 'pointer', fontSize: '0.76rem',
              textDecoration: 'underline', textUnderlineOffset: '3px',
              whiteSpace: 'nowrap'
            }}
          >
            {user.role === 'admin' ? '← Admin Portal' : '← Librarian Desk'}
          </button>
        </div>
      )}

      {/* Member Top Alert Banner */}
      {user && (user.role === 'student' || (user.role === 'admin' && !adminVerified)) && (
        <div
          style={{
            background: 'linear-gradient(90deg, var(--soft-sage-light) 0%, #EFF5EB 100%)',
            color: 'var(--forest-dark)',
            padding: '6px 24px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(82, 115, 77, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <BookOpen size={13} color="var(--forest)" />
            <span>
              Welcome, <strong>{user.name}</strong> — {user.role === 'admin' ? 'Admin (User Mode)' : 'Library Member'} · {user.membership_id}
            </span>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              background: 'none', border: 'none',
              color: 'var(--botanical)', fontWeight: 800, cursor: 'pointer',
              fontSize: '0.76rem', textDecoration: 'underline',
              textUnderlineOffset: '3px', whiteSpace: 'nowrap'
            }}
          >
            → My Hub & Loans
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div
        className="container"
        style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', flexShrink: 0 }}
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
                  fontSize: '1.42rem',
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
                  border: '1px solid rgba(82, 115, 77, 0.22)',
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
                Smart
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.67rem', color: 'var(--sage)', letterSpacing: '0.02em', marginTop: '1px' }}>
              Biophilic Sanctuary · Novels & Wisdom
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
          className="desktop-nav"
        >
          {navItems.map(item => {
            const active = isItemActive(item);
            return (
              <button
                key={item.id}
                onClick={item.action}
                style={{
                  background: item.isHub
                    ? 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)'
                    : item.highlight
                    ? active ? 'rgba(82, 115, 77, 0.12)' : 'rgba(82, 115, 77, 0.07)'
                    : active ? 'var(--soft-sage-light)' : 'transparent',
                  border: item.isHub
                    ? '1px solid transparent'
                    : item.highlight
                    ? `1px solid ${active ? 'rgba(82, 115, 77, 0.3)' : 'rgba(82, 115, 77, 0.18)'}`
                    : active ? '1px solid rgba(52, 78, 65, 0.18)' : '1px solid transparent',
                  padding: item.isHub ? '7px 15px' : item.highlight ? '7px 13px' : '7px 11px',
                  borderRadius: item.isHub ? '22px' : '8px',
                  fontSize: '0.84rem',
                  fontWeight: item.isHub ? 700 : active ? 700 : 500,
                  color: item.isHub
                    ? '#FFFFFF'
                    : item.highlight
                    ? 'var(--botanical)'
                    : active ? 'var(--forest-dark)' : 'var(--muted-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: item.isHub ? '0 3px 12px rgba(52, 78, 65, 0.25)' : 'none',
                  position: 'relative'
                }}
              >
                {item.icon && (
                  <item.icon
                    size={14}
                    color={
                      item.isHub ? '#FFFFFF'
                      : item.highlight ? 'var(--botanical)'
                      : active ? 'var(--forest)' : 'currentColor'
                    }
                    strokeWidth={item.highlight ? 2.4 : 2}
                  />
                )}
                {item.label}
                {active && !item.isHub && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '3px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--botanical)'
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

          {/* Notification Bell */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                aria-label="View notifications"
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
                  transition: 'all 0.15s ease',
                  boxShadow: showNotifs ? '0 2px 8px rgba(52, 78, 65, 0.12)' : 'none'
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
          )}

          {/* Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Avatar + Name */}
              <div
                onClick={() => {
                  if (user.role === 'admin' && adminVerified) onNavigate('admin');
                  else if (user.role === 'librarian') onNavigate('librarian');
                  else onNavigate('dashboard');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '5px 10px 5px 5px',
                  borderRadius: '10px',
                  border: '1px solid var(--subtle-border)',
                  backgroundColor: '#FFFFFF',
                  transition: 'all 0.15s ease'
                }}
                title={`Open My ${user.role === 'admin' && adminVerified ? 'Admin Portal' : user.role === 'librarian' ? 'Librarian Desk' : 'Student Hub'}`}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: user.role === 'admin' && adminVerified
                      ? 'linear-gradient(135deg, #C5221F 0%, #E53935 100%)'
                      : user.role === 'librarian'
                      ? 'linear-gradient(135deg, var(--forest) 0%, var(--botanical) 100%)'
                      : 'linear-gradient(135deg, var(--botanical) 0%, var(--sage) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {userInitial}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: (user.role === 'admin' && adminVerified) ? '#C5221F'
                        : user.role === 'librarian' ? 'var(--forest)'
                        : 'var(--muted-text)',
                      fontWeight: 700,
                      textTransform: 'capitalize'
                    }}
                  >
                    {user.role === 'admin' && !adminVerified ? 'Member' : user.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Sign Out"
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
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '7px' }}>
              <button
                onClick={() => onNavigate('login')}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '8px', fontSize: '0.82rem' }}
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="btn btn-primary btn-sm"
                style={{
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
                  boxShadow: '0 3px 10px rgba(52, 78, 65, 0.22)',
                  border: 'none'
                }}
              >
                Register Free
              </button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid var(--subtle-border)',
              backgroundColor: mobileOpen ? 'var(--soft-sage-light)' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {mobileOpen ? <X size={18} color="var(--forest)" /> : <Menu size={18} color="var(--forest)" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--subtle-border)',
            padding: '12px 0 16px',
            boxShadow: '0 8px 24px rgba(52, 78, 65, 0.12)'
          }}
        >
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => { item.action(); setMobileOpen(false); }}
                  style={{
                    background: item.isHub
                      ? 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)'
                      : active ? 'var(--soft-sage-light)' : 'transparent',
                    border: item.isHub ? 'none' : active ? '1px solid rgba(52, 78, 65, 0.15)' : 'none',
                    padding: '10px 14px',
                    borderRadius: '9px',
                    fontSize: '0.9rem',
                    fontWeight: item.isHub || active ? 700 : 500,
                    color: item.isHub ? '#FFFFFF' : active ? 'var(--forest-dark)' : 'var(--muted-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {item.icon && <item.icon size={16} color={item.isHub ? '#FFFFFF' : active ? 'var(--forest)' : 'currentColor'} />}
                  {item.label}
                </button>
              );
            })}

            <div style={{ borderTop: '1px solid var(--subtle-border)', marginTop: '8px', paddingTop: '10px' }}>
              {user ? (
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none', border: '1px solid rgba(197, 34, 31, 0.2)',
                    color: '#C5221F', padding: '10px 14px', borderRadius: '9px',
                    fontSize: '0.88rem', fontWeight: 600, display: 'flex',
                    alignItems: 'center', gap: '8px', cursor: 'pointer', width: '100%'
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { onNavigate('login'); setMobileOpen(false); }} className="btn btn-outline btn-sm" style={{ flex: 1 }}>Sign In</button>
                  <button onClick={() => { onNavigate('register'); setMobileOpen(false); }} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Register</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
