
import SubscribeInput from "./SubscribeInput"

function NewsLetter() {
  return <section className="section-padding bg-primary-600">
        <div className="container-custom text-center">
          <div
            className="mx-auto max-w-2xl"
          >
            <h2 className="heading-2 mb-4 text-white">Stay Updated</h2>
            <p className="mb-8 text-lg text-blue-100">
              Subscribe to our newsletter for the latest deals, new arrivals, and exclusive offers.
            </p>
            <SubscribeInput/>
          </div>
        </div>
      </section>
}

export default NewsLetter
