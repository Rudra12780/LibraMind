import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('Artificial Intelligence, Python, Web Development');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, interests);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          width: '500px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: '36px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
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
            Join LibraMind
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
            Create your student membership card to borrow books, reserve quiet study pods, and receive personalized recommendations.
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Maya Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Academic Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="maya@libramind.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 characters)</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reading & Research Topics (for AI Engine)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Machine Learning, Python, Design..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--sage)', display: 'block', marginTop: '4px' }}>
              Used by our content-based recommendation model to personalize your catalog feed.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
          >
            {loading ? 'Creating Member Record...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.86rem', color: 'var(--muted-text)' }}>
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--botanical)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
}
