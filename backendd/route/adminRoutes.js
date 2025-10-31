import express from "express";
import { addDoctor, getAllDoctors, getAllAppointments,getAppointmentStats,getAdminProfile, updateAdminProfile, getAdminStats } from "../controller/adminController.js";
import { protect, checkRole } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/profile", protect, checkRole(["admin"]), getAdminProfile);
router.put("/profile", protect, checkRole(["admin"]), updateAdminProfile);
router.get("/stats", protect, checkRole(["admin"]), getAdminStats);
router.post("/doctors", protect, checkRole(["admin"]), addDoctor);
router.get("/doctors", protect, checkRole(["admin"]), getAllDoctors);
router.get("/appointments", protect, checkRole(["admin"]), getAllAppointments);
router.get("/appointments/stats", protect, checkRole(["admin"]), getAppointmentStats);
export default router;
