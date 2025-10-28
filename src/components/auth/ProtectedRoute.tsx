import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can show a loading spinner here while checking auth status
    return <div className="text-center py-20">Authenticating...</div>;
  }

  // First, check if user is logged in at all.
  if (!user) {
    // If not logged in, redirect to login page, saving the intended location.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route is admin-only and the logged-in user is not an admin, redirect to homepage.
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child component.
  return <>{children}</>;
};

export default ProtectedRoute;