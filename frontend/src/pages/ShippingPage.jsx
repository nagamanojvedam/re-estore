import { motion } from 'framer-motion';

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-6 text-gray-900 dark:text-white">
            Shipping Information
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            We make sure your products reach you quickly and safely, wherever
            you are.
          </p>

          {/* Key highlights */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {[
              { title: 'Free Shipping', text: 'On all orders above $50.' },
              { title: 'Delivery Time', text: '3–5 business days on average.' },
              {
                title: 'Order Tracking',
                text: 'Real-time tracking available after dispatch.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow"
              >
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed info */}
          <div className="text-left max-w-3xl mx-auto space-y-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">
                Domestic Shipping
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Orders within the country are typically delivered in 3–5
                business days. Express shipping is available at checkout for
                faster delivery.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">
                International Shipping
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We ship worldwide. International orders may take 7–14 business
                days depending on the destination. Customs fees or import duties
                may apply.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">
                Tracking Your Order
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Once your order is dispatched, you’ll receive an email with a
                tracking link so you can follow your package in real time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">
                Returns & Exchanges
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                If you’re not fully satisfied, you can return or exchange your
                product within 30 days of delivery. Please refer to our{' '}
                <a
                  href="/returns"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Returns Policy
                </a>{' '}
                for more details.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
