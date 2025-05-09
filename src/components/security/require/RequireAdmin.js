import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../components/security/AuthProvider";

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
