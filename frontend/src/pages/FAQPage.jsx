import { AnimatePresence, motion } from 'framer-motion';
import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const BASE_FAQS = [
  {
    q: 'What is your return policy?',
    a: 'Items can be returned within 30 days of delivery in original condition. Refunds are issued to the original payment method after inspection.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes, worldwide shipping is available. Exact rates and duties are shown at checkout based on destination.',
  },
  {
    q: 'How can I track my order?',
    a: 'A tracking link is emailed once the order ships. Tracking details are also available in the Orders section of the account.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Credit/debit cards, UPI, net banking, and PayPal are supported. Some options may vary by country.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Domestic deliveries typically arrive in 3–5 business days; international deliveries in 7–14 business days depending on customs.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be changed or canceled within 24 hours of purchase before fulfillment begins. Contact support with the order ID.',
  },
  {
    q: 'Is my payment secure?',
    a: 'All transactions are processed over encrypted connections (TLS) via certified gateways. Card data is handled by PCI‑compliant processors.',
  },
  {
    q: 'How do refunds work?',
    a: 'Once a return is approved, refunds are initiated within 2–5 business days. Bank processing may add additional time.',
  },
  {
    q: 'Do you offer bulk pricing?',
    a: 'Yes, volume discounts are available. Contact sales with product SKUs and quantities for a custom quote.',
  },
  {
    q: 'How can I contact support?',
    a: 'Reach support via email or live chat in the Help Center, available 24/7. Response times are typically under a few hours.',
  },
];

// Minimal, “very important” FAQs subset for checkout/product pages
const ESSENTIAL_FAQS = [
  'What is your return policy?',
  'How can I track my order?',
  'How long does delivery take?',
  'What payment methods are accepted?',
  'Is my payment secure?',
];

function FAQItem({ id, index, q, a, open, onToggle }) {
  const buttonId = `${id}-button-${index}`;
  const panelId = `${id}-panel-${index}`;
  const isOpen = open === index;

  return (
    <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <h3>
        <button
          id={buttonId}
          aria-controls={panelId}
          aria-expanded={isOpen}
          onClick={() => onToggle(isOpen ? null : index)}
          className="w-full flex items-center justify-between gap-4 p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        >
          <span className="font-semibold text-gray-900 dark:text-white">
            {q}
          </span>
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            aria-hidden="true"
          >
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage({
  faqs = BASE_FAQS,
  showOnlyEssential = false,
  className = '',
}) {
  const [open, setOpen] = useState(null);
  const rootId = useId();

  const items = useMemo(() => {
    if (!showOnlyEssential) return faqs;
    const set = new Set(ESSENTIAL_FAQS);
    return faqs.filter(f => set.has(f.q));
  }, [faqs, showOnlyEssential]);

  return (
    <div className={`min-h-screen ${className}`}>
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            FAQs
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Answers to common questions about orders, shipping, returns, and
            payments.
          </p>
        </div>
        <div className="container-custom max-w-2xl mx-auto">
          <div className="space-y-3">
            {items.map((item, i) => (
              <FAQItem
                key={item.q}
                id={rootId}
                index={i}
                q={item.q}
                a={item.a}
                open={open}
                onToggle={setOpen}
              />
            ))}
          </div>

          {/* Optional helper text */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Can’t find an answer? Contact{' '}
            <Link to="/contact" className="underline text-primary-500">
              support
            </Link>{' '}
            from the Help Center.
          </p>
        </div>
      </section>
    </div>
  );
}
