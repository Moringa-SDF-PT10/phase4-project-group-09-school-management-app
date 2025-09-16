import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/Dashboard";
import AddClass from "./pages/AddClass";
import EditClass from "./pages/EditClass";
import EnrollStudent from "./pages/EnrollStudent";
import SubmitGrade from "./pages/SubmitGrade";
import ClassList from "./pages/ClassList";
import ClassBrowser from "./pages/ClassBrowser";
import MyClasses from "./pages/MyClasses";
import MyTeachingClasses from "./pages/MyTeachingClasses";
import ManageGrades from "./pages/ManageGrades";
import ChangePassword from "./pages/ChangePassword";
import UserManagement from "./pages/UserManagement";
import PrivateRoute from "./components/PrivateRoute";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import ClassDetails from "./pages/ClassDetails";
import Features from "./pages/Features";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />
            
            {/* Public routes with layout */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="contact" element={<Contact />} />
              <Route path="features" element={<Features />} />
              <Route path="get-started" element={<GetStarted />} /> {/* Moved inside PublicLayout */}
            </Route>
            
            {/* Protected routes with PrivateRoute wrapper */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/class/add" element={
              <PrivateRoute>
                <AddClass />
              </PrivateRoute>
            } />
            <Route path="/class/edit/:id" element={
              <PrivateRoute>
                <EditClass />
              </PrivateRoute>
            } />
            <Route path="/enroll-student" element={
              <PrivateRoute>
                <EnrollStudent />
              </PrivateRoute>
            } />
            <Route path="/submit-grade" element={
              <PrivateRoute>
                <SubmitGrade />
              </PrivateRoute>
            } />
            <Route path="/classes" element={
              <PrivateRoute>
                <ClassList />
              </PrivateRoute>
            } />
            <Route path="/browse-classes" element={
              <PrivateRoute>
                <ClassBrowser />
              </PrivateRoute>
            } />
            <Route path="/my-classes" element={
              <PrivateRoute>
                <MyClasses />
              </PrivateRoute>
            } />
            <Route path="/my-teaching-classes" element={
              <PrivateRoute>
                <MyTeachingClasses />
              </PrivateRoute>
            } />
            <Route path="/class/:classId/grades" element={
              <PrivateRoute>
                <ManageGrades />
              </PrivateRoute>
            } />
            <Route path="/class/:id" element={
              <PrivateRoute>
                <ClassDetails />
              </PrivateRoute>
            } />
            <Route path="/change-password" element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            } />
            <Route path="/user-management" element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;