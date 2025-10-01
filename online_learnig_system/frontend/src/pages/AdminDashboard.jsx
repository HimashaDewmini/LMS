// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, UserCheck, BookOpen, DollarSign } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/SidebarComponent";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper to compute growth %
  const computeGrowthPercent = () => {
    if (!monthlyRegistrations || monthlyRegistrations.length < 2) return 0;
    const last = monthlyRegistrations[monthlyRegistrations.length - 1].value;
    const prev = monthlyRegistrations[monthlyRegistrations.length - 2].value || 0;
    if (prev === 0) return last === 0 ? 0 : 100;
    return Math.round(((last - prev) / prev) * 100);
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // adjust if you store token elsewhere
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [statsRes, revRes, regRes, activitiesRes] = await Promise.all([
          axios.get(`${API}/api/dashboard/stats`, { headers }),
          axios.get(`${API}/api/dashboard/monthly-revenue`, { headers }),
          axios.get(`${API}/api/dashboard/monthly-registrations`, { headers }),
          axios.get(`${API}/api/dashboard/recent-activities`, { headers }),
        ]);
        setStats(statsRes.data);
        setMonthlyRevenue(revRes.data);
        setMonthlyRegistrations(regRes.data);
        setRecentActivities(activitiesRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // for bar chart heights
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-2 sm:p-4 lg:p-8">
          {loading && <div className="p-4">Loading dashboard...</div>}
          {error && <div className="p-4 text-red-600">Error: {error}</div>}

          {!loading && stats && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Users size={24} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserCheck size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Instructors</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign size={24} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${Number(stats.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8">
                {/* Monthly Revenue - simple bar chart */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
                      <div className="text-sm text-gray-600">Last 6 months</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${monthlyRevenue.length ? monthlyRevenue[monthlyRevenue.length - 1].value.toLocaleString() : 0}</div>
                      <div className="text-xs text-gray-500">This month</div>
                    </div>
                  </div>

                  <div className="flex items-end gap-3 h-40">
                    {monthlyRevenue.map((m) => {
                      const h = Math.round((m.value / maxRevenue) * 100);
                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center">
                          <div className="w-full rounded-t transition-all" style={{ height: `${h}%`, background: "linear-gradient(180deg,#ef4444, #fca5a5)" }} />
                          <div className="text-xs text-gray-500 mt-2">{m.month.split(" ")[0]}</div>
                          <div className="text-xs font-semibold text-gray-700">{m.value}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Student Growth */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Student Growth</h3>
                      <div className="text-sm text-gray-600">This month vs last month</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{computeGrowthPercent()}%</div>
                      <div className="text-xs text-gray-500">Change</div>
                    </div>
                  </div>

                  <div className="flex items-end gap-3 h-40">
                    {monthlyRegistrations.map((m, i) => {
                      const maxReg = Math.max(...monthlyRegistrations.map((x) => x.value), 1);
                      const height = Math.round((m.value / maxReg) * 100);
                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center">
                          <div className={`w-full rounded-t ${i === monthlyRegistrations.length - 1 ? "bg-green-500" : "bg-green-200"}`} style={{ height: `${height}%` }} />
                          <div className="text-xs text-gray-500 mt-2">{m.month.split(" ")[0]}</div>
                          <div className="text-xs font-semibold text-gray-700">{m.value}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentActivities.map((a, idx) => (
                    <div key={idx} className="p-4 sm:p-6 transition-all duration-200 hover:bg-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{a.activity}</h4>
                        </div>
                        <div className="lg:col-span-1">
                          <p className="text-sm text-gray-600">{a.details}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">{new Date(a.date).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
