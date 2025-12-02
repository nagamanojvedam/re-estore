import Link from 'next/link';

function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-300 to-primary-700">
        <span className="text-sm font-bold text-white">E</span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">EStore</span>
    </Link>
  );
}

export default Logo;
