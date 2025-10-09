import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

import Pagination from '../components/common/Pagination';
import { LoadingScreen } from '../components/common/Spinner';
import ProductReviewCard from '../components/products/ProductReviewCard';

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View purchased products and leave reviews
            </p>
          </div>

          {/* Products */}
          <div>
            {/* Product List */}
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { when: 'beforeChildren', staggerChildren: 0.05 },
                },
              }}
              role="list"
              aria-label="Purchased products"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {products.map(item => (
                <ProductReviewCard
                  key={item._id} // stable unique key
                  item={item}
                  page={page}
                  itemVariants={{
                    // child participates in parent variants
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                />
              ))}
            </motion.ul>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Pagination
                currentPage={page}
                totalPages={pagination.pages}
                onPageChange={setPage}
                showInfo={true}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
