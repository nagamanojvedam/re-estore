import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

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
        { name: 'Login', path: '/' },
        { name: 'Order History', path: '/orders' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Track Order', path: '/track' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms of Service', path: '/terms-of-service' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'GDPR', path: '/gdpr' },
      ],
    },
  ];

  const socials = [
    {
      href: 'https://facebook.com',
      Icon: Facebook,
      label: 'Facebook',
      hoverColor: 'hover:text-blue-600 dark:hover:text-blue-500',
    },
    {
      href: 'https://twitter.com',
      Icon: Twitter,
      label: 'Twitter',
      hoverColor: 'hover:text-sky-400 dark:hover:text-sky-500',
    },
    {
      href: 'https://instagram.com',
      Icon: Instagram,
      label: 'Instagram',
      hoverColor: 'hover:text-pink-500 dark:hover:text-pink-400',
    },
    {
      href: 'https://youtube.com',
      Icon: Youtube,
      label: 'YouTube',
      hoverColor: 'hover:text-red-600 dark:hover:text-red-500',
    },
  ];

  return (
    <footer
      className="border-t border-gray-200 bg-gray-100 text-gray-800 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      aria-labelledby="site-footer"
    >
      <div className="container-custom py-10">
        <h2 id="site-footer" className="sr-only">
          Site footer
        </h2>

        {/* Row 1: Categories */}
        <div className="mb-10 grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4 lg:text-left">
          {footerSections.map((section) => (
            <nav
              key={section.title}
              aria-labelledby={`footer-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <h3
                id={`footer-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className={`rounded text-gray-700 transition-colors hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:text-white`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Row 2: Logo + info (left) and social links (right) */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-8 dark:border-gray-700 md:flex-row md:items-start">
          {/* Left: Logo + Info */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
            <Logo className="h-8 w-auto" />
            <p className="max-w-md text-center text-sm text-gray-600 dark:text-gray-400 md:text-left">
              Your one-stop destination for quality products at unbeatable prices. Committed to
              exceptional service.
            </p>
          </div>

          {/* Right: Social links */}
          <ul className="flex gap-4">
            {socials.map(({ href, Icon, label, hoverColor }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`text-gray-600 transition-colors dark:text-gray-400 ${hoverColor}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar: copyright */}
      <div className="bg-black text-white">
        <div className="container-custom py-4 text-center">
          <p className="text-sm">© {currentYear} EStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
