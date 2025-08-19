// Environment variables with Vite
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'EStore',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Your Shopping Destination',
  ITEMS_PER_PAGE: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE) || 12,
  SEARCH_DEBOUNCE_MS: parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE_MS) || 300,
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/users/me',
  },
  PRODUCTS: {
    BASE: '/products',
    SEARCH: '/products/search',
  },
  ORDERS: {
    BASE: '/orders',
    ME: '/orders/me',
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
  },
}

// Product categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Beauty & Personal Care',
  'Automotive',
  'Toys & Games',
  'Health & Wellness',
  'Food & Beverages',
]

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: ENV.ITEMS_PER_PAGE,
  MAX_LIMIT: 100,
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  CART_ITEMS: 'cartItems',
  USER_PREFERENCES: 'userPreferences',
}

// Theme configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

// Animation durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
}

// Toast configuration
export const TOAST_CONFIG = {
  DURATION: 4000,
  POSITION: 'top-right',
}

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
}

// Feature flags
export const FEATURES = {
  DARK_MODE: ENV.ENABLE_DARK_MODE,
  WISHLIST: true,
  REVIEWS: true,
  SOCIAL_LOGIN: false,
  NEWSLETTER: true,
  PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
}

// Social links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
  YOUTUBE: 'https://youtube.com',
}

// Contact information
export const CONTACT_INFO = {
  EMAIL: 'support@estore.com',
  PHONE: '+1 (555) 123-4567',
  ADDRESS: '123 Commerce Street, Business District, City 12345',
}
