import React from "react";
import { ArrowRight } from "lucide-react";
import Girl from "../../assets/girl.png";
import Boy from "../../assets/boy.png";
import { Link } from "react-router-dom";

const Learning = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 p-8 bg-gray-50 min-h-[50vh] items-center justify-center">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-12  max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-300 rounded-full opacity-20 transform -translate-x-10 translate-y-10"></div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 whitespace-nowrap">
                Become an Instructor?
              </h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Become an Instructor. Join us to share your expertise, inspire
                learners, and shape the future of education together.
              </p>

              <Link to="/contact">
                <button
                  type="button"
                  className="flex items-center border-2 border-gray-800 rounded-full px-6 py-3 text-gray-900 font-bold text-sm hover:shadow-2xl hover:scale-105 hover:border-purple-600 hover:bg-white/30 transition-all duration-300 group"
                >
                  Join with Us
                  <span className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white group-hover:bg-purple-600 group-hover:rotate-45 transition-all duration-300 shadow-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>

          
            <div className="flex-1 flex items-center justify-center">
              <div className="w-39 h-39 relative overflow-hidden rounded-xl">
                <img
                  src={Boy}
                  alt="Boy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

       
        <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl p-12  max-w-lg w-full relative overflow-hidden">
         
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-300 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-green-300 rounded-full opacity-20 transform -translate-x-10 translate-y-10"></div>
          <div></div>
          <div className="flex flex-col md:flex-row items-center gap-6">
           
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 whitespace-nowrap">
                Get Online Courses
              </h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Join as a student to access online courses, gain in-demand
                skills, and build a strong foundation for future success.
              </p>
              <Link to="/courses">
                <button
                  type="button"
                  className="flex items-center border-2 border-gray-800 rounded-full px-6 py-3 text-gray-900 font-bold text-sm hover:shadow-2xl hover:scale-105 hover:border-emerald-600 hover:bg-white/30 transition-all duration-300 group"
                >
                  Start Learning
                  <span className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white group-hover:bg-emerald-600 group-hover:rotate-45 transition-all duration-300 shadow-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>

            
            <div className="flex-1 flex items-center justify-center">
              <div className="w-140 h-140 relative overflow-hidden rounded-xl">
                <img
                  src={Girl}
                  alt="Girl"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
