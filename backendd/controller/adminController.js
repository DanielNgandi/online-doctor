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
    const doctors = await prisma.user.findMany({ where: { role: "doctor" } });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { doctor: true, patient: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};
