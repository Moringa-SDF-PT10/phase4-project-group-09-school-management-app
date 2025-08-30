import React, { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setSuccess("Logged out successfully");
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    error,
    success,
    clearMessages,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
