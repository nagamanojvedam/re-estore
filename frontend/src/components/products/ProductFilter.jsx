import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { PRODUCT_CATEGORIES } from '@utils/constants';

function ProductFilter({
  filters,
  onFilterChange,
  onClearFilters,
  productCount = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    rating: false,
  });

  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange({ ...filters, [filterType]: value });
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...filters,
      [type]: value ? +value : undefined,
    });
  };

  const hasActiveFilters = Object.keys(filters).some(
    key =>
      filters[key] !== undefined &&
      filters[key] !== '' &&
      filters[key] !== null,
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full btn btn-outline flex items-center justify-center space-x-2"
        >
          <FunnelIcon className="w-5 h-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="badge-primary text-xs">
              {Object.keys(filters).filter(key => filters[key]).length}
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
          onClearFilters={onClearFilters}
          toggleSection={toggleSection}
          hasActiveFilters={hasActiveFilters}
          productCount={productCount}
        />
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <FilterContent
                  filters={filters}
                  expandedSections={expandedSections}
                  onFilterChange={handleFilterChange}
                  onPriceChange={handlePriceChange}
                  onClearFilters={() => {
                    onClearFilters();
                    setIsOpen(false);
                  }}
                  toggleSection={toggleSection}
                  hasActiveFilters={hasActiveFilters}
                  productCount={productCount}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterContent({
  filters,
  expandedSections,
  onFilterChange,
  onPriceChange,
  onClearFilters,
  toggleSection,
  hasActiveFilters,
  productCount,
}) {
  return (
    <div className="space-y-6">
      {/* Results Counter */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {productCount} products found
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full btn btn-ghost text-left flex items-center space-x-2 dark:bg-gray-700"
        >
          <XMarkIcon className="w-4 h-4" />
          <span>Clear all filters</span>
        </button>
      )}

      {/* Category Filter */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            Category
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              expandedSections.category ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {expandedSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={!filters.category}
                  onChange={() => onFilterChange('category', '')}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-primary-600"
                />
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  All Categories
                </span>
              </label>

              {PRODUCT_CATEGORIES.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={() => onFilterChange('category', category)}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-primary-600"
                  />
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    {category}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 bg-red-700">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            Price Range
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              expandedSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-3 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={filters.minPrice || ''}
                    onChange={e => onPriceChange('minPrice', e.target.value)}
                    className="input text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="$1000"
                    value={filters.maxPrice || ''}
                    onChange={e => onPriceChange('maxPrice', e.target.value)}
                    className="input text-sm"
                    min="0"
                  />
                </div>
              </div>

              {/* Preset Price Ranges */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      onPriceChange('minPrice', min);
                      onPriceChange('maxPrice', max);
                    }}
                    className={`block w-full text-left text-xs py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      filters.minPrice === min && filters.maxPrice === max
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating Filter */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            Customer Rating
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              expandedSections.rating ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.minRating === rating}
                    onChange={() => onFilterChange('minRating', rating)}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-primary-600"
                  />
                  <div className="ml-3 flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                      & up
                    </span>
                  </div>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          Sort By
        </h3>
        <select
          value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
          onChange={e => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFilterChange('sortBy', sortBy);
            onFilterChange('sortOrder', sortOrder);
          }}
          className="input text-sm"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}

export default ProductFilter;
