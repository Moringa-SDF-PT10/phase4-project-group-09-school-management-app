import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute