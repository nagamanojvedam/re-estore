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
  deleteReview: async productId => {
    const response = await api.delete(`/reviews/${productId}`);
    return response.data.data;
  },
  getAllReviews: async productId => {
    const response = await api.get(`/reviews/all/${productId}`);
    return response.data.data;
  },
};
