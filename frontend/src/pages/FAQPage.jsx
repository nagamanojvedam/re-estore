import { useState } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'What is your return policy?',
    a: 'You can return items within 30 days of delivery. No questions asked.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes, we ship worldwide. Shipping rates are calculated at checkout.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once shipped, you’ll receive a tracking link via email to monitor your package.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept credit/debit cards, PayPal, UPI, and net banking.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders within the country usually arrive in 3–5 business days. International orders may take 7–14 days.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be modified or canceled within 24 hours of purchase by contacting support.',
  },
  {
    q: 'Do you offer gift cards?',
    a: 'Yes, we provide digital gift cards that can be used at checkout.',
  },
  {
    q: 'Is my payment secure?',
    a: 'Absolutely. All payments are processed through encrypted and secure gateways.',
  },
  {
    q: 'Do you offer discounts for bulk purchases?',
    a: 'Yes, please contact our sales team for special bulk pricing.',
  },
  {
    q: 'How can I contact customer support?',
    a: 'You can reach us via email, live chat, or through our Help Center, available 24/7.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom max-w-2xl mx-auto">
          <h1 className="heading-1 text-center mb-12 text-gray-900 dark:text-white">
            FAQs
          </h1>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white flex justify-between items-center">
                  {item.q}
                  <span className="text-xl">{open === i ? '−' : '+'}</span>
                </h3>
                {open === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-gray-600 dark:text-gray-400"
                  >
                    {item.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
