'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { productService } from '@/lib/services/productService';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useWishlist } from '@/lib/hooks/useWishlist';
import ProductCard from '@/components/products/ProductCard';
import ProductReviews from '@/components/products/ProductReviews';
import { LoadingScreen } from '@/components/common/Spinner';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils/helpers';
import { reviewService } from '@/lib/services/reviewService';

import ProductImages from '@/components/products/ProductImages';

function ProductDetailsPage({ params }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  const router = useRouter();

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(() =>
    wishlist.some((item) => item.productId._id === id)
  );

  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product details
  const {
    data: product,
    isPending: isProductLoading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch reviews
  const { data, isPending: isReviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getAllReviews(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const reviews = data?.reviews;

  // Fetch related products
  const { data: relatedProducts, isPending: isRelatedProductsLoading } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () =>
      productService.getProducts({
        category: product.category,
        limit: 8,
        exclude: id,
      }),
    enabled: !!product?.category,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    const itemToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[selectedImageIndex],
      stock: product.stock,
      quantity,
    };

    addItem(itemToAdd);

    setQuantity(1);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (!isWishlisted) {
      await addToWishlist(product._id);
      setIsWishlisted(true);
    } else {
      await removeFromWishlist(product._id);
      setIsWishlisted(false);
    }
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setOpen(false);
      toast.success('Product link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating)
            ? 'fill-current text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
          }`}
      />
    ));
  };

  if (isProductLoading || isReviewsLoading || isRelatedProductsLoading) {
    return <LoadingScreen message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Product Not Found
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="space-y-3">
            <button onClick={() => router.push('/shop')} className="btn-primary w-full">
              Browse Products
            </button>
            <button onClick={() => router.back()} className="btn-secondary w-full">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <ProductImages 
            product={product} 
            selectedImageIndex={selectedImageIndex} 
            setSelectedImageIndex={setSelectedImageIndex} 
          />

          {/* Product Info */}
          <div
            className="space-y-6"
          >
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
                <div className="flex">{renderStars(product.ratings.average)}</div>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {product.ratings.average.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                ({product.ratings.count} reviews)
              </span>
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
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {product.shortDescription || product.description.substring(0, 200) + '...'}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <label className="text-md mb-2 block font-medium text-gray-500 dark:text-gray-300">
                  Quantity
                </label>
                <div className="flex items-center space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="rounded p-2 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-600"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] px-4 py-2 text-center text-lg font-medium text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="rounded p-2 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-600"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {product.stock <= 10 && product.stock > 0 && (
                <div className="text-sm text-orange-600 dark:text-orange-400">
                  Only {product.stock} left in stock!
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-primary flex flex-1 items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`rounded-lg border-2 p-3 transition-all ${isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    : 'border-gray-300 text-gray-600 hover:border-red-300 dark:border-gray-600 dark:text-gray-400 dark:hover:border-red-600'
                  }`}
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="h-6 w-6" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>

              <div className="relative inline-block">
                {/* Share button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="rounded-lg border-2 border-gray-300 p-3 text-gray-600 transition-all hover:border-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
                >
                  <ShareIcon className="h-6 w-6" />
                </button>

                {/* Tooltip popup */}
                {open && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-72 rounded-xl border bg-white p-3 shadow-lg dark:bg-gray-900"
                  >
                    <p className="truncate p-2 text-sm text-gray-600 dark:text-gray-400">
                      {typeof window !== 'undefined' ? window.location.href : ''}
                    </p>
                    <button
                      onClick={handleShare}
                      className="mt-2 w-full rounded bg-gray-800 px-3 py-2 text-sm text-white transition hover:bg-gray-700"
                    >
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                )}
              </div>
            </div>

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
                <ArrowsRightLeftIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
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
        </div>

        {/* Product Tabs */}
        <div
          className="card mb-16"
        >
          {/* Tab Headers */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 py-4 text-sm font-medium transition-colors ${activeTab === tab
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
                <div
                  key="description"
                  className="prose prose-lg max-w-none dark:prose-invert"
                >
                  <div className="whitespace-pre-line text-gray-600 dark:text-gray-400">
                    {product.description}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div
                  key="specifications"
                >
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
                <div
                  key="reviews"
                  className="space-y-6"
                >
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

        {/* Related Products */}
        {relatedProducts?.products && relatedProducts.products.length > 0 && (
          <section
          >
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
              {relatedProducts.products.slice(0, 4).map((relatedProduct, index) => (
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
