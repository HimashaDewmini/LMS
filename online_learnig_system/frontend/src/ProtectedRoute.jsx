import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 1️⃣ Not logged in -> redirect to /signin
  if (!currentUser) return <Navigate to="/signin" replace />;

  // 2️⃣ Role-based protection with instructor access to admin courses
  if (role) {
    // If requiring admin role
    if (role === "admin") {
      // Allow both admin and instructor access to admin routes
      if (currentUser.role !== "admin" && currentUser.role !== "instructor") {
        return <Navigate to="/" replace />;
      }
    }
    // If requiring specific role that's not admin
    else if (currentUser.role !== role) {
      // Redirect admin users trying to access user pages to /admin/dashboard
      if (currentUser.role === "admin") return <Navigate to="/admin/dashboard" replace />;
      // Redirect instructors trying to access user pages to admin courses
      if (currentUser.role === "instructor") return <Navigate to="/admin/courses" replace />;
      // Redirect normal users trying to access admin pages to home
      return <Navigate to="/" replace />;
    }
  }

  // 3️⃣ If logged in and role matches (or no role specified), render children
  return children;
}