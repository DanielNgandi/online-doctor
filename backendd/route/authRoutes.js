import express from "express";
import { login, register, getMe, registerDoctor } from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/register/doctor", registerDoctor);
router.post("/login", login);
router.get("/me",  getMe)

export default router;
