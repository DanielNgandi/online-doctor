import express from "express";
import { login, register, getMe, registerDoctor } from "../controller/authController.js";
import { upload } from "../middlewares/Mutter.js"; 

const router = express.Router();

router.post("/register", upload.single("photo"), register);
router.post("/register/doctor", upload.single("photo"), registerDoctor);
router.post("/login", login);
router.get("/me",  getMe)

export default router;
