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
};
