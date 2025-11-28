'use client';

function FAQItem({ index, question, answer, open, onToggle }) {
  const isOpen = open === index;

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <h3>
        <button
          onClick={() => onToggle(isOpen ? null : index)}
          className="flex w-full items-center justify-between gap-4 rounded-lg p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="font-semibold text-gray-900 dark:text-white">{question}</span>
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200"
            aria-hidden="true"
          >
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </h3>

      {isOpen && (
        <div className="overflow-hidden">
          <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">{answer}</div>
        </div>
      )}
    </div>
  );
}

export default FAQItem;
