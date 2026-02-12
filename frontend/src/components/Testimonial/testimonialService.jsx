// src/services/testimonialService.js
//import api from './api'
import API from "../../Api.js"

export const getTestimonials = async (params = {}) => {
  try {
    const response = await API.get('/api/testimonials', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    throw error
  }
}

export const submitTestimonial = async (testimonialData) => {
  try {
    const response = await API.post('/api/testimonials', testimonialData)
    return response.data
  } catch (error) {
    console.error('Error submitting testimonial:', error)
    throw error
  }
}

export const getDoctorTestimonials = async (doctorId, params = {}) => {
  try {
    const response = await API.get(`/api/testimonials/doctors/${doctorId}`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching doctor testimonials:', error)
    throw error
  }
}