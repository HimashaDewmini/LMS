const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// ---------------------
// Get all categories
// ---------------------
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// ---------------------
// Add new category (Admin only)
// ---------------------
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const existing = await prisma.category.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await prisma.category.create({
      data: { name, description: description || null },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// ---------------------
// Update category (Admin only)
// ---------------------
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description: description || null },
    });

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(500).json({ error: "Failed to update category" });
  }
};

// ---------------------
// Delete category (Admin only)
// ---------------------
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const coursesUsingCategory = await prisma.course.count({
      where: { categoryId: parseInt(id) },
    });

    if (coursesUsingCategory > 0) {
      return res.status(400).json({
        error: `Cannot delete category. ${coursesUsingCategory} course(s) are using this category.`,
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(500).json({ error: "Failed to delete category" });
  }
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };
