import FAQList from '@/components/faq/FAQList';
import { BASE_FAQS as faqs } from '@/lib/utils/data';
import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className={`min-h-screen`}>
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            FAQs
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Answers to common questions about orders, shipping, returns, and payments.
          </p>
        </div>
        <div className="container-custom mx-auto max-w-2xl">
          <div className="space-y-3">
            <FAQList faqs={faqs} />
          </div>

          {/* Optional helper text */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Can’t find an answer? Contact{' '}
            <Link href="/contact" className="text-primary-500 underline">
              support
            </Link>{' '}
            from the Help Center.
          </p>
        </div>
      </section>
    </div>
  );
}
