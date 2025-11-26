import { ChevronRightIcon, ShoppingBagIcon, StarIcon } from "@heroicons/react/24/outline"
import Link from "next/link"


function Hero() {
  return <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white">
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="container-custom section-padding relative">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="heading-1 mb-6 text-white">
            Discover Amazing Products at{' '}
            <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Great Prices
            </span>
          </h1>
          <p className="mb-8 max-w-lg text-xl text-blue-100">
            Shop the latest trends and timeless classics with fast, free shipping and easy
            returns on all orders.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="btn btn-secondary btn-lg flex items-center justify-center space-x-2"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              <span>Shop Now</span>
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="btn btn-ghost btn-lg border border-white/30 text-white hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
        

        <div
          className="relative"
        >
          <div className="relative z-10">
            <img
              src="/hero-image.jpg"
              alt="Shopping hero"
              className={`h-auto w-full rounded-2xl shadow-2xl transition-opacity duration-500}`}
            />
          </div>

          {/* Floating Elements */}
          <div
            className="absolute -right-4 -top-4 z-10 rounded-2xl bg-white p-4 text-primary-600 shadow-lg"
          >
            <div className="text-2xl font-bold">50%</div>
            <div className="text-sm">OFF</div>
          </div>

          <div
            className="absolute -bottom-4 -left-4 z-10 rounded-2xl bg-yellow-400 p-4 text-primary-900 shadow-lg"
          >
            <div className="flex items-center space-x-1">
              <StarIcon className="h-5 w-5 fill-current" />
              <span className="font-bold">4.9</span>
            </div>
            <div className="text-sm">Rating</div>
          </div>
        </div>
      </div>
    </div>
  </section>
}

export default Hero
