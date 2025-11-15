// Testimonial routes
app.get('/testimonials', getTestimonials)
app.post('/testimonials', auth, submitTestimonial)
app.get('/doctors/:id/reviews', getDoctorReviews)
app.post('/doctors/:id/reviews', auth, submitDoctorReview)

// Admin routes
app.get('/admin/testimonials/pending', auth, adminAuth, getPendingTestimonials)
app.patch('/admin/testimonials/:id/status', auth, adminAuth, updateTestimonialStatus)