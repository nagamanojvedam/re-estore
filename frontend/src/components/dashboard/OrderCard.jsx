import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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

  const getStatusStage = status => {
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

  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatCurrency = amount =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const currentStage = getStatusStage(status);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            Order #{order.orderNumber}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900 dark:text-white">
            {formatCurrency(order.totalAmount)}
          </p>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.paymentStatus === 'paid'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : order.paymentStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {order.paymentStatus.charAt(0).toUpperCase() +
              order.paymentStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mt-4">
        <p className="font-medium text-gray-900 dark:text-white">
          {order.user.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {order.user.email}
        </p>
      </div>

      {/* Status */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Order Status
          </span>
          <select
            value={status}
            onChange={e => {
              updateStatusMutation.mutate({
                id: order._id,
                status: e.target.value,
              });
              setStatus(e.target.value);
            }}
            className="text-xs border rounded-md px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 capitalize"
          >
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(
              (item, idx) => (
                <option
                  key={idx + 1}
                  value={item}
                  className="capitalize"
                  disabled={
                    currentStage === item ||
                    !allowedStatus[status].includes(item)
                  }
                >
                  {item}
                </option>
              ),
            )}
            {/* // <option value="pending">Pending</option>
            // <option value="confirmed">Confirmed</option>
            // <option value="shipped">Shipped</option>
            // <option value="delivered">Delivered</option>
            // <option value="cancelled">Cancelled</option> */}
          </select>
        </div>

        {status !== 'cancelled' ? (
          <div className="flex items-center ">
            {[1, 2, 3, 4].map(stage => (
              <div key={stage} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    stage,
                    currentStage,
                  )}`}
                />
                {stage < 4 && (
                  <div
                    className={`h-0.5 w-12  ${
                      stage < currentStage ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
            <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 capitalize">
              {status}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-red-600">Cancelled</span>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
      >
        <span>{isExpanded ? 'Show less details' : 'Show more details'}</span>
        {isExpanded ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </button>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="mt-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Shipping */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Shipping Address
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
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
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Items ({order.items.length})
            </h4>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.items.map(item => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                      {item.product.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.product.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.product.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Order Summary
            </h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Payment Status:</span>
                <span className="capitalize">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Order Timeline
            </h4>
            <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
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
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Reference
            </h4>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
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
