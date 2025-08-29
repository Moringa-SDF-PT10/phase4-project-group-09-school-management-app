import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Login failed (${response.status})`);
      }

      const data = await response.json();

      if (!data.token || !data.user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      setAuthToken(data.token);
      
      setSuccess("Login successful! Redirecting...");
      
      setTimeout(() => {
        const redirectPath = data.user.role === 'admin' ? '/admin' : 
                           data.user.role === 'teacher' ? '/teacher' : '/student';
        navigate(redirectPath);
      }, 1000);
      
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Registration failed (${response.status})`);
      }

      const data = await response.json();

      setSuccess("Registration successful! Please log in.");
      
      if (data.token && data.user) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setAuthToken(data.token);
        
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate('/dashboard'), 1000);
      }
      
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

export const useAuthApi = () => {
  const { currentUser } = useAuth();

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("auth_token");
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = '/login';
      throw new Error("Authentication expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  };

  return { authFetch };
};