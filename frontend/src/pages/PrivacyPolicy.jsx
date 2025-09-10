import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              How personal information is collected, used, and protected when
              using these services.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Last updated: Sept 10, 2025
            </p>
          </motion.div>

          {/* Intro */}
          <p className="mt-6 text-gray-700 dark:text-gray-300">
            Privacy is taken seriously. This policy explains what data is
            collected, why it’s collected, and the choices available regarding
            personal information.
          </p>

          {/* Information We Collect */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Information We Collect
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Personal details such as name, email address, payment details
            (processed by trusted providers), device and usage data, and order
            history may be collected to operate and improve the service.
          </p>
          <ul className="mt-3 list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Account data: name, email, and preferences.</li>
            <li>Order data: items purchased, amounts, and delivery details.</li>
            <li>Technical data: IP, device, browser, and interaction logs.</li>
            <li>
              Payment data: handled by payment gateways; no card data is stored
              on servers.
            </li>
          </ul>

          {/* How We Use Information */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            How We Use Information
          </h2>
          <ul className="mt-2 list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>To provide, maintain, and improve the services.</li>
            <li>To process payments securely and fulfill orders.</li>
            <li>To personalize browsing and product recommendations.</li>
            <li>
              To communicate important updates, including order and policy
              notices.
            </li>
            <li>
              To prevent fraud, secure accounts, and comply with legal
              obligations.
            </li>
          </ul>

          {/* Data Retention */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Data Retention
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Information is retained only for as long as necessary to provide
            services, comply with legal requirements, resolve disputes, and
            enforce agreements.
          </p>

          {/* Your Choices */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Your Choices and Rights
          </h2>
          <ul className="mt-2 list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Access, update, or delete account information.</li>
            <li>Manage marketing preferences and notifications.</li>
            <li>Request data export where applicable by law.</li>
          </ul>

          {/* Security */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Security
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Industry-standard safeguards are used, including transport
            encryption and secure payment gateways. No method of transmission or
            storage is 100% secure, and reasonable measures are continuously
            improved.
          </p>

          {/* Contact */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Contact
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Questions about this policy can be directed via{' '}
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
