// routes/studentRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getPublicStudents,
  getStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

// Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// Public route
router.get("/public", getPublicStudents);

// Admin routes
router.get("/", getStudents);
router.get("/:id", getStudent);
router.post("/", upload.single("profileImage"), addStudent);
router.put("/:id", upload.single("profileImage"), updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
