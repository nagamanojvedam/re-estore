'use client';

import Pagination from '@/components/common/Pagination';
import ProductFilter from '@/components/products/ProductFilter';
import ProductList from '@/components/products/ProductList';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { productService } from '@/lib/services/productService';
import { ENV } from '@/lib/utils/constants';

import { useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';

function Shop() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['products', debouncedFilters],
    queryFn: () => {
      const cleanFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(
          ([_, value]) => value !== undefined && value !== '' && value !== null
        )
      );
      return productService.getProducts({ ...cleanFilters, isActive: true });
    },
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleFilterChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });
    newParams.set('page', '1'); // reset page
    router.push(`/shop?${newParams.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', newPage.toString());
    router.push(`/shop?${newParams.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set('sortBy', 'createdAt');
    params.set('sortOrder', 'desc');
    params.set('page', '1');
    params.set('limit', ENV.ITEMS_PER_PAGE.toString());
    router.push(`/shop?${params.toString()}`);
  };

  const products = productsData?.products;
  const pagination = productsData?.pagination || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-4 text-gray-900 dark:text-white">Shop All Products</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our wide range of quality products
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <div className="flex-shrink-0 lg:w-80">
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
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {isLoading ? 'Loading...' : `${pagination.total || 0} Products`}
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
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange({
                      ...filters,
                      sortBy,
                      sortOrder,
                    });
                  }}
                  className="input w-40 text-sm"
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
              <div
                className="mb-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                    Active filters:
                  </span>

                  {filters.search && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                      Search: {filters.search}
                      <button
                        onClick={() => handleFilterChange({ ...filters, search: '' })}
                        className="ml-2 text-primary-600 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {filters.category && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {filters.category}
                      <button
                        onClick={() => handleFilterChange({ ...filters, category: '' })}
                        className="ml-2 text-blue-600 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
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
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {`${Array.from({ length: +filters.minRating }).fill('⭐').join(' ')} & up`}
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
                    className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-300 hover:text-red-500"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div
            >
              <ProductList products={products} loading={isLoading} error={error} />
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div
                className="mt-12"
              >
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                  showInfo={true}
                />
              </div>
            )}

            {/* No Results Message */}
            {!isLoading && products?.length === 0 && (
              <div
                className="py-16 text-center"
              >
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <AdjustmentsHorizontalIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  No products found
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or browse our categories
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading shop...</p>
          </div>
        </div>
      }
    >
      <Shop />
    </Suspense>
  );
}
