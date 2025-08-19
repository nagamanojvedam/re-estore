import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { LoadingScreen } from '@components/common/Spinner'
import LoginForm from './LoginForm'

function ProtectedRoute({ children, requireRole = null }) {
  const { user, isAuthenticated, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />
  }

  // If not authenticated, show login modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to access this page
            </p>
          </div>
          <LoginForm
            onSuccess={() => window.location.reload()}
            onSwitchToRegister={() => setShowLoginModal(true)}
          />
        </div>
      </div>
    )
  }

  // Check role if required
  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access this page.
          </p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Render protected content
  return children
}

export default ProtectedRoute
