import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Shield, User, Key, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { user, login, adminVerified } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'admin' && adminVerified) onNavigate('admin');
      else if (user.role === 'librarian') onNavigate('librarian');
      else onNavigate('dashboard');
    }
  }, [user, adminVerified, onNavigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // User login portal always signs in as regular user mode (adminPortal = false)
      const res = await login(email, password, false);
      if (res.user.role === 'librarian') onNavigate('librarian');
      else onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass, targetRole) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      // Regular user portal signs in for regular website usage
      const res = await login(demoEmail, demoPass, false);
      if (res.user.role === 'librarian') onNavigate('librarian');
      else onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '60px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh'
      }}
    >
      <div
        className="bio-card"
        style={{
          width: '460px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: '36px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'var(--forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 14px rgba(52, 78, 65, 0.25)'
            }}
          >
            <BookOpen size={26} color="#FAF8F1" />
          </div>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--soft-sage-light)',
              color: 'var(--forest-dark)',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '3px 10px',
              borderRadius: '12px',
              marginBottom: '8px'
            }}
          >
            Student & Member Portal
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--forest-dark)', marginBottom: '4px' }}>
            Member Sign In
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
            Sign in to access your borrowed books, study pods, and personalized catalog.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email, Username, or Membership ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. librarian@libramind.edu, librarian, or LIB-5001"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Quick Demo Login for All 3 Roles */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--subtle-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--forest-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ⚡ 1-Click Demo Accounts:
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--sage)', fontWeight: 600 }}>
              Auto-login
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 1. Student Demo */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin('student@libramind.edu', 'Student@123', 'dashboard')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.82rem', padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--cream)', border: '1px solid var(--subtle-border)' }}
            >
              <span><strong>Student:</strong> Aarav Sharma (STU-1001)</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--botanical)', fontWeight: 700 }}>Enter Hub →</span>
            </button>

            {/* 2. Librarian Demo */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin('librarian@libramind.edu', 'Librarian@123', 'librarian')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.82rem', padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--soft-sage-light)', border: '1px solid rgba(82, 115, 77, 0.25)' }}
            >
              <span><strong>Librarian:</strong> Marcus Thorne (LIB-5001)</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--forest)', fontWeight: 700 }}>Enter Desk →</span>
            </button>

            {/* 3. Administrator Demo */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin('admin@libramind.edu', 'Admin@123', 'admin')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.82rem', padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FCE8E6', border: '1px solid rgba(197, 34, 31, 0.2)', color: '#A51D24' }}
            >
              <span><strong>Admin Account:</strong> Dr. Eleanor Vance (ADM-9001)</span>
              <span style={{ fontSize: '0.74rem', color: '#C5221F', fontWeight: 700 }}>Use as Member →</span>
            </button>
          </div>
        </div>

        {/* Links to Separate Portals */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--subtle-border)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--muted-text)', textAlign: 'center', marginBottom: '10px' }}>
            Looking for Staff or Governance portals?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => onNavigate('librarian')}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '0.78rem',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderColor: 'var(--subtle-border)'
              }}
            >
              <span>Librarian Portal →</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '0.78rem',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderColor: 'rgba(197, 34, 31, 0.25)',
                color: '#C5221F'
              }}
            >
              <span>Admin Portal →</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.84rem', color: 'var(--muted-text)' }}>
          Don't have a library membership card?{' '}
          <button
            onClick={() => onNavigate('register')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--botanical)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Register for Free
          </button>
        </div>
      </div>
    </div>
  );
}
