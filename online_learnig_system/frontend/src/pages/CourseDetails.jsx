import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StudentReviews from "../components/StudentReviews";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-gray-600 text-sm">{label}</span>
    <span className="text-gray-900 font-medium text-sm">{value}</span>
  </div>
);

const Bullet = ({ children }) => (
  <li className="pl-5 relative text-sm leading-6 text-gray-700">
    <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-gray-400"></span>
    {children}
  </li>
);

const MentorCard = ({ name, title, img, bg = "#F3F2EE" }) => (
  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md w-full max-w-sm">
    <div
      className="h-64 flex items-end justify-center"
      style={{ backgroundColor: bg }}
    >
      <img src={img} alt={name} className="h-60 object-contain" />
    </div>
    <div className="bg-[white] text-black text-center py-4">
      <div className="font-semibold text-[18px]">{name}</div>
      <div className="text-black-300 text-sm mt-1">{title}</div>
    </div>
  </div>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 5v5l2.5 2.5"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 10a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0Z"
      stroke="#6b7280"
      strokeWidth="1.5"
    />
  </svg>
);

const LecturesIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="14"
      height="12"
      rx="2"
      stroke="#6b7280"
      strokeWidth="1.5"
    />
    <path d="M3 8h14" stroke="#6b7280" strokeWidth="1.5" />
  </svg>
);

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Course not found");
          } else {
            setError("Failed to fetch course");
          }
          setCourse(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setCourse(data);
        setError("");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Network error. Please try again.");
        setCourse(null);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-3 bg-[#011813] text-white rounded-full"
        >
          Back to Courses
        </button>
      </div>
    );

  // Helper for category
  const getCategoryName = (course) => {
    if (!course.category) return "N/A";
    return typeof course.category === "string"
      ? course.category
      : course.category?.name || "N/A";
  };

  return (
    <div className="bg-white min-h-screen text-[#0c1a14]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-4 text-base font-outfit text-[#011813]">
          <a href="/" className="font-normal hover:underline">
            Home
          </a>
          <span className="mx-2">/</span>
          <a
            href="/courses"
            className="font-normal text-[#009D77] hover:underline"
          >
            Courses
          </a>
          {course?.title && (
            <>
              <span className="mx-2">/</span>
              <span className="font-normal text-gray-500">{course.title}</span>
            </>
          )}
        </div>

        {/* Hero + Sidebar */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="rounded-2xl overflow-hidden ring-1 ring-gray-100 shadow-sm">
            <img
              src={
                course.thumbnailUrl
                  ? `http://localhost:5000${course.thumbnailUrl}`
                  : "/placeholder-image.png"
              }
              className="w-full h-auto object-cover"
              alt={course.title}
            />
          </div>

          <aside className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sticky top-6">
            <div className="text-2xl font-semibold text-[#0b1b15]">
              ${course.price}
            </div>
            <div className="mt-4 h-px bg-gray-100" />
            <div className="mt-2">
              <InfoRow label="Level" value={course.level || "Intermediate"} />
              <InfoRow
                label="Lessons"
                value={`${course.lectures || 0} Videos`}
              />
              <InfoRow label="Duration" value={course.duration || "N/A"} />
              <InfoRow label="Enrolled" value={course.enrolledCount || "0"} />
              <InfoRow
                label="Last Update"
                value={
                  course.updatedAt
                    ? new Date(course.updatedAt).toLocaleDateString()
                    : "N/A"
                }
              />
            </div>
            <button className="mt-5 w-full bg-[#011813] text-white py-3 rounded-full font-medium hover:bg-black transition-colors">
              Start Learning
            </button>
          </aside>
        </div>

        {/* About the Course */}
        <section className="mt-12">
          <h2 className="text-[18px] md:text-[20px] font-semibold text-[#0c6b4f]">
            About the Course
          </h2>
          <p className="mt-3 text-[14px] md:text-[15px] text-gray-700 leading-7 max-w-4xl">
            {course.description}
          </p>
          <div className="mt-6 h-px bg-gray-100" />
        </section>

        {/* Course Mentors */}
        {course.mentors?.length > 0 && (
          <section className="mt-10">
            <h3 className="font-semibold text-[#0b1b15]">Course Mentors</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {course.mentors.map((m, idx) => (
                <MentorCard
                  key={idx}
                  name={m.name}
                  title={m.title}
                  img={m.imgUrl}
                />
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="mt-14">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Happy Students Say About Our Courses
            </h3>
          </div>
          <StudentReviews />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
