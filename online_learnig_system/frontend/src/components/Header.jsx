import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  // Load user name from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.name) {
      setUserName(userData.name);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const navLinkClass =
    "text-gray-800 hover:text-emerald-600 transition-colors duration-200 font-semibold px-3 md:px-4 text-base md:text-lg whitespace-nowrap";
  const activeClass =
    "text-emerald-700 font-bold px-3 md:px-4 text-base md:text-lg whitespace-nowrap";

  return (
    <header className="w-full bg-gradient-to-r from-[#7de0e6] via-[#f0f8ff] to-[#f4a6cd] shadow-xl">
      <div className="w-full flex items-center justify-between flex-nowrap px-4 sm:px-8 md:px-12 lg:px-20 py-4">
        {/* Logo + Brand pinned left */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-7 h-7 text-white"
              fill="currentColor"
            >
              <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
            </svg>
          </div>
          <span className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-emerald-700 transition-colors duration-300 cursor-pointer whitespace-nowrap">
            OnlineSchool
          </span>
        </div>

        {/* Desktop Nav centered */}
        <nav className="hidden lg:flex flex-1 justify-center gap-6 md:gap-8 lg:gap-10">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : navLinkClass)}>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? activeClass : navLinkClass)}>
            Courses
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : navLinkClass)}>
            About&nbsp;Us
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? activeClass : navLinkClass)}>
            Contact
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? activeClass : navLinkClass)}>
            Profile
          </NavLink>

          {/* Logout link right after Profile */}
          <button
            onClick={handleLogout}
            className="text-gray-800 hover:text-red-600 transition-colors duration-200 font-semibold px-3 md:px-4 text-base md:text-lg whitespace-nowrap flex items-center gap-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>

        {/* CTA Button pinned far-right */}
        <div className="hidden lg:flex flex-shrink-0">
          <NavLink
            to="/enroll"
            className="flex items-center border-2 border-gray-800 rounded-full px-6 md:px-8 py-2.5 md:py-3 text-gray-900 font-bold text-base md:text-lg hover:shadow-2xl hover:scale-105 hover:border-emerald-600 hover:bg-white/30 transition-all duration-300 group whitespace-nowrap"
          >
            Enroll Now
            <span className="ml-3 md:ml-4 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-900 text-white group-hover:bg-emerald-600 group-hover:rotate-45 transition-all duration-300 shadow-lg">
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M7 17L17 7M17 7H9M17 7V15" />
              </svg>
            </span>
          </NavLink>
        </div>

        {/* Hamburger menu (mobile) pinned right */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-gray-800 p-3 hover:bg-white/40 rounded-xl transition-all duration-200"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white/96 backdrop-blur-lg border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col gap-3 p-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "text-emerald-700 font-bold" : "text-gray-800"} w-full py-4 px-6 rounded-xl hover:text-emerald-600 transition-colors duration-300 font-semibold text-lg`
              }
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `${isActive ? "text-emerald-700 font-bold" : "text-gray-800"} w-full py-4 px-6 rounded-xl hover:text-emerald-600 transition-colors duration-300 font-semibold text-lg`
              }
              onClick={() => setMenuOpen(false)}
            >
              Courses
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${isActive ? "text-emerald-700 font-bold" : "text-gray-800"} w-full py-4 px-6 rounded-xl hover:text-emerald-600 transition-colors duration-300 font-semibold text-lg`
              }
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${isActive ? "text-emerald-700 font-bold" : "text-gray-800"} w-full py-4 px-6 rounded-xl hover:text-emerald-600 transition-colors duration-300 font-semibold text-lg`
              }
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${isActive ? "text-emerald-700 font-bold" : "text-gray-800"} w-full py-4 px-6 rounded-xl hover:text-emerald-600 transition-colors duration-300 font-semibold text-lg`
              }
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </NavLink>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full justify-center py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-all duration-300 mt-2"
            >
              <LogOut size={16} /> Logout
            </button>

            {/* Mobile CTA */}
            <div className="w-full pt-6 mt-4 border-t border-gray-300">
              <NavLink
                to="/enroll"
                className="flex items-center justify-center w-full border-2 border-gray-800 rounded-full px-6 md:px-8 py-4 md:py-5 text-gray-900 font-bold hover:shadow-2xl hover:scale-105 hover:border-emerald-600 transition-all duration-300 group text-lg shadow-lg"
                onClick={() => setMenuOpen(false)}
              >
                Enroll Now
                <span className="ml-3 md:ml-4 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-900 text-white group-hover:bg-emerald-600 group-hover:rotate-45 transition-all duration-300 shadow-lg">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </span>
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;