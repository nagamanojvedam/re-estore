import { categories } from "@/lib/utils/data"

import Link from "next/link"

function Categories() {
  return <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div
            className="mb-12 text-center"
          >
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover our wide range of product categories
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {categories.map((category, index) => (
              <div
                key={category.name}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="group block"
                >
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl">
                    <img
                      src={category.image || '/placeholder-category.jpg'}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-300 group-hover:bg-opacity-30">
                      <span className="text-lg font-semibold text-white">{category.name}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} products
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
}

export default Categories
