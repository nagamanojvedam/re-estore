'use client';

import { useRouter } from 'next/navigation';

function Activefilters({ total, filters }) {
  const router = useRouter();
  const params = new URLSearchParams(filters);

  const handleFilterChange = (newFilters: any) => {
    Object.entries(newFilters).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };
  const clearFilters = () => {
    router.push('/shop');
  };

  return (
    <div>
      <div className="mb-4 flex items-center space-x-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {`${total || 0} Products`}
        </h2>

        {filters.search && (
          <span className="text-gray-500 dark:text-gray-400">{`for "${filters.search}"`}</span>
        )}
      </div>
      {/* Active filters */}
      {(filters.search ||
        filters.category ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.minRating) && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">Active filters:</span>

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
    </div>
  );
}

export default Activefilters;
