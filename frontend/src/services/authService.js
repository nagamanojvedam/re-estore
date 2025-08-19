import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  // Logout user
  logout: async (data) => {
    const response = await api.post('/auth/logout', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (data) => {
    const response = await api.post('/auth/refresh', data);
    return response.data.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data.data.user;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.patch('/users/me', userData);
    return response.data.data;
  },
};
