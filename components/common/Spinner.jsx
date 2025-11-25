"use client";

function Spinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} loading-spinner`} />
    </div>
  );
}

export function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
}

export function LoadingButton({ loading, children, ...props }) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      <div className="flex items-center justify-center space-x-2">
        {loading && <Spinner size="sm" />}
        <span className="flex items-center justify-center space-x-2">
          {children}
        </span>
      </div>
    </button>
  );
}

export default Spinner;
