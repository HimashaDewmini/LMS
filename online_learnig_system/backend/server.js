const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("./generated/prisma");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads/thumbnails"),
  path.join(__dirname, "uploads/videos"),
  path.join(__dirname, "uploads/documents"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to check admin role (fixed case sensitivity)
const requireAdmin = (req, res, next) => {
  if ((req.user.role || "").toUpperCase() !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};

const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

// Contact Us endpoint
app.post("/api/contact", authenticateToken, async (req, res) => {
  const { fullName, phoneNumber, message } = req.body;
  if (!fullName || !phoneNumber || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true, name: true }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    await transporter.sendMail({
      from: `"${fullName}" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `New Contact Message from ${fullName}`,
      text: `Name: ${fullName}\nEmail: ${user.email}\nPhone: ${phoneNumber}\nMessage: ${message}`,
      replyTo: user.email,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
});


// /me route
app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, role: true } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/admin/dashboard", authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin! This route is protected." });
});

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);


const instructorRoutes = require("./routes/instructorRoutes");
app.use("/api/instructors", instructorRoutes);


const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);


const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);


const initializeCategories = async () => {
  try {
    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
      console.log("No categories found, creating default categories...");
      
      const defaultCategories = [
        { name: "Computer Science", description: "Programming, algorithms, software development" },
        { name: "Mathematics", description: "Algebra, calculus, statistics, and more" },
        { name: "Arts & Humanities", description: "Literature, history, philosophy, creative arts" },
        { name: "Business", description: "Management, marketing, finance, entrepreneurship" },
        { name: "Languages", description: "Foreign language learning and linguistics" },
        { name: "Data Science", description: "Data analysis, machine learning, statistics" },
        { name: "Design", description: "Graphic design, UI/UX, creative design" },
        { name: "Engineering", description: "Mechanical, electrical, civil engineering" },
        { name: "Health & Medicine", description: "Medical sciences, healthcare, wellness" },
        { name: "Personal Development", description: "Self-improvement, productivity, life skills" },
      ];

      await prisma.category.createMany({
        data: defaultCategories
      });
      
      console.log("Default categories created successfully!");
    }
  } catch (error) {
    console.error("Error initializing categories:", error);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeCategories();
});

