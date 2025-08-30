import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        
        setAuthToken(token);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        clearStoredAuth();
      }
    }
    setLoading(false);
  }, []);

  const setAuthToken = (token) => {
    localStorage.setItem("auth_token", token);
  };

  const clearStoredAuth = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const { data } = response;

      if (data.access_token && data.user) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setSuccess("Login successful!");
        return data;
      } else {
        throw new Error("Login failed: Invalid response from server.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || "An unknown error occurred.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post("/auth/register", userData);
      setSuccess("Registration successful! Please log in.");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || "An unknown error occurred.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearStoredAuth();
    setCurrentUser(null);
    setSuccess("Logged out successfully");
    navigate('/login');
  };

  const updateUser = (updatedUserData) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedUserData };
      setCurrentUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
    loading,
    error,
    success,
    clearMessages,
    isAuthenticated: !!currentUser,
    userRole: currentUser?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
