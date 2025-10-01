import React, { useState, useEffect } from 'react';
import contactImage from '../assets/contact_image.jpg';
import FAQ from './FAQ';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // ✅ Auto-fill logged-in user's email + name
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        emailAddress: parsedUser.email || prev.emailAddress,
        fullName: parsedUser.name || prev.fullName
      }));
      setIsUserLoggedIn(true); // mark as logged in
    }
  }, []);

  // ✅ Auto-hide status after 2 seconds
  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ type: '', message: '' }), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: data.message || "Message sent successfully ✅" });
        setFormData(prev => ({
          ...prev,
          phoneNumber: '',
          message: ''
        }));
      } else {
        setStatus({ type: 'error', message: data.error || "Failed to send message ❌" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: "Server error. Please try again later." });
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white p-5 font-sans">
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto py-5 text-gray-600 flex items-center gap-1 text-base md:text-lg">
          <a href="/" className="hover:text-gray-800 transition-colors">Home</a>
          <span className="mx-2 align-middle">/</span>
          <span className="font-medium text-gray-800">Contact Us</span>
        </div>

        {/* Contact Container */}
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            {/* Contact Form */}
            <div className="pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Have Any Questions!<br />Send a Message
              </h1>

              {/* Status Message */}
              {status.message && (
                <div
                  className={`p-4 mb-4 rounded-lg text-white ${
                    status.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="flex flex-col">
                  <label htmlFor="fullName" className="text-base font-medium text-gray-800 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    readOnly={isUserLoggedIn}
                    className={`p-4 border-2 border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${isUserLoggedIn ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                  <label htmlFor="phoneNumber" className="text-base font-medium text-gray-800 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="p-4 border-2 border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col">
                  <label htmlFor="emailAddress" className="text-base font-medium text-gray-800 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    required
                    readOnly={isUserLoggedIn}
                    className={`p-4 border-2 border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${isUserLoggedIn ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label htmlFor="message" className="text-base font-medium text-gray-800 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    required
                    className="p-4 border-2 border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y min-h-[120px]"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex items-center border-2 border-gray-800 rounded-full px-8 py-3 text-gray-900 font-bold text-lg hover:shadow-2xl hover:scale-105 hover:border-emerald-600 hover:bg-white/30 transition-all duration-300 group self-start mt-4"
                >
                  Send Message
                  <span className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white group-hover:bg-emerald-600 group-hover:rotate-45 transition-all duration-300 shadow-lg">
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
              </form>
            </div>

            {/* Contact Image */}
            <div className="relative flex justify-center items-start mt-[-40px] group">
              <img
                src={contactImage}
                alt="Customer service representative"
                className="w-full max-w-[400px] h-[450px] rounded-xl shadow-2xl relative z-20 transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="w-full bg-pink-50 py-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-10">
              {/* Phone Card */}
              <div className="flex items-center gap-6 p-6 bg-teal-500 text-white rounded-2xl transition-all transform hover:-translate-y-2 hover:shadow-xl">
                <div className="w-12 h-12 bg-white text-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm">Phone</h3>
                  <p className="text-base font-semibold">+94781234650</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-center gap-6 p-6 bg-pink-500 text-white rounded-2xl transition-all transform hover:-translate-y-2 hover:shadow-xl">
                <div className="w-12 h-12 bg-white text-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm">Email</h3>
                  <p className="text-base font-semibold">hello@onlineschool.com</p>
                </div>
              </div>

              {/* Live Chat Card */}
              <div className="flex items-center gap-6 p-6 bg-purple-500 text-white rounded-2xl transition-all transform hover:-translate-y-2 hover:shadow-xl">
                <div className="w-12 h-12 bg-white text-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L14.6 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm">Live Chat</h3>
                  <p className="text-base font-semibold">Open Live Chat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FAQ />
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;