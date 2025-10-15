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

export const createAppointment = async (req, res) => {
  const { date, reason, patientId, doctorId } = req.body;
  console.log("Creating appointment with data:", { date, reason, patientId, doctorId });
  try {
    const appointment = await prisma.appointment.create({
      data: { 
        date: new Date(date), 
        reason, 
        patientId, 
        doctorId 
      },
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment" });
  }
};
