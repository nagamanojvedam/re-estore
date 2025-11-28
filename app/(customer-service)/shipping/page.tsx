import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-6 text-gray-900 dark:text-white">Shipping Information</h1>
          <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
            We make sure your products reach you quickly and safely, wherever you are.
          </p>

          {/* Key highlights */}
          <div className="mb-16 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Free Shipping', text: 'On all orders above $50.' },
              { title: 'Delivery Time', text: '3–5 business days on average.' },
              {
                title: 'Order Tracking',
                text: 'Real-time tracking available after dispatch.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl bg-gray-50 p-6 shadow dark:bg-gray-800">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Detailed info */}
          <div className="mx-auto max-w-3xl space-y-10 text-left">
            <div>
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">Domestic Shipping</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Orders within the country are typically delivered in 3–5 business days. Express
                shipping is available at checkout for faster delivery.
              </p>
            </div>

            <div>
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">
                International Shipping
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We ship worldwide. International orders may take 7–14 business days depending on the
                destination. Customs fees or import duties may apply.
              </p>
            </div>

            <div>
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">Tracking Your Order</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Once your order is dispatched, you’ll receive an email with a tracking link so you
                can follow your package in real time.
              </p>
            </div>

            <div>
              <h2 className="heading-2 mb-2 text-gray-900 dark:text-white">Returns & Exchanges</h2>
              <p className="text-gray-600 dark:text-gray-400">
                If you’re not fully satisfied, you can return or exchange your product within 30
                days of delivery. Please refer to our{' '}
                <Link href="/returns" className="text-blue-600 underline dark:text-blue-400">
                  Returns Policy
                </Link>{' '}
                for more details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
