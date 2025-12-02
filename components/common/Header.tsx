'use client';

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
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
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
  const pathname = usePathname();
  const router = useRouter();

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
    router.push('/');
  };

  useEffect(() => {
    const handlekeyDown = (evnt) => {
      if ((evnt.ctrlKey || evnt.metaKey) && evnt.key.toLowerCase() === 'k') {
        evnt.preventDefault();

        setShowSearch((prev) => !prev);
      }

      if (evnt.key === 'Escape') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handlekeyDown);
    return () => window.removeEventListener('keydown', handlekeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => {
              if (item.name === 'Dashboard') {
                if (!isAuthenticated || user?.role !== 'admin') {
                  return null;
                }
              }
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`font-medium transition-colors duration-200 ${user?.role === 'admin' && item.name === 'Dashboard'
                    ? 'rounded-xl bg-red-700 px-4 py-1 text-red-100 hover:bg-white hover:text-red-700'
                    : pathname === item.path
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                    } `.trim()}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-4 md:flex">
            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="dark:bg-primary-900/50 flex items-center gap-2 rounded-full bg-primary-100/50 p-2 px-4 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              aria-label="Search products"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="text-sm">Ctrl + K</span>
            </button>


            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>

            {/* Wishlist */}
            <button
              className="p-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              onClick={() => router.push('/wishlist')}
            >
              <HeartIcon className="h-6 w-6" />
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              aria-label="Open cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
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
                    className="flex items-center space-x-2 p-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="font-medium">{user?.name}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg dark:bg-gray-800">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/my-products"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Products
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button onClick={() => setShowLogin(true)} className="btn btn-secondary">
                    Login
                  </button>
                  <button onClick={() => setShowRegister(true)} className="btn btn-primary">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button onClick={toggleCart} className="relative p-2 text-gray-700 dark:text-gray-300">
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 dark:border-gray-700 md:hidden">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <button onClick={toggleTheme} className="p-2 text-gray-700 dark:text-gray-300">
                  {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/profile"
                      className="text-gray-700 dark:text-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="text-red-600 dark:text-red-400">
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
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)} title="Login to Your Account">
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

      <Modal isOpen={showSearch} onClose={() => setShowSearch(false)} title="Search Products">
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
