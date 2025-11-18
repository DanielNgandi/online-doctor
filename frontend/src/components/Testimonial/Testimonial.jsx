import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { HiStar } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { getTestimonials } from '../Testimonial/testimonialService'
import PatientAvatar from '../../assets/images/patient-avatar.png'
import { Link } from 'react-router-dom'

function Testimonial() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials({ limit: 6 })
      setTestimonials(data.testimonials || data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <HiStar
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellowColor' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return <div className="text-center py-8">Loading testimonials...</div>
  }

  return (
    <div>
      <Swiper
        modules={[Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 }
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="py-6 px-5 rounded-lg bg-white shadow-md border border-gray-100 h-full">
              <div className="flex gap-3 items-center mb-4">
                <img src={testimonial.patient?.photo || PatientAvatar} alt={testimonial.patient?.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-[16px] leading-6 font-semibold text-textColor">
                    {testimonial.patient?.name || 'Anonymous'}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-[14px] leading-6 text-textColor font-[400]">
                "{testimonial.comment}"
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="text-center mt-8">
        <Link to="/testimonials" className="inline-flex items-center text-primary hover:text-primaryDark font-semibold">
          Share Your Experience or View All Testimonials
        </Link>
      </div>
    </div>
  )
}

export default Testimonial