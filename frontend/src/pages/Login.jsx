import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Shield, User, Key, AlertCircle, Sparkles } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.user.role === 'admin') onNavigate('admin');
      else if (res.user.role === 'librarian') onNavigate('librarian');
      else onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass, targetRoute) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      onNavigate(targetRoute);
    } catch (err) {
      setError(err.message);
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
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: 'var(--forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}
          >
            <BookOpen size={24} color="#FAF8F1" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--forest-dark)', marginBottom: '4px' }}>
            Welcome to LibraMind
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
            Sign in to access your loans, study pods, and personalized catalog.
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
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@libramind.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        {/* 1-Click Quick Demo Logins */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--subtle-border)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--forest-dark)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            ⚡ 1-Click Demo Profiles:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('student@libramind.edu', 'Student@123', 'dashboard')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.76rem', padding: '8px 4px', flexDirection: 'column', gap: '2px' }}
            >
              <strong>Student</strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--muted-text)' }}>Aarav</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('librarian@libramind.edu', 'Librarian@123', 'librarian')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.76rem', padding: '8px 4px', flexDirection: 'column', gap: '2px' }}
            >
              <strong>Librarian</strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--muted-text)' }}>Marcus</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin@libramind.edu', 'Admin@123', 'admin')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.76rem', padding: '8px 4px', flexDirection: 'column', gap: '2px' }}
            >
              <strong>Admin</strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--muted-text)' }}>Dr. Vance</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.86rem', color: 'var(--muted-text)' }}>
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
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
