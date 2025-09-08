import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'GDPR', path: '/gdpr' },
      ],
    },
  ];

  const socials = [
    {
      href: 'https://facebook.com',
      Icon: FacebookIcon,
      label: 'Facebook',
      hoverColor: 'hover:text-blue-600 dark:hover:text-blue-500',
    },
    {
      href: 'https://twitter.com',
      Icon: TwitterIcon,
      label: 'Twitter',
      hoverColor: 'hover:text-sky-400 dark:hover:text-sky-500',
    },
    {
      href: 'https://instagram.com',
      Icon: InstagramIcon,
      label: 'Instagram',
      hoverColor: 'hover:text-pink-500 dark:hover:text-pink-400',
    },
    {
      href: 'https://youtube.com',
      Icon: YoutubeIcon,
      label: 'YouTube',
      hoverColor: 'hover:text-red-600 dark:hover:text-red-500',
    },
  ];

  return (
    <footer
      className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300 border-t border-gray-200 dark:border-gray-700"
      aria-labelledby="site-footer"
    >
      <div className="container-custom py-10">
        <h2 id="site-footer" className="sr-only">
          Site footer
        </h2>

        {/* Row 1: Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-center lg:text-left">
          {footerSections.map(section => (
            <nav
              key={section.title}
              aria-labelledby={`footer-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <h3
                id={`footer-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="font-semibold text-gray-900 dark:text-white mb-4"
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded`}
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
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border-t border-gray-200 dark:border-gray-700 pt-8">
          {/* Left: Logo + Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <Logo className="h-8 w-auto" />
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md text-center md:text-left">
              Your one-stop destination for quality products at unbeatable
              prices. Committed to exceptional service.
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
                  className={`text-gray-600 dark:text-gray-400 transition-colors ${hoverColor}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar: copyright */}
      <div className="bg-black text-white">
        <div className="container-custom py-4 text-center">
          <p className="text-sm">
            © {currentYear} EStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
