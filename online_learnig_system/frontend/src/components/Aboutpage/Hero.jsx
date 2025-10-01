import React from "react";
import laptopImg from "../../assets/laptopImg.jpg";
import badgeImg from "../../assets/1.png";

const Hero = () => {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#d6f1f6] to-[#f6d6f3] font-['Outfit'] relative overflow-hidden">
       
        <div className="absolute top-32 right-8 md:right-16 lg:right-24 opacity-30 hidden md:block">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-600 rounded-full"></div>
            ))}
          </div>
        </div>

      
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10 pt-8 pb-16">
         
          <div className="flex items-center mb-4 text-base font-outfit text-[#011813]">
            <a
              href="/"
              className="font-normal hover:text-gray-800 transition-colors"
            >
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="font-normal text-[#009D77]">About Us</span>
          </div>

          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-12 max-w-4xl">
            Providing Unrivaled <br /> Quality in Online Courses
          </h1>
        </div>

       
        <div className="relative w-full">
          <img
            src={laptopImg}
            alt="Laptop with coffee"
            className="w-full h-48 sm:h-72 md:h-[482px] rounded-lg object-cover"
          />

         
          <div className="absolute top-1/2 right-4 sm:right-6 md:right-12 lg:right-24 transform -translate-y-1/2 bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-lg w-[180px] sm:w-[220px] md:w-[320px] lg:w-[493px] max-w-[80%] sm:max-w-[85%] md:max-w-[90%]">
            <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 leading-none">
                10+
              </h2>
              <div className="flex-shrink-0">
                <img
                  src={badgeImg}
                  alt="Achievement Badge"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 object-contain"
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-gray-700 mb-1 sm:mb-2 md:mb-3">
              Years of Experience
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-gray-600 leading-relaxed">
              Leveraging 10+ years in the field, our online courses offer
              expertly developed content, designed to support learners with
              engaging and impactful education.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
