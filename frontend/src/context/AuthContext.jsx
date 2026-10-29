import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('libramind_token') || null);
  const [adminVerified, setAdminVerified] = useState(() => sessionStorage.getItem('libramind_admin_verified') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getProfile()
        .then(userData => {
          setUser(userData);
        })
        .catch(err => {
          console.error('Failed to load profile:', err);
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password, adminPortal = false) => {
    const res = await api.login({ email, password, adminPortal });
    localStorage.setItem('libramind_token', res.token);
    setToken(res.token);
    setUser(res.user);

    if (adminPortal && res.user.role === 'admin') {
      sessionStorage.setItem('libramind_admin_verified', 'true');
      setAdminVerified(true);
    } else {
      sessionStorage.removeItem('libramind_admin_verified');
      setAdminVerified(false);
    }

    return res;
  };

  const register = async (name, email, password, interests, adminSecret = '', role = '') => {
    const res = await api.register({ name, email, password, interests, adminSecret, role });
    localStorage.setItem('libramind_token', res.token);
    setToken(res.token);
    setUser(res.user);
    sessionStorage.removeItem('libramind_admin_verified');
    setAdminVerified(false);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('libramind_token');
    sessionStorage.removeItem('libramind_admin_verified');
    setToken(null);
    setUser(null);
    setAdminVerified(false);
  };

  const logoutAdminPortal = () => {
    sessionStorage.removeItem('libramind_admin_verified');
    setAdminVerified(false);
  };

  const reloadProfile = async () => {
    if (token) {
      try {
        const userData = await api.getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Error reloading profile', err);
      }
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
      register,
      logout,
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
