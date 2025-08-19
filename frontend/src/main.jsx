import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/globals.css'

// Create a client with optimized defaults for Vite
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error?.status === 404 || error?.status === 403) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
})

// Error boundary for development
if (import.meta.env.DEV) {
  // Only in development
  console.log('🚀 Development mode enabled')
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          gutter={8}
          containerStyle={{
            top: 80,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg, #363636)',
              color: 'var(--toast-color, #fff)',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
              style: {
                background: '#065f46',
                color: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
              style: {
                background: '#991b1b',
                color: '#ffffff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>
)
