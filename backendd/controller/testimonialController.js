import prisma from "../config/prisma.js"

export const getTestimonials = async (req, res) => {
  try {
    const { doctorId, page = 1, limit = 10 } = req.query
    
    const whereClause = {}
    
    if (doctorId) {
      whereClause.doctorId = parseInt(doctorId)
    }
    
    whereClause.status = { in: ['APPROVED', 'PENDING'] }

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
    
    const userId = req.user?.id || req.user?.userId

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ message: "Comment must be at least 10 characters long" })
    }
    
    let patient = await prisma.patient.findFirst({
      where: { userId: parseInt(userId) }
    });

    if (!patient) {
      console.log("PATIENT NOT FOUND!");
      
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
      });
      
      const allPatients = await prisma.patient.findMany({
        select: { id: true, name: true, userId: true }
      });
      
      return res.status(400).json({ 
        message: "Patient profile not found. Please complete your patient profile first." 
      })
    }

    console.log("✅ Found patient:", { 
      id: patient.id, 
      name: patient.name, 
      userId: patient.userId 
    });

    const patientId = patient.id

    if (doctorId) {
      
      let appointment = await prisma.appointment.findFirst({
        where: {
          patientId: patientId,
          doctorId: parseInt(doctorId),
          status: 'COMPLETED'
        }
      })

      console.log("19. COMPLETED appointment found?", !!appointment);
      console.log("    Appointment details:", appointment);

      // If no COMPLETED, check for any appointment
      if (!appointment) {
        console.log("20. No COMPLETED appointment, checking for any appointment...");
        appointment = await prisma.appointment.findFirst({
          where: {
            patientId: patientId,
            doctorId: parseInt(doctorId)
          }
        });
        console.log("    Appointment details:", appointment);
      }

      if (!appointment) {
        console.log(" NO APPOINTMENT FOUND AT ALL!");
      
        const patientAppointments = await prisma.appointment.findMany({
          where: { patientId: patientId },
          include: {
            doctor: {
              select: { id: true, name: true }
            }
          }
        });
              
        return res.status(400).json({ 
          message: `You don't have any appointments with this doctor. Please book an appointment first.` 
        })
      }
          }

    console.log("22. Creating testimonial...");
    
    const testimonial = await prisma.testimonial.create({
      data: {
        rating: parseInt(rating),
        comment: comment.trim(),
        patientId: patientId,
        doctorId: doctorId ? parseInt(doctorId) : null,
        status: 'PENDING'
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

    console.log("✅ Testimonial created successfully! ID:", testimonial.id);
    
    res.status(201).json({
      message: "Thank you for your feedback! Your review is pending approval.",
      testimonial
    })
  } catch (error) {
    console.error("    Error message:", error.message);
  
    res.status(500).json({ 
      message: "Server error submitting testimonial",
      error: error.message 
    })
  }
}
export const getDoctorTestimonials = async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 5 } = req.query

    const testimonials = await prisma.testimonial.findMany({
      where: {
        doctorId: parseInt(id),
         status: {
    in: ['APPROVED', 'PENDING'] 
  }},
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

    console.log(`Found ${testimonials.length} testimonials for doctor ${id}`)

    res.json({
      testimonials,
      averageRating: ratingStats._avg.rating || 0,
      totalReviews: ratingStats._count.rating || 0,
      totalPages: Math.ceil(ratingStats._count.rating / parseInt(limit)),
      currentPage: parseInt(page)
    })
  } catch (error) {
    console.error("Error fetching doctor testimonials:", error)
    res.status(500).json({ 
      message: "Server error fetching doctor testimonials",
      error: error.message 
    })
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
            id: true,
            name: true
          }
        }
      }
    })

    // Update doctor's ratings if testimonial has a doctor
    if (testimonial.doctorId && testimonial.doctor) {
      // Get all APPROVED testimonials for this doctor
      const approvedTestimonials = await prisma.testimonial.findMany({
        where: {
          doctorId: testimonial.doctorId,
          status: 'APPROVED'
        },
        select: {
          rating: true
        }
      });

      // Get total patients from appointments
      const appointments = await prisma.appointment.findMany({
        where: { doctorId: testimonial.doctorId },
        distinct: ['patientId']
      });
      const totalPatients = appointments.length;

      // Calculate new average and total
      const totalReviews = approvedTestimonials.length;
      const avgRating = totalReviews > 0 
        ? approvedTestimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews
        : 0;

      // Update doctor's ratings
      await prisma.doctor.update({
        where: { id: testimonial.doctorId },
        data: {
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalRating: totalReviews,
          totalReviews: totalReviews,
          totalPatients: totalPatients
        }
      });
    }

    res.json({
      message: `Testimonial ${status.toLowerCase()} successfully`,
      testimonial
    })
  } catch (error) {
    console.error("Error updating testimonial status:", error)
    res.status(500).json({ message: "Server error updating testimonial status" })
  }
}