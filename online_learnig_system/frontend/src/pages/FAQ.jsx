import React, { useState } from 'react';

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);

  const faqData = [
    {
      id: 0,
      question: "Can I Track My Assignments and Grades?",
      answer: "Yes, the LMS offers a 'Gradebook' where students can view their grades, monitor feedback on assignments, and check upcoming due dates. Instructors can also post grades and comments for each submission."
    },
    {
      id: 1,
      question: "Does the LMS support video lessons and live classes?",
      answer: "Yes, our LMS fully supports video lessons with high-quality streaming and interactive features. You can also join live classes with real-time video conferencing, screen sharing, and interactive whiteboards for an engaging learning experience."
    },
    {
      id: 2,
      question: "How can I communicate with my instructor?",
      answer: "You can communicate with your instructor through multiple channels: direct messaging system, discussion forums, email notifications, live chat during classes, and scheduled virtual office hours. All communication is tracked and easily accessible."
    },
    {
      id: 3,
      question: "What support is available for students and instructors?",
      answer: "We provide comprehensive support including 24/7 technical help desk, detailed user guides and tutorials, live chat support during business hours, video training sessions, and dedicated account managers for institutional clients."
    },
    {
      id: 4,
      question: "Are there interactive features for students?",
      answer: "Absolutely! Our platform includes interactive quizzes and polls, collaborative group projects, discussion boards and forums, virtual labs and simulations, gamification elements with badges and leaderboards, and peer-to-peer learning tools."
    }
  ];

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f0f8ff] to-[#fff8f0] py-16 px-5 font-sans">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-[600px] mx-auto">
            Frequently Asked Questions offers quick answers to common queries, guiding users
            <br className="hidden sm:inline-block" />
            through features and functionalities effortlessly.
          </p>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-4">
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden ${activeQuestion === item.id ? 'border-green-500 shadow-md' : ''}`}
            >
              {/* Question */}
              <div
                className="flex justify-between items-center px-8 py-7 cursor-pointer select-none transition-colors hover:bg-gray-50"
                onClick={() => toggleQuestion(item.id)}
              >
                <h3 className={`text-base md:text-lg font-semibold text-gray-900 flex-1 pr-5 ${activeQuestion === item.id ? 'text-green-500' : ''}`}>
                  {item.question}
                </h3>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${activeQuestion === item.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {activeQuestion === item.id ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  )}
                </div>
              </div>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${activeQuestion === item.id ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-8 pb-7 bg-gray-50 pt-2">
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
