import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;