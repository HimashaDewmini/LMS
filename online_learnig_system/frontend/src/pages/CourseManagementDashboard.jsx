// CourseManagementDashboard.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import AddCourseModal from "../components/AddCourseModal"; 
import Sidebar from "../components/SidebarComponent";
import AdminHeader from '../components/AdminHeader';

const CourseManagementDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const token = localStorage.getItem("token") || "";

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching courses:", err.response?.data || err.message);
      setCourses([]);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  return (
    <>
      <AdminHeader />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Manage Courses</h1>
            <button 
              onClick={() => setOpenModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add New Course</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map(c => (
                    <tr key={c.id}>
                      <td className="px-6 py-4">{c.id}</td>
                      <td className="px-6 py-4">{c.title}</td>
                      <td className="px-6 py-4">${c.price}</td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-gray-500">No courses found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {openModal && <AddCourseModal onClose={() => { setOpenModal(false); fetchCourses(); }} />}
      </div>
    </>
  );
};

export default CourseManagementDashboard;
