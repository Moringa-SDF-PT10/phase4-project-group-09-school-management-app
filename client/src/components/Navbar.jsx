import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="bg-orange-500 p-2 rounded">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">
                School<span className="text-orange-500">Best</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/features" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`
              }
            >
              Features
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink 
              to="/get-started" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`
              }
            >
              Pricing
            </NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/get-started" 
              className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-orange-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="space-y-2 px-4">
              <NavLink 
                to="/" 
                className="block py-2 text-gray-600 hover:text-orange-500 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/features" 
                className="block py-2 text-gray-600 hover:text-orange-500 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </NavLink>
              <NavLink 
                to="/contact" 
                className="block py-2 text-gray-600 hover:text-orange-500 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
              <NavLink 
                to="/get-started" 
                className="block py-2 text-gray-600 hover:text-orange-500 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </NavLink>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link 
                  to="/login" 
                  className="block py-2 text-gray-600 hover:text-orange-500 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/get-started" 
                  className="block py-2 text-orange-500 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;