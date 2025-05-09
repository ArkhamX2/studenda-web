import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../components/security/AuthProvider";

const RequireTeacher = ({ children }) => {
  const { isAuthenticated, isTeacher } = useAuth();

  if (!isAuthenticated() || !isTeacher()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireTeacher;
