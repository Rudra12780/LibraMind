import React from 'react';
import { GraduationCap, BookMarked, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Canonical demo credentials.
 * These match the accounts guaranteed by the backend (and created by db/seed.js).
 */
export const DEMO_ACCOUNTS = {
  student: {
    role: 'student',
    label: 'Student',
    person: 'Aarav Sharma',
    email: 'student@libramind.edu',
    password: 'Student@123',
    membership: 'STU-1001',
    icon: GraduationCap,
    accent: '#2C4C3B'
  },
  librarian: {
    role: 'librarian',
    label: 'Librarian',
    person: 'Marcus Thorne',
    email: 'librarian@libramind.edu',
    password: 'Librarian@123',
    membership: 'LIB-5001',
    icon: BookMarked,
    accent: '#8C5A1E'
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    person: 'Dr. Eleanor Vance',
    email: 'admin@libramind.edu',
    password: 'Admin@123',
    membership: 'ADM-9001',
    icon: ShieldCheck,
    accent: '#7A1F1A'
  }
};

/**
 * One-click demo sign-in panel. Renders role cards with the exact
 * credentials plus a button that signs in immediately.
 *
 * Props:
 *  - roles: array of role keys to show (default: all three)
 *  - onLogin(roleKey): async handler that performs the sign-in
 *  - onFill(roleKey): optional alternative handler (fills the form only)
 *  - loadingRole: role key currently signing in
 *  - title / subtitle: panel copy
 *  - dense: tighter layout for small cards
 */
export default function DemoAccounts({
  roles = ['student', 'librarian', 'admin'],
  onLogin,
  onFill,
  loadingRole = '',
  title = 'Demo Accounts',
  subtitle = 'One-click sign in with a ready-made profile.',
  dense = false,
  style = {}
}) {
  const accounts = roles.map((key) => DEMO_ACCOUNTS[key]).filter(Boolean);
  if (accounts.length === 0) return null;

  const busy = Boolean(loadingRole);

  const handleUse = (roleKey) => {
    if (busy) return;
    if (onLogin) onLogin(roleKey);
    else if (onFill) onFill(roleKey);
  };

  return (
    <section
      aria-label="Demo accounts"
      style={{
        marginTop: dense ? '12px' : '16px',
        padding: dense ? '10px 11px' : '12px 13px',
        border: '1px dashed var(--editorial-border)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'rgba(255, 248, 233, 0.66)',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: dense ? '7px' : '9px' }}>
        <Sparkles size={13} color="var(--editorial-accent)" />
        <strong
          style={{
            fontSize: dense ? '0.70rem' : '0.74rem',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'var(--editorial-accent)'
          }}
        >
          {title}
        </strong>
      </div>
      {subtitle ? (
        <p
          style={{
            margin: '0 0 8px',
            fontSize: dense ? '0.70rem' : '0.74rem',
            color: 'var(--editorial-text-muted)',
            lineHeight: 1.35
          }}
        >
          {subtitle}
        </p>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: dense ? '6px' : '7px' }}>
        {accounts.map((account) => {
          const Icon = account.icon;
          const isThisLoading = loadingRole === account.role;
          return (
            <button
              key={account.role}
              type="button"
              onClick={() => handleUse(account.role)}
              disabled={busy}
              title={`Sign in as ${account.person} (${account.email})`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                width: '100%',
                padding: dense ? '6px 8px' : '7px 9px',
                textAlign: 'left',
                background: '#FFF8E9',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: busy ? 'wait' : 'pointer',
                opacity: busy && !isThisLoading ? 0.55 : 1,
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (busy) return;
                e.currentTarget.style.borderColor = account.accent;
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 40, 32, 0.10)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--editorial-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: dense ? '24px' : '27px',
                  height: dense ? '24px' : '27px',
                  flexShrink: 0,
                  borderRadius: '7px',
                  backgroundColor: `${account.accent}14`,
                  color: account.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={dense ? 13 : 14} strokeWidth={2.3} />
              </span>

              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '5px',
                    flexWrap: 'wrap',
                    lineHeight: 1.2
                  }}
                >
                  <strong style={{ fontSize: dense ? '0.74rem' : '0.78rem', color: 'var(--editorial-text)' }}>
                    {account.label}
                  </strong>
                  <span style={{ fontSize: dense ? '0.64rem' : '0.68rem', color: 'var(--editorial-text-muted)' }}>
                    {account.person} · {account.membership}
                  </span>
                </span>
                <span
                  style={{
                    display: 'block',
                    marginTop: '2px',
                    fontSize: dense ? '0.66rem' : '0.70rem',
                    color: 'var(--editorial-text-muted)',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {account.email} / {account.password}
                </span>
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  flexShrink: 0,
                  fontSize: dense ? '0.66rem' : '0.70rem',
                  fontWeight: 700,
                  color: account.accent
                }}
              >
                {isThisLoading ? 'Signing in…' : 'Sign in'}
                {!isThisLoading && <ArrowRight size={dense ? 11 : 12} />}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
