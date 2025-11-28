import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom mx-auto max-w-3xl text-center">
          {/* Heading */}
          <h1 className="heading-1 mb-6 text-gray-900 dark:text-white">Returns & Refunds</h1>
          <p className="mb-10 text-lg text-gray-600 dark:text-gray-400">
            We want you to be completely happy with your purchase. If you are not satisfied, our
            simple return process makes it easy.
          </p>

          {/* Step by step list */}
          <ol className="space-y-6 text-left">
            {[
              'Initiate your return within 30 days of delivery.',
              'Ensure the product is unused, in original condition, and packed securely.',
              'Use our prepaid return shipping label (available upon request).',
              'Once we receive the item, your refund will be processed within 5 business days.',
            ].map((step, i) => (
              <li key={i} className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <span className="font-semibold text-gray-900 dark:text-white">Step {i + 1}.</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">{step}</span>
              </li>
            ))}
          </ol>

          {/* Additional info */}
          <div className="mt-12 space-y-8 text-left">
            <div>
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">Non-Returnable Items</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Certain products such as perishable goods, intimate apparel, and customized orders
                cannot be returned for hygiene and safety reasons.
              </p>
            </div>

            <div>
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">Exchanges</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Want a different size or color? Simply return your product and place a new order.
                We’ll make sure you get the right fit.
              </p>
            </div>

            <div>
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">Contact Support</h2>
              <p className="text-gray-600 dark:text-gray-400">
                If there are any questions, reach out to our support team via{' '}
                <Link
                  href="/contact"
                  className="rounded-sm text-blue-600 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-400"
                >
                  contact
                </Link>
                . We’ll be glad to help.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
