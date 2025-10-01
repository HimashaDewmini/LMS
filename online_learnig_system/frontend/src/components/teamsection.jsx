import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function TeamSection() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 4;

  // Fetch instructors from API
  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:5000/api/instructors/public', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched instructors:', data);
      
      // Handle empty data
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      // Sort by creation date (newest first) and filter only active instructors
      const activeInstructors = data
        .filter(instructor => instructor.status === 'Active')
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      
      setInstructors(activeInstructors);
      console.log('Active instructors loaded:', activeInstructors.length);
      
    } catch (err) {
      console.error('Error fetching instructors:', err);
      
      // More specific error messages
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else if (err.message.includes('fetch')) {
        setError('Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
      } else if (err.message.includes('Server error: 401')) {
        setError('Authentication required. Please log in and try again.');
      } else if (err.message.includes('Server error: 404')) {
        setError('Instructors endpoint not found. Please check your API routes.');
      } else if (err.message.includes('Server error: 500')) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(`Failed to load instructors: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Get instructors for current view
  const getDisplayedInstructors = () => {
    if (!showAll) {
      // Show only first 4 recent instructors for home section
      return instructors.slice(0, 4);
    } else {
      // Show paginated instructors for "View All" mode
      const startIndex = (currentPage - 1) * instructorsPerPage;
      const endIndex = startIndex + instructorsPerPage;
      return instructors.slice(startIndex, endIndex);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(instructors.length / instructorsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle view all mode
  const handleViewAllToggle = () => {
    setShowAll(!showAll);
    setCurrentPage(1); // Reset to first page when toggling
  };

  // Generate background colors for variety
  const backgroundColors = [
    "bg-pink-200",
    "bg-pink-100", 
    "bg-yellow-100",
    "bg-orange-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-indigo-100"
  ];

  const displayedInstructors = getDisplayedInstructors();

  if (loading) {
    return (
      <section className="w-full min-h-screen bg-[#011813] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-outfit text-lg">Loading instructors...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full min-h-screen bg-[#011813] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-outfit text-xl font-semibold mb-3">Connection Error</h3>
            <p className="text-gray-300 font-outfit text-sm mb-6 leading-relaxed">{error}</p>
            
            <div className="space-y-3">
              <button 
                onClick={fetchInstructors}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-outfit font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
              
              <div className="text-xs text-gray-400 font-outfit space-y-1">
                <p><strong>Troubleshooting:</strong></p>
                <ul className="text-left space-y-1">
                  <li>• Check if your backend server is running</li>
                  <li>• Verify the API endpoint is accessible</li>
                  <li>• Check your network connection</li>
                  <li>• Try refreshing the page</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full min-h-screen bg-[#011813] flex flex-col items-center justify-center py-8 md:py-12 lg:py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row w-full max-w-[95vw] xl:max-w-6xl justify-between items-start md:items-center mb-8 md:mb-12 px-2 sm:px-4 md:px-6 lg:px-8 gap-4 md:gap-0">
          <h2 className="text-white font-outfit font-semibold text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight">
            Learn from the Best Talent
            <br />
            in the Industry
          </h2>
          <button
            onClick={handleViewAllToggle}
            className="flex items-center bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 text-[#011813] font-outfit font-medium text-base shadow hover:scale-105 transition"
          >
            {showAll ? 'Back to Home' : 'View All Mentors'}
            <span className="ml-3 flex items-center justify-center w-11 h-11 bg-[#011813] rounded-full">
              {showAll ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <ArrowUpRight className="w-5 h-5 text-white" />
              )}
            </span>
          </button>
        </div>

        {/* Instructor Count Info */}
        {showAll && (
          <div className="w-full max-w-[95vw] xl:max-w-6xl px-2 sm:px-4 md:px-6 lg:px-8 mb-6">
            <p className="text-gray-300 font-outfit text-center">
              Showing {displayedInstructors.length} of {instructors.length} instructors
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
        )}

        {/* Instructor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-[95vw] xl:max-w-6xl justify-center px-2 sm:px-4 md:px-6 lg:px-8">
          {displayedInstructors.map((instructor, index) => (
            <div
              key={instructor.id}
              className={`flex flex-col items-center justify-start ${
                backgroundColors[index % backgroundColors.length]
              } rounded-[1000px] w-full max-w-xs h-[400px] sm:h-[420px] md:h-[460px] lg:h-[500px] pt-10 sm:pt-12 md:pt-14 shadow-lg mx-auto hover:scale-105 transition-transform duration-300`}
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-4 sm:mb-6 flex items-center justify-center bg-white shadow-inner">
                {instructor.profileImage ? (
                  <img
                    src={`http://localhost:5000${instructor.profileImage}`}
                    alt={instructor.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Fallback initials */}
                <div 
                  className={`w-full h-full bg-gradient-to-br from-[#011813] to-gray-600 rounded-full flex items-center justify-center ${
                    instructor.profileImage ? 'hidden' : 'flex'
                  }`}
                >
                  <span className="text-white font-outfit font-bold text-2xl md:text-3xl">
                    {instructor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="text-center mt-2 px-4">
                <h5 className="font-outfit font-semibold text-lg sm:text-xl text-[#011813] mb-1 line-clamp-2">
                  {instructor.name}
                </h5>
                <p className="font-outfit font-normal text-base text-[#4E5255] mb-2">
                  Instructor
                </p>
                
                {/* Additional Info */}
                <div className="space-y-1 text-sm text-[#4E5255]">
                  {instructor.totalCourses > 0 && (
                    <p className="font-outfit">
                      {instructor.totalCourses} Course{instructor.totalCourses > 1 ? 's' : ''}
                    </p>
                  )}
                  {instructor.rating > 0 && (
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="font-outfit font-medium">{instructor.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No instructors message */}
        {displayedInstructors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 font-outfit text-lg">
              No active instructors found.
            </p>
          </div>
        )}

        {/* Pagination (only show in "View All" mode) */}
        {showAll && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 md:mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-full transition-all duration-200 ${
                currentPage === 1
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl'
              }`}
            >
              <ChevronLeft 
                className={`w-5 h-5 ${
                  currentPage === 1 ? 'text-gray-400' : 'text-[#011813]'
                }`} 
              />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2 mx-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show all pages if total is <= 7, otherwise show smart pagination
                const shouldShow = totalPages <= 7 || 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                if (!shouldShow) {
                  // Show ellipsis
                  if ((page === 2 && currentPage > 4) || (page === totalPages - 1 && currentPage < totalPages - 3)) {
                    return <span key={page} className="text-gray-400 px-2">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 rounded-full font-outfit font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-white text-[#011813] shadow-lg scale-110'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full transition-all duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl'
              }`}
            >
              <ChevronRight 
                className={`w-5 h-5 ${
                  currentPage === totalPages ? 'text-gray-400' : 'text-[#011813]'
                }`} 
              />
            </button>
          </div>
        )}

        {/* Stats Section (only in "View All" mode) */}
        {showAll && instructors.length > 0 && (
          <div className="w-full max-w-[95vw] xl:max-w-6xl px-2 sm:px-4 md:px-6 lg:px-8 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <h3 className="text-4xl font-outfit font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {instructors.length}
                </h3>
                <p className="text-gray-300 font-outfit font-medium">Expert Instructors</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <h3 className="text-4xl font-outfit font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {instructors.reduce((total, inst) => total + (inst.totalCourses || 0), 0)}
                </h3>
                <p className="text-gray-300 font-outfit font-medium">Total Courses</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <h3 className="text-4xl font-outfit font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {instructors.filter(inst => inst.rating >= 4).length}
                </h3>
                <p className="text-gray-300 font-outfit font-medium">Top Rated (4+ Stars)</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions (only in "View All" mode) */}
        {showAll && (
          <div className="w-full max-w-[95vw] xl:max-w-6xl px-2 sm:px-4 md:px-6 lg:px-8 mt-8">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handlePageChange(1)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-outfit transition-all backdrop-blur-sm border border-white/20"
              >
                Go to First Page
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-outfit transition-all backdrop-blur-sm border border-white/20"
              >
                Go to Last Page
              </button>
              <button
                onClick={fetchInstructors}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-outfit transition-all backdrop-blur-sm border border-white/20"
              >
                Refresh Data
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}