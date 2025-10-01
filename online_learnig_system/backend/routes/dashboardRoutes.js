// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const {
  getStats,
  getMonthlyRevenue,
  getMonthlyRegistrations,
  getRecentActivities,
} = require("../controllers/dashboardController");

const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");

// Protect dashboard endpoints (match pattern in your other routes)
router.get("/stats", authenticateToken, requireAdmin, getStats);
router.get("/monthly-revenue", authenticateToken, requireAdmin, getMonthlyRevenue);
router.get("/monthly-registrations", authenticateToken, requireAdmin, getMonthlyRegistrations);
router.get("/recent-activities", authenticateToken, requireAdmin, getRecentActivities);

module.exports = router;
