import prisma from "../config/prisma.js";

// Add this to your patientController.js
export const createPatientProfile = async (req, res) => {
  const { name, dob, gender, contact } = req.body;
  
  try {
    // Check if patient profile already exists for this user
    const existingPatient = await prisma.patient.findFirst({
      where: { userId: req.user.id },
    });

    if (existingPatient) {
      return res.status(400).json({ message: "Patient profile already exists" });
    }

    // Create patient profile
    const patient = await prisma.patient.create({
      data: {
        name,
        dob: new Date(dob),
        gender,
        contact,
        userId: req.user.id,
      },
    });

    res.status(201).json({ 
      message: "Patient profile created successfully", 
      patient 
    });
  } catch (error) {
    console.error("Error creating patient profile:", error);
    res.status(500).json({ message: "Error creating patient profile" });
  }
};

export const updatePatientProfile = async (req, res) => {
  const { name, dob, gender, contact } = req.body;
  
  try {
    const patient = await prisma.patient.findFirst({
      where: { userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: patient.id },
      data: {
        name,
        dob: new Date(dob),
        gender,
        contact,
      },
    });

    res.json({ 
      message: "Patient profile updated successfully", 
      patient: updatedPatient 
    });
  } catch (error) {
    console.error("Error updating patient profile:", error);
    res.status(500).json({ message: "Error updating patient profile" });
  }
};
// Get patient profile
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: { userId: req.user.id },
    });
    
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }
    
    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ message: "Error fetching patient profile" });
  }
};

// View doctors
export const viewDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            email: true,
            createdAt: true
          }
        }
      }
    });
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// Book appointment
export const bookAppointment = async (req, res) => {
  const { doctorId, date, reason } = req.body;
  
  try {
    // First, get the patient record associated with the logged-in user
    const patient = await prisma.patient.findFirst({
      where: { userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found. Please complete your profile." });
    }

    // Verify doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log("Creating appointment with:", {
      patientId: patient.id,
      doctorId: parseInt(doctorId),
      date: new Date(date),
      reason
    });

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: parseInt(doctorId),
        patientId: patient.id, // Use the actual patient ID, not user ID
        date: new Date(date),
        reason: reason || "General consultation",
      },
      include: {
        patient: true,
        doctor: true
      }
    });
    
    console.log("Appointment created successfully:", appointment);
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("Detailed error booking appointment:", err);
    console.error("Error code:", err.code);
    console.error("Error meta:", err.meta);
    
    // Handle specific Prisma errors
    if (err.code === 'P2002') {
      return res.status(400).json({ 
        message: "Appointment conflict or duplicate entry" 
      });
    }
    
    if (err.code === 'P2003') {
      return res.status(400).json({ 
        message: "Foreign key constraint failed - patient or doctor not found" 
      });
    }
    
    res.status(500).json({ 
      message: "Error booking appointment",
      error: err.message 
    });
  }
};

// Get patient appointments
export const getMyAppointments = async (req, res) => {
  try {
    // First, get the patient record associated with the logged-in user
    const patient = await prisma.patient.findFirst({
      where: { userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id }, // Use patient ID, not user ID
      include: { 
        doctor: true,
        patient: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};
