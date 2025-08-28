import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { CartProvider } from '@contexts/CartContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { WishlistProvider } from './contexts/WishlistContext';
import ErrorBoundary from '@components/common/ErrorBoundary';
import Header from '@components/common/Header';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import Footer from '@components/common/Footer';
import { LoadingScreen } from '@components/common/Spinner';

// Lazy load pages with improved loading states
const Home = lazy(() => import('@pages/Home'));
const Shop = lazy(() => import('@pages/Shop'));
const About = lazy(() => import('@pages/About'));
const Contact = lazy(() => import('@pages/Contact'));
const ProductDetailsPage = lazy(() => import('@pages/ProductDetailsPage'));
const CartPage = lazy(() => import('@pages/CartPage'));
const CheckoutPage = lazy(() => import('@pages/CheckoutPage'));
const ProfilePage = lazy(() => import('@pages/ProfilePage'));
const OrdersPage = lazy(() => import('@pages/OrdersPage'));
const OrderDetailsPage = lazy(() => import('@pages/OrderDetailsPage'));
const WishlistPage = lazy(() => import('@pages/WishlistPage'));
const NotFound = lazy(() => import('@pages/NotFound'));
const AdminDashboard = lazy(() => import('@pages/Dashboard'));
const CareersPage = lazy(() => import('@pages/CareersPage'));
const PressPage = lazy(() => import('@pages/PressPage'));
const BlogPage = lazy(() => import('@pages/BlogPage'));
const FAQPage = lazy(() => import('@pages/FAQPage'));
const ShippingPage = lazy(() => import('@pages/ShippingPage'));
const ReturnsPage = lazy(() => import('@pages/ReturnsPage'));
const TrackOrderPage = lazy(() => import('@pages/TrackOrderPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Header />

                <main className="flex-grow">
                  <Suspense
                    fallback={<LoadingScreen message="Loading page..." />}
                  >
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/careers" element={<CareersPage />} />
                      <Route path="/press" element={<PressPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/shipping" element={<ShippingPage />} />
                      <Route path="/returns" element={<ReturnsPage />} />
                      <Route path="/track" element={<TrackOrderPage />} />

                      <Route
                        path="/product/:id"
                        element={<ProductDetailsPage />}
                      />
                      <Route path="/cart" element={<CartPage />} />

                      {/* Protected Routes */}

                      <Route
                        path="/wishlist"
                        element={
                          <ProtectedRoute>
                            <WishlistPage />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <OrdersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <ProtectedRoute>
                            <OrderDetailsPage />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="/dashboard" element={<AdminDashboard />} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>

                <Footer />
              </div>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
