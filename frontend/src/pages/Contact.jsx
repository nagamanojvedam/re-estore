import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h1 className="heading-1 text-gray-900 dark:text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Have questions or need support? Reach out via the form below or
              use our direct contact information. Our team usually responds
              within 24 hours.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-gray-700 dark:text-gray-300"
          >
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <Mail className="w-6 h-6 text-primary-600 mb-3" />
              <p className="font-semibold">Email</p>
              <p>support@example.com</p>
            </div>
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <Phone className="w-6 h-6 text-primary-600 mb-3" />
              <p className="font-semibold">Phone</p>
              <p>+1 (234) 567-890</p>
            </div>
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <MapPin className="w-6 h-6 text-primary-600 mb-3" />
              <p className="font-semibold">Address</p>
              <p>123 Market Street, NY</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-xl mx-auto space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-600 outline-none bg-white dark:bg-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-600 outline-none bg-white dark:bg-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Message
              </label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-600 outline-none bg-white dark:bg-gray-900"
              />
            </div>

            <button className="btn-primary w-full">Send Message</button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
