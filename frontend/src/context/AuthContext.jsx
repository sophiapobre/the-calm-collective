import API_URL from '../config';
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          // Verify token is still valid by making a request to protected route
          const response = await axios.get('${API_URL}/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.data) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await axios.post('${API_URL}/api/auth/login', {
        email,
        password
      });

      const { token, user: userData } = response.data;

      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);

    // Notify the backend to invalidate the token server-side
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('${API_URL}/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(error => {
        console.error('Logout error:', error);
      });
    }
  };

  // Helper functions
  const isAuthenticated = () => {
    if (user === null || user === undefined) {
      return false;
    }
    
    return true;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Context value that will be provided to children
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};