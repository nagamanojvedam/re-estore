import {
  Bars3Icon,
  HeartIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  ShoppingCartIcon,
  SunIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import CartSidebar from '../cart/CartSidebar';
import Logo from './Logo';
import Modal from './Modal';
import SearchBar from './SearchBar';
import ForgotPasswordForm from '../auth/ForgotPasswordForm';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const handleAuthSuccess = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = async () => {
    await logout();

    setIsProfileOpen(false);
    setIsMobileProfileOpen(false);
    setIsMenuOpen(false);

    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsMobileProfileOpen(false);
  };

  useEffect(() => {
    const handlekeyDown = evnt => {
      if ((evnt.ctrlKey || evnt.metaKey) && evnt.key.toLowerCase() === 'k') {
        evnt.preventDefault();
        setShowSearch(prev => !prev);
      }

      if (evnt.key === 'Escape') {
        setShowSearch(false);
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        setIsMobileProfileOpen(false);
      }
    };

    window.addEventListener('keydown', handlekeyDown);

    return () => window.removeEventListener('keydown', handlekeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <nav className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map(item => {
              if (item.name === 'Dashboard') {
                if (!isAuthenticated || user?.role !== 'admin') {
                  return null;
                }
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium transition-colors duration-200
                    ${
                      user?.role === 'admin' && item.name === 'Dashboard'
                        ? 'bg-red-700 text-red-100 px-4 py-1 rounded-xl hover:bg-white hover:text-red-700'
                        : location.pathname === item.path
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }
                  `.trim()}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex gap-2 items-center bg-primary-100/50 dark:bg-primary-950/50 rounded-full px-4"
              aria-label="Search products"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span className="text-sm">Ctrl + K</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>

            {/* Wishlist */}
            <button
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => navigate('/wishlist')}
            >
              <HeartIcon className="w-6 h-6" />
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCartIcon className="w-6 h-6" />

              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <UserIcon className="w-6 h-6" />
                    <span className="font-medium">{user?.name}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Orders
                      </Link>

                      <Link
                        to="/myProducts"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Products
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 truncate">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="btn btn-secondary"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setShowRegister(true)}
                    className="btn btn-primary"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-1">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* Wishlist */}
            <button
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => navigate('/wishlist')}
            >
              <HeartIcon className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5" />

              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => {
                setIsMenuOpen(prev => !prev);
                setIsMobileProfileOpen(false);
              }}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            {/* Navigation */}
            <div className="space-y-1">
              {navigation.map(item => {
                if (item.name === 'Dashboard') {
                  if (!isAuthenticated || user?.role !== 'admin') {
                    return null;
                  }
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`
                      block rounded-lg px-4 py-3
                      font-medium transition-colors
                      ${
                        location.pathname === item.path
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }
                      ${
                        item.name === 'Dashboard'
                          ? 'text-red-600 dark:text-red-400'
                          : ''
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Search */}
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={() => {
                  setShowSearch(true);
                  setIsMenuOpen(false);
                  setIsMobileProfileOpen(false);
                }}
                className="w-full flex items-center justify-between rounded-lg bg-primary-100/50 dark:bg-primary-950/50 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-950 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <MagnifyingGlassIcon className="w-5 h-5" />

                  <span className="text-sm font-medium">Search products</span>
                </span>

                <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">
                  Ctrl + K
                </span>
              </button>
            </div>

            {/* Account */}
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              {isAuthenticated ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  {/* Account Header */}
                  <button
                    onClick={() => setIsMobileProfileOpen(prev => !prev)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                      <UserIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Account
                      </p>
                    </div>

                    <span
                      className={`text-lg text-gray-400 transition-transform duration-200 dark:text-gray-500 ${
                        isMobileProfileOpen ? 'rotate-90' : ''
                      }`}
                    >
                      ›
                    </span>
                  </button>

                  {/* Profile Menu */}
                  {isMobileProfileOpen && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
                      >
                        <span>Profile</span>
                        <span className="text-gray-400 dark:text-gray-500">
                          ›
                        </span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
                      >
                        <span>My Orders</span>
                        <span className="text-gray-400 dark:text-gray-500">
                          ›
                        </span>
                      </Link>

                      <Link
                        to="/myProducts"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
                      >
                        <span>My Products</span>
                        <span className="text-gray-400 dark:text-gray-500">
                          ›
                        </span>
                      </Link>
                    </div>
                  )}

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLogin(true);
                    }}
                    className="btn btn-secondary w-full"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowRegister(true);
                    }}
                    className="btn btn-primary w-full"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <Modal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        title="Login to Your Account"
      >
        <LoginForm
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onSwitchToForgotPassword={() => {
            setShowLogin(false);
            setShowForgotPassword(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        title="Create New Account"
      >
        <RegisterForm
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        title="Search Products"
      >
        <SearchBar onClose={() => setShowSearch(false)} />
      </Modal>

      <Modal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        title="Forgot Password"
      >
        <ForgotPasswordForm onSuccess={handleAuthSuccess} />
      </Modal>

      <CartSidebar />
    </header>
  );
}

export default Header;
