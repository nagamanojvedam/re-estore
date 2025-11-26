import api from './api';

export const productService = {
  // Get all products with filtering
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data.product;
  },

  // Create product (authenticated users)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products', {
      params: { search: query, ...params },
    });
    return response.data.data;
  },
};
