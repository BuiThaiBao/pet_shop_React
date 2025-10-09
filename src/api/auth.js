import { apiFetch } from '../utils/api';

// Auth API functions
export const authAPI = {
  // Đăng nhập
  login: async (email, password) => {
    return await apiFetch('/v1/auth/login', {
      method: 'POST',
      body: { identifier: email, password }
    });
  },

  // Đăng xuất
  logout: async (token) => {
    return await apiFetch('/v1/auth/logout', {
      method: 'POST',
      body: { token }
    });
  },

  // Refresh token
  refreshToken: async (currentToken) => {
    return await apiFetch('/v1/auth/refresh-token', {
      method: 'POST',
      body: { token: currentToken }
    });
  },

};
