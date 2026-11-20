import React, { useEffect, useRef } from 'react';
import {
  User,
  BookOpen,
  Bookmark,
  Clock,
  Heart,
  Bell,
  LogOut,
  ShieldCheck,
  BarChart3,
  FileText,
  HelpCircle,
  Sparkles,
  ChevronRight,
  X,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function ProfileDropdown({ user, onClose, onNavigate, onLogout }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!user) return null;

  const userInitial = user.name?.charAt(0)?.toUpperCase() || 'U';

  const getRoleBadge = () => {
    if (user.role === 'admin') {
      return {
        label: 'System Administrator',
        sub: user.membership_id || 'ADM-9001',
        bg: '#FDF2E9',
        border: 'rgba(155, 101, 72, 0.4)',
        color: 'var(--editorial-accent)'
      };
    }
    if (user.role === 'librarian') {
      return {
        label: 'Chief Librarian',
        sub: user.membership_id || 'LIB-5001',
        bg: 'var(--editorial-green-light)',
        border: 'rgba(38, 61, 50, 0.3)',
        color: 'var(--editorial-green)'
      };
    }
    return {
      label: 'Scholar Member',
      sub: user.membership_id || 'STU-1001',
      bg: 'var(--editorial-bg-subtle)',
      border: 'var(--editorial-border)',
      color: 'var(--editorial-text)'
    };
  };

  const roleBadge = getRoleBadge();

  const handleItemClick = (page, params = {}) => {
    onClose();
    if (onNavigate) {
      onNavigate(page, params);
    }
  };

  const handleSignOut = async () => {
    onClose();
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="profile-dropdown-container animate-fade-in"
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        width: 'min(320px, calc(100vw - 20px))',
        maxWidth: 'calc(100vw - 20px)',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--editorial-border)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 1100,
        boxSizing: 'border-box',
        overflow: 'hidden',
        textAlign: 'left'
      }}
    >
      {/* ── Editorial Header Ribbon ── */}
      <div
        style={{
          height: '4px',
          background: 'linear-gradient(90deg, var(--editorial-green) 0%, var(--editorial-border) 50%, var(--editorial-accent) 100%)'
        }}
      />

      {/* ── User Identity Banner ── */}
      <div
        style={{
          padding: '16px 18px 14px',
          backgroundColor: 'var(--editorial-bg-subtle)',
          borderBottom: '1px solid var(--editorial-border)',
          position: 'relative'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile menu"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--editorial-text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar with Status Pulse */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--editorial-green)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(38, 61, 50, 0.25)'
              }}
            >
              {userInitial}
            </div>
            {/* Online Session Dot */}
            <span
              title="Active Sanctuary Session"
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#2E7D32',
                border: '2px solid #FFFFFF'
              }}
            />
          </div>

          <div style={{ minWidth: 0, flex: 1, paddingRight: '18px' }}>
            <h4
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: '1.02rem',
                fontWeight: 700,
                color: 'var(--editorial-text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user.name}
            </h4>
            <p
              style={{
                margin: '2px 0 6px',
                fontSize: '0.76rem',
                color: 'var(--editorial-text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user.email}
            </p>

            {/* Role & Folio Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                backgroundColor: roleBadge.bg,
                border: `1px solid ${roleBadge.border}`,
                borderRadius: '2px',
                fontSize: '0.66rem',
                fontWeight: 700,
                color: roleBadge.color,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <span>{roleBadge.label}</span>
              <span style={{ opacity: 0.6 }}>·</span>
              <span>{roleBadge.sub}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Menu Options ── */}
      <div
        style={{
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
          padding: '8px 0'
        }}
      >
        {/* Hub / Main Dashboard Action */}
        <button
          type="button"
          onClick={() => handleItemClick(user.role === 'admin' ? 'admin' : user.role === 'librarian' ? 'librarian' : 'dashboard')}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text)',
            fontSize: '0.86rem',
            fontWeight: 600,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={16} color="var(--editorial-green)" />
            <span>
              {user.role === 'admin' ? 'Administrator Console' : user.role === 'librarian' ? 'Librarian Desk' : 'Personal Reading Hub'}
            </span>
          </div>
          <ChevronRight size={14} color="var(--editorial-border-dark)" />
        </button>

        {/* Edit Profile & Interests */}
        <button
          type="button"
          onClick={() => handleItemClick('complete-profile')}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text)',
            fontSize: '0.86rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={16} color="var(--editorial-accent)" />
            <span>Profile &amp; Literary Interests</span>
          </div>
          <ChevronRight size={14} color="var(--editorial-border-dark)" />
        </button>

        {/* Active Loans */}
        <button
          type="button"
          onClick={() => handleItemClick('dashboard', { tab: 'loans' })}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text)',
            fontSize: '0.86rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bookmark size={16} color="var(--editorial-text-muted)" />
            <span>Borrowed Books &amp; Loans</span>
          </div>
          <ChevronRight size={14} color="var(--editorial-border-dark)" />
        </button>

        {/* Hold Queues & Reservations */}
        <button
          type="button"
          onClick={() => handleItemClick('reservations')}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text)',
            fontSize: '0.86rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={16} color="var(--editorial-text-muted)" />
            <span>Hold Queues &amp; Reservations</span>
          </div>
          <ChevronRight size={14} color="var(--editorial-border-dark)" />
        </button>

        {/* Study Pods */}
        <button
          type="button"
          onClick={() => handleItemClick('seats')}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text)',
            fontSize: '0.86rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={16} color="var(--editorial-accent)" />
            <span>Study Pod Reservations</span>
          </div>
          <ChevronRight size={14} color="var(--editorial-border-dark)" />
        </button>

        {/* Reading Wishlist */}
        <button
          type="button"
          onClick={() => handleItemClick('dashboard', { tab: 'wishlist' })}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text)',
            fontSize: '0.86rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={16} color="var(--editorial-accent)" />
            <span>Curated Reading Wishlist</span>
          </div>
          <ChevronRight size={14} color="var(--editorial-border-dark)" />
        </button>

        {/* Notifications Center */}
        <button
          type="button"
          onClick={() => handleItemClick('notifications')}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text)',
            fontSize: '0.86rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={16} color="var(--editorial-text-muted)" />
            <span>Patron Notice Center</span>
          </div>
          <ChevronRight size={14} color="var(--editorial-border-dark)" />
        </button>

        {/* ── Admin / Staff Dedicated Links (If applicable) ── */}
        {user.role === 'admin' && (
          <>
            <div style={{ height: '1px', backgroundColor: 'var(--editorial-border)', margin: '6px 14px' }} />
            <div style={{ padding: '4px 18px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Administration &amp; Analytics
            </div>
            <button
              type="button"
              onClick={() => handleItemClick('admin')}
              className="profile-menu-item"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--editorial-text)',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={16} color="var(--editorial-accent)" />
                <span>Admin Console</span>
              </div>
              <ChevronRight size={14} color="var(--editorial-border-dark)" />
            </button>
            <button
              type="button"
              onClick={() => handleItemClick('analytics')}
              className="profile-menu-item"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--editorial-text)',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={16} color="var(--editorial-green)" />
                <span>30-Metric Analytics Suite</span>
              </div>
              <ChevronRight size={14} color="var(--editorial-border-dark)" />
            </button>
          </>
        )}

        {user.role === 'librarian' && (
          <>
            <div style={{ height: '1px', backgroundColor: 'var(--editorial-border)', margin: '6px 14px' }} />
            <div style={{ padding: '4px 18px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--editorial-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Circulation Desk Tools
            </div>
            <button
              type="button"
              onClick={() => handleItemClick('librarian', { tab: 'issue' })}
              className="profile-menu-item"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--editorial-text)',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={16} color="var(--editorial-green)" />
                <span>Issue &amp; Return Console</span>
              </div>
              <ChevronRight size={14} color="var(--editorial-border-dark)" />
            </button>
            <button
              type="button"
              onClick={() => handleItemClick('librarian', { tab: 'inventory' })}
              className="profile-menu-item"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--editorial-text)',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={16} color="var(--editorial-accent)" />
                <span>Catalog &amp; Physical Stacks</span>
              </div>
              <ChevronRight size={14} color="var(--editorial-border-dark)" />
            </button>
          </>
        )}

        {/* ── Policy & Help Links ── */}
        <div style={{ height: '1px', backgroundColor: 'var(--editorial-border)', margin: '6px 14px' }} />

        <button
          type="button"
          onClick={() => handleItemClick('terms')}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text-muted)',
            fontSize: '0.82rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={15} color="var(--editorial-border-dark)" />
            <span>Borrowing Rules &amp; Sanctuary Policies</span>
          </div>
          <ChevronRight size={13} color="var(--editorial-border-dark)" />
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('contact')}
          className="profile-menu-item"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--editorial-text-muted)',
            fontSize: '0.82rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={15} color="var(--editorial-border-dark)" />
            <span>Circulation Desk Help &amp; Inquiries</span>
          </div>
          <ChevronRight size={13} color="var(--editorial-border-dark)" />
        </button>
      </div>

      {/* ── Sign Out Action ── */}
      <div
        style={{
          borderTop: '1px solid var(--editorial-border)',
          padding: '10px 14px',
          backgroundColor: 'var(--editorial-bg)'
        }}
      >
        <button
          type="button"
          onClick={handleSignOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '9px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(140, 34, 34, 0.3)',
            backgroundColor: '#FFFFFF',
            color: '#8C2222',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#8C2222';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = '#8C2222';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.color = '#8C2222';
            e.currentTarget.style.borderColor = 'rgba(140, 34, 34, 0.3)';
          }}
        >
          <LogOut size={15} />
          <span>Sign Out of LibraMind</span>
        </button>
      </div>
    </div>
  );
}
