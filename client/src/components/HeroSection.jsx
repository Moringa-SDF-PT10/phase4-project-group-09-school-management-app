import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Quality Education for 
            <span className="text-orange-500"> Brighter Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access the best learning resources, expert teachers, and modern educational tools 
            to excel in your academic journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              to="/register"
              className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;