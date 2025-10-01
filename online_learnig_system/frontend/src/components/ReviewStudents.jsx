import React, { useState, useEffect } from 'react';

const ReviewStudents = () => {
  // State to manage the current slide group (0 or 1 for the two sets of 3 reviews)
  const [currentGroup, setCurrentGroup] = useState(0);
  
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      text: "This platform transformed my skills! Engaging courses, well-structured, with knowledgeable instructors who simplify complex topics. Covers essentials—highly recommended for growth!",
      name: "Ishan Rathnayake",
      designation: "Full Stack Developer"
    },
    {
      id: 2,
      text: "This platform transformed my skills! Engaging courses, well-structured, with knowledgeable instructors who simplify complex topics. Covers essentials—highly recommended for growth!",
      name: "Ishan Rathnayake",
      designation: "Full Stack Developer"
    },
    {
      id: 3,
      text: "This platform transformed my skills! Engaging courses, well-structured, with knowledgeable instructors who simplify complex topics. Covers essentials—highly recommended for growth!",
      name: "Ishan Rathnayake",
      designation: "Full Stack Developer"
    },
    {
      id: 4,
      text: "This platform transformed my skills! Engaging courses, well-structured, with knowledgeable instructors who simplify complex topics. Covers essentials—highly recommended for growth!",
      name: "Ishan Rathnayake",
      designation: "Full Stack Developer"
    },
    {
      id: 5,
      text: "This platform transformed my skills! Engaging courses, well-structured, with knowledgeable instructors who simplify complex topics. Covers essentials—highly recommended for growth!",
      name: "Ishan Rathnayake",
      designation: "Full Stack Developer"
    },
    {
      id: 6,
      text: "This platform transformed my skills! Engaging courses, well-structured, with knowledgeable instructors who simplify complex topics. Covers essentials—highly recommended for growth!",
      name: "Ishan Rathnayake",
      designation: "Full Stack Developer"
    }
  ];

  // Number of testimonials per group
  const testimonialsPerGroup = 3;
  // Total number of groups
  const totalGroups = Math.ceil(testimonials.length / testimonialsPerGroup);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGroup((prevGroup) => (prevGroup + 1) % totalGroups);
    }, 5000); // Change group every 5 seconds
    
    return () => clearInterval(interval);
  }, [totalGroups]);
  
  // Function to go to a specific group
  const goToGroup = (index) => {
    setCurrentGroup(index);
  };

  return (
    <section className="relative w-full py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="font-outfit font-semibold text-3xl md:text-4xl lg:text-5xl text-[#011813] mb-2">
            Happy Students Say About
          </h2>
          <h2 className="font-outfit font-semibold text-3xl md:text-4xl lg:text-5xl text-[#011813]">
            Our Courses
          </h2>
        </div>
        
        {/* Testimonial Slider */}
        <div className="relative w-full overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ transform: `translateX(-${currentGroup * 100}%)` }}
          >
            {/* Group the testimonials by 3 */}
            {Array.from({ length: totalGroups }).map((_, groupIndex) => (
              <div key={groupIndex} className="w-full flex-shrink-0 flex flex-wrap">
                {testimonials
                  .slice(
                    groupIndex * testimonialsPerGroup, 
                    (groupIndex + 1) * testimonialsPerGroup
                  )
                  .map((testimonial) => (
                    <div 
                      key={testimonial.id} 
                      className="w-full md:w-1/2 lg:w-1/3 px-2 md:px-4 mb-8"
                    >
                      <div className="bg-[#F8F8F8] rounded-2xl p-6 md:p-8 h-full shadow-md">
                        {/* Quote Icon */}
                        <div className="mb-6">
                          <svg width="52" height="49" viewBox="0 0 52 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M52 0H38.4419C36.5271 0 34.9302 1.64948 34.9302 3.63218V17.1103C34.9302 19.093 36.5271 20.7425 38.4419 20.7425H45.7209V28.2996C45.7209 31.5344 43.1706 34.1694 40.0465 34.1694H39.3209C38.1923 34.1694 37.2558 35.1335 37.2558 36.3005C37.2558 37.4674 38.1923 38.4316 39.3209 38.4316H40.0465C45.4237 38.4316 49.7674 33.9391 49.7674 28.2996V3.63218C49.7674 1.64948 48.1706 0 46.2558 0H52ZM17.0698 0H3.51163C1.59686 0 0 1.64948 0 3.63218V17.1103C0 19.093 1.59686 20.7425 3.51163 20.7425H10.7907V28.2996C10.7907 31.5344 8.24035 34.1694 5.11628 34.1694H4.39535C3.26686 34.1694 2.33023 35.1335 2.33023 36.3005C2.33023 37.4674 3.26686 38.4316 4.39535 38.4316H5.11628C10.4935 38.4316 14.8372 33.9391 14.8372 28.2996V3.63218C14.8372 1.64948 13.2403 0 11.3256 0H17.0698Z" fill="#4E5255"/>
                          </svg>
                        </div>
                        
                        {/* Testimonial Text */}
                        <div className="font-outfit font-medium text-lg text-[#4E5255] mb-8">
                          {testimonial.text}
                        </div>
                        
                        {/* User Info */}
                        <div className="mt-auto">
                          <h5 className="font-outfit font-medium text-xl text-[#011813]">
                            {testimonial.name}
                          </h5>
                          <p className="font-outfit font-normal text-base text-[#4E5255]">
                            {testimonial.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8">
          {Array.from({ length: totalGroups }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToGroup(index)}
              className={`w-3 h-3 mx-1.5 rounded-full ${
                currentGroup === index ? 'bg-[#009D77]' : 'bg-[#009D77] opacity-50'
              }`}
              aria-label={`Go to group ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewStudents;
