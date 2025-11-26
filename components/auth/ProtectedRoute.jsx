'use client';

import { LoadingScreen } from '@/components/common/Spinner';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';

function ProtectedRoute({ children, requireRole = null }) {
  const { user, isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // If not authenticated, show login modal
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Please sign in to access this page</p>
          </div>
          <LoginForm
            onSuccess={() => window.location.reload()}
            onSwitchToRegister={() => setShowLoginModal(true)}
          />
        </div>
      </div>
    );
  }

  // Check role if required
  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-12 w-12 text-red-600 dark:text-red-400"
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
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access this page.
          </p>
          <button onClick={() => router.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render protected content
  return children;
}

export default ProtectedRoute;
