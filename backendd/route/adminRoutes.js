import express from "express";
import { addDoctor, getDoctors, getAllAppointments,getAppointmentStats  } from "../controller/adminController.js";
import { protect, checkRole } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/doctors", protect, checkRole(["admin"]), addDoctor);
router.get("/doctors", protect, checkRole(["admin"]), getDoctors);
router.get("/appointments", protect, checkRole(["admin"]), getAllAppointments);
router.get("/appointments/stats", protect, checkRole(["admin"]), getAppointmentStats);
export default router;
