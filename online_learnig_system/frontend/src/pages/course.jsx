import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TeamSection from "../components/teamsection";
import { Link } from "react-router-dom";

export default function CourseSection() {
  const [courses, setCourses] = useState([]);
  const [featuredCourse, setFeaturedCourse] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedCourse(data[0]);
          setCourses(data);

          // ✅ Extract unique categories dynamically
          const uniqueCategories = [
            "All",
            ...new Set(
              data.map((c) =>
                typeof c.category === "string"
                  ? c.category
                  : c.category?.name || "N/A"
              )
            ),
          ];
          setCategories(uniqueCategories);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const getImageUrl = (course) => {
    if (!course.thumbnailUrl) return "/placeholder-image.png";
    const url = course.thumbnailUrl.startsWith("/")
      ? `http://localhost:5000${course.thumbnailUrl}`
      : `http://localhost:5000/${course.thumbnailUrl}`;
    return url;
  };

  // ✅ Helper to get category name (works for string or object)
  const getCategoryName = (course) => {
    if (!course.category) return "N/A";
    return typeof course.category === "string"
      ? course.category
      : course.category?.name || "N/A";
  };

  // ✅ Filter courses by category
  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => getCategoryName(c) === activeCategory);

  const isExpanded = visibleCount >= filteredCourses.length;

  const scrollToTop = () => {
    const section = document.querySelector("#course-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Header />
      <section
        id="course-section"
        className="relative w-full min-h-screen bg-gradient-to-r from-[#d6f1f6] to-[#f6d6f3] flex flex-col items-center pt-8 md:pt-12 lg:pt-16"
      >
        <div className="relative w-full max-w-[95vw] xl:max-w-[1240px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center mb-4 text-base font-outfit text-[#011813]">
            <Link to="/" className="font-normal hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              to="/courses"
              className="font-normal text-[#009D77] hover:underline"
            >
              Courses
            </Link>
          </div>

          {/* Section Title */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4 md:gap-0">
            <h1 className="text-black font-outfit font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight max-w-full md:max-w-3xl">
              We Offer an Outstanding
              <br />
              Learning Experience
            </h1>
          </div>

          {/* Featured Course */}
          {featuredCourse && (
            <div className="relative w-full max-w-full xl:max-w-[1200px] mx-auto bg-white/5 border border-[#E7E7E8] rounded-2xl flex flex-col md:flex-row items-center p-4 sm:p-6 md:p-8 gap-6 md:gap-8 shadow-xl hover:shadow-2xl transition mb-12">
              <div className="w-full h-56 sm:h-72 md:w-[300px] md:h-[300px] lg:w-[376px] lg:h-[376px] rounded-xl overflow-hidden flex-shrink-0 relative bg-black/10 mb-4 md:mb-0">
                <img
                  src={getImageUrl(featuredCourse)}
                  alt={featuredCourse.title}
                  className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between h-full py-2 min-w-0">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#F0F0F0] text-[#011813] font-outfit font-medium px-4 py-2 rounded-lg text-base">
                    {getCategoryName(featuredCourse)}
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-[#011813] font-outfit font-semibold text-2xl md:text-3xl mb-2">
                    {featuredCourse.title}
                  </h3>
                  <p className="text-[#4E5255] font-outfit text-base max-w-lg">
                    {featuredCourse.description || "No description provided."}
                  </p>
                </div>
                <div className="flex items-center gap-8 mb-4">
                  <div className="flex items-center gap-2 text-[#4E5255] font-outfit text-base">
                    ⏱ {featuredCourse.duration || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-[#4E5255] font-outfit text-base">
                    📚 {featuredCourse.lectures ?? "N/A"} lectures
                  </div>
                </div>
                <div className="w-full h-px bg-[#E7E7E8] mb-4"></div>

                <div className="flex items-center justify-between">
                  <span className="text-[#009D77] font-outfit font-semibold text-2xl md:text-3xl">
                    ${featuredCourse.price}
                  </span>
                  <Link
                    to={`/courses/${featuredCourse.id}`}
                    className="flex items-center bg-transparent border border-[#011813] rounded-full px-6 py-3 text-[#011813] font-outfit font-medium text-base gap-2 hover:bg-[#011813] hover:text-white transition"
                  >
                    View Details
                    <span className="ml-2 flex items-center justify-center w-10 h-10 bg-[#011813] rounded-full">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          <div className="w-full flex flex-col items-center mt-8 md:mt-12 lg:mt-16">
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#011813] text-center mb-8">
              Explore Our All Courses
            </h2>

            {/* ✅ Dynamic Category Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(8);
                  }}
                  className={`px-6 py-3 rounded-full font-outfit font-medium transition ${
                    activeCategory === cat
                      ? "bg-[#009D77] text-white"
                      : "bg-white text-[#4E5255] border border-[#E7E7E8] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-full xl:max-w-[1240px] mx-auto mb-8 md:mb-12">
              {filteredCourses.slice(0, visibleCount).map((course) => (
                <div
                  key={course.id}
                  onClick={() => {
                    setFeaturedCourse(course); // ✅ Set clicked course as featured
                    scrollToTop(); // ✅ Scroll back to top
                  }}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-4 flex flex-col group cursor-pointer"
                >
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                    <img
                      src={getImageUrl(course)}
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-4 py-2 rounded-lg text-sm font-outfit font-medium bg-[#F0F0F0] text-[#011813]">
                      {getCategoryName(course)}
                    </span>
                    <span className="font-outfit font-semibold text-xl text-[#009D77]">
                      ${course.price}
                    </span>
                  </div>
                  <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
                    <span>⏱ {course.duration || "N/A"}</span>
                    <span>📚 {course.lectures ?? "N/A"} lectures</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Toggle Button */}
            {filteredCourses.length > 8 && (
              <div className="flex justify-center mt-8 mb-16">
                <button
                  onClick={() => {
                    if (isExpanded) {
                      setVisibleCount(8);
                      scrollToTop();
                    } else {
                      setVisibleCount(filteredCourses.length);
                    }
                  }}
                  className="flex items-center border border-[#011813] rounded-full px-8 py-4 text-[#011813] font-outfit font-medium text-lg hover:bg-[#011813] hover:text-white transition-all duration-300"
                >
                  {isExpanded ? "Show Less" : "View More Courses"}
                </button>
              </div>
            )}
          </div>
        </div>
        <TeamSection />
        <Footer />
      </section>
    </>
  );
}
