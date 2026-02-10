import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { HiStar } from 'react-icons/hi'
import { getDoctorTestimonials, submitTestimonial } from '../../Testimonial/testimonialService'
import { useAuth } from '../../context/AuthContext'
import PatientAvatar from '../../../assets/images/patient-avatar.png'

function DoctorFeedback({ doctor }) {
  const { id: doctorId } = useParams()
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: ''
  })
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0
  })

  useEffect(() => {
    fetchDoctorReviews()
  }, [doctorId])

  const fetchDoctorReviews = async () => {
  try {
    setLoading(true)
    console.log('🔄 fetchDoctorReviews called for doctorId:', doctorId)
    
    const data = await getDoctorTestimonials(doctorId)
    
    console.log('📥 Backend response data:', data)
    console.log('📊 Testimonials array:', data.testimonials)
    console.log('🔢 Number of testimonials:', data.testimonials?.length)
    console.log('📝 First testimonial (if exists):', data.testimonials?.[0])
    
    setReviews(data.testimonials || [])
    setStats({
      averageRating: data.averageRating || 0,
      totalReviews: data.totalReviews || 0
    })
    
    console.log('✅ State updated - reviews:', data.testimonials?.length, 'stats:', {
      averageRating: data.averageRating || 0,
      totalReviews: data.totalReviews || 0
    })
    
  } catch (error) {
    console.error('❌ Error fetching doctor reviews:', error)
    console.error('📄 Error response:', error.response?.data)
    setReviews([])
    setStats({ averageRating: 0, totalReviews: 0 })
  } finally {
    setLoading(false)
  }
}
  const handleSubmitReview = async (e) => {
  e.preventDefault()
  
  console.log('=== FRONTEND DEBUG: SUBMITTING REVIEW ===');
  console.log('1. User review state:', userReview);
  console.log('2. Rating value:', userReview.rating, 'Type:', typeof userReview.rating);
  console.log('3. Comment value:', userReview.comment, 'Length:', userReview.comment.length);
  console.log('4. Doctor ID from URL:', doctorId);
  console.log('5. User from context:', user);
  console.log('6. User ID:', user?.id);
  console.log('7. User userId:', user?.userId);
  console.log('8. User role:', user?.role);
  console.log('9. Token exists:', !!localStorage.getItem('token'));
  console.log('10. Token:', localStorage.getItem('token')?.substring(0, 20) + '...');
  
  if (!user) {
    alert('Please login to submit a review');
    return;
  }

  if (user?.role !== 'patient') {
    alert('Only patients can submit reviews. You are logged in as: ' + user?.role);
    return;
  }

  if (!userReview.comment.trim() || userReview.comment.length < 10) {
    alert('Please write a review with at least 10 characters. Current length: ' + userReview.comment.length);
    return;
  }

  try {
    console.log('11. Preparing testimonial data...');
    const testimonialData = {
      rating: userReview.rating,
      comment: userReview.comment,
      doctorId: doctorId
    };
    
    console.log('12. Sending data to backend:', testimonialData);
    console.log('13. Making POST request to /api/testimonials');
    
    setSubmitting(true);
    const response = await submitTestimonial(testimonialData);
    
    console.log('14. Backend response:', response);
    
    setUserReview({ rating: 5, comment: '' });
    fetchDoctorReviews();
    
    alert('Thank you for your review! It will be visible after approval.');
    
  } catch (error) {
    console.error('15. ERROR CAUGHT IN FRONTEND:');
    console.error('    Error object:', error);
    console.error('    Error message:', error.message);
    console.error('    Error response:', error.response);
    console.error('    Error response data:', error.response?.data);
    console.error('    Error response status:', error.response?.status);
    
    const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       'Error submitting review. Please try again.';
    
    console.error('16. Error message to show:', errorMessage);
    alert(`Error: ${errorMessage}`);
  } finally {
    setSubmitting(false);
  }
}

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <HiStar
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* Overall Rating Stats */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Overall Rating</h3>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {renderStars(Math.round(stats.averageRating))}
                <span className="ml-2 text-xl font-bold text-gray-800">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="ml-1 text-gray-600">/5</span>
              </div>
              <span className="ml-4 text-gray-600">
                ({stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Share Your Experience with Dr. {doctor?.name}
        </h3>
        
        {!user ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Please login to submit a review</p>
            <a 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Login to Submit Review
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserReview({ ...userReview, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <HiStar
                      className={`w-6 h-6 ${
                        star <= userReview.rating
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={userReview.comment}
                onChange={(e) =>
                  setUserReview({ ...userReview, comment: e.target.value })
                }
                placeholder={`Share your experience with Dr. ${doctor?.name}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
                minLength="10"
                maxLength="500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {userReview.comment.length}/500 characters (minimum 10)
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Patient Reviews ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No reviews yet. Be the first to review this doctor!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-white rounded-lg shadow border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={review.patient?.photo || PatientAvatar} 
                    alt={review.patient?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {review.patient?.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-2">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-3 text-gray-700">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorFeedback