import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      {/* Optional: Add a footer here */}
    </div>
  );
};

export default PublicLayout;
