import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
  }, [API_URL]);

  // Fetch with automatic token refresh
  const fetchWithAuth = useCallback(async (url, options = {}) => {
    let token = localStorage.getItem('token');

    const headers = {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : ''
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const authOptions = {
      ...options,
      headers: headers,
      credentials: 'include'
    };

    let response = await fetch(url, authOptions);

    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        authOptions.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, authOptions);
      } else {
        navigate('/login');
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }, [API_URL, navigate, refreshAccessToken]);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const response = await fetchWithAuth(`${API_URL}/api/auth/profile`);

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [API_URL, fetchWithAuth]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

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
      const token = localStorage.getItem('token');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setUser(null);

      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
      }

      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  // Helper functions
  const isAuthenticated = () => {
    return user !== null && user !== undefined;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Context value
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