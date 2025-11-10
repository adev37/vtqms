import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, isAuthenticated, userRole, allowedRoles }) => {
  // Wait for role to load before showing anything
  if (userRole === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-blue-500 text-lg animate-pulse">Loading route...</p>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check allowedRoles (e.g., admin)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-red-500 text-xl font-bold">
          Unauthorized: Access Denied
        </p>
      </div>
    );
  }

  return element;
};

export default PrivateRoute;
