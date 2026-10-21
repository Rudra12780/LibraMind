import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import {
  BookOpen,
  Sparkles,
  Armchair,
  Search,
  BarChart3,
  Bell,
  User,
  LogOut,
  Shield,
  BookMarked,
  Menu,
  X,
  GitCompare,
  Compass
} from 'lucide-react';

export default function Navbar({ activePage, onNavigate, compareCount = 0 }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'admin') return { id: 'admin', label: 'Admin Suite', icon: Shield };
    if (user.role === 'librarian') return { id: 'librarian', label: 'Librarian Desk', icon: BookMarked };
    return { id: 'dashboard', label: 'Student Hub', icon: BookOpen };
  };

  const dashLink = getDashboardLink();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Catalog' },
    { id: 'ai-finder', label: 'AI Finder', icon: Sparkles },
    { id: 'compare', label: `Compare${compareCount > 0 ? ` (${compareCount})` : ''}`, icon: GitCompare },
    { id: 'visit-planner', label: 'Visit Planner', icon: Compass },
    { id: 'seats', label: 'Study Seats' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--subtle-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="container"
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
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
              boxShadow: '0 4px 10px rgba(52, 78, 65, 0.2)'
            }}
          >
            <BookOpen size={22} color="#FAF8F1" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--forest-dark)',
                  letterSpacing: '-0.02em'
                }}
              >
                LibraMind
              </span>
              <span
                style={{
                  backgroundColor: 'var(--soft-sage)',
                  color: 'var(--forest-dark)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Smart
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--sage)', letterSpacing: '0.03em' }}>
              Biophilic AI Library System
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          className="desktop-nav"
        >
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.92rem',
                fontWeight: activePage === item.id ? 700 : 500,
                color: activePage === item.id ? 'var(--forest)' : 'var(--muted-text)',
                backgroundColor: activePage === item.id ? 'var(--soft-sage-light)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {item.label}
            </button>
          ))}

          {dashLink && (
            <button
              onClick={() => onNavigate(dashLink.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.92rem',
                fontWeight: activePage === dashLink.id ? 700 : 600,
                color: activePage === dashLink.id ? 'var(--forest)' : 'var(--botanical)',
                backgroundColor: activePage === dashLink.id ? 'var(--soft-sage-light)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <dashLink.icon size={16} />
              {dashLink.label}
            </button>
          )}
        </nav>

        {/* Right Action Icons & Auth Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Notification Bell */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                aria-label="View notifications"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1px solid var(--subtle-border)',
                  backgroundColor: showNotifs ? 'var(--soft-sage-light)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Bell size={18} color="var(--forest)" />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
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
          )}

          {/* User Profile / Auth State */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  lineHeight: 1.2
                }}
              >
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--muted-text)',
                    textTransform: 'capitalize'
                  }}
                >
                  {user.role} • {user.membership_id}
                </span>
              </div>

              <button
                onClick={logout}
                title="Log Out"
                aria-label="Log Out"
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
                  color: 'var(--muted-text)'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onNavigate('login')}
                className="btn btn-outline btn-sm"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="btn btn-primary btn-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
