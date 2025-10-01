import React, { useState, useEffect } from "react";
import teamImg from "../../assets/team.png";
import studentsImg from "../../assets/student.jpg";
import interactiveIcon from "../../assets/line.png";
import expertIcon from "../../assets/cap.png"; 
import personalizedIcon from "../../assets/human.png";

const Journey = () => {
  const [studentData, setStudentData] = useState({
    count: 0,
    students: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students/public`);
        
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const data = await response.json();
        
        setStudentData({
          count: data.length,
          students: data.slice(0, 3) 
        });
      } catch (error) {
        console.error('Error fetching students:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const formatStudentCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-10 py-12 lg:py-16 gap-10 max-w-[1200px] mx-auto font-sans">
      {/* Left Side */}
      <div className="flex-1 lg:pr-5 text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-gray-900 leading-tight mb-5">
          Why Choose Us for Your Learning Journey
        </h2>
        <p className="text-sm sm:text-base md:text-[16px] text-gray-600 leading-7 mb-8">
          Our team combines innovation, expertise, and a client-centered
          approach, delivering projects with outstanding quality, meticulous
          attention to detail, and a focus on meaningful growth.
        </p>

        <div className="flex items-start gap-4 sm:gap-5 mb-6 text-left">
          <div className="w-12 h-12 sm:w-[55px] sm:h-[55px] flex items-center justify-center rounded-full bg-emerald-50 flex-shrink-0">
            <img 
              src={expertIcon} 
              alt="Expert-led courses" 
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Expert-led courses
            </h3>
            <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
              Learn from experienced professionals in fields like marketing,
              design, development, finance, and more.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 sm:gap-5 mb-6 text-left">
          <div className="w-12 h-12 sm:w-[55px] sm:h-[55px] flex items-center justify-center rounded-full bg-pink-50 flex-shrink-0">
            <img 
              src={personalizedIcon} 
              alt="Personalized learning paths" 
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Personalized learning paths
            </h3>
            <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
              Tailor your journey with courses that align with your unique goals
              and pace.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 sm:gap-5 text-left">
          <div className="w-12 h-12 sm:w-[55px] sm:h-[55px] flex items-center justify-center rounded-full bg-purple-100 flex-shrink-0">
            <img 
              src={interactiveIcon} 
              alt="Interactive learning" 
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Interactive learning
            </h3>
            <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
              Engage with multimedia content, quizzes, and assignments designed
              to make learning dynamic and enjoyable.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 relative flex justify-center items-center">
        <div className="relative w-full max-w-[500px] pb-[90%] sm:pb-[70%]">
          <img
            src={teamImg}
            alt="Teacher presenting"
            className="absolute top-0 left-0 w-full h-[60%] sm:h-[65%] rounded-[12px] sm:rounded-[15px] shadow-xl object-cover z-20"
          />

          <img
            src={studentsImg}
            alt="Student working"
            className="absolute bottom-0 right-0 w-[75%] sm:w-[70%] h-[50%] sm:h-[60%] rounded-[12px] sm:rounded-[15px] shadow-lg object-cover z-10 translate-x-[5%] sm:translate-x-[10%]"
          />

          {/* Student Count Card with Real Data */}
          <div className="hidden sm:flex absolute top-2 right-[-15px] sm:right-[-30px] bg-white p-3 sm:p-4 rounded-xl shadow-lg flex-col items-start gap-2 sm:gap-3 z-30 w-[160px] sm:w-auto">
            <p className="text-sm sm:text-[16px] font-bold text-gray-900">
              {loading ? (
                <span className="inline-block w-20 h-5 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                `${formatStudentCount(studentData.count)} Student${studentData.count !== 1 ? 's' : ''}`
              )}
            </p>
            <div className="flex items-center">
              {loading ? (
                
                <>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse border-2 border-white first:ml-0 -ml-2"></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse border-2 border-white -ml-2"></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse border-2 border-white -ml-2"></div>
                </>
              ) : (
                <>
                  {studentData.students.map((student, index) => (
                    <img
                      key={student.id}
                      src={student.profileImage 
                        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${student.profileImage}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&size=128`
                      }
                      alt={student.name}
                      title={student.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white first:ml-0 -ml-2 hover:scale-110 transition-transform object-cover"
                    />
                  ))}

                  {studentData.count > 3 && (
                    <span 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-base sm:text-lg font-bold -ml-2 cursor-pointer hover:bg-emerald-100 transition"
                      title={`${studentData.count - 3} more students`}
                    >
                      +
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;