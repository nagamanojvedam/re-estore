import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const blogs = [
  {
    slug: 'save-money-online',
    title: '5 Ways to Save Money Online',
    excerpt: 'Learn smart shopping hacks to maximize your budget.',
    img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80',
    category: 'Shopping',
    date: 'March 2025',
  },
  {
    slug: 'ecommerce-trends-2025',
    title: 'E-commerce Trends 2025',
    excerpt: 'The future of online shopping is here.',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
    category: 'Technology',
    date: 'Feb 2025',
  },
  {
    slug: 'sustainable-wardrobe',
    title: 'How to Build a Sustainable Wardrobe',
    excerpt: 'Eco-friendly shopping tips for a greener lifestyle.',
    img: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80',
    category: 'Lifestyle',
    date: 'Jan 2025',
  },
  {
    slug: 'top-10-gadgets',
    title: 'Top 10 Gadgets Every Home Needs',
    excerpt: 'Smart devices that make everyday life easier.',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    category: 'Tech',
    date: 'Dec 2024',
  },
  {
    slug: 'startup-journey',
    title: 'Behind the Scenes: Our Startup Journey',
    excerpt: 'A glimpse into our growth, challenges, and wins.',
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
    category: 'Company',
    date: 'Nov 2024',
  },
  {
    slug: 'psychology-of-shopping',
    title: 'The Psychology of Online Shopping',
    excerpt: 'Why we click “Buy Now” more than we think.',
    img: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80',
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
                  <button
                    className="btn btn-secondary mt-auto w-fit"
                    onClick={() => toast.error("Can't read blog posts yet!")}
                  >
                    Read More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
