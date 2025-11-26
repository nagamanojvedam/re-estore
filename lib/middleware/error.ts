import mongoose from 'mongoose';
import ApiError from '@/lib/utils/ApiError';
import config from '@/lib/utils/config';

/**
 * Convert any thrown error into an ApiError instance
 */
export const convertError = (err: any): ApiError => {
  if (err instanceof ApiError) return err;

  const statusCode = err.statusCode || (err instanceof mongoose.Error ? 400 : 500);

  const message = err.message || 'Internal Server Error';

  return new ApiError(statusCode, message, false, err.stack);
};

/**
 * Create a clean JSON error response
 */
export const handleErrorResponse = (err: ApiError) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  const response: any = {
    status: 'error',
    message,
  };

  if (config.env === 'development') {
    response.stack = err.stack;
    console.error('API Error:', err);
  }

  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
};
