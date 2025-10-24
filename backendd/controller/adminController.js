// src/controllers/adminController.js
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

// Add a new doctor
export const addDoctor = async (req, res) => {
  const { username, email, password, name, specialty, contact, photo, hospital } = req.body;
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "doctor",
      },
    });

    // 2️⃣ create doctor profile linked to user
    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialty,
        contact,
        photo,
        hospital,
        userId: user.id,
      },
    });

    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (err) {
    console.error("Error adding doctor: ", err);
    res.status(500).json({ message: "Error adding doctor" });
  }
};

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true
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

// Get all appointments for admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            contact: true,
            hospital: true,
            user: {
              select: {
                email: true
              }
            }
          }
        },
        patient: {
          select: {
            id: true,
            name: true,
            contact: true,
            gender: true,
            dob: true,
            user: {
              select: {
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Transform the data to make it easier to use in frontend
    const transformedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      date: appointment.date,
      reason: appointment.reason,
      createdAt: appointment.createdAt,
      doctor: {
        id: appointment.doctor.id,
        name: appointment.doctor.name,
        specialty: appointment.doctor.specialty,
        contact: appointment.doctor.contact,
        hospital: appointment.doctor.hospital,
        email: appointment.doctor.user?.email
      },
      patient: {
        id: appointment.patient.id,
        name: appointment.patient.name,
        contact: appointment.patient.contact,
        gender: appointment.patient.gender,
        dob: appointment.patient.dob,
        email: appointment.patient.user?.email
      }
    }));

    res.json({
      success: true,
      appointments: transformedAppointments
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching appointments",
      error: err.message 
    });
  }
};

// Get appointment statistics for admin
export const getAppointmentStats = async (req, res) => {
  try {
    const totalAppointments = await prisma.appointment.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    const upcomingAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: new Date()
        }
      }
    });

    res.json({
      success: true,
      stats: {
        total: totalAppointments,
        today: todayAppointments,
        upcoming: upcomingAppointments
      }
    });
  } catch (err) {
    console.error("Error fetching appointment stats:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching appointment statistics",
      error: err.message 
    });
  }
};