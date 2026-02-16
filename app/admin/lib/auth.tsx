'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiFetch } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedRefresh = localStorage.getItem('admin_refresh');
    if (savedToken && savedRefresh) {
      setToken(savedToken);
      // Verify token by fetching user
      apiFetch<User>('/auth/me', { token: savedToken })
        .then(setUser)
        .catch(() => {
          // Try refresh
          apiFetch<{ accessToken: string }>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken: savedRefresh }),
          })
            .then((data) => {
              localStorage.setItem('admin_token', data.accessToken);
              setToken(data.accessToken);
              return apiFetch<User>('/auth/me', { token: data.accessToken });
            })
            .then(setUser)
            .catch(() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_refresh');
              setToken(null);
            });
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{
      accessToken: string;
      refreshToken: string;
      user: User;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('admin_token', data.accessToken);
    localStorage.setItem('admin_refresh', data.refreshToken);
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem('admin_refresh');
    if (refreshToken) {
      apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
