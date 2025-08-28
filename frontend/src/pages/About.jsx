import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="heading-1 text-gray-900 dark:text-white mb-6">
              About Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              We’re on a mission to redefine online shopping by making it more{' '}
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                simple, affordable, and enjoyable
              </span>
              . Since our founding, we’ve helped thousands of customers discover
              products they love — at prices they didn’t expect.
            </p>
            <img
              src="/about-hero.jpg"
              alt="About our company"
              className="rounded-2xl shadow-xl mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              To empower every customer with access to high-quality products at
              unbeatable prices. We’re building a world where great shopping is
              for everyone, not just a few.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We envision a global community where shopping feels personal,
              transparent, and rewarding. A place where trust meets innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="section-padding">
        <div className="container-custom grid md:grid-cols-3 gap-8 text-center">
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '500+', label: 'Products Available' },
            { value: '50+', label: 'Team Members' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
            >
              <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="heading-2 text-gray-900 dark:text-white mb-12"
          >
            Meet Our Team
          </motion.h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Founder & CEO',
                img: '/avatars/team1.jpg',
              },
              {
                name: 'Sara Lee',
                role: 'Head of Marketing',
                img: '/avatars/team2.jpg',
              },
              {
                name: 'Michael Smith',
                role: 'Lead Engineer',
                img: '/avatars/team3.jpg',
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-primary-600 dark:bg-primary-500 text-white p-10 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to start shopping with us?
            </h2>
            <p className="mb-6 text-gray-100">
              Explore our collections today and discover exclusive deals you
              won’t want to miss.
            </p>
            <a
              href="/shop"
              className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              Shop Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
