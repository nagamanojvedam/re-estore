import api from './api';

export const userService = {
  updateMe: async data => {
    const response = await api.patch('/users/me', data);
    return response.data.data;
  },

  // Get my products
  getMyProducts: async (params = {}) => {
    const response = await api.get('/users/me/products', { params });
    return response.data.data;
  },

  forgotPassword: async data => {
    const response = await api.get('/users/forgot-password', data);
    return response.data.data;
  },
  toggleUserActive: async ({ id, isUserActive }) => {
    const response = await api.patch(`/users/${id}/toggle-user-active`, {
      isUserActive,
    });
    return response.data.data;
  },
};
