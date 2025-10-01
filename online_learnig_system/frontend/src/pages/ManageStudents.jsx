import React, { useState, useEffect } from 'react'; 
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/SidebarComponent';

const ManageStudents = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    contact: '',
    status: 'Active',
    profileImage: null
  });

  const API_BASE = "http://localhost:5000";

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/students`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
      setStudents([]);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const filteredStudents = Array.isArray(students)
    ? students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Add/Edit student
  const handleSaveStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.contact) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", newStudent.name);
      formData.append("email", newStudent.email);
      formData.append("contact", newStudent.contact);
      formData.append("status", newStudent.status);
      if (newStudent.profileImage) formData.append("profileImage", newStudent.profileImage);

      const url = isEditing ? `${API_BASE}/api/students/${editId}` : `${API_BASE}/api/students`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Failed to save student");
      await loadStudents();

      setNewStudent({ name: '', email: '', contact: '', status: 'Active', profileImage: null });
      setIsEditing(false);
      setEditId(null);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleEditStudent = (student) => {
    setNewStudent({
      name: student.name,
      email: student.email,
      contact: student.contact,
      status: student.status,
      profileImage: null
    });
    setIsEditing(true);
    setEditId(student.id);
    setShowAddModal(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/api/students/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` },
      });
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Manage Students</h1>
              <button
                onClick={() => { setIsEditing(false); setNewStudent({ name:'', email:'', contact:'', status:'Active', profileImage:null }); setShowAddModal(true); }}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={20}/> Add New Student
              </button>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                        {student.profileImage ? (
                          <img src={`${API_BASE}${student.profileImage}`} alt="Profile" className="w-8 h-8 rounded-full object-cover"/>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-xs">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleViewStudent(student)} className="text-blue-600 hover:text-blue-900"><Eye size={16} /></button>
                          <button onClick={() => handleEditStudent(student)} className="text-yellow-600 hover:text-yellow-900"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteStudent(student.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{isEditing ? 'Edit Student' : 'Add Student'}</h2>
              <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Name" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              <input type="email" placeholder="Email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              <input type="text" placeholder="Contact" value={newStudent.contact} onChange={e => setNewStudent({...newStudent, contact: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              <select value={newStudent.status} onChange={e => setNewStudent({...newStudent, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input type="file" onChange={e => setNewStudent({...newStudent, profileImage: e.target.files[0]})} />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleSaveStudent} className="px-4 py-2 bg-red-600 text-white rounded-lg">{isEditing ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative p-6">
            <button onClick={() => setShowDetails(false)} className="absolute top-3 right-3"><X size={24} /></button>
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <div className="flex flex-col items-center gap-4 mb-4">
              {selectedStudent.profileImage ? (
                <img src={`${API_BASE}${selectedStudent.profileImage}`} alt="Profile" className="w-20 h-20 rounded-full object-cover"/>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-xl">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <p className="text-lg font-medium">{selectedStudent.name}</p>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Contact:</strong> {selectedStudent.contact}</p>
              <p><strong>Status:</strong> {selectedStudent.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
