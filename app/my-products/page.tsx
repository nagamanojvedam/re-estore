'use client';


import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/lib/services/userService';

import Pagination from '@/components/common/Pagination';
import { LoadingScreen } from '@/components/common/Spinner';
import ProductReviewCard from '@/components/products/ProductReviewCard';

export default function MyProducts() {
  const [page, setPage] = useState(1);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['myProducts', page],
    queryFn: () => userService.getMyProducts({ page, limit: 5 }),
  });

  if (isLoading) return <LoadingScreen message="Loading your products" />;

  const { products, pagination } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div
          className="mx-auto max-w-6xl"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">My Products</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View purchased products and leave reviews
            </p>
          </div>

          {/* Products */}
          <div>
            {/* Product List */}
            <ul
              role="list"
              aria-label="Purchased products"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {products.map((item: any) => (
                <ProductReviewCard
                  key={item._id}
                  item={item}
                  page={page}

                />
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div
              className="mt-8"
            >
              <Pagination
                currentPage={page}
                totalPages={pagination.pages}
                onPageChange={setPage}
                showInfo={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
