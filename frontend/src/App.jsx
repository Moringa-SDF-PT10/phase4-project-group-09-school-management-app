import  { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClassDetails from "./pages/ClassDetails";
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className='min-h-screen bg-gray-50' >
      <NavBar />
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace/>} />
          <Route path="/login" element={<Login />} />

          {/* Role Protected Routes */}
          <Route
          path="/dashboard"
          element={
            <protectedRoute allowedRoles={['admin', 'teacher', 'student']}>
              <Dashboard />
            </protectedRoute>
          }
          />
          <Route
          path="/classes/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
              <classDetails />
            </ProtectedRoute>
          }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>     
      </main>
    </div>
  )
}
