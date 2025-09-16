import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to 
              <span className="text-orange-400"> SchoolBest</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Transforming education through innovative technology and comprehensive learning management solutions for modern schools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/courses"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SchoolBest?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform offers everything you need to manage your educational institution efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <span className="text-2xl text-orange-600">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Course Management</h3>
              <p className="text-gray-600">
                Easily create, manage, and organize courses with our intuitive platform.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <span className="text-2xl text-blue-600">👨‍🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Management</h3>
              <p className="text-gray-600">
                Track student progress, grades, and enrollment in one centralized system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <span className="text-2xl text-green-600">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Grade Tracking</h3>
              <p className="text-gray-600">
                Comprehensive grade management with analytics and reporting features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Qualified Teachers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600">Courses Offered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of educators and students who are already benefiting from our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/contact"
              className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;