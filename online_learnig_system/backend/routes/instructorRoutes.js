// const express = require("express");
// const router = express.Router();
// const {
//   getAllInstructors,
//   getInstructorById,
//   addInstructor,
//   updateInstructor,
//   deleteInstructor,
// } = require("../controllers/instructorController");

// const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");

// // Routes
// router.get("/", authenticateToken, requireAdmin, getAllInstructors);
// router.get("/:id", authenticateToken, requireAdmin, getInstructorById);
// router.post("/", authenticateToken, requireAdmin, addInstructor);
// router.put("/:id", authenticateToken, requireAdmin, updateInstructor);
// router.delete("/:id", authenticateToken, requireAdmin, deleteInstructor);

// module.exports = router;
// routes/instructorRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getPublicInstructors,
  getInstructors,
  getInstructor,
  addInstructor,
  updateInstructor,
  deleteInstructor,
  getInstructorCourses,
} = require("../controllers/instructorController");
//const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


router.get("/public", getPublicInstructors);

router.get("/", getInstructors);


router.get("/:id", getInstructor);

router.get("/:id/courses", getInstructorCourses);

router.post("/", upload.single("profileImage"), addInstructor);

router.put("/:id", upload.single("profileImage"), updateInstructor);


router.delete("/:id", deleteInstructor);

module.exports = router;
