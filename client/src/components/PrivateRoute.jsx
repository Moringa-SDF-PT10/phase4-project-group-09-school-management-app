import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute