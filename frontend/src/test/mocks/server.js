import { setupServer } from 'msw/node';
import { rest } from 'msw';

const API_BASE_URL = 'http://localhost:3000/api';

export const handlers = [
  // Auth endpoints
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    const { email, password } = req.body;

    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          data: {
            user: {
              _id: '123',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
            },
            tokens: {
              access: { token: 'mock-access-token' },
              refresh: { token: 'mock-refresh-token' },
            },
          },
        }),
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        status: 'error',
        message: 'Invalid credentials',
      }),
    );
  }),

  rest.post(`${API_BASE_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        status: 'success',
        data: {
          user: {
            _id: '456',
            name: req.body.name,
            email: req.body.email,
            role: 'user',
          },
          tokens: {
            access: { token: 'mock-access-token' },
            refresh: { token: 'mock-refresh-token' },
          },
        },
      }),
    );
  }),

  // Products endpoints
  rest.get(`${API_BASE_URL}/products`, (req, res, ctx) => {
    const page = req.url.searchParams.get('page') || '1';
    const limit = req.url.searchParams.get('limit') || '10';

    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        data: {
          products: [
            {
              _id: '1',
              name: 'Test Product 1',
              description: 'Test product description',
              price: 99.99,
              category: 'Electronics',
              stock: 10,
              images: ['/test-product-1.jpg'],
              ratings: { average: 4.5, count: 10 },
            },
            {
              _id: '2',
              name: 'Test Product 2',
              description: 'Another test product',
              price: 149.99,
              category: 'Clothing',
              stock: 5,
              images: ['/test-product-2.jpg'],
              ratings: { average: 4.0, count: 5 },
            },
          ],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 2,
            pages: 1,
          },
        },
      }),
    );
  }),

  rest.get(`${API_BASE_URL}/products/:id`, (req, res, ctx) => {
    const { id } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        data: {
          product: {
            _id: id,
            name: 'Test Product',
            description: 'Detailed test product description',
            price: 99.99,
            category: 'Electronics',
            stock: 10,
            images: ['/test-product.jpg'],
            ratings: { average: 4.5, count: 10 },
          },
        },
      }),
    );
  }),
];

export const server = setupServer(...handlers);
