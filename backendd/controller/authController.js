import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role.toLowerCase()  
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerDoctor = async (req, res) => {
  const { username, email, password, name, specialty, contact, photo, hospital } = req.body;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and doctor in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user with doctor role
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: 'doctor'
        }
      });

      // Create doctor profile
      const doctor = await prisma.doctor.create({
        data: {
          name,
          specialty,
          contact,
          photo,
          hospital,
          userId: user.id
        }
      });

      return { user, doctor };
    });

    // Generate token with doctor ID
    const token = jwt.sign(
      { 
        id: result.doctor.id,        // Doctor ID for doctor routes
        userId: result.user.id,      // User ID for reference
        role: 'doctor' 
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Doctor registered successfully",
      token,
      user: {
        id: result.doctor.id,
        userId: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: 'doctor',
        name: result.doctor.name,
        specialty: result.doctor.specialty
      }
    });

  } catch (error) {
    console.error("Doctor registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        patient: true, // Include patient relation
        doctor: true   // Include doctor relation
      }
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    let entityId;
    if (user.role === 'patient' && user.patient) {
      entityId = user.patient.id; // Use patient ID for patients
    } else if (user.role === 'doctor' && user.doctor) {
      entityId = user.doctor.id; // Use doctor ID for doctors
    } else {
      entityId = user.id; // Fallback to user ID
    }

    const token = jwt.sign(
      { 
        id: entityId,        // Use the appropriate entity ID
        userId: user.id,     // Also include user ID for reference
        role: user.role 
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    res.json({ 
      token, 
      user: { 
        id: entityId,
        userId: user.id,
        username: user.username, 
        role: user.role,
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        patient: true,
        doctor: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileData = {};
    if (user.role === 'doctor' && user.doctor) {
      profileData = user.doctor;
    } else if (user.role === 'patient' && user.patient) {
      profileData = user.patient;
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      ...profileData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
