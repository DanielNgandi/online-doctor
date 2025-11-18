import React from 'react'
import TestimonialPage from '../Testimonial/TestimonialPage'

function Testimonials() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-headingColor mb-4">
            Patient Testimonials & Reviews
          </h1>
          <p className="text-lg text-textColor max-w-2xl mx-auto">
            Share your experience with our healthcare services and read what other patients have to say.
          </p>
        </div>
        <TestimonialPage />
      </div>
    </div>
  )
}

export default Testimonials