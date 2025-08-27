import React, { createContext, useContext, useState, useEffect } from "react";

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
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Server error - unable to process response");
      }

      if (!response.ok) {
        throw new Error(data?.message || `Login failed (${response.status})`);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      setSuccess("Login successful!");
      
      return data;
    } catch (err) {
      const errorMessage = err.name === 'TypeError' && err.message.includes('fetch')
        ? "Unable to connect to server. Please check your connection."
        : err.message;
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
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Server error - unable to process response");
      }

      if (!response.ok) {
        throw new Error(data?.message || `Registration failed (${response.status})`);
      }

      setSuccess("Registration successful! Please log in.");
      return data;
    } catch (err) {
      const errorMessage = err.name === 'TypeError' && err.message.includes('fetch')
        ? "Unable to connect to server. Please check your connection."
        : err.message;
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
