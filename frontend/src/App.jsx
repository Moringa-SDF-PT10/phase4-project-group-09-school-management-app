import  { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClassDetails from "./pages/ClassDetails";
import PrivateRoute from './components/PrivateRoute'

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
            <privateRoute allowedRoles={['admin', 'teacher', 'student']}>
              <Dashboard />
            </privateRoute>
          }
          />
          <Route
          path="/classes/:id"
          element={
            <PrivateRoute allowedRoles={['admin', 'teacher', 'student']}>
              <classDetails />
            </PrivateRoute>
          }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>     
      </main>
    </div>
  )
}
