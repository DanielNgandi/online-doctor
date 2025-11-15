 
import {Pagination} from 'swiper/modules'
import { Swiper,SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import PatientAvatar from '../../assets/images/patient-avatar.png'
import {HiStar} from  'react-icons/hi'
import { useEffect, useState } from 'react'
import { getTestimonials, submitTestimonial } from '../Testimonial/testimonialService'

function Testimonial() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: '',
    doctorId: '' // Optional: if reviewing a specific doctor
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    try {
      await submitTestimonial(userReview)
      setUserReview({ rating: 5, comment: '', doctorId: '' })
      fetchTestimonials() // Refresh the list
      alert('Thank you for your feedback!')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error submitting review. Please try again.')
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <HiStar
        key={index}
        className={`w-[18px] h-5 ${
          index < rating ? 'text-yellowColor' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="mt-[30px] lg:mt-[55px] text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-textColor">Loading testimonials...</p>
      </div>
    )
  }

  return (
    <div className='mt-[30px] lg:mt-[55px]'>
      {/* Review Submission Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-headingColor mb-4">
          Share Your Experience
        </h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textColor mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserReview({ ...userReview, rating: star })}
                  className="focus:outline-none"
                >
                  <HiStar
                    className={`w-6 h-6 ${
                      star <= userReview.rating
                        ? 'text-yellowColor'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-textColor mb-2">
              Your Review
            </label>
            <textarea
              value={userReview.comment}
              onChange={(e) =>
                setUserReview({ ...userReview, comment: e.target.value })
              }
              placeholder="Share your experience with our services..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primaryDark transition duration-200"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Testimonials Slider */}
      <h2 className="text-2xl font-bold text-headingColor mb-6 text-center">
        What Our Patients Say
      </h2>
      
      <Swiper
        modules={[Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 0
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          1440: {
            slidesPerView: 4,
            spaceBetween: 40
          }
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="py-[30px] px-5 rounded-3 bg-white shadow-md border border-gray-100 h-full">
              <div className="flex gap-[13px] items-center mb-4">
                <img
                  src={testimonial.patient?.photo || PatientAvatar}
                  alt={testimonial.patient?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[18px] leading-[30px] font-semibold text-textColor">
                    {testimonial.patient?.name || 'Anonymous'}
                  </h4>
                  {testimonial.doctor && (
                    <p className="text-sm text-gray-600">
                      Reviewed Dr. {testimonial.doctor.name}
                    </p>
                  )}
                  <div className="flex items-center gap-[2px] mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-[16px] leading-7 text-textColor font-[400]">
                {testimonial.comment}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {testimonials.length === 0 && (
        <div className="text-center py-8">
          <p className="text-textColor">No testimonials yet. Be the first to share your experience!</p>
        </div>
      )}
    </div>
  )
}

export default Testimonial