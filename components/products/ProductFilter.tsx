'use client';

import { useState } from 'react';

import { FunnelIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { PRODUCT_CATEGORIES } from '@/lib/utils/constants';

function ProductFilter({ filters, onFilterChange, onClearFilters, productCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    rating: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange({ ...filters, [filterType]: value });
  };

  const handleSortByChange = ({ sortBy, sortOrder }) => {
    onFilterChange({ ...filters, sortBy, sortOrder });
  };

  const handlePriceChange = ({ minPrice, maxPrice }) => {
    onFilterChange({
      ...filters,
      ...(minPrice !== undefined ? { minPrice: +minPrice } : {}),
      ...(maxPrice !== undefined ? { maxPrice: +maxPrice } : {}),
    });
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key] !== undefined && filters[key] !== '' && filters[key] !== null
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-outline flex w-full items-center justify-center space-x-2"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="badge-primary text-xs">
              {Object.keys(filters).filter((key) => filters[key]).length}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar Filter */}
      <div className="hidden lg:block">
        <FilterContent
          filters={filters}
          expandedSections={expandedSections}
          onFilterChange={handleFilterChange}
          onPriceChange={handlePriceChange}
          onSortByChange={handleSortByChange}
          onClearFilters={onClearFilters}
          toggleSection={toggleSection}
          hasActiveFilters={hasActiveFilters}
          productCount={productCount}
        />
      </div>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div
            className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white shadow-xl dark:bg-gray-800"
          >
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <FilterContent
                filters={filters}
                expandedSections={expandedSections}
                onFilterChange={handleFilterChange}
                onPriceChange={handlePriceChange}
                onSortByChange={handleSortByChange}
                onClearFilters={() => {
                  onClearFilters();
                  setIsOpen(false);
                }}
                toggleSection={toggleSection}
                hasActiveFilters={hasActiveFilters}
                productCount={productCount}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterContent({
  filters,
  expandedSections,
  onFilterChange,
  onPriceChange,
  onSortByChange,
  onClearFilters,
  toggleSection,
  hasActiveFilters,
  productCount,
}) {
  return (
    <div className="space-y-6">
      {/* Results Counter */}
      <div className="text-sm text-gray-600 dark:text-gray-400">{productCount} products found</div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="btn btn-ghost flex w-full items-center space-x-2 bg-gray-200 text-left dark:bg-gray-700"
        >
          <XMarkIcon className="h-4 w-4" />
          <span>Clear all filters</span>
        </button>
      )}

      {/* Sort Options */}
      <div>
        <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Sort By</h3>
        <select
          value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onSortByChange({ sortBy, sortOrder });
          }}
          className="input text-sm"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="rating-desc">Top Rated</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
        <button
          onClick={() => toggleSection('category')}
          className="flex w-full items-center justify-between py-2 text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">Category</span>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${
              expandedSections.category ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.category && (
          <div
            className="mt-3 space-y-2 overflow-hidden"
          >
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => onFilterChange('category', '')}
                className="h-4 w-4 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                All Categories
              </span>
            </label>

            {PRODUCT_CATEGORIES.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={() => onFilterChange('category', category)}
                  className="h-4 w-4 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
        <button
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between py-2 text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">Price Range</span>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.price && (
          <div
            className="mt-3 space-y-3 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    onPriceChange({
                      minPrice: e.target.value,
                    })
                  }
                  className="input text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="$1000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => onPriceChange({ maxPrice: e.target.value })}
                  className="input text-sm"
                  min="0"
                />
              </div>
            </div>

            {/* Preset Price Ranges */}
            <div className="space-y-2">
              <div className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                Quick Select:
              </div>
              {[
                { label: 'Under $25', min: 0, max: 25 },
                { label: '$25 - $50', min: 25, max: 50 },
                { label: '$50 - $100', min: 50, max: 100 },
                { label: '$100 - $200', min: 100, max: 200 },
                { label: 'Over $200', min: 200, max: undefined },
              ].map(({ label, min, max }) => (
                <button
                  key={label}
                  onClick={() => {
                    onPriceChange({ minPrice: min, maxPrice: max });
                  }}
                  className={`block w-full rounded px-2 py-1 text-left text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    filters.minPrice === min && filters.maxPrice === max
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
        <button
          onClick={() => toggleSection('rating')}
          className="flex w-full items-center justify-between py-2 text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">Customer Rating</span>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${
              expandedSections.rating ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.rating && (
          <div
            className="mt-3 space-y-2 overflow-hidden"
          >
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.minRating === rating}
                  onChange={() => onFilterChange('minRating', rating)}
                  className="h-4 w-4 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
                />
                <div className="ml-3 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating
                            ? 'fill-current text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">& up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductFilter;
