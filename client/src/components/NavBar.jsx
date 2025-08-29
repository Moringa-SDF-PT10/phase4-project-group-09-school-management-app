import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  AcademicCapIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navigationItems = currentUser ? [
    { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { to: "/classes", label: "Classes", icon: BookOpenIcon },
    { to: "/students", label: "Students", icon: UserGroupIcon },
    { to: "/grades", label: "Grades", icon: ChartBarIcon },
  ] : [];

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         
          <Link 
            to={currentUser ? "/dashboard" : "/"} 
            className="flex items-center gap-3 font-semibold text-blue-700 hover:text-blue-800 transition-colors"
            onClick={closeMobileMenu}
          >
            <div className="bg-blue-100 p-2 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold hidden sm:block">Ustadi School Management</span>
            <span className="text-xl font-bold sm:hidden">USS</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {currentUser ? (
              <>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink 
                      key={item.to}
                      to={item.to}
                      isActive={isActiveLink(item.to)}
                      onClick={closeMobileMenu}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </NavLink>
                  );
                })}
                
                <div className="relative group ml-2">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <UserCircleIcon className="h-5 w-5" />
                      <span className="text-sm font-medium max-w-xs truncate" style={{ maxWidth: '120px' }}>
                        {currentUser.name}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      currentUser.role === 'teacher' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {currentUser.role}
                    </span>
                  </button>
                  
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={closeMobileMenu}
                      >
                        <UserCircleIcon className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={closeMobileMenu}
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="py-4 space-y-1">
              {currentUser ? (
                <>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <MobileNavLink 
                        key={item.to}
                        to={item.to}
                        isActive={isActiveLink(item.to)}
                        onClick={closeMobileMenu}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </MobileNavLink>
                    );
                  })}
                  
                  <div className="pt-4 border-t border-gray-200 px-4">
                    <div className="flex items-center space-x-3 py-2">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                        <p className={`text-xs ${
                          currentUser.role === 'admin' ? 'text-purple-600' :
                          currentUser.role === 'teacher' ? 'text-green-600' :
                          'text-blue-600'
                        }`}>
                          {currentUser.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <MobileNavLink to="/profile" onClick={closeMobileMenu}>
                    <UserCircleIcon className="h-5 w-5 mr-3" />
                    Profile
                  </MobileNavLink>
                  <MobileNavLink to="/settings" onClick={closeMobileMenu}>
                    <Cog6ToothIcon className="h-5 w-5 mr-3" />
                    Settings
                  </MobileNavLink>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" onClick={closeMobileMenu}>
                    Login
                  </MobileNavLink>
                  <MobileNavLink to="/register" onClick={closeMobileMenu}>
                    Register
                  </MobileNavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

const NavLink = ({ to, onClick, children, isActive = false }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
      isActive 
        ? 'text-blue-700 bg-blue-50 border border-blue-200' 
        : 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children, isActive = false }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 text-base font-medium transition-colors flex items-center ${
      isActive 
        ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-700' 
        : 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
    }`}
  >
    {children}
  </Link>
);