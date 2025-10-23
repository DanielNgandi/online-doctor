// src/controllers/doctorController.js
import prisma from "../config/prisma.js";

export const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.id; // From JWT token
    
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.json({
      ...doctor,
      email: doctor.user.email,
      createdAt: doctor.user.createdAt
    });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { name, specialty, contact, hospital, photo } = req.body;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: parseInt(doctorId) },
      data: {
        name,
        specialty,
        contact,
        hospital,
        photo
      }
    });

    res.json({
      message: "Profile updated successfully",
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const totalAppointments = await prisma.appointment.count({
      where: { doctorId: parseInt(doctorId) }
    });

    const upcomingAppointments = await prisma.appointment.count({
      where: { 
        doctorId: parseInt(doctorId),
        date: { gte: new Date() }
      }
    });

    const totalPatients = await prisma.appointment.groupBy({
      by: ['patientId'],
      where: { doctorId: parseInt(doctorId) },
      _count: { patientId: true }
    });

    res.json({
      totalAppointments,
      upcomingAppointments,
      totalPatients: totalPatients.length
    });
  } catch (error) {
    console.error("Error fetching doctor stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get doctor's appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: req.user.id },
      include: { patient: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // completed/cancelled
  try {
    const appointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error updating appointment" });
  }
};
// Get all doctors (for patients to see)
export const getAllDoctors = async (req, res) => {
  try {
    const { search } = req.query;

    const doctors = await prisma.doctor.findMany({
      where: search
        ? { name: { contains: search, mode: "insensitive" } }
        : {},
      select: {
        id: true,
        name: true,
        specialty: true,
        contact: true,
        photo: true,
        avgRating: true,
        totalRating: true,
        totalPatients: true,
        hospital: true,
        user: { select: { email: true } },
      },
    });

    res.json(doctors);
  } catch (err) {
    console.error("Prisma error: ", err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};