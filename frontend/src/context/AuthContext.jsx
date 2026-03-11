import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuthUser, logoutUser } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, verify the stored token is still valid by fetching /api/user
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    getAuthUser()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // Token is invalid or expired; discard it
        localStorage.removeItem('auth_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('auth_token', token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Proceed with local logout even if the server call fails
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
