import React from 'react'
import { useQuery } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { orderService } from '@services/orderService'
import { LoadingScreen } from '@components/common/Spinner'
import { ORDER_STATUSES } from '@utils/constants'

const STATUS_ORDER = [
  ORDER_STATUSES.PENDING,
  ORDER_STATUSES.CONFIRMED,
  ORDER_STATUSES.SHIPPED,
  ORDER_STATUSES.DELIVERED,
]

function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery(
    ['order', id],
    () => orderService.getOrder(id),
    {
      staleTime: 5 * 60 * 1000,
    }
  )

  if (isLoading) return <LoadingScreen message="Loading order details..." />
  if (error) return <div className="text-red-500">Error loading order.</div>
  if (!data?.order) return <div className="text-gray-700">Order not found.</div>

  const { order } = data

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
            <div className="flex items-center justify-between relative">
              {STATUS_ORDER.map((status, idx) => (
                <div
                  key={status}
                  className="flex-1 flex flex-col items-center relative"
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${
                      idx <= currentStatusIndex
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  {idx < STATUS_ORDER.length - 1 && (
                    <div
                      className={`absolute top-3.5 left-[100%] w-full h-0.5 transform -translate-x-1/2 ${
                        idx < currentStatusIndex
                          ? 'bg-primary-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Products
            </h2>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.items.map(item => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Product ID: {item.product}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 text-lg font-semibold">
              Total: ${order.totalAmount.toFixed(2)}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Shipping Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {order.shippingAddress.street}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button onClick={() => navigate(-1)} className="btn-outline">
              Back to Orders
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderDetailPage
