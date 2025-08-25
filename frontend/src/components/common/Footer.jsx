import React from 'react';
import { Link } from 'react-router-dom';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
} from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
        { name: 'Blog', path: '/blog' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Shipping Info', path: '/shipping' },
        { name: 'Returns', path: '/returns' },
      ],
    },
    {
      title: 'My Account',
      links: [
        { name: 'Login', path: '/login' },
        { name: 'Order History', path: '/orders' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Track Order', path: '/track' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'GDPR', path: '/gdpr' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold">EStore</span>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Your one-stop destination for quality products at unbeatable
              prices. We're committed to providing exceptional customer service
              and fast delivery.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <MapPinIcon className="w-5 h-5 flex-shrink-0" />
                <span>123 Commerce Street, Business District, City 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                <span>+91-9848032919</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                <span>support@estore.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              {[
                {
                  href: 'https://facebook.com',
                  Icon: FacebookIcon,
                  label: 'Facebook',
                },
                {
                  href: 'https://twitter.com',
                  Icon: TwitterIcon,
                  label: 'Twitter',
                },
                {
                  href: 'https://instagram.com',
                  Icon: InstagramIcon,
                  label: 'Instagram',
                },
                {
                  href: 'https://youtube.com',
                  Icon: YoutubeIcon,
                  label: 'YouTube',
                },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} EStore. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                We accept:
              </span>
              <div className="flex space-x-2">
                <div className="bg-gray-200 dark:bg-white rounded px-2 py-1 text-xs font-bold text-gray-900">
                  UPI
                </div>
                <div className="bg-gray-200 dark:bg-white rounded px-2 py-1 text-xs font-bold text-gray-900">
                  Cash
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
