import api from './api';

export const messageService = {
  getAllMessages: async (params = {}) => {
    const response = await api.get('/messages', { params });
    return response.data.data;
  },
  createMessage: async data => {
    const response = await api.post('/messages', data);
    return response.data.data;
  },
  replyMessage: async data => {
    const { messageId, reply } = data;
    const response = await api.post(`/messages/${messageId}`, { reply });
    return response.data.data;
  },
};
