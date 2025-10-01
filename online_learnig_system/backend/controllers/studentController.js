const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// ================= Nodemailer =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

// Verify email config at startup
transporter.verify((error) => {
  if (error) console.error("❌ Email configuration error:", error.message);
  else console.log("✅ Email server ready");
});

// ================= Helpers =================
const generateWelcomeEmailHTML = (name, email, password, loginUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome</title></head>
<body style="font-family: Arial, sans-serif;">
  <h2>Hello ${name},</h2>
  <p>Your student account has been created successfully.</p>
  <p><b>Email:</b> ${email}</p>
  <p><b>Password:</b> ${password}</p>
  <p><a href="${loginUrl}" style="padding:10px 20px;background:#ef4444;color:white;text-decoration:none;">Login</a></p>
  <p><b>Please change your password after first login.</b></p>
</body>
</html>
`;

// ================= Controllers =================

// ✅ Public: Get active students
const getPublicStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "student", status: "Active" },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        profileImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const data = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      contact: s.contact || "",
      profileImage: s.profileImage || null,
      createdAt: s.createdAt,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching public students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// ✅ Admin: Get all students
const getStudents = async (req, res) => {
  try {
    const { status, search } = req.query;
    let where = { role: "student" };

    if (status && status !== "All") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { contact: { contains: search, mode: "insensitive" } },
      ];
    }

    const students = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(
      students.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        status: s.status,
        contact: s.contact || "",
        profileImage: s.profileImage || null,
        createdAt: s.createdAt,
      }))
    );
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// ✅ Get single student
const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.role !== "student")
      return res.status(400).json({ message: "User is not a student" });

    res.json({
      id: student.id,
      name: student.name,
      email: student.email,
      status: student.status,
      contact: student.contact,
      profileImage: student.profileImage || null,
      createdAt: student.createdAt,
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

// ✅ Add new student
const addStudent = async (req, res) => {
  try {
    const { name, email, status = "Active", contact } = req.body;
    const file = req.file;

    if (!name || !email)
      return res.status(400).json({ message: "Name and Email are required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const randomPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const student = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        role: "student",
        status,
        contact: contact || null,
        password: hashedPassword,
        profileImage: file ? `/uploads/${file.filename}` : null,
      },
    });

    const loginUrl = `${process.env.FRONTEND_URL}/login` || "http://localhost:3000/login";

    try {
      await transporter.sendMail({
        from: `"Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "🎓 Welcome! Your Student Account is Ready",
        html: generateWelcomeEmailHTML(name, email, randomPassword, loginUrl),
      });
    } catch (emailErr) {
      console.error("❌ Email error:", emailErr);
    }

    res.status(201).json({
      message: "Student added successfully",
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        status: student.status,
      },
    });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Failed to add student" });
  }
};

// ✅ Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status, contact, password } = req.body;
    const file = req.file;

    let data = {
      name,
      email: email?.toLowerCase(),
      status,
      contact,
    };

    if (password) data.password = await bcrypt.hash(password, 12);
    if (file) data.profileImage = `/uploads/${file.filename}`;

    const student = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });

    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Failed to update student" });
  }
};

// ✅ Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!student) return res.status(404).json({ message: "Student not found" });

    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Failed to delete student" });
  }
};

// ================= Exports =================
module.exports = {
  getPublicStudents,
  getStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
};
