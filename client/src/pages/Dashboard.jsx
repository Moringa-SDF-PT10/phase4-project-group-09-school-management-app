import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
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
  const [teachingClasses, setTeachingClasses] = useState([])
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
          const res = await api.get('/classes/my-teaching-classes');
          setTeachingClasses(res.data.classes);
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
    logout()
    setToastMessage('Logged out successfully!')
    setToastType('success')
    setShowToast(true)
    setTimeout(() => {
      navigate('/login')
    }, 1000)
  }

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
      <header className="bg-white shadow-sm border-b">
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
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalClasses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTeachers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Grade</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageGrade}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher's Classes */}
        {currentUser?.role === 'teacher' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Teaching Classes</h2>
            {teachingClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachingClasses.map(cls => (
                  <div key={cls.id} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Schedule: {cls.schedule || 'TBA'}</p>
                      <p className="text-sm text-gray-500">Location: {cls.location || 'TBA'}</p>
                    </div>
                    <div className="mt-4">
                      <Link to={`/class/${cls.id}/grades`} className="btn-secondary w-full text-center">
                        Manage Grades
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">You are not assigned to any classes yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Student's Enrolled Classes */}
        {currentUser?.role === 'student' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Enrolled Classes</h2>
            {enrolledClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledClasses.map(enrollment => (
                  <div key={enrollment.enrollment_id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg text-gray-900">{enrollment.class.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Taught by: {enrollment.class.teacher?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mt-1">Schedule: {enrollment.class.schedule || 'TBA'}</p>
                    <p className={`mt-2 text-sm font-semibold ${enrollment.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                      Status: {enrollment.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">You are not enrolled in any classes yet.</p>
                <Link to="/browse-classes" className="btn-primary mt-4 inline-block">
                  Browse Classes
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="dashboard-grid">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="dashboard-card hover:shadow-lg transition-all duration-300"
              >
                <div className="text-center">
                  <div className={`${action.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-3xl">{action.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Latest Updates</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-green-500">✓</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-500">No recent activity.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

export default Dashboard