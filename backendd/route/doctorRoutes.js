import express from "express";
import {createDoctorProfile, getDoctorProfile, updateDoctorProfile, getDoctorStats, getDoctorAppointments, updateAppointmentStatus, getAllDoctorsPublic } from "../controller/doctorController.js";
import { protect, checkRole } from "../middlewares/AuthMiddleware.js";

const router = express.Router();
router.post("/profile", protect, checkRole(['doctor']), createDoctorProfile);
router.get("/profile", protect, checkRole(['doctor']), getDoctorProfile);
router.put("/profile", protect, checkRole(['doctor']), updateDoctorProfile);
router.get("/stats", protect, checkRole(['doctor']), getDoctorStats);
router.get("/", getAllDoctorsPublic );
router.get("/appointments", protect, checkRole(["doctor"]), getDoctorAppointments);
router.patch("/appointments/:id", protect, checkRole(["doctor"]), updateAppointmentStatus);
export default router;
