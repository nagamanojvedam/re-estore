"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { productService } from "@/lib/services/productService";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWishlist } from "@/lib/hooks/useWishlist";
import ProductCard from "@/components/products/ProductCard";
import ProductReviews from "@/components/products/ProductReviews";
import { LoadingScreen } from "@/components/common/Spinner";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils/helpers";
import { reviewService } from "@/lib/services/reviewService";

function ProductDetailsPage({ params }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  const router = useRouter();

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(() =>
    wishlist.some((item) => item.productId._id === id)
  );

  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Fetch product details
  const {
    data: product,
    isPending: isProductLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch reviews
  const { data, isPending: isReviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewService.getAllReviews(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const reviews = data?.reviews;

  // Fetch related products
  const { data: relatedProducts, isPending: isRelatedProductsLoading } =
    useQuery({
      queryKey: ["related-products", product?.category],
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
      toast.error("Product is out of stock");
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
      toast.error("Please login to add items to wishlist");
      return;
    }

    if (!isWishlisted) {
      await addToWishlist(product._id);
      setIsWishlisted(true);
    } else {
      await removeFromWishlist(product._id);
      setIsWishlisted(false);
    }
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setOpen(false);
      toast.success("Product link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  if (isProductLoading || isReviewsLoading || isRelatedProductsLoading) {
    return <LoadingScreen message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/shop")}
              className="w-full btn-primary"
            >
              Browse Products
            </button>
            <button
              onClick={() => router.back()}
              className="w-full btn-secondary"
            >
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
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
              <img
                src={
                  product.images?.[selectedImageIndex] ||
                  "/placeholder-product.jpg"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category & Stock Status */}
            <div className="flex items-center justify-between">
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                {product.category}
              </Link>
              <div className="flex items-center space-x-2">
                {product.stock > 0 ? (
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                    <XCircleIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {renderStars(product.ratings.average)}
                </div>
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
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="badge bg-red-500 text-white">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                )}
            </div>

            {/* Short Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.shortDescription ||
                product.description.substring(0, 200) + "..."}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center  space-x-4">
              <div className="flex items-center space-x-4">
                <label className="block text-md font-medium text-gray-500 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-lg font-medium text-gray-900 dark:text-white min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                  >
                    <PlusIcon className="w-4 h-4" />
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
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>
                  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isWishlisted
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 text-gray-600 dark:text-gray-400"
                }`}
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-6 h-6" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
              </button>

              <div className="relative inline-block">
                {/* Share button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 transition-all"
                >
                  <ShareIcon className="w-6 h-6" />
                </button>

                {/* Tooltip popup */}
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border rounded-xl shadow-lg p-3 z-10"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 p-2 truncate">
                      {typeof window !== "undefined" ? window.location.href : ""}
                    </p>
                    <button
                      onClick={handleShare}
                      className="mt-2 w-full px-3 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                    >
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <TruckIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Free Shipping
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    On orders over $50
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ArrowsRightLeftIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Easy Returns
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    30-day policy
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Warranty
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    1-year coverage
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-16"
        >
          {/* Tab Headers */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="prose prose-lg dark:prose-invert max-w-none"
                >
                  <div className="whitespace-pre-line text-gray-600 dark:text-gray-400">
                    {product.description}
                  </div>
                </motion.div>
              )}

              {activeTab === "specifications" && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                          >
                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {value}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                        No specifications available for this product.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Individual Reviews */}
                  {reviews?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No reviews yet. Be the first to review this product!
                    </div>
                  ) : (
                    <ProductReviews
                      reviews={reviews}
                      autoPlay={true}
                      autoPlayInterval={7000}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts?.products && relatedProducts.products.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                You Might Also Like
              </h2>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                View All in {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.products
                .slice(0, 4)
                .map((relatedProduct, index) => (
                  <ProductCard
                    key={relatedProduct._id}
                    product={relatedProduct}
                    index={index}
                  />
                ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsPage;
