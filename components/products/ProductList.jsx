'use client';

import React from 'react';

import ProductCard from './ProductCard';
// import ProductCardSkeleton from './ProductCardSkeleton'

function ProductList({ products, loading, error, className = '' }) {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}
      >
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
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
              d="M12 9v2m0 4h.01"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          Error Loading Products
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {error.message || 'Something went wrong while loading products.'}
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg
            className="h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          No Products Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We couldn't find any products matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}

// Skeleton component for loading state
function ProductCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-8 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export default ProductList;
