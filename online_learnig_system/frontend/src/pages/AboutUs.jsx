import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Aboutpage/Hero";
import Showcase from "../components/Aboutpage/Showcase";
import Journey from "../components/Aboutpage/Journey";
import Learning from "../components/Aboutpage/Learning";
import LearningExperienceSection from "../components/Aboutpage/LearningExperienceSection";  
import TeamSection from "../components/teamsection";
import FAQ from "../pages/FAQ";

const AboutUs = () => {
  return (
    <>
      <Header />
      <div>
        <Hero />
        <Journey/>
        <Showcase />
        <Learning />
        <LearningExperienceSection />
        <TeamSection />
        <FAQ />
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
