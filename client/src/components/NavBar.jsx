import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-semibold text-blue-600">
                    <span className="text-xl">🏫</span>
                    <span>School Management</span>
                </Link>

                <nav className="flex items-center gap-4">
                    {currentUser ? (
                        <>
                            <Link to="/dashboard" className="text-sm hover:text-blue-600 transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/class/add" className="text-sm hover:text-blue-600 transition-colors">
                                Add Class
                            </Link>
                            <Link to="/enroll" className="text-sm hover:text-blue-600 transition-colors">
                                Enroll Student
                            </Link>
                            <Link to="/grade" className="text-sm hover:text-blue-600 transition-colors">
                                Submit Grade
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                                <span>🚪</span>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}
