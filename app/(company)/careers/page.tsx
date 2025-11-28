import { jobs } from '@utils/data';

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h1 className="heading-1 mb-4 text-gray-900 dark:text-white">Careers at ShopSphere</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join a passionate team shaping the future of e-commerce. We value creativity,
              innovation, and collaboration.
            </p>
          </div>

          {/* Job Listings */}
          <div className="grid gap-8 md:grid-cols-3">
            {jobs.map((job, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-md dark:bg-gray-800"
              >
                {/* Image */}
                <div className="h-40 w-full">
                  <img src={job.image} alt={job.title} className="h-full w-full object-cover" />
                </div>

                {/* Content */}
                <div className="flex flex-grow flex-col p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {job.location} • {job.type}
                  </p>
                  <p className="flex-grow text-gray-600 dark:text-gray-300">{job.description}</p>
                  <button className="btn-primary mt-6 w-full">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
