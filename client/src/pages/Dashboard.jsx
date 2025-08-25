import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { useState } from 'react'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const handleLogout = () => {
    logout()
    setToastMessage('Logged out successfully!')
    setToastType('success')
    setShowToast(true)
    setTimeout(() => {
      navigate('/login')
    }, 1000)
  }

  const quickActions = [
    {
      title: 'Add New Class',
      description: 'Create a new class with schedule and capacity',
      icon: '📚',
      link: '/add-class',
      color: 'bg-blue-500'
    },
    {
      title: 'Enroll Student',
      description: 'Enroll a student in an existing class',
      icon: '👨‍🎓',
      link: '/enroll-student',
      color: 'bg-green-500'
    },
    {
      title: 'Submit Grade',
      description: 'Record student grades and assignments',
      icon: '📊',
      link: '/submit-grade',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage Classes',
      description: 'View and edit existing classes',
      icon: '⚙️',
      link: '/edit-class/1',
      color: 'bg-orange-500'
    }
  ]

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
                Welcome back, {user?.name || 'User'} ({user?.role || 'Unknown Role'})
              </p>
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
                <p className="text-2xl font-semibold text-gray-900">24</p>
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
                <p className="text-2xl font-semibold text-gray-900">156</p>
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
                <p className="text-2xl font-semibold text-gray-900">18</p>
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
                <p className="text-2xl font-semibold text-gray-900">85.2%</p>
              </div>
            </div>
          </div>
        </div>

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
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      New student enrolled in Mathematics 101
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-blue-500">📚</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      New class "Advanced Physics" created
                    </p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-purple-500">📊</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Grades submitted for Chemistry Lab
                    </p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
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