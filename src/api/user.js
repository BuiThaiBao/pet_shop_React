import { apiFetch } from '../utils/api';

// User API functions
export const userAPI = {
  // Lấy thông tin user hiện tại
  getMyInfo: async (token) => {
    return await apiFetch('/v1/users/myInfo', { token });
  }
};
