import React, { useState, useEffect } from 'react';
import {
  Phone,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Clock,
  RefreshCw,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../api';

export default function ForgotPassword({ onNavigate }) {
  // Flow step: 'phone' | 'otp' | 'reset' | 'success'
  const [step, setStep] = useState('phone');

  const [phone, setPhone] = useState('');
  const [canonicalPhone, setCanonicalPhone] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [userName, setUserName] = useState('');

  const [otp, setOtp] = useState('');
  const [virtualOtp, setVirtualOtp] = useState('');
  const [expiresAtMs, setExpiresAtMs] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live 60-second wall-clock countdown for OTP validity
  useEffect(() => {
    if (step !== 'otp' || !expiresAtMs) return undefined;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };

    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [step, expiresAtMs]);

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

  const dispatchOtp = async (targetPhone) => {
    setError('');
    const digits = targetPhone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setError('Please enter a valid 10-digit or international mobile phone number (e.g. +91 9876543210).');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(targetPhone.trim());
      const ttlSec = Number(res.expiresIn) || 60;
      const serverExp = res.expiresAt ? new Date(res.expiresAt).getTime() : Date.now() + ttlSec * 1000;

      setCanonicalPhone(res.phone || targetPhone.trim());
      setMaskedPhone(res.maskedPhone || targetPhone.trim());
      setUserName(res.userName || '');
      setVirtualOtp(res.virtualOtp || '');
      setExpiresAtMs(serverExp);
      setSecondsLeft(Math.max(1, Math.min(60, Math.ceil((serverExp - Date.now()) / 1000))));
      setOtp('');
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Unable to send SMS OTP. Please verify your mobile number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtpSubmit = async (e) => {
    e.preventDefault();
    await dispatchOtp(phone);
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (secondsLeft <= 0) {
      setError('This OTP has expired (valid for 60 seconds only). Please click Resend SMS OTP.');
      return;
    }

    const cleanOtp = otp.replace(/\D/g, '').trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter the 6-digit OTP code sent to your mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyResetOtp(canonicalPhone || phone.trim(), cleanOtp);
      setResetToken(res.resetToken);
      if (res.maskedPhone) setMaskedPhone(res.maskedPhone);
      if (res.userName) setUserName(res.userName);
      setStep('reset');
    } catch (err) {
      const msg = err.message || 'Invalid or expired OTP code.';
      setError(msg);
      if (msg.toLowerCase().includes('expired')) {
        setSecondsLeft(0);
        setExpiresAtMs(Date.now());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter both fields.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({
        token: resetToken,
        password,
        confirmPassword
      });
      setStep('success');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please request a new SMS OTP.');
    } finally {
      setLoading(false);
    }
  };

  const headerSubtitle =
    step === 'phone'
      ? 'Enter your registered mobile number to receive a 6-digit SMS OTP valid for 60 seconds.'
      : step === 'otp'
        ? `Enter the 6-digit verification code sent via SMS to ${maskedPhone}.`
        : step === 'reset'
          ? 'OTP verified! Create a strong new password for your LibraMind account.'
          : 'Your password has been updated cleanly.';

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
          width: '490px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: '40px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Top Accent Ribbon */}
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
        <div style={{ textAlign: 'center', marginBottom: '26px', marginTop: '4px' }}>
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
            {step === 'otp' ? (
              <Smartphone size={28} color="#FFFFFF" strokeWidth={2.2} />
            ) : step === 'reset' ? (
              <Lock size={28} color="#FFFFFF" strokeWidth={2.2} />
            ) : (
              <KeyRound size={28} color="#FFFFFF" strokeWidth={2.2} />
            )}
          </div>

          <div className="pill-badge" style={{ marginBottom: '10px' }}>
            <ShieldCheck size={13} />
            SMS OTP Recovery • 60s Validity
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
            {step === 'otp' ? 'Verify SMS OTP' : step === 'reset' ? 'Set New Password' : step === 'success' ? 'Password Updated!' : 'Forgot Password?'}
          </h2>
          <p style={{ fontSize: '0.90rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
            {headerSubtitle}
          </p>
        </div>

        {/* Step Indicator */}
        {step !== 'success' && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
            {[
              { id: 'phone', label: '1. Mobile' },
              { id: 'otp', label: '2. 60s OTP' },
              { id: 'reset', label: '3. New Password' }
            ].map((item, idx) => {
              const currentIdx = step === 'phone' ? 0 : step === 'otp' ? 1 : 2;
              const isDone = idx < currentIdx;
              const isActive = idx === currentIdx;
              return (
                <div
                  key={item.id}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    backgroundColor: isActive
                      ? 'var(--editorial-green)'
                      : isDone
                        ? 'var(--editorial-bg-subtle)'
                        : '#FAF8F4',
                    color: isActive
                      ? '#FFFFFF'
                      : isDone
                        ? 'var(--editorial-green)'
                        : 'var(--muted-text)',
                    border: `1px solid ${isActive ? 'var(--editorial-green)' : 'var(--editorial-border)'}`
                  }}
                >
                  {isDone ? `✓ ${item.label}` : item.label}
                </div>
              );
            })}
          </div>
        )}

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

        {/* STEP 1: PHONE INPUT */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtpSubmit}>
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">Registered Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  style={{ paddingLeft: '42px' }}
                />
                <Phone
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
              <span style={{ fontSize: '0.76rem', color: 'var(--muted-text)', marginTop: '6px', display: 'block' }}>
                A 6-digit SMS verification code valid for <strong>60 seconds</strong> will be sent to this phone number.
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '0.96rem' }}
            >
              {loading ? 'Sending SMS OTP...' : 'Send SMS OTP →'}
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

        {/* STEP 2: 60-SECOND SMS OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtpSubmit}>
            {/* Countdown Banner */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: secondsLeft === 0 ? 'var(--status-danger-bg)' : 'var(--editorial-bg-subtle)',
                border: `1px solid ${secondsLeft === 0 ? 'rgba(150, 49, 36, 0.25)' : 'var(--editorial-border)'}`,
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  {userName ? `${userName} (${maskedPhone})` : maskedPhone}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    color: secondsLeft === 0 ? 'var(--status-danger-text)' : secondsLeft <= 15 ? '#B45309' : 'var(--editorial-green)'
                  }}
                >
                  <Clock size={14} />
                  {secondsLeft > 0 ? `${secondsLeft}s left` : 'Expired (0s)'}
                </span>
              </div>
              <div style={{ height: '5px', width: '100%', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(0, Math.min(100, (secondsLeft / 60) * 100))}%`,
                    backgroundColor: secondsLeft === 0 ? '#C5221F' : secondsLeft <= 15 ? '#D97706' : 'var(--editorial-green)',
                    transition: 'width 0.25s linear'
                  }}
                />
              </div>
            </div>

            {virtualOtp && secondsLeft > 0 && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--editorial-bg-subtle)',
                  border: '1px solid var(--editorial-green)',
                  color: 'var(--editorial-text)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--editorial-green)' }}>SMS Verification Message ({maskedPhone})</div>
                  <div>
                    Your 60s OTP Code: <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', letterSpacing: '2px' }}>{virtualOtp}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(virtualOtp)}
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Fill OTP
                </button>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">6-Digit SMS OTP Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="form-control"
                placeholder="● ● ● ● ● ●"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading}
                autoFocus
                required
                style={{
                  textAlign: 'center',
                  fontSize: '1.45rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '0.45em',
                  padding: '12px 16px'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginTop: '6px', display: 'block', textAlign: 'center' }}>
                {secondsLeft > 0
                  ? 'Single-use code. Expires automatically after 60 seconds.'
                  : 'Time limit reached. Click Resend SMS OTP to get a fresh 60-second code.'}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || secondsLeft === 0 || otp.length !== 6}
              style={{ width: '100%', padding: '13px', fontSize: '0.96rem', marginBottom: '12px' }}
            >
              {loading ? 'Verifying OTP...' : secondsLeft === 0 ? 'OTP Expired — Request New Code' : 'Verify 60s OTP →'}
            </button>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                disabled={loading || secondsLeft > 0}
                onClick={() => dispatchOtp(canonicalPhone || phone)}
                className="btn btn-outline"
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} />
                {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend SMS OTP'}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStep('phone');
                  setError('');
                  setOtp('');
                  setVirtualOtp('');
                }}
                className="btn btn-outline"
                style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }}
              >
                Change Number
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD FORM */}
        {step === 'reset' && (
          <form onSubmit={handleResetPasswordSubmit}>
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--editorial-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--editorial-border)',
                fontSize: '0.82rem',
                color: 'var(--editorial-text)',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px'
              }}
            >
              <span>Account: <strong>{userName || 'Member'}</strong></span>
              <span style={{ fontFamily: 'monospace' }}>{maskedPhone}</span>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">New Password</label>
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
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">Confirm New Password</label>
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
              disabled={loading || (confirmPassword && password !== confirmPassword)}
              style={{ width: '100%', padding: '13px', fontSize: '0.96rem' }}
            >
              {loading ? 'Updating Password...' : 'Reset Password →'}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
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
              <p style={{ fontSize: '0.92rem', color: 'var(--editorial-text)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                Your LibraMind password has been reset cleanly after 60-second SMS OTP verification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '0.96rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Sign In With New Password →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
