import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useCart } from '@hooks/useCart'
import { motion } from 'framer-motion'

function CartItem({ item, showFullDetails = false }) {
  const { updateQuantity, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(item.id)
      return
    }

    if (newQuantity > item.stock) {
      return
    }

    setIsUpdating(true)
    updateQuantity(item.id, newQuantity)
    setTimeout(() => setIsUpdating(false), 200) // Small delay for visual feedback
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg ${
        showFullDetails ? 'border border-gray-200 dark:border-gray-700' : ''
      } ${isUpdating ? 'opacity-50' : ''}`}
    >
      {/* Product Image */}
      <Link to={`/product/${item.id}`} className="flex-shrink-0">
        <img
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg hover:opacity-80 transition-opacity"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link 
          to={`/product/${item.id}`}
          className="block hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
            {item.name}
          </h3>
        </Link>
        
        {showFullDetails && item.variant && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {item.variant}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${item.price.toFixed(2)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {showFullDetails && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          )}
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.stock && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            Only {item.stock} left in stock
          </p>
        )}
      </div>

      {/* Quantity Controls & Remove */}
      <div className="flex flex-col items-end space-y-2">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating || item.quantity >= item.stock}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label="Remove item"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default CartItem
