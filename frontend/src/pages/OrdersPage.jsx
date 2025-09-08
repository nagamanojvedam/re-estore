import Pagination from '@components/common/Pagination';
import OrderList from '@components/orders/OrderList';
import { orderService } from '@services/orderService';
import { ORDER_STATUSES } from '@utils/constants';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

function OrdersPage() {
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 5,
  });

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery(['orders', filters], () => orderService.getMyOrders(filters), {
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });

  const handleStatusFilter = status => {
    setFilters(prev => ({
      ...prev,
      status: status === prev.status ? '' : status,
      page: 1,
    }));
  };

  const handlePageChange = page => {
    setFilters(prev => ({ ...prev, page }));
    // window.scrollTo({ top: 0, behavior: 'smooth' })
  };

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || {};

  const statusCounts = {
    all: pagination.total || 0,
    pending: 0, // These would come from API
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  const statusTabs = [
    { key: '', label: 'All Orders', count: statusCounts.all },
    {
      key: ORDER_STATUSES.PENDING,
      label: 'Pending',
      count: statusCounts.pending,
    },
    {
      key: ORDER_STATUSES.CONFIRMED,
      label: 'Confirmed',
      count: statusCounts.confirmed,
    },
    {
      key: ORDER_STATUSES.SHIPPED,
      label: 'Shipped',
      count: statusCounts.shipped,
    },
    {
      key: ORDER_STATUSES.DELIVERED,
      label: 'Delivered',
      count: statusCounts.delivered,
    },
    {
      key: ORDER_STATUSES.CANCELLED,
      label: 'Cancelled',
      count: statusCounts.cancelled,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your order history
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap gap-2 mb-6">
            {statusTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.status === tab.key
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <OrderList
              orders={orders}
              loading={isLoading}
              error={error}
              queryKey={['orders', filters]}
            />
          </motion.div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </motion.div>
          )}

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 card p-6 text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Have questions about your orders? We&apos;re here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-outline">
                Contact Support
              </Link>
              <Link to="/returns" className="btn-secondary">
                Return Policy
              </Link>
              <Link to="/shipping" className="btn-secondary">
                Shipping Info
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default OrdersPage;
