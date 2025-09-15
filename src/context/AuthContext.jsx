import React, { createContext, useState, useContext } from 'react';

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

  const login = async (email, password) => {
    setLoading(true);
    // Mock login - in real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple mock validation
        if (email === 'a@123.com' && password === '123456') {
          const mockUser = {
            id: 1,
            name: "Nguyễn Văn A",
            email: email
          };
          setUser(mockUser);
          setLoading(false);
          resolve(mockUser);
        } else {
          setLoading(false);
          reject(new Error('Email hoặc mật khẩu không đúng'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
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

  const value = {
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};