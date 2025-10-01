const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");
const { getCategories, addCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", authenticateToken, requireAdmin, addCategory);
router.put("/:id", authenticateToken, requireAdmin, updateCategory);
router.delete("/:id", authenticateToken, requireAdmin, deleteCategory);

module.exports = router;
