import api from './api';

export const orderService = {
  // Create new order
  createOrder: async orderData => {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  },

  // Get user's orders
  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders/me', { params });
    return response.data.data;
  },

  // Get all orders (admin only)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async ({ id, status }) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data.data;
  },

  // Get order by ID
  getOrder: async id => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  // Get order by orderNumber
  getOrderByNumber: async orderNumber => {
    const response = await api.get(`/orders/orderNumber/${orderNumber}`);
    return response.data.data;
  },

  cancelMyOrder: async orderId => {
    const response = await api.post(`/orders/cancelMyOrder/${orderId}`);
    return response.data.data;
  },
};
