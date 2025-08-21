import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';

import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { authService } from '../services/authService';
import { UserIcon } from '@heroicons/react/24/outline';
import OrderCard from '@components/dashboard/OrderCard';
import ProductCard from '@components/dashboard/ProductCard';
import UserCard from '@components/dashboard/UserCard';

export default function AdminDashboard() {
  const [tab, setTab] = useState('orders');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setTab('orders')}
          className={`pb-2 px-4 ${
            tab === 'orders'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setTab('products')}
          className={`pb-2 px-4 ${
            tab === 'products'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('users')}
          className={`pb-2 px-4 ${
            tab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Users
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'users' && <UsersTab />}
    </div>
  );
}

/* ---------------- Orders Tab ---------------- */
function OrdersTab() {
  const { data, isLoading } = useQuery(['adminOrders'], () =>
    orderService.getAllOrders(),
  );

  const updateStatusMutation = useMutation(orderService.updateOrderStatus);

  if (isLoading) return <p>Loading orders...</p>;

  const orders = data?.orders;

  return (
    <div className="space-y-4">
      {orders?.map(order => (
        <OrderCard
          key={order._id}
          order={order}
          updateStatusMutation={updateStatusMutation}
        />
      ))}
    </div>
  );
}

/* ---------------- Products Tab ---------------- */
function ProductsTab() {
  const { data, isLoading } = useQuery('adminProducts', () =>
    productService.getProducts(),
  );
  const toggleMutation = useMutation(productService.deleteProduct);

  if (isLoading) return <p>Loading products...</p>;

  const products = data?.products;

  return (
    <div className="grid gap-4">
      {products?.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          toggleMutation={toggleMutation}
        />
      ))}
    </div>
  );
}

/* ---------------- Users Tab ---------------- */
function UsersTab() {
  const { data, isLoading } = useQuery('adminUsers', () =>
    authService.getAllUsers(),
  );
  const toggleUserMutation = useMutation(authService.toggleUserActive);

  if (isLoading) return <p>Loading users...</p>;

  const users = data?.users;
  // Filter out admin users
  const regularUsers = users?.filter(u => u.role === 'user') || [];

  return (
    <div className="space-y-4">
      {regularUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No regular users found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {regularUsers.map(user => (
            <UserCard
              key={user._id}
              user={user}
              toggleUserMutation={toggleUserMutation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
