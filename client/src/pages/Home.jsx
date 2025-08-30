import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Empowering Education, Together
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          The all-in-one platform for students, teachers, and administrators.
        </p>
        <div className="mt-8">
          <Link to="/register" className="btn-secondary">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
