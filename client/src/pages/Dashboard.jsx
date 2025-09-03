import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import api from '../services/api.js'

const Dashboard = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    averageGrade: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [teacherStats, setTeacherStats] = useState({ total_students: 0, student_grades: [] });
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (currentUser.role === 'admin') {
          const response = await api.get('/dashboard/summary');
          setStats({
            totalClasses: response.data.total_classes,
            totalStudents: response.data.total_students,
            totalTeachers: response.data.total_teachers,
            averageGrade: response.data.average_grade
          });
          setRecentActivity(response.data.recent_activity);
        } else if (currentUser.role === 'student') {
          const res = await api.get('/enrollments/my-classes');
          setEnrolledClasses(res.data);
        } else if (currentUser.role === 'teacher') {
          const res = await api.get('/dashboard/teacher-summary');
          setTeacherStats(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setToastMessage('Could not load dashboard data.');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    setToastMessage('Logged out successfully!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const allQuickActions = [
    {
      title: 'Manage Classes',
      description: 'View, create, and edit classes',
      icon: '⚙️',
      link: '/classes',
      color: 'bg-orange-500',
      roles: ['admin']
    },
    {
      title: 'Add New Class',
      description: 'Create a new class with schedule and capacity',
      icon: '📚',
      link: '/class/add',
      color: 'bg-blue-500',
      roles: ['admin']
    },
    {
      title: 'Enroll Student',
      description: 'Enroll a student in an existing class',
      icon: '👨‍🎓',
      link: '/enroll-student',
      color: 'bg-green-500',
      roles: ['admin']
    },
    {
      title: 'User Management',
      description: 'Create, view, and manage all users',
      icon: '👥',
      link: '/user-management',
      color: 'bg-pink-500',
      roles: ['admin']
    },
    {
      title: 'Submit Grade',
      description: 'Record student grades and assignments',
      icon: '📊',
      link: '/submit-grade',
      color: 'bg-purple-500',
      roles: ['teacher']
    },
    {
      title: 'My Teaching Classes',
      description: 'View your assigned classes and manage grades',
      icon: '🏫',
      link: '/my-teaching-classes',
      color: 'bg-yellow-500',
      roles: ['teacher']
    },
    {
      title: 'Browse Classes',
      description: 'Find and enroll in new classes',
      icon: '📖',
      link: '/browse-classes',
      color: 'bg-teal-500',
      roles: ['student']
    },
    {
      title: 'My Classes',
      description: 'View your enrolled classes',
      icon: '🎓',
      link: '/my-classes',
      color: 'bg-indigo-500',
      roles: ['student']
    },
    {
      title: 'Change Password',
      description: 'Update your account password',
      icon: '🔐',
      link: '/change-password',
      color: 'bg-red-500',
      roles: ['admin', 'teacher', 'student']
    }
  ];

  const quickActions = allQuickActions.filter(action => action.roles.includes(currentUser?.role));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
              <p className="text-gray-600 mt-1">
                Welcome back, {currentUser?.name || 'User'} ({currentUser?.role || 'Unknown Role'})
              </p>
              {currentUser?.role === 'admin' && (
                <p className="text-gray-500 mt-1">You have full administrative access.</p>
              )}
              {currentUser?.role === 'teacher' && (
                <p className="text-gray-500 mt-1">You can manage your classes and grades.</p>
              )}
              {currentUser?.role === 'student' && (
                <p className="text-gray-500 mt-1">You can view your enrollments and grades.</p>
              )}
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
        
        {/* Quick Actions (FIXED emoji rendering) */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className={`${action.color} text-white rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200`}>
                    {/* Render emoji as span instead of component */}
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-200">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ... keep all your Stats, Teacher, Student, RecentActivity sections here unchanged ... */}

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
