'use client';

import { LoadingScreen } from '@/components/common/Spinner';
import { ORDER_STATUSES } from '@/lib/utils/constants';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/helpers';
import { use } from 'react';

const STATUS_ORDER = [
  ORDER_STATUSES.PENDING,
  ORDER_STATUSES.CONFIRMED,
  ORDER_STATUSES.SHIPPED,
  ORDER_STATUSES.DELIVERED,
];

function OrderDetailPage({ params }) {
  const { id } = use(params);

  const {
    data,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <LoadingScreen message="Loading order details..." />;
  if (error) return <div className="text-red-500">Error loading order.</div>;
  if (!data?.order) return <div className="text-gray-700">Order not found.</div>;

  const { order } = data;

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Payment Status: {order.paymentStatus}
            </p>
          </div>

          {/* Status Tracker */}
          <div className="mb-8">
            <div className="relative flex items-center justify-between">
              {STATUS_ORDER.map((status, idx) => (
                <div key={status} className="relative flex flex-1 flex-col items-center">
                  <div
                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      idx <= currentStatusIndex
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  {idx < STATUS_ORDER.length - 1 && (
                    <div
                      className={`absolute left-[100%] top-3.5 h-0.5 w-full -translate-x-1/2 transform ${
                        idx < currentStatusIndex ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="card mb-6 p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Products</h2>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.items.map((item) => {
                return (
                  <div key={item._id} className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                      <img
                        src={item.product.images[0]}
                        alt={`${item.product.name} image`}
                        className="mr-4 h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Product ID: {item.product._id}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Summary */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Payment Summary
              </h2>

              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                {/* Order Amount / Subtotal */}
                <div className="flex justify-between">
                  <span>Order Amount</span>
                  <span>{formatPrice(order.subTotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>

                <hr className="border-gray-300 dark:border-gray-700" />

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  Payment Information
                </h3>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                  <p>
                    Method: <span className="font-medium capitalize">{order.paymentMethod}</span>
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-700 text-green-200'
                          : 'bg-red-700 text-red-200'
                      } rounded px-1.5 py-0.5 text-xs font-semibold capitalize`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Transaction ID:</span> {`TXID-${order._id}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="card mb-6 p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Shipping Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.street}</p>
            <p className="text-gray-700 dark:text-gray-300">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.country}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/orders" className="btn-outline">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
