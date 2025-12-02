'use clinet';

function loading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="space-y-4 p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="flex space-x-4">
                  <div className="h-16 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default loading;
