// src/services/testimonialService.js
import api from './api'

export const getTestimonials = async (params = {}) => {
  try {
    const response = await api.get('/testimonials', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    throw error
  }
}

export const submitTestimonial = async (testimonialData) => {
  try {
    const response = await api.post('/testimonials', testimonialData)
    return response.data
  } catch (error) {
    console.error('Error submitting testimonial:', error)
    throw error
  }
}

export const getDoctorTestimonials = async (doctorId, params = {}) => {
  try {
    const response = await api.get(`/testimonials/doctors/${doctorId}`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching doctor testimonials:', error)
    throw error
  }
}