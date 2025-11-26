import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { formatDate, formatPrice } from '@/lib/utils/helpers';

const allowedStatus = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const OrderCard = ({ order, updateStatusMutation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);

  const getStatusStage = (status) => {
    const stages = {
      pending: 1,
      confirmed: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 0,
    };
    return stages[status] || 1;
  };

  const getStatusColor = (stage, currentStage) => {
    if (currentStage === 0) return 'bg-red-500'; // cancelled
    if (stage <= currentStage) return 'bg-green-500'; // completed
    return 'bg-gray-300'; // pending
  };

  const currentStage = getStatusStage(status);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order #{order.orderNumber}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(order.totalAmount)}
          </p>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              order.paymentStatus === 'paid'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : order.paymentStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mt-4">
        <p className="font-medium text-gray-900 dark:text-white">{order.user.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</p>
      </div>

      {/* Status */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Order Status</span>
          <select
            value={status}
            onChange={(e) => {
              updateStatusMutation({
                id: order._id,
                status: e.target.value,
              });
              setStatus(e.target.value);
            }}
            className="rounded-md border bg-gray-50 px-2 py-1 text-xs capitalize focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          >
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((item, idx) => (
              <option
                key={idx + 1}
                value={item}
                className="capitalize"
                disabled={currentStage === item || !allowedStatus[status].includes(item)}
              >
                {item}
              </option>
            ))}
            {/* // <option value="pending">Pending</option>
            // <option value="confirmed">Confirmed</option>
            // <option value="shipped">Shipped</option>
            // <option value="delivered">Delivered</option>
            // <option value="cancelled">Cancelled</option> */}
          </select>
        </div>

        {status !== 'cancelled' ? (
          <div className="flex items-center">
            {[1, 2, 3, 4].map((stage) => (
              <div key={stage} className="flex items-center">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(stage, currentStage)}`} />
                {stage < 4 && (
                  <div
                    className={`h-0.5 w-12 ${
                      stage < currentStage ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
            <span className="ml-2 text-xs capitalize text-gray-600 dark:text-gray-400">
              {status}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-red-600">Cancelled</span>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <span>{isExpanded ? 'Show less details' : 'Show more details'}</span>
        {isExpanded ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="mt-6 space-y-6 border-t border-gray-200 pt-4 dark:border-gray-700">
          {/* Shipping */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Shipping Address</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
              Items ({order.items.length})
            </h4>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {item.product.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.product.category}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-500">{formatPrice(item.product.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold dark:border-gray-700">
                <span>Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Payment Status:</span>
                <span className="capitalize">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Order Timeline</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Order Created:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Reference */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Reference</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono text-xs">{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer ID:</span>
                <span className="font-mono text-xs">{order.user._id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
