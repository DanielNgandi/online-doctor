import express from "express";
import { body } from "express-validator";
import {createDoctorProfile, getDoctorProfile, updateDoctorProfile, getDoctorStats, getDoctorAppointments, updateAppointmentStatus, getAllDoctorsPublic, getDoctorById } from "../controller/doctorController.js";
import { protect, checkRole } from "../middlewares/AuthMiddleware.js";
import {upload} from '../middlewares/Mutter.js';
import { PrismaClient } from "@prisma/client";
import fs from 'fs'; 
import path from 'path'; 

const router = express.Router();
const prisma = new PrismaClient();

const getPhotoUrl = (file) => {
  if (!file) return null;
  return `/uploads/${file.filename}`;
};
router.post('/upload-photo', protect, checkRole(['doctor']), upload.single('photo'), async (req, res) => {
  try {
    console.log('=== UPLOAD DEBUG INFO ===');
    console.log('Upload photo request received for user:', req.user.id);
    console.log('Uploaded file info:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert Windows path to URL-friendly path
    //let photoUrl = `/uploads/${req.file.filename}`;

    const photoUrl = getPhotoUrl(req.file);
    
    // Alternatively, normalize the path
    photoUrl = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    
    console.log('Photo URL to store:', photoUrl);
    
    // Update doctor using Prisma
    const doctor = await prisma.doctor.update({
      where: {
        userId: req.user.id
      },
      data: {
        photo: photoUrl
      }
    });

    console.log('Database update successful');

    res.json({ 
      message: 'Photo uploaded successfully',
      photoUrl: photoUrl
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        message: 'Doctor profile not found. Please create your profile first.' 
      });
    }
    
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Remove photo endpoint
router.delete('/photo', protect, checkRole(['doctor']), async (req, res) => {
  try {
    console.log('=== REMOVE PHOTO REQUEST ===');
    
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    if (doctor.photo) {
      // Try to delete the file (if it exists)
      try {
        const filename = doctor.photo.split('/').pop();
        const filePath = path.join(process.cwd(), 'uploads', filename);
        
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log('Warning: Could not delete file, but continuing:', err.message);
            }
          });
        }
      } catch (fileError) {
        console.log('File deletion warning:', fileError.message);
        // Continue even if file deletion fails
      }
      
      // Always update database to remove photo reference
      await prisma.doctor.update({
        where: { userId: req.user.id },
        data: { photo: null }
      });
    }

    res.json({ 
      success: true,
      message: 'Photo removed successfully' 
    });
  } catch (error) {
    console.error('Remove photo error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove photo',
      error: error.message 
    });
  }
});
router.post("/profile", protect, checkRole(['doctor']), createDoctorProfile);
router.get("/profile", protect, checkRole(['doctor']), getDoctorProfile);
router.put("/profile", protect, checkRole(['doctor']), updateDoctorProfile);
router.get("/stats", protect, checkRole(['doctor']), getDoctorStats);
router.get("/", getAllDoctorsPublic );
//router.get('/doctors/update-stats', updateAllDoctorsStats);
router.get("/:id", getDoctorById); 
router.get("/appointments", protect, checkRole(["doctor"]), getDoctorAppointments);
router.patch("/appointments/:id", protect, checkRole(["doctor"]), updateAppointmentStatus);
export default router;
