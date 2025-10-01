const express = require("express");
const multer = require("multer");
const { addCourse, getCourses, updateCourse, deleteCourse,getCourseById } = require("../controllers/courseController");

const router = express.Router();

// Set up file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "thumbnailUrl") cb(null, "uploads/thumbnails");
    else if (file.fieldname === "contentUrl") cb(null, "uploads/videos");
    else cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.fields([{ name: "thumbnailUrl" }, { name: "contentUrl" }]), addCourse);
router.get("/", getCourses);
router.put("/:id", upload.fields([{ name: "thumbnailUrl" }, { name: "contentUrl" }]), updateCourse);
router.delete("/:id", deleteCourse);
router.get("/:id", getCourseById);

module.exports = router;
