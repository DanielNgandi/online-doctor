import prisma from "../config/prisma.js";

export const getDoctorProfile = async (req, res) => {
  try {
    console.log("Request user:", req.user);

    const doctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            createdAt: true
          }
        },
        educations: {
          orderBy: { startDate: 'desc' }
        },
        workExperiences: {
          orderBy: { startDate: 'desc' }
        },
        timeSlots: {
          orderBy: { dayOfWeek: 'asc' }
        }
      }
    });

    if (!doctor) {
      console.log(`No doctor profile found for userId: ${req.user.userId}`);
      return res.status(404).json({ 
        message: "Doctor profile not found",
        needsSetup: true
      });
    }

    res.json({
      ...doctor,
      email: doctor.user.email,
      username: doctor.user.username,
      createdAt: doctor.user.createdAt,
      // For backward compatibility with frontend
      education: doctor.educations,
      qualifications: doctor.workExperiences
    });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

export const getDoctorStats = async (req, res) => {
  try {
  
    const doctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
    });

    if (!doctor) {
     
      return res.json({
        totalAppointments: 0,
        upcomingAppointments: 0,
        totalPatients: 0
      });
    }

    const totalAppointments = await prisma.appointment.count({
      where: { doctorId: doctor.id }
    });

    const upcomingAppointments = await prisma.appointment.count({
      where: { 
        doctorId: doctor.id,
        date: { gte: new Date() }
      }
    });

    const totalPatients = await prisma.appointment.groupBy({
      by: ['patientId'],
      where: { doctorId: doctor.id },
      _count: { patientId: true }
    });

    res.json({
      totalAppointments,
      upcomingAppointments,
      totalPatients: totalPatients.length
    });
  } catch (error) {
    console.error("Error fetching doctor stats:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

export const createDoctorProfile = async (req, res) => {
  const { 
    name, 
    specialty, 
    contact, 
    hospital, 
    photo,
    bio,
    experience,
    ticketPrice,
    educations,
    workExperiences,
    timeSlots
  } = req.body;
  
  try {
    const existingDoctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
    });

    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor profile already exists" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Creating doctor profile with data:", {
      name, specialty, contact, hospital, photo, bio, experience, ticketPrice,
      educationsCount: educations?.length || 0,
      workExperiencesCount: workExperiences?.length || 0,
      timeSlotsCount: timeSlots?.length || 0
    });

    const doctor = await prisma.doctor.create({
      data: {
        name: name || user.username,
        specialty: specialty || "General Practitioner",
        contact: contact || "Not provided",
        hospital: hospital || "",
        photo: photo || "",
        bio: bio || "",
        experience: experience ? parseInt(experience) : 0,
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
        userId: req.user.userId,
        educations: {
          create: educations && educations.length > 0 ? educations.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            startDate: new Date(edu.startDate),
            endDate: new Date(edu.endDate),
            description: edu.description || ""
          })) : []
        },
        workExperiences: {
          create: workExperiences && workExperiences.length > 0 ? workExperiences.map(exp => ({
            position: exp.position,
            hospital: exp.hospital,
            startDate: new Date(exp.startDate),
            endDate: new Date(exp.endDate),
            description: exp.description || ""
          })) : []
        },
        timeSlots: {
          create: timeSlots && timeSlots.length > 0 ? timeSlots.map(slot => ({
            dayOfWeek: slot.dayOfWeek || slot.day, // Support both field names
            startTime: formatTime(slot.startTime),
            endTime: formatTime(slot.endTime),
            isAvailable: true
          })) : []
        }
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            createdAt: true
          }
        },
        educations: true,
        workExperiences: true,
        timeSlots: true
      }
    });

    res.status(201).json({ 
      message: "Doctor profile created successfully", 
      doctor: {
        ...doctor,
        education: doctor.educations,
        qualifications: doctor.workExperiences
      }
    });
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    res.status(500).json({ message: "Error creating doctor profile" });
  }
};

