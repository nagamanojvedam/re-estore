import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-1 text-gray-900 dark:text-white mb-6"
          >
            Terms of Service
          </motion.h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            By using our platform, you agree to the following terms and
            conditions. Please read them carefully.
          </p>

          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Use of Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You agree to use our services only for lawful purposes and in
            compliance with all applicable laws.
          </p>

          <h2 className="heading-2 text-gray-900 dark:text-white mt-8 mb-4">
            Accounts
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You are responsible for maintaining the confidentiality of your
            account credentials and activities on your account.
          </p>
        </div>
      </section>
    </div>
  );
}
