import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-1 text-gray-900 dark:text-white mb-6"
          >
            Privacy Policy
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your personal information when you use our
            services.
          </p>

          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We may collect personal details such as your name, email address,
            payment details, and usage data when you use our platform.
          </p>

          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            How We Use Information
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>To provide and improve our services.</li>
            <li>To process payments securely.</li>
            <li>To personalize your shopping experience.</li>
            <li>To communicate important updates.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
