import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/SidebarComponent";

const categories = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Mathematics" },
  { id: 3, name: "Arts & Humanities" },
  { id: 4, name: "Business" },
  { id: 5, name: "Languages" },
  { id: 6, name: "Data Science" },
  { id: 7, name: "Design" },
  { id: 8, name: "Engineering" },
  { id: 9, name: "Health & Medicine" },
  { id: 10, name: "Personal Development" },
];

export default function AdminCourse() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    instructorId: "",
    categoryId: "",
    description: "",
    price: "",
    enrolledCount: "",
    status: "ACTIVE",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  };

  const token = getToken();

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      console.log("Courses fetched:", res.data);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching courses:", err.response?.data || err.message);
      setCourses([]);
      showTempMessage("Failed to fetch courses", "error");
    }
  };

  // Fetch instructors for dropdown
  const fetchInstructors = async () => {
    try {
      const res = await api.get("/instructors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstructors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching instructors:", err.response?.data || err.message);
      setInstructors([]);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({
      title: "",
      instructorId: "",
      categoryId: "",
      description: "",
      price: "",
      enrolledCount: "",
      status: "ACTIVE",
    });
    setThumbnailFile(null);
    setContentFile(null);
    setMessage({ text: "", type: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        showTempMessage(
          "Please upload a valid image file (JPEG, PNG, GIF, WebP)",
          "error"
        );
        return;
      }
      setThumbnailFile(file);
    }
  };

  const handleContentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "application/zip", "video/mp4", "video/avi", "video/mov"];
      if (!allowedTypes.some((type) => file.type.includes(type.split("/")[1]))) {
        showTempMessage(
          "Please upload a valid content file (PDF, ZIP, MP4, AVI, MOV)",
          "error"
        );
        return;
      }
      setContentFile(file);
    }
  };

  const showTempMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.instructorId || !form.categoryId || !form.price || !form.description) {
      return showTempMessage("Please fill all required fields.", "error");
    }

    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      return showTempMessage("Please enter a valid price greater than 0.", "error");
    }

    if (isNaN(parseInt(form.instructorId)) || parseInt(form.instructorId) <= 0) {
      return showTempMessage("Please select a valid instructor.", "error");
    }

    if (isNaN(parseInt(form.categoryId)) || parseInt(form.categoryId) <= 0) {
      return showTempMessage("Please select a valid category.", "error");
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("price", parseFloat(form.price));
    formData.append("categoryId", parseInt(form.categoryId));
    formData.append("status", form.status);
    formData.append("instructorId", parseInt(form.instructorId));
    formData.append("enrolledCount", form.enrolledCount ? parseInt(form.enrolledCount) : 0);

    if (thumbnailFile) formData.append("thumbnailUrl", thumbnailFile);
    if (contentFile) formData.append("contentUrl", contentFile);

    try {
      setLoading(true);

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await api.post("/courses", formData, config);
      console.log("Course creation response:", response.data);

      setLoading(false);
      fetchCourses();
      handleCloseModal();
      showTempMessage("Course added successfully!", "success");
    } catch (err) {
      setLoading(false);
      console.error("Error submitting course:", err.response?.data || err.message);
      showTempMessage(err.response?.data?.error || "Failed to add course.", "error");
    }
  };

  // Delete feature
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const config = {};
      if (token) config.headers = { Authorization: `Bearer ${token}` };

      await api.delete(`/courses/${courseId}`, config);
      showTempMessage("Course deleted successfully!", "success");
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err.response?.data || err.message);
      showTempMessage("Failed to delete course.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-2 sm:p-4 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <button
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-md shadow transition"
              onClick={() => setShowModal(true)}
            >
              <span className="text-xl">+</span> Add New Course
            </button>
          </div>

          {message.text && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                message.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Courses Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">All Courses</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-500 font-semibold border-b">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Instructor</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Enrolled</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-500">{c.id}</td>
                        <td className="py-3 px-4 font-medium">{c.title}</td>
                        <td className="py-3 px-4 text-gray-500">{c.instructor?.name || "Unknown"}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {c.category?.name || categories.find((cat) => cat.id === c.categoryId)?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-500">${c.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            c.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            c.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            c.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{c.enrolledCount || 0}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-gray-500">
                        No courses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition"
                onClick={handleCloseModal}
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              {message.text && message.type === "error" && (
                <p className="text-red-600 font-medium mb-4">{message.text}</p>
              )}
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Title */}
                <div>
                  <label className="block mb-1 font-medium">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                {/* Instructor Dropdown */}
                <div>
                  <label className="block mb-1 font-medium">Instructor *</label>
                  <select
                    name="instructorId"
                    value={form.instructorId}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block mb-1 font-medium">Category *</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block mb-1 font-medium">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                {/* Enrolled Count */}
                <div>
                  <label className="block mb-1 font-medium">Enrolled Count</label>
                  <input
                    type="number"
                    name="enrolledCount"
                    value={form.enrolledCount}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                {/* Description */}
                <div className="col-span-1 lg:col-span-2">
                  <label className="block mb-1 font-medium">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full h-24"
                  />
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block mb-1 font-medium">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block mb-1 font-medium">Content</label>
                  <input
                    type="file"
                    accept=".pdf,.zip,video/*"
                    onChange={handleContentUpload}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8 col-span-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
