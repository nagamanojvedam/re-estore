"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              The rules and conditions for using these services, purchasing
              products, and accessing content.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Last updated: Sept 10, 2025
            </p>
          </motion.div>

          {/* Intro */}
          <p className="mt-6 text-gray-700 dark:text-gray-300">
            By accessing or using the platform, agreement is given to these
            Terms. Please read them carefully; continued use constitutes
            acceptance.
          </p>

          {/* Use of Services */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Use of Services
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Services must be used only for lawful purposes and in compliance
            with applicable laws, regulations, and these Terms.
          </p>
          <ul className="mt-3 list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              No attempts to interfere with service integrity, security, or
              availability.
            </li>
            <li>
              No unauthorized scraping, reverse engineering, or data harvesting.
            </li>
            <li>
              Content must not infringe intellectual property, privacy, or other
              rights.
            </li>
          </ul>

          {/* Accounts */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Accounts
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Account holders are responsible for safeguarding credentials and all
            activities under the account. Notify support of any suspected
            unauthorized use.
          </p>

          {/* Orders and Payments */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Orders and Payments
          </h2>
          <ul className="mt-2 list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              Prices, taxes, and shipping costs are shown at checkout; charges
              are confirmed before purchase.
            </li>
            <li>
              Orders are subject to availability; orders may be canceled and
              refunded if an item cannot be fulfilled.
            </li>
            <li>
              Payment processing is handled by trusted gateways; card details
              are not stored on servers.
            </li>
          </ul>

          {/* Returns and Refunds */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Returns and Refunds
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Returns are accepted per the published Return Policy. Approved
            refunds are issued to the original payment method within the stated
            timeframe.
          </p>

          {/* Intellectual Property */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Intellectual Property
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            All site content, trademarks, and materials are protected. No
            reproduction, distribution, or derivative works without prior
            written permission.
          </p>

          {/* Prohibited Conduct */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Prohibited Conduct
          </h2>
          <ul className="mt-2 list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Fraudulent, deceptive, or harmful activities.</li>
            <li>Uploading malware or attempting to breach security.</li>
            <li>Harassment, hate speech, or unlawful content.</li>
          </ul>

          {/* Disclaimers */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Disclaimers
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Services are provided “as is” and “as available”, without warranties
            of any kind, to the maximum extent permitted by law.
          </p>

          {/* Limitation of Liability */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Limitation of Liability
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            To the fullest extent permitted by law, liability for indirect,
            incidental, special, or consequential damages arising from service
            use is disclaimed.
          </p>

          {/* Changes to Terms */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Changes to These Terms
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Terms may be updated periodically. Material changes will be
            communicated, and continued use after updates constitutes
            acceptance.
          </p>

          {/* Contact */}
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white">
            Contact
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Questions about these Terms can be sent via{" "}
            <Link
              href="/contact"
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
