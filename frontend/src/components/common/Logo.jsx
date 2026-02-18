import { Link } from 'react-router-dom';

const Logo = ({ className = "h-10 w-auto" }) => {
  return (
    <Link to="/" className="inline-block hover:opacity-90 transition-opacity text-gray-900 dark:text-white">
      <svg
        viewBox="0 0 320 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="cartGradient" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Text */}
        <text
          x="30"
          y="66" // Adjusted y for vertical centering visual alignment
          fontFamily="Inter, Arial, sans-serif"
          fontSize="42"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="1"
        >
          EStore
        </text>

        {/* Cart Icon */}
        <g transform="translate(210, 35)">
          {/* Cart Body */}
          <path d="M0 0 H40 L35 25 H10 Z" fill="url(#cartGradient)" />

          {/* Wheels */}
          <circle cx="12" cy="32" r="5" fill="#FACC15" />
          <circle cx="30" cy="32" r="5" fill="#FACC15" />
        </g>
      </svg>
    </Link>
  );
};

export default Logo;
