import ContactForm from '@components/contact/ContactForm';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          {/* Header */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h1 className="heading-1 mb-4 text-gray-900 dark:text-white">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Have questions or need support? Reach out via the form below or use our direct contact
              information. Our team usually responds within 24 hours.
            </p>
          </div>

          {/* Contact Info */}
          <div className="mb-12 grid grid-cols-1 gap-6 text-gray-700 dark:text-gray-300 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <EnvelopeIcon className="mb-3 h-6 w-6 text-primary-600" />
              <p className="font-semibold">Email</p>
              <p>support@estore.com</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <PhoneIcon className="mb-3 h-6 w-6 text-primary-600" />
              <p className="font-semibold">Phone</p>
              <p>+91-9848032919</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <MapPinIcon className="mb-3 h-6 w-6 text-primary-600" />
              <p className="font-semibold">Address</p>
              <p className="text-center">123 Commerce Street, Business District, City 12345</p>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
