import CheckoutClient from '@/components/checkout/CheckoutClient';

function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Complete your purchase securely</p>
          </div>

          <CheckoutClient />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
