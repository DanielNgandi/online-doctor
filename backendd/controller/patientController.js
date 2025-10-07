import prisma from "../config/prisma.js";

// View doctors
export const viewDoctors = async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({ where: { role: "doctor" } });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// Book appointment
export const bookAppointment = async (req, res) => {
  const { doctorId, date } = req.body;
  try {
    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId: req.user.id,
        date: new Date(date),
        status: "pending",
      },
    });
    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment" });
  }
};

// Get patient appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: req.user.id },
      include: { doctor: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};
