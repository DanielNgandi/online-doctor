// src/controllers/doctorController.js
import prisma from "../config/prisma.js";

// Get doctor profile - Handle missing profile gracefully
export const getDoctorProfile = async (req, res) => {
  try {
    console.log("Request user:", req.user);

    // Find doctor by userId
    const doctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            createdAt: true
          }
        }
      }
    });

    if (!doctor) {
      console.log(`No doctor profile found for userId: ${req.user.userId}`);
      return res.status(404).json({ 
        message: "Doctor profile not found",
        needsSetup: true // Add this flag for frontend
      });
    }

    // Parse JSON fields for frontend
    const doctorWithParsedData = {
      ...doctor,
      email: doctor.user.email,
      username: doctor.user.username,
      createdAt: doctor.user.createdAt,
      education: doctor.education ? JSON.parse(doctor.education) : [],
      qualifications: doctor.qualifications ? JSON.parse(doctor.qualifications) : [],
      timeSlots: doctor.timeSlots ? JSON.parse(doctor.timeSlots) : []
    };

    res.json(doctorWithParsedData);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Get doctor stats - Handle missing profile gracefully
export const getDoctorStats = async (req, res) => {
  try {
    // Find doctor by userId
    const doctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
    });

    if (!doctor) {
      // Return empty stats if no profile exists
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

// Create doctor profile - UPDATED WITH ALL FIELDS
export const createDoctorProfile = async (req, res) => {
  const { 
    name, 
    specialty, 
    contact, 
    hospital, 
    photo,
    // NEW FIELDS
    bio,
    experience,
    ticketPrice,
    education,
    qualifications,
    timeSlots
  } = req.body;
  
  try {
    // Check if doctor profile already exists for this user
    const existingDoctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
    });

    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor profile already exists" });
    }

    // Get user info for default values
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare data for creation
    const doctorData = {
      name: name || user.username,
      specialty: specialty || "General Practitioner",
      contact: contact || "Not provided",
      hospital: hospital || "",
      photo: photo || "",
      userId: req.user.userId,
      // NEW FIELDS - Convert to JSON strings for database storage
      bio: bio || "",
      experience: experience ? parseInt(experience) : 0,
      ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
      education: education && education.length > 0 ? JSON.stringify(education) : null,
      qualifications: qualifications && qualifications.length > 0 ? JSON.stringify(qualifications) : null,
      timeSlots: timeSlots && timeSlots.length > 0 ? JSON.stringify(timeSlots) : null
    };

    console.log("Creating doctor profile with data:", doctorData);

    // Create doctor profile
    const doctor = await prisma.doctor.create({
      data: doctorData,
      include: {
        user: {
          select: {
            email: true,
            username: true,
            createdAt: true
          }
        }
      }
    });

    // Parse JSON fields for response
    const doctorResponse = {
      ...doctor,
      education: doctor.education ? JSON.parse(doctor.education) : [],
      qualifications: doctor.qualifications ? JSON.parse(doctor.qualifications) : [],
      timeSlots: doctor.timeSlots ? JSON.parse(doctor.timeSlots) : []
    };

    res.status(201).json({ 
      message: "Doctor profile created successfully", 
      doctor: doctorResponse 
    });
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    res.status(500).json({ message: "Error creating doctor profile" });
  }
};

// Update doctor profile - UPDATED WITH ALL FIELDS
export const updateDoctorProfile = async (req, res) => {
  const { 
    name, 
    specialty, 
    contact, 
    hospital, 
    photo,
    // NEW FIELDS
    bio,
    experience,
    ticketPrice,
    education,
    qualifications,
    timeSlots
  } = req.body;
  
  try {
    // Find doctor by userId
    const doctor = await prisma.doctor.findFirst({
      where: { userId: req.user.userId },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Prepare update data
    const updateData = {
      name,
      specialty,
      contact,
      hospital,
      photo,
      // NEW FIELDS - Convert to JSON strings for database storage
      bio: bio || "",
      experience: experience ? parseInt(experience) : 0,
      ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
      education: education && education.length > 0 ? JSON.stringify(education) : null,
      qualifications: qualifications && qualifications.length > 0 ? JSON.stringify(qualifications) : null,
      timeSlots: timeSlots && timeSlots.length > 0 ? JSON.stringify(timeSlots) : null
    };

    console.log("Updating doctor profile with data:", updateData);

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            username: true
          }
        }
      }
    });

    // Parse JSON fields for response
    const doctorResponse = {
      ...updatedDoctor,
      education: updatedDoctor.education ? JSON.parse(updatedDoctor.education) : [],
      qualifications: updatedDoctor.qualifications ? JSON.parse(updatedDoctor.qualifications) : [],
      timeSlots: updatedDoctor.timeSlots ? JSON.parse(updatedDoctor.timeSlots) : []
    };

    res.json({
      message: "Profile updated successfully",
      doctor: doctorResponse
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
        
        // Build search query for Prisma with MySQL
        let whereClause = {};

        if (search && search.trim() !== '') {
            whereClause.OR = [
                { name: { contains: search } },
                { specialty: { contains: search } },
                { hospital: { contains: search } }
            ];
        }

        console.log("Final where clause:", JSON.stringify(whereClause));

        const doctors = await prisma.doctor.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                specialty: true,
                photo: true,
                hospital: true,
                contact: true,
                avgRating: true,
                totalRating: true,
                totalPatients: true,
                bio: true,
                experience: true,
                ticketPrice: true,
                education: true,
                qualifications: true,
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
            education: doctor.education ? JSON.parse(doctor.education) : [],
            qualifications: doctor.qualifications ? JSON.parse(doctor.qualifications) : [],
            timeSlots: doctor.timeSlots ? JSON.parse(doctor.timeSlots) : []
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
            select: {
                id: true,
                name: true,
                specialty: true,
                photo: true,
                hospital: true,
                contact: true,
                avgRating: true,
                totalRating: true,
                totalPatients: true,
                bio: true,
                experience: true,
                ticketPrice: true,
                education: true,
                qualifications: true,
                timeSlots: true,
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
            education: doctor.education ? JSON.parse(doctor.education) : [],
            qualifications: doctor.qualifications ? JSON.parse(doctor.qualifications) : [],
            timeSlots: doctor.timeSlots ? JSON.parse(doctor.timeSlots) : [],
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