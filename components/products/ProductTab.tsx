'use client';

import { useState } from 'react';
import ProductReviews from './ProductReviews';

function ProductTab({ product, reviews }) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="card mb-16">
      {/* Tab Headers */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 py-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div key="description" className="prose prose-lg max-w-none dark:prose-invert">
            <div className="whitespace-pre-line text-gray-600 dark:text-gray-400">
              {product.description}
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div key="specifications">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {product.specifications ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-gray-200 py-2 dark:border-gray-700"
                  >
                    <span className="font-medium capitalize text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{value}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-gray-500 dark:text-gray-400">
                  No specifications available for this product.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div key="reviews" className="space-y-6">
            {/* Individual Reviews */}
            {reviews?.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              <ProductReviews reviews={reviews} autoPlay={true} autoPlayInterval={7000} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTab;
