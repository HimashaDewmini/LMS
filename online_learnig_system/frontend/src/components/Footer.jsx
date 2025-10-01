import React from 'react';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#b8f0f3] via-[#f8fcff] to-[#f9d5e8] text-gray-800">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16">
          
          {/* Company Info - Aligned same as header */}
          <div className="flex-1 lg:flex-none space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                >
                  <rect
                    x="6"
                    y="6"
                    width="12"
                    height="12"
                    transform="rotate(45 12 12)"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">OnlineSchool</span>
            </div>
            
            <p className="text-gray-700 text-base leading-relaxed font-medium">
              Unlock knowledge with expert-led online courses.
            </p>
            
            {/* Social Media */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-gray-900">Stay connected</h3>
              <div className="flex items-center gap-4">
                <a href="#" className="p-3 bg-gray-300 border border-gray-400 rounded-full hover:bg-gray-400 transition-all duration-300 hover:scale-110">
                  <Twitter size={20} className="text-gray-700" />
                </a>
                <a href="#" className="p-3 bg-gray-300 border border-gray-400 rounded-full hover:bg-gray-400 transition-all duration-300 hover:scale-110">
                  <Facebook size={20} className="text-gray-700" />
                </a>
                <a href="#" className="p-3 bg-gray-300 border border-gray-400 rounded-full hover:bg-gray-400 transition-all duration-300 hover:scale-110">
                  <Linkedin size={20} className="text-gray-700" />
                </a>
                <a href="#" className="p-3 bg-gray-300 border border-gray-400 rounded-full hover:bg-gray-400 transition-all duration-300 hover:scale-110">
                  <Instagram size={20} className="text-gray-700" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-1 lg:flex-none space-y-8">
            <h3 className="text-xl font-bold text-gray-900 mt-8 lg:mt-0">Quick Links</h3>
            <ul className="space-y-5">
              {['Home', 'Courses', 'About Us', 'Contact'].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium text-base"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Others */}
          <div className="flex-1 lg:flex-none space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Others</h3>
            <ul className="space-y-5">
              {['Mentors', 'Blog', '404', 'Privacy Policy', 'Terms & Conditions'].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium text-base"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex-1 lg:flex-none space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-300 border border-gray-400 rounded-lg">
                  <Phone size={18} className="text-emerald-600" />
                </div>
                <p className="text-gray-700 text-base font-medium">+94781234650</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-300 border border-gray-400 rounded-lg">
                  <Mail size={18} className="text-emerald-600" />
                </div>
                <p className="text-gray-700 text-base font-medium">hello@onlineschool.com</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-300 border border-gray-400 rounded-lg">
                  <MapPin size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-gray-700 text-base font-medium">Colombo 10,</p>
                  <p className="text-gray-700 text-base font-medium">Colombo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/30">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-700 text-base font-medium">
              2025 © Fuchsius. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;