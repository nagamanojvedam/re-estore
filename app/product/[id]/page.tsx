import Link from 'next/link';

import ProductCard from '@/components/products/ProductCard';

import Back from '@/components/common/BackButton';
import ProductImages from '@/components/products/ProductImages';
import ProductInfo from '@/components/products/ProductInfo';
import ProductTab from '@/components/products/ProductTab';
import config from '@utils/config';
import axios from 'axios';

async function ProductDetailsPage({ params }) {
  const { id } = await params;

  // Fetch product details

  const {
    data: {
      data: { product },
    },
  } = await axios.get(`${config.next.api.baseUrl}/products/${id}`);

  // Fetch related products
  const {
    data: {
      data: { products: relatedProducts },
    },
  } = await axios.get(
    `${config.next.api.baseUrl}/products?category=${encodeURIComponent(product.category)}&exclude=${id}&limit=8`
  );

  // Fetch reviews
  const {
    data: {
      data: { reviews },
    },
  } = await axios.get(`${config.next.api.baseUrl}/reviews/all/${id}`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Back Button */}
        <Back type="link" />

        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <ProductImages product={product} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Tabs */}
        <ProductTab product={product} reviews={reviews} />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                You Might Also Like
              </h2>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                View All in {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsPage;
