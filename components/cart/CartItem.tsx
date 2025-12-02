'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/lib/hooks/useCart';

import { formatPrice } from '@/lib/utils/helpers';

function CartItem({ item, showFullDetails = false }) {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
      return;
    }

    if (newQuantity > item.stock) {
      return;
    }

    setIsUpdating(true);
    updateQuantity(item.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 200); // Small delay for visual feedback
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div
      className={`col flex items-center space-x-4 rounded-lg bg-white p-4 dark:bg-gray-800 ${
        showFullDetails ? 'border border-gray-200 dark:border-gray-700' : ''
      } ${isUpdating ? 'opacity-50' : ''}`}
    >
      {/* Product Image */}
      <Link href={`/product/${item.id}`} className="flex-shrink-0">
        <img
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          className="h-16 w-16 rounded-lg object-cover transition-opacity hover:opacity-80 sm:h-20 sm:w-20"
        />
      </Link>

      {/* Product Details */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/product/${item.id}`}
          className="block transition-colors hover:text-primary-600 dark:hover:text-primary-400"
        >
          <h3 className="truncate font-medium text-gray-900 dark:text-white">{item.name}</h3>
        </Link>

        <div className="mt-2 flex items-center gap-2 truncate">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>

          {showFullDetails && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {`( ${item.quantity} x ${formatPrice(item.price)} )`}
            </p>
          )}
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.stock && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">
            Only {item.stock} left in stock
          </p>
        )}
      </div>

      {/* Quantity Controls & Remove */}
      <div className="flex flex-col items-end space-y-2 truncate">
        {/* Quantity Controls */}
        <div className="flex gap-2">
          <div className="flex items-center space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating}
              className="rounded p-1 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-600"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="h-4 w-4" />
            </button>

            <span className="min-w-[2rem] px-3 py-1 text-center text-sm font-medium text-gray-900 dark:text-white">
              {item.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.stock}
              className="rounded p-1 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-600"
              aria-label="Increase quantity"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-1 text-gray-400 transition-colors hover:text-red-500 dark:hover:text-red-400"
            aria-label="Remove item"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
