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
  const [studentStats, setStudentStats] = useState({ total_classes: 0, overall_average_grade: 0, class_grades: [] });
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
          const res = await api.get('/dashboard/student-summary');
          setStudentStats(res.data);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, <span className="font-semibold">{currentUser?.username}</span> 
                <span className="bg-orange-100 text-orange-800 text-sm font-medium ml-3 px-2.5 py-0.5 rounded-full capitalize">
                  {currentUser?.role}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview (Admin Only) */}
        {currentUser?.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Link to="/classes" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Classes</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalClasses}</p>
                </div>
              </div>
            </Link>
            
            <Link to="/user-management?role=student" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </Link>
            
            <Link to="/user-management?role=teacher" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTeachers}</p>
                </div>
              </div>
            </Link>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
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
        )}

        {/* Teacher's Dashboard */}
        {currentUser?.role === 'teacher' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Teacher Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-semibold text-gray-900">{teacherStats.total_students}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Student Average Grades</h3>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teacherStats.student_grades.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.average_grade}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student's Dashboard */}
        {currentUser?.role === 'student' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-600">Total Enrolled Classes</p>
                <p className="text-3xl font-semibold text-gray-900">{studentStats.total_classes}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-600">Overall Average Grade</p>
                <p className="text-3xl font-semibold text-gray-900">{studentStats.overall_average_grade}%</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">My Grades</h3>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentStats.class_grades.map(grade => (
                    <tr key={grade.class_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.class_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grade.average_grade === 'N/A' ? 'N/A' : `${grade.average_grade}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-300"
              >
                <div className="text-center">
                  <div className={`${action.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-3xl">{action.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {currentUser?.role === 'admin' && recentActivity.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Latest Updates</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
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
                ))}
              </div>
            </div>
          </div>
        )}
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