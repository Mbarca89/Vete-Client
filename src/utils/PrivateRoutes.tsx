import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean | undefined;
  children: React.ReactNode;

}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, children }) => {
  // Handle potential loading states (optional)
  if (typeof isAuthenticated === 'undefined') {
    return <div>Loading...</div>; // Or display a loading indicator
  }

  return (
    <Route>
      {isAuthenticated ? (
        <Outlet />
      ) : (
        <Navigate to="/login" replace />
      )}
    </Route>
  );
};

export default PrivateRoute;
