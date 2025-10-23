import prisma from "../config/prisma.js";

export const getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true, doctor: true },
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};
export const getDoctorAppointments = async (req, res) => {
  try {
    const { filter, date } = req.query;
    const doctorId = req.user.id; // Assuming doctor ID is in token

     console.log("Doctor ID from token:", doctorId);
    console.log("User object:", req.user);
    console.log("Filter:", filter);
    console.log("Date:", date);

    let whereClause = { doctorId: parseInt(doctorId) };

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      whereClause.date = {
        gte: startDate,
        lt: endDate
      };
    }

    // Filter by status (upcoming/past)
    if (filter === 'upcoming') {
      whereClause.date = { ...whereClause.date, gte: new Date() };
    } else if (filter === 'past') {
      whereClause.date = { ...whereClause.date, lt: new Date() };
    }

    console.log("Final where clause:", whereClause);

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            contact: true,    // Use contact instead of email
            gender: true,     // Add gender
            dob: true  
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            contact:true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    console.log("Found appointments:", appointments.length);
    console.log("Appointments:", appointments);
    
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ 
      message: "Error fetching appointments",
      error: error.message 
    });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // This is User ID from JWT token
    
    console.log("User ID from token:", userId);

    // First, find the patient record associated with this user
    const patient = await prisma.patient.findFirst({
      where: { 
        userId: parseInt(userId) 
      }
    });

    console.log("Found patient:", patient);

    if (!patient) {
      return res.status(404).json({ 
        message: "Patient profile not found for this user" 
      });
    }

    const { filter } = req.query;
    let whereClause = { patientId: parseInt(patient.id) }; // Use patient.id, not user.id

    if (filter === 'upcoming') {
      whereClause.date = { gte: new Date() };
    } else if (filter === 'past') {
      whereClause.date = { lt: new Date() };
    }

    console.log("Fetching appointments with where clause:", whereClause);

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            contact: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    console.log("Appointments found:", appointments.length);
    res.json(appointments);
    
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ 
      message: "Error fetching appointments",
      error: error.message 
    });
  }
};

export const createAppointment = async (req, res) => {
  const { date, reason, patientId, doctorId } = req.body;
  console.log("Creating appointment with data:", { date, reason, patientId, doctorId });
    try {
    // First, verify that both patient and doctor exist
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) }
    });
    
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) }
    });

    console.log("Patient found:", patient);
    console.log("Doctor found:", doctor);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await prisma.appointment.create({
      data: { 
        date: new Date(date), 
        reason, 
        patientId: parseInt(patientId), 
        doctorId: parseInt(doctorId) 
      },
    });
    
    console.log("Appointment created successfully:", appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Detailed error creating appointment:", error);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: "Appointment conflict or duplicate entry" 
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: "Foreign key constraint failed - patient or doctor not found" 
      });
    }
    
    res.status(500).json({ 
      message: "Error creating appointment",
      error: error.message 
    });
  }
};
