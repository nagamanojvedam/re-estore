import { motion } from 'framer-motion';

export default function GDPRPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-1 text-gray-900 dark:text-white mb-6"
          >
            GDPR Compliance
          </motion.h1>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We are committed to protecting your personal data in accordance with
            the General Data Protection Regulation (GDPR).
          </p>

          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Your Rights
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Right to access your personal data.</li>
            <li>Right to request correction or deletion.</li>
            <li>Right to restrict or object to processing.</li>
            <li>Right to data portability.</li>
          </ul>

          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Data Protection
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We use industry-standard security measures to protect your data and
            never share it without your consent unless required by law.
          </p>
        </div>
      </section>
    </div>
  );
}
