import React, { useState, useEffect } from 'react';
import { BookOpen, KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { api } from '../api';

export default function ResetPassword({ onNavigate }) {
  // Read token from URL query params
  const [token, setToken] = useState('');
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [accountInfo, setAccountInfo] = useState({ maskedEmail: '', userName: '' });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Extract token from location.search or window.location.hash
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (!urlToken) {
      setValidating(false);
      setTokenValid(false);
      setTokenError('No password reset token was detected in the URL. Please use the complete link dispatched to your email.');
      return;
    }

    setToken(urlToken);

    // Verify token with backend
    api.verifyResetToken(urlToken)
      .then((res) => {
        if (res.valid) {
          setTokenValid(true);
          setAccountInfo({
            maskedEmail: res.maskedEmail || '',
            userName: res.userName || 'LibraMind Member'
          });
        } else {
          setTokenValid(false);
          setTokenError(res.error || 'This reset link is invalid or expired.');
        }
      })
      .catch((err) => {
        setTokenValid(false);
        setTokenError(err.message || 'This reset link is invalid, expired, or has already been used.');
      })
      .finally(() => {
        setValidating(false);
      });
  }, []);

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'Empty', color: '#CBD5E1' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, text: 'Weak', color: '#EF4444' };
    if (score <= 4) return { score, text: 'Good', color: '#F59E0B' };
    return { score, text: 'Strong', color: '#10B981' };
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password.length < 6) {
      setFormError('New password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please re-enter both fields.');
      return;
    }

    setSubmitting(true);

    try {
      await api.resetPassword({
        token,
        password,
        confirmPassword
      });
      setSuccess(true);
    } catch (err) {
      setFormError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setSubmitting(false);
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
          width: '480px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: '36px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
            <Lock size={26} color="#FAF8F1" />
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
            Secure Account Recovery
          </div>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--forest-dark)', marginBottom: '6px' }}>
            Reset Your Password
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
            Create a strong, new password for your LibraMind sanctuary account.
          </p>
        </div>

        {validating ? (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid var(--soft-sage-light)',
                borderTopColor: 'var(--botanical)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}
            />
            <p style={{ color: 'var(--muted-text)', fontSize: '0.88rem', margin: 0 }}>
              Verifying cryptographic security token...
            </p>
          </div>
        ) : !tokenValid ? (
          <div>
            <div
              style={{
                padding: '20px',
                borderRadius: '14px',
                backgroundColor: 'var(--status-danger-bg)',
                border: '1px solid rgba(197, 34, 31, 0.25)',
                color: 'var(--status-danger-text)',
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              <ShieldAlert size={36} style={{ margin: '0 auto 10px', display: 'block', color: 'var(--accent-crimson)' }} />
              <h4 style={{ fontSize: '1.05rem', margin: '0 0 8px', fontWeight: 700 }}>
                Invalid or Expired Link
              </h4>
              <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                {tokenError}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.90rem' }}
              >
                Request a New Reset Link
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="btn btn-outline"
                style={{ width: '100%', padding: '11px', fontSize: '0.88rem' }}
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : success ? (
          <div>
            <div
              style={{
                padding: '24px 20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(82, 115, 77, 0.08)',
                border: '1px solid rgba(82, 115, 77, 0.25)',
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--botanical)',
                  color: '#FAF8F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px'
                }}
              >
                <CheckCircle2 size={28} />
              </div>

              <h4 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', marginBottom: '8px', fontWeight: 700 }}>
                Password Updated!
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--charcoal)', lineHeight: 1.55, margin: 0 }}>
                Your LibraMind account password has been safely updated. All previous reset tokens have been invalidated.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Sign In With New Password →
            </button>
          </div>
        ) : (
          <div>
            {accountInfo.maskedEmail && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--cream)',
                  border: '1px solid var(--subtle-border)',
                  fontSize: '0.82rem',
                  color: 'var(--forest-dark)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '18px'
                }}
              >
                <span>Resetting for: <strong>{accountInfo.userName}</strong></span>
                <span style={{ color: 'var(--muted-text)', fontFamily: 'monospace' }}>{accountInfo.maskedEmail}</span>
              </div>
            )}

            {formError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--status-danger-bg)',
                  color: 'var(--status-danger-text)',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '18px',
                  border: '1px solid rgba(197, 34, 31, 0.2)'
                }}
              >
                <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--forest-dark)' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--muted-text)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted-text)', marginBottom: '4px' }}>
                      <span>Password strength:</span>
                      <span style={{ fontWeight: 700, color: strength.color }}>{strength.text}</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(strength.score / 5) * 100}%`,
                          backgroundColor: strength.color,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--forest-dark)' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--muted-text)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                    Passwords do not match yet.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || (confirmPassword && password !== confirmPassword)}
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 700 }}
              >
                {submitting ? 'Updating Password...' : 'Reset Password'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
                  Cancel and Return to Sign In
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

