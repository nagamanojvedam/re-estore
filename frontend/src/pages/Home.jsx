import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArchiveBoxIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import ProductCard from '@components/products/ProductCard';
import { productService } from '@services/productService';

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Home() {
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [email, setEmail] = useState('');

  // Fetch featured products
  const { data: featuredProducts, isLoading: productsLoading } = useQuery(
    'featured-products',
    // () => productService.getProducts({ limit: 8, featured: true }),
    () => productService.getProducts({ limit: 8 }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: ArchiveBoxIcon,
      title: 'Fast Delivery',
      description: '2-day delivery on most items',
    },
  ];

  const categories = [
    {
      name: 'Electronics',
      image: '/categories/electronics.jpg',
      count: '1,234',
    },
    { name: 'Clothing', image: '/categories/clothing.jpg', count: '856' },
    { name: 'Books', image: '/categories/books.jpg', count: '2,341' },
    { name: 'Home & Garden', image: '/categories/home.jpg', count: '567' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      rating: 5,
      comment: 'Amazing products and fast shipping. Highly recommend!',
    },
    {
      name: 'Mike Chen',
      avatar: '/avatars/mike.jpg',
      rating: 5,
      comment: 'Great customer service and quality products.',
    },
    {
      name: 'Emily Davis',
      avatar: '/avatars/emily.jpg',
      rating: 5,
      comment: 'Love the variety and competitive prices.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="heading-1 text-white mb-6">
                Discover Amazing Products at{' '}
                <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Great Prices
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Shop the latest trends and timeless classics with fast, free
                shipping and easy returns on all orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="btn btn-secondary  btn-lg flex items-center justify-center space-x-2"
                >
                  <ShoppingBagIcon className="w-6 h-6" />
                  <span>Shop Now</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </Link>
                <button className="btn btn-ghost border border-white/30 hover:bg-white/10 btn-lg">
                  Learn More
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="/hero-image.jpg"
                  alt="Shopping hero"
                  className={`w-full h-auto rounded-2xl shadow-2xl transition-opacity duration-500 ${
                    heroImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setHeroImageLoaded(true)}
                />
                {!heroImageLoaded && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
                )}
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white text-primary-600 p-4 rounded-2xl shadow-lg z-10"
              >
                <div className="text-2xl font-bold">50%</div>
                <div className="text-sm">OFF</div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-yellow-400 text-primary-900 p-4 rounded-2xl shadow-lg z-10"
              >
                <div className="flex items-center  space-x-1">
                  <StarIcon className="w-5 h-5 fill-current" />
                  <span className="font-bold">4.9</span>
                </div>
                <div className="text-sm">Rating</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover our wide range of product categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="group block"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                    <img
                      src={category.image || '/placeholder-category.jpg'}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {category.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} products
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Our most popular and trending items
              </p>
            </div>
            <Link
              to="/shop"
              className="btn-primary flex items-center space-x-2"
            >
              <span>View All</span>
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.products?.slice(0, 8).map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real reviews from real customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <img
                  src={testimonial.avatar || '/placeholder-avatar.jpg'}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="heading-2 text-white mb-4">Stay Updated</h2>
            <p className="text-lg text-blue-100 mb-8">
              Subscribe to our newsletter for the latest deals, new arrivals,
              and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 text-primary-900"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button
                className="btn bg-white text-primary-600 hover:bg-gray-200  px-8"
                onClick={() => {
                  if (!email || !isValidEmail(email)) {
                    toast.error('Please enter a valid email.');
                    return;
                  }
                  toast.success('Subscribed!');
                }}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
