import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Title + subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Cookie Policy
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              How cookies and similar technologies are used, and the choices
              available to manage them.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Last updated: Sept 10, 2025
            </p>

            {/* Comical Disclaimer */}
            <p className="mt-4 text-sm text-green-700 dark:text-green-400 italic bg-green-300/60 dark:bg-green-900/40 rounded-md p-4">
              ⚠️ Spoiler: This site doesn’t actually use cookies (yet)! I’m
              still learning all this stuff — right now I only store login
              tokens safely in{' '}
              <span className="font-semibold">localStorage</span>. No ads, no
              creepy tracking, no 🍪 crumbs on your device.
            </p>
          </motion.div>

          {/* Intro */}
          <p className="mt-6 text-gray-700 dark:text-gray-300">
            Cookies and similar technologies help operate the site, enhance
            performance, analyze traffic, and personalize content. Some cookies
            are essential for core functionality like authentication and cart
            persistence.
          </p>

          {/* What are cookies */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            What Are Cookies?
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Cookies are small text files placed on a device by a website. They
            are widely used to make websites work, improve user experience, and
            provide reporting information. Similar technologies include pixels,
            local storage, and device identifiers.
          </p>

          {/* Types of cookies */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Types of Cookies Used
          </h2>
          <ul className="mt-2 list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              Essential cookies — Required for core functionality such as
              sign-in, security, and shopping cart operations.
            </li>
            <li>
              Analytics cookies — Help understand site usage to improve
              performance and features.
            </li>
            <li>
              Preference cookies — Remember choices like language, currency, and
              display settings.
            </li>
            <li>
              Advertising cookies — Personalize ads and measure their
              effectiveness.
            </li>
          </ul>

          {/* Category summary table */}
          <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Purpose</th>
                  <th className="px-4 py-2">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">Essential</td>
                  <td className="px-4 py-2">Authentication, security, cart</td>
                  <td className="px-4 py-2">Session IDs, CSRF tokens</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">Analytics</td>
                  <td className="px-4 py-2">Usage insights, performance</td>
                  <td className="px-4 py-2">Page views, events</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">Preferences</td>
                  <td className="px-4 py-2">Remember settings</td>
                  <td className="px-4 py-2">Language, currency</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">Advertising</td>
                  <td className="px-4 py-2">Personalized ads, measurement</td>
                  <td className="px-4 py-2">Ad IDs, frequency capping</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Managing cookies */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Managing Cookies
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Cookie preferences can be managed via browser settings or a site
            cookie settings panel if available. Blocking certain cookies may
            impact functionality such as sign-in or checkout.
          </p>
          <ul className="mt-3 list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              Most browsers allow blocking or deleting cookies in Settings or
              Preferences.
            </li>
            <li>
              Some browsers support “Do Not Track”; behavior may vary across
              services.
            </li>
            <li>
              If a cookie banner or preferences center is provided, use it to
              adjust categories anytime.
            </li>
          </ul>

          {/* Third-party cookies */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Third-Party Cookies
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Certain cookies may be set by third-party providers (e.g.,
            analytics, advertising, payment, or customer support tools). These
            providers have their own policies governing how they use cookies.
          </p>

          {/* Changes */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Updates to This Policy
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            This policy may be updated periodically to reflect changes in
            technology, services, or legal requirements. Continued use after
            updates indicates acknowledgment of the revised policy.
          </p>

          {/* Contact */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Contact
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Questions about this Cookie Policy can be directed via{' '}
            <Link
              to="/contact"
              className="text-blue-600 dark:text-blue-400 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
            >
              the contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
