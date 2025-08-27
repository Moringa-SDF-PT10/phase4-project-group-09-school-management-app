import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth()
    const location = useLocation()

    if (!user?.token) {
        // Not logged in
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not allowed
        return <Navigate to="/dashboard" replace />
    }
    return children
}