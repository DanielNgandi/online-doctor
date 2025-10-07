import express from "express";
import { viewDoctors, bookAppointment, getMyAppointments } from "../controller/patientController.js";
import { protect, checkRole } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/doctors", protect, checkRole(["patient"]), viewDoctors);
router.post("/appointments", protect, checkRole(["patient"]), bookAppointment);
router.get("/appointments", protect, checkRole(["patient"]), getMyAppointments);



export default router;
