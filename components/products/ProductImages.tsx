'use client';

import { useState } from 'react';

function ProductImages({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
        <img
          src={product.images?.[selectedImageIndex] || '/placeholder-product.jpg'}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Thumbnail Images */}
      {product.images && product.images.length > 1 && (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-primary-500'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImages;
