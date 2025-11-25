"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}
    >
      {showInfo && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </div>
      )}

      <nav className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
            currentPage <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span className="hidden sm:block">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-3 py-2 text-gray-500 dark:text-gray-400"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
            currentPage >= totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          }`}
          aria-label="Next page"
        >
          <span className="hidden sm:block">Next</span>
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
