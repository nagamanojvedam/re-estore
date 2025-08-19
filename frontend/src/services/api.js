import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create axios instance with Vite env vars
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Development logging
if (import.meta.env.DEV) {
  api.interceptors.request.use(req => {
    console.log('🚀 API Request:', req.method?.toUpperCase(), req.url, req.data)
    return req
  })

  api.interceptors.response.use(
    res => {
      console.log('✅ API Response:', res.config.url, res.status, res.data)
      return res
    },
    err => {
      console.error(
        '❌ API Error:',
        err.config?.url,
        err.response?.status,
        err.response?.data
      )
      return Promise.reject(err)
    }
  )
}

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor with improved error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { token } = response.data.data.tokens.access
          localStorage.setItem('token', token)

          // Update the authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          originalRequest.headers.Authorization = `Bearer ${token}`

          // Retry original request
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')

        // Only redirect if we're not already on the home page
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }

        return Promise.reject(refreshError)
      }
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.')
      return Promise.reject(error)
    }

    // Handle other errors with better messaging
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred'

    // Don't show toast for certain errors
    const silentErrors = [401, 403]
    const isValidationError =
      error.response?.status === 400 && error.response?.data?.details

    if (!silentErrors.includes(error.response?.status) && !isValidationError) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api

// Export individual methods for better tree-shaking
export const { get, post, put, patch, delete: del } = api
