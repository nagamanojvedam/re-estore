import { ArrowRight, CheckCircleIcon, ShieldCheckIcon, TruckIcon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import RenderStars from '../common/RenderStars';
import { formatPrice } from '@/lib/utils/helpers';
import ProductActions from './ProductActions';

function ProductInfo({ product }) {
  return (
    <div className="space-y-6">
      {/* Category & Stock Status */}
      <div className="flex items-center justify-between">
        <Link
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {product.category}
        </Link>
        <div className="flex items-center space-x-2">
          {product.stock > 0 ? (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <CheckCircleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">In Stock</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
              <XCircleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
        {product.name}
      </h1>

      {/* Rating */}

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <div className="flex">
            <RenderStars rating={product.ratings.average} />
          </div>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {product.ratings.average.toFixed(1)}
          </span>
        </div>
        <span className="text-gray-500 dark:text-gray-400">({product.ratings.count} reviews)</span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-2xl text-gray-500 line-through dark:text-gray-400">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="badge bg-red-500 text-white">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              OFF
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
        {product.shortDescription || product.description.substring(0, 200) + '...'}
      </p>

      {/* Product Actions */}
      <ProductActions product={product} />

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-6 dark:border-gray-700 sm:grid-cols-3">
        <div className="flex items-center space-x-3">
          <TruckIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Free Shipping</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">On orders over $50</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ArrowRight className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Easy Returns</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">30-day policy</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Warranty</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">1-year coverage</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
