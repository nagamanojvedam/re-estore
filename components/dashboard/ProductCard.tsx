"use client";

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
import { formatDate, formatPrice } from '@/lib/utils/helpers';
import { updateProductStock } from '@/lib/data/products';

const ProductCard = ({ product, toggleMutation }: { product: any; toggleMutation: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isActive, setIsActive] = useState(product.isActive);
  const [stock, setStock] = useState(product.stock);
  const [isLoading, setIsLoading] = useState(false);

  const handleStockChange = async (delta: number) => {
    try {
      setIsLoading(true);
      const newStock = Math.max(0, stock + delta);
      const updatedProduct = await updateProductStock(product._id, newStock);
      setStock(updatedProduct.stock);
      toast.success('Stock updated successfully');
    } catch (err) {
      toast.error('Failed to update stock');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        text: 'Out of Stock',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      };
    if (stock <= 10)
      return {
        text: 'Low Stock',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      };
    return {
      text: 'In Stock',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };
  };

  const renderStars = (average: number, count: number) => {
    const stars = [];
    const wholeStars = Math.floor(average);

    const hasHalfStar = average % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < wholeStars) {
        stars.push(<StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />);
      } else if (i === wholeStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative h-4 w-4">
            <StarIcon className="absolute h-4 w-4 text-gray-300" />
            <StarIconSolid className="clip-half absolute h-4 w-4 text-yellow-400" />
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600 dark:text-gray-400">({count} reviews)</span>
      </div>
    );
  };

  const stockStatus = getStockStatus(stock);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Main Details Section */}
      <div className="space-y-3">
        {/* Header with Image and Basic Info */}
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="relative h-20 w-20 flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {product.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Basic Product Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </p>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
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
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${stockStatus.color}`}>
                {stockStatus.text} ({stock})
              </span>
              {renderStars(product.ratings.average, product.ratings.count)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <span>{isExpanded ? 'Show less details' : 'Show more details'}</span>
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => {
              toggleMutation(product._id);
              setIsActive(!isActive);
            }}
            className={`rounded-lg px-4 py-2 font-medium text-white transition-colors ${
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          {/* Product Description */}
          <div>
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Description</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
          </div>

          {/* Product Images Gallery */}
          {product.images && product.images.length > 1 && (
            <div>
              <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                Images ({product.images.length})
              </h4>
              <div className="flex space-x-2 overflow-x-auto p-2">
                {product.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`h-16 w-16 flex-shrink-0 cursor-pointer rounded-lg object-cover ${
                      index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Owner Information */}
          <div>
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Owner Information</h4>
            <div className="space-y-1 text-sm">
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
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Product Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      disabled={isLoading}
                      className="text-semibold h-4 w-4 rounded-full bg-red-700 hover:scale-105"
                      onClick={() => handleStockChange(-10)}
                    >
                      <MinusIcon />
                    </button>
                    <span> {stock} units </span>
                    <button
                      disabled={isLoading}
                      className="text-semibold h-4 w-4 rounded-full bg-red-700 hover:scale-105"
                      onClick={() => handleStockChange(10)}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                  <span className="font-medium">{product.ratings.average.toFixed(1)}/5.0</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Reviews:</span>
                  <span className="font-medium">{product.ratings.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
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
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Specifications</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Timeline</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span>{formatDate(product.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span>{formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Product ID for Reference */}
          <div>
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Reference</h4>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Product ID:</span>
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
