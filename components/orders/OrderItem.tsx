'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/utils/constants';

import { cancelOrderAction } from '@/lib/actions/cancelOrderAction';
import { formatDate, formatPrice } from '@/lib/utils/helpers';
import Link from 'next/link';
import { useState, useTransition } from 'react';

function OrderItem({ order, queryKey }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [_, startTransition] = useTransition();

  const getStatusColor = (status) => {
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUSES.PENDING:
        return 'badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case PAYMENT_STATUSES.PAID:
        return 'badge bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case PAYMENT_STATUSES.FAILED:
        return 'badge bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case PAYMENT_STATUSES.REFUNDED:
        return 'badge bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'badge bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const cancelOrder = () => {
    startTransition(() => {
      cancelOrderAction(order._id);
    });
  };

  return (
    <div className="card">
      <div className="p-6">
        {/* Order Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-red-500 dark:text-white">
                <Link href={`/orders/${order._id}`}>Order #{order.orderNumber}</Link>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <span className={`${getStatusColor(order.status)} mt-1`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="space-y-3">
          {order.items.slice(0, 2).map((item) => (
            <div key={item._id} className="flex items-center space-x-4">
              <img
                src={item.product.images?.[0] || '/placeholder-product.jpg'}
                alt={item.product.name}
                className="h-12 w-12 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {item.product.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatPrice(item.quantity * item.price)}
              </span>
            </div>
          ))}

          {order.items.length > 2 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +{order.items.length - 2} more items
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex space-x-3">
            {[ORDER_STATUSES.PENDING, ORDER_STATUSES.CONFIRMED].includes(order.status) && (
              <button className="btn btn-danger btn-sm" onClick={cancelOrder}>
                Cancel Order
              </button>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-ghost btn-sm flex items-center space-x-1"
          >
            <span>{isExpanded ? 'Less' : 'More'} Details</span>
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Expanded Details */}
        {/* Expanded Details */}
        {isExpanded && (
          <div className="overflow-hidden">
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
              {/* All Items */}
              <div className="mb-6">
                <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                  Items ({order.items.length})
                </h4>
                <div className="max-h-[400px] space-y-3 overflow-y-auto">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                    >
                      <img
                        src={item.product.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="h-16 w-16 rounded object-cover"
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
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {`${formatPrice(item.price)} each`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mb-6">
                  <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Order Summary</h4>
                  <p className="text-sm font-semibold">
                    Payment Status:{' '}
                    <span className={`${getPaymentStatusColor(order.paymentStatus)} mt-1`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatPrice(order.subTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatPrice(order.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 dark:border-gray-600">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderItem;
