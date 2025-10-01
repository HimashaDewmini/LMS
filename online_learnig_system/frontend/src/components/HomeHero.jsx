import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import person from '../assets/person.png';
import { Link } from 'react-router-dom';

export default function DigitalCoursesHero() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 via-pink-50 to-pink-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Best Courses to Expand Your Digital Abilities
          </h1>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            Explore courses that expand your digital abilities, covering key areas like data analytics, design, and marketing for career growth and innovation.
          </p>
          
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

        {/* Right Content - Image Section */}
        <div className="relative">
          {/* Student Count Badge */}
          <div className="absolute -top-4 left-8 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2 z-10">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                +
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-800">120K Students</div>
          </div>

          {/* Main Image Container */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="aspect-[4/3] relative">
              {/* Person Image */}
              <img 
                src={person} 
                alt="Student learning online" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Certificate Badge */}
          <div className="absolute -bottom-6 -left-6 bg-emerald-500 rounded-full w-28 h-28 flex items-center justify-center shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <div className="text-center text-white">
              <div className="text-2xl mb-1">✦</div>
              <div className="text-xs font-semibold tracking-wider">CERTIFIED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}