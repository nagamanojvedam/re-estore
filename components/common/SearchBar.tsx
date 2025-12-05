import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/lib/hooks/useDebounce';
import Spinner from './Spinner';
import { formatPrice } from '@/lib/utils/helpers';

function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedQuery.trim().length < 3) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const { products } = await productService.searchProducts(debouncedQuery, {
          limit: 8,
        });
        setResults(products);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set('search', query.trim());
      params.set('page', 1);
      navigate(`/shop?${params.toString()}`);
      onClose();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Spinner size="sm" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
        </div>
      )}

      {/* Search Results */}
      {showResults && !loading && (
        <div className="mt-4 max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="flex w-full items-center space-x-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <img
                    src={product.images?.[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-grow">
                    <h4 className="truncate font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </h4>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </p>
                    <p className="font-medium text-primary-600 dark:text-primary-400">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </button>
              ))}

              {query && (
                <div className="border-t border-gray-200 p-3 dark:border-gray-700">
                  <button
                    onClick={handleSearch}
                    className="w-full text-center font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    View all results for &ldquo;{query}&rdquo;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {`No products found for "${query}"`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
