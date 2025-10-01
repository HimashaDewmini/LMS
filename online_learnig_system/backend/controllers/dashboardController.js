// controllers/dashboardController.js
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// helper: format YYYY-MM key from a Date
const monthKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

// helper: friendly month label (e.g. "Jul 2025")
const monthLabel = (d) => {
  const dt = new Date(d);
  return dt.toLocaleString("default", { month: "short", year: "numeric" });
};

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: "student" } });
    const totalInstructors = await prisma.user.count({ where: { role: "instructor" } });
    const totalCourses = await prisma.course.count();

    // Try to use payments table if present, otherwise fallback to course.price * enrolledCount
    let totalRevenue = 0;
    try {
      // If you have a 'payment' model
      const agg = await prisma.payment.aggregate({ _sum: { amount: true } });
      totalRevenue = agg._sum.amount || 0;
    } catch (err) {
      // fallback: sum course.price * enrolledCount (works with your course controller)
      const courses = await prisma.course.findMany({ select: { price: true, enrolledCount: true } });
      totalRevenue = courses.reduce((acc, c) => acc + (Number(c.price || 0) * Number(c.enrolledCount || 0)), 0);
    }

    res.json({ totalStudents, totalInstructors, totalCourses, totalRevenue });
  } catch (error) {
    console.error("Dashboard getStats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// GET /api/dashboard/monthly-revenue  -> returns last 6 months [{ month, value }]
const getMonthlyRevenue = async (req, res) => {
  try {
    // gather source items with { amount, createdAt }
    let items = [];
    try {
      // try payments first (if model exists)
      const payments = await prisma.payment.findMany({ select: { amount: true, createdAt: true } });
      items = payments.map((p) => ({ amount: Number(p.amount || 0), date: p.createdAt }));
    } catch (err) {
      // fallback: use course.createdAt * enrolledCount
      const courses = await prisma.course.findMany({ select: { price: true, enrolledCount: true, createdAt: true } });
      items = courses.map((c) => ({ amount: Number(c.price || 0) * Number(c.enrolledCount || 0), date: c.createdAt }));
    }

    // build last 6 months keys
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: monthKey(d), label: monthLabel(d), total: 0 });
    }

    // aggregate items into months
    items.forEach((it) => {
      const key = monthKey(it.date);
      const idx = months.findIndex((m) => m.key === key);
      if (idx >= 0) months[idx].total += it.amount;
    });

    const result = months.map((m) => ({ month: m.label, value: Math.round(m.total) }));
    res.json(result);
  } catch (error) {
    console.error("Dashboard getMonthlyRevenue error:", error);
    res.status(500).json({ message: "Failed to fetch monthly revenue" });
  }
};

// GET /api/dashboard/monthly-registrations  -> last 6 months student registrations [{ month, value }]
const getMonthlyRegistrations = async (req, res) => {
  try {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: monthKey(d), label: monthLabel(d), total: 0 });
    }

    const students = await prisma.user.findMany({
      where: { role: "student" },
      select: { createdAt: true },
    });

    students.forEach((s) => {
      const key = monthKey(s.createdAt);
      const idx = months.findIndex((m) => m.key === key);
      if (idx >= 0) months[idx].total += 1;
    });

    res.json(months.map((m) => ({ month: m.label, value: m.total })));
  } catch (error) {
    console.error("Dashboard getMonthlyRegistrations error:", error);
    res.status(500).json({ message: "Failed to fetch monthly registrations" });
  }
};

// GET /api/dashboard/recent-activities  -> merges recent students/courses/instructors
const getRecentActivities = async (req, res) => {
  try {
    const [students, courses, instructors] = await Promise.all([
      prisma.user.findMany({
        where: { role: "student" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, createdAt: true },
      }),
      prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { instructor: { select: { id: true, name: true } } },
      }),
      prisma.user.findMany({
        where: { role: "instructor" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, createdAt: true },
      }),
    ]);

    const activities = [];

    students.forEach((s) =>
      activities.push({
        type: "student",
        activity: "New Student Registration",
        details: `${s.name} registered`,
        date: s.createdAt,
      })
    );

    courses.forEach((c) =>
      activities.push({
        type: "course",
        activity: "New Course Published",
        details: `${c.title} — by ${c.instructor?.name || "Unknown"}`,
        date: c.createdAt,
      })
    );

    instructors.forEach((i) =>
      activities.push({
        type: "instructor",
        activity: "New Instructor",
        details: `${i.name} joined as instructor`,
        date: i.createdAt,
      })
    );

    // sort by date desc and return top 6-8
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(activities.slice(0, 8));
  } catch (error) {
    console.error("Dashboard getRecentActivities error:", error);
    res.status(500).json({ message: "Failed to fetch recent activities" });
  }
};

module.exports = {
  getStats,
  getMonthlyRevenue,
  getMonthlyRegistrations,
  getRecentActivities,
};
