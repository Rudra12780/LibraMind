import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getActiveAuthToken, clearAllPortalTokens } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getActiveAuthToken());
  const [user, setUser] = useState(null);
  const [adminVerified, setAdminVerified] = useState(() => sessionStorage.getItem('libramind_admin_verified') === 'true');
  const [loading, setLoading] = useState(true);

  // Sync token whenever active portal/token changes
  useEffect(() => {
    const currentToken = getActiveAuthToken();
    if (currentToken && currentToken !== token) {
      setToken(currentToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      api.getProfile()
        .then(userData => {
          setUser(userData);
          if (userData && userData.role === 'admin') {
            sessionStorage.setItem('libramind_admin_verified', 'true');
            setAdminVerified(true);
          }
        })
        .catch(err => {
          console.error('Failed to load profile:', err);
          const errMsg = (err?.message || '').toLowerCase();
          if (
            errMsg.includes('401') ||
            errMsg.includes('403') ||
            errMsg.includes('unauthorized') ||
            errMsg.includes('invalid token') ||
            errMsg.includes('jwt expired')
          ) {
            logout();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const saveTokenByRole = (newToken, role) => {
    if (!newToken) return;
    const cleanRole = (role || 'student').toLowerCase();

    // Remove any persistent localStorage tokens so reloading entry URLs never auto-logs in
    ['libramind_librarian_token', 'libramind_admin_token', 'libramind_student_token', 'libramind_token'].forEach(k => {
      try { localStorage.removeItem(k); } catch (_) {}
    });

    // Store active in-tab session token only in sessionStorage
    sessionStorage.setItem('libramind_session_token', newToken);
    sessionStorage.setItem('libramind_session_role', cleanRole);

    if (cleanRole === 'librarian') {
      sessionStorage.setItem('libramind_librarian_token', newToken);
    } else if (cleanRole === 'admin') {
      sessionStorage.setItem('libramind_admin_token', newToken);
      sessionStorage.setItem('libramind_admin_verified', 'true');
      setAdminVerified(true);
    } else {
      sessionStorage.setItem('libramind_student_token', newToken);
    }
  };

  const login = async (email, password, adminPortal = false) => {
    const res = await api.login({ email, password, adminPortal });
    const role = res.user?.role || (adminPortal ? 'admin' : 'student');
    saveTokenByRole(res.token, role);
    setToken(res.token);
    setUser(res.user);

    if (role === 'admin') {
      sessionStorage.setItem('libramind_admin_verified', 'true');
      setAdminVerified(true);
    } else {
      sessionStorage.removeItem('libramind_admin_verified');
      setAdminVerified(false);
    }

    return res;
  };

  const register = async (name, email, password, interests, adminSecret = '', role = '', phone = '') => {
    const res = await api.register({ name, email, password, interests, adminSecret, role, phone });
    const userRole = res.user?.role || role || 'student';
    saveTokenByRole(res.token, userRole);
    setToken(res.token);
    setUser(res.user);

    if (userRole === 'admin') {
      sessionStorage.setItem('libramind_admin_verified', 'true');
      setAdminVerified(true);
    } else {
      sessionStorage.removeItem('libramind_admin_verified');
      setAdminVerified(false);
    }

    return res;
  };

  const loginWithGoogle = async (googleData = {}, targetRole = 'student') => {
    const res = await api.googleLogin({ ...googleData, role: targetRole, provider: 'google' });
    const userRole = res.user?.role || targetRole;
    saveTokenByRole(res.token, userRole);
    setToken(res.token);
    setUser(res.user);

    if (userRole === 'admin') {
      sessionStorage.setItem('libramind_admin_verified', 'true');
      setAdminVerified(true);
    } else {
      sessionStorage.removeItem('libramind_admin_verified');
      setAdminVerified(false);
    }

    return res;
  };

  const loginWithGithub = async (githubData = {}, targetRole = 'student') => {
    const res = await api.githubLogin({ ...githubData, role: targetRole });
    const userRole = res.user?.role || targetRole;
    saveTokenByRole(res.token, userRole);
    setToken(res.token);
    setUser(res.user);

    if (userRole === 'admin') {
      sessionStorage.setItem('libramind_admin_verified', 'true');
      setAdminVerified(true);
    } else {
      sessionStorage.removeItem('libramind_admin_verified');
      setAdminVerified(false);
    }

    return res;
  };

  const logout = () => {
    clearAllPortalTokens();
    setAdminVerified(false);
    setToken(null);
    setUser(null);
  };

  const forceResetToGateway = useCallback(() => {
    clearAllPortalTokens();
    setAdminVerified(false);
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  const logoutAdminPortal = () => {
    sessionStorage.removeItem('libramind_admin_verified');
    sessionStorage.removeItem('libramind_admin_token');
    localStorage.removeItem('libramind_admin_token');
    setAdminVerified(false);
  };

  const reloadProfile = async () => {
    const activeToken = getActiveAuthToken();
    if (activeToken) {
      try {
        const userData = await api.getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Error reloading profile', err);
      }
    }
  };

  const setAuthSession = (newToken, newUser) => {
    const userRole = newUser?.role || 'student';
    saveTokenByRole(newToken, userRole);
    setToken(newToken);
    setUser(newUser);
    if (userRole === 'admin') {
      sessionStorage.setItem('libramind_admin_verified', 'true');
      setAdminVerified(true);
    } else {
      sessionStorage.removeItem('libramind_admin_verified');
      setAdminVerified(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      adminVerified,
      setAdminVerified,
      login,
      setAuthSession,
      loginWithGoogle,
      loginWithGithub,
      register,
      logout,
      forceResetToGateway,
      logoutAdminPortal,
      reloadProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
