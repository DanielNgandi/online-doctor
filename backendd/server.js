import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import authRoutes from "./route/authRoutes.js";
import patientRoutes from "./route/patientRoutes.js";
import doctorRoutes from "./route/doctorRoutes.js";
import testimonialRoutes from "./route/TestimonialRoutes.js";
import adminRoutes from "./route/adminRoutes.js";
import appointmentRoutes from "./route/appointmentRoutes.js";
import { fileURLToPath } from 'url';

// For ES modules, get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();


const app = express();

app.use(cors({
  origin: "https://hospitalmanagementsy.netlify.app",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/appointments", appointmentRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
