import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { formatDate, formatPrice } from '../../utils/helpers';

const ProductCard = ({ product, toggleMutation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isActive, setIsActive] = useState(product.isActive);
  const [stock, setStock] = useState(product.stock);
  const [isLoading, setIsLoading] = useState(false);

  const handleStockChange = async delta => {
    try {
      setIsLoading(true);
      const res = await productService.updateProduct(product._id, {
        stock: Math.max(0, stock + delta),
      });
      setStock(res.product.stock);
      toast.success('Stock updated successfully');
    } catch (err) {
      toast.error('Failed to update stock');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = stock => {
    if (stock === 0)
      return {
        text: 'Out of Stock',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      };
    if (stock <= 10)
      return {
        text: 'Low Stock',
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      };
    return {
      text: 'In Stock',
      color:
        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };
  };

  const renderStars = (average, count) => {
    const stars = [];
    const wholeStars = Math.floor(average);
    const hasHalfStar = average % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < wholeStars) {
        stars.push(
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />,
        );
      } else if (i === wholeStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <StarIcon className="w-4 h-4 text-gray-300 absolute" />
            <StarIconSolid className="w-4 h-4 text-yellow-400 absolute clip-half" />
          </div>,
        );
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({count} reviews)
        </span>
      </div>
    );
  };

  const stockStatus = getStockStatus(stock);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 transition hover:shadow-md">
      {/* Main Details Section */}
      <div className="space-y-3">
        {/* Header with Image and Basic Info */}
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                {product.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Basic Product Info */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.category}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Stock and Rating */}
            <div className="flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
              >
                {stockStatus.text} ({stock})
              </span>
              {renderStars(product.ratings.average, product.ratings.count)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            <span>
              {isExpanded ? 'Show less details' : 'Show more details'}
            </span>
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => {
              toggleMutation(product._id);
              setIsActive(!isActive);
            }}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Product Description */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Description
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
          </div>

          {/* Product Images Gallery */}
          {product.images && product.images.length > 1 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Images ({product.images.length})
              </h4>
              <div className="flex  space-x-2 overflow-x-auto p-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 ${
                      index === currentImageIndex
                        ? 'ring-2 ring-primary-500'
                        : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Owner Information */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Owner Information
            </h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span>{product.owner.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span>{product.owner.email}</span>
              </div>
            </div>
          </div>

          {/* Product Stats */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Product Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Stock:
                  </span>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      disabled={isLoading}
                      className="h-4 w-4 bg-red-700 rounded-full text-semibold hover:scale-105"
                      onClick={() => handleStockChange(-10)}
                    >
                      <MinusIcon />
                    </button>
                    <span> {stock} units </span>
                    <button
                      disabled={isLoading}
                      className="h-4 w-4 bg-red-700 rounded-full text-semibold hover:scale-105"
                      onClick={() => handleStockChange(10)}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Rating:
                  </span>
                  <span className="font-medium">
                    {product.ratings.average.toFixed(1)}/5.0
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Reviews:
                  </span>
                  <span className="font-medium">{product.ratings.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`font-medium ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Specifications
                </h4>
                <div className="text-sm space-y-1">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span>{value}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {/* Timeline */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Timeline
            </h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Created:
                </span>
                <span>{formatDate(product.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated:
                </span>
                <span>{formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Product ID for Reference */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Reference
            </h4>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Product ID:
                </span>
                <span className="font-mono text-xs">{product._id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductCard;
