import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-primary-300 to-primary-700 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">E</span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        EStore
      </span>
    </Link>
  );
}

export default Logo;
