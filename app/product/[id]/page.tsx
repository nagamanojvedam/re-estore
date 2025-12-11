import Link from 'next/link';
import { notFound } from 'next/navigation';

import ProductCard from '@/components/products/ProductCard';

import Back from '@/components/common/BackButton';
import ProductImages from '@/components/products/ProductImages';
import ProductInfo from '@/components/products/ProductInfo';
import ProductTab from '@/components/products/ProductTab';

import { getProductById, getProducts } from '@/lib/data/products';
import { getReviewsByProductId } from '@/lib/data/reviews';

async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch product details directly
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Fetch related products directly
  // Note: getProducts returns { products, pagination }
  const { products: relatedProducts } = await getProducts({
    category: product.category,
    exclude: id,
    limit: 8,
    isActive: true
  });

  // Fetch reviews directly
  const reviews = await getReviewsByProductId(id);

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
              {relatedProducts.slice(0, 4).map((relatedProduct: any, index: number) => (
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
