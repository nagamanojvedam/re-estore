import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const jobs = [
  {
    title: 'Frontend Developer',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Work with React, Next.js, and Tailwind to build stunning user experiences.',
    image:
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&q=80&w=800&fit=crop',
  },
  {
    title: 'Backend Engineer',
    location: 'Remote',
    type: 'Contract',
    description:
      'Design and maintain APIs with Node.js and MongoDB. Ensure scalability and security.',
    image:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&q=80&w=800&fit=crop',
  },
  {
    title: 'UI/UX Designer',
    location: 'Remote',
    type: 'Internship',
    description:
      'Help craft intuitive designs and prototypes for our e-commerce platform.',
    image:
      'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h1 className="heading-1 text-gray-900 dark:text-white mb-4">
              Careers at ShopSphere
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join a passionate team shaping the future of e-commerce. We value
              creativity, innovation, and collaboration.
            </p>
          </motion.div>

          {/* Job Listings */}
          <div className="grid md:grid-cols-3 gap-8">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="rounded-2xl shadow-md bg-gray-50 dark:bg-gray-800 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="w-full h-40">
                  <img
                    src={job.image}
                    alt={job.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {job.location} • {job.type}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">
                    {job.description}
                  </p>
                  <button
                    className="btn-primary mt-6 w-full"
                    onClick={() => toast.error('Not yet implemented!')}
                  >
                    Apply Now
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
