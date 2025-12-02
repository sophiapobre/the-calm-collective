import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include' // Send cookies with refresh token
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear auth state if refresh fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
  };

  // Fetch with automatic token refresh
  const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('token');

    // Prepare headers
    const headers = {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : ''
    };

    // Only add Content-Type if not sending FormData (FormData sets its own content type)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Add token to headers
    const authOptions = {
      ...options,
      headers: headers,
      credentials: 'include' // Include cookies for refresh token
    };

    let response = await fetch(url, authOptions);

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry request with new token
        authOptions.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, authOptions);
      } else {
        // Refresh failed, redirect to login
        navigate('/login');
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  };

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          // Verify token is still valid by making a request to protected route
          const response = await fetchWithAuth(`${API_URL}/api/auth/profile`);

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
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
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies for refresh token
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store access token and user data in localStorage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update state
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Get token before clearing
      const token = localStorage.getItem('token');
      
      // Clear localStorage first
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear state
      setUser(null);

      // Notify the backend to invalidate the refresh token
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Include cookies
        });
      }

      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend call fails, user is logged out locally
      navigate('/');
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

  // Context value that will be provided to children
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    fetchWithAuth,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};