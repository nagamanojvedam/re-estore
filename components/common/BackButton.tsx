'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

function Back({ type }: { type: string }) {
  const router = useRouter();

  const btnClass = 'btn-primary';
  const linkClass =
    'mb-8 flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white';

  return (
    <button onClick={() => router.back()} className={type === 'button' ? btnClass : linkClass}>
      <ArrowLeftIcon className="h-5 w-5" />
      <span>Back</span>
    </button>
  );
}

export default Back;
