'use client';



export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="heading-1 mb-6 text-gray-900 dark:text-white">About Us</h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
              We’re on a mission to redefine online shopping by making it more{' '}
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                simple, affordable, and enjoyable
              </span>
              . Since our founding, we’ve helped thousands of customers discover products they love
              — at prices they didn’t expect.
            </p>
            <img
              src="/about-hero.jpg"
              alt="About our company"
              className="mx-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400">
              To empower every customer with access to high-quality products at unbeatable prices.
              We’re building a world where great shopping is for everyone, not just a few.
            </p>
          </div>
          <div>
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We envision a global community where shopping feels personal, transparent, and
              rewarding. A place where trust meets innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="section-padding">
        <div className="container-custom grid gap-8 text-center md:grid-cols-3">
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '500+', label: 'Products Available' },
            { value: '50+', label: 'Team Members' },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
            >
              <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom text-center">
          <h2
            className="heading-2 mb-12 text-gray-900 dark:text-white"
          >
            Meet Our Team
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
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
              <div
                key={i}
                className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <div className="container-custom">
          <div
            className="rounded-2xl bg-primary-600 p-10 text-white shadow-lg dark:bg-primary-500"
          >
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to start shopping with us?
            </h2>
            <p className="mb-6 text-gray-100">
              Explore our collections today and discover exclusive deals you won’t want to miss.
            </p>
            <a
              href="/shop"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 shadow transition hover:bg-gray-100"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
