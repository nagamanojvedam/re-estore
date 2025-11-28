import { pressReleases } from '@utils/data';
import Link from 'next/link';

export default function PressPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h1 className="heading-1 mb-4 text-gray-900 dark:text-white">Press</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Read our latest news and announcements.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {pressReleases.map((press, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-900"
              >
                {/* Image */}
                <div className="h-40 w-full">
                  <img src={press.image} alt={press.title} className="h-full w-full object-cover" />
                </div>

                {/* Content */}
                <div className="flex flex-grow flex-col p-6">
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{press.date}</p>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {press.title}
                  </h3>
                  <p className="flex-grow text-gray-600 dark:text-gray-300">{press.description}</p>
                  <Link href={press.link} className="btn-secondary mt-4 text-center">
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
