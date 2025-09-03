import Pagination from '@components/common/Pagination';
import ProductFilter from '@components/products/ProductFilter';
import ProductList from '@components/products/ProductList';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@hooks/useDebounce';
import { productService } from '@services/productService';
import { ENV } from '@utils/constants';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => {
    return {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: +searchParams.get('minPrice') || undefined,
      maxPrice: +searchParams.get('maxPrice') || undefined,
      minRating: +searchParams.get('minRating') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: ENV.ITEMS_PER_PAGE,
    };
  }, [searchParams]);

  const debouncedFilters = useDebounce(filters, 600);

  // Fetch products with filters
  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', debouncedFilters],
    queryFn: () => {
      const cleanFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(
          ([_, value]) => value !== undefined && value !== '' && value !== null,
        ),
      );
      return productService.getProducts({ ...cleanFilters, isActive: true });
    },
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleFilterChange = newFilters => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });
    newParams.set('page', 1); // reset page
    setSearchParams(newParams);
  };

  const handlePageChange = newPage => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set('sortBy', 'createdAt');
    params.set('sortOrder', 'desc');
    params.set('page', 1);
    params.set('limit', ENV.ITEMS_PER_PAGE);
    setSearchParams(params);
  };

  const products = productsData?.products;
  const pagination = productsData?.pagination || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-2 text-gray-900 dark:text-white mb-4">
            Shop All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our wide range of quality products
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <ProductFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                productCount={pagination.total || 0}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {isLoading
                    ? 'Loading...'
                    : `${pagination.total || 0} Products`}
                </h2>

                {filters.search && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {`for "${filters.search}"`}
                  </span>
                )}
              </div>

              {/* Sort Dropdown - Mobile */}
              <div className="lg:hidden">
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={e => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange({
                      ...filters,
                      sortBy,
                      sortOrder,
                    });
                  }}
                  className="input text-sm w-40"
                >
                  <option value="createdAt-desc">Newest</option>
                  <option value="createdAt-asc">Oldest</option>
                  <option value="name-asc">A to Z</option>
                  <option value="name-desc">Z to A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.search ||
              filters.category ||
              filters.minPrice ||
              filters.maxPrice ||
              filters.minRating) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                    Active filters:
                  </span>

                  {filters.search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                      Search: {filters.search}
                      <button
                        onClick={() =>
                          handleFilterChange({ ...filters, search: '' })
                        }
                        className="ml-2 text-primary-600 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {filters.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {filters.category}
                      <button
                        onClick={() =>
                          handleFilterChange({ ...filters, category: '' })
                        }
                        className="ml-2 text-blue-600 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                      <button
                        onClick={() =>
                          handleFilterChange({
                            ...filters,
                            minPrice: undefined,
                            maxPrice: undefined,
                          })
                        }
                        className="ml-2 text-green-600 hover:text-green-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.minRating && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {`${Array.from({ length: +filters.minRating })
                        .fill('⭐')
                        .join(' ')} & up`}
                      <button
                        onClick={() =>
                          handleFilterChange({
                            ...filters,
                            minPrice: undefined,
                            maxPrice: undefined,
                          })
                        }
                        className="ml-2 text-green-600 hover:text-green-700"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  <button
                    onClick={clearFilters}
                    className="text-sm px-2 py-1 rounded text-white bg-red-500 hover:bg-red-300 hover:text-red-500"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProductList
                products={products}
                loading={isLoading}
                error={error}
              />
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                  showInfo={true}
                />
              </motion.div>
            )}

            {/* No Results Message */}
            {!isLoading && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <AdjustmentsHorizontalIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or browse our categories
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
