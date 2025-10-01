import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin'); // 🔹 default name
  const navigate = useNavigate();

  // 🔹 Load admin name from localStorage on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.name) {
      setAdminName(userData.name);
    }
  }, []);

  // 🔹 Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-nowrap gap-2">
        {/* Left Section: Logo + Dashboard Title */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          {/* Hamburger Menu for Mobile */}
          <button
            className="mr-2 p-2 rounded-lg hover:bg-gray-100 transition-colors show-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3 7V17H5V9L12 4.5L19 9V17H21V7L12 2Z"/>
                <path d="M7 19V11H9V19H7Z"/>
                <path d="M11 19V11H13V19H11Z"/>
                <path d="M15 19V11H17V19H15Z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900 truncate">EduPlatform</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0">
          {/* Notifications */}
          <div className="relative flex-shrink-0">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
            </button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block truncate">{adminName}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-2 bg-white border-t border-gray-200 p-4 rounded-lg shadow-md show-hamburger">
          {/* Mobile Search */}
          <div className="mb-4 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium cursor-pointer">
              Dashboard
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              Students
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              Instructors
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              Courses
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              Revenue
            </div>
            {/* Mobile Logout */}
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg cursor-pointer"
            >
              <LogOut size={16} /> Logout
            </div>
          </nav>
        </div>
      )}

      {/* Custom CSS for 850px breakpoint */}
      <style>
        {`
          @media (max-width: 850px) {
            .show-hamburger {
              display: block !important;
            }
          }
          @media (min-width: 851px) {
            .show-hamburger {
              display: none !important;
            }
          }
        `}
      </style>
    </header>
  );
};

export default AdminHeader;
