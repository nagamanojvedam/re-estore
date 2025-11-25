"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

function NotFound() {
  const router = useRouter();

  const popularLinks = [
    { name: "Shop All Products", path: "/shop", icon: ShoppingBagIcon },
    {
      name: "Electronics",
      path: "/shop?category=Electronics",
      icon: ShoppingBagIcon,
    },
    {
      name: "Clothing",
      path: "/shop?category=Clothing",
      icon: ShoppingBagIcon,
    },
    { name: "Books", path: "/shop?category=Books", icon: ShoppingBagIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4"
            >
              404
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-6xl mb-4"
            >
              🛍️
            </motion.div>
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Oops! The page you're looking for seems to have wandered off into
              the digital wilderness.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Don't worry, it happens to the best of us. Let's get you back on
              track!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => router.back()}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Go Back</span>
            </button>

            <Link
              href="/"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Go Home</span>
            </Link>

            <Link
              href="/shop"
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Browse Products</span>
            </Link>
          </motion.div>

          {/* Popular Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Or try these popular sections:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Link
                    href={link.path}
                    className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                  >
                    <link.icon className="w-6 h-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
          >
            <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
              💡 Did you know?
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-300">
              The HTTP 404 error was named after room 404 at CERN, where the
              World Wide Web was born. Though this is actually a myth – but it
              makes for a good story!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;
