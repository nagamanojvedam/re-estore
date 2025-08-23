import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../../hooks/useDebounce';
import { productService } from '../../services/productService';
import Spinner from './Spinner';

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
        const { products } = await productService.searchProducts(
          debouncedQuery,
          {
            limit: 8,
          },
        );
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

  const handleProductClick = productId => {
    navigate(`/product/${productId}`);
    onClose();
  };

  const handleSearch = e => {
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
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Spinner size="sm" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Searching...
          </span>
        </div>
      )}

      {/* Search Results */}
      {showResults && !loading && (
        <div className="mt-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map(product => {
                const randomImageIndex = Math.floor(
                  Math.random() * product.images.length,
                );

                return (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <img
                      src={
                        product.images?.[randomImageIndex] ||
                        '/placeholder-image.jpg'
                      }
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {product.category}
                      </p>
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                );
              })}

              {query && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                  <button
                    onClick={handleSearch}
                    className="w-full text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
