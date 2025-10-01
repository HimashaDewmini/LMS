const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;
    const ext = path.extname(file.originalname).toLowerCase();

    if ([".jpeg", ".jpg", ".png", ".webp"].includes(ext)) {
      dir = path.join(process.cwd(), "uploads/thumbnails");
    } else if ([".pdf", ".zip"].includes(ext)) {
      dir = path.join(process.cwd(), "uploads/documents");
    } else if ([".mp4"].includes(ext)) {
      dir = path.join(process.cwd(), "uploads/videos");
    } else {
      return cb(new Error("Unsupported file type"), false);
    }

    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf|zip|mp4/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

  if (mimetype && extname) cb(null, true);
  else cb(new Error("Error: Invalid file type!"));
};

// Multer instance for multiple fields
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB
}).fields([
  { name: "thumbnailUrl", maxCount: 1 },
  { name: "contentUrl", maxCount: 1 },
]);

module.exports = upload;
