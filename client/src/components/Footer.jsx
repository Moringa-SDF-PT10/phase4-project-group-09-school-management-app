import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-orange-500 p-2 rounded">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold">
                School<span className="text-orange-500">Best</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Providing quality education and learning resources for students across Kenya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-orange-500 transition-colors">Courses</Link></li>
              <li><Link to="/teachers" className="hover:text-orange-500 transition-colors">Teachers</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/blog" className="hover:text-orange-500 transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
              <li><Link to="/downloads" className="hover:text-orange-500 transition-colors">Downloads</Link></li>
              <li><Link to="/support" className="hover:text-orange-500 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 info@schoolbest.co.ke</p>
              <p>📞 +254 700 123 456</p>
              <p>📍 Nairobi, Kenya</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 SchoolBest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;