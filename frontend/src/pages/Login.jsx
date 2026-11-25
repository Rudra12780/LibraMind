import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  BookOpen,
  Shield,
  User,
  Mail,
  Phone,
  Lock,
  Key,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  Eye,
  EyeOff,
  Bookmark,
  Award,
  Check
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  getFirebaseErrorMessage
} from '../firebase';

export default function Login({ onNavigate, initialMode = 'login' }) {
  const { user, login, logout, register, loginWithGoogle, loginWithGithub } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState(initialMode || 'login');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null); // 'to-register' | 'to-login'

  // Sync mode if initialMode prop changes
  useEffect(() => {
    if (initialMode && initialMode !== mode && !isFlipping) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Window resize listener for desktop vs mobile view
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  useEffect(() => {
    let timer = null;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setWindowWidth(window.innerWidth), 80);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth < 768;

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regInterests, setRegInterests] = useState('Classic Novels, Spiritual & Wisdom');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // GitHub Modal State
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubUsername, setGithubUsername] = useState('dev-reader');
  const [githubName, setGithubName] = useState('Library Scholar');
  const [githubEmail, setGithubEmail] = useState('dev.reader@github.com');
  const [githubLoading, setGithubLoading] = useState(false);

  const handleDestination = (userObj) => {
    if (!userObj) return;
    if (userObj.role === 'admin') {
      onNavigate('admin', { user: userObj, adminVerified: true });
    } else if (userObj.role === 'librarian') {
      onNavigate('librarian', { user: userObj });
    } else {
      onNavigate('dashboard', { user: userObj });
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 3D PAGE-FLIP HANDLERS (DESKTOP ONLY)
  // ═══════════════════════════════════════════════════════════════
  const handleFlipToRegister = () => {
    if (isFlipping || mode === 'register') return;

    if (isMobile) {
      setMode('register');
      try { window.history.replaceState(null, '', '/register'); } catch (_) {}
      return;
    }

    setIsFlipping(true);
    setFlipDirection('to-register');

    setTimeout(() => {
      setMode('register');
      setIsFlipping(false);
      setFlipDirection(null);
      try { window.history.replaceState(null, '', '/register'); } catch (_) {}
    }, 740);
  };

  const handleFlipToLogin = () => {
    if (isFlipping || mode === 'login') return;

    if (isMobile) {
      setMode('login');
      try { window.history.replaceState(null, '', '/login'); } catch (_) {}
      return;
    }

    setIsFlipping(true);
    setFlipDirection('to-login');

    setTimeout(() => {
      setMode('login');
      setIsFlipping(false);
      setFlipDirection(null);
      try { window.history.replaceState(null, '', '/login'); } catch (_) {}
    }, 740);
  };

  // ═══════════════════════════════════════════════════════════════
  // LOGIN / REGISTRATION ACTIONS (FIREBASE + LIBRAMIND SESSION)
  // ═══════════════════════════════════════════════════════════════
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isFlipping) return;
    setError('');
    setLoading(true);

    try {
      // 1. Primary backend authentication (supports newly SMS-OTP-reset passwords & local accounts)
      try {
        const res = await login(email.trim(), password, false);
        handleDestination(res.user);
        return;
      } catch (backendErr) {
        // 2. Fallback to Firebase Auth if account exists only in Firebase and needs syncing
        if (email.includes('@')) {
          try {
            const fbCred = await signInWithEmailAndPassword(auth, email.trim(), password);
            const fbSignedUser = fbCred?.user;
            if (fbSignedUser) {
              const syncRes = await loginWithGoogle({
                provider: 'google',
                uid: fbSignedUser.uid,
                email: fbSignedUser.email || email.trim(),
                name: fbSignedUser.displayName || email.split('@')[0],
                photoURL: fbSignedUser.photoURL || ''
              }, 'student');
              handleDestination(syncRes.user);
              return;
            }
          } catch (fbErr) {
            throw backendErr;
          }
        }
        throw backendErr;
      }
    } catch (err) {
      setError(err.message || getFirebaseErrorMessage(err) || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isFlipping) return;
    setRegError('');

    const phoneDigits = regPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setRegError('Please enter a valid 10-digit or international mobile phone number.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify both password entries.');
      return;
    }

    setRegLoading(true);
    try {
      // 1. Register in backend database (with mobile number for SMS OTP password recovery)
      const res = await register(
        regName.trim(),
        regEmail.trim(),
        regPassword,
        regInterests || 'Classic Novels, Spiritual & Wisdom',
        '',
        '',
        regPhone.trim()
      );

      // 2. Non-blocking Firebase user sync
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
        if (userCredential?.user) {
          await updateProfile(userCredential.user, { displayName: regName.trim() });
        }
      } catch (fbErr) {
        console.warn('Firebase registration sync notice:', fbErr?.message);
      }

      handleDestination(res?.user);
    } catch (err) {
      setRegError(err.message || getFirebaseErrorMessage(err) || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (isFlipping) return;
    setError('');
    setRegError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const googleData = {
        provider: 'google',
        uid: fbUser.uid,
        githubUsername: fbUser.email ? fbUser.email.split('@')[0] : `google-user-${fbUser.uid.slice(0, 6)}`,
        name: fbUser.displayName || regName || (fbUser.email ? fbUser.email.split('@')[0] : 'Library Scholar'),
        email: fbUser.email || `${fbUser.uid}@google.com`,
        photoURL: fbUser.photoURL || ''
      };
      const res = await loginWithGoogle(googleData, 'student');
      handleDestination(res.user);
    } catch (err) {
      const msg = getFirebaseErrorMessage(err);
      if (mode === 'register') {
        setRegError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubAuth = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setGithubLoading(true);
    try {
      await loginWithGithub({
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


  // ═══════════════════════════════════════════════════════════════
  // REUSABLE SUB-PAGE CONTENT RENDERERS (USED ON BASE & 3D LEAF)
  // ═══════════════════════════════════════════════════════════════

  // 1. Member Sign-In Form Content
  const renderSignInForm = (isLeaf = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        {/* Brand Kicker Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--editorial-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <BookOpen size={20} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
              ATHENAEUM READING SANCTUARY
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0, color: 'var(--editorial-text)' }}>
              Member Sign-In
            </h2>
          </div>
        </div>

        {user && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--editorial-bg-subtle)',
              border: '1px solid var(--editorial-border)',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <div style={{ fontSize: '0.78rem' }}>
              Active: <strong>{user.name}</strong>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleDestination(user)}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                Hub →
              </button>
              <button
                type="button"
                onClick={async () => { await logout(); }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(150, 49, 36, 0.2)',
              fontSize: '0.80rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '0.72rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={15}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--editorial-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="email"
                className="form-control"
                placeholder="e.g. reader@libramind.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isFlipping || loading || isLeaf}
                autoComplete="email"
                required
                style={{ height: '36px', fontSize: '0.84rem', paddingLeft: '34px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" style={{ marginBottom: 0, fontSize: '0.72rem' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                disabled={isFlipping || isLeaf}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--editorial-accent)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--editorial-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isFlipping || loading || isLeaf}
                autoComplete="current-password"
                required
                style={{ height: '36px', fontSize: '0.84rem', paddingLeft: '34px', paddingRight: '36px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLeaf}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--editorial-text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFlipping || loading || isLeaf}
            style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Sanctuary →'}
          </button>
        </form>

        {/* Google SSO */}
        <div style={{ marginTop: '14px' }}>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isFlipping || isLeaf || googleLoading}
            className="btn btn-outline"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderColor: 'var(--editorial-border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--editorial-text)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{googleLoading ? 'Connecting Google...' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>

      {/* 3D Page Turn Trigger Link to Register */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--editorial-border)', textAlign: 'center', fontSize: '0.80rem', color: 'var(--editorial-text-muted)' }}>
        Don't have a library card?{' '}
        <button
          type="button"
          onClick={handleFlipToRegister}
          disabled={isFlipping || isLeaf}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--editorial-accent)',
            fontWeight: 800,
            cursor: 'pointer',
            padding: '2px 4px',
            textDecoration: 'underline'
          }}
          title="Turn page to register"
        >
          Turn page to Sign Up 📖 →
        </button>
      </div>
    </div>
  );

  // 2. Scholar Registration Form Content
  const renderRegisterForm = (isLeaf = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--editorial-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Sparkles size={20} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
              FREE SANCTUARY ENROLLMENT
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0, color: 'var(--editorial-text)' }}>
              Join LibraMind
            </h2>
          </div>
        </div>

        {regError && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(150, 49, 36, 0.2)',
              fontSize: '0.80rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}
          >
            <AlertCircle size={15} />
            <span>{regError}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit}>
          <div className="form-group" style={{ marginBottom: '7px' }}>
            <label className="form-label" style={{ fontSize: '0.72rem' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={15}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--editorial-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Maya Lin"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                disabled={isFlipping || regLoading || isLeaf}
                required
                style={{ height: '32px', fontSize: '0.82rem', paddingLeft: '34px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '7px' }}>
            <label className="form-label" style={{ fontSize: '0.72rem' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={15}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--editorial-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="email"
                className="form-control"
                placeholder="maya@libramind.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                disabled={isFlipping || regLoading || isLeaf}
                required
                style={{ height: '32px', fontSize: '0.82rem', paddingLeft: '34px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '7px' }}>
            <label className="form-label" style={{ fontSize: '0.72rem' }}>
              Mobile Number (for SMS OTP) *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone
                size={15}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--editorial-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="tel"
                className="form-control"
                placeholder="+91 9876543210"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                disabled={isFlipping || regLoading || isLeaf}
                required
                style={{ height: '32px', fontSize: '0.82rem', paddingLeft: '34px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '7px' }}>
            <label className="form-label" style={{ fontSize: '0.72rem' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--editorial-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type={showRegPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                disabled={isFlipping || regLoading || isLeaf}
                required
                minLength={6}
                style={{ height: '32px', fontSize: '0.82rem', paddingLeft: '34px', paddingRight: '36px' }}
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                disabled={isLeaf}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--editorial-text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={showRegPassword ? 'Hide password' : 'Show password'}
              >
                {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '0.72rem' }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--editorial-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type={showRegConfirmPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Re-enter your password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                disabled={isFlipping || regLoading || isLeaf}
                required
                minLength={6}
                style={{ height: '32px', fontSize: '0.82rem', paddingLeft: '34px', paddingRight: '36px' }}
              />
              <button
                type="button"
                onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                disabled={isLeaf}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--editorial-text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={showRegConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showRegConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFlipping || regLoading || isLeaf}
            style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
          >
            {regLoading ? 'Issuing Member Folio...' : 'Complete Sanctuary Registration →'}
          </button>
        </form>

        {/* Google SSO */}
        <div style={{ marginTop: '12px' }}>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isFlipping || isLeaf || googleLoading}
            className="btn btn-outline"
            style={{
              width: '100%',
              padding: '7px 12px',
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderColor: 'var(--editorial-border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--editorial-text)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{googleLoading ? 'Connecting Google...' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>

      {/* Return Page Link */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--editorial-border)', textAlign: 'center', fontSize: '0.80rem', color: 'var(--editorial-text-muted)' }}>
        Already have a member card?{' '}
        <button
          type="button"
          onClick={handleFlipToLogin}
          disabled={isFlipping || isLeaf}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--editorial-accent)',
            fontWeight: 800,
            cursor: 'pointer',
            padding: '2px 4px',
            textDecoration: 'underline'
          }}
          title="Turn page back to login"
        >
          ← Turn page back to Sign In 📖
        </button>
      </div>
    </div>
  );

  // 3. Left Page Lore & Instant Demo Pass (Companion on Login mode)
  const renderLibraryLore = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
          ESTD. 1892 · ATHENAEUM FOLIO
        </span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: '4px 0 10px', color: 'var(--editorial-text)' }}>
          LibraMind Sanctuary
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text-muted)', lineHeight: 1.55, margin: '0 0 18px', fontStyle: 'italic' }}>
          "A library is an intentional sanctuary where minds meet masterworks across generations."
        </p>

        {/* Sanctuary Architectural Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
            <div style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', fontWeight: 700 }}>COLLECTION</div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--editorial-text)' }}>112 Volumes</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)' }}>9 Chambers</div>
          </div>
          <div style={{ padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
            <div style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', fontWeight: 700 }}>CARRELS</div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--editorial-text)' }}>Quiet Stacks</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)' }}>Power & Light</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--editorial-border)', textAlign: 'center', fontSize: '0.76rem', color: 'var(--editorial-text-muted)', fontStyle: 'italic' }}>
        Preserving scholarly heritage since 1892 · Oxford Stacks Architecture
      </div>
    </div>
  );

  // 4. Scholar Privileges & Charter (Companion on Register mode)
  const renderScholarPrivileges = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
          ARCHIVAL FOLIO · MEMBER CHARTER
        </span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: '4px 0 10px', color: 'var(--editorial-text)' }}>
          Scholar Privileges
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--editorial-text-muted)', lineHeight: 1.55, margin: '0 0 16px' }}>
          Enrollment in the Athenaeum grants immediate circulation privileges across all 112 masterwork volumes, nine chambers, and private research suites.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { title: 'Concurrent Physical Loans', desc: 'Borrow up to 5 accessioned physical volumes with automated renewal.', icon: BookOpen },
            { title: 'Biophilic Study Carrels', desc: 'Reserve ergonomic silent carrels with natural lighting and stack proximity.', icon: Bookmark },
            { title: 'AI Literary Oracle', desc: 'Semantic recommendations tailored to your scholarly research discipline.', icon: Sparkles },
            { title: 'Archival Blueprints Access', desc: 'Unrestricted access to all 21 system architectural wireframes.', icon: Award }
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 10px', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                <IconComp size={16} color="var(--editorial-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--editorial-text)', display: 'block' }}>{item.title}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', lineHeight: 1.35 }}>{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--editorial-border)', textAlign: 'center', fontSize: '0.76rem', color: 'var(--editorial-text-muted)', fontStyle: 'italic' }}>
        Charter ratified by Library Trustees · Zero Membership Dues
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // MOBILE VIEW: SIMPLE CLEAN BOX-TYPE CARD (NO 3D OPEN BOOK)
  // - "mobile view ma normal simple wadu box type"
  // ═══════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div className="mobile-auth-viewport">
        <div className="mobile-auth-card">
          {mode === 'login' ? (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--editorial-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <BookOpen size={20} color="#FFFFFF" strokeWidth={2.4} />
                </div>
                <div>
                  <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                    ATHENAEUM SANCTUARY
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, color: 'var(--editorial-text)' }}>
                    Member Sign-In
                  </h2>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--status-danger-bg)',
                    color: 'var(--status-danger-text)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(150, 49, 36, 0.2)',
                    fontSize: '0.80rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}
                >
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              {/* Direct Form */}
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--editorial-text-muted)',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. reader@libramind.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      autoComplete="email"
                      required
                      style={{ height: '38px', fontSize: '0.88rem', paddingLeft: '36px' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ marginBottom: 0, fontSize: '0.78rem' }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('forgot-password')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--editorial-accent)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Forgot?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--editorial-text-muted)',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      autoComplete="current-password"
                      required
                      style={{ height: '38px', fontSize: '0.88rem', paddingLeft: '36px', paddingRight: '36px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--editorial-text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '10px', fontSize: '0.90rem' }}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Sanctuary →'}
                </button>
              </form>

              {/* Google SSO */}
              <div style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading || googleLoading}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.80rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderColor: 'var(--editorial-border)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--editorial-text)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>{googleLoading ? 'Connecting Google...' : 'Continue with Google'}</span>
                </button>
              </div>

              {/* Switch to Register */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--editorial-border)', textAlign: 'center', fontSize: '0.82rem', color: 'var(--editorial-text-muted)' }}>
                Don't have a library card?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--editorial-accent)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: '2px 4px',
                    textDecoration: 'underline'
                  }}
                >
                  Sign Up for Free →
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Register Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--editorial-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Sparkles size={20} color="#FFFFFF" strokeWidth={2.4} />
                </div>
                <div>
                  <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                    FREE ENROLLMENT
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, color: 'var(--editorial-text)' }}>
                    Join LibraMind
                  </h2>
                </div>
              </div>

              {regError && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--status-danger-bg)',
                    color: 'var(--status-danger-text)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(150, 49, 36, 0.2)',
                    fontSize: '0.80rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}
                >
                  <AlertCircle size={15} />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--editorial-text-muted)',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Maya Lin"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      disabled={regLoading}
                      required
                      style={{ height: '38px', fontSize: '0.88rem', paddingLeft: '36px' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--editorial-text-muted)',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      type="email"
                      className="form-control"
                      placeholder="maya@libramind.edu"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      disabled={regLoading}
                      required
                      style={{ height: '38px', fontSize: '0.88rem', paddingLeft: '36px' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>
                    Mobile Number (for SMS OTP) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--editorial-text-muted)',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 9876543210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      disabled={regLoading}
                      required
                      style={{ height: '38px', fontSize: '0.88rem', paddingLeft: '36px' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--editorial-text-muted)',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      disabled={regLoading}
                      required
                      minLength={6}
                      style={{ height: '38px', fontSize: '0.88rem', paddingLeft: '36px', paddingRight: '36px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--editorial-text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>
                    Confirm Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--editorial-text-muted)',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Re-enter your password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      disabled={regLoading}
                      required
                      minLength={6}
                      style={{ height: '38px', fontSize: '0.88rem', paddingLeft: '36px', paddingRight: '36px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--editorial-text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={regLoading}
                  style={{ width: '100%', padding: '10px', fontSize: '0.90rem' }}
                >
                  {regLoading ? 'Issuing Member Folio...' : 'Complete Registration →'}
                </button>
              </form>

              {/* Google SSO */}
              <div style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={regLoading || googleLoading}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.80rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderColor: 'var(--editorial-border)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--editorial-text)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>{googleLoading ? 'Connecting Google...' : 'Continue with Google'}</span>
                </button>
              </div>

              {/* Switch back to Login */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--editorial-border)', textAlign: 'center', fontSize: '0.82rem', color: 'var(--editorial-text-muted)' }}>
                Already have a member card?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--editorial-accent)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: '2px 4px',
                    textDecoration: 'underline'
                  }}
                >
                  Sign In →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* GitHub SSO Modal (Available on mobile too) */}
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
                padding: '28px 20px',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowGithubModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-text)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', margin: '0 0 6px', color: 'var(--editorial-text)' }}>
                  Authorize with GitHub
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted-text)', margin: 0 }}>
                  Link your GitHub account to enter your LibraMind Member Card.
                </p>
              </div>

              <form onSubmit={handleGithubAuth}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>GitHub Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="your-username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Email Address</label>
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
                  style={{ width: '100%', padding: '10px' }}
                >
                  {githubLoading ? 'Connecting...' : 'Authorize & Sign In →'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DESKTOP VIEW: AUTHENTIC 3D OPEN-BOOK WITH CENTER-SPINE PAGE TURN
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="open-book-viewport">
      {/* OPEN-BOOK HARDCOVER CASING */}
      <div className="open-book-casing">
        {/* Archival Gold Silk Bookmark Ribbon */}
        <div className="open-book-bookmark-ribbon" />

        {/* INTERIOR TWO-PAGE SPREAD */}
        <div className="open-book-spread">
          {/* CENTER SPINDLE GUTTER WITH BRASS RINGS */}
          <div className="open-book-spine-gutter">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="open-book-ring-loop">
                <div className="open-book-punch-hole open-book-punch-hole-left" />
                <div className="open-book-metallic-ring" />
                <div className="open-book-punch-hole open-book-punch-hole-right" />
              </div>
            ))}
          </div>

          {/* LEFT BASE PAGE */}
          <div className="open-book-page open-book-page-left">
            {mode === 'login'
              ? renderLibraryLore()
              : (isFlipping && flipDirection === 'to-login' ? renderLibraryLore() : renderScholarPrivileges())}
          </div>

          {/* RIGHT BASE PAGE */}
          <div className="open-book-page open-book-page-right">
            {mode === 'login'
              ? (isFlipping && flipDirection === 'to-register' ? renderRegisterForm() : renderSignInForm())
              : renderRegisterForm()}
          </div>

          {/* 3D TURNING PAGE LEAF (TURNS RIGHT <-> LEFT AROUND SPINDLE) */}
          {isFlipping && (
            <div className={`open-book-turning-leaf turning-${flipDirection}`}>
              {/* Front Face of Turning Sheet (Sign-In Form) */}
              <div className="open-book-leaf-face open-book-leaf-face-front">
                {renderSignInForm(true)}
                <div
                  className="open-book-leaf-shading"
                  style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.24) 0%, rgba(255,255,255,0.18) 25%, rgba(0,0,0,0.20) 100%)'
                  }}
                />
              </div>

              {/* Back Face of Turning Sheet (Scholar Privileges) */}
              <div className="open-book-leaf-face open-book-leaf-face-back">
                {renderScholarPrivileges(true)}
                <div
                  className="open-book-leaf-shading"
                  style={{
                    background: 'linear-gradient(to left, rgba(0,0,0,0.24) 0%, rgba(255,255,255,0.18) 25%, rgba(0,0,0,0.20) 100%)'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GitHub SSO Modal (Desktop) */}
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
