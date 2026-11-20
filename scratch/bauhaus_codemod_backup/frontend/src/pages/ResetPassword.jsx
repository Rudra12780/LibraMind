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
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (!urlToken) {
      setValidating(false);
      setTokenValid(false);
      setTokenError('No password reset token was detected in the URL. Please use the complete link dispatched to your email.');
      return;
    }

    setToken(urlToken);

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
    if (!pwd) return { score: 0, text: 'Empty', color: 'var(--muted-text)' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, text: 'Weak', color: 'var(--editorial-accent)' };
    if (score <= 4) return { score, text: 'Good', color: 'var(--editorial-border)' };
    return { score, text: 'Strong', color: 'var(--editorial-green)' };
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
            background: 'linear-gradient(90deg, var(--editorial-accent) 0%, var(--editorial-green) 50%, var(--editorial-border) 100%)'
          }}
        />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '26px', marginTop: '4px' }}>
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
            <Lock size={28} color="#FFFFFF" strokeWidth={2.2} />
          </div>

          <div
            className="pill-badge"
            style={{
              marginBottom: '10px'
            }}
          >
            🔑 Security & Key Update
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
            Reset Your Password
          </h2>
          <p style={{ fontSize: '0.90rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
            Create a secure, new password for your LibraMind sanctuary account.
          </p>
        </div>

        {validating ? (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid var(--editorial-bg-subtle)',
                borderTopColor: 'var(--editorial-accent)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}
            />
            <p style={{ color: 'var(--editorial-text)', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
              Verifying security token...
            </p>
          </div>
        ) : !tokenValid ? (
          <div>
            <div
              style={{
                padding: '24px',
                backgroundColor: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(150, 49, 36, 0.25)',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              <ShieldAlert size={36} style={{ margin: '0 auto 10px', display: 'block' }} />
              <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: '0 0 8px', fontWeight: 700 }}>
                Invalid or Expired Link
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
                {tokenError}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
              >
                Request a New Reset Link →
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="btn btn-outline"
                style={{ width: '100%', padding: '12px', fontSize: '0.90rem' }}
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : success ? (
          <div>
            <div
              style={{
                padding: '26px 20px',
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
                  width: '52px',
                  height: '52px',
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
                <CheckCircle2 size={28} strokeWidth={2.2} />
              </div>

              <h4 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', marginBottom: '8px', fontWeight: 700 }}>
                Password Updated!
              </h4>
              <p style={{ fontSize: '0.90rem', color: 'var(--editorial-text)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                Your LibraMind account password has been safely updated. All previous reset tokens have been invalidated.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '0.96rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Sign In With New Password →
            </button>
          </div>
        ) : (
          <div>
            {accountInfo.maskedEmail && (
              <div
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--editorial-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--editorial-border)',
                  fontSize: '0.84rem',
                  color: 'var(--editorial-text)',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}
              >
                <span>Account: <strong>{accountInfo.userName}</strong></span>
                <span style={{ fontFamily: 'monospace' }}>{accountInfo.maskedEmail}</span>
              </div>
            )}

            {formError && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--status-danger-bg)',
                  color: 'var(--status-danger-text)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  marginBottom: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(150, 49, 36, 0.2)'
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">
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
                    style={{ paddingRight: '44px' }}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--muted-text)', marginBottom: '4px', fontWeight: 600 }}>
                      <span>Password strength:</span>
                      <span style={{ color: strength.color, fontWeight: 700 }}>{strength.text}</span>
                    </div>
                    <div style={{ height: '5px', width: '100%', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(strength.score / 5) * 100}%`,
                          backgroundColor: strength.color,
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.25s ease'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">
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
                    style={{ paddingRight: '44px' }}
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
                  <span style={{ fontSize: '0.76rem', color: 'var(--editorial-accent)', marginTop: '5px', display: 'block', fontWeight: 600 }}>
                    Passwords do not match yet.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || (confirmPassword && password !== confirmPassword)}
                style={{ width: '100%', padding: '13px', fontSize: '0.96rem' }}
              >
                {submitting ? 'Updating Password...' : 'Reset Password →'}
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
