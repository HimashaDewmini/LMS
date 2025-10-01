import React from "react"; 
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { Users, BookOpen, DollarSign, BarChart3 } from "lucide-react";

// ✅ Import pages
import AdminDashboard from "../pages/AdminDashboard";
import ManageStudents from "../pages/ManageStudents";
import ManageInstructors from "../pages/ManageInstructors"; // ✅ Corrected import
import CourseManagementDashboard from "../pages/CourseManagementDashboard";

// ✅ Temporary placeholder for Revenue
const RevenuePage = () => (
  <h2 className="text-xl font-bold">Revenue Page (Coming Soon)</h2>
);

const SidebarComponent = () => {
  const linkClasses =
    "flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer";
  const activeClasses = "text-red-600 bg-red-50";
  const inactiveClasses = "text-gray-600 hover:bg-gray-50";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <nav className="space-y-1">
            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/students"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <Users size={20} />
              <span>Students</span>
            </NavLink>

            <NavLink
              to="/admin/instructors"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <Users size={20} />
              <span>Instructors</span>
            </NavLink>

            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </NavLink>

            <NavLink
              to="/admin/revenue"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <DollarSign size={20} />
              <span>Revenue</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* ✅ Main Content Area */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/courses" element={<CourseManagementDashboard />} />
          <Route path="/admin/instructors" element={<ManageInstructors />} /> {/* ✅ Works now */}
          <Route path="/admin/revenue" element={<RevenuePage />} />

          {/* Default redirect /admin → /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default SidebarComponent;
