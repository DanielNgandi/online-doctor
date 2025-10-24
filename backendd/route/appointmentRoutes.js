import express from "express";
import { getAppointments,getDoctorAppointments,getPatientAppointments, createAppointment } from "../controller/appointmentController.js";
import { protect } from "../middlewares/AuthMiddleware.js";
//import { getAllAppointments } from "../controllers/adminController.js";

const router = express.Router();

router.get("/", protect, getAppointments);
router.post("/", protect, createAppointment);
router.get("/doctor/my-appointments", protect, getDoctorAppointments);
router.get("/patient/my-appointments", protect, getPatientAppointments);
//router.get("/admin/all-appointments", protect, checkRole(["admin"]), getAllAppointments);

export default router;
