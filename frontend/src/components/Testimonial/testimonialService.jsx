
export const getTestimonials = async (params = {}) => {
  const response = await api.get('/testimonials', { params })
  return response.data
}

export const submitTestimonial = async (testimonialData) => {
  const response = await api.post('/testimonials', testimonialData)
  return response.data
}

export const getDoctorTestimonials = async (doctorId, params = {}) => {
  const response = await api.get(`/doctors/${doctorId}/reviews`, { params })
  return response.data
}

export const submitDoctorReview = async (doctorId, reviewData) => {
  const response = await api.post(`/doctors/${doctorId}/reviews`, reviewData)
  return response.data
}