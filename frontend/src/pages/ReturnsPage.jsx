import { motion } from 'framer-motion';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h1 className="heading-1 mb-6 text-gray-900 dark:text-white">
            Returns & Refunds
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
            We want you to be completely happy with your purchase. If you are
            not satisfied, our simple return process makes it easy.
          </p>

          {/* Step by step list */}
          <ol className="space-y-6 text-left">
            {[
              'Initiate your return within 30 days of delivery.',
              'Ensure the product is unused, in original condition, and packed securely.',
              'Use our prepaid return shipping label (available upon request).',
              'Once we receive the item, your refund will be processed within 5 business days.',
            ].map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  Step {i + 1}.
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">{step}</span>
              </motion.li>
            ))}
          </ol>

          {/* Additional info */}
          <div className="mt-12 text-left space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">
                Non-Returnable Items
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Certain products such as perishable goods, intimate apparel, and
                customized orders cannot be returned for hygiene and safety
                reasons.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">
                Exchanges
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Want a different size or color? Simply return your product and
                place a new order. We’ll make sure you get the right fit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">
                Contact Support
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                If you have any questions, reach out to our support team at{' '}
                <a
                  href="mailto:support@yourstore.com"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  support@yourstore.com
                </a>
                . We’ll be glad to help.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
