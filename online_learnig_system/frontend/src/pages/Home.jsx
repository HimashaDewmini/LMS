import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LearningExperienceSection from "../components/Aboutpage/LearningExperienceSection"; 
import TeamSection from "../components/teamsection";
import StudentReviews from "../components/StudentReviews";
import FAQ from './FAQ';
import HomeHero from '../components/HomeHero';

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <HomeHero />
        <LearningExperienceSection />
        <TeamSection />
        <StudentReviews />

        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default Home;