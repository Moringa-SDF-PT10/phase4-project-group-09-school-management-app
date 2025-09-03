import React from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen bg-gray-50 px-4"
        role="status"
        aria-live="polite"
        aria-label="Loading authentication"
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-gray-600 text-sm font-medium">Loading your account information...</p>
          <p className="text-gray-500 text-xs mt-1">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;