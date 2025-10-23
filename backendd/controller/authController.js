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

//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET || "your_jwt_secret",
//       { expiresIn: "7d" }
//     );

//     res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
 // Create token with appropriate ID based on role
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
        role: user.role 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
