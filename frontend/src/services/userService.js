import api from './api';

export const userService = {
  updateMe: async data => {
    const response = await api.patch('/users/me', data);
    return response.data.data;
  },
};
