import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { apiFetch as baseApiFetch } from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const { showToast } = useToast();

  // Initialize from storage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Backend expects { username, password }
      const response = await baseApiFetch('/v1/auth/token', {
        method: 'POST',
        body: { identifier: email, password },
      });

      // Expected structure: { result: { token, authenticated }, success, message }
      const receivedToken = response?.result?.token;
      const authenticated = response?.result?.authenticated;

      if (!receivedToken || authenticated === false) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      setToken(receivedToken);
      localStorage.setItem('auth_token', receivedToken);

      // Immediately load detailed user info
      try {
        const loaded = await loadMyInfo(receivedToken);
        return loaded;
      } catch (e) {
        // Fallback: persist minimal user if myInfo fails
        const nextUser = { email };
        setUser(nextUser);
        localStorage.setItem('auth_user', JSON.stringify(nextUser));
        return nextUser;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    showToast('Đăng xuất thành công', 'success');
  };

  const register = async (userData) => {
    setLoading(true);
    // Mock registration - in real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple mock registration
        console.log('Registering user:', userData);
        setLoading(false);
        resolve({
          id: Date.now(),
          ...userData
        });
      }, 1000);
    });
  };

  // Helper to call API with token automatically
  const apiFetch = useCallback((path, options = {}) => {
    return baseApiFetch(path, { ...options, token });
  }, [token]);

  // Load current user's info using the stored token
  const loadMyInfo = useCallback(async (overrideToken) => {
    const useToken = overrideToken || token;
    if (!useToken) throw new Error('No auth token');
    const res = await baseApiFetch('/v1/users/myInfo', { token: useToken });
    const userData = res?.result || res;
    if (userData) {
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    }
    return userData;
  }, [token]);

  // If token exists but no user loaded yet, try to fetch myInfo on mount or token change
  useEffect(() => {
    if (token && !user) {
      loadMyInfo().catch(() => {
        // If token invalid, clear
        setToken(null);
        localStorage.removeItem('auth_token');
      });
    }
  }, [token, user, loadMyInfo]);

  const value = {
    user,
    loading,
    token,
    login,
    logout,
    register,
    apiFetch,
    loadMyInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};