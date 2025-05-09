import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/security/AuthProvider";

const HomePage = () => {
  const { isAuthenticated, isAdmin, isTeacher, isStudent, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>; // Show loading animation
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (isAdmin()) {
    return <Navigate to="/admin" />;
  } else if (isTeacher()) {
    return <Navigate to="/teacher" />;
  } else if (isStudent()) {
    return <Navigate to="/student" />;
  }

  return <Navigate to="/unauthorized" />;
};

export default HomePage;
