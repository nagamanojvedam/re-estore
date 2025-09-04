import api from './api';

export const reviewService = {
  addOrUpdate: async data => {
    const response = await api.post('/reviews', data);
    return response.data.data;
  },
  getReview: async productId => {
    const response = await api.get(`/reviews/${productId}`);
    return response.data.data;
  },
};
