import React, { useState } from 'react';
import { BookOpen, Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { api } from '../api';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please provide your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address (e.g. reader@libramind.edu).');
      return;
    }

    setLoading(true);

    try {
      const res = await api.forgotPassword(trimmed);
      setFeedbackMessage(
        res.message ||
          'If an account with that email address exists in LibraMind, a secure password reset link has been dispatched. Please check your inbox and spam folder.'
      );
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to submit password reset request. Please check your network or try again.');
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
          width: '480px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: '40px',
          borderRadius: 'var(--radius-xl)',
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
            borderTopLeftRadius: 'var(--radius-xl)',
            borderTopRightRadius: 'var(--radius-xl)',
            background: 'linear-gradient(90deg, var(--editorial-border) 0%, var(--editorial-accent) 50%, var(--editorial-green) 100%)'
          }}
        />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '4px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--editorial-border), var(--editorial-accent))',
              boxShadow: '0 8px 20px rgba(221, 161, 94, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <KeyRound size={28} color="#FFFFFF" strokeWidth={2.2} />
          </div>

          <div
            className="pill-badge"
            style={{
              marginBottom: '10px'
            }}
          >
            <ShieldCheck size={13} />
            Security & Recovery
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
            Forgot Password?
          </h2>
          <p style={{ fontSize: '0.90rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
            Enter your registered email address and we will dispatch a single-use password reset link.
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
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div>
            <div
              style={{
                padding: '24px',
                backgroundColor: 'var(--editorial-bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(221, 161, 94, 0.4)',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--editorial-green)',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px'
                }}
              >
                <CheckCircle2 size={26} strokeWidth={2.2} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', marginBottom: '8px', fontWeight: 700 }}>
                Reset Instructions Dispatched
              </h4>
              <p style={{ fontSize: '0.90rem', color: 'var(--editorial-text)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                {feedbackMessage}
              </p>
              <div
                style={{
                  marginTop: '16px',
                  padding: '8px 14px',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.78rem',
                  color: 'var(--muted-text)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--editorial-border)',
                  fontWeight: 600
                }}
              >
                Token expires in 30 minutes • Single-use only
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="btn btn-outline"
                style={{ width: '100%', padding: '12px', fontSize: '0.90rem' }}
              >
                Send to a different email
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.90rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. reader@libramind.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={{ paddingLeft: '42px' }}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-text)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted-text)', marginTop: '5px', display: 'block' }}>
                Verified against registered students, staff, and administrators.
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '0.96rem' }}
            >
              {loading ? 'Generating Link...' : 'Send Reset Link →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '22px' }}>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--editorial-accent)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={15} />
                Return to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
