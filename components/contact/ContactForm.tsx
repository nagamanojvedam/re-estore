'use client';

import { LoadingButton } from '@/components/common/Spinner';
import { useActionState } from 'react';
import toast from 'react-hot-toast';
import { sendMessageAction } from '../../lib/actions/sendMessageAction';

export default function ContactForm() {
  const [state, sendMessage] = useActionState(sendMessageAction, {
    success: false,
    message: '',
  });

  if (state.message) {
    state.success ? toast.success(state.message) : toast.error(state.message);
  }

  return (
    <form
      action={sendMessage}
      className="mx-auto max-w-xl space-y-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Name
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="John Doe"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Email
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Write your message here..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      <LoadingButton className="btn-primary w-full" loading={false}>
        Send Message
      </LoadingButton>
    </form>
  );
}
