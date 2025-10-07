import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./route/authRoutes.js";
import patientRoutes from "./route/patientRoutes.js";
import doctorRoutes from "./route/doctorRoutes.js";
import adminRoutes from "./route/adminRoutes.js";
import appointmentRoutes from "./route/appointmentRoutes.js";

dotenv.config();


const app = express();

app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
//app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
