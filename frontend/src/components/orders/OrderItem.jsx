import React, { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { ORDER_STATUSES } from '@utils/constants';
import { Link } from 'react-router-dom';

function OrderItem({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = status => {
    switch (status) {
      case ORDER_STATUSES.PENDING:
        return 'badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case ORDER_STATUSES.CONFIRMED:
        return 'badge bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case ORDER_STATUSES.SHIPPED:
        return 'badge bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case ORDER_STATUSES.DELIVERED:
        return 'badge bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case ORDER_STATUSES.CANCELLED:
        return 'badge bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'badge bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="card">
      <div className="p-6">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-red-500">
              <Link to={`/orders/${order._id}`}>
                Order #{order.orderNumber}
              </Link>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="space-y-3">
          {order.items.slice(0, 2).map(item => {
            const randomImageIndex = Math.floor(
              Math.random() * item.product.images.length,
            );

            return (
              <div key={item._id} className="flex items-center space-x-4">
                <img
                  src={
                    item.product.images?.[randomImageIndex] ||
                    '/placeholder-product.jpg'
                  }
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            );
          })}

          {order.items.length > 2 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +{order.items.length - 2} more items
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            {order.status === ORDER_STATUSES.SHIPPED && (
              <button className="btn btn-outline btn-sm flex items-center space-x-2">
                <TruckIcon className="w-4 h-4" />
                <span>Track Order</span>
              </button>
            )}

            {order.status === ORDER_STATUSES.DELIVERED && (
              <button className="btn btn-outline btn-sm">Leave Review</button>
            )}

            {[ORDER_STATUSES.PENDING, ORDER_STATUSES.CONFIRMED].includes(
              order.status,
            ) && (
              <button className="btn btn-danger btn-sm">Cancel Order</button>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-ghost btn-sm flex items-center space-x-1"
          >
            <span>{isExpanded ? 'Less' : 'More'} Details</span>
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {/* All Items */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-3">
                    {order.items.map(item => {
                      const randomImageIndex = Math.floor(
                        Math.random() * item.product.images.length,
                      );
                      return (
                        <div
                          key={item._id}
                          className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <img
                            src={
                              item.product.images?.[randomImageIndex] ||
                              '/placeholder-product.jpg'
                            }
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {item.product.name}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.product.category}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">
                              ${item.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              each
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${(order.totalAmount - 10).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        $10.00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tax
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        $0.00
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OrderItem;
