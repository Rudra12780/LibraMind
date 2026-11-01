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
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: 'var(--forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 14px rgba(52, 78, 65, 0.25)'
            }}
          >
            <KeyRound size={26} color="#FAF8F1" />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
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
            <ShieldCheck size={13} />
            LibraMind Security Recovery
          </div>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--forest-dark)', marginBottom: '6px' }}>
            Forgot Your Password?
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
            No problem! Enter the email address linked to your LibraMind membership and we'll dispatch a secure recovery link.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '20px',
              border: '1px solid rgba(197, 34, 31, 0.2)'
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
                padding: '18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(82, 115, 77, 0.08)',
                border: '1px solid rgba(82, 115, 77, 0.25)',
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--botanical)',
                  color: '#FAF8F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--forest-dark)', marginBottom: '8px', fontWeight: 700 }}>
                Reset Instructions Sent
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--charcoal)', lineHeight: 1.55, margin: 0 }}>
                {feedbackMessage}
              </p>
              <div
                style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.78rem',
                  color: 'var(--muted-text)',
                  border: '1px dashed var(--subtle-border)'
                }}
              >
                For security, the reset token will expire in <strong>30 minutes</strong> and can only be used once.
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
                style={{ width: '100%', padding: '11px', fontSize: '0.88rem' }}
              >
                Send to a different email
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '11px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--forest-dark)' }}>
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. aarav@libramind.edu or student@libramind.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-text)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)', marginTop: '4px', display: 'block' }}>
                We'll verify this against registered students, staff, and administrators.
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              {loading ? 'Generating Secure Link...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '22px' }}>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--botanical)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
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

