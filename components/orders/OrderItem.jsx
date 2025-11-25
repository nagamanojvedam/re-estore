import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@utils/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { formatDate, formatPrice } from '../../utils/helpers';
import { orderService } from '@services/orderService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function OrderItem({ order, queryKey }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

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

  const getPaymentStatusColor = status => {
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

  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: () => orderService.cancelMyOrder(order._id),
    onSuccess: () => {
      toast.success('Order cancelled!');
      queryClient.invalidateQueries([queryKey]);
    },
    onError: error => {
      toast.error('Failed to cancel order!');
      console.error(error);
    },
  });

  if (isCancelling) return <p>Loading...</p>;

  return (
    <div className="card">
      <div className="p-6">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
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
          {order.items.slice(0, 2).map(item => (
            <div key={item._id} className="flex items-center space-x-4">
              <img
                src={item.product.images?.[0] || '/placeholder-product.jpg'}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
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
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            {[ORDER_STATUSES.PENDING, ORDER_STATUSES.CONFIRMED].includes(
              order.status,
            ) && (
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
                    {order.items.map(item => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <img
                          src={
                            item.product.images?.[0] ||
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
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Order Summary
                    </h4>
                    <p className="text-sm font-semibold">
                      Payment Status:{' '}
                      <span
                        className={`${getPaymentStatusColor(order.paymentStatus)} mt-1`}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatPrice(order.subTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatPrice(order.shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tax
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatPrice(order.tax)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(order.totalAmount)}
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
