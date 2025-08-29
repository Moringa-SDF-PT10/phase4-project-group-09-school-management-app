import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast.jsx';
import { 
  ArrowRightIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleLogout = () => {
    logout();
    setToastMessage('Logged out successfully!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const quickActions = [
    {
      title: 'Add New Class',
      description: 'Create a new class with schedule and capacity',
      icon: BookOpenIcon,
      link: '/classes/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Enroll Student',
      description: 'Enroll a student in an existing class',
      icon: UserGroupIcon,
      link: '/enroll',
      color: 'bg-green-500'
    },
    {
      title: 'Submit Grade',
      description: 'Record student grades and assignments',
      icon: ChartBarIcon,
      link: '/grades/new',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage Classes',
      description: 'View and edit existing classes',
      icon: Cog6ToothIcon,
      link: '/classes',
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      type: 'enrollment',
      message: 'New student enrolled in Mathematics 101',
      time: '2 hours ago',
      icon: UserGroupIcon,
      color: 'text-green-500'
    },
    {
      type: 'class',
      message: 'New class "Advanced Physics" created',
      time: '1 day ago',
      icon: BookOpenIcon,
      color: 'text-blue-500'
    },
    {
      type: 'grade',
      message: 'Grades submitted for Chemistry Lab',
      time: '2 days ago',
      icon: ChartBarIcon,
      color: 'text-purple-500'
    }
  ];

  const stats = [
    {
      label: 'Total Classes',
      value: '24',
      icon: BookOpenIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Total Students',
      value: '156',
      icon: UserGroupIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Total Teachers',
      value: '18',
      icon: UserIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Avg. Grade',
      value: '85.2%',
      icon: ChartBarIcon,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                School Management Dashboard
              </h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <span>Welcome back, </span>
                <span className="font-medium text-gray-900 ml-1">{currentUser?.name}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{currentUser?.role}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center"
              >
                <ArrowRightIcon className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <Link 
              to="/classes" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all actions →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className={`${action.color} text-white rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <Link 
              to="/activity" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all activity →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Latest Updates</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${activity.color} bg-opacity-20`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default Dashboard;