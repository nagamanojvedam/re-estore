import { motion } from 'framer-motion';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-1 text-gray-900 dark:text-white mb-6"
          >
            Cookie Policy
          </motion.h1>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We use cookies and similar technologies to improve your browsing
            experience, analyze site traffic, and personalize content.
          </p>

          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Types of Cookies We Use
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Essential cookies – Required for basic functionality.</li>
            <li>Analytics cookies – Help us understand usage patterns.</li>
            <li>Advertising cookies – Deliver relevant ads.</li>
          </ul>

          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Managing Cookies
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You can manage or disable cookies in your browser settings. However,
            some features may not work properly without cookies.
          </p>
        </div>
      </section>
    </div>
  );
}
