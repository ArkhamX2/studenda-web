import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../components/security/AuthProvider";

const RequireStudent = ({ children }) => {
  const { isAuthenticated, isStudent } = useAuth();

  if (!isAuthenticated() || !isStudent()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireStudent;
