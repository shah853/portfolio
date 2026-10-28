import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      if (!localStorage.getItem('token')) {
        if (active) setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (!active) return;
        if (response.data?.role === 'admin') {
          setUser(response.data);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch {
        localStorage.removeItem('token');
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    localStorage.removeItem('token');
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;

    if (userData.role !== 'admin') {
      setUser(null);
      throw new Error('Admin access only');
    }

    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The hook is exported alongside its provider so consumers share this context.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
