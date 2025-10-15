import express from "express";
import { getAppointments, createAppointment } from "../controller/appointmentController.js";
import { protect } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", protect, getAppointments);
router.post("/", protect, createAppointment);

export default router;
