import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Shield, User, Key, AlertCircle, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { user, login, loginWithGithub, adminVerified } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // GitHub Modal State
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubUsername, setGithubUsername] = useState('dev-reader');
  const [githubName, setGithubName] = useState('Library Scholar');
  const [githubEmail, setGithubEmail] = useState('dev.reader@github.com');
  const [githubLoading, setGithubLoading] = useState(false);

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
      const res = await login(demoEmail, demoPass, false);
      if (res.user.role === 'librarian') onNavigate('librarian');
      else onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setGithubLoading(true);
    try {
      const res = await loginWithGithub({
        githubUsername: githubUsername.trim() || 'github-reader',
        name: githubName.trim() || githubUsername.trim(),
        email: githubEmail.trim() || `${githubUsername.trim()}@users.noreply.github.com`
      }, 'student');
      setShowGithubModal(false);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'GitHub authentication failed');
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '60px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        backgroundColor: 'var(--editorial-bg)'
      }}
    >
      <div
        className="bio-card"
        style={{
          width: '500px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: '40px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Top Maximalist Organic Accent Ribbon */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            borderTopLeftRadius: 'var(--radius-sm)',
            borderTopRightRadius: 'var(--radius-sm)',
            background: 'linear-gradient(90deg, var(--editorial-accent) 0%, var(--editorial-border) 50%, var(--editorial-green) 100%)'
          }}
        />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '4px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--editorial-accent), var(--editorial-border))',
              boxShadow: '0 8px 20px rgba(192, 108, 78, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <BookOpen size={28} color="#FFFFFF" strokeWidth={2.2} />
          </div>

          <div
            className="pill-badge"
            style={{
              marginBottom: '10px'
            }}
          >
            ☀️ Member & Student Sanctuary
          </div>

          <h2
            style={{
              fontSize: '2rem',
              color: 'var(--editorial-text)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              marginBottom: '6px'
            }}
          >
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.90rem', color: 'var(--muted-text)', margin: 0, fontWeight: 500 }}>
            Sign in to access your borrowed books, serene study pods, and personalized literary recommendations.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(150, 49, 36, 0.2)',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with GitHub Option */}
        <button
          type="button"
          onClick={() => setShowGithubModal(true)}
          style={{
            width: '100%',
            padding: '12px 18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#24292F',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(36, 41, 47, 0.2)',
            transition: 'all 0.2s ease',
            marginBottom: '20px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1F2328';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#24292F';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>Continue with GitHub</span>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '14px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--editorial-border)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            or with membership card
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--editorial-border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">
              Email, Username, or Membership ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. reader@libramind.edu or STU-1001"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--editorial-accent)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>
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
            style={{ width: '100%', padding: '13px', fontSize: '0.96rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Sanctuary →'}
          </button>
        </form>

        {/* 1-Click Quick Demo Login for All 3 Roles */}
        <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid var(--editorial-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--editorial-text)', letterSpacing: '0.02em' }}>
              🌿 1-Click Instant Demo Accounts:
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--editorial-accent)', fontWeight: 600 }}>
              Auto Sign-In
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 1. Student Demo */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin('student@libramind.edu', 'Student@123', 'dashboard')}
              style={{
                width: '100%',
                fontSize: '0.84rem',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--editorial-bg-subtle)',
                color: 'var(--editorial-text)',
                border: '1px solid rgba(221, 161, 94, 0.4)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              <span>Student: <strong>Aarav Sharma</strong> (STU-1001)</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--editorial-accent)', fontWeight: 700 }}>Enter Hub →</span>
            </button>

            {/* 2. Librarian Demo */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin('librarian@libramind.edu', 'Librarian@123', 'librarian')}
              style={{
                width: '100%',
                fontSize: '0.84rem',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--editorial-bg)',
                color: 'var(--editorial-text)',
                border: '1px solid rgba(96, 108, 56, 0.3)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              <span>Librarian: <strong>Marcus Thorne</strong> (LIB-5001)</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--editorial-green)', fontWeight: 700 }}>Staff Desk →</span>
            </button>

            {/* 3. Administrator Demo */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin('admin@libramind.edu', 'Admin@123', 'admin')}
              style={{
                width: '100%',
                fontSize: '0.84rem',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--editorial-bg-subtle)',
                color: 'var(--editorial-text)',
                border: '1px solid var(--editorial-border)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              <span>Admin: <strong>Dr. Eleanor Vance</strong> (ADM-9001)</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--editorial-accent)', fontWeight: 700 }}>Member View →</span>
            </button>
          </div>
        </div>

        {/* Links to Separate Portals */}
        <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid var(--editorial-border)' }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)', fontWeight: 600, textAlign: 'center', marginBottom: '10px' }}>
            Staff & Institutional Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => onNavigate('librarian')}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '0.78rem',
                padding: '9px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Librarian Desk →</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '0.78rem',
                padding: '9px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderColor: 'rgba(192, 108, 78, 0.4)',
                color: 'var(--editorial-accent)'
              }}
            >
              <span>Admin Console →</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.86rem', color: 'var(--muted-text)', fontWeight: 500 }}>
          Don't have a library sanctuary card?{' '}
          <button
            onClick={() => onNavigate('register')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--editorial-accent)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Register for Free →
          </button>
        </div>
      </div>

      {/* Maximalist GitHub SSO Modal */}
      {showGithubModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(43, 33, 24, 0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowGithubModal(false)}
        >
          <div
            className="bio-card"
            style={{
              width: '460px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '32px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowGithubModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: 'var(--muted-text)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {/* Connection Visual */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#24292F',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(36, 41, 47, 0.25)'
                }}
              >
                <svg height="28" width="28" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--editorial-border)' }}>
                <span style={{ fontSize: '1.2rem' }}>🌿</span>
                <span style={{ height: '2px', width: '30px', backgroundColor: 'var(--editorial-border)' }} />
                <span style={{ fontSize: '1.2rem' }}>☀️</span>
              </div>

              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--editorial-accent), var(--editorial-border))',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(192, 108, 78, 0.25)'
                }}
              >
                <BookOpen size={24} />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', margin: '0 0 6px', color: 'var(--editorial-text)' }}>
                Authorize with GitHub
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
                Link your GitHub account to sign in or auto-provision your LibraMind Member Card.
              </p>
            </div>

            <form onSubmit={handleGithubAuth}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '0.80rem' }}>
                  GitHub Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--muted-text)', fontWeight: 600 }}>@</span>
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '28px' }}
                    placeholder="your-username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '0.80rem' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Maya Lin"
                  value={githubName}
                  onChange={(e) => setGithubName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontSize: '0.80rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="your.email@github.com"
                  value={githubEmail}
                  onChange={(e) => setGithubEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={githubLoading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }}
              >
                {githubLoading ? 'Connecting to GitHub...' : 'Authorize & Sign In →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowGithubModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted-text)', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
