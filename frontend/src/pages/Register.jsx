import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, AlertCircle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('Classic Literature, Philosophy, Creative Writing');
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
        minHeight: '80vh',
        backgroundColor: 'var(--editorial-bg)'
      }}
    >
      <div
        className="bio-card"
        style={{
          width: '520px',
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

        <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '4px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--editorial-green), var(--editorial-border))',
              boxShadow: '0 8px 20px rgba(96, 108, 56, 0.25)',
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
            🌿 Free Sanctuary Enrollment
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
            Join LibraMind
          </h2>
          <p style={{ fontSize: '0.90rem', color: 'var(--muted-text)', margin: 0, fontWeight: 500 }}>
            Create your member sanctuary card to borrow physical copies, reserve study pods, and receive curated reading recommendations.
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

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">
              Academic Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="maya@libramind.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">
              Password (min 6 characters)
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label">
              Reading & Research Interests
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Poetry, Artificial Intelligence, Philosophy..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
            <span style={{ fontSize: '0.76rem', color: 'var(--muted-text)', display: 'block', marginTop: '5px' }}>
              Used by our AI sanctuary assistant to curate personalized reading recommendations.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '13px', fontSize: '0.96rem' }}
          >
            {loading ? 'Issuing Member Card...' : 'Complete Registration →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', color: 'var(--muted-text)', fontWeight: 500 }}>
          Already have a sanctuary card?{' '}
          <button
            onClick={() => onNavigate('login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--editorial-accent)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Sign In here →
          </button>
        </div>
      </div>
    </div>
  );
}
