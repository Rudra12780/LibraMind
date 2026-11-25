import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, User } from 'lucide-react';

export default function AdminLogin({ onNavigate }) {
  const { user, login, register, adminVerified } = useAuth();
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [adminRegName, setAdminRegName] = useState('');
  const [adminRegEmail, setAdminRegEmail] = useState('');
  const [adminRegPassword, setAdminRegPassword] = useState('');
  const [adminRegConfirmPassword, setAdminRegConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let queryEmail = email.trim();
      if (
        queryEmail.toLowerCase() === 'admin' ||
        queryEmail.toLowerCase() === 'admin@1234' ||
        queryEmail.toLowerCase() === 'admin1234'
      ) {
        queryEmail = 'admin@libramind.edu';
      }
      const res = await login(queryEmail, password, true);
      if (res.user && res.user.role !== 'admin') {
        setError('Access Denied: This account is not an authorized library administrator.');
      } else {
        if (onNavigate) {
          onNavigate('admin', { user: res.user, adminVerified: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (adminRegPassword !== adminRegConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (adminRegPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await register(
        adminRegName.trim(),
        adminRegEmail.trim(),
        adminRegPassword,
        'Library Administration, System Governance, Security',
        '',
        'admin'
      );
      if (res.user && res.user.role === 'admin') {
        if (onNavigate) {
          onNavigate('admin', { user: res.user, adminVerified: true });
        }
      } else {
        setError('Administrator registration succeeded, but role authorization failed.');
      }
    } catch (err) {
      setError(err.message || 'Administrator registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--editorial-bg)'
      }}
    >
      <div
        style={{
          width: '440px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: '36px 32px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Simple, clean header without logos or badges */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              color: 'var(--editorial-text)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              margin: '0 0 6px'
            }}
          >
            {authMode === 'signin' ? 'Admin Sign In' : 'Admin Registration'}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', margin: 0, lineHeight: 1.45 }}>
            {authMode === 'signin'
              ? 'Enter your administrator credentials to access the console.'
              : 'Create a new authorized administrator profile for governance.'}
          </p>
        </div>

        {/* If user is already active admin */}
        {user && user.role === 'admin' && adminVerified && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(44, 76, 59, 0.08)',
              border: '1px solid rgba(44, 76, 59, 0.2)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--editorial-green)' }}>
                Active: {user.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                Verified administrator session
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('admin')}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.76rem', padding: '5px 10px' }}
            >
              Open Console →
            </button>
          </div>
        )}

        {/* Segmented Tab Switcher: Sign In vs Register (Sign Up) */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--editorial-bg)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--editorial-border)',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '0.86rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: authMode === 'signin' ? '#FFFFFF' : 'transparent',
              color: authMode === 'signin' ? 'var(--editorial-green)' : 'var(--editorial-text-muted)',
              boxShadow: authMode === 'signin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '0.86rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: authMode === 'signup' ? '#FFFFFF' : 'transparent',
              color: authMode === 'signup' ? 'var(--editorial-green)' : 'var(--editorial-text-muted)',
              boxShadow: authMode === 'signup' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Register (Sign Up)
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(150, 49, 36, 0.2)',
              fontSize: '0.84rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {authMode === 'signin' ? (
          <>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '6px' }}>
                  Email or Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="admin@libramind.edu or admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: '0.90rem',
                    border: '1px solid var(--editorial-border)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: '0.90rem',
                    border: '1px solid var(--editorial-border)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '5px' }}>
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Dr. Arthur Pendelton"
                value={adminRegName}
                onChange={(e) => setAdminRegName(e.target.value)}
                required
                style={{
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '0.90rem',
                  border: '1px solid var(--editorial-border)'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '5px' }}>
                Administrator Email
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. admin.arthur@libramind.edu"
                value={adminRegEmail}
                onChange={(e) => setAdminRegEmail(e.target.value)}
                autoComplete="email"
                required
                style={{
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '0.90rem',
                  border: '1px solid var(--editorial-border)'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '5px' }}>
                Password (min 6 characters)
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Create administrator password"
                value={adminRegPassword}
                onChange={(e) => setAdminRegPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '0.90rem',
                  border: '1px solid var(--editorial-border)'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '5px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={adminRegConfirmPassword}
                onChange={(e) => setAdminRegConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '0.90rem',
                  border: '1px solid var(--editorial-border)'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '0.92rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {loading ? 'Creating Admin Account...' : 'Create Admin Account →'}
            </button>
          </form>
        )}
      </div>

      {/* Return to Public Home */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--editorial-text-muted)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          ← Back to Library Home
        </button>
      </div>
    </div>
  );
}
