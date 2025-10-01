import React from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import experience from "../../assets/experience.jpg";
import { Link } from "react-router-dom";

const LearningExperienceSection = () => {
  return (
    <div className="bg-gray-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
         
          <div className="flex-1 relative">
            <div className="relative">
              <div className="mt-8 px-4 w-full">
                <img
                  src={experience}
                  alt="Learning Experience"
                  className="w-[610px] h-[500px] object-cover rounded-3xl shadow-lg relative top-[-0.5]"
                  style={{ transform: "rotate(0deg)", opacity: 1 }}
                />
              </div>

              <div className="absolute bottom-4 right-8 bg-white rounded-2xl shadow-xl p-6 w-48">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    Average Class
                    <br />
                    Completion Rate
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-teal-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                      />
                    </svg>
                    <span className="text-xs text-teal-500 font-medium">
                      65%+
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-gray-800">95%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                We Ensure an Exceptional Learning Experience
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We guarantee an exceptional learning experience with expert
                instructors, interactive lessons, and hands-on opportunities
                designed to ensure student success and growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  100,000+
                </div>
                <p className="text-gray-600">
                  Students effectively enhanced digital skills using our
                  platform.
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  20,000+
                </div>
                <p className="text-gray-600">
                  Students have built successfully career in various tech
                  companies
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/courses">
                <button
                  type="button"
                  className="flex items-center rounded-full px-8 py-4 text-white font-medium hover:scale-105 transition-all duration-300 group"
                  style={{ backgroundColor: "#0d9488" }}
                >
                  Explore Courses
                  <span className="ml-3 flex items-center justify-center w-12 h-12 rounded-full border-2 border-white bg-white/20 text-white group-hover:bg-white/40 group-hover:rotate-45 transition-all duration-300 shadow-lg">
                    <svg
                      className="w-5 h-5"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningExperienceSection;
