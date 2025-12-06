// backend/routes/testimonialRoutes.js
import express from 'express'
import { 
  getTestimonials, 
  submitTestimonial,
  getDoctorTestimonials,
  getPendingTestimonials,
  updateTestimonialStatus 
} from '../controller/testimonialController.js'
import { protect, checkRole } from '../middlewares/AuthMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getTestimonials) // Get all approved testimonials
router.get('/doctors/:id', getDoctorTestimonials) // Get doctor-specific testimonials

// Protected routes - Patients can submit testimonials
router.post('/', protect, checkRole(['patient']), submitTestimonial)

// Admin routes
router.get('/pending', protect, checkRole(['admin']), getPendingTestimonials)
router.patch('/:id/status', protect, checkRole(['admin']), updateTestimonialStatus)

export default router