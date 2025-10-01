import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    // Logged in but not admin
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  // All checks passed, render the protected component
  return children;
};

export default ProtectedRoute;