import { StarIcon } from "@heroicons/react/24/outline"

import { testimonials } from "@/lib/utils/data"

function Testimonials() {
  return <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">

          <div
            className="mb-12 text-center"
          >
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real reviews from real customers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="card p-6 text-center"
              >
                <img
                  src={testimonial.avatar || '/placeholder-avatar.jpg'}
                  alt={testimonial.name}
                  className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
                />
                <div className="mb-4 flex justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic text-gray-600 dark:text-gray-400">
                  {`"${testimonial.comment}"`}
                </p>
                <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
}

export default Testimonials
