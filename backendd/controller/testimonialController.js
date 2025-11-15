import prisma from "../config/prisma.js"

export const getTestimonials = async (req, res) => {
  try {
    const { doctorId, page = 1, limit = 10 } = req.query
    
    const whereClause = {}
    
    if (doctorId) {
      whereClause.doctorId = parseInt(doctorId)
    }
    
    whereClause.status = 'APPROVED' // Only show approved testimonials

    const testimonials = await prisma.testimonial.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            photo: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    })

    const total = await prisma.testimonial.count({ where: whereClause })

    res.json({
      testimonials,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    res.status(500).json({ message: "Server error fetching testimonials" })
  }
}

export const submitTestimonial = async (req, res) => {
  try {
    const { rating, comment, doctorId } = req.body
    const userId = req.user?.userId

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ message: "Comment must be at least 10 characters long" })
    }

    // Check if user has an appointment with the doctor (if doctorId provided)
    if (doctorId) {
      const appointment = await prisma.appointment.findFirst({
        where: {
          patientId: userId,
          doctorId: parseInt(doctorId),
          status: 'COMPLETED'
        }
      })

      if (!appointment) {
        return res.status(400).json({ 
          message: "You can only review doctors you've had appointments with" 
        })
      }
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        rating: parseInt(rating),
        comment: comment.trim(),
        patientId: userId,
        doctorId: doctorId ? parseInt(doctorId) : null,
        status: 'PENDING' // Admin approval required
      },
      include: {
        patient: {
          select: {
            name: true,
            photo: true
          }
        },
        doctor: {
          select: {
            name: true
          }
        }
      }
    })

    res.status(201).json({
      message: "Thank you for your feedback! Your review is pending approval.",
      testimonial
    })
  } catch (error) {
    console.error("Error submitting testimonial:", error)
    res.status(500).json({ message: "Server error submitting testimonial" })
  }
}

export const getDoctorTestimonials = async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 5 } = req.query

    const testimonials = await prisma.testimonial.findMany({
      where: {
        doctorId: parseInt(id),
        status: 'APPROVED'
      },
      include: {
        patient: {
          select: {
            name: true,
            photo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    })

    // Calculate average rating
    const ratingStats = await prisma.testimonial.aggregate({
      where: {
        doctorId: parseInt(id),
        status: 'APPROVED'
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    })

    res.json({
      testimonials,
      averageRating: ratingStats._avg.rating || 0,
      totalReviews: ratingStats._count.rating || 0,
      totalPages: Math.ceil(ratingStats._count.rating / parseInt(limit)),
      currentPage: parseInt(page)
    })
  } catch (error) {
    console.error("Error fetching doctor testimonials:", error)
    res.status(500).json({ message: "Server error fetching doctor testimonials" })
  }
}

// Admin functions
export const getPendingTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: 'PENDING' },
      include: {
        patient: {
          select: {
            name: true,
            photo: true
          }
        },
        doctor: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(testimonials)
  } catch (error) {
    console.error("Error fetching pending testimonials:", error)
    res.status(500).json({ message: "Server error fetching pending testimonials" })
  }
}

export const updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        patient: {
          select: {
            name: true
          }
        },
        doctor: {
          select: {
            name: true
          }
        }
      }
    })

    res.json({
      message: `Testimonial ${status.toLowerCase()} successfully`,
      testimonial
    })
  } catch (error) {
    console.error("Error updating testimonial status:", error)
    res.status(500).json({ message: "Server error updating testimonial status" })
  }
}