export const updateDoctorProfile = async (req, res) => {
  const { 
    name, 
    specialty, 
    contact, 
    hospital, 
    photo,
    bio,
    experience,
    ticketPrice,
    educations,
    workExperiences,
    timeSlots
  } = req.body;
  
  try {
    const doctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
      include: {
        educations: true,
        workExperiences: true,
        timeSlots: true
      }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    console.log("Updating doctor profile with data:", {
      name, specialty, contact, hospital, photo, bio, experience, ticketPrice,
      educationsCount: educations?.length || 0,
      workExperiencesCount: workExperiences?.length || 0,
      timeSlotsCount: timeSlots?.length || 0
    });

    // Update basic doctor info
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        name: name || doctor.name,
        specialty: specialty || doctor.specialty,
        contact: contact || doctor.contact,
        hospital: hospital !== undefined ? hospital : doctor.hospital,
        photo: photo !== undefined ? photo : doctor.photo,
        bio: bio !== undefined ? bio : doctor.bio,
        experience: experience !== undefined ? parseInt(experience) : doctor.experience,
        ticketPrice: ticketPrice !== undefined ? parseFloat(ticketPrice) : doctor.ticketPrice,
      },
      include: {
        user: {
          select: {
            email: true,
            username: true
          }
        }
      }
    });

    // Update educations (delete all and recreate)
    if (educations !== undefined) {
      await prisma.education.deleteMany({
        where: { doctorId: doctor.id }
      });
      
      if (educations.length > 0) {
        await prisma.education.createMany({
          data: educations.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            startDate: new Date(edu.startDate),
            endDate: new Date(edu.endDate),
            description: edu.description || "",
            doctorId: doctor.id
          }))
        });
      }
    }

    // Update work experiences
    if (workExperiences !== undefined) {
      await prisma.workExperience.deleteMany({
        where: { doctorId: doctor.id }
      });
      
      if (workExperiences.length > 0) {
        await prisma.workExperience.createMany({
          data: workExperiences.map(exp => ({
            position: exp.position,
            hospital: exp.hospital,
            startDate: new Date(exp.startDate),
            endDate: new Date(exp.endDate),
            description: exp.description || "",
            doctorId: doctor.id
          }))
        });
      }
    }

    // Update time slots
    if (timeSlots !== undefined) {
      await prisma.timeSlot.deleteMany({
        where: { doctorId: doctor.id }
      });
      
      if (timeSlots.length > 0) {
        await prisma.timeSlot.createMany({
          data: timeSlots.map(slot => ({
            dayOfWeek: slot.dayOfWeek || slot.day, // Support both field names
            startTime: formatTime(slot.startTime),
            endTime: formatTime(slot.endTime),
            isAvailable: true,
            doctorId: doctor.id
          }))
        });
      }
    }

    // Get the fully updated doctor with all relations
    const finalDoctor = await prisma.doctor.findUnique({
      where: { id: doctor.id },
      include: {
        user: {
          select: {
            email: true,
            username: true
          }
        },
        educations: {
          orderBy: { startDate: 'desc' }
        },
        workExperiences: {
          orderBy: { startDate: 'desc' }
        },
        timeSlots: {
          orderBy: { dayOfWeek: 'asc' }
        }
      }
    });

    res.json({
      message: "Profile updated successfully",
      doctor: {
        ...finalDoctor,
        // For backward compatibility
        education: finalDoctor.educations,
        qualifications: finalDoctor.workExperiences
      }
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ message: "Error updating doctor profile" });
  }
};

// Other functions remain the same...
export const getDoctorAppointments = async (req, res) => {
  try {
    // Find doctor by userId
    const doctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
    });

    if (!doctor) {
      return res.json([]); // Return empty array if no profile
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: { patient: true },
    });
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    // Find doctor by userId
    const doctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Verify the appointment belongs to this doctor
    const appointment = await prisma.appointment.findFirst({
      where: { 
        id: Number(id),
        doctorId: doctor.id 
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status },
    });
    
    res.json({ message: "Appointment updated", appointment: updatedAppointment });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

// Get all doctors for public view - UPDATED
export const getAllDoctorsPublic = async (req, res) => {
    try {
        const { search } = req.query;
        
        console.log("Search query:", search);
        
        let whereClause = {};

        if (search && search.trim() !== '') {
            whereClause.OR = [
                { name: { contains: search } },
                { specialty: { contains: search } },
                { hospital: { contains: search } }
            ];
        }

        const doctors = await prisma.doctor.findMany({
            where: whereClause,
            include: {
                educations: true,
                workExperiences: true,
                timeSlots: true,
                user: {
                    select: {
                        email: true
                    }
                }
            }
        });

        console.log("Found doctors:", doctors.length);

        // Transform the data for frontend
        const doctorsWithFormattedData = doctors.map(doctor => ({
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            photo: doctor.photo || "/default-doctor.jpg",
            hospital: doctor.hospital,
            contact: doctor.contact,
            averageRating: doctor.avgRating || 0,
            totalReviews: doctor.totalRating || 0,
            experience: doctor.experience || 0,
            bio: doctor.bio || `Specialist in ${doctor.specialty}`,
            ticketPrice: doctor.ticketPrice || 0,
            // Use relational data directly
            education: doctor.educations,
            qualifications: doctor.workExperiences, // For backward compatibility
            workExperiences: doctor.workExperiences,
            timeSlots: doctor.timeSlots.map(slot => ({
                day: slot.dayOfWeek,
                time: `${slot.startTime} - ${slot.endTime}`,
                startTime: slot.startTime,
                endTime: slot.endTime
            }))
        }));

        res.status(200).json(doctorsWithFormattedData);
        
    } catch (error) {
        console.error("Error in getAllDoctorsPublic:", error);
        res.status(500).json({ 
            error: "Internal server error",
            message: error.message 
        });
    }
};

