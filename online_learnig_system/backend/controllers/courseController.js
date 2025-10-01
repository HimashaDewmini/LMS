const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// Remove old file helper
const removeFile = (filePath) => {
  try {
    if (filePath) {
      const absPath = path.join(process.cwd(), filePath.replace(/^\//, ""));
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    }
  } catch (err) {
    console.error("Error removing file:", err);
  }
};

// Add new course
const addCourse = async (req, res) => {
  try {
    const { title, description, price, categoryId, status, instructorId, enrolledCount } = req.body;

    console.log("Received course data:", { title, description, price, categoryId, status, instructorId, enrolledCount });

    // Validate required fields
    if (!title || !description || !price || !instructorId) {
      return res.status(400).json({ error: "Missing required fields: title, description, price, instructorId" });
    }

    // Check instructor exists
    const instructor = await prisma.user.findUnique({ where: { id: parseInt(instructorId) } });
    if (!instructor) {
      return res.status(400).json({ error: "Instructor not found" });
    }

    // Check category exists (only if categoryId is provided)
    let category = null;
    if (categoryId && categoryId !== "" && categoryId !== "null") {
      try {
        category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
        if (!category) {
          console.log(`Category with ID ${categoryId} not found. Creating course without category.`);
        }
      } catch (err) {
        console.error("Error checking category:", err);
        // Continue without category
      }
    }

    const thumbnailFile = req.files?.thumbnailUrl?.[0];
    const contentFile = req.files?.contentUrl?.[0];

    const courseData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      categoryId: category ? category.id : null,
      status: status || "ACTIVE",
      instructorId: parseInt(instructorId),
      enrolledCount: enrolledCount ? parseInt(enrolledCount) : 0,
      thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
      contentUrl: contentFile
        ? contentFile.mimetype.startsWith("video")
          ? `/uploads/videos/${contentFile.filename}`
          : `/uploads/documents/${contentFile.filename}`
        : null,
    };

    console.log("Creating course with data:", courseData);

    const newCourse = await prisma.course.create({
      data: courseData,
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    });

    console.log("Course created successfully:", newCourse);

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "A course with this title already exists" });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: "Invalid instructor ID or category ID" });
    }
    
    res.status(500).json({ error: error.message || "Failed to create course" });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { 
        instructor: {
          select: { id: true, name: true, email: true }
        }, 
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, categoryId, status, instructorId, enrolledCount } = req.body;

    const oldCourse = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!oldCourse) return res.status(404).json({ error: "Course not found" });

    // Validate foreign keys
    const instructor = await prisma.user.findUnique({ where: { id: parseInt(instructorId) } });
    if (!instructor) return res.status(400).json({ error: "Instructor not found" });

    let category = null;
    if (categoryId && categoryId !== "" && categoryId !== "null") {
      category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
      if (!category) {
        console.log(`Category with ID ${categoryId} not found. Updating course without category.`);
      }
    }

    let thumbnailUrl = oldCourse.thumbnailUrl;
    let contentUrl = oldCourse.contentUrl;

    const thumbnailFile = req.files?.thumbnailUrl?.[0];
    const contentFile = req.files?.contentUrl?.[0];

    if (thumbnailFile) {
      if (thumbnailUrl) removeFile(thumbnailUrl);
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFile.filename}`;
    }

    if (contentFile) {
      if (contentUrl) removeFile(contentUrl);
      contentUrl = contentFile.mimetype.startsWith("video")
        ? `/uploads/videos/${contentFile.filename}`
        : `/uploads/documents/${contentFile.filename}`;
    }

    const updated = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        categoryId: category ? category.id : null,
        status: status || "ACTIVE",
        instructorId: parseInt(instructorId),
        enrolledCount: enrolledCount ? parseInt(enrolledCount) : oldCourse.enrolledCount,
        thumbnailUrl,
        contentUrl,
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.thumbnailUrl) removeFile(course.thumbnailUrl);
    if (course.contentUrl) removeFile(course.contentUrl);

    await prisma.course.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get single course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseId = parseInt(id);
    if (isNaN(courseId)) return res.status(400).json({ error: "Invalid course ID" });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } }
      }
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

module.exports = { addCourse, getCourses, updateCourse, deleteCourse,getCourseById };