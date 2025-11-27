'use client';

import { XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function error() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <XCircleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Product Not Found</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="space-y-3">
          <Link href="/shop" className="btn-primary w-full">
            Browse Products
          </Link>
          <Link href="/" className="btn-secondary w-full">
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default error;
