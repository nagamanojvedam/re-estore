'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { messageService } from '@/lib/services/messageService';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from '@/components/common/Spinner';

export default function ContactPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: async (data) => {
      // just to add some delay to display loading spinner
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await messageService.createMessage(data);
    },
    onSuccess: () => {
      toast.success('Message sent successfully!');
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          {/* Header */}
          <div
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h1 className="heading-1 mb-4 text-gray-900 dark:text-white">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Have questions or need support? Reach out via the form below or use our direct contact
              information. Our team usually responds within 24 hours.
            </p>
          </div>

          {/* Contact Info */}
          <div
            className="mb-12 grid grid-cols-1 gap-6 text-gray-700 dark:text-gray-300 md:grid-cols-3"
          >
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <Mail className="mb-3 h-6 w-6 text-primary-600" />
              <p className="font-semibold">Email</p>
              <p>support@estore.com</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <Phone className="mb-3 h-6 w-6 text-primary-600" />
              <p className="font-semibold">Phone</p>
              <p>+91-9848032919</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <MapPin className="mb-3 h-6 w-6 text-primary-600" />
              <p className="font-semibold">Address</p>
              <p className="text-center">123 Commerce Street, Business District, City 12345</p>
            </div>
          </div>

          {/* Form */}
          <form
            className="mx-auto max-w-xl space-y-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800"
            onSubmit={handleSubmit(sendMessage)}
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-900"
                disabled={isSendingMessage}
                {...register('name', { required: 'Name is required' })}
              />

              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-900"
                disabled={isSendingMessage}
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Message
              </label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-900"
                disabled={isSendingMessage}
                {...register('message', { required: 'Message is required' })}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            <LoadingButton className="btn-primary w-full" loading={isSendingMessage}>
              Send Message
            </LoadingButton>
          </form>
        </div>
      </section>
    </div>
  );
}
