import React, { useState } from "react";
import plant from "../../assets/plant.jpg";

const PlayIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Showcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoUrl = "https://www.youtube.com/embed/ezbJwaLmOeM";

  return (
    <div className="min-h-[50vh] bg-gray-100 p-8 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row">
          
          
          <div className="relative w-full lg:w-1/2 p-6 md:p-10 flex items-center justify-center">
            <div className="relative w-full max-w-md h-96 bg-gray-300 rounded-3xl overflow-hidden shadow-xl">
              
              
              {!isPlaying && (
                <img
                  src={plant}
                  alt="Video placeholder"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

            
              {isPlaying && (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`${videoUrl}?autoplay=1`}
                  title="Showcase Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}

              
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    className="bg-white/90 p-4 rounded-full shadow-lg hover:bg-white transform hover:scale-110 transition text-gray-800"
                    onClick={() => setIsPlaying(true)}
                  >
                    <PlayIcon />
                  </button>
                </div>
              )}

             
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-lg font-semibold mb-1">
                  Making Career Impact Together
                </h3>
                <p className="text-white/90 text-sm">Founder, MH Master Hub</p>
              </div>
            </div>
          </div>

         
          <div className="w-full lg:w-1/2 p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 leading-snug">
              A Journey of Achievement
              <br />
              and Digital Growth
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-100 rounded-xl p-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">15,000+</div>
                <div className="text-gray-700 font-medium">Graduate</div>
              </div>
              <div className="bg-yellow-200 rounded-xl p-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">1,25,000+</div>
                <div className="text-gray-700 font-medium">Active User</div>
              </div>
              <div className="bg-green-100 rounded-xl p-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">90%</div>
                <div className="text-gray-700 font-medium">Course Complete Rate</div>
              </div>
              <div className="bg-pink-100 rounded-xl p-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">9,000+</div>
                <div className="text-gray-700 font-medium">Job Placement</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Showcase;
