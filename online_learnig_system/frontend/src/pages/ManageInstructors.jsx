
import React, { useState, useEffect } from 'react';  
import {
  Plus,
  Eye,
  Star,
  Search,
  Filter,
  X,
  Edit,
  Trash,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/SidebarComponent';
import axios from 'axios';

const ManageInstructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // success, error, info
  const [isLoading, setIsLoading] = useState(false);

  const [newInstructor, setNewInstructor] = useState({
    name: '',
    email: '',
    rating: '',
    status: 'Active',
    contact: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch all instructors
  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/instructors', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm, status: filterStatus }
      });
      setInstructors(res.data);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      showToast('Failed to fetch instructors', 'error');
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [searchTerm, filterStatus]);

  // Enhanced Toast handler
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000); // Toast disappears after 4s for better readability
  };

  // Add / Update Instructor with enhanced error handling
  const handleSaveInstructor = async () => {
    if (!newInstructor.name.trim() || !newInstructor.email.trim()) {
      showToast('Name and Email are required', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newInstructor.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', newInstructor.name);
      formData.append('email', newInstructor.email);
      formData.append('rating', newInstructor.rating || 0);
      formData.append('status', newInstructor.status);
      formData.append('contact', newInstructor.contact || '');
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/instructors/${editId}`,
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showToast('Instructor updated successfully', 'success');
      } else {
        // Show email sending notification
        showToast('Creating instructor and sending login credentials...', 'info');
        
        const response = await axios.post(
          'http://localhost:5000/api/instructors',
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        // Enhanced success message for new instructor
        showToast(
          `✅ Instructor added successfully! Login credentials sent to ${newInstructor.email}`, 
          'success'
        );
      }

      // Reset form
      resetForm();
      
      // Refresh instructor list
      await fetchInstructors();

      // Close modal after short delay
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      console.error('Error saving instructor:', err);
      
      if (err.response?.data?.message) {
        showToast(err.response.data.message, 'error');
      } else if (err.response?.status === 400) {
        showToast('Email already exists or invalid data provided', 'error');
      } else {
        showToast(isEditing ? 'Failed to update instructor' : 'Failed to create instructor', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setNewInstructor({ 
      name: '', 
      email: '', 
      rating: '', 
      status: 'Active',
      contact: '' 
    });
    setProfileImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
  };

  // Edit Instructor
  const handleEdit = (instructor) => {
    setNewInstructor({
      name: instructor.name,
      email: instructor.email,
      rating: instructor.rating,
      status: instructor.status,
      contact: instructor.contact || ''
    });
    
    // Set image preview if exists
    if (instructor.profileImage) {
      setImagePreview(`http://localhost:5000${instructor.profileImage}`);
    }
    
    setIsEditing(true);
    setEditId(instructor.id);
    setShowModal(true);
  };

  // Delete Instructor with confirmation
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete instructor "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/instructors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Instructor deleted successfully', 'success');
      await fetchInstructors();
    } catch (err) {
      console.error('Error deleting instructor:', err);
      showToast('Failed to delete instructor', 'error');
    }
  };

  // View Instructor
  const handleView = async (instructor) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/instructors/${instructor.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedInstructor(response.data);
      setShowDetails(true);
    } catch (err) {
      console.error('Error fetching instructor details:', err);
      showToast('Failed to fetch instructor details', 'error');
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }
      
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Filtering + Search
  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inst.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inst.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Toast icon based on type
  const getToastIcon = () => {
    switch (toastType) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <AlertCircle size={20} />;
      case 'info': return <Clock size={20} />;
      default: return <CheckCircle size={20} />;
    }
  };

  // Toast color based on type
  const getToastColor = () => {
    switch (toastType) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Manage Instructors</h1>
            <button
              onClick={() => { 
                resetForm();
                setShowModal(true); 
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} /> Add New Instructor
            </button>
          </div>

          {/* Email Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Mail className="text-blue-500 mt-0.5" size={20} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Automatic Email Notifications</p>
              <p>When you create a new instructor, login credentials with an auto-generated password will be automatically sent to their email address. They can access the instructor dashboard to manage their assigned courses only.</p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search instructors by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <div className="relative">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
              </div>
            </div>
          </div>

          {/* Instructors Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 min-w-[900px]">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 uppercase tracking-wide">
                <div className="col-span-1">ID</div>
                <div className="col-span-3">NAME</div>
                <div className="col-span-3">EMAIL</div>
                <div className="col-span-1">COURSES</div>
                <div className="col-span-1">RATING</div>
                <div className="col-span-1">STATUS</div>
                <div className="col-span-2">ACTIONS</div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 min-w-[900px]">
              {filteredInstructors.map(inst => (
                <div key={inst.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-sm font-medium text-gray-900">{inst.id}</div>
                    <div className="col-span-3 flex items-center gap-3">
                      {inst.profileImage ? (
                        <img 
                          src={`http://localhost:5000${inst.profileImage}`} 
                          alt="profile" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-200">
                          <span className="text-red-600 font-semibold text-sm">
                            {inst.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{inst.name}</p>
                        {inst.contact && (
                          <p className="text-xs text-gray-500">{inst.contact}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 text-sm text-gray-600">{inst.email}</div>
                    <div className="col-span-1 text-sm font-medium text-gray-900">{inst.totalCourses || 0}</div>
                    <div className="col-span-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{inst.rating || 0}</span>
                    </div>
                    <div className="col-span-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inst.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {inst.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <button 
                        onClick={() => handleView(inst)} 
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <Eye size={16} className="text-blue-500 group-hover:text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleEdit(inst)} 
                        className="p-2 hover:bg-yellow-50 rounded-lg transition-colors group"
                        title="Edit Instructor"
                      >
                        <Edit size={16} className="text-yellow-500 group-hover:text-yellow-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(inst.id, inst.name)} 
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete Instructor"
                      >
                        <Trash size={16} className="text-red-500 group-hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredInstructors.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={48} className="text-gray-300" />
                    <p className="text-lg font-medium">No instructors found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 ${getToastColor()} text-white px-6 py-4 rounded-lg shadow-lg transition-all duration-300 max-w-md flex items-center gap-3 z-50`}>
          {getToastIcon()}
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-1"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 pr-8">
              {isEditing ? 'Edit Instructor' : 'Add New Instructor'}
            </h2>
            
            {!isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Mail className="text-blue-500 mt-0.5" size={16} />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Email will be sent automatically</p>
                  <p>Login credentials with auto-generated password will be sent to the instructor's email.</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  placeholder="Enter instructor name"
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={newInstructor.name}
                  onChange={e => setNewInstructor({ ...newInstructor, name: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={newInstructor.email}
                  onChange={e => setNewInstructor({ ...newInstructor, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="text"
                  placeholder="Enter contact number"
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={newInstructor.contact}
                  onChange={e => setNewInstructor({ ...newInstructor, contact: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="Enter rating (0-5)"
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={newInstructor.rating}
                  onChange={e => setNewInstructor({ ...newInstructor, rating: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={newInstructor.status}
                  onChange={e => setNewInstructor({ ...newInstructor, status: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supported: JPG, PNG, GIF</p>
              </div>

              {imagePreview && (
                <div className="flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="preview" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" 
                  />
                </div>
              )}

              <button
                onClick={handleSaveInstructor}
                disabled={isLoading}
                className={`${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white px-4 py-3 rounded-lg mt-4 flex items-center justify-center gap-2 transition-colors font-medium`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? 'Updating...' : 'Creating & Sending Email...'}
                  </>
                ) : (
                  <>
                    {isEditing ? 'Update Instructor' : (
                      <>
                        <Mail size={16} />
                        Add Instructor & Send Email
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetails && selectedInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button 
              onClick={() => setShowDetails(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-1"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 pr-8">Instructor Details</h2>
            
            <div className="space-y-4">
              {selectedInstructor.profileImage && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={`http://localhost:5000${selectedInstructor.profileImage}`} 
                    alt="profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" 
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p className="text-sm text-gray-900">{selectedInstructor.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedInstructor.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedInstructor.status}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm text-gray-900">{selectedInstructor.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{selectedInstructor.email}</p>
              </div>
              
              {selectedInstructor.contact && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="text-sm text-gray-900">{selectedInstructor.contact}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Courses</p>
                  <p className="text-sm text-gray-900">{selectedInstructor.totalCourses || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-900">{selectedInstructor.rating || 0}</span>
                  </div>
                </div>
              </div>

              {selectedInstructor.courses && selectedInstructor.courses.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Assigned Courses</p>
                  <div className="space-y-1">
                    {selectedInstructor.courses.map(course => (
                      <div key={course.id} className="text-sm bg-gray-50 px-2 py-1 rounded">
                        {course.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInstructors;