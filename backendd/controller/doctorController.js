// src/controllers/doctorController.js
import prisma from "../config/prisma.js";

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