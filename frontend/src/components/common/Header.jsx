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
    navigate('/');
  };

  useEffect(() => {
    const handlekeyDown = evnt => {
      if ((evnt.ctrlKey || evnt.metaKey) && evnt.key.toLowerCase() === 'k') {
        evnt.preventDefault();

        setShowSearch(prev => !prev);
      }

      if (evnt.key === 'Escape') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handlekeyDown);
    return () => window.removeEventListener('keydown', handlekeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
          <div className="hidden md:flex items-center space-x-4">
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
                <div className="flex items-center space-x-2">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 dark:text-gray-300"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300"
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
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-700 dark:text-gray-300"
                >
                  {isDark ? (
                    <SunIcon className="w-6 h-6" />
                  ) : (
                    <MoonIcon className="w-6 h-6" />
                  )}
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/profile"
                      className="text-gray-700 dark:text-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 dark:text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setShowLogin(true);
                        setIsMenuOpen(false);
                      }}
                      className="btn btn-secondary"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowRegister(true);
                        setIsMenuOpen(false);
                      }}
                      className="btn btn-primary"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
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

      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  );
}

export default Header;
