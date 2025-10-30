import { apiFetch } from '../utils/api';

// Address API functions
export const addressAPI = {
  // Tạo địa chỉ mới
  createAddress: async (addressData, token) => {
    return await apiFetch('/v1/address/create', {
      method: 'POST',
      body: addressData,
      token
    });
  },

  // Lấy danh sách địa chỉ của user
  getUserAddresses: async (token, pageSize = 3, page = 0) => {
    return await apiFetch(`/v1/address/user-addresses?size=${pageSize}&page=${page}`, {
      method: 'GET',
      token
    });
  }
};