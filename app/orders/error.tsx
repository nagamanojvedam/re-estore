'use client';

function error() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <svg
          className="h-12 w-12 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        Error Loading Orders
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {'Something went wrong while loading your orders.'}
      </p>
    </div>
  );
}

export default error;
