"use client";

import { motion } from "framer-motion";

export default function GDPRPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-1 text-gray-900 dark:text-white mb-6"
          >
            GDPR & Data Protection
          </motion.h1>

          {/* Disclaimer */}
          <div className="p-3 mb-6 rounded-lg bg-yellow-50 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm italic">
            ⚠️ Note: This site is a learning project. At the moment, I only
            collect very minimal information (like name, email, and messages
            through the contact form). No fancy tracking, analytics, or
            marketing stuff is happening here yet.
          </div>

          {/* Intro */}
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            I care about protecting your personal data and aim to follow the
            principles of the General Data Protection Regulation (GDPR) as best
            as I can while I continue learning and improving this site.
          </p>

          {/* Rights */}
          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Your Rights Under GDPR
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Right to access the data you’ve shared with me.</li>
            <li>Right to request correction or deletion of your data.</li>
            <li>Right to restrict or object to processing of your data.</li>
            <li>Right to request a copy of your data (data portability).</li>
          </ul>

          {/* Data Protection */}
          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            How I Protect Your Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your data (like contact form messages) is stored securely in the
            database. It is only used for the purpose of communication and is
            never sold or shared with third parties unless required by law.
          </p>

          {/* Future improvements */}
          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Future Improvements
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            As this project grows, I plan to improve compliance by adding things
            like a cookie banner, clearer consent options, and easier ways for
            you to manage or delete your data.
          </p>
        </div>
      </section>
    </div>
  );
}
