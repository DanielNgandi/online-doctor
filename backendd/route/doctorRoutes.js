import express from "express";
import { getDoctorAppointments, updateAppointmentStatus, getAllDoctors} from "../controller/doctorController.js";
import { protect, checkRole } from "../middlewares/AuthMiddleware.js";

const router = express.Router();
router.get("/", getAllDoctors);
router.get("/appointments", protect, checkRole(["doctor"]), getDoctorAppointments);
router.patch("/appointments/:id", protect, checkRole(["doctor"]), updateAppointmentStatus);
export default router;
