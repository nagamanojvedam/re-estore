'use client';



export default function GDPRPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="section-padding">
        <div className="container-custom mx-auto max-w-4xl">
          {/* Title */}
          <h1
            className="heading-1 mb-6 text-gray-900 dark:text-white"
          >
            GDPR & Data Protection
          </h1>

          {/* Disclaimer */}
          <div className="mb-6 rounded-lg bg-yellow-50 p-3 text-sm italic text-green-800 dark:bg-green-900 dark:text-green-200">
            ⚠️ Note: This site is a learning project. At the moment, I only collect very minimal
            information (like name, email, and messages through the contact form). No fancy
            tracking, analytics, or marketing stuff is happening here yet.
          </div>

          {/* Intro */}
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            I care about protecting your personal data and aim to follow the principles of the
            General Data Protection Regulation (GDPR) as best as I can while I continue learning and
            improving this site.
          </p>

          {/* Rights */}
          <h2 className="heading-2 mb-4 mt-8 text-gray-900 dark:text-white">
            Your Rights Under GDPR
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
            <li>Right to access the data you’ve shared with me.</li>
            <li>Right to request correction or deletion of your data.</li>
            <li>Right to restrict or object to processing of your data.</li>
            <li>Right to request a copy of your data (data portability).</li>
          </ul>

          {/* Data Protection */}
          <h2 className="heading-2 mb-4 mt-8 text-gray-900 dark:text-white">
            How I Protect Your Data
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Your data (like contact form messages) is stored securely in the database. It is only
            used for the purpose of communication and is never sold or shared with third parties
            unless required by law.
          </p>

          {/* Future improvements */}
          <h2 className="heading-2 mb-4 mt-8 text-gray-900 dark:text-white">Future Improvements</h2>
          <p className="text-gray-600 dark:text-gray-400">
            As this project grows, I plan to improve compliance by adding things like a cookie
            banner, clearer consent options, and easier ways for you to manage or delete your data.
          </p>
        </div>
      </section>
    </div>
  );
}
