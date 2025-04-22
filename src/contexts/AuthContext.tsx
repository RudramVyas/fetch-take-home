// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session constants
const SESSION_DURATION = 60 * 60 * 1000;   // 1 hour in ms
const WARNING_BEFORE = 10 * 60 * 1000;      // 10 minutes in ms

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginTimestamp, setLoginTimestamp] = useState<number | null>(null);

  // On mount, restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('loginTimestamp');
    if (stored) {
      const ts = Number(stored);
      const elapsed = Date.now() - ts;
      if (elapsed < SESSION_DURATION) {
        setIsAuthenticated(true);
        setLoginTimestamp(ts);
      } else {
        localStorage.removeItem('loginTimestamp');
      }
    }
  }, []);

  // Schedule warning and auto-logout
  useEffect(() => {
    if (!isAuthenticated || loginTimestamp === null) return;

    const now = Date.now();
    const warnDelay = loginTimestamp + SESSION_DURATION - WARNING_BEFORE - now;
    const logoutDelay = loginTimestamp + SESSION_DURATION - now;

    const warnTimer = warnDelay > 0
      ? window.setTimeout(() => window.dispatchEvent(new Event('session:warn')), warnDelay)
      : null;
    const logoutTimer = logoutDelay > 0
      ? window.setTimeout(() => logout(), logoutDelay)
      : null;

    return () => {
      if (warnTimer) clearTimeout(warnTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [isAuthenticated, loginTimestamp]);

  // Call this on login: sets HttpOnly cookie, saves timestamp, navigates
  const login = async (name: string, email: string) => {
    await apiLogin(name, email);  // browser stores cookie
    const now = Date.now();
    localStorage.setItem('loginTimestamp', now.toString());
    setLoginTimestamp(now);
    setIsAuthenticated(true);
    navigate('/search');
  };

  // Clears session and redirects to login
  const logout = () => {
    localStorage.removeItem('loginTimestamp');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for components to access auth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
