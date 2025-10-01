// instructors.controller.js
require("dotenv").config(); // ensure .env is loaded (safe even if already loaded)

const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// ================= Helpers for FRONTEND URL =================
const normalizeFrontendUrl = (raw) => {
  // fallback if missing, empty, or literally "undefined"
  if (!raw) return "http://localhost:3000";
  let t = String(raw).trim();
  if (t === "" || t.toLowerCase() === "undefined") return "http://localhost:3000";

  // remove trailing slashes
  t = t.replace(/\/+$/, "");

  // if user forgot scheme, add http:// so new URL() will work
  if (!/^https?:\/\//i.test(t)) t = "http://" + t;

  return t;
};

const buildLoginUrl = () => {
  const frontend = normalizeFrontendUrl(process.env.FRONTEND_URL);
  const loginUrl = `${frontend}/login`;

  // validate URL (defensive)
  try {
    new URL(loginUrl);
    return loginUrl;
  } catch (err) {
    console.warn(
      "[instructors] Invalid FRONTEND_URL detected, falling back to http://localhost:3000/login",
      loginUrl,
      err?.message
    );
    return "http://localhost:3000/login";
  }
};

// ================= Nodemailer =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

// Verify email config at startup (async)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error && error.message ? error.message : error);
  } else {
    console.log("✅ Email server is ready to take messages");
  }
});

