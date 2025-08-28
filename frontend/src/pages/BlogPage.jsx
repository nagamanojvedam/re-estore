'use client';
import { motion } from 'framer-motion';

const blogs = [
  {
    slug: 'save-money-online',
    title: '5 Ways to Save Money Online',
    excerpt: 'Learn smart shopping hacks to maximize your budget.',
    img: 'https://source.unsplash.com/600x400/?shopping,discount',
    category: 'Shopping',
    date: 'March 2025',
  },
  {
    slug: 'ecommerce-trends-2025',
    title: 'E-commerce Trends 2025',
    excerpt: 'The future of online shopping is here.',
    img: 'https://source.unsplash.com/600x400/?ecommerce,technology',
    category: 'Technology',
    date: 'Feb 2025',
  },
  {
    slug: 'sustainable-wardrobe',
    title: 'How to Build a Sustainable Wardrobe',
    excerpt: 'Eco-friendly shopping tips for a greener lifestyle.',
    img: 'https://source.unsplash.com/600x400/?sustainable,fashion',
    category: 'Lifestyle',
    date: 'Jan 2025',
  },
  {
    slug: 'top-10-gadgets',
    title: 'Top 10 Gadgets Every Home Needs',
    excerpt: 'Smart devices that make everyday life easier.',
    img: 'https://source.unsplash.com/600x400/?gadgets,tech',
    category: 'Tech',
    date: 'Dec 2024',
  },
  {
    slug: 'startup-journey',
    title: 'Behind the Scenes: Our Startup Journey',
    excerpt: 'A glimpse into our growth, challenges, and wins.',
    img: 'https://source.unsplash.com/600x400/?startup,office',
    category: 'Company',
    date: 'Nov 2024',
  },
  {
    slug: 'psychology-of-shopping',
    title: 'The Psychology of Online Shopping',
    excerpt: 'Why we click “Buy Now” more than we think.',
    img: 'https://source.unsplash.com/600x400/?psychology,shopping',
    category: 'Insights',
    date: 'Oct 2024',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="heading-1 text-gray-900 dark:text-white mb-4">
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Insights, stories, and shopping tips from our team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {blogs.map((blog, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow overflow-hidden"
              >
                <a href={`/blog/${blog.slug}`}>
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="w-full h-56 object-cover"
                  />
                </a>
                <div className="p-6 flex flex-col">
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {blog.category}
                  </span>
                  <a href={`/blog/${blog.slug}`}>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white hover:underline">
                      {blog.title}
                    </h3>
                  </a>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {blog.excerpt}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {blog.date}
                  </p>
                  <a
                    href={`/blog/${blog.slug}`}
                    className="btn-secondary mt-auto w-fit"
                  >
                    Read More
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
