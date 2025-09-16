import React from 'react';
import HeroSection from '../components/HeroSection';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Popular Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Course cards would go here */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Mathematics</h3>
            <p className="text-gray-600">KCSE Mathematics preparation course</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Science</h3>
            <p className="text-gray-600">Comprehensive science curriculum</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Languages</h3>
            <p className="text-gray-600">English and Swahili language courses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;