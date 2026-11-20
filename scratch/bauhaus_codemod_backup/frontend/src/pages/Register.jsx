import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import InterestCategorySelector from '../components/InterestCategorySelector';
import {
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function Register({ onNavigate }) {
  const { register, user, logout } = useAuth();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Phone OTP States
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneVerificationToken, setPhoneVerificationToken] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Interests Selection
  const [interests, setInterests] = useState([
    'Classic Literature',
    'Philosophical Fiction',
    'Cognitive Psychology',
    'Artificial Intelligence'
  ]);
  const [showInterestsDrawer, setShowInterestsDrawer] = useState(false);

  // Status & Feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [smsWarning, setSmsWarning] = useState('');
  const [loading, setLoading] = useState(false);

  // Cooldown countdown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Clean phone input
  const handlePhoneChange = (val) => {
    setPhone(val);
    if (phoneVerified) {
      setPhoneVerified(false);
      setPhoneVerificationToken(null);
      setOtpSent(false);
      setOtp('');
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setError('Please enter a valid mobile number with country code (e.g., +91 9876543210).');
      return;
    }

    setError('');
    setSmsWarning('');
    setSendingOtp(true);

    try {
      await api.sendOtp(phone.trim(), 'register');
      setOtpSent(true);
      setCooldown(60);
      setSuccess(`A 6-digit verification code has been dispatched via SMS to ${phone.trim()}.`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Send OTP failed:', err);
      if (err.message && err.message.includes('SMS Gateway is not configured')) {
        setSmsWarning(err.message);
      } else {
        setError(err.message || 'Failed to dispatch verification code. Please check your number.');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code you received.');
      return;
    }

    setError('');
    setVerifyingOtp(true);

    try {
      const res = await api.verifyOtp(phone.trim(), otp.trim(), 'register');
      if (res.verified) {
        setPhoneVerified(true);
        setPhoneVerificationToken(res.phoneVerificationToken);
        setSuccess('Mobile number verified successfully! You may now complete your registration.');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError('Verification failed. Please enter the valid OTP.');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Step 3: Complete Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid academic or personal email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    // If phone was entered, enforce verification if SMS gateway is active
    if (phone.trim() && !phoneVerified && !smsWarning) {
      setError('Please verify your mobile number with the 6-digit OTP before submitting.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        confirmPassword,
        phoneVerificationToken,
        interests: interests.join(', ')
      });

      setSuccess('Account created successfully! Welcome to your personalized reading sanctuary.');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '50px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        backgroundColor: 'var(--editorial-bg)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="bio-card"
        style={{
          width: '640px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: 'clamp(24px, 5vw, 42px)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Organic Accent Ribbon */}
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
              width: '58px',
              height: '58px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, var(--editorial-green), var(--editorial-border))',
              boxShadow: '0 8px 20px rgba(96, 108, 56, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}
          >
            <BookOpen size={26} color="#FFFFFF" strokeWidth={2.2} />
          </div>

          <div className="pill-badge" style={{ marginBottom: '8px' }}>
            🌿 Free Sanctuary Enrollment
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2rem)',
              color: 'var(--editorial-text)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              marginBottom: '6px'
            }}
          >
            Create Your Sanctuary Card
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
            Join the LibraMind scholar collective to borrow physical books, reserve quiet study pods, and receive curated reading recommendations.
          </p>
        </div>

        {user && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--editorial-bg-subtle)',
              border: '1px solid var(--editorial-border)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                Active Session: {user.name} ({user.role?.toUpperCase()})
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                You are currently signed in. You may proceed to your dashboard or sign out.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onNavigate(user.role === 'admin' ? 'admin' : user.role === 'librarian' ? 'librarian' : 'dashboard')}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.76rem', padding: '5px 12px' }}
              >
                Go to Hub →
              </button>
              <button
                type="button"
                onClick={async () => { await logout(); }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.76rem', padding: '5px 10px' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Error Feedback Banner */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(150, 49, 36, 0.25)',
              fontSize: '0.86rem',
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

        {/* Success Feedback Banner */}
        {success && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--editorial-green-light)',
              color: 'var(--editorial-green)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-green)',
              fontSize: '0.86rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* SMS Gateway Configuration Notice */}
        {smsWarning && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #F59E0B',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              marginBottom: '20px'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> SMS Gateway Configuration Required
            </div>
            {smsWarning}
            <div style={{ marginTop: '6px', fontSize: '0.76rem', color: '#78350F' }}>
              Note: To deliver real SMS codes to actual mobile phones, configure Twilio (or MSG91) credentials in <code>backend/.env</code>.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. Full Name */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          {/* 2. Academic / Personal Email */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. eleanor@libramind.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* 3. Phone Number with Real OTP Verification */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--editorial-bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0, fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="var(--editorial-accent)" />
                Mobile Number (with country code) *
              </label>
              {phoneVerified && (
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--editorial-green)',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCircle2 size={13} /> Verified
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="tel"
                className="form-control"
                placeholder="e.g. +91 9876543210 or +1 4155552671"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={phoneVerified}
                required
                style={{ flex: 1, minWidth: '180px' }}
              />

              {!phoneVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || cooldown > 0 || !phone.trim()}
                  className="btn btn-outline"
                  style={{
                    flexShrink: 0,
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}
                >
                  {sendingOtp ? 'Sending...' : cooldown > 0 ? `Resend (${cooldown}s)` : otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              )}
            </div>

            {/* OTP Input Field */}
            {otpSent && !phoneVerified && (
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed var(--editorial-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0, fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={13} color="var(--editorial-green)" />
                    Enter 6-Digit SMS Code *
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>
                    Expires in 5 minutes
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    maxLength={6}
                    className="form-control"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{
                      flex: 1,
                      minWidth: '140px',
                      textAlign: 'center',
                      letterSpacing: '0.3em',
                      fontWeight: 800,
                      fontSize: '1.1rem'
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || otp.length !== 6}
                    className="btn btn-primary"
                    style={{
                      flexShrink: 0,
                      padding: '8px 18px',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  >
                    {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Password */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
              Password (min 6 characters) *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: '40px' }}
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
                  color: 'var(--editorial-text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 5. Confirm Password */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: '40px' }}
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
                  color: 'var(--editorial-text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <span style={{ fontSize: '0.74rem', color: '#DC2626', display: 'block', marginTop: '4px', fontWeight: 600 }}>
                ⚠️ Passwords do not match.
              </span>
            )}
          </div>

          {/* 6. Reading & Academic Subject Interests Selection (15 Categories & 140 Subcategories) */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <label className="form-label" style={{ marginBottom: 0, fontWeight: 700, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={15} color="var(--editorial-green)" />
                  Reading &amp; Academic Subject Interests
                </label>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: 'var(--muted-text)' }}>
                  Used by our AI sanctuary assistant to curate personalized reading recommendations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInterestsDrawer(!showInterestsDrawer)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.74rem', padding: '4px 10px', flexShrink: 0 }}
              >
                {showInterestsDrawer ? 'Hide Topics' : 'Browse 15 Categories →'}
              </button>
            </div>

            {/* Selected interests pill summary */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              {interests.map(item => (
                <span
                  key={item}
                  style={{
                    fontSize: '0.74rem',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    color: 'var(--editorial-green)',
                    border: '1px solid var(--editorial-border)',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => setInterests(interests.filter(i => i !== item))}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--muted-text)', cursor: 'pointer', display: 'flex' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Expandable Category Drawer */}
            {showInterestsDrawer && (
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--editorial-border)' }}>
                <InterestCategorySelector
                  selectedInterests={interests}
                  onChange={setInterests}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '0.98rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              'Creating Member Sanctuary Card...'
            ) : (
              <>
                <span>Complete Registration &amp; Open Folio</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Existing Member Link */}
        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', color: 'var(--muted-text)', fontWeight: 500 }}>
          Already enrolled in the library?{' '}
          <button
            type="button"
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
            Sign In with Member Card →
          </button>
        </div>
      </div>
    </div>
  );
}
