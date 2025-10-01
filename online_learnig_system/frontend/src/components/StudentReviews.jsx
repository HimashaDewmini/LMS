import React, { useState } from 'react';

// StudentReviews component with smooth slide animations using Tailwind CSS
const StudentReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const reviews = [
    {
      id: 1,
      text: "This platform transformed my skills! Engaging courses, well-structured, with knowledgeable instructors who simplify complex topics. Covers essentials—highly recommended for growth!",
      name: "Ishan Rathnayake",
      title: "Full Stack Developer"
    },
    {
      id: 2,
      text: "Exceptional learning experience with practical projects and real-world applications. The instructors are amazing and the curriculum is up-to-date with industry standards.",
      name: "Sarah Johnson",
      title: "Frontend Developer"
    },
    {
      id: 3,
      text: "The best investment I made for my career. Clear explanations, hands-on practice, and excellent support throughout the learning journey. Highly recommend!",
      name: "Michael Chen",
      title: "Software Engineer"
    },
    {
      id: 4,
      text: "Outstanding platform with comprehensive courses. The step-by-step approach made complex concepts easy to understand. Perfect for beginners and advanced learners alike.",
      name: "Emily Davis",
      title: "Web Developer"
    }
  ];

  const totalSlides = Math.ceil(reviews.length / 3);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // ✅ Removed TypeScript style definition
  //const getVisibleReviews = () => {
  //  const startIndex = currentSlide * 3;
  //  return reviews.slice(startIndex, startIndex + 3);
  //cd frontend};

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Happy Students Say About <br />
            Our Courses
          </h2>
        </div>

        {/* Reviews Container */}
        <div className="relative overflow-hidden mb-12">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                  {reviews
                    .slice(slideIndex * 3, slideIndex * 3 + 3)
                    .map((review, cardIndex) => (
                      <div
                        key={review.id}
                        className={`bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:shadow-lg hover:ring-1 hover:ring-green-300 relative transform transition-all duration-500 ${
                          slideIndex === currentSlide 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-4'
                        }`}
                        style={{ 
                          transitionDelay: slideIndex === currentSlide ? `${cardIndex * 100}ms` : '0ms' 
                        }}
                      >
                        {/* Quote Icon */}
                        <div className="text-6xl text-gray-300 leading-none mb-4 font-serif">
                          "
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                          {review.text}
                        </p>

                        {/* Reviewer Info */}
                        <div className="mt-auto">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">
                            {review.name}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            {review.title}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-3 mb-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-green-500 scale-110' 
                  : 'bg-gray-300 hover:bg-green-400 hover:scale-105'
              } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentReviews;
