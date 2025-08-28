'use client';
import { motion } from 'framer-motion';

const pressReleases = [
  {
    title: 'We Raised $10M in Series A Funding',
    date: 'March 2025',
    description:
      'We’re thrilled to announce our $10M Series A funding round, led by top global investors.',
    image: 'https://source.unsplash.com/600x400/?startup,team',
    link: '#',
  },
  {
    title: 'Our Expansion into Europe',
    date: 'Jan 2025',
    description:
      'We are expanding operations into key European markets to better serve our global customers.',
    image: 'https://source.unsplash.com/600x400/?europe,city',
    link: '#',
  },
  {
    title: 'Partnership with XYZ',
    date: 'Dec 2024',
    description:
      'We’ve partnered with XYZ to enhance our platform and provide greater value to our users.',
    image: 'https://source.unsplash.com/600x400/?partnership,business',
    link: '#',
  },
  {
    title: 'Product Launch: AI Assistant',
    date: 'Oct 2024',
    description:
      'We launched our new AI-powered assistant to help businesses automate workflows more efficiently.',
    image: 'https://source.unsplash.com/600x400/?technology,ai',
    link: '#',
  },
  {
    title: 'Awarded Best Startup of the Year',
    date: 'Aug 2024',
    description:
      'Recognized as the Best Startup of 2024 by the Global Tech Awards.',
    image: 'https://source.unsplash.com/600x400/?award,trophy',
    link: '#',
  },
  {
    title: 'Reached 1 Million Users',
    date: 'Jun 2024',
    description:
      'We hit a major milestone with over 1 million active users worldwide.',
    image: 'https://source.unsplash.com/600x400/?users,celebration',
    link: '#',
  },
  {
    title: 'Opened New HQ in San Francisco',
    date: 'Apr 2024',
    description:
      'We opened our new headquarters in San Francisco to support our growing global team.',
    image: 'https://source.unsplash.com/600x400/?office,sanfrancisco',
    link: '#',
  },
  {
    title: 'Acquired Startup ABC',
    date: 'Feb 2024',
    description:
      'We acquired ABC to strengthen our platform and expand into new industries.',
    image: 'https://source.unsplash.com/600x400/?merger,acquisition',
    link: '#',
  },
  {
    title: 'Launched Sustainability Initiative',
    date: 'Nov 2023',
    description:
      'We committed to becoming carbon neutral by 2030 through our new sustainability program.',
    image: 'https://source.unsplash.com/600x400/?sustainability,green',
    link: '#',
  },
  {
    title: 'Seed Funding of $2M Secured',
    date: 'Jul 2023',
    description:
      'We closed a $2M seed round to build the foundation of our product and team.',
    image: 'https://source.unsplash.com/600x400/?funding,money',
    link: '#',
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="heading-1 text-gray-900 dark:text-white mb-4">
              Press
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Read our latest news and announcements.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {pressReleases.map((press, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="rounded-2xl overflow-hidden shadow bg-white dark:bg-gray-900 flex flex-col"
              >
                {/* Image */}
                <div className="h-40 w-full">
                  <img
                    src={press.image}
                    alt={press.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {press.date}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {press.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">
                    {press.description}
                  </p>
                  <a href={press.link} className="btn-primary mt-4 text-center">
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