// Get doctor by ID - UPDATED
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log("Fetching doctor with ID:", id);

        const doctor = await prisma.doctor.findUnique({
            where: { 
                id: parseInt(id) 
            },
            include: {
                educations: {
                    orderBy: { startDate: 'desc' }
                },
                workExperiences: {
                    orderBy: { startDate: 'desc' }
                },
                timeSlots: {
                    orderBy: { dayOfWeek: 'asc' }
                },
                user: {
                    select: {
                        email: true,
                        username: true
                    }
                }
            }
        });

        if (!doctor) {
            return res.status(404).json({ 
                message: "Doctor not found" 
            });
        }

        console.log("Found doctor:", doctor.name);

        // Transform the data for frontend
        const doctorData = {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            photo: doctor.photo || "/default-doctor.jpg",
            hospital: doctor.hospital,
            contact: doctor.contact,
            averageRating: doctor.avgRating || 0,
            totalReviews: doctor.totalRating || 0,
            totalPatients: doctor.totalPatients || 0,
            experience: doctor.experience || 0,
            bio: doctor.bio || `Specialist in ${doctor.specialty}`,
            ticketPrice: doctor.ticketPrice || 0,
            // Use relational data directly
            education: doctor.educations,
            qualifications: doctor.workExperiences, // For backward compatibility
            workExperiences: doctor.workExperiences,
            timeSlots: doctor.timeSlots.map(slot => ({
                day: slot.dayOfWeek,
                time: `${slot.startTime} - ${slot.endTime}`,
                startTime: slot.startTime,
                endTime: slot.endTime
            })),
            email: doctor.user?.email,
            username: doctor.user?.username
        };

        res.status(200).json(doctorData);
        
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        res.status(500).json({ 
            error: "Internal server error",
            message: error.message 
        });
    }
};

function formatTime(timeString) {
    if (!timeString) return "09:00";
    
    // Handle various time formats
    if (timeString.includes(':')) {
        // Already in HH:MM format
        const [hours, minutes] = timeString.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }
    
    // Handle AM/PM format
    const time = new Date(`2000-01-01 ${timeString}`);
    if (!isNaN(time.getTime())) {
        return time.toTimeString().slice(0, 5); // Returns "09:00"
    }
    
    return "09:00"; // Default fallback
}
// Add to doctorsController.js
export const getDoctorReviews = async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 5 } = req.query

    const reviews = await prisma.testimonial.findMany({
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

    // Calculate rating distribution
    const ratingDistribution = await prisma.testimonial.groupBy({
      by: ['rating'],
      where: {
        doctorId: parseInt(id),
        status: 'APPROVED'
      },
      _count: {
        rating: true
      }
    })

    // Calculate average rating and total reviews
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
      reviews,
      averageRating: ratingStats._avg.rating || 0,
      totalReviews: ratingStats._count.rating || 0,
      ratingDistribution,
      totalPages: Math.ceil(ratingStats._count.rating / parseInt(limit)),
      currentPage: parseInt(page)
    })
  } catch (error) {
    console.error("Error fetching doctor reviews:", error)
    res.status(500).json({ message: "Server error fetching doctor reviews" })
  }
}

export const submitDoctorReview = async (req, res) => {
  try {
    const { id } = req.params
    const { rating, comment } = req.body
    const userId = req.user.userId

    // Verify user has completed appointment with this doctor
    const appointment = await prisma.appointment.findFirst({
      where: {
        patientId: userId,
        doctorId: parseInt(id),
        status: 'COMPLETED'
      }
    })

    if (!appointment) {
      return res.status(400).json({ 
        message: "You can only review doctors you've had completed appointments with" 
      })
    }

    // Check if user already reviewed this doctor
    const existingReview = await prisma.testimonial.findFirst({
      where: {
        patientId: userId,
        doctorId: parseInt(id)
      }
    })

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already reviewed this doctor" 
      })
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        rating: parseInt(rating),
        comment: comment.trim(),
        patientId: userId,
        doctorId: parseInt(id),
        status: 'PENDING'
      },
      include: {
        patient: {
          select: {
            name: true,
            photo: true
          }
        }
      }
    })

    res.status(201).json({
      message: "Thank you for your review! It is pending approval.",
      testimonial
    })
  } catch (error) {
    console.error("Error submitting doctor review:", error)
    res.status(500).json({ message: "Server error submitting review" })
  }
}