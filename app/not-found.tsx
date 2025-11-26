'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

function NotFound() {
  const router = useRouter();

  const popularLinks = [
    { name: 'Shop All Products', path: '/shop', icon: ShoppingBagIcon },
    {
      name: 'Electronics',
      path: '/shop?category=Electronics',
      icon: ShoppingBagIcon,
    },
    {
      name: 'Clothing',
      path: '/shop?category=Clothing',
      icon: ShoppingBagIcon,
    },
    { name: 'Books', path: '/shop?category=Books', icon: ShoppingBagIcon },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div>
          {/* 404 Illustration */}
          <div className="mb-8">
            <div
              className="mb-4 text-9xl font-bold text-primary-600 dark:text-primary-400"
            >
              404
            </div>
            <div
              className="mb-4 text-6xl"
            >
              🛍️
            </div>
          </div>

          {/* Error Message */}
          <div
            className="mb-8"
          >
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
              Oops! The page you're looking for seems to have wandered off into the digital
              wilderness.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Don't worry, it happens to the best of us. Let's get you back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className="mb-12 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => router.back()}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Go Back</span>
            </button>

            <Link href="/" className="btn-primary flex items-center justify-center space-x-2">
              <HomeIcon className="h-5 w-5" />
              <span>Go Home</span>
            </Link>

            <Link href="/shop" className="btn-outline flex items-center justify-center space-x-2">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Browse Products</span>
            </Link>
          </div>

          {/* Popular Links */}
          <div
            className="border-t border-gray-200 pt-8 dark:border-gray-700"
          >
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Or try these popular sections:
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {popularLinks.map((link, index) => (
                <div
                  key={link.name}
                >
                  <Link
                    href={link.path}
                    className="group flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-primary-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-gray-800"
                  >
                    <link.icon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    <span className="font-medium text-gray-700 group-hover:text-primary-600 dark:text-gray-300 dark:group-hover:text-primary-400">
                      {link.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div
            className="mt-12 rounded-lg bg-primary-50 p-6 dark:bg-primary-900/20"
          >
            <h3 className="mb-2 text-sm font-medium text-primary-900 dark:text-primary-100">
              💡 Did you know?
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-300">
              The HTTP 404 error was named after room 404 at CERN, where the World Wide Web was
              born. Though this is actually a myth – but it makes for a good story!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
