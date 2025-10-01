// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, X, Check } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", avatar: null });
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setFormData({ name: res.data.user.name, email: res.data.user.email, avatar: null });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    setSaving(true);

    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("email", formData.email);
      if (formData.avatar) updateData.append("avatar", formData.avatar);

      const res = await axios.put("http://localhost:5000/api/me/update", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300">
            <img
              src={formData.avatar ? URL.createObjectURL(formData.avatar) : user.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input type="file" onChange={handleFileChange} className="text-sm text-gray-500" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 capitalize">{user.role}</p>
                <p className="text-gray-600">{user.email}</p>
              </>
            )}
          </div>

          {/* Edit / Save Buttons */}
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <Check size={16} />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({ name: user.name, email: user.email, avatar: null });
                  }}
                  className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  <X size={16} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                <Edit size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Courses Section */}
        {user.role.toLowerCase() === "student" ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">Enrolled Courses</h3>
            {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={course.image || "/default-course.png"}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <h4 className="font-medium text-gray-800">{course.title}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You are not enrolled in any courses yet.</p>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">My Works / Created Courses</h3>
            {user.createdCourses && user.createdCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.createdCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={course.image || "/default-course.png"}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <h4 className="font-medium text-gray-800">{course.title}</h4>
                    <p className="text-gray-500 text-sm">{course.studentsEnrolled || 0} students</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't created any courses yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
