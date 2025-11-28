import { blogs } from '@utils/data';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h1 className="heading-1 mb-4 text-gray-900 dark:text-white">Blog</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Insights, stories, and shopping tips from our team.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {blogs.map((blog, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl bg-gray-50 shadow dark:bg-gray-800"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <img src={blog.img} alt={blog.title} className="h-56 w-full object-cover" />
                </Link>
                <div className="flex flex-col p-6">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {blog.category}
                  </span>
                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 hover:underline dark:text-white">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="mb-2 text-gray-600 dark:text-gray-400">{blog.excerpt}</p>
                  <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">{blog.date}</p>
                  <button className="btn btn-secondary mt-auto w-fit">Read More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
