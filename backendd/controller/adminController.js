// src/controllers/adminController.js
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const addDoctor = async (req, res) => {
  try {
    const { username, email, password, name, specialty, contact, photo, hospital } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    // Generate a random password if not provided
    const doctorPassword = password || generateRandomPassword();
    const hashedPassword = await bcrypt.hash(doctorPassword, 10);

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

    const responseData = {
      message: "Doctor added successfully",
      doctor: {
        id: result.doctor.id,
        name: result.doctor.name,
        specialty: result.doctor.specialty,
        email: result.user.email,
        username: result.user.username,
      }
    };

    // Include password only if generated (not provided by admin)
    if (!password) {
      responseData.generatedPassword = doctorPassword;
    }

    res.status(201).json(responseData);

  } catch (error) {
    console.error("Add doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

function generateRandomPassword() {
  return Math.random().toString(36).slice(-8);
}

// Get all doctors for admin
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
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
// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await prisma.user.findUnique({
      where: {
        id: req.user.id,
        role: 'admin'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found" });
    }

    // Since your User model doesn't have name, contact, department, photo fields,
    // we'll use the username as name and provide default values
    const adminProfile = {
      ...admin,
      name: admin.username, // Using username as name
      contact: 'Not set', // Default value since contact field doesn't exist
      department: 'System Administration', // Default value
      photo: null // Default value since photo field doesn't exist
    };

    res.json(adminProfile);
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ message: "Error fetching admin profile" });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  const { name, email, contact, department, photo } = req.body;
  
  try {
    // Only update fields that exist in your schema
    const updateData = {
      username: name, // Map name to username
      email: email
    };

    const updatedAdmin = await prisma.user.update({
      where: {
        id: req.user.id,
        role: 'admin'
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Return the transformed data to match frontend expectations
    const adminProfile = {
      ...updatedAdmin,
      name: updatedAdmin.username,
      contact: contact || 'Not set',
      department: department || 'System Administration',
      photo: photo || null
    };

    res.json({
      message: "Profile updated successfully",
      admin: adminProfile
    });
  } catch (err) {
    console.error("Error updating admin profile:", err);
    res.status(500).json({ message: "Error updating admin profile" });
  }
};

// Get admin statistics
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({
      where: {
        role: 'patient'
      }
    });

    const totalDoctors = await prisma.user.count({
      where: {
        role: 'doctor'
      }
    });

    const totalAppointments = await prisma.appointment.count();

    // Since there's no fee field in appointments, we'll calculate some other metrics
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

    res.json({
      totalUsers,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      totalRevenue: 0 // Default to 0 since no revenue tracking in schema
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Error fetching admin statistics" });
  }
};