// ================= Helpers =================
const generateWelcomeEmailHTML = (name, email, password, loginUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome</title></head>
<body style="font-family: Arial, sans-serif; line-height:1.4; color:#111;">
  <h2>Hello ${name},</h2>
  <p>Your instructor account has been created successfully.</p>
  <p><b>Email:</b> ${email}</p>
  <p><b>Password:</b> ${password}</p>

  <p>
    <a href="${loginUrl}" style="display:inline-block;padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:6px;">
      Login
    </a>
  </p>

  <p>If the button above doesn't work, copy & paste this link into your browser:</p>
  <p><a href="${loginUrl}">${loginUrl}</a></p>

  <p><b>Please change your password after first login.</b></p>
</body>
</html>`;



// ✅ Public instructors (no auth)
const getPublicInstructors = async (req, res) => {
  try {
    const instructors = await prisma.user.findMany({
      where: { role: "instructor", status: "Active" },
      select: {
        id: true,
        name: true,
        email: true,
        rating: true,
        status: true,
        profileImage: true,
        contact: true,
        createdAt: true,
        courses: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = instructors.map((inst) => ({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      totalCourses: inst.courses.length,
      rating: inst.rating || 0,
      status: inst.status,
      profileImage: inst.profileImage || null,
      contact: inst.contact,
      createdAt: inst.createdAt,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching public instructors:", err);
    res.status(500).json({ message: "Failed to fetch instructors" });
  }
};

// ✅ Admin: Get all instructors
const getInstructors = async (req, res) => {
  try {
    const { status, search } = req.query;
    let where = { role: "instructor" };

    if (status && status !== "All") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { contact: { contains: search, mode: "insensitive" } },
      ];
    }

    const instructors = await prisma.user.findMany({
      where,
      include: { courses: true },
      orderBy: { createdAt: "desc" },
    });

    const data = instructors.map((inst) => ({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      totalCourses: inst.courses.length,
      rating: inst.rating || 0,
      status: inst.status,
      profileImage: inst.profileImage || null,
      contact: inst.contact || "",
      createdAt: inst.createdAt,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching instructors:", err);
    res.status(500).json({ message: "Failed to fetch instructors" });
  }
};

// ✅ Get single instructor (with courses + student count)
const getInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const inst = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        courses: {
          include: { enrollments: true, _count: { select: { enrollments: true } } },
        },
      },
    });

    if (!inst) return res.status(404).json({ message: "Instructor not found" });
    if (inst.role !== "instructor")
      return res.status(400).json({ message: "User is not an instructor" });

    const totalStudents = inst.courses.reduce((sum, c) => sum + c._count.enrollments, 0);

    res.json({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      totalCourses: inst.courses.length,
      totalStudents,
      rating: inst.rating || 0,
      status: inst.status,
      contact: inst.contact,
      profileImage: inst.profileImage,
      courses: inst.courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        studentCount: c._count.enrollments,
      })),
    });
  } catch (err) {
    console.error("Error fetching instructor:", err);
    res.status(500).json({ message: "Failed to fetch instructor" });
  }
};

// ✅ Add new instructor (with email + random password)
const addInstructor = async (req, res) => {
  try {
    const { name, email, status = "Active", contact, rating, courseIds } = req.body;
    const file = req.file;

    if (!name || !email) return res.status(400).json({ message: "Name and Email are required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const randomPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const instructor = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        role: "instructor",
        status,
        contact: contact || null,
        rating: rating ? Math.min(5, Math.max(0, Number(rating))) : 0,
        password: hashedPassword,
        profileImage: file ? `/uploads/${file.filename}` : null,
        ...(courseIds && {
          courses: { connect: courseIds.map((id) => ({ id: Number(id) })) },
        }),
      },
      include: { courses: true },
    });

    // Build + validate login URL
    const loginUrl = buildLoginUrl();
    console.log(`[instructors] Sending welcome email with loginUrl: ${loginUrl}`);

    try {
      await transporter.sendMail({
        from: `"Admin" <${process.env.SMTP_USER || process.env.EMAIL_USER || "no-reply@example.com"}>`,
        to: email,
        subject: "🎓 Welcome! Your Instructor Account is Ready",
        html: generateWelcomeEmailHTML(name, email, randomPassword, loginUrl),
        text: `Hello ${name},

Your instructor account has been created.
Email: ${email}
Password: ${randomPassword}

Login here: ${loginUrl}

Please change your password after first login.
`,
      });
    } catch (emailErr) {
      console.error("❌ Email error while sending welcome email:", emailErr);
      // continue — don't fail the whole request if email fails
    }

    res.status(201).json({
      message: "Instructor added successfully",
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        totalCourses: instructor.courses.length,
        status: instructor.status,
      },
    });
  } catch (err) {
    console.error("Error adding instructor:", err);
    res.status(500).json({ message: "Failed to add instructor" });
  }
};

// ✅ Update instructor
const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status, contact, rating, courseIds, password } = req.body;
    const file = req.file;

    let data = {
      name,
      email: email?.toLowerCase(),
      status,
      contact,
      rating: rating ? Math.min(5, Math.max(0, Number(rating))) : 0,
    };

    if (password) data.password = await bcrypt.hash(password, 12);
    if (file) data.profileImage = `/uploads/${file.filename}`;
    if (courseIds) data.courses = { set: courseIds.map((id) => ({ id: Number(id) })) };

    const instructor = await prisma.user.update({
      where: { id: Number(id) },
      data,
      include: { courses: true },
    });

    res.json({ message: "Instructor updated successfully", instructor });
  } catch (err) {
    console.error("Error updating instructor:", err);
    res.status(500).json({ message: "Failed to update instructor" });
  }
};

// ✅ Delete instructor (only if no courses)
const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { courses: true },
    });

    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    if (instructor.courses.length > 0) {
      return res.status(400).json({
        message: `Cannot delete instructor. They are assigned to ${instructor.courses.length} course(s).`,
      });
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Instructor deleted successfully" });
  } catch (err) {
    console.error("Error deleting instructor:", err);
    res.status(500).json({ message: "Failed to delete instructor" });
  }
};

// ✅ Get instructor's courses
const getInstructorCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        courses: {
          include: { enrollments: true, _count: { select: { enrollments: true } } },
        },
      },
    });

    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    res.json(
      instructor.courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        studentCount: c._count.enrollments,
      }))
    );
  } catch (err) {
    console.error("Error fetching instructor courses:", err);
    res.status(500).json({ message: "Failed to fetch instructor courses" });
  }
};

// ================= Exports =================
module.exports = {
  getPublicInstructors,
  getInstructors,
  getInstructor,
  addInstructor,
  updateInstructor,
  deleteInstructor,
  getInstructorCourses,
};
