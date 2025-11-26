
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Features from '@/components/home/Features';
import Hero from '@/components/home/Hero';
import NewsLetter from '@/components/home/NewsLetter';
import Testimonials from '@/components/home/Testimonials';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from 'react';
import FeaturedProductsSkeleton from '@/components/skeletons/FeaturedProductsSkeleton';


function Page() {
 
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero/>

      {/* Features Section */}
      <Features/>

      {/* Categories Section */}
      <Categories/>

      {/* Featured Products */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div
            className="mb-12 flex items-center justify-between"
          >
            <div>
              <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">Featured Products</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Our most popular and trending items
              </p>
            </div>
            <Link href="/shop" className="btn-primary flex items-center space-x-2">
              <span>View All</span>
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <Suspense fallback={<FeaturedProductsSkeleton />}>

            <FeaturedProducts/>
          </Suspense>


        </div>
      </section>

      {/* Testimonials */}
     <Testimonials/>

      {/* Newsletter CTA */}
      <NewsLetter/>
    </div>
  );
}

export default Page